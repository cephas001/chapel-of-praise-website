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
const publicHomepageRoutes = require("./routes/public/homepageRoutes");
const altarCallRoutes = require("./routes/admin/altarCallRoutes");
const headcountRoutes = require("./routes/admin/headcountRoutes");

// --- API ROUTES ---
app.use("/api/auth", adminAuthRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin/homepage", adminHomepageRoutes);
app.use("/api/public/homepage", publicHomepageRoutes);
app.use("/api/altar-calls", altarCallRoutes);
app.use("/api/headcounts", headcountRoutes);

// Mount API Routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Chapel of Praise API running on port ${PORT}`);
});
