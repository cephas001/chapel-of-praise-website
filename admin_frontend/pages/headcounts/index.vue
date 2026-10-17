<!-- pages/headcounts/index.vue -->
<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <AppHeading
      class="mb-8"
      title="Event headcounts"
      subtitle="Review attendance totals across all events and services."
    >
      <template #actions>
        <AppButton icon="heroicons:plus" @click="openCreateDrawer">
          Record headcount
        </AppButton>
      </template>
    </AppHeading>

    <AppCard body-class="p-0">
      <!-- List Controls -->
      <div
        class="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center"
      >
        <div class="relative flex-1 min-w-0">
          <label for="headcounts-search" class="sr-only">Search headcounts</label>
          <Icon
            name="heroicons:magnifying-glass"
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            id="headcounts-search"
            v-model="search"
            type="search"
            placeholder="Search by event, program or date..."
            class="w-full rounded-control border border-line bg-subtle py-2.5 pl-9 pr-4 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          >
        </div>

        <div>
          <label for="headcounts-sort" class="sr-only">Sort headcounts</label>
          <select
            id="headcounts-sort"
            v-model="sortOption"
            class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
          >
            <option value="date:desc">Newest first</option>
            <option value="date:asc">Oldest first</option>
            <option value="total:desc">Highest total</option>
            <option value="name:asc">Event A–Z</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-line">
          <caption class="sr-only">Service headcount records</caption>
          <thead class="bg-subtle">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Event name & date
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Male
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Female
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Total
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
              v-for="record in paged"
              :key="record.id"
              class="hover:bg-subtle/40 transition-colors group"
            >
              <td class="px-6 py-4 whitespace-nowrap font-mono">
                <div class="text-xs md:text-sm font-semibold text-ink">
                  <template
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    {{
                      record.eventDetails?.specialProgram || "Special Program"
                    }}
                    <span
                      v-if="record.eventDetails?.programDay"
                      class="font-semibold text-ink"
                    >
                      - {{ record.eventDetails.programDay }}
                    </span>
                  </template>
                  <template v-else>
                    {{ record.eventDetails?.service || "Unknown Event" }}
                  </template>
                </div>

                <div
                  class="mt-1 font-mono text-xs text-muted"
                >
                  {{ formatDate(record.eventDetails?.eventDate) }}
                  <span
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    • Special Program
                  </span>
                </div>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-center font-mono text-xs text-muted md:text-sm"
              >
                {{ (record.maleStudents || 0) + (record.maleVisitors || 0) }}
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-center font-mono text-xs text-muted md:text-sm"
              >
                {{ (record.femaleStudents || 0) + (record.femaleVisitors || 0) }}
              </td>

              <!-- <td
                class="px-6 py-4 whitespace-nowrap text-center font-mono text-xs text-muted md:text-sm"
              >
                {{ (record.maleVisitors || 0) + (record.femaleVisitors || 0) }}
              </td> -->

              <td
                class="px-6 py-4 whitespace-nowrap text-center font-mono text-xs font-semibold text-ink md:text-sm"
              >
                {{
                  (record.maleStudents || 0) +
                  (record.femaleStudents || 0) +
                  (record.maleVisitors || 0) +
                  (record.femaleVisitors || 0)
                }}
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end gap-1">
                  <button
                    class="rounded-control p-2 text-muted transition-colors hover:bg-subtle hover:text-ink"
                    title="Open event"
                    aria-label="Open event"
                    @click="navigateTo(`/events/${record.eventId}`)"
                  >
                    <Icon name="heroicons:eye" class="h-4 w-4" />
                  </button>
                  <button
                    class="rounded-control p-2 text-muted transition-colors hover:bg-subtle hover:text-ink"
                    title="Update counts"
                    aria-label="Update counts"
                    @click="openEditDrawer(record)"
                  >
                    <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- No matches -->
        <div
          v-if="!isFetching && headcounts.length > 0 && filtered.length === 0"
          class="border-t border-line py-16 text-center"
        >
          <Icon
            name="heroicons:magnifying-glass"
            class="mx-auto mb-4 h-10 w-10 text-line"
          />
          <h3 class="mb-1 text-sm font-semibold text-ink">
            No headcounts match your search
          </h3>
          <AppButton variant="secondary" size="sm" class="mt-4" @click="reset">
            Clear search
          </AppButton>
        </div>

        <div
          v-if="!isFetching && headcounts.length === 0"
          class="border-t border-line py-20 text-center"
        >
          <Icon
            name="heroicons:users"
            class="mx-auto mb-4 h-12 w-12 text-line"
          />
          <h3 class="mb-1 text-sm font-semibold text-ink">
            No headcounts found
          </h3>
          <p class="px-5 text-xs text-muted">
            Get started by recording attendance for a recent event.
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between gap-4 border-t border-line px-6 py-4"
      >
        <p class="font-mono text-xs text-muted">
          Showing {{ (page - 1) * pageSize + 1 }}–{{
            Math.min(page * pageSize, total)
          }}
          of {{ total }}
        </p>
        <div class="flex items-center gap-2">
          <button
            :disabled="page === 1"
            aria-label="Previous page"
            class="inline-flex h-8 w-8 items-center justify-center rounded-control border border-line text-ink transition-colors hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
            @click="prevPage"
          >
            <Icon name="heroicons:chevron-left" class="h-4 w-4" />
          </button>
          <span class="font-mono text-xs font-medium text-ink">
            Page {{ page }} / {{ totalPages }}
          </span>
          <button
            :disabled="page === totalPages"
            aria-label="Next page"
            class="inline-flex h-8 w-8 items-center justify-center rounded-control border border-line text-ink transition-colors hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
            @click="nextPage"
          >
            <Icon name="heroicons:chevron-right" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppCard>

    <SlideOver
      :is-open="isDrawerOpen"
      :title="
        editingRecord ? 'Update event headcount' : 'Record event headcount'
      "
      @close="closeDrawer"
    >
      <div class="p-1">
        <div
          v-if="editingRecord"
          class="mb-6 pb-6 border-b border-line"
        >
          <p
            class="block text-xs font-medium text-ink mb-2"
          >
            Editing headcount for
          </p>
          <p class="text-xs font-semibold text-ink md:text-sm">
            {{
              formatEventDisplay(editingRecord.eventDetails) ||
              editingRecord.eventId
            }}
          </p>
        </div>

        <div v-else class="mb-6 pb-6 border-b border-line">
          <label
            for="headcounts-event"
            class="block text-xs font-medium text-ink mb-2"
          >
            Select target event
          </label>
          <SearchableSelect
            v-model="selectedEventId"
            input-id="headcounts-event"
            :options="events"
            display-key="formattedName"
            value-key="id"
            placeholder="Type to search events..."
          />
        </div>

        <div v-if="selectedEventId">
          <div
            v-if="!editingRecord && existingRecord"
            role="status"
            class="mb-6 flex items-start gap-2.5 rounded-control border border-warning-line bg-warning-surface px-4 py-3"
          >
            <Icon
              name="heroicons:information-circle"
              class="mt-0.5 h-4 w-4 shrink-0 text-warning-text"
            />
            <p class="text-xs leading-relaxed text-warning-text">
              A headcount for this event was already recorded. Submitting will
              update the existing counts.
            </p>
          </div>

          <h4
            class="text-xs font-medium text-ink mb-4"
          >
            Enter counts
          </h4>
          <EventHeadCountForm
            :initial-data="editingRecord"
            :loading="isSubmitting"
            @submit="handleHeadcountSubmit"
          />
        </div>

        <div
          v-else
          class="rounded-surface border border-dashed border-line bg-surface py-12 text-center"
        >
          <Icon
            name="heroicons:calendar"
            class="mx-auto mb-3 h-8 w-8 text-line"
          />
          <p class="px-5 text-xs font-medium text-muted">
            Please select an event above first.
          </p>
        </div>
      </div>
    </SlideOver>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { formatEventDisplay, headcountTotal } from "~/utils/formatters";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast(); // auto-imported

const headcounts = ref([]);
const events = ref([]);
const isFetching = ref(true);
const isDrawerOpen = ref(false);
const isSubmitting = ref(false);
const selectedEventId = ref("");
const editingRecord = ref(null);

const existingRecord = computed(() => {
  if (!selectedEventId.value) return null;
  return (
    headcounts.value.find(
      (record) => record.eventId === selectedEventId.value,
    ) || null
  );
});

const {
  search,
  sortKey,
  sortDirection,
  page,
  pageSize,
  filtered,
  paged,
  total,
  totalPages,
  nextPage,
  prevPage,
  reset,
} = useListControls(headcounts, {
  searchFields: [
    "eventDetails.service",
    "eventDetails.specialProgram",
    "eventDetails.programDay",
    "eventDetails.eventDate",
  ],
  sorters: {
    date: (a, b) =>
      new Date(a.eventDetails?.eventDate || 0) -
      new Date(b.eventDetails?.eventDate || 0),
    total: (a, b) => headcountTotal(a) - headcountTotal(b),
    name: (a, b) =>
      String(formatEventDisplay(a.eventDetails)).localeCompare(
        String(formatEventDisplay(b.eventDetails)),
      ),
  },
  defaultSort: "date",
  defaultDirection: "desc",
  pageSize: 10,
});

const sortOption = computed({
  get: () => `${sortKey.value}:${sortDirection.value}`,
  set: (value) => {
    const [key, direction] = value.split(":");
    sortKey.value = key;
    sortDirection.value = direction;
  },
});

// Helper for table dates
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const fetchData = async () => {
  isFetching.value = true;
  try {
    // 1. Fetch Headcounts
    const hcRes = await $fetch(`${config.public.apiBase}/admin/headcounts`);
    headcounts.value = hcRes;

    // 2. Fetch Events for the dropdown
    const evRes = await $fetch(`${config.public.apiBase}/admin/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    events.value = evRes
      .map((ev) => ({ ...ev, formattedName: formatEventDisplay(ev) }))
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("Could not load event headcount data."); // migrated
  } finally {
    isFetching.value = false;
  }
};

onMounted(fetchData);

const openCreateDrawer = () => {
  editingRecord.value = null;
  selectedEventId.value = "";
  isDrawerOpen.value = true;
};

const openEditDrawer = (record) => {
  editingRecord.value = record;
  selectedEventId.value = record.eventId;
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const handleHeadcountSubmit = async (formData) => {
  isSubmitting.value = true;

  // Optimistically apply the change so the table updates instantly
  const previous = headcounts.value;
  const existingIndex = headcounts.value.findIndex(
    (record) => record.eventId === selectedEventId.value,
  );
  const event = events.value.find((ev) => ev.id === selectedEventId.value);
  const optimisticRecord = {
    id:
      existingIndex !== -1
        ? headcounts.value[existingIndex].id
        : `optimistic-${Date.now()}`,
    eventId: selectedEventId.value,
    ...formData,
    eventDetails:
      existingIndex !== -1
        ? headcounts.value[existingIndex].eventDetails
        : event || null,
    _optimistic: true,
  };
  const next = [...headcounts.value];

  if (existingIndex !== -1) {
    next[existingIndex] = { ...headcounts.value[existingIndex], ...optimisticRecord };
  } else {
    next.unshift(optimisticRecord);
  }
  headcounts.value = next;
  closeDrawer();

  try {
    const response = await $fetch(`${config.public.apiBase}/admin/headcounts`, {
      method: "POST",
      body: { eventId: optimisticRecord.eventId, ...formData },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    // Swap the optimistic record for the server-confirmed one
    const saved = response?.data;
    if (saved) {
      const index = headcounts.value.findIndex(
        (record) => record.id === optimisticRecord.id,
      );
      if (index !== -1) {
        headcounts.value[index] = {
          ...optimisticRecord,
          ...saved,
          eventDetails: optimisticRecord.eventDetails,
        };
      }
    }

    toast.success(
      existingIndex !== -1
        ? "Headcount updated successfully."
        : "Headcount saved successfully.",
    );
  } catch {
    headcounts.value = previous; // Roll back on failure
    toast.error("Could not save the headcount.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
