<!-- components/events/AttendanceTable.vue -->
<template>
  <div
    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col font-poppins mt-8"
  >
    <div v-if="isFetching" class="p-16 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-500 animate-spin mb-4"
      />
      <p
        class="text-[11px] font-bold font-jetbrains text-gray-500 uppercase tracking-widest animate-pulse"
      >
        Loading roster and records...
      </p>
    </div>

    <div v-else-if="members.length === 0" class="p-16 text-center">
      <Icon
        name="heroicons:users"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
        No Workers Found
      </h3>
      <p class="text-xs md:text-sm text-gray-500">
        There are no registered workers in the
        <span class="font-bold text-black">{{ unitName }}</span> unit.
      </p>
    </div>

    <div v-else class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <caption class="sr-only">
          Attendance roster for members of this event's unit
        </caption>
        <thead class="bg-gray-50/50">
          <tr>
            <th
              scope="col"
              class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap"
            >
              Worker Name
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap"
            >
              Officiating?
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap"
            >
              Attendance Status
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap"
            >
              System Result
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr
            v-for="member in members"
            :key="member.id"
            class="transition-colors group"
            :class="
              isOfficiating(member.id)
                ? 'bg-gray-50/50 hover:bg-gray-50'
                : 'hover:bg-gray-50/30'
            "
          >
            <td class="pl-6 pr-2 py-4 whitespace-nowrap">
              <div
                class="text-xs md:text-sm font-bold"
                :class="
                  isOfficiating(member.id) ? 'text-black' : 'text-gray-600'
                "
              >
                {{ member.name }}
              </div>
              <div
                class="text-[11px] font-jetbrains font-semibold tracking-wide uppercase mt-1 text-gray-500"
              >
                {{ member.memberType === "EXECUTIVE" ? "Executive" : "Worker" }}
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-center">
              <button
                type="button"
                class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                :class="isOfficiating(member.id) ? 'bg-black' : 'bg-gray-200'"
                @click="toggleOfficiating(member.id)"
              >
                <span class="sr-only">Toggle Officiating</span>
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="
                    isOfficiating(member.id) ? 'translate-x-4' : 'translate-x-0'
                  "
                />
              </button>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div
                v-if="isOfficiating(member.id)"
                class="flex items-center justify-center gap-5"
              >
                <label class="inline-flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    :name="`status-${member.id}`"
                    :checked="isPresent(member.id)"
                    class="h-4 w-4 text-black focus:ring-black border-gray-300 cursor-pointer transition-colors"
                    @change="setStatus(member.id, 'present')"
                  >
                  <span
                    class="ml-2 text-[11px] font-jetbrains font-bold tracking-wide uppercase text-gray-500 group-hover:text-black transition-colors"
                  >
                    Present
                  </span>
                </label>

                <label class="inline-flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    :name="`status-${member.id}`"
                    :checked="isPardoned(member.id)"
                    class="h-4 w-4 text-gray-500 focus:ring-gray-500 border-gray-300 cursor-pointer transition-colors"
                    @change="setStatus(member.id, 'pardoned')"
                  >
                  <span
                    class="ml-2 text-[11px] font-jetbrains font-bold tracking-wide uppercase text-gray-500 group-hover:text-gray-900 transition-colors"
                  >
                     Excused
                  </span>
                </label>
              </div>
              <span
                v-else
                class="text-[11px] font-jetbrains font-medium text-gray-500 uppercase tracking-widest"
              >
                Not Officiating
              </span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span
                v-if="!isOfficiating(member.id)"
                class="text-gray-300 font-bold"
                >-</span
              >
              <span
                v-else-if="isPresent(member.id)"
                class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100"
              >
                Present
              </span>
              <span
                v-else-if="isPardoned(member.id)"
                class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100"
              >
                Excused
              </span>
              <span
                v-else-if="absentIds.includes(member.id)"
                class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100 animate-pulse"
              >
                Absent
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="px-6 pt-7 pb-5 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
    >
      <div class="w-full sm:w-1/2">
        <label
          for="attendance-additional-comments"
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >
          Additional Comments
        </label>
        <textarea
          id="attendance-additional-comments"
          v-model="additionalComments"
          type="text"
          class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm resize-none"
          placeholder="Any specific notes about this unit's attendance..."
          rows="4"
        />
      </div>
      <button
        :disabled="isSubmitting"
        class="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-xs md:text-sm text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains shrink-0 h-[42px]"
        @click="submitAttendance"
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAttendanceLogic } from "~/composables/useAttendanceLogic"; // The composable we just built!

const props = defineProps({
  eventId: { type: String, required: true },
  unitName: { type: String, required: true },
});

const config = useRuntimeConfig();
const toast = useAppToast(); // auto-imported

const members = ref([]);
const isFetching = ref(false);
const isSubmitting = ref(false);
const additionalComments = ref("");
const lastSyncedSnapshot = ref("");

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

const currentSnapshot = () =>
  JSON.stringify({
    officiatingIds: officiatingIds.value,
    presentIds: presentIds.value,
    pardonedIds: pardonedIds.value,
    additionalComments: additionalComments.value,
  });

const isDirty = computed(
  () =>
    lastSyncedSnapshot.value !== "" &&
    currentSnapshot() !== lastSyncedSnapshot.value,
);

defineExpose({ isDirty });

// Warn before leaving the page with unsaved roster edits
useUnsavedChanges(isDirty, {
  message:
    "You have unsaved attendance changes for this roster. Leave anyway and discard them?",
});

const fetchData = async () => {
  if (!props.eventId || !props.unitName) return;
  isFetching.value = true;

  try {
    // 1. Fetch Workers
    const membersRes = await $fetch(
      `${config.public.apiBase}/admin/members/unit/${props.unitName}`,
    );
    members.value = membersRes.sort((a, b) => a.name.localeCompare(b.name));

    // 2. Fetch Existing Attendance Record
    const attendanceRes = await $fetch(
      `${config.public.apiBase}/admin/event-attendance/${props.eventId}/${props.unitName}`,
    );

    additionalComments.value = attendanceRes.additionalComments || "";

    // 3. Load into composable
    loadExistingRecord(attendanceRes);
    lastSyncedSnapshot.value = currentSnapshot();
  } catch {
    toast.error("Could not load the roster."); // migrated
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

    await $fetch(`${config.public.apiBase}/admin/event-attendance`, {
      method: "POST",
      body: payload,
    });

    lastSyncedSnapshot.value = currentSnapshot();
    toast.success("Attendance records saved successfully."); // migrated
  } catch {
    toast.error("Could not save records."); // migrated
  } finally {
    isSubmitting.value = false;
  }
};
</script>
