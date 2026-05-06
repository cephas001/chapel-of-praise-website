const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Import Routes
const adminAuthRoutes = require("./routes/admin/authRoutes");
const eventRoutes = require("./routes/admin/eventRoutes");
const adminHomepageRoutes = require("./routes/admin/homepageRoutes");
const adminLeadershipRoutes = require("./routes/admin/leadershipRoutes");
const adminMinistriesRoutes = require("./routes/admin/ministriesRoutes");
const adminGivingRoutes = require("./routes/admin/givingRoutes");
const adminAboutRoutes = require("./routes/admin/aboutRoutes");
const adminContactRoutes = require("./routes/admin/contactRoutes");
const adminPrayerRoutes = require("./routes/admin/prayerRoutes");
const adminCounselingRoutes = require("./routes/admin/counselingRoutes");
const publicHomepageRoutes = require("./routes/public/homepageRoutes");
const altarCallRoutes = require("./routes/admin/altarCallRoutes");
const headcountRoutes = require("./routes/admin/headcountRoutes");

// --- API ROUTES ---
app.use("/api/auth", adminAuthRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin/homepage", adminHomepageRoutes);
app.use("/api/admin/leadership", adminLeadershipRoutes);
app.use("/api/admin/ministries", adminMinistriesRoutes);
app.use("/api/admin/giving", adminGivingRoutes);
app.use("/api/admin/about", adminAboutRoutes);
app.use("/api/admin/contact", adminContactRoutes);
app.use("/api/admin/prayer", adminPrayerRoutes);
app.use("/api/admin/counseling", adminCounselingRoutes);
app.use("/api/public/homepage", publicHomepageRoutes);
app.use("/api/altar-calls", altarCallRoutes);
app.use("/api/headcounts", headcountRoutes);

// Mount API Routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Chapel of Praise API running on port ${PORT}`);
});
