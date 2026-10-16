// backend/scripts/seedChapelUnits.js
// One-time (idempotent) migration that creates the chapelUnits collection:
//   - Reuses passkeys from legacy unitPasskeys/{unit} docs when present.
//   - Generates a random passkey for units that don't have one yet.
// Run from the backend folder with: npm run seed:units
const crypto = require("crypto");
const { db } = require("../config/firebase");

const DEFAULT_UNITS = [
  "Choir",
  "Editorial",
  "Ushering",
  "Protocol",
  "Media",
  "Prayer",
  "Drama",
  "Bible Study",
  "Evangelism",
  "Technical",
  "Welfare",
  "Academic",
];

const generatePasskey = () => crypto.randomBytes(4).toString("hex").toUpperCase();

async function seedChapelUnits() {
  let generated = 0;
  let reused = 0;
  let skipped = 0;

  for (const unit of DEFAULT_UNITS) {
    const unitRef = db.collection("chapelUnits").doc(unit);
    const existing = await unitRef.get();

    if (existing.exists) {
      console.log(`- ${unit}: already exists, skipped`);
      skipped += 1;
      continue;
    }

    const legacyDoc = await db.collection("unitPasskeys").doc(unit).get();
    let passkey;
    let source;

    if (legacyDoc.exists && legacyDoc.data().key) {
      passkey = legacyDoc.data().key;
      source = "reused legacy passkey";
      reused += 1;
    } else {
      passkey = generatePasskey();
      source = "generated passkey";
      generated += 1;
    }

    await unitRef.set({
      name: unit,
      passkey,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: "seed-script",
    });

    console.log(`- ${unit}: created (${source}: ${passkey})`);
  }

  console.log(
    `\nDone. Created with reused passkey: ${reused}, created with generated passkey: ${generated}, skipped: ${skipped}.`,
  );
}

seedChapelUnits()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding chapelUnits failed:", error);
    process.exit(1);
  });
