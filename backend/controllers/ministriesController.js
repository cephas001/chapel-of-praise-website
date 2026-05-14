const { db } = require("../config/firebase");

// @desc    Get ministries settings
// @route   GET /api/ministries (both public and admin)
exports.getMinistriesSettings = async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("ministries");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting ministries settings:", error);
    res.status(500).json({ message: "Failed to fetch ministries settings" });
  }
};

// @desc    Update ministries settings
// @route   PUT /api/admin/ministries (admin only)
exports.updateMinistriesSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    
    const docRef = db.collection("settings").doc("ministries");
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
    console.error("Error updating ministries settings:", error);
    res.status(500).json({ message: "Failed to update ministries settings" });
  }
};
