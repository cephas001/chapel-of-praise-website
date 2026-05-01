const { db } = require("../config/firebase");

// @desc    Get homepage settings
// @route   GET /api/homepage (both public and admin)
exports.getHomepageSettings = async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("homepage");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting homepage settings:", error);
    res.status(500).json({ message: "Failed to fetch homepage settings" });
  }
};

// @desc    Update homepage settings
// @route   PUT /api/homepage (admin only)
exports.updateHomepageSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    
    const docRef = db.collection("settings").doc("homepage");
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
    console.error("Error updating homepage settings:", error);
    res.status(500).json({ message: "Failed to update homepage settings" });
  }
};
