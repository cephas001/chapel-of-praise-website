<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Unit Meeting Attendance
        </h2>
        <p class="text-gray-500 text-xs md:text-sm max-w-2xl">
          Record attendance by unit for each meeting. Every unit member is
          expected to attend unless pardoned.
        </p>
      </div>

      <button
        @click="saveAttendance"
        :disabled="
          !selectedUnit || isFetching || isSaving || members.length === 0
        "
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors font-jetbrains shrink-0"
      >
        <Icon
          v-if="isSaving"
          name="heroicons:arrow-path"
          class="mr-2 h-4 w-4 animate-spin"
        />
        {{ isSaving ? "Saving..." : "Save Attendance" }}
      </button>
    </div>

    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-black uppercase tracking-wide mb-2"
          >
            1. Select Unit
          </label>
          <div class="relative">
            <select
              v-model="selectedUnit"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none cursor-pointer"
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
                class="h-4 w-4 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-black uppercase tracking-wide mb-2"
          >
            2. Meeting Date
          </label>
          <input
            v-model="meetingDate"
            type="date"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
          <p
            class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-500 mb-2"
          >
            Members Loaded
          </p>
          <p class="text-2xl font-black text-black font-jetbrains">
            {{ members.length }}
          </p>
        </div>
        <div class="rounded-xl border border-green-100 bg-green-50/70 p-4">
          <p
            class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-green-700 mb-2"
          >
            Present
          </p>
          <p class="text-2xl font-black text-green-700 font-jetbrains">
            {{ presentCount }}
          </p>
        </div>
        <div class="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
          <p
            class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-amber-700 mb-2"
          >
            Pardoned
          </p>
          <p class="text-2xl font-black text-amber-700 font-jetbrains">
            {{ pardonedCount }}
          </p>
        </div>
        <div class="rounded-xl border border-red-100 bg-red-50/70 p-4">
          <p
            class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-red-700 mb-2"
          >
            Absent
          </p>
          <p class="text-2xl font-black text-red-700 font-jetbrains">
            {{ absentCount }}
          </p>
        </div>
      </div>

      <div class="border-t border-gray-100 -mx-6 pt-4 px-2">
        <div v-if="!selectedUnit" class="py-14 text-center">
          <Icon
            name="heroicons:clipboard-document-check"
            class="mx-auto h-12 w-12 text-gray-300 mb-4"
          />
          <h3 class="text-sm font-jetbrains font-bold text-gray-900 mb-1">
            Select a Unit
          </h3>
          <p class="text-xs text-gray-500 max-w-sm mx-auto px-3">
            Choose a unit above to load the attendance roster for the selected
            meeting date.
          </p>
        </div>

        <div v-else-if="members.length === 0" class="py-16 text-center">
          <Icon
            name="heroicons:users"
            class="mx-auto h-12 w-12 text-gray-300 mb-4"
          />
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            No Members Found
          </h3>
          <p class="text-xs md:text-sm text-gray-500 max-w-sm mx-auto px-3">
            There are no registered members in the
            <span class="font-bold text-black">{{ selectedUnit }}</span> unit.
          </p>
        </div>

        <div
          v-else
          class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50/50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap"
                >
                  Member Name
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
                class="group transition-colors hover:bg-gray-50/50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-xs md:text-sm font-bold text-gray-900">
                    {{ member.name }}
                  </div>
                  <div
                    class="text-[11px] font-jetbrains text-gray-500 mt-0.5 max-w-[250px] truncate font-medium uppercase tracking-wide"
                  >
                    {{
                      member.memberType === "EXECUTIVE" ? "Executive" : "Member"
                    }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-5 flex-wrap">
                    <label
                      class="inline-flex items-center cursor-pointer group"
                    >
                      <input
                        type="radio"
                        :name="`status-${member.id}`"
                        :checked="getStatus(member.id) === 'present'"
                        @change="setStatus(member.id, 'present')"
                        class="h-4 w-4 text-black focus:ring-black border-gray-300 cursor-pointer transition-colors"
                      />
                      <span
                        class="ml-2 text-[11px] font-jetbrains font-bold tracking-wide uppercase text-gray-500 group-hover:text-black transition-colors"
                      >
                        Present
                      </span>
                    </label>

                    <label
                      class="inline-flex items-center cursor-pointer group"
                    >
                      <input
                        type="radio"
                        :name="`status-${member.id}`"
                        :checked="getStatus(member.id) === 'pardoned'"
                        @change="setStatus(member.id, 'pardoned')"
                        class="h-4 w-4 text-gray-400 focus:ring-gray-500 border-gray-300 cursor-pointer transition-colors"
                      />
                      <span
                        class="ml-2 text-[11px] font-jetbrains font-bold tracking-wide uppercase text-gray-500 group-hover:text-gray-900 transition-colors"
                      >
                        Pardoned
                      </span>
                    </label>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    v-if="getStatus(member.id) === 'present'"
                    class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100"
                  >
                    Present
                  </span>
                  <span
                    v-else-if="getStatus(member.id) === 'pardoned'"
                    class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100"
                  >
                    Excused
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100"
                  >
                    Absent
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="px-6 pt-7 pb-5 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-8 -mx-6 -mb-6"
      >
        <div class="w-full sm:w-1/2">
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Additional Comments
          </label>
          <textarea
            v-model="additionalComments"
            class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm resize-none"
            placeholder="Meeting notes, follow-up items, or special instructions..."
            rows="4"
          />
        </div>

        <div
          class="w-full sm:w-auto flex flex-col items-stretch sm:items-end gap-3"
        >
          <p
            class="text-[11px] font-jetbrains font-medium uppercase tracking-wide text-gray-500 sm:text-right max-w-xs"
          >
            Mark every attending member as present. Use pardoned only for
            approved absences.
          </p>
          <div
            v-if="lastSavedAt"
            class="text-[11px] font-jetbrains font-bold text-gray-500 sm:text-right"
          >
            Last saved: {{ formatDateTime(lastSavedAt) }}
          </div>
          <button
            @click="saveAttendance"
            :disabled="
              !selectedUnit || isFetching || isSaving || members.length === 0
            "
            class="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains shrink-0 h-[42px]"
          >
            <Icon
              v-if="isSaving"
              name="heroicons:arrow-path"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isSaving ? "Saving..." : "Save Unit Meeting" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { useAlertModal } from "~/composables/useAlertModal";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

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
const meetingDate = ref(getTodayIso());
const members = ref([]);
const attendanceByMember = ref({});
const additionalComments = ref("");
const lastSavedAt = ref("");
const isFetching = ref(false);
const isSaving = ref(false);

const storageKey = computed(() => {
  if (!selectedUnit.value || !meetingDate.value) return "";
  return `unit-meeting-attendance:${selectedUnit.value}:${meetingDate.value}`;
});

const presentCount = computed(
  () =>
    members.value.filter((member) => getStatus(member.id) === "present").length,
);

const pardonedCount = computed(
  () =>
    members.value.filter((member) => getStatus(member.id) === "pardoned")
      .length,
);

const absentCount = computed(
  () => members.value.length - presentCount.value - pardonedCount.value,
);

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function getStatus(memberId) {
  return attendanceByMember.value[String(memberId)] || "";
}

function setStatus(memberId, status) {
  attendanceByMember.value = {
    ...attendanceByMember.value,
    [String(memberId)]: status,
  };
}

function loadStoredRecord() {
  attendanceByMember.value = {};
  additionalComments.value = "";
  lastSavedAt.value = "";

  if (typeof window === "undefined" || !storageKey.value) return;

  const rawRecord = window.localStorage.getItem(storageKey.value);
  if (!rawRecord) return;

  try {
    const record = JSON.parse(rawRecord);
    attendanceByMember.value = record.attendanceByMember || {};
    additionalComments.value = record.additionalComments || "";
    lastSavedAt.value = record.updatedAt || "";
  } catch (error) {
    console.error("Failed to parse stored unit meeting attendance", error);
  }
}

async function loadMembersForUnit() {
  if (!selectedUnit.value) return;

  isFetching.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/members/unit/${selectedUnit.value}`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    members.value = [...response].sort((a, b) => a.name.localeCompare(b.name));
    loadStoredRecord();
  } catch (error) {
    console.error("Failed to load unit members", error);
    members.value = [];
    showAlert("Could not load unit members for this meeting.", "error");
  } finally {
    isFetching.value = false;
  }
}

async function saveAttendance() {
  if (!selectedUnit.value || members.value.length === 0 || !storageKey.value)
    return;

  isSaving.value = true;
  try {
    const record = {
      unitName: selectedUnit.value,
      meetingDate: meetingDate.value,
      attendanceByMember: attendanceByMember.value,
      presentIds: members.value
        .filter((member) => getStatus(member.id) === "present")
        .map((member) => member.id),
      pardonedIds: members.value
        .filter((member) => getStatus(member.id) === "pardoned")
        .map((member) => member.id),
      additionalComments: additionalComments.value,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey.value, JSON.stringify(record));
    }

    lastSavedAt.value = record.updatedAt;
    showAlert("Unit meeting attendance saved successfully.", "success");
  } catch (error) {
    console.error("Failed to save unit meeting attendance", error);
    showAlert("Could not save the unit meeting attendance.", "error");
  } finally {
    isSaving.value = false;
  }
}

function formatDateTime(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

watch(selectedUnit, async (unit) => {
  members.value = [];
  attendanceByMember.value = {};
  additionalComments.value = "";
  lastSavedAt.value = "";

  if (!unit) return;

  await loadMembersForUnit();
});

watch(meetingDate, () => {
  if (selectedUnit.value) {
    loadStoredRecord();
  }
});
</script>
