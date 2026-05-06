const { db } = require("../config/firebase");

// @desc    Get prayer settings
// @route   GET /api/public/prayer or /api/admin/prayer
exports.getPrayerSettings = async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("prayer");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(200).json({});
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Error getting prayer settings:", error);
    res.status(500).json({ message: "Failed to fetch prayer settings" });
  }
};

// @desc    Update prayer settings
// @route   PUT /api/admin/prayer (admin only)
exports.updatePrayerSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    
    const docRef = db.collection("settings").doc("prayer");
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
    console.error("Error updating prayer settings:", error);
    res.status(500).json({ message: "Failed to update prayer settings" });
  }
};
