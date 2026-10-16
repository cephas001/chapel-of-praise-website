// backend/routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const { registrationLimiter } = require("../../middleware/rateLimiters");
const { pickWritableFields } = require("../../utils/payload");

// Client-writable fields only; server-managed fields (memberType, timestamps)
// can never be set or overwritten by the request body.
const WORKER_WRITABLE_FIELDS = [
  "name",
  "gender",
  "dateOfBirth",
  "phoneNumber",
  "whatsappPhoneNumber",
  "emailAddress",
  "matricNumber",
  "level",
  "schoolDepartment",
  "chapelUnit",
  "relationshipStatus",
];

// ==========================================
// PUBLIC ROUTES
// ==========================================
// Used by the main frontend website (chapelpraise.com)

// List active chapel units for the registration form (names only, no passkeys)
router.get("/units", async (req, res) => {
  try {
    const snapshot = await db.collection("chapelUnits").get();

    const units = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.active !== false) {
        units.push(data.name || doc.id);
      }
    });

    units.sort((a, b) => a.localeCompare(b));

    res.status(200).json(units);
  } catch (error) {
    console.error("Error fetching chapel units:", error);
    res.status(500).json({ error: "Failed to fetch chapel units." });
  }
});

router.post("/register-worker", registrationLimiter, async (req, res) => {
  try {
    const { passkey, ...memberData } = req.body;

    if (!passkey || !memberData.chapelUnit) {
      return res
        .status(400)
        .json({ error: "Chapel unit and passkey are required." });
    }

    if (typeof memberData.name !== "string" || !memberData.name.trim()) {
      return res.status(400).json({ error: "Full name is required." });
    }

    // Resolve the expected passkey from chapelUnits, falling back to the
    // legacy unitPasskeys collection until the seed script has been run.
    const unitDoc = await db
      .collection("chapelUnits")
      .doc(memberData.chapelUnit)
      .get();

    let expectedPasskey = null;

    if (unitDoc.exists) {
      const unitData = unitDoc.data();

      if (unitData.active === false) {
        return res
          .status(403)
          .json({ error: "Registration for this unit is currently closed." });
      }

      expectedPasskey = unitData.passkey;
    } else {
      const legacyDoc = await db
        .collection("unitPasskeys")
        .doc(memberData.chapelUnit)
        .get();

      if (legacyDoc.exists) {
        expectedPasskey = legacyDoc.data().key;
      }
    }

    if (!expectedPasskey || passkey !== expectedPasskey) {
      return res
        .status(403)
        .json({ error: "Invalid passkey for the selected unit." });
    }

    const newWorker = {
      ...pickWritableFields(memberData, WORKER_WRITABLE_FIELDS),
      memberType: "WORKER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("members").add(newWorker);

    res.status(201).json({
      message: "Worker successfully registered.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Error registering worker:", error);
    res.status(500).json({ error: "Failed to register worker." });
  }
});

module.exports = router;
