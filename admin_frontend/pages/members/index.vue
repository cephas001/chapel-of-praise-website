<!-- pages/members/index.vue -->
<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Chapel Workforce
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        View the complete directory of workers and executives grouped by unit.
      </p>
    </div>

    <!-- Directory Controls -->
    <div
      class="mb-8 rounded-xl border border-gray-200 bg-white p-4 flex flex-col lg:flex-row gap-3 lg:items-center shadow-sm"
    >
      <div class="relative flex-1 min-w-0">
        <label for="members-search" class="sr-only">Search members</label>
        <Icon
          name="heroicons:magnifying-glass"
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
        <input
          id="members-search"
          v-model="search"
          type="search"
          placeholder="Search by name, email, phone or unit..."
          class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white"
        >
      </div>

      <div class="flex flex-col sm:flex-row gap-3 shrink-0">
        <div>
          <label for="members-type-filter" class="sr-only">
            Filter by member type
          </label>
          <select
            id="members-type-filter"
            v-model="filters.memberType"
            class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
          >
            <option value="ALL">All member types</option>
            <option value="WORKER">Workers only</option>
            <option value="EXECUTIVE">Executives only</option>
          </select>
        </div>

        <div>
          <label for="members-gender-filter" class="sr-only">
            Filter by gender
          </label>
          <select
            id="members-gender-filter"
            v-model="filters.gender"
            class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
          >
            <option value="ALL">All genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <label for="members-sort" class="sr-only">Sort members</label>
          <select
            id="members-sort"
            v-model="sortOption"
            class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
          >
            <option value="name:asc">Name A–Z</option>
            <option value="name:desc">Name Z–A</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-500 animate-spin mb-4"
      />
      <h3
        class="text-xs md:text-sm font-bold text-gray-900 font-jetbrains animate-pulse"
      >
        Loading workforce directory...
      </h3>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="members.length === 0"
      class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
    >
      <Icon
        name="heroicons:user-group"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900 mb-1 font-jetbrains">
        No members found
      </h3>
      <p class="text-gray-500 text-xs md:text-sm mb-6">
        Register workers to see them appear in the directory.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <NuxtLink
          v-if="isSuperAdmin"
          to="/executives"
          class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains"
        >
          <Icon name="heroicons:user-plus" class="mr-2 h-4 w-4" />
          Add an Executive
        </NuxtLink>
        <NuxtLink
          to="/dashboard/help"
          class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs text-gray-700 shadow-sm hover:bg-gray-50 transition-colors font-jetbrains"
        >
          <Icon name="heroicons:question-mark-circle" class="mr-2 h-4 w-4" />
          How workers get registered
        </NuxtLink>
      </div>
    </div>

    <!-- No Filter Matches -->
    <div
      v-else-if="filtered.length === 0"
      class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
    >
      <Icon
        name="heroicons:magnifying-glass"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900 mb-1 font-jetbrains">
        No members match your filters
      </h3>
      <button
        class="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 font-jetbrains hover:bg-gray-50 transition-colors"
        @click="reset"
      >
        Clear filters
      </button>
    </div>

    <!-- Grouped Sections -->
    <div v-else class="space-y-10">
      <div v-for="(group, unitName) in groupedMembers" :key="unitName">
        <!-- Section Header -->
        <div
          class="flex items-center justify-between mb-4 px-1 cursor-pointer"
          role="button"
          tabindex="0"
          :aria-expanded="!collapsedUnits[unitName]"
          @click="toggleUnit(unitName)"
          @keydown.enter.self.prevent="toggleUnit(unitName)"
          @keydown.space.self.prevent="toggleUnit(unitName)"
        >
          <h2
            class="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-widest font-jetbrains"
          >
            {{ unitName }}
          </h2>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-600 font-jetbrains uppercase tracking-wider"
            >
              {{ group.length }} Members
            </span>
            <Icon
              :name="
                collapsedUnits[unitName]
                  ? 'heroicons:chevron-down'
                  : 'heroicons:chevron-up'
              "
              class="h-4 w-4 text-gray-500"
            />
          </div>
        </div>

        <!-- Section Table -->
        <div
          v-show="!collapsedUnits[unitName]"
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <caption class="sr-only">
                Members of the {{ unitName }} unit
              </caption>
              <thead class="bg-gray-50/50">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                  >
                    Member Profile
                  </th>
                  <th
                    class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                  >
                    Contact Info
                  </th>
                  <th
                    class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                  >
                    Gender
                  </th>
                  <th
                    class="px-6 py-4 text-right text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody class="bg-white divide-y divide-gray-100">
                <tr
                  v-for="member in visibleMembers(unitName, group)"
                  :key="member.id"
                  class="group hover:bg-gray-50 transition-colors"
                >
                  <!-- Profile / Avatar -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div>
                        <div class="text-xs md:text-sm text-black">
                          {{ member.name }}
                        </div>
                        <div
                          v-if="member.emailAddress"
                          class="text-[11px] text-gray-500 mt-0.5 font-medium"
                        >
                          {{ member.emailAddress }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Contact / Phone -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      class="flex items-center gap-2 text-xs text-gray-700 font-medium font-jetbrains"
                    >
                      <Icon
                        v-if="member.phoneNumber"
                        name="heroicons:phone"
                        class="h-3 w-3 text-gray-500"
                      />
                      {{ member.phoneNumber || "—" }}
                    </div>
                  </td>

                  <!-- Gender -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-xs text-black font-medium capitalize">
                      {{ member.gender ? member.gender.toLowerCase() : "—" }}
                    </span>
                  </td>

                  <!-- Status / Member Type -->
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains uppercase tracking-wider"
                      :class="
                        member.memberType === 'EXECUTIVE'
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-gray-100 text-black'
                      "
                    >
                      <Icon
                        v-if="member.memberType === 'EXECUTIVE'"
                        name="heroicons:star"
                        class="mr-1 h-3 w-3 text-yellow-400"
                      />
                      {{ member.memberType || "WORKER" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Per-unit pagination -->
          <div
            v-if="groupTotalPages(group) > 1"
            class="flex items-center justify-between gap-4 border-t border-gray-100 px-6 py-3"
          >
            <p class="text-[11px] font-jetbrains text-gray-500">
              Showing {{ (groupPage(unitName) - 1) * groupPageSize + 1 }}–{{
                Math.min(groupPage(unitName) * groupPageSize, group.length)
              }}
              of {{ group.length }}
            </p>
            <div class="flex items-center gap-2">
              <button
                :disabled="groupPage(unitName) === 1"
                :aria-label="`Previous page of ${unitName}`"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                @click="setGroupPage(unitName, groupPage(unitName) - 1, group)"
              >
                <Icon name="heroicons:chevron-left" class="h-4 w-4" />
              </button>
              <span class="text-[11px] font-jetbrains text-gray-600 font-bold">
                Page {{ groupPage(unitName) }} / {{ groupTotalPages(group) }}
              </span>
              <button
                :disabled="groupPage(unitName) === groupTotalPages(group)"
                :aria-label="`Next page of ${unitName}`"
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                @click="setGroupPage(unitName, groupPage(unitName) + 1, group)"
              >
                <Icon name="heroicons:chevron-right" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast();

const members = ref([]);
const isFetching = ref(true);

const isSuperAdmin = computed(() => authStore.user?.role === "super_admin");

// Track collapsed state per unit
const collapsedUnits = ref({});

const toggleUnit = (unitName) => {
  collapsedUnits.value[unitName] = !collapsedUnits.value[unitName];
};

const {
  search,
  filters,
  sortKey,
  sortDirection,
  filtered,
  reset,
} = useListControls(members, {
  searchFields: ["name", "emailAddress", "phoneNumber", "unit", "chapelUnit"],
  defaultFilters: { memberType: "ALL", gender: "ALL" },
  filter: (member, activeFilters) => {
    if (
      activeFilters.memberType === "EXECUTIVE" &&
      member.memberType !== "EXECUTIVE"
    ) {
      return false;
    }
    if (
      activeFilters.memberType === "WORKER" &&
      member.memberType === "EXECUTIVE"
    ) {
      return false;
    }
    if (
      activeFilters.gender !== "ALL" &&
      String(member.gender || "").toUpperCase() !== activeFilters.gender
    ) {
      return false;
    }
    return true;
  },
  sorters: {
    name: (a, b) =>
      String(a.name || "").localeCompare(String(b.name || ""), undefined, {
        sensitivity: "base",
      }),
  },
  defaultSort: "name",
  defaultDirection: "asc",
});

const sortOption = computed({
  get: () => `${sortKey.value}:${sortDirection.value}`,
  set: (value) => {
    const [key, direction] = value.split(":");
    sortKey.value = key;
    sortDirection.value = direction;
  },
});

// Per-unit pagination (the directory renders one table per unit)
const groupPageSize = 10;
const groupPages = ref({});

const groupPage = (unitName) => groupPages.value[unitName] || 1;

const groupTotalPages = (group) =>
  Math.max(1, Math.ceil(group.length / groupPageSize));

const setGroupPage = (unitName, next, group) => {
  const clamped = Math.min(Math.max(1, next), groupTotalPages(group));
  groupPages.value = { ...groupPages.value, [unitName]: clamped };
};

const visibleMembers = (unitName, group) => {
  const start = (groupPage(unitName) - 1) * groupPageSize;
  return group.slice(start, start + groupPageSize);
};

// Return every unit to page 1 whenever the filters change
watch(filtered, () => {
  groupPages.value = {};
});

// Dynamically group the filtered members by their unit property.
// Ordering inside each group follows the composable's active sort.
const groupedMembers = computed(() => {
  const groups = {};

  filtered.value.forEach((member) => {
    // Fallback if a member somehow has no unit assigned
    const unit = member.unit || member.chapelUnit || "Unassigned";

    if (!groups[unit]) {
      groups[unit] = [];
    }
    groups[unit].push(member);
  });

  return Object.keys(groups)
    .sort()
    .reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {});
});

onMounted(async () => {
  try {
    const res = await $fetch(`${config.public.apiBase}/admin/members`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    members.value = res;
  } catch (error) {
    console.error("Failed to load members:", error);
    toast.error("Could not load the workforce directory.");
  } finally {
    isFetching.value = false;
  }
});
</script>
