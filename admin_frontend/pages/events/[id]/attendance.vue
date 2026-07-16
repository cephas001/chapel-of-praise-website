<!-- pages/events/[id]/attendance.vue -->
<template>
  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <NuxtLink
          :to="`/events/${eventId}`"
          class="inline-flex items-center text-[11px] font-jetbrains font-bold text-gray-400 hover:text-black transition-colors mb-3 uppercase tracking-widest"
        >
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" /> Back to
          Event
        </NuxtLink>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Event Unit Attendance
        </h2>
      </div>

      <div class="w-full sm:w-72">
        <div class="relative">
          <select
            v-model="selectedUnit"
            class="w-full bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm font-semibold appearance-none shadow-sm cursor-pointer"
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

    <EventAttendanceTable
      v-if="selectedUnit"
      :event-id="eventId"
      :unit-name="selectedUnit"
    />

    <div
      v-else
      class="bg-white rounded-xl border border-gray-200 border-dashed p-16 text-center shadow-sm mt-8"
    >
      <Icon
        name="heroicons:cursor-arrow-rays"
        class="mx-auto h-10 w-10 text-gray-300 mb-4"
      />
      <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
        Select a Unit
      </h3>
      <p class="text-xs md:text-sm text-gray-500">
        Choose a chapel unit from the dropdown above to load and manage the
        attendance roster.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  allowedUserTypes: ["executive"],
});

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
