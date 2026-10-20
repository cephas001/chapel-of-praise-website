import { beforeEach, describe, expect, it, vi } from "vitest";
import { reactive } from "vue";
import { usePageManager } from "../composables/usePageManager.js";

vi.mock("#app", () => ({
  useRuntimeConfig: () => ({ public: { apiBase: "/api" } }),
}));

const toast = {
  success: vi.fn(),
  error: vi.fn(),
};

describe("usePageManager dirty tracking", () => {
  let sectionsMap;
  let manager;
  let fetchMock;

  beforeEach(() => {
    vi.clearAllMocks();

    sectionsMap = reactive({
      heroSection: { headline: "" },
      bodySection: { content: "" },
    });

    fetchMock = vi.fn(async (url, options) => {
      if (options) return {};

      return {
        heroSection: { headline: "Saved hero" },
        bodySection: { content: "Saved body" },
      };
    });

    vi.stubGlobal("$fetch", fetchMock);
    vi.stubGlobal("useAppToast", () => toast);
    vi.stubGlobal("useUnsavedChanges", vi.fn());

    manager = usePageManager("homepage", sectionsMap);
  });

  it("only clears the section that was saved individually", async () => {
    await manager.loadSettings();
    expect(manager.isDirty.value).toBe(false);

    sectionsMap.heroSection.headline = "Updated hero";
    sectionsMap.bodySection.content = "Updated body";
    expect(manager.isDirty.value).toBe(true);

    await manager.saveSection("heroSection", sectionsMap.heroSection);
    expect(manager.isDirty.value).toBe(true);

    await manager.saveSection("bodySection", sectionsMap.bodySection);
    expect(manager.isDirty.value).toBe(false);
  });

  it("stays dirty when a section changes while it is being saved", async () => {
    await manager.loadSettings();
    sectionsMap.heroSection.headline = "Updated hero";

    let resolveSave;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        }),
    );

    const savePromise = manager.saveSection(
      "heroSection",
      sectionsMap.heroSection,
    );

    sectionsMap.heroSection.headline = "Edited during save";
    resolveSave();
    await savePromise;

    expect(manager.isDirty.value).toBe(true);
  });

  it("marks successful sections clean after a bulk save with failures", async () => {
    await manager.loadSettings();
    sectionsMap.heroSection.headline = "Updated hero";
    sectionsMap.bodySection.content = "Updated body";

    fetchMock
      .mockImplementationOnce(async () => ({}))
      .mockImplementationOnce(async () => {
        throw new Error("Save failed");
      });

    await manager.saveSettings();

    expect(manager.isDirty.value).toBe(true);

    sectionsMap.bodySection.content = "Saved body";
    expect(manager.isDirty.value).toBe(false);
  });
});
