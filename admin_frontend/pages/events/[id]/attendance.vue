<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div
      class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <NuxtLink
          :to="`/events/${eventId}`"
          class="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-2"
        >
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
          Back to Event Overview
        </NuxtLink>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight">
          Event Unit Attendance
        </h1>
        <p class="text-sm text-gray-500 font-medium mt-1">
          Record attendance for specific chapel units.
        </p>
      </div>

      <div class="w-full sm:w-64">
        <label
          class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
          >Select Chapel Unit</label
        >
        <div class="relative">
          <select
            v-model="selectedUnit"
            @change="loadUnitData"
            class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-xl text-sm transition-colors text-black font-bold appearance-none bg-white shadow-sm"
          >
            <option value="" disabled>Choose Unit...</option>
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

    <div
      v-if="!selectedUnit"
      class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center"
    >
      <Icon
        name="heroicons:clipboard-document-list"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 mb-1">
        Select a unit to begin
      </h3>
      <p class="text-gray-500 text-sm">
        Choose a chapel unit from the dropdown above to load its worker roster.
      </p>
    </div>

    <div
      v-else-if="isFetching"
      class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center"
    >
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900">
        Loading roster and records...
      </h3>
    </div>

    <div
      v-else-if="members.length === 0"
      class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center"
    >
      <Icon
        name="heroicons:users"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 mb-1">No Workers Found</h3>
      <p class="text-gray-500 text-sm">
        There are no registered workers in the {{ selectedUnit }} unit.
      </p>
    </div>

    <div
      v-else
      class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/2"
              >
                Worker Name
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Mark Present
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Mark Absent
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-50">
            <tr
              v-for="member in members"
              :key="member.id"
              class="hover:bg-gray-50/30 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900">
                  {{ member.name }}
                </div>
                <div class="text-xs text-gray-500 mt-0.5">
                  {{
                    member.memberType === "EXECUTIVE" ? "Executive" : "Worker"
                  }}
                  • {{ member.gender }}
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    :name="`attendance-${member.id}`"
                    value="present"
                    v-model="attendanceState[member.id]"
                    class="h-5 w-5 text-green-600 focus:ring-green-600 border-gray-300 cursor-pointer"
                  />
                </label>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    :name="`attendance-${member.id}`"
                    value="absent"
                    v-model="attendanceState[member.id]"
                    class="h-5 w-5 text-red-600 focus:ring-red-600 border-gray-300 cursor-pointer"
                  />
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between"
      >
        <div class="text-sm font-semibold text-gray-700">
          Total Workers: {{ members.length }}
        </div>
        <button
          @click="saveAttendance"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Icon
            v-if="isSubmitting"
            name="heroicons:arrow-path"
            class="mr-2 h-4 w-4 animate-spin"
          />
          {{ isSubmitting ? "Saving..." : "Save Attendance" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { useAlertModal } from "~/composables/useAlertModal";

const route = useRoute();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

const eventId = route.params.id;

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

const selectedUnit = ref("");
const members = ref([]);
const isFetching = ref(false);
const isSubmitting = ref(false);

// Stores the selected radio value ('present' or 'absent') for each member ID
const attendanceState = reactive({});

const loadUnitData = async () => {
  if (!selectedUnit.value) return;

  isFetching.value = true;
  // Reset the state object
  for (const key in attendanceState) delete attendanceState[key];

  try {
    // 1. Fetch the workers for the selected unit
    const membersRes = await $fetch(
      `${config.public.apiBase}/members/unit/${selectedUnit.value}`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    // Sort alphabetically by name
    members.value = membersRes.sort((a, b) => a.name.localeCompare(b.name));

    // 2. Fetch the existing attendance record for this event + unit
    const attendanceRes = await $fetch(
      `${config.public.apiBase}/event-attendance/${eventId}/${selectedUnit.value}`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    // 3. Pre-fill the radio buttons based on the backend data
    const presentIds = attendanceRes.presentIds || [];
    const absentIds = attendanceRes.absentIds || [];

    members.value.forEach((member) => {
      if (presentIds.includes(member.id)) {
        attendanceState[member.id] = "present";
      } else if (absentIds.includes(member.id)) {
        attendanceState[member.id] = "absent";
      }
      // If neither, the radios will remain unchecked until the user clicks one
    });
  } catch (error) {
    console.error("Failed to load unit data:", error);
    showAlert(
      "Error",
      "Could not load the roster or attendance records.",
      "error",
    );
  } finally {
    isFetching.value = false;
  }
};

const saveAttendance = async () => {
  isSubmitting.value = true;

  // Separate the state object back into arrays for the backend
  const presentIds = [];
  const absentIds = [];

  for (const [memberId, state] of Object.entries(attendanceState)) {
    if (state === "present") presentIds.push(memberId);
    if (state === "absent") absentIds.push(memberId);
  }

  try {
    await $fetch(`${config.public.apiBase}/event-attendance`, {
      method: "POST",
      body: {
        eventId,
        unitName: selectedUnit.value,
        presentIds,
        absentIds,
      },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    showAlert("Success", "Attendance records have been updated.", "success");
  } catch (error) {
    console.error("Failed to save attendance:", error);
    showAlert(
      "Action Failed",
      "Could not save the attendance records.",
      "error",
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>
