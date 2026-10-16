// backend/routes/admin/chapelUnitRoutes.js
// Manages the chapelUnits collection (unit names + worker registration passkeys).
// Doc ID = unit name (e.g. "Bible Study"), which members.chapelUnit references.
const express = require("express");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireSuperAdmin,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

const UNITS_COLLECTION = "chapelUnits";

router.use(verifyToken);
router.use(requireStaticTypeAccess(["executive"]));

// List all chapel units. Passkeys are secrets, so they are only returned to
// super admins; everyone else just gets names/status.
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection(UNITS_COLLECTION).get();

    const units = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const unit = {
        name: data.name || doc.id,
        active: data.active !== false,
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      };

      if (req.user.role === "super_admin") {
        unit.passkey = data.passkey || "";
      }

      units.push(unit);
    });

    units.sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json(units);
  } catch (error) {
    console.error("Error fetching chapel units:", error);
    res.status(500).json({ error: "Failed to fetch chapel units." });
  }
});

// Create a chapel unit (super admin only)
router.post("/", requireSuperAdmin, async (req, res) => {
  try {
    const { name, passkey, active = true } = req.body;

    if (typeof name !== "string" || !name.trim() || !passkey) {
      return res
        .status(400)
        .json({ error: "Unit name and passkey are required." });
    }

    const trimmedName = name.trim();
    const docRef = db.collection(UNITS_COLLECTION).doc(trimmedName);
    const doc = await docRef.get();

    if (doc.exists) {
      return res.status(409).json({ error: "This unit already exists." });
    }

    const payload = {
      name: trimmedName,
      passkey: String(passkey),
      active: active !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
    };

    await docRef.set(payload);

    res.status(201).json({
      message: "Chapel unit created successfully.",
      data: payload,
    });
  } catch (error) {
    console.error("Error creating chapel unit:", error);
    res.status(500).json({ error: "Failed to create chapel unit." });
  }
});

// Update a unit's passkey and/or active flag (super admin only).
// Renaming is intentionally unsupported: members store the unit name as text.
router.put("/:unitName", requireSuperAdmin, async (req, res) => {
  try {
    const { unitName } = req.params;
    const { passkey, active } = req.body;

    const docRef = db.collection(UNITS_COLLECTION).doc(unitName);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Chapel unit not found." });
    }

    const updates = {
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
    };

    if (typeof passkey === "string" && passkey.length > 0) {
      updates.passkey = passkey;
    }
    if (typeof active === "boolean") {
      updates.active = active;
    }

    await docRef.update(updates);

    res.status(200).json({
      message: "Chapel unit updated successfully.",
      data: { ...doc.data(), ...updates },
    });
  } catch (error) {
    console.error("Error updating chapel unit:", error);
    res.status(500).json({ error: "Failed to update chapel unit." });
  }
});

// Delete a chapel unit (super admin only)
router.delete("/:unitName", requireSuperAdmin, async (req, res) => {
  try {
    const { unitName } = req.params;
    const docRef = db.collection(UNITS_COLLECTION).doc(unitName);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Chapel unit not found." });
    }

    await docRef.delete();

    res.status(200).json({ message: "Chapel unit deleted successfully." });
  } catch (error) {
    console.error("Error deleting chapel unit:", error);
    res.status(500).json({ error: "Failed to delete chapel unit." });
  }
});

module.exports = router;
