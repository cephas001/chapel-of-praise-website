<!-- pages/event-attendance/index.vue -->
<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Event Unit Attendance
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Record or review unit attendance across all events.
        </p>
      </div>
    </div>

    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label
            for="attendance-event"
            class="block text-[11px] font-jetbrains font-bold text-black uppercase tracking-wide mb-2"
          >
            1. Select Event
          </label>
          <div class="relative">
            <select
              id="attendance-event"
              :value="selectedEventId"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none cursor-pointer font-jetbrains"
              @change="onEventChange"
            >
              <option value="" disabled>Choose Event...</option>
              <option v-for="event in events" :key="event.id" :value="event.id">
                {{ formatEventDisplay(event) }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:chevron-down"
                class="h-4 w-4 text-gray-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            for="attendance-unit"
            class="block text-[11px] font-jetbrains font-bold text-black uppercase tracking-wide mb-2"
          >
            2. Select Unit
          </label>
          <div class="relative">
            <select
              id="attendance-unit"
              :value="selectedUnit"
              :disabled="!selectedEventId"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer font-jetbrains"
              @change="onUnitChange"
            >
              <option value="" disabled>Choose Unit...</option>
              <option v-for="unit in availableUnits" :key="unit" :value="unit">
                {{ unit }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:chevron-down"
                class="h-4 w-4 text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-100 -mx-6 pt-4 px-2">
        <EventAttendanceTable
          v-if="selectedEventId && selectedUnit"
          ref="attendanceRef"
          :event-id="selectedEventId"
          :unit-name="selectedUnit"
        />

        <div v-else class="py-14 text-center">
          <Icon
            name="heroicons:clipboard-document-check"
            class="mx-auto h-12 w-12 text-gray-300 mb-4"
          />
          <h3 class="text-sm font-jetbrains font-bold text-gray-900 mb-1">
            Awaiting Selection
          </h3>
          <p class="text-xs text-gray-500 max-w-xs mx-auto px-3">
            Please select an Event and a Unit above to load the attendance
            roster.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { formatEventDisplay } from "~/utils/formatters";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast();

const events = ref([]);
const selectedEventId = ref("");
const selectedUnit = ref("");
const isFetching = ref(true);
const attendanceRef = ref(null);
const confirm = useConfirm();

const { units: availableUnits, loadUnits } = useChapelUnits();

const confirmDiscardRoster = async (question) => {
  if (!attendanceRef.value?.isDirty) return true;
  return await confirm.ask({
    title: "Unsaved Changes",
    message: question,
    confirmText: "Discard & Switch",
    cancelText: "Stay",
    isDestructive: true,
  });
};

const onEventChange = async (event) => {
  const nextEventId = event.target.value;
  const ok = await confirmDiscardRoster(
    "You have unsaved attendance changes for this roster. Switch events and discard them?",
  );
  if (!ok) {
    event.target.value = selectedEventId.value;
    return;
  }
  selectedEventId.value = nextEventId;
  selectedUnit.value = "";
};

const onUnitChange = async (event) => {
  const nextUnit = event.target.value;
  const ok = await confirmDiscardRoster(
    "You have unsaved attendance changes for this roster. Switch units and discard them?",
  );
  if (!ok) {
    event.target.value = selectedUnit.value;
    return;
  }
  selectedUnit.value = nextUnit;
};

// Fetch events to populate the dropdown
onMounted(async () => {
  loadUnits();

  try {
    const res = await $fetch(`${config.public.apiBase}/admin/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    // Sort so newest events appear at the top of the dropdown
    events.value = res.sort(
      (a, b) => new Date(b.eventDate) - new Date(a.eventDate),
    );
  } catch (error) {
    console.error("Failed to load events", error);
    toast.error("Could not load events. Please try again later.");
  } finally {
    isFetching.value = false;
  }
});
</script>
