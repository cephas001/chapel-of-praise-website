<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <AppHeading
      class="mb-8"
      title="Unit meeting attendance"
      subtitle="Record attendance by unit for each meeting. Every unit member is expected to attend unless excused."
    >
      <template #actions>
        <div class="flex shrink-0 rounded-control bg-subtle p-1">
          <button
            :class="
              activeView === 'attendance'
                ? 'bg-surface text-ink'
                : 'text-muted hover:text-ink'
            "
            class="rounded-control px-4 py-2 text-xs font-medium transition-colors"
            @click="activeView = 'attendance'"
          >
            Take attendance
          </button>
          <button
            :class="
              activeView === 'records'
                ? 'bg-surface text-ink'
                : 'text-muted hover:text-ink'
            "
            class="rounded-control px-4 py-2 text-xs font-medium transition-colors"
            @click="switchToRecords"
          >
            Manage records
          </button>
        </div>
      </template>
    </AppHeading>

    <AppCard
      v-show="activeView === 'attendance'"
      body-class="px-4 py-10 md:px-6 md:py-12"
    >
      <!-- Select Unit & Date -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label
            for="unit-meeting-unit"
            class="mb-2 block text-xs font-medium text-ink"
          >
            1. Select unit
          </label>
          <div class="relative">
            <select
              id="unit-meeting-unit"
              v-model="selectedUnit"
              class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
            >
              <option value="" disabled>Choose unit…</option>
              <option v-for="unit in availableUnits" :key="unit" :value="unit">
                {{ unit }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:chevron-down"
                class="h-4 w-4 text-muted"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            for="unit-meeting-date"
            class="mb-2 block text-xs font-medium text-ink"
          >
            2. Meeting date
          </label>
          <input
            id="unit-meeting-date"
            v-model="meetingDate"
            type="date"
            class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 font-mono text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          >
        </div>
      </div>

      <!-- Load failure: persistent error + retry; saving stays blocked meanwhile -->
      <div
        v-if="recordLoadState === 'failed'"
        class="mb-8 flex flex-col gap-3 rounded-surface border border-danger-line bg-danger-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <Icon
            name="heroicons:exclamation-triangle"
            class="mt-0.5 h-5 w-5 shrink-0 text-danger-text"
          />
          <p class="text-xs text-danger-text md:text-sm">
            Could not load the saved attendance for this date. Saving is blocked
            to avoid overwriting existing records.
          </p>
        </div>
        <AppButton
          variant="secondary"
          size="sm"
          class="shrink-0"
          @click="loadMeetingRecord"
        >
          Retry
        </AppButton>
      </div>

      <!-- Onboarding Tip & Legend -->
      <!-- Option 2: Refined Stack -->
      <div
        v-if="selectedUnit && members.length > 0"
        class="mb-6 flex items-start gap-3 rounded-surface border border-line bg-subtle p-4"
      >
        <Icon
          name="heroicons:light-bulb"
          class="h-5 w-5 shrink-0 text-muted"
        />
        <div class="flex flex-col gap-3">
          <p
            class="text-xs font-medium leading-relaxed text-ink md:text-sm"
          >
            Tap a row to quickly cycle status. Long-press a row for quick
            actions. Use the Bulk Menu to mark many members at once.
          </p>

          <div class="mt-1 flex flex-wrap items-center gap-2">
            <span class="mr-2 font-mono text-xs text-muted">
              Status guide
            </span>

            <span
              class="flex items-center gap-1.5 rounded-badge border border-success-line bg-success-surface px-2 py-1 text-xs font-medium text-success-text"
            >
              <Icon
                name="heroicons:check-circle"
                class="h-4 w-4 text-success-text"
              />
              Present
            </span>

            <span
              class="flex items-center gap-1.5 rounded-badge border border-warning-line bg-warning-surface px-2 py-1 text-xs font-medium text-warning-text"
            >
              <Icon
                name="heroicons:shield-check"
                class="h-4 w-4 text-warning-text"
              />
              Excused
            </span>

            <span
              class="flex items-center gap-1.5 rounded-badge border border-danger-line bg-danger-surface px-2 py-1 text-xs font-medium text-danger-text"
            >
              <Icon
                name="heroicons:minus-circle"
                class="h-4 w-4 text-danger-text"
              />
              Absent
            </span>
          </div>
        </div>
      </div>

      <!-- Main Data Area -->
      <div class="mt-6 -mx-4 border-t border-line px-2 md:-mx-6 md:px-4">
        <div v-if="!selectedUnit" class="py-14 text-center">
          <Icon
            name="heroicons:clipboard-document-check"
            class="mx-auto mb-4 h-12 w-12 text-line"
          />
          <h3 class="mb-1 text-sm font-semibold text-ink">
            Select a unit
          </h3>
          <p class="mx-auto max-w-sm px-3 text-xs text-muted">
            Choose a unit above to load the attendance roster for the selected
            meeting date.
          </p>
        </div>

        <div v-else-if="members.length === 0" class="py-16 text-center">
          <Icon
            name="heroicons:users"
            class="mx-auto mb-4 h-12 w-12 text-line"
          />
          <h3 class="mb-1 text-base font-semibold text-ink">
            No members found
          </h3>
          <p class="mx-auto max-w-sm px-3 text-xs text-muted md:text-sm">
            There are no registered members in the
            <span class="font-semibold text-ink">{{ selectedUnit }}</span> unit.
          </p>
        </div>

        <div v-else class="flex flex-col">
          <!-- Bulk Actions Header -->
          <div
            class="flex flex-wrap items-center justify-between gap-4 rounded-t-surface border-b border-line bg-subtle p-3"
          >
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="selectAllChecked"
                aria-label="Select all members"
                class="h-4 w-4 cursor-pointer rounded-badge border-line accent-ink"
                @change="toggleSelectAll"
              >
              <span class="font-mono text-xs font-medium text-ink">
                {{
                  selectedMembers.length > 0
                    ? `${selectedMembers.length} selected`
                    : "Select all"
                }}
              </span>
            </div>

            <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                :disabled="selectedMembers.length === 0"
                class="shrink-0 whitespace-nowrap rounded-control border border-line bg-surface px-3 py-1.5 text-xs text-ink transition hover:bg-subtle disabled:opacity-50"
                @click="bulkMarkSelected('present')"
              >
                Mark selected present
              </button>
              <button
                :disabled="selectedMembers.length === 0"
                class="shrink-0 whitespace-nowrap rounded-control border border-line bg-surface px-3 py-1.5 text-xs text-ink transition hover:bg-subtle disabled:opacity-50"
                @click="bulkMarkSelected('pardoned')"
              >
                Mark selected excused
              </button>
              <button
                class="shrink-0 whitespace-nowrap rounded-control border border-success-line bg-success-surface px-3 py-1.5 text-xs font-medium text-success-text transition-colors hover:border-success-text"
                @click="confirmMarkAllPresent"
              >
                Mark all present
              </button>
              <button
                :disabled="selectedMembers.length === 0"
                class="shrink-0 whitespace-nowrap rounded-control border border-danger-line bg-surface px-3 py-1.5 text-xs text-danger-text transition hover:bg-danger-surface disabled:opacity-50"
                @click="bulkMarkSelected('absent')"
              >
                Mark selected absent
              </button>
              <button
                v-if="selectedMembers.length > 0"
                class="shrink-0 whitespace-nowrap rounded-control px-2 py-1.5 text-xs text-danger-text transition-colors hover:bg-danger-surface"
                @click="selectedMembers = []"
              >
                Clear
              </button>
            </div>
          </div>

          <!-- Roster List -->
          <div class="divide-y divide-line pt-3">
            <div
              v-for="member in members"
              :key="member.id"
              role="button"
              tabindex="0"
              :aria-label="`Cycle attendance status for ${member.name}`"
              class="group flex cursor-pointer flex-col justify-between p-4 transition-colors hover:bg-subtle/60 md:flex-row md:items-center"
              @click="cycleStatus(member.id)"
              @keydown.enter.self.prevent="cycleStatus(member.id)"
              @keydown.space.self.prevent="cycleStatus(member.id)"
              @contextmenu.prevent="openQuickActions(member)"
            >
              <!-- Member Info -->
              <div class="flex items-center gap-4 mb-4 md:mb-0">
                <input
                  v-model="selectedMembers"
                  type="checkbox"
                  :value="member.id"
                  :aria-label="`Select ${member.name}`"
                  class="h-4 w-4 cursor-pointer rounded-badge border-line accent-ink"
                  @click.stop
                >
                <div>
                  <div class="text-sm text-ink">
                    {{ member.name }}
                  </div>
                  <div
                    class="mt-0.5 font-mono text-xs text-muted"
                  >
                    {{
                      member.memberType === "EXECUTIVE" ? "Executive" : "Member"
                    }}
                  </div>
                </div>
              </div>

              <!-- Inline Quick Buttons -->
              <div
                class="flex items-center gap-2 pl-8 md:pl-0 overflow-x-auto scrollbar-hide pb-1 sm:pb-0"
              >
                <!-- Present -->
                <button
                  aria-label="Mark present"
                  :class="[
                    'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
                    getStatus(member.id) === 'present'
                      ? 'border-success-line bg-success-surface text-success-text'
                      : 'border-line bg-surface text-muted hover:border-ink hover:text-ink',
                  ]"
                  @click.stop="setStatus(member.id, 'present')"
                >
                  <Icon name="heroicons:check-circle" class="h-4 w-4" />
                </button>

                <!-- Excused -->
                <button
                  aria-label="Mark excused"
                  :class="[
                    'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
                    getStatus(member.id) === 'pardoned'
                      ? 'border-warning-line bg-warning-surface text-warning-text'
                      : 'border-line bg-surface text-muted hover:border-ink hover:text-ink',
                  ]"
                  @click.stop="setStatus(member.id, 'pardoned')"
                >
                  <Icon name="heroicons:shield-check" class="h-4 w-4" />
                </button>

                <!-- Absent (Default) -->
                <button
                  aria-label="Mark absent"
                  :class="[
                    'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
                    getStatus(member.id) === 'absent'
                      ? 'border-danger-line bg-danger-surface text-danger-text'
                      : 'border-line bg-surface text-muted hover:border-ink hover:text-ink',
                  ]"
                  @click.stop="setStatus(member.id, 'absent')"
                >
                  <Icon name="heroicons:minus-circle" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-8 -mx-4 -mb-8 flex flex-col gap-4 border-t border-line bg-subtle/50 px-4 py-10 md:-mx-6 md:-mb-12 md:px-6"
      >
        <div>
          <label
            for="unit-meeting-comments"
            class="mb-3 block text-xs font-medium text-ink"
          >
            Additional comments
          </label>
          <textarea
            id="unit-meeting-comments"
            v-model="additionalComments"
            class="w-full resize-none rounded-control border border-line bg-surface px-4 py-3 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
            placeholder="Meeting notes, follow-up items, or special instructions…"
            rows="9"
            @input="triggerAutosave"
          />
        </div>
        <div class="flex items-center justify-end gap-4">
          <div
            v-if="lastSavedAt"
            class="font-mono text-xs font-medium text-muted"
          >
            Last saved: {{ formatDateTime(lastSavedAt) }}
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Manage Records View -->
    <AppCard v-if="activeView === 'records'" body-class="p-0">
      <template #header>
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 class="text-base font-semibold text-ink">
              Saved meeting records
            </h3>
            <p class="mt-1 text-xs text-muted">
              Remove records that were saved for the wrong unit or date.
            </p>
          </div>
          <AppButton
            variant="secondary"
            size="sm"
            icon="heroicons:arrow-path"
            :loading="isLoadingRecords"
            class="shrink-0"
            @click="fetchAllRecords"
          >
            Refresh
          </AppButton>
        </div>
      </template>

      <div v-if="isLoadingRecords" class="py-16 text-center">
        <Icon
          name="heroicons:arrow-path"
          class="mx-auto mb-3 h-8 w-8 animate-spin text-line"
        />
        <p class="text-xs text-muted">Loading records…</p>
      </div>

      <div v-else-if="allRecords.length === 0" class="py-16 text-center">
        <Icon
          name="heroicons:clipboard-document-list"
          class="mx-auto mb-4 h-12 w-12 text-line"
        />
        <h3 class="mb-1 text-sm font-semibold text-ink">
          No meeting records found
        </h3>
        <p class="text-xs text-muted">
          Saved unit meeting attendance will appear here.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-line">
          <caption class="sr-only">Saved unit meeting records</caption>
          <thead class="bg-subtle">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Unit
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Meeting date
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Attendance
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Last saved
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-line">
            <tr
              v-for="record in allRecords"
              :key="record.id"
              class="transition-colors hover:bg-subtle/40"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center rounded-badge border border-line bg-subtle px-2.5 py-1 font-mono text-xs font-medium text-muted"
                >
                  {{ record.unitName }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap font-mono text-xs text-ink md:text-sm"
              >
                {{ formatMeetingDate(record.meetingDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3 font-mono text-xs">
                  <span class="font-semibold text-success-text">
                    {{ record.presentIds?.length || 0 }} present
                  </span>
                  <span class="font-semibold text-warning-text">
                    {{ record.pardonedIds?.length || 0 }} excused
                  </span>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap font-mono text-xs text-muted"
              >
                {{ record.updatedAt ? formatDateTime(record.updatedAt) : "—" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button
                  class="rounded-control p-2 text-muted transition-colors hover:bg-danger-surface hover:text-danger-text"
                  title="Delete record"
                  aria-label="Delete record"
                  @click="deleteRecord(record)"
                >
                  <Icon name="heroicons:trash" class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>

    <!-- Undo Toast/Banner -->
    <Transition name="fade-up">
      <div
        v-if="undoHistory"
        class="fixed bottom-6 left-1/2 z-overlay flex -translate-x-1/2 items-center gap-4 rounded-full border border-line bg-surface px-5 py-3 shadow-overlay"
      >
        <span class="text-xs font-medium text-ink">Bulk action applied.</span>
        <button
          class="text-xs font-medium text-danger-text transition-colors hover:text-ink"
          @click="performUndo"
        >
          Undo
        </button>
        <button
          aria-label="Dismiss undo banner"
          class="p-1 text-muted transition-colors hover:text-ink"
          @click="undoHistory = null"
        >
          <Icon name="heroicons:x-mark" class="h-4 w-4" />
        </button>
      </div>
    </Transition>

    <!-- Fixed Save Button & Sync Status Badge -->
    <div
      v-if="activeView === 'attendance' && selectedUnit && members.length > 0"
      class="fixed bottom-6 right-6 z-chrome flex flex-col items-end gap-2"
    >
      <AppButton
        size="lg"
        icon="heroicons:cloud-arrow-up"
        :loading="syncState === 'saving'"
        :disabled="
          !selectedUnit ||
          isFetching ||
          syncState === 'saving' ||
          members.length === 0 ||
          recordLoadState === 'failed'
        "
        class="shadow-overlay"
        title="Save changes"
        @click="saveAttendance"
      >
        {{ syncState === "saving" ? "Saving…" : "Save changes" }}
      </AppButton>

      <div
          class="flex items-center gap-3 rounded-surface border px-4 py-3 shadow-overlay backdrop-blur-sm transition-colors"
          :class="[
            syncState === 'synced'
              ? 'border-success-line bg-success-surface text-success-text'
              : syncState === 'modified'
                ? 'border-warning-line bg-warning-surface text-warning-text'
                : syncState === 'saving'
                  ? 'border-line bg-surface text-ink'
                  : 'border-danger-line bg-danger-surface text-danger-text',
          ]"
        >
          <Icon
            :name="
              syncState === 'synced'
                ? 'heroicons:check-circle'
                : syncState === 'modified'
                  ? 'heroicons:cloud'
                  : syncState === 'saving'
                    ? 'heroicons:arrow-path'
                    : 'heroicons:exclamation-triangle'
            "
            class="h-5 w-5 shrink-0"
            :class="{ 'animate-spin': syncState === 'saving' }"
          />
          <div class="flex flex-col">
            <span class="text-xs font-medium leading-tight">
              {{
                syncState === "synced"
                  ? "Saved"
                  : syncState === "modified"
                    ? "Unsaved"
                    : syncState === "saving"
                      ? "Saving…"
                      : "Save failed"
              }}
            </span>
            <span class="mt-0.5 text-xs leading-tight opacity-70">
              {{
                syncState === "synced"
                  ? "All changes synced"
                  : syncState === "modified"
                    ? "Pending changes"
                    : syncState === "saving"
                      ? "Syncing to server"
                      : "Check connection"
              }}
            </span>
          </div>
        </div>
    </div>

    <!-- Quick Actions Modal (Long Press) -->
    <div
      v-if="quickActionMember"
      class="fixed inset-0 z-overlay flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-hidden="true"
        @click="quickActionMember = null"
      />
      <div
        class="relative m-4 w-full max-w-sm rounded-surface border border-line bg-surface p-5 shadow-overlay"
      >
        <h3 class="mb-1 text-sm font-semibold text-ink">
          {{ quickActionMember.name }}
        </h3>
        <p class="mb-5 text-xs text-muted">Quick actions</p>

        <div class="flex flex-col gap-2">
          <button
            class="flex w-full items-center gap-3 rounded-control border border-line p-3 text-left transition-colors hover:bg-success-surface"
            @click="applyQuickAction('present')"
          >
            <Icon
              name="heroicons:check-circle"
              class="h-5 w-5 text-success-text"
            />
            <span class="text-sm font-medium text-ink">Mark present</span>
          </button>
          <button
            class="flex w-full items-center gap-3 rounded-control border border-line p-3 text-left transition-colors hover:bg-warning-surface"
            @click="applyQuickAction('pardoned')"
          >
            <Icon
              name="heroicons:shield-check"
              class="h-5 w-5 text-warning-text"
            />
            <span class="text-sm font-medium text-ink">Mark excused</span>
          </button>
          <button
            class="mt-2 py-2 text-center text-xs text-muted transition-colors hover:text-ink"
            @click="quickActionMember = null"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { useConfirm } from "~/composables/useConfirm";
import { useAppToast } from "~/composables/useAppToast";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast();
const confirm = useConfirm();

const { units: availableUnits, loadUnits } = useChapelUnits();

onMounted(loadUnits);

const selectedUnit = ref("");
const meetingDate = ref(getTodayIso());
const members = ref([]);
const attendanceByMember = ref({});
const additionalComments = ref("");
const lastSavedAt = ref("");
const isFetching = ref(false);
const isSaving = ref(false);

// Bulk Actions & UX State
const selectedMembers = ref([]);
const undoHistory = ref(null);
const autosaveTimer = ref(null);
const syncState = ref("synced"); // 'synced', 'modified', 'saving', 'error'
const recordLoadState = ref("idle"); // 'idle', 'loading', 'loaded', 'new', 'failed'
const userEdited = ref(false);
const quickActionMember = ref(null);

// Manage Records state
const activeView = ref("attendance");
const allRecords = ref([]);
const isLoadingRecords = ref(false);
const hasLoadedRecords = ref(false);

const selectAllChecked = computed(() => {
  return (
    members.value.length > 0 &&
    selectedMembers.value.length === members.value.length
  );
});

// Warn before leaving with unsaved attendance edits
const isDirty = computed(
  () => userEdited.value && syncState.value !== "synced",
);

useUnsavedChanges(isDirty, {
  message:
    "You have unsaved attendance changes for this meeting. Leave anyway and discard them?",
});

// Utilities
function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatus(memberId) {
  // Default to absent visually and functionally if not marked
  return attendanceByMember.value[String(memberId)] || "absent";
}

function setStatus(memberId, status) {
  attendanceByMember.value = {
    ...attendanceByMember.value,
    [String(memberId)]: status,
  };
  triggerAutosave();
}

function cycleStatus(memberId) {
  const current = getStatus(memberId);
  if (current === "absent") setStatus(memberId, "present");
  else if (current === "present") setStatus(memberId, "pardoned");
  else setStatus(memberId, "absent");
}

// Autosave Logic
function triggerAutosave() {
  userEdited.value = true;
  if (recordLoadState.value === "failed") {
    syncState.value = "error";
    return;
  }
  syncState.value = "modified";
  if (autosaveTimer.value) clearTimeout(autosaveTimer.value);
  autosaveTimer.value = setTimeout(async () => {
    await saveAttendance();
  }, 1200);
}

// Bulk Logic
function toggleSelectAll() {
  if (selectAllChecked.value) {
    selectedMembers.value = [];
  } else {
    selectedMembers.value = members.value.map((m) => m.id);
  }
}

let undoTimer = null;

function snapshotForUndo() {
  undoHistory.value = { ...attendanceByMember.value };
  // Hide undo after 10 seconds. Clear any previous timer first so it cannot
  // dismiss a newer snapshot (undo race).
  if (undoTimer) clearTimeout(undoTimer);
  undoTimer = setTimeout(() => {
    undoHistory.value = null;
    undoTimer = null;
  }, 10000);
}

function performUndo() {
  if (undoHistory.value) {
    attendanceByMember.value = { ...undoHistory.value };
    undoHistory.value = null;
    if (undoTimer) {
      clearTimeout(undoTimer);
      undoTimer = null;
    }
    toast.success("Changes reverted.");
    triggerAutosave();
  }
}

async function confirmMarkAllPresent() {
  const answer = await confirm.ask({
    title: "Mark all present",
    message: "Are you sure you want to mark all members as present?",
    confirmText: "Yes, mark all",
    cancelText: "Cancel",
  });
  if (answer) {
    snapshotForUndo();
    const updates = {};
    members.value.forEach((m) => (updates[String(m.id)] = "present"));
    attendanceByMember.value = { ...attendanceByMember.value, ...updates };
    triggerAutosave();
    selectedMembers.value = [];
  }
}

function bulkMarkSelected(status) {
  snapshotForUndo();
  const updates = {};
  selectedMembers.value.forEach((id) => {
    updates[String(id)] = status;
  });
  attendanceByMember.value = { ...attendanceByMember.value, ...updates };
  triggerAutosave();
  selectedMembers.value = [];
}

function openQuickActions(member) {
  quickActionMember.value = member;
}

function applyQuickAction(status) {
  if (quickActionMember.value) {
    setStatus(quickActionMember.value.id, status);
  }
  quickActionMember.value = null;
}

// Data Fetching & Saving
async function loadMeetingRecord() {
  if (!selectedUnit.value || !meetingDate.value) return;

  recordLoadState.value = "loading";
  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/unit-meetings/${selectedUnit.value}/${meetingDate.value}`,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    attendanceByMember.value = response.attendanceByMember || {};
    additionalComments.value = response.additionalComments || "";
    lastSavedAt.value = response.updatedAt || "";
    recordLoadState.value = "loaded";
    syncState.value = "synced";
  } catch (error) {
    if (error?.status === 404 || error?.response?.status === 404) {
      attendanceByMember.value = {};
      additionalComments.value = "";
      lastSavedAt.value = "";
      recordLoadState.value = "new";
      syncState.value = "synced";
      return;
    }
    console.error("Failed to load unit meeting record", error);
    attendanceByMember.value = {};
    additionalComments.value = "";
    lastSavedAt.value = "";
    recordLoadState.value = "failed";
    syncState.value = "error";
    toast.error(
      "Could not load the saved attendance for this date. Saving is blocked to avoid overwriting existing records.",
    );
  }
}

async function loadMembersForUnit() {
  if (!selectedUnit.value) return;
  isFetching.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/members/unit/${selectedUnit.value}`,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );

    members.value = response
      .map((m) => ({
        ...m,
        name: toTitleCase(m.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    selectedMembers.value = [];
    await loadMeetingRecord();
  } catch (error) {
    console.error("Failed to load unit members", error);
    members.value = [];
    toast.error("Could not load unit members for this meeting.");
  } finally {
    isFetching.value = false;
  }
}

async function saveAttendance() {
  if (!selectedUnit.value || members.value.length === 0 || !meetingDate.value)
    return;

  if (recordLoadState.value === "failed") {
    syncState.value = "error";
    toast.error(
      "The saved attendance for this date could not be loaded. Reselect the unit or date before saving to avoid overwriting data.",
    );
    return;
  }

  isSaving.value = true;
  syncState.value = "saving";

  try {
    const payload = {
      unitName: selectedUnit.value,
      meetingDate: meetingDate.value,
      attendanceByMember: attendanceByMember.value,
      presentIds: members.value
        .filter((m) => getStatus(m.id) === "present")
        .map((m) => m.id),
      pardonedIds: members.value
        .filter((m) => getStatus(m.id) === "pardoned")
        .map((m) => m.id),
      additionalComments: additionalComments.value,
    };

    const response = await $fetch(
      `${config.public.apiBase}/admin/unit-meetings`,
      {
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    lastSavedAt.value = response.data.updatedAt;
    syncState.value = "synced";
    hasLoadedRecords.value = false;
  } catch (error) {
    console.error("Failed to save unit meeting attendance", error);
    toast.error("Could not save the unit meeting attendance.");
    syncState.value = "error";
  } finally {
    isSaving.value = false;
  }
}

// Manage Records
async function fetchAllRecords() {
  isLoadingRecords.value = true;
  try {
    allRecords.value = await $fetch(
      `${config.public.apiBase}/admin/unit-meetings`,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    hasLoadedRecords.value = true;
  } catch (error) {
    console.error("Failed to load meeting records", error);
    toast.error("Could not load saved meeting records.");
  } finally {
    isLoadingRecords.value = false;
  }
}

function switchToRecords() {
  activeView.value = "records";
  if (!hasLoadedRecords.value && !isLoadingRecords.value) {
    fetchAllRecords();
  }
}

async function deleteRecord(record) {
  const answer = await confirm.ask({
    title: "Delete meeting record",
    message: `Delete the ${record.unitName} meeting record for ${formatMeetingDate(record.meetingDate)}? This cannot be undone.`,
    confirmText: "Yes, delete",
    cancelText: "Cancel",
  });
  if (!answer) return;

  try {
    await $fetch(
      `${config.public.apiBase}/admin/unit-meetings/${encodeURIComponent(record.unitName)}/${record.meetingDate}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    allRecords.value = allRecords.value.filter((r) => r.id !== record.id);
    toast.success("Meeting record deleted.");

    // Reset the editor if the deleted record is currently open
    if (
      selectedUnit.value === record.unitName &&
      meetingDate.value === record.meetingDate
    ) {
      attendanceByMember.value = {};
      additionalComments.value = "";
      lastSavedAt.value = "";
      syncState.value = "synced";
    }
  } catch (error) {
    console.error("Failed to delete meeting record", error);
    toast.error("Could not delete the meeting record.");
  }
}

function formatMeetingDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(
    dateString.length === 10 ? `${dateString}T00:00:00` : dateString,
  );
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

let suppressUnitWatch = false;
watch(selectedUnit, async (unit, previousUnit) => {
  if (suppressUnitWatch) {
    suppressUnitWatch = false;
    return;
  }
  if (previousUnit && isDirty.value) {
    const switchAnyway = await confirm.ask({
      title: "Unsaved changes",
      message:
        "You have unsaved attendance changes for this meeting. Switch units and discard them?",
      confirmText: "Discard & switch",
      cancelText: "Stay",
      isDestructive: true,
    });
    if (!switchAnyway) {
      suppressUnitWatch = true;
      selectedUnit.value = previousUnit;
      return;
    }
  }
  members.value = [];
  attendanceByMember.value = {};
  additionalComments.value = "";
  lastSavedAt.value = "";
  undoHistory.value = null;
  if (undoTimer) {
    clearTimeout(undoTimer);
    undoTimer = null;
  }
  selectedMembers.value = [];
  recordLoadState.value = "idle";
  userEdited.value = false;
  if (unit) await loadMembersForUnit();
});

let suppressDateWatch = false;
watch(meetingDate, async (date, previousDate) => {
  if (suppressDateWatch) {
    suppressDateWatch = false;
    return;
  }
  if (previousDate && isDirty.value) {
    const switchAnyway = await confirm.ask({
      title: "Unsaved changes",
      message:
        "You have unsaved attendance changes for this date. Switch dates and discard them?",
      confirmText: "Discard & switch",
      cancelText: "Stay",
      isDestructive: true,
    });
    if (!switchAnyway) {
      suppressDateWatch = true;
      meetingDate.value = previousDate;
      return;
    }
  }
  userEdited.value = false;
  if (selectedUnit.value) {
    await loadMeetingRecord();
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
