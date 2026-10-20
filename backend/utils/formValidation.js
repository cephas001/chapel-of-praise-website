// Shared helpers for public form submissions.

// Coerces to a trimmed string and caps the length so callers cannot write
// unbounded payloads to Firestore.
const cleanString = (value, maxLength = 500) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const isValidEmail = (value) =>
  value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// The hidden honeypot field is only ever filled in by bots. Genuine
// submissions are quietly accepted so bots cannot learn they were blocked.
const isSpamSubmission = (body) =>
  Boolean(body && typeof body.website === "string" && body.website.trim());

module.exports = { cleanString, isValidEmail, isSpamSubmission };
