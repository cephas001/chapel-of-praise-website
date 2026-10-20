export const MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MEDIA_MAX_BYTES = 8 * 1024 * 1024;
export const MEDIA_ACCEPT = MEDIA_TYPES.join(",");

const acceptedTypes = new Set(MEDIA_TYPES);

export const validateMediaFile = (file) => {
  if (!file) return "Choose an image to upload.";

  const name = file.name || "That file";

  if (!acceptedTypes.has(file.type)) {
    return `${name} must be a JPG, PNG, WEBP, or GIF.`;
  }

  if (file.size > MEDIA_MAX_BYTES) {
    return `${name} must be 8 MB or smaller.`;
  }

  return "";
};

export const formatFileSize = (bytes = 0) => {
  const size = Number(bytes);

  if (!Number.isFinite(size) || size <= 0) return "0 KB";
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const isValidImageUrl = (value) => {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
