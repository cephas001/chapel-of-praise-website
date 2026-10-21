const encodeCursor = (value) =>
  Buffer.from(JSON.stringify(value), "utf8").toString("base64url");

const decodeCursor = (value) => {
  if (typeof value !== "string" || !value) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    );

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

module.exports = {
  encodeCursor,
  decodeCursor,
};
