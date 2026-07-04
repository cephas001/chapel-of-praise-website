const express = require("express");
const router = express.Router();
const crypto = require("crypto"); // Needed to generate unique IDs for array items
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

router.use(verifyToken);

// ==========================================
// GET ALL: Retrieve all categories and links
// ==========================================
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("dashboardLinks").get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching dashboard links:", error);
    res.status(500).json({ error: "Failed to fetch dashboard links" });
  }
});

// ==========================================
// CATEGORY CRUD
// ==========================================

// Create a Category
router.post("/category", async (req, res) => {
  try {
    // Accepting 'title' or 'name' to ensure frontend compatibility
    const title = req.body.title || req.body.name;

    if (!title) {
      return res.status(400).json({ error: "Category title is required" });
    }

    const docRef = await db
      .collection("dashboardLinks")
      .add({ title: title, links: [] });

    res.status(201).json({
      message: "Dashboard link category created successfully",
      category: { id: docRef.id, title: title, links: [] },
    });
  } catch (error) {
    console.error("Error creating dashboard link category:", error);
    res.status(500).json({ error: "Failed to create dashboard link category" });
  }
});

// Update a Category (e.g., rename it)
router.put("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Category title is required" });
    }

    await db.collection("dashboardLinks").doc(categoryId).update({ title });

    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// Delete a Category
router.delete("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    await db.collection("dashboardLinks").doc(categoryId).delete();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ==========================================
// LINK CRUD (Nested inside Category Array)
// ==========================================

// Add a Link to a Category
router.post("/link", async (req, res) => {
  try {
    // Accepting categoryId or sectionId to match your frontend props
    const targetId = req.body.categoryId || req.body.sectionId;
    const { label, url } = req.body;

    if (!targetId || !label || !url) {
      return res
        .status(400)
        .json({ error: "Missing required fields (categoryId, label, url)" });
    }

    const categoryRef = db.collection("dashboardLinks").doc(targetId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ error: "Category not found" });
    }

    const currentLinks = categoryDoc.data().links || [];
    const newLink = {
      id: crypto.randomUUID(),
      label,
      url,
    };

    // Update the document by pushing the new link to the array
    await categoryRef.update({
      links: [...currentLinks, newLink],
    });

    res.status(201).json({
      message: "Dashboard link created successfully",
      link: newLink,
    });
  } catch (error) {
    console.error("Error creating dashboard link:", error);
    res.status(500).json({ error: "Failed to create dashboard link" });
  }
});

// Update a specific Link
router.put("/:categoryId/:linkId", async (req, res) => {
  try {
    const { categoryId, linkId } = req.params;
    const { label, url } = req.body;

    const categoryRef = db.collection("dashboardLinks").doc(categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ error: "Category not found" });
    }

    const links = categoryDoc.data().links || [];
    const linkIndex = links.findIndex((l) => l.id === linkId);

    if (linkIndex === -1) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Update the specific link properties
    if (label) links[linkIndex].label = label;
    if (url) links[linkIndex].url = url;

    // Save the modified array back to Firestore
    await categoryRef.update({ links });

    res.status(200).json({
      message: "Link updated successfully",
      link: links[linkIndex],
    });
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ error: "Failed to update link" });
  }
});

// Delete a specific Link
router.delete("/:categoryId/:linkId", async (req, res) => {
  try {
    const { categoryId, linkId } = req.params;

    const categoryRef = db.collection("dashboardLinks").doc(categoryId);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return res.status(404).json({ error: "Category not found" });
    }

    const currentLinks = categoryDoc.data().links || [];
    const updatedLinks = currentLinks.filter((l) => l.id !== linkId);

    // Save the array back without the deleted link
    await categoryRef.update({ links: updatedLinks });

    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ error: "Failed to delete link" });
  }
});

module.exports = router;
