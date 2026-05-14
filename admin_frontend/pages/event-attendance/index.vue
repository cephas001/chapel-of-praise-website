<!-- pages/event-attendance/index.vue -->
<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <AppPageHeader
      text="Global Event Attendance"
      description="Record or review unit attendance across all recorded events."
      classList="mb-8"
    />

    <!-- Global Selectors -->
    <div
      class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4"
    >
      <!-- Event Selector -->
      <div class="flex-1">
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
          >1. Select Event</label
        >
        <div class="relative">
          <select
            v-model="selectedEventId"
            class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-xl text-sm transition-colors text-black font-semibold appearance-none bg-white"
          >
            <option value="" disabled>Choose Event...</option>
            <option v-for="event in events" :key="event.id" :value="event.id">
              {{ formatEventDisplay(event) }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <Icon name="heroicons:calendar" class="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Unit Selector -->
      <div class="flex-1">
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
          >2. Select Unit</label
        >
        <div class="relative">
          <select
            v-model="selectedUnit"
            :disabled="!selectedEventId"
            class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-xl text-sm transition-colors text-black font-semibold appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="" disabled>Choose Unit...</option>
            <option v-for="unit in availableUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <Icon name="heroicons:users" class="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Reusable Component -->
    <EventAttendanceTable
      v-if="selectedEventId && selectedUnit"
      :event-id="selectedEventId"
      :unit-name="selectedUnit"
    />

    <div v-else class="py-20 text-center">
      <div
        class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-4"
      >
        <Icon name="heroicons:clipboard-document-check" class="h-8 w-8" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">Awaiting Selection</h3>
      <p class="text-gray-500 text-sm">
        Please select an Event and a Unit above to load the attendance roster.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { formatEventDisplay } from "~/utils/formatters";

const config = useRuntimeConfig();
const authStore = useAuthStore();

const events = ref([]);
const selectedEventId = ref("");
const selectedUnit = ref("");

const availableUnits = [
  "Choir",
  "Editorial",
  "Ushering",
  "Protocol",
  "Media",
  "Prayer",
  "Drama",
  "Bible Study",
  "Evangelism",
  "Technical",
  "Welfare",
  "Academic",
];

// Fetch events to populate the dropdown
onMounted(async () => {
  try {
    const res = await $fetch(`${config.public.apiBase}/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    // Sort so newest events appear at the top of the dropdown
    events.value = res.sort(
      (a, b) => new Date(b.eventDate) - new Date(a.eventDate),
    );
  } catch (error) {
    console.error("Failed to load events", error);
  }
});
</script>
