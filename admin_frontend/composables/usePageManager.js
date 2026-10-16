// composables/usePageManager.js
import { ref, watch, nextTick } from "vue";
import { useRuntimeConfig } from "#app";

export function usePageManager(pageEndpoint, sectionsMap, options = {}) {
  const config = useRuntimeConfig();
  const toast = useAppToast(); // Assuming this is auto-imported

  const isFetching = ref(true);
  const isSaving = ref(false);
  const loadFailed = ref(false);
  const isDirty = ref(false);

  // Track unsaved changes across all sections
  watch(
    () => sectionsMap,
    () => {
      isDirty.value = true;
    },
    { deep: true },
  );

  const markClean = async () => {
    await nextTick();
    isDirty.value = false;
  };

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
      await markClean();
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

    try {
      for (const [sectionId, sectionData] of Object.entries(sectionsMap)) {
        try {
          await $fetch(
            `${config.public.apiBase}/admin/${pageEndpoint}/${sectionId}`,
            {
              method: "PUT",
              body: sectionData,
            },
          );
        } catch (error) {
          console.error(`Failed to save ${sectionId}:`, error);
          failedSections.push(sectionId);
        }
      }

      if (failedSections.length > 0) {
        toast.error(
          `Some sections failed to save: ${failedSections.join(", ")}. The rest were saved.`,
        );
      } else {
        toast.success("Settings saved successfully!");

        // Optionally reload data to ensure sync
        if (options.reloadOnSave) {
          await loadSettings();
        } else {
          await markClean();
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

    try {
      await $fetch(
        `${config.public.apiBase}/admin/${pageEndpoint}/${sectionId}`,
        {
          method: "PUT",
          body: sectionData,
        },
      );
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
