const { db } = require("../config/firebase");

// @desc    Get counseling settings
// @route   GET /api/admin/counseling
exports.getCounselingSettings = async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("counseling");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting counseling settings:", error);
    res.status(500).json({ message: "Failed to fetch counseling settings" });
  }
};

// @desc    Update counseling settings
// @route   PUT /api/admin/counseling
exports.updateCounselingSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    
    const docRef = db.collection("settings").doc("counseling");
    const doc = await docRef.get();

    const dataToSave = {
      ...settingsData,
      updatedAt: new Date().toISOString(),
    };

    if (req.user && req.user.uid) {
        dataToSave.updatedBy = req.user.uid;
    }

    if (!doc.exists) {
        dataToSave.createdAt = new Date().toISOString();
        await docRef.set(dataToSave);
    } else {
        await docRef.update(dataToSave);
    }

    res.status(200).json(dataToSave);
  } catch (error) {
    console.error("Error updating counseling settings:", error);
    res.status(500).json({ message: "Failed to update counseling settings" });
  }
};