const { db } = require("../config/firebase");

// @desc    Get leadership settings
// @route   GET /api/leadership (both public and admin)
exports.getLeadershipSettings = async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("leadership");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting leadership settings:", error);
    res.status(500).json({ message: "Failed to fetch leadership settings" });
  }
};

// @desc    Update leadership settings
// @route   PUT /api/admin/leadership (admin only)
exports.updateLeadershipSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    
    const docRef = db.collection("settings").doc("leadership");
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
    console.error("Error updating leadership settings:", error);
    res.status(500).json({ message: "Failed to update leadership settings" });
  }
};
