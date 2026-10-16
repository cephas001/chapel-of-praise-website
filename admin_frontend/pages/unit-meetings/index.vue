<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5"
    >
      <!-- Left: Title & Description -->
      <div class="flex-1">
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Unit Meeting Attendance
        </h2>
        <p class="text-gray-500 text-xs md:text-sm max-w-2xl leading-relaxed">
          Record attendance by unit for each meeting. Every unit member is
          expected to attend unless excused.
        </p>
      </div>

      <!-- View Toggle -->
      <div class="flex bg-gray-100 p-1 rounded-xl shrink-0">
        <button
          :class="
            activeView === 'attendance'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-4 py-2 text-xs font-jetbrains rounded-lg transition-all"
          @click="activeView = 'attendance'"
        >
          Take Attendance
        </button>
        <button
          :class="
            activeView === 'records'
              ? 'bg-white text-black shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          "
          class="px-4 py-2 text-xs font-jetbrains rounded-lg transition-all"
          @click="switchToRecords"
        >
          Manage Records
        </button>
      </div>
    </div>

    <div
      v-show="activeView === 'attendance'"
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden px-4 md:px-6 py-10 md:py-12"
    >
      <!-- Select Unit & Date -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label
            for="unit-meeting-unit"
            class="block text-[11px] font-jetbrains font-bold text-black uppercase tracking-wide mb-2"
          >
            1. Select Unit
          </label>
          <div class="relative">
            <select
              id="unit-meeting-unit"
              v-model="selectedUnit"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none cursor-pointer font-jetbrains"
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

        <div>
          <label
            for="unit-meeting-date"
            class="block text-[11px] font-jetbrains font-bold text-black uppercase tracking-wide mb-2"
          >
            2. Meeting Date
          </label>
          <input
            id="unit-meeting-date"
            v-model="meetingDate"
            type="date"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm font-jetbrains"
          >
        </div>
      </div>

      <!-- Load failure: persistent error + retry; saving stays blocked meanwhile -->
      <div
        v-if="recordLoadState === 'failed'"
        class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <Icon
            name="heroicons:exclamation-triangle"
            class="h-5 w-5 text-red-600 shrink-0 mt-0.5"
          />
          <p class="text-xs md:text-sm text-red-800 font-jetbrains">
            Could not load the saved attendance for this date. Saving is blocked
            to avoid overwriting existing records.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors font-jetbrains shrink-0"
          @click="loadMeetingRecord"
        >
          Retry
        </button>
      </div>

      <!-- Stats -->
      <!-- <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
          <p
            class="text-[10px] md:text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-500 mb-2"
          >
            Members Loaded
          </p>
          <p class="text-xl md:text-2xl font-black text-black font-jetbrains">
            {{ members.length }}
          </p>
        </div>
        <div class="rounded-xl border border-green-100 bg-green-50/70 p-4">
          <p
            class="text-[10px] md:text-[11px] font-jetbrains font-bold uppercase tracking-wide text-green-700 mb-2"
          >
            Present
          </p>
          <p
            class="text-xl md:text-2xl font-black text-green-700 font-jetbrains"
          >
            {{ presentCount }}
          </p>
        </div>
        <div class="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
          <p
            class="text-[10px] md:text-[11px] font-jetbrains font-bold uppercase tracking-wide text-amber-700 mb-2"
          >
            Pardoned
          </p>
          <p
            class="text-xl md:text-2xl font-black text-amber-700 font-jetbrains"
          >
            {{ pardonedCount }}
          </p>
        </div>
        <div class="rounded-xl border border-red-100 bg-red-50/70 p-4">
          <p
            class="text-[10px] md:text-[11px] font-jetbrains font-bold uppercase tracking-wide text-red-700 mb-2"
          >
            Absent
          </p>
          <p class="text-xl md:text-2xl font-black text-red-700 font-jetbrains">
            {{ absentCount }}
          </p>
        </div>
      </div> -->

      <!-- Onboarding Tip & Legend -->
      <!-- Option 2: Refined Stack -->
      <div
        v-if="selectedUnit && members.length > 0"
        class="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3"
      >
        <Icon
          name="heroicons:light-bulb"
          class="h-5 w-5 text-blue-500 shrink-0"
        />
        <div class="flex flex-col gap-3">
          <p
            class="text-xs md:text-sm font-medium text-blue-900 leading-relaxed"
          >
            Tap a row to quickly cycle status. Long-press a row for quick
            actions. Use the Bulk Menu to mark many members at once.
          </p>

          <div class="flex flex-wrap items-center gap-2 mt-1">
            <span
              class="text-[10px] font-bold uppercase tracking-wider text-blue-500 mr-2"
            >
              Status Guide
            </span>

            <span
              class="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100/60 px-2 py-1 rounded border border-green-200"
            >
              <Icon
                name="heroicons:check-circle"
                class="h-4 w-4 text-green-600"
              />
              Present
            </span>

            <span
              class="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100/60 px-2 py-1 rounded border border-amber-200"
            >
              <Icon
                name="heroicons:shield-check"
                class="h-4 w-4 text-amber-600"
              />
              Excused
            </span>

            <span
              class="flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-100/60 px-2 py-1 rounded border border-red-200"
            >
              <Icon
                name="heroicons:minus-circle"
                class="h-4 w-4 text-red-500"
              />
              Absent
            </span>
          </div>
        </div>
      </div>

      <!-- Main Data Area -->
      <div class="border-t border-gray-100 -mx-4 md:-mx-6 px-2 md:px-4 mt-6">
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
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            No Members Found
          </h3>
          <p class="text-xs md:text-sm text-gray-500 max-w-sm mx-auto px-3">
            There are no registered members in the
            <span class="font-bold text-black">{{ selectedUnit }}</span> unit.
          </p>
        </div>

        <div v-else class="flex flex-col">
          <!-- Bulk Actions Header -->
          <div
            class="flex flex-wrap items-center justify-between bg-gray-50 border-b border-gray-200 p-3 rounded-t-xl gap-4"
          >
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="selectAllChecked"
                aria-label="Select all members"
                class="h-3 w-3 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
                @change="toggleSelectAll"
              >
              <span
                class="text-[11px] md:text-xs font-bold text-gray-700 font-jetbrains uppercase tracking-wide"
              >
                {{
                  selectedMembers.length > 0
                    ? `${selectedMembers.length} Selected`
                    : "Select All"
                }}
              </span>
            </div>

            <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                :disabled="selectedMembers.length === 0"
                class="px-3 py-1.5 text-[10px] md:text-xs font-jetbrains bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                @click="bulkMarkSelected('present')"
              >
                Mark Selected Present
              </button>
              <button
                :disabled="selectedMembers.length === 0"
                class="px-3 py-1.5 text-[10px] md:text-xs font-jetbrains bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                @click="bulkMarkSelected('pardoned')"
              >
                Mark Selected Excused
              </button>
              <button
                class="px-3 py-1.5 text-[10px] md:text-xs font-jetbrains text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors whitespace-nowrap shrink-0"
                @click="confirmMarkAllPresent"
              >
                Mark All Present
              </button>
              <button
                :disabled="selectedMembers.length === 0"
                class="px-3 py-1.5 text-[10px] md:text-xs font-jetbrains bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                @click="bulkMarkSelected('absent')"
              >
                Mark Selected Absent
              </button>
              <button
                v-if="selectedMembers.length > 0"
                class="px-2 py-1.5 text-[10px] md:text-xs font-jetbrains text-red-500 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
                @click="selectedMembers = []"
              >
                Clear
              </button>
            </div>
          </div>

          <!-- Roster List -->
          <div class="divide-y divide-gray-100 pt-3">
            <div
              v-for="member in members"
              :key="member.id"
              role="button"
              tabindex="0"
              :aria-label="`Cycle attendance status for ${member.name}`"
              class="group flex flex-col md:flex-row md:items-center justify-between p-4 transition-colors hover:bg-gray-50/80 cursor-pointer"
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
                  class="h-3 w-3 text-black focus:ring-black border-gray-300 rounded cursor-pointer"
                  @click.stop
                >
                <div>
                  <div class="text-[13px] md:text-sm text-black font-jetbrains">
                    {{ member.name }}
                  </div>
                  <div
                    class="text-[11px] font-jetbrains text-gray-500 mt-0.5 tracking-wide uppercase"
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
                    'border rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all text-[10px] md:text-xs font-jetbrains tracking-wide uppercase shrink-0',
                    getStatus(member.id) === 'present'
                      ? 'bg-green-100 text-green-800 border-green-200 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-600',
                  ]"
                  @click.stop="setStatus(member.id, 'present')"
                >
                  <Icon name="heroicons:check-circle" class="h-4 w-4" />
                </button>

                <!-- Excused -->
                <button
                  aria-label="Mark excused"
                  :class="[
                    'border rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all text-[10px] md:text-xs font-jetbrains tracking-wide uppercase shrink-0',
                    getStatus(member.id) === 'pardoned'
                      ? 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600',
                  ]"
                  @click.stop="setStatus(member.id, 'pardoned')"
                >
                  <Icon name="heroicons:shield-check" class="h-4 w-4" />
                </button>

                <!-- Absent (Default) -->
                <button
                  aria-label="Mark absent"
                  :class="[
                    'border rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all text-[10px] md:text-xs font-jetbrains tracking-wide uppercase shrink-0',
                    getStatus(member.id) === 'absent'
                      ? 'bg-red-100 text-red-800 border-red-300 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-500',
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
        class="border-t border-gray-200 bg-gray-50/50 mt-8 -mx-4 md:-mx-6 -mb-8 md:-mb-12 px-4 md:px-6 py-10 flex flex-col gap-4"
      >
        <div>
          <label
            for="unit-meeting-comments"
            class="block text-[11px] font-jetbrains font-bold text-black uppercase tracking-wide mb-3"
          >
            Additional Comments
          </label>
          <textarea
            id="unit-meeting-comments"
            v-model="additionalComments"
            class="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm resize-none"
            placeholder="Meeting notes, follow-up items, or special instructions..."
            rows="9"
            @input="triggerAutosave"
          />
        </div>
        <div class="flex justify-end items-center gap-4">
          <div
            v-if="lastSavedAt"
            class="text-[11px] font-jetbrains font-medium text-gray-500"
          >
            Last saved: {{ formatDateTime(lastSavedAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Manage Records View -->
    <div
      v-if="activeView === 'records'"
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div
        class="bg-gray-50/50 border-b border-gray-100 px-4 md:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h3 class="text-sm font-jetbrains font-bold text-black">
            Saved Meeting Records
          </h3>
          <p class="text-[11px] text-gray-500 mt-1">
            Remove records that were saved for the wrong unit or date.
          </p>
        </div>
        <button
          :disabled="isLoadingRecords"
          class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors font-jetbrains shrink-0"
          @click="fetchAllRecords"
        >
          <Icon
            name="heroicons:arrow-path"
            class="mr-2 h-3.5 w-3.5"
            :class="{ 'animate-spin': isLoadingRecords }"
          />
          Refresh
        </button>
      </div>

      <div v-if="isLoadingRecords" class="py-16 text-center">
        <Icon
          name="heroicons:arrow-path"
          class="mx-auto h-8 w-8 text-gray-300 animate-spin mb-3"
        />
        <p class="text-xs text-gray-500">Loading records...</p>
      </div>

      <div v-else-if="allRecords.length === 0" class="py-16 text-center">
        <Icon
          name="heroicons:clipboard-document-list"
          class="mx-auto h-12 w-12 text-gray-300 mb-4"
        />
        <h3 class="text-sm font-jetbrains font-bold text-gray-900 mb-1">
          No meeting records found
        </h3>
        <p class="text-xs text-gray-500">
          Saved unit meeting attendance will appear here.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <caption class="sr-only">Saved unit meeting records</caption>
          <thead class="bg-gray-50/50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Unit
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Meeting Date
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Attendance
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Last Saved
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="record in allRecords"
              :key="record.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-gray-100 text-gray-700"
                >
                  {{ record.unitName }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-xs md:text-sm font-jetbrains text-gray-900"
              >
                {{ formatMeetingDate(record.meetingDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3 text-xs font-jetbrains">
                  <span class="text-green-700 font-bold">
                    {{ record.presentIds?.length || 0 }} present
                  </span>
                  <span class="text-amber-700 font-bold">
                    {{ record.pardonedIds?.length || 0 }} excused
                  </span>
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-jetbrains"
              >
                {{ record.updatedAt ? formatDateTime(record.updatedAt) : "—" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button
                  class="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
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
    </div>

    <!-- Undo Toast/Banner -->
    <Transition name="fade-up">
      <div
        v-if="undoHistory"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/90 backdrop-blur-md px-5 py-3 rounded-full shadow-2xl border border-gray-800"
      >
        <span class="text-xs text-white font-medium">Bulk action applied.</span>
        <button
          class="text-xs text-[#e94e4e] hover:text-white transition-colors uppercase tracking-widest font-jetbrains"
          @click="performUndo"
        >
          Undo
        </button>
        <button
          aria-label="Dismiss undo banner"
          class="text-gray-400 hover:text-white p-1"
          @click="undoHistory = null"
        >
          <Icon name="heroicons:x-mark" class="h-4 w-4" />
        </button>
      </div>
    </Transition>

    <!-- Fixed Save Button & Sync Status Badge -->
    <div
      v-if="activeView === 'attendance' && selectedUnit && members.length > 0"
      class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
    >
      <button
        :disabled="
          !selectedUnit ||
          isFetching ||
          syncState === 'saving' ||
          members.length === 0 ||
          recordLoadState === 'failed'
        "
        class="flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 shadow-lg border border-gray-800 text-white hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        title="Save Changes"
        @click="saveAttendance"
      >
        <Icon
          v-if="syncState === 'saving'"
          name="heroicons:cloud-arrow-up"
          class="h-5 w-5 animate-spin"
        />
        <Icon v-else name="heroicons:cloud-arrow-up" class="h-5 w-5" />
        <span class="text-xs font-jetbrains font-bold">
          {{ syncState === "saving" ? "Saving..." : "Save Changes" }}
        </span>
      </button>

      <div
          class="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-300"
          :class="[
            syncState === 'synced'
              ? 'bg-green-50 border-green-200 text-green-700'
              : syncState === 'modified'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : syncState === 'saving'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-red-50 border-red-200 text-red-700',
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
            <span class="text-xs font-jetbrains leading-tight">
              {{
                syncState === "synced"
                  ? "Saved"
                  : syncState === "modified"
                    ? "Unsaved"
                    : syncState === "saving"
                      ? "Saving..."
                      : "Save failed"
              }}
            </span>
            <span class="text-[10px] opacity-70 leading-tight mt-0.5">
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
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        @click="quickActionMember = null"
      />
      <div
        class="relative bg-white rounded-xl shadow-xl w-full max-w-sm m-4 p-5"
      >
        <h3 class="text-sm font-bold text-black mb-1">
          {{ quickActionMember.name }}
        </h3>
        <p class="text-xs text-gray-500 mb-5">Quick Actions</p>

        <div class="flex flex-col gap-2">
          <button
            class="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-green-50 text-left border border-gray-100 transition-colors"
            @click="applyQuickAction('present')"
          >
            <Icon
              name="heroicons:check-circle"
              class="h-5 w-5 text-green-600"
            />
            <span class="text-sm font-bold text-gray-800">Mark Present</span>
          </button>
          <button
            class="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-amber-50 text-left border border-gray-100 transition-colors"
            @click="applyQuickAction('pardoned')"
          >
            <Icon
              name="heroicons:shield-check"
              class="h-5 w-5 text-amber-600"
            />
            <span class="text-sm font-bold text-gray-800">Mark Excused</span>
          </button>
          <button
            class="mt-2 text-center text-xs text-gray-500 hover:text-black py-2"
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
    title: "Mark All Present",
    message: "Are you sure you want to mark ALL members as present?",
    confirmText: "Yes, Mark All",
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
    title: "Delete Meeting Record",
    message: `Delete the ${record.unitName} meeting record for ${formatMeetingDate(record.meetingDate)}? This cannot be undone.`,
    confirmText: "Yes, Delete",
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
      title: "Unsaved Changes",
      message:
        "You have unsaved attendance changes for this meeting. Switch units and discard them?",
      confirmText: "Discard & Switch",
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
      title: "Unsaved Changes",
      message:
        "You have unsaved attendance changes for this date. Switch dates and discard them?",
      confirmText: "Discard & Switch",
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
