const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- Route Imports --------------------
// Admin Routes
const adminAuthRoutes = require("./routes/admin/authRoutes");
const eventRoutes = require("./routes/admin/eventRoutes");
const adminHomepageRoutes = require("./routes/admin/homepageRoutes");
const adminLeadershipRoutes = require("./routes/admin/leadershipRoutes");
const adminMinistriesRoutes = require("./routes/admin/ministriesRoutes");
const adminGivingRoutes = require("./routes/admin/givingRoutes");
const adminAboutRoutes = require("./routes/admin/aboutRoutes");
const adminContactRoutes = require("./routes/admin/contactRoutes");
const adminPrayerRoutes = require("./routes/admin/prayerRoutes");
const adminCounsellingRoutes = require("./routes/admin/counsellingRoutes");
const adminAltarCallRoutes = require("./routes/admin/altarCallRoutes");
const adminHeadcountRoutes = require("./routes/admin/headcountRoutes");
const adminMemberRoutes = require("./routes/admin/memberRoutes");
const adminEventAttendanceRoutes = require("./routes/admin/eventAttendanceRoutes");
const adminFollowUpRoutes = require("./routes/admin/followUpRoutes");
const adminDashboardLinksRoutes = require("./routes/admin/dashboardLinksRoutes");
const adminEventsCalendarRoutes = require("./routes/admin/eventsCalendarRoutes");

// Public Routes
const publicHomepageRoutes = require("./routes/public/homepageRoutes");
const publicAboutRoutes = require("./routes/public/aboutRoutes");
const publicContactRoutes = require("./routes/public/contactRoutes");
const publicLeadershipRoutes = require("./routes/public/leadershipRoutes");
const publicMinistriesRoutes = require("./routes/public/ministriesRoutes");
const publicGivingRoutes = require("./routes/public/givingRoutes");
const publicPrayerRoutes = require("./routes/public/prayerRoutes");
const publiccounsellingRoutes = require("./routes/public/counsellingRoutes");
const publicMemberRoutes = require("./routes/public/memberRoutes");
const publicEventsCalendarRoutes = require("./routes/public/eventsCalendarRoutes");

// -------------------- API Routes --------------------
// Admin APIs
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/events", eventRoutes);
app.use("/api/admin/homepage", adminHomepageRoutes);
app.use("/api/admin/leadership", adminLeadershipRoutes);
app.use("/api/admin/ministries", adminMinistriesRoutes);
app.use("/api/admin/giving", adminGivingRoutes);
app.use("/api/admin/about", adminAboutRoutes);
app.use("/api/admin/contact", adminContactRoutes);
app.use("/api/admin/prayer", adminPrayerRoutes);
app.use("/api/admin/counselling", adminCounsellingRoutes);
app.use("/api/admin/altar-calls", adminAltarCallRoutes);
app.use("/api/admin/headcounts", adminHeadcountRoutes);
app.use("/api/admin/members", adminMemberRoutes);
app.use("/api/admin/event-attendance", adminEventAttendanceRoutes);
app.use("/api/admin/follow-ups", adminFollowUpRoutes);
app.use("/api/admin/dashboard-links", adminDashboardLinksRoutes);
app.use("/api/admin/events-calendar", adminEventsCalendarRoutes);

// Public APIs
app.use("/api/public/homepage", publicHomepageRoutes);
app.use("/api/public/about", publicAboutRoutes);
app.use("/api/public/contact", publicContactRoutes);
app.use("/api/public/leadership", publicLeadershipRoutes);
app.use("/api/public/ministries", publicMinistriesRoutes);
app.use("/api/public/giving", publicGivingRoutes);
app.use("/api/public/prayer", publicPrayerRoutes);
app.use("/api/public/counselling", publiccounsellingRoutes);
app.use("/api/members", publicMemberRoutes); // Worker registration
app.use("/api/public/events-calendar", publicEventsCalendarRoutes);

// -------------------- Server Startup --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Chapel of Praise API running on port ${PORT}`);
});
