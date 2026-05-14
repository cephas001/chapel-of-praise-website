const { db } = require("../config/firebase");

// @desc    Get about settings
// @route   GET /api/admin/about (both public and admin)
exports.getAboutSettings = async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("about");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting about settings:", error);
    res.status(500).json({ message: "Failed to fetch about settings" });
  }
};

// @desc    Update about settings
// @route   PUT /api/admin/about (admin only)
exports.updateAboutSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    
    const docRef = db.collection("settings").doc("about");
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
    console.error("Error updating about settings:", error);
    res.status(500).json({ message: "Failed to update about settings" });
  }
};
