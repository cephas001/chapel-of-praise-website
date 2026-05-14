const { db } = require("../config/firebase");

// @desc    Get giving settings
// @route   GET /api/giving (both public and admin)
exports.getGivingSettings = async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("giving");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting giving settings:", error);
    res.status(500).json({ message: "Failed to fetch giving settings" });
  }
};

// @desc    Update giving settings
// @route   PUT /api/admin/giving (admin only)
exports.updateGivingSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    
    const docRef = db.collection("settings").doc("giving");
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
    console.error("Error updating giving settings:", error);
    res.status(500).json({ message: "Failed to update giving settings" });
  }
};