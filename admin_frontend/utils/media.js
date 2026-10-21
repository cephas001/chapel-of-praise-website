export const MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MEDIA_MAX_BYTES = 8 * 1024 * 1024;
export const MEDIA_ACCEPT = MEDIA_TYPES.join(",");

export const IMAGE_COMPRESSION_MAX_DIMENSION = 2000;
export const IMAGE_COMPRESSION_QUALITY = 0.8;

const acceptedTypes = new Set(MEDIA_TYPES);
const compressibleTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const loadDrawableImage = async (file) => {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    }).catch(() => null);

    if (bitmap) {
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      };
    }
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Could not read image."));
      element.src = objectUrl;
    });

    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      dispose: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
};

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

export const compressImageFile = async (
  file,
  {
    maxDimension = IMAGE_COMPRESSION_MAX_DIMENSION,
    quality = IMAGE_COMPRESSION_QUALITY,
  } = {},
) => {
  if (!file || !compressibleTypes.has(file.type)) return file;

  let drawable;

  try {
    drawable = await loadDrawableImage(file);
  } catch {
    return file;
  }

  try {
    const { width: sourceWidth, height: sourceHeight } = drawable;

    if (!sourceWidth || !sourceHeight) return file;

    const scale = Math.min(
      1,
      maxDimension / Math.max(sourceWidth, sourceHeight),
    );
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) return file;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(drawable.source, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, "image/webp", quality);

    if (!blob) return file;
    if (scale === 1 && blob.size >= file.size) return file;

    const type = blob.type || "image/webp";
    const extension =
      type === "image/jpeg" ? "jpg" : type.split("/")[1] || "webp";
    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";

    return new File([blob], `${baseName}.${extension}`, {
      type,
      lastModified: file.lastModified,
    });
  } finally {
    drawable.dispose();
  }
};

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
