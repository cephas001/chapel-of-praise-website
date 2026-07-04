// composables/useAttendanceLogic.js
import { ref, computed } from "vue";

export const useAttendanceLogic = () => {
  // Core State Arrays
  const officiatingIds = ref([]);
  const presentIds = ref([]);
  const pardonedIds = ref([]);

  /**
   * The reactive magic:
   * Anyone who is officiating but NOT present and NOT pardoned is automatically absent.
   */
  const absentIds = computed(() => {
    const presentOrPardoned = new Set([
      ...presentIds.value,
      ...pardonedIds.value,
    ]);
    return officiatingIds.value.filter((id) => !presentOrPardoned.has(id));
  });

  // UI Helper: Toggle a member's officiating status
  const toggleOfficiating = (memberId) => {
    const index = officiatingIds.value.indexOf(memberId);
    if (index > -1) {
      // Remove from officiating (and subsequently clean them from other arrays)
      officiatingIds.value.splice(index, 1);
      removeStatus(memberId);
    } else {
      officiatingIds.value.push(memberId);
    }
  };

  // UI Helper: Set a member's specific attendance status ('present', 'pardoned', or 'none')
  const setStatus = (memberId, status) => {
    // First, ensure we remove them from any existing state arrays to prevent duplicates
    removeStatus(memberId);

    if (status === "present") {
      presentIds.value.push(memberId);
    } else if (status === "pardoned") {
      pardonedIds.value.push(memberId);
    }
    // If 'none', they simply remain in the officiating array and the computed property marks them absent.
  };

  // Internal Helper: Clears a member from present/pardoned arrays
  const removeStatus = (memberId) => {
    presentIds.value = presentIds.value.filter((id) => id !== memberId);
    pardonedIds.value = pardonedIds.value.filter((id) => id !== memberId);
  };

  // Used to populate the state when fetching existing data from the backend
  const loadExistingRecord = (record) => {
    officiatingIds.value = record.officiatingIds || [];
    presentIds.value = record.presentIds || [];
    pardonedIds.value = record.pardonedIds || [];
  };

  // Returns everything needed to build the UI payload
  const getPayload = () => ({
    officiatingIds: officiatingIds.value,
    presentIds: presentIds.value,
    pardonedIds: pardonedIds.value,
    // Note: We don't need to send absentIds, the backend will recalculate it to ensure data integrity
  });

  return {
    officiatingIds,
    presentIds,
    pardonedIds,
    absentIds,
    toggleOfficiating,
    setStatus,
    loadExistingRecord,
    getPayload,
  };
};
