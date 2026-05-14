<!-- components/events/AttendanceTable.vue -->
<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col font-montserrat"
  >
    <!-- Loading State -->
    <div v-if="isFetching" class="p-12 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900">
        Loading roster and records...
      </h3>
    </div>

    <!-- Empty Roster State -->
    <div v-else-if="members.length === 0" class="p-12 text-center">
      <Icon
        name="heroicons:users"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 mb-1">No Workers Found</h3>
      <p class="text-gray-500 text-sm">
        There are no registered workers in the {{ unitName }} unit.
      </p>
    </div>

    <!-- The Roster Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Worker Name
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Officiating?
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              Attendance Status
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
            >
              System Result
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-50">
          <tr
            v-for="member in members"
            :key="member.id"
            class="hover:bg-gray-50/30 transition-colors"
            :class="{ 'bg-blue-50/20': isOfficiating(member.id) }"
          >
            <!-- Worker Details -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div
                class="text-sm font-bold"
                :class="
                  isOfficiating(member.id) ? 'text-blue-900' : 'text-gray-900'
                "
              >
                {{ member.name }}
              </div>
              <div class="text-xs mt-0.5 text-gray-500">
                {{ member.memberType === "EXECUTIVE" ? "Executive" : "Worker" }}
              </div>
            </td>

            <!-- Officiating Master Toggle -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <button
                type="button"
                @click="toggleOfficiating(member.id)"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                :class="
                  isOfficiating(member.id) ? 'bg-blue-600' : 'bg-gray-200'
                "
              >
                <span class="sr-only">Toggle Officiating</span>
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="
                    isOfficiating(member.id) ? 'translate-x-5' : 'translate-x-0'
                  "
                />
              </button>
            </td>

            <!-- Status Selection (Only show if officiating) -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div
                v-if="isOfficiating(member.id)"
                class="flex items-center justify-center gap-4"
              >
                <label class="inline-flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    :name="`status-${member.id}`"
                    :checked="isPresent(member.id)"
                    @change="setStatus(member.id, 'present')"
                    class="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 cursor-pointer"
                  />
                  <span
                    class="ml-2 text-xs font-semibold text-gray-700 group-hover:text-green-700"
                    >Present</span
                  >
                </label>

                <label class="inline-flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    :name="`status-${member.id}`"
                    :checked="isPardoned(member.id)"
                    @change="setStatus(member.id, 'pardoned')"
                    class="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 cursor-pointer"
                  />
                  <span
                    class="ml-2 text-xs font-semibold text-gray-700 group-hover:text-amber-700"
                    >Pardoned</span
                  >
                </label>
              </div>
              <span v-else class="text-xs text-gray-400 italic"
                >Not required to attend</span
              >
            </td>

            <!-- Computed System Result (The magic of useAttendanceLogic) -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span v-if="!isOfficiating(member.id)" class="text-gray-300"
                >-</span
              >
              <span
                v-else-if="isPresent(member.id)"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-50 text-green-700"
                >Present</span
              >
              <span
                v-else-if="isPardoned(member.id)"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700"
                >Excused</span
              >
              <span
                v-else-if="absentIds.includes(member.id)"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 animate-pulse"
                >Absent</span
              >
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Comments & Save -->
      <div
        class="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div class="w-full sm:w-1/2">
          <label class="block text-xs font-bold text-gray-700 mb-1.5"
            >Additional Comments</label
          >
          <input
            v-model="additionalComments"
            type="text"
            class="block w-full px-3 py-2 border border-gray-300 focus:border-blue-600 outline-none rounded-lg text-sm transition-colors text-black"
            placeholder="Any specific notes about this unit's attendance..."
          />
        </div>
        <button
          @click="submitAttendance"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed h-[38px] shrink-0"
        >
          <Icon
            v-if="isSubmitting"
            name="heroicons:arrow-path"
            class="mr-2 h-4 w-4 animate-spin"
          />
          {{ isSubmitting ? "Saving..." : "Save Unit Attendance" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { useAlertModal } from "~/composables/useAlertModal";
import { useAttendanceLogic } from "~/composables/useAttendanceLogic"; // The composable we just built!

const props = defineProps({
  eventId: { type: String, required: true },
  unitName: { type: String, required: true },
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

const members = ref([]);
const isFetching = ref(false);
const isSubmitting = ref(false);
const additionalComments = ref("");

// Destructure our powerful composable
const {
  officiatingIds,
  presentIds,
  pardonedIds,
  absentIds,
  toggleOfficiating,
  setStatus,
  loadExistingRecord,
  getPayload,
} = useAttendanceLogic();

// UI Helper checks
const isOfficiating = (id) => officiatingIds.value.includes(id);
const isPresent = (id) => presentIds.value.includes(id);
const isPardoned = (id) => pardonedIds.value.includes(id);

const fetchData = async () => {
  if (!props.eventId || !props.unitName) return;
  isFetching.value = true;

  try {
    // 1. Fetch Workers
    const membersRes = await $fetch(
      `${config.public.apiBase}/members/unit/${props.unitName}`,
    );
    members.value = membersRes.sort((a, b) => a.name.localeCompare(b.name));

    // 2. Fetch Existing Attendance Record
    const attendanceRes = await $fetch(
      `${config.public.apiBase}/event-attendance/${props.eventId}/${props.unitName}`,
    );

    additionalComments.value = attendanceRes.additionalComments || "";

    // 3. Load into composable
    loadExistingRecord(attendanceRes);
  } catch (error) {
    showAlert("Error", "Could not load the roster.", "error");
  } finally {
    isFetching.value = false;
  }
};

// Re-fetch if the unit or event changes
watch(() => [props.eventId, props.unitName], fetchData);
onMounted(fetchData);

const submitAttendance = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      eventId: props.eventId,
      unitName: props.unitName,
      additionalComments: additionalComments.value,
      ...getPayload(), // gets officiatingIds, presentIds, pardonedIds
    };

    await $fetch(`${config.public.apiBase}/event-attendance`, {
      method: "POST",
      body: payload,
    });

    showAlert("Success", "Attendance records saved successfully.", "success");
  } catch (error) {
    showAlert("Error", "Could not save records.", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
