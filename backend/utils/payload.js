// backend/utils/payload.js

// Copies only the allowed keys from a client payload. Prevents callers from
// overwriting server-managed fields (creatorId, createdAt, role, memberType, ...).
const pickWritableFields = (body, allowedFields) => {
  const source = body && typeof body === "object" ? body : {};

  return allowedFields.reduce((acc, field) => {
    if (source[field] !== undefined) acc[field] = source[field];
    return acc;
  }, {});
};

// Coerces a value to a non-negative integer (defaults to 0)
const toNonNegativeInt = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? Math.floor(num) : 0;
};

module.exports = { pickWritableFields, toNonNegativeInt };
