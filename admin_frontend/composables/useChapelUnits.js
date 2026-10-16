// composables/useChapelUnits.js
import { ref } from "vue";

// Module-level state so the unit list is fetched once and shared app-wide.
const units = ref([]);
const isLoading = ref(false);
const loadedOnce = ref(false);

export function useChapelUnits() {
  const config = useRuntimeConfig();
  const toast = useAppToast();

  const loadUnits = async () => {
    // Reuse the cached list if it has already been loaded (or is in-flight)
    if (loadedOnce.value || isLoading.value) return;

    isLoading.value = true;
    try {
      const res = await $fetch(`${config.public.apiBase}/admin/chapel-units`);

      units.value = res
        .filter((unit) => unit.active !== false)
        .map((unit) => unit.name);
      loadedOnce.value = true;
    } catch (error) {
      console.error("Failed to load chapel units:", error);
      toast.error("Could not load chapel units. Please try again.");
    } finally {
      isLoading.value = false;
    }
  };

  return { units, isLoading, loadUnits };
}
