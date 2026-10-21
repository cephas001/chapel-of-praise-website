import { describe, it, expect } from "vitest";
import {
  MEDIA_MAX_BYTES,
  compressImageFile,
  formatFileSize,
  isValidImageUrl,
  validateMediaFile,
} from "../utils/media.js";

const imageFile = (overrides = {}) => ({
  name: "hero.jpg",
  type: "image/jpeg",
  size: 1024,
  ...overrides,
});

describe("validateMediaFile", () => {
  it("accepts supported image types at the size limit", () => {
    expect(validateMediaFile(imageFile({ size: MEDIA_MAX_BYTES }))).toBe("");
  });

  it("rejects a missing file", () => {
    expect(validateMediaFile(null)).toBe("Choose an image to upload.");
  });

  it("rejects unsupported file types", () => {
    expect(
      validateMediaFile(imageFile({ name: "notes.pdf", type: "application/pdf" })),
    ).toContain("JPG, PNG, WEBP, or GIF");
  });

  it("rejects files above 8 MB", () => {
    expect(
      validateMediaFile(imageFile({ size: MEDIA_MAX_BYTES + 1 })),
    ).toContain("8 MB or smaller");
  });
});

describe("compressImageFile", () => {
  it("leaves GIF files untouched", async () => {
    const file = imageFile({ type: "image/gif" });
    expect(await compressImageFile(file)).toBe(file);
  });

  it("leaves unsupported files untouched", async () => {
    const file = imageFile({ name: "notes.pdf", type: "application/pdf" });
    expect(await compressImageFile(file)).toBe(file);
  });
});

describe("formatFileSize", () => {
  it("formats bytes and kilobytes", () => {
    expect(formatFileSize(0)).toBe("0 KB");
    expect(formatFileSize(512)).toBe("1 KB");
    expect(formatFileSize(1536)).toBe("2 KB");
  });

  it("formats megabytes with one decimal place", () => {
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe("1.5 MB");
  });
});

describe("isValidImageUrl", () => {
  it("accepts http and https URLs", () => {
    expect(isValidImageUrl("http://example.com/image.jpg")).toBe(true);
    expect(isValidImageUrl("https://example.com/image.jpg")).toBe(true);
  });

  it("rejects other protocols and invalid values", () => {
    expect(isValidImageUrl("ftp://example.com/image.jpg")).toBe(false);
    expect(isValidImageUrl("/images/hero.jpg")).toBe(false);
    expect(isValidImageUrl("https://")).toBe(false);
    expect(isValidImageUrl("")).toBe(false);
  });
});
