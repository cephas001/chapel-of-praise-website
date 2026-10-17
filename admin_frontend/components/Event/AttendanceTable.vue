<template>
  <AppCard class="mt-8" body-class="p-0">
    <!-- Roster header: register voice -->
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div>
          <h3 class="text-base font-semibold text-ink">{{ unitName }} unit</h3>
          <p class="mt-0.5 font-mono text-xs font-medium text-muted">
            {{ officiatingCount }} of {{ members.length }} officiating
          </p>
        </div>
        <span
          v-if="isDirty"
          class="inline-flex items-center gap-1.5 rounded-badge border border-warning-line bg-warning-surface px-2 py-1 font-mono text-xs font-medium text-warning-text"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-warning-text" />
          Unsaved
        </span>
      </div>
    </template>

    <!-- Loading -->
    <div v-if="isFetching" class="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <Icon name="heroicons:arrow-path" class="h-8 w-8 animate-spin text-muted" />
      <p class="font-mono text-xs font-medium text-muted">Loading roster…</p>
    </div>

    <!-- Empty -->
    <div v-else-if="members.length === 0" class="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <Icon name="heroicons:users" class="h-10 w-10 text-line" />
      <h4 class="text-base font-semibold text-ink">No workers registered</h4>
      <p class="max-w-[44ch] text-sm leading-relaxed text-muted">
        There are no workers in the {{ unitName }} unit yet. Add them from the
        unit members page, then come back to record attendance.
      </p>
    </div>

    <template v-else>
      <!-- Mobile: one record card per worker. No horizontal panning. -->
      <ul class="divide-y divide-line md:hidden">
        <li
          v-for="member in members"
          :key="member.id"
          class="p-4"
          :class="isOfficiating(member.id) ? 'bg-subtle/50' : ''"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-ink">
                {{ member.name }}
              </p>
              <p class="mt-0.5 font-mono text-xs font-medium text-muted">
                {{ member.memberType === "EXECUTIVE" ? "Executive" : "Worker" }}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              :aria-checked="isOfficiating(member.id)"
              :aria-label="`Officiating for ${member.name}`"
              class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors"
              :class="isOfficiating(member.id) ? 'bg-ink' : 'bg-line'"
              @click="toggleOfficiating(member.id)"
            >
              <span
                aria-hidden="true"
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface transition-transform duration-200"
                :class="isOfficiating(member.id) ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <!-- Attendance segment: full-width touch targets, revealed only
               when the worker is officiating. -->
          <div
            v-if="isOfficiating(member.id)"
            class="mt-3 flex items-center gap-2"
          >
            <button
              type="button"
              :aria-pressed="isPresent(member.id)"
              class="h-11 flex-1 rounded-control border text-sm font-medium transition-colors"
              :class="
                isPresent(member.id)
                  ? 'border-success-line bg-success-surface text-success-text'
                  : 'border-line bg-surface text-muted hover:border-ink hover:text-ink'
              "
              @click="setStatus(member.id, 'present')"
            >
              Present
            </button>
            <button
              type="button"
              :aria-pressed="isPardoned(member.id)"
              class="h-11 flex-1 rounded-control border text-sm font-medium transition-colors"
              :class="
                isPardoned(member.id)
                  ? 'border-warning-line bg-warning-surface text-warning-text'
                  : 'border-line bg-surface text-muted hover:border-ink hover:text-ink'
              "
              @click="setStatus(member.id, 'pardoned')"
            >
              Excused
            </button>
            <span
              v-if="showAbsent(member.id)"
              class="inline-flex items-center rounded-badge border border-danger-line bg-danger-surface px-2.5 py-1.5 font-mono text-xs font-medium text-danger-text"
            >
              Absent
            </span>
          </div>
        </li>
      </ul>

      <!-- Desktop table -->
      <div class="hidden overflow-x-auto md:block">
        <table class="w-full">
          <caption class="sr-only">
            Attendance roster for members of the {{ unitName }} unit
          </caption>
          <thead>
            <tr class="border-b border-line bg-subtle">
              <th class="px-5 py-3 text-left font-mono text-xs font-medium text-muted">
                Worker
              </th>
              <th class="px-5 py-3 text-center font-mono text-xs font-medium text-muted">
                Officiating
              </th>
              <th class="px-5 py-3 text-center font-mono text-xs font-medium text-muted">
                Attendance
              </th>
              <th class="px-5 py-3 text-right font-mono text-xs font-medium text-muted">
                Result
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr
              v-for="member in members"
              :key="member.id"
              :class="isOfficiating(member.id) ? 'bg-subtle/40' : ''"
            >
              <td class="px-5 py-3.5">
                <p
                  class="text-sm font-medium"
                  :class="isOfficiating(member.id) ? 'text-ink' : 'text-muted'"
                >
                  {{ member.name }}
                </p>
                <p class="mt-0.5 font-mono text-xs font-medium text-muted">
                  {{ member.memberType === "EXECUTIVE" ? "Executive" : "Worker" }}
                </p>
              </td>

              <td class="px-5 py-3.5 text-center">
                <button
                  type="button"
                  role="switch"
                  :aria-checked="isOfficiating(member.id)"
                  :aria-label="`Officiating for ${member.name}`"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors"
                  :class="isOfficiating(member.id) ? 'bg-ink' : 'bg-line'"
                  @click="toggleOfficiating(member.id)"
                >
                  <span
                    aria-hidden="true"
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface transition-transform duration-200"
                    :class="isOfficiating(member.id) ? 'translate-x-5' : 'translate-x-0'"
                  />
                </button>
              </td>

              <td class="px-5 py-3.5 text-center">
                <div
                  v-if="isOfficiating(member.id)"
                  class="flex items-center justify-center gap-5"
                >
                  <label class="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      :name="`status-${member.id}`"
                      :checked="isPresent(member.id)"
                      class="h-4 w-4 cursor-pointer accent-ink"
                      @change="setStatus(member.id, 'present')"
                    >
                    <span class="text-sm text-muted">Present</span>
                  </label>
                  <label class="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      :name="`status-${member.id}`"
                      :checked="isPardoned(member.id)"
                      class="h-4 w-4 cursor-pointer accent-ink"
                      @change="setStatus(member.id, 'pardoned')"
                    >
                    <span class="text-sm text-muted">Excused</span>
                  </label>
                </div>
                <span v-else class="font-mono text-xs text-line">—</span>
              </td>

              <td class="px-5 py-3.5 text-right">
                <span v-if="!isOfficiating(member.id)" class="font-mono text-xs text-line">
                  —
                </span>
                <span
                  v-else-if="isPresent(member.id)"
                  class="inline-flex items-center rounded-badge border border-success-line bg-success-surface px-2 py-1 font-mono text-xs font-medium text-success-text"
                >
                  Present
                </span>
                <span
                  v-else-if="isPardoned(member.id)"
                  class="inline-flex items-center rounded-badge border border-warning-line bg-warning-surface px-2 py-1 font-mono text-xs font-medium text-warning-text"
                >
                  Excused
                </span>
                <span
                  v-else-if="showAbsent(member.id)"
                  class="inline-flex items-center rounded-badge border border-danger-line bg-danger-surface px-2 py-1 font-mono text-xs font-medium text-danger-text"
                >
                  Absent
                </span>
                <span v-else class="font-mono text-xs text-muted">Not marked</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Save area -->
      <div class="border-t border-line p-4 md:p-5">
        <div
          class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div class="w-full md:max-w-xl">
            <label
              for="attendance-comments"
              class="mb-1.5 block text-sm font-medium text-muted"
            >
              Additional comments
            </label>
            <textarea
              id="attendance-comments"
              v-model="additionalComments"
              rows="3"
              class="w-full resize-none rounded-control border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-ink"
              placeholder="Notes about this unit's attendance…"
            />
          </div>
          <AppButton
            size="lg"
            class="w-full md:w-auto"
            :loading="isSubmitting"
            @click="submitAttendance"
          >
            {{ isSubmitting ? "Saving…" : "Save attendance" }}
          </AppButton>
        </div>
      </div>
    </template>
  </AppCard>
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
const showAbsent = (id) =>
  isOfficiating(id) &&
  !isPresent(id) &&
  !isPardoned(id) &&
  absentIds.value.includes(id);

const officiatingCount = computed(() => officiatingIds.value.length);

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
    toast.error("Couldn't load the roster. Try again.");
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
    toast.success("Attendance saved.");
  } catch {
    toast.error("Couldn't save attendance. Try again.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
