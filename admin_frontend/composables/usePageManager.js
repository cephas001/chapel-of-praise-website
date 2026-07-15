// composables/usePageManager.js
import { ref } from "vue";
import { useRuntimeConfig } from "#app";

export function usePageManager(pageEndpoint, sectionsMap, options = {}) {
  const config = useRuntimeConfig();
  const toast = useAppToast(); // Assuming this is auto-imported

  const isFetching = ref(true);
  const isSaving = ref(false);

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
    } catch (error) {
      console.error(`Failed to load ${pageEndpoint} settings:`, error);
      toast.error("Could not load settings. Please try again.");
    } finally {
      isFetching.value = false;
    }
  };

  // Save All Settings
  const saveSettings = async () => {
    isSaving.value = true;
    try {
      for (const [sectionId, sectionData] of Object.entries(sectionsMap)) {
        await $fetch(
          `${config.public.apiBase}/admin/${pageEndpoint}/${sectionId}`,
          {
            method: "PUT",
            body: sectionData,
          },
        );
      }
      toast.success("Settings saved successfully!");

      // Optionally reload data to ensure sync
      if (options.reloadOnSave) {
        await loadSettings();
      }
    } catch (error) {
      console.error(`Failed to save ${pageEndpoint} settings:`, error);
      toast.error("Could not save settings. Please try again.");
    } finally {
      isSaving.value = false;
    }
  };

  // Save Single Section
  const saveSection = async (sectionId, sectionData) => {
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
    loadSettings,
    saveSettings,
    saveSection,
  };
}
