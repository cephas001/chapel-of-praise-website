<!-- pages/headcounts/index.vue -->
<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Event Headcounts
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Review attendance totals across all events and services.
        </p>
      </div>

      <button
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
        @click="openCreateDrawer"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        Record New Headcount
      </button>
    </div>

    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- List Controls -->
      <div
        class="border-b border-gray-100 p-4 flex flex-col lg:flex-row gap-3 lg:items-center"
      >
        <div class="relative flex-1 min-w-0">
          <label for="headcounts-search" class="sr-only">Search headcounts</label>
          <Icon
            name="heroicons:magnifying-glass"
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
          <input
            id="headcounts-search"
            v-model="search"
            type="search"
            placeholder="Search by event, program or date..."
            class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white"
          >
        </div>

        <div>
          <label for="headcounts-sort" class="sr-only">Sort headcounts</label>
          <select
            id="headcounts-sort"
            v-model="sortOption"
            class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
          >
            <option value="date:desc">Newest first</option>
            <option value="date:asc">Oldest first</option>
            <option value="total:desc">Highest total</option>
            <option value="name:asc">Event A–Z</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <caption class="sr-only">Service headcount records</caption>
          <thead class="bg-gray-50/50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Event Name & Date
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Male
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Female
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Total
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
              v-for="record in paged"
              :key="record.id"
              class="hover:bg-gray-50/50 transition-colors group"
            >
              <td class="px-6 py-4 whitespace-nowrap font-jetbrains">
                <div class="text-xs md:text-sm font-bold text-gray-800">
                  <template
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    {{
                      record.eventDetails?.specialProgram || "Special Program"
                    }}
                    <span
                      v-if="record.eventDetails?.programDay"
                      class="font-semibold text-gray-800"
                    >
                      - {{ record.eventDetails.programDay }}
                    </span>
                  </template>
                  <template v-else>
                    {{ record.eventDetails?.service || "Unknown Event" }}
                  </template>
                </div>

                <div
                  class="text-[11px] font-jetbrains font-semibold tracking-wide uppercase mt-1 text-gray-500"
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
                class="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm text-gray-600 font-medium"
              >
                {{ (record.maleStudents || 0) + (record.maleVisitors || 0) }}
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm text-gray-600 font-medium"
              >
                {{ (record.femaleStudents || 0) + (record.femaleVisitors || 0) }}
              </td>

              <!-- <td
                class="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm text-gray-600 font-medium"
              >
                {{ (record.maleVisitors || 0) + (record.femaleVisitors || 0) }}
              </td> -->

              <td
                class="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm font-black text-black"
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
                    class="text-gray-500 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-100"
                    title="Open event"
                    aria-label="Open event"
                    @click="navigateTo(`/events/${record.eventId}`)"
                  >
                    <Icon name="heroicons:eye" class="h-4 w-4" />
                  </button>
                  <button
                    class="text-gray-500 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-100"
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
          class="py-16 text-center border-t border-gray-100"
        >
          <Icon
            name="heroicons:magnifying-glass"
            class="mx-auto h-10 w-10 text-gray-300 mb-4"
          />
          <h3 class="text-sm font-bold text-gray-900 mb-1 font-jetbrains">
            No headcounts match your search
          </h3>
          <button
            class="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 font-jetbrains hover:bg-gray-50 transition-colors"
            @click="reset"
          >
            Clear search
          </button>
        </div>

        <div
          v-if="!isFetching && headcounts.length === 0"
          class="py-20 text-center border-t border-gray-100"
        >
          <Icon
            name="heroicons:users"
            class="mx-auto h-12 w-12 text-gray-300 mb-4"
          />
          <h3 class="text-sm font-bold text-gray-900 mb-1">
            No headcounts found
          </h3>
          <p class="text-gray-500 text-xs px-5">
            Get started by recording attendance for a recent event.
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between gap-4 border-t border-gray-100 px-6 py-4"
      >
        <p class="text-[11px] font-jetbrains text-gray-500">
          Showing {{ (page - 1) * pageSize + 1 }}–{{
            Math.min(page * pageSize, total)
          }}
          of {{ total }}
        </p>
        <div class="flex items-center gap-2">
          <button
            :disabled="page === 1"
            aria-label="Previous page"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="prevPage"
          >
            <Icon name="heroicons:chevron-left" class="h-4 w-4" />
          </button>
          <span class="text-[11px] font-jetbrains text-gray-600 font-bold">
            Page {{ page }} / {{ totalPages }}
          </span>
          <button
            :disabled="page === totalPages"
            aria-label="Next page"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            @click="nextPage"
          >
            <Icon name="heroicons:chevron-right" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <SlideOver
      :is-open="isDrawerOpen"
      :title="
        editingRecord ? 'Update Event Headcount' : 'Record Event Headcount'
      "
      @close="closeDrawer"
    >
      <div class="p-1 font-poppins">
        <div
          v-if="editingRecord"
          class="mb-6 pb-6 border-b border-gray-100"
        >
          <p
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Editing headcount for
          </p>
          <p class="text-xs md:text-sm font-bold text-black">
            {{
              formatEventDisplay(editingRecord.eventDetails) ||
              editingRecord.eventId
            }}
          </p>
        </div>

        <div v-else class="mb-6 pb-6 border-b border-gray-100">
          <label
            for="headcounts-event"
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Select Target Event
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
            class="mb-6 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
          >
            <Icon
              name="heroicons:information-circle"
              class="h-4 w-4 text-amber-600 shrink-0 mt-0.5"
            />
            <p class="text-[11px] md:text-xs text-amber-800 leading-relaxed">
              A headcount for this event was already recorded. Submitting will
              update the existing counts.
            </p>
          </div>

          <h4
            class="text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-4"
          >
            Enter Counts
          </h4>
          <EventHeadCountForm
            :initial-data="editingRecord"
            :loading="isSubmitting"
            @submit="handleHeadcountSubmit"
          />
        </div>

        <div
          v-else
          class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200"
        >
          <Icon
            name="heroicons:calendar"
            class="h-8 w-8 text-gray-300 mx-auto mb-3"
          />
          <p
            class="text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest px-5"
          >
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
