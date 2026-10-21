const { db, auth, admin } = require("../config/firebase");

const PAGE_SIZE = 200;
const VALID_ROLES = ["admin", "super_admin"];
const VALID_TYPES = ["website", "executive", "all"];
const DRY_RUN = process.argv.includes("--dry-run");

const stats = {
  updated: 0,
  unchanged: 0,
  skipped: 0,
  failed: 0,
};

async function migrateUser(doc) {
  const data = doc.data() || {};
  const uid = doc.id;

  let userRecord;
  try {
    userRecord = await auth.getUser(uid);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      stats.skipped += 1;
      console.warn(`- ${uid}: no matching Firebase Auth user, skipped`);
      return;
    }

    stats.failed += 1;
    console.error(`- ${uid}: failed to read Auth user (${error.message})`);
    return;
  }

  const existingClaims = userRecord.customClaims || {};
  const role = VALID_ROLES.includes(data.role) ? data.role : existingClaims.role;
  const type = VALID_TYPES.includes(data.type) ? data.type : existingClaims.type;

  if (!role && !type) {
    stats.skipped += 1;
    console.warn(`- ${uid}: no valid role/type found, skipped`);
    return;
  }

  if (role === existingClaims.role && type === existingClaims.type) {
    stats.unchanged += 1;
    return;
  }

  const nextClaims = { ...existingClaims };
  if (role) nextClaims.role = role;
  if (type) nextClaims.type = type;

  if (DRY_RUN) {
    stats.updated += 1;
    console.log(`- ${uid}: would set role=${role || "-"} type=${type || "-"}`);
    return;
  }

  try {
    await auth.setCustomUserClaims(uid, nextClaims);
    stats.updated += 1;
    console.log(`- ${uid}: set role=${role || "-"} type=${type || "-"}`);
  } catch (error) {
    stats.failed += 1;
    console.error(`- ${uid}: failed to set claims (${error.message})`);
  }
}

async function migrateUserClaims() {
  const users = db.collection("users");
  let lastDoc = null;

  while (true) {
    let query = users
      .orderBy(admin.firestore.FieldPath.documentId())
      .limit(PAGE_SIZE);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();

    if (snapshot.empty) break;

    for (const doc of snapshot.docs) {
      await migrateUser(doc);
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1];

    if (snapshot.size < PAGE_SIZE) break;
  }

  console.log(
    `\n${DRY_RUN ? "Dry run" : "Migration"} complete. Updated: ${
      stats.updated
    }, unchanged: ${stats.unchanged}, skipped: ${stats.skipped}, failed: ${
      stats.failed
    }.`,
  );

  if (stats.failed > 0) {
    process.exitCode = 1;
  }
}

migrateUserClaims().catch((error) => {
  console.error("User claims migration failed:", error);
  process.exitCode = 1;
});
