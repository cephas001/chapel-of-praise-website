const express = require("express");
const compression = require("compression");
const cors = require("cors");
require("dotenv").config();

const { apiLimiter } = require("./middleware/rateLimiters");

const app = express();

// Behind a reverse proxy (Render/Railway/Nginx), trust the first hop so
// rate limiters and logs see the real client IP instead of the proxy's.
app.set("trust proxy", 1);

// CORS Configuration
// Origins are read from the environment (comma-separated for multiples).
// Local development origins are only allowed when NODE_ENV is not production.
const parseOrigins = (value) =>
  (value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
  ...parseOrigins(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.ADMIN_FRONTEND_URL),
  ...(isProduction
    ? []
    : ["http://localhost:3000", "http://localhost:3001"]),
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(compression());
app.use(cors(corsOptions));
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true }));

// Broad rate limit for every API route (tighter limits are applied on
// sensitive routes such as login and registration).
app.use("/api", apiLimiter);

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
const adminUnitMeetingRoutes = require("./routes/admin/unitMeetingRoutes");
const adminChapelUnitRoutes = require("./routes/admin/chapelUnitRoutes");
const adminMediaRoutes = require("./routes/admin/mediaRoutes");
const adminDashboardRoutes = require("./routes/admin/dashboardRoutes");

// Public Routes
const publicHomepageRoutes = require("./routes/public/homepageRoutes");
const publicAboutRoutes = require("./routes/public/aboutRoutes");
const publicAcademicHubRoutes = require("./routes/public/academicHubRoutes");
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
app.use("/api/admin/unit-meetings", adminUnitMeetingRoutes);
app.use("/api/admin/chapel-units", adminChapelUnitRoutes);
app.use("/api/admin/media", adminMediaRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Public APIs
app.use("/api/public/homepage", publicHomepageRoutes);
app.use("/api/public/about", publicAboutRoutes);
app.use("/api/public/academic-hub", publicAcademicHubRoutes);
app.use("/api/public/contact", publicContactRoutes);
app.use("/api/public/leadership", publicLeadershipRoutes);
app.use("/api/public/ministries", publicMinistriesRoutes);
app.use("/api/public/giving", publicGivingRoutes);
app.use("/api/public/prayer", publicPrayerRoutes);
app.use("/api/public/counselling", publiccounsellingRoutes);
app.use("/api/members", publicMemberRoutes); // Worker registration
app.use("/api/public/events-calendar", publicEventsCalendarRoutes);

// -------------------- 404 + Global Error Handling --------------------
// Unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Central error handler. Express 5 forwards both sync throws and rejected
// promises here, so routes can stay focused on their happy path.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON payload." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Payload too large." });
  }

  console.error("Unhandled error:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
});

// -------------------- Server Startup --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Chapel of Praise API running on port ${PORT}`);
});
