<!-- pages/members/index.vue -->
<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <AppHeading
      class="mb-8"
      title="Chapel workforce"
      subtitle="View the complete directory of workers and executives grouped by unit."
    />

    <!-- Directory Controls -->
    <AppCard
      class="mb-8" body-class="p-4 flex flex-col gap-3 lg:flex-row lg:items-center"
    >
      <div class="relative flex-1 min-w-0">
        <label for="members-search" class="sr-only">Search members</label>
        <Icon
          name="heroicons:magnifying-glass"
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
        <input
          id="members-search"
          v-model="search"
          type="search"
          placeholder="Search by name, email, phone or unit..."
          class="w-full rounded-control border border-line bg-subtle py-2.5 pl-9 pr-4 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
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
            class="w-full appearance-none cursor-pointer rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
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
            class="w-full appearance-none cursor-pointer rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
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
            class="w-full appearance-none cursor-pointer rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
          >
            <option value="name:asc">Name A–Z</option>
            <option value="name:desc">Name Z–A</option>
          </select>
        </div>
      </div>
    </AppCard>

    <!-- Loading State -->
    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-muted animate-spin mb-4"
      />
      <h3
        class="text-xs md:text-sm font-semibold text-ink animate-pulse"
      >
        Loading workforce directory...
      </h3>
    </div>

    <!-- Empty State -->
    <AppCard
      v-else-if="members.length === 0"
      body-class="p-12 text-center"
    >
      <Icon
        name="heroicons:user-group"
        class="mx-auto h-12 w-12 text-line mb-4"
      />
      <h3 class="text-sm font-semibold text-ink mb-1">
        No members found
      </h3>
      <p class="text-muted text-xs md:text-sm mb-6">
        Register workers to see them appear in the directory.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <AppButton
          v-if="isSuperAdmin"
          to="/executives"
          icon="heroicons:user-plus"
        >
          Add an executive
        </AppButton>
        <AppButton
          to="/dashboard/help#your-unit"
          variant="secondary"
          icon="heroicons:question-mark-circle"
        >
          About the member directory
        </AppButton>
      </div>
    </AppCard>

    <!-- No Filter Matches -->
    <AppCard
      v-else-if="filtered.length === 0"
      body-class="p-12 text-center"
    >
      <Icon
        name="heroicons:magnifying-glass"
        class="mx-auto h-12 w-12 text-line mb-4"
      />
      <h3 class="text-sm font-semibold text-ink mb-1">
        No members match your filters
      </h3>
      <AppButton
        variant="secondary"
        size="sm"
        class="mt-4"
        @click="reset"
      >
        Clear filters
      </AppButton>
    </AppCard>

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
            class="text-sm font-semibold text-ink"
          >
            {{ unitName }}
          </h2>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-full bg-subtle px-3 py-1 font-mono text-xs font-medium text-muted"
            >
              {{ group.length }} members
            </span>
            <Icon
              :name="
                collapsedUnits[unitName]
                  ? 'heroicons:chevron-down'
                  : 'heroicons:chevron-up'
              "
              class="h-4 w-4 text-muted"
            />
          </div>
        </div>

        <!-- Section Table -->
        <AppCard
          v-show="!collapsedUnits[unitName]"
          body-class="p-0"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-line">
              <caption class="sr-only">
                Members of the {{ unitName }} unit
              </caption>
              <thead class="bg-subtle/60">
                <tr>
                  <th
                    class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
                  >
                    Member Profile
                  </th>
                  <th
                    class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
                  >
                    Contact Info
                  </th>
                  <th
                    class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
                  >
                    Gender
                  </th>
                  <th
                    class="px-6 py-4 text-right font-mono text-xs font-medium whitespace-nowrap text-muted"
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody class="bg-surface divide-y divide-line">
                <tr
                  v-for="member in visibleMembers(unitName, group)"
                  :key="member.id"
                  class="group hover:bg-subtle transition-colors"
                >
                  <!-- Profile / Avatar -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div>
                        <div class="text-xs md:text-sm text-ink">
                          {{ member.name }}
                        </div>
                        <div
                          v-if="member.emailAddress"
                          class="text-xs text-muted mt-0.5 font-medium"
                        >
                          {{ member.emailAddress }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Contact / Phone -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      class="flex items-center gap-2 text-xs text-ink font-medium font-mono"
                    >
                      <Icon
                        v-if="member.phoneNumber"
                        name="heroicons:phone"
                        class="h-3 w-3 text-muted"
                      />
                      {{ member.phoneNumber || "—" }}
                    </div>
                  </td>

                  <!-- Gender -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-xs text-ink font-medium capitalize">
                      {{ member.gender ? member.gender.toLowerCase() : "—" }}
                    </span>
                  </td>

                  <!-- Status / Member Type -->
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      class="inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-mono"
                      :class="
                        member.memberType === 'EXECUTIVE'
                          ? 'bg-ink text-white'
                          : 'bg-subtle text-ink'
                      "
                    >
                      <Icon
                        v-if="member.memberType === 'EXECUTIVE'"
                        name="heroicons:star"
                        class="mr-1 h-3 w-3 text-warning-text"
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
            class="flex items-center justify-between gap-4 border-t border-line px-6 py-3"
          >
            <p class="text-xs font-mono text-muted">
              Showing {{ (groupPage(unitName) - 1) * groupPageSize + 1 }}–{{
                Math.min(groupPage(unitName) * groupPageSize, group.length)
              }}
              of {{ group.length }}
            </p>
            <div class="flex items-center gap-2">
              <button
                :disabled="groupPage(unitName) === 1"
                :aria-label="`Previous page of ${unitName}`"
                class="inline-flex h-8 w-8 items-center justify-center rounded-control border border-line text-ink transition-colors hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                @click="setGroupPage(unitName, groupPage(unitName) - 1, group)"
              >
                <Icon name="heroicons:chevron-left" class="h-4 w-4" />
              </button>
              <span class="font-mono text-xs font-medium text-muted">
                Page {{ groupPage(unitName) }} / {{ groupTotalPages(group) }}
              </span>
              <button
                :disabled="groupPage(unitName) === groupTotalPages(group)"
                :aria-label="`Next page of ${unitName}`"
                class="inline-flex h-8 w-8 items-center justify-center rounded-control border border-line text-ink transition-colors hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                @click="setGroupPage(unitName, groupPage(unitName) + 1, group)"
              >
                <Icon name="heroicons:chevron-right" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </AppCard>
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
