const crypto = require("crypto");
const express = require("express");
const { put, del } = require("@vercel/blob");
const router = express.Router();
const { db } = require("../../config/firebase");
const {
  verifyToken,
  requireStaticTypeAccess,
} = require("../../middleware/auth");

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

router.use(verifyToken);
router.use(requireStaticTypeAccess(["website"]));

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("websiteMedia").orderBy("createdAt", "desc").get();
    res.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    console.error("Error fetching website media:", error);
    res.status(500).json({ message: "Failed to fetch uploaded images" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, type, data, url: imageUrl } = req.body;

    // Add-by-URL: store the remote link directly so images can be added
    // even when file uploads are unavailable.
    if (!data && imageUrl) {
      let parsed;
      try {
        parsed = new URL(imageUrl);
      } catch {
        return res.status(400).json({ message: "Enter a valid image URL." });
      }
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return res
          .status(400)
          .json({ message: "Image URLs must start with http:// or https://." });
      }

      const media = {
        name: String(
          name || imageUrl.split("/").pop() || "External image",
        ).slice(0, 120),
        type: "image/url",
        size: 0,
        url: imageUrl,
        storagePath: null,
        storageProvider: "external",
        createdAt: new Date().toISOString(),
        createdBy: req.user.uid,
      };
      const doc = await db.collection("websiteMedia").add(media);
      return res.status(201).json({ id: doc.id, ...media });
    }

    if (!name || !data || !allowedTypes.has(type)) {
      return res.status(400).json({ message: "Please choose a JPG, PNG, WEBP, or GIF image." });
    }

    const buffer = Buffer.from(data, "base64");
    if (!buffer.length || buffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ message: "Images must be 8 MB or smaller." });
    }

    const extension = type.split("/")[1] === "jpeg" ? "jpg" : type.split("/")[1];
    const safeName =
      name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/\.[^.]+$/, "")
        .slice(0, 80) || "image";
    const pathname = `website-media/${Date.now()}-${crypto.randomUUID()}-${safeName}.${extension}`;

    const blob = await put(pathname, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: type,
    });

    const media = {
      name,
      type,
      size: buffer.length,
      url: blob.url,
      storagePath: blob.pathname,
      storageProvider: "vercel-blob",
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid,
    };
    const doc = await db.collection("websiteMedia").add(media);
    res.status(201).json({ id: doc.id, ...media });
  } catch (error) {
    console.error("Error uploading website media:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ref = db.collection("websiteMedia").doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: "Image not found" });

    const media = doc.data();
    const isBlobUrl =
      typeof media.url === "string" &&
      /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//i.test(media.url);

    if (media.storageProvider === "vercel-blob" || isBlobUrl) {
      await del(media.url);
    }

    await ref.delete();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting website media:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
});

module.exports = router;
