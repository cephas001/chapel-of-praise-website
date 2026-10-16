// backend/middleware/rateLimiters.js
const rateLimit = require("express-rate-limit");

const buildLimiter = ({ windowMs, limit, message }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
  });

// Broad safety net for all API traffic
const apiLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  message: "Too many requests. Please try again later.",
});

// Login sync: slows down credential/token probing
const loginLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: "Too many login attempts. Please try again in 15 minutes.",
});

// Worker registration: the passkey is a shared secret, so keep this strict
// to make brute-force guessing impractical
const registrationLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: "Too many registration attempts. Please try again in an hour.",
});

module.exports = { apiLimiter, loginLimiter, registrationLimiter };
