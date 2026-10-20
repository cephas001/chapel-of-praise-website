// composables/usePageManager.js
import { computed, reactive, ref } from "vue";
import { useRuntimeConfig } from "#app";

const cloneValue = (value) => {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneValue(entry)]),
    );
  }
  return value;
};

const valuesEqual = (left, right) => {
  if (left === right) return true;
  if (
    !left ||
    !right ||
    typeof left !== "object" ||
    typeof right !== "object" ||
    Array.isArray(left) !== Array.isArray(right)
  ) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;

  return leftKeys.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(right, key) &&
      valuesEqual(left[key], right[key]),
  );
};

export function usePageManager(pageEndpoint, sectionsMap, options = {}) {
  const config = useRuntimeConfig();
  const toast = useAppToast(); // Assuming this is auto-imported

  const isFetching = ref(true);
  const isSaving = ref(false);
  const loadFailed = ref(false);
  const savedSections = reactive(
    Object.fromEntries(
      Object.keys(sectionsMap).map((sectionId) => [
        sectionId,
        cloneValue(sectionsMap[sectionId]),
      ]),
    ),
  );

  const markSectionsSaved = (savedValues) => {
    Object.entries(savedValues).forEach(([sectionId, value]) => {
      if (Object.prototype.hasOwnProperty.call(sectionsMap, sectionId)) {
        savedSections[sectionId] = cloneValue(value);
      }
    });
  };

  const isDirty = computed(() =>
    Object.keys(sectionsMap).some(
      (sectionId) =>
        !valuesEqual(sectionsMap[sectionId], savedSections[sectionId]),
    ),
  );

  // Warn before leaving with unsaved changes
  useUnsavedChanges(isDirty);

  // Load Settings
  const loadSettings = async () => {
    isFetching.value = true;
    try {
      const response = await $fetch(
        `${config.public.apiBase}/admin/${pageEndpoint}`,
      );

      // If a custom parser is provided, let it handle the data mapping
      if (options.customParser) {
        options.customParser(response, sectionsMap);
      } else {
        // Default behavior: straightforward Object.assign
        Object.entries(response).forEach(([key, value]) => {
          if (sectionsMap[key]) {
            Object.assign(sectionsMap[key], value);
          }
        });
      }

      loadFailed.value = false;
      markSectionsSaved(sectionsMap);
    } catch (error) {
      console.error(`Failed to load ${pageEndpoint} settings:`, error);
      loadFailed.value = true;
      toast.error("Could not load settings. Please try again.");
    } finally {
      isFetching.value = false;
    }
  };

  // Save All Settings
  const saveSettings = async () => {
    if (loadFailed.value) {
      toast.error(
        "Settings could not be loaded, so saving is disabled to avoid overwriting existing data. Refresh the page and try again.",
      );
      return;
    }

    isSaving.value = true;
    const failedSections = [];
    const savedValues = {};

    try {
      for (const [sectionId, sectionData] of Object.entries(sectionsMap)) {
        const payload = cloneValue(sectionData);

        try {
          await $fetch(
            `${config.public.apiBase}/admin/${pageEndpoint}/${sectionId}`,
            {
              method: "PUT",
              body: payload,
            },
          );
          savedValues[sectionId] = payload;
        } catch (error) {
          console.error(`Failed to save ${sectionId}:`, error);
          failedSections.push(sectionId);
        }
      }

      markSectionsSaved(savedValues);

      if (failedSections.length > 0) {
        toast.error(
          `Some sections failed to save: ${failedSections.join(", ")}. The rest were saved.`,
        );
      } else {
        toast.success("Settings saved successfully!");

        // Optionally reload data to ensure sync
        if (options.reloadOnSave) {
          await loadSettings();
        }
      }
    } finally {
      isSaving.value = false;
    }
  };

  // Save Single Section
  const saveSection = async (sectionId, sectionData) => {
    if (loadFailed.value) {
      toast.error(
        "Settings could not be loaded, so saving is disabled to avoid overwriting existing data. Refresh the page and try again.",
      );
      return;
    }

    const payload = cloneValue(sectionData);

    try {
      await $fetch(
        `${config.public.apiBase}/admin/${pageEndpoint}/${sectionId}`,
        {
          method: "PUT",
          body: payload,
        },
      );
      markSectionsSaved({ [sectionId]: payload });
      toast.success(`${sectionId} saved successfully!`);
    } catch (error) {
      console.error(`Failed to save ${sectionId}:`, error);
      toast.error(`Could not save ${sectionId}. Please try again.`);
    }
  };

  return {
    isFetching,
    isSaving,
    loadFailed,
    isDirty,
    loadSettings,
    saveSettings,
    saveSection,
  };
}
