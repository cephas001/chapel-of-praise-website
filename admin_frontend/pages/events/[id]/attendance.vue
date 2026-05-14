<!-- pages/events/[id]/attendance.vue -->
<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div
      class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <NuxtLink
          :to="`/events/${eventId}`"
          class="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-2"
        >
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" /> Back to
          Event
        </NuxtLink>
        <h1 class="text-2xl font-black text-gray-900">Event Unit Attendance</h1>
      </div>

      <div class="w-full sm:w-64">
        <div class="relative">
          <select
            v-model="selectedUnit"
            class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-xl text-sm transition-colors text-black font-bold appearance-none bg-white shadow-sm"
          >
            <option value="" disabled>Select Chapel Unit...</option>
            <option v-for="unit in availableUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Inject our powerful reusable component here -->
    <AttendanceTable
      v-if="selectedUnit"
      :event-id="eventId"
      :unit-name="selectedUnit"
    />

    <div
      v-else
      class="bg-gray-50/50 rounded-2xl border border-gray-100 p-12 text-center border-dashed"
    >
      <Icon
        name="heroicons:cursor-arrow-rays"
        class="mx-auto h-8 w-8 text-gray-300 mb-3"
      />
      <p class="text-sm font-bold text-gray-500">
        Select a unit from the dropdown to load the roster.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import AttendanceTable from "~/components/events/AttendanceTable.vue";

const route = useRoute();
const eventId = route.params.id;
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
</script>
