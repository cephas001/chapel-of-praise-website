<!-- pages/altar-calls/index.vue -->
<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Header -->
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Altar Calls
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Review altar call responses and categories across all events.
        </p>
      </div>

      <button
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
        @click="openCreateDrawer"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        Record Altar Call
      </button>
    </div>

    <!-- Data Table Container -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- List Controls -->
      <div
        class="border-b border-gray-100 p-4 flex flex-col lg:flex-row gap-3 lg:items-center"
      >
        <div class="relative flex-1 min-w-0">
          <label for="altar-calls-search" class="sr-only">
            Search altar calls
          </label>
          <Icon
            name="heroicons:magnifying-glass"
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
          <input
            id="altar-calls-search"
            v-model="search"
            type="search"
            placeholder="Search by event, program or call type..."
            class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white"
          >
        </div>

        <div class="flex flex-col sm:flex-row gap-3 shrink-0">
          <div>
            <label for="altar-calls-type-filter" class="sr-only">
              Filter by call type
            </label>
            <select
              id="altar-calls-type-filter"
              v-model="filters.callType"
              class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
            >
              <option value="ALL">All call types</option>
              <option value="SALVATION">Salvation</option>
              <option value="REDEDICATION">Rededication</option>
              <option value="HOLY GHOST BAPTISM">Holy Ghost Baptism</option>
              <option value="HEALING">Healing</option>
              <option value="SPECIAL MINISTRATION">Special Ministration</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label for="altar-calls-sort" class="sr-only">
              Sort altar calls
            </label>
            <select
              id="altar-calls-sort"
              v-model="sortOption"
              class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
            >
              <option value="date:desc">Newest first</option>
              <option value="date:asc">Oldest first</option>
              <option value="responders:desc">Most responders</option>
              <option value="responders:asc">Fewest responders</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <caption class="sr-only">Altar call records</caption>
          <thead class="bg-gray-50/50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap w-1/3"
              >
                Event Details
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Call Type
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Responders
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <template v-for="record in paged" :key="record.id">
              <tr
                class="hover:bg-gray-50/50 transition-colors group"
              >
              <!-- Event Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs md:text-sm font-bold text-gray-900">
                  <!-- Condition 1: If it's a Special Program, show the Program Name and Day -->
                  <template
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    {{
                      record.eventDetails?.specialProgram || "Special Program"
                    }}
                    <span
                      v-if="record.eventDetails?.programDay"
                      class="font-semibold text-gray-900"
                    >
                      - {{ record.eventDetails.programDay }}
                    </span>
                  </template>
                  <!-- Condition 2: If it's a regular service, just show the service name -->
                  <template v-else>
                    {{ record.eventDetails?.service || "Unknown Event" }}
                  </template>
                </div>

                <div
                  class="text-[11px] font-jetbrains font-semibold tracking-wide uppercase mt-1 text-gray-600"
                >
                  {{ formatDate(record.eventDetails?.eventDate) }}
                  <span
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    • Special Program
                  </span>
                </div>
              </td>

              <!-- Category Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {{ record.callType }}
                </span>
              </td>

              <!-- Responders Column -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button
                  class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-black text-black transition-colors hover:bg-gray-100"
                  :aria-expanded="expandedId === record.id ? 'true' : 'false'"
                  :aria-controls="`responders-${record.id}`"
                  @click="toggleResponders(record)"
                >
                  {{ record.totalResponders || 0 }}
                  <Icon
                    :name="
                      expandedId === record.id
                        ? 'heroicons:chevron-up'
                        : 'heroicons:chevron-down'
                    "
                    class="h-3.5 w-3.5 text-gray-500"
                  />
                </button>
              </td>
              </tr>

              <!-- Responders Drill-Down -->
              <tr v-if="expandedId === record.id" :id="`responders-${record.id}`">
                <td colspan="3" class="bg-gray-50/60 px-6 py-5 border-t border-gray-100">
                  <div
                    v-if="responsesState[record.id] === 'loading'"
                    class="flex items-center justify-center gap-2 py-6"
                  >
                    <Icon
                      name="heroicons:arrow-path"
                      class="h-4 w-4 text-gray-500 animate-spin"
                    />
                    <span
                      class="text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest"
                    >
                      Loading responders...
                    </span>
                  </div>

                  <div
                    v-else-if="responsesState[record.id] === 'error'"
                    class="py-6 text-center"
                  >
                    <p class="text-xs text-gray-600 mb-3">
                      Could not load the responders for this call.
                    </p>
                    <button
                      class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 font-jetbrains hover:bg-gray-50 transition-colors"
                      @click="loadResponders(record, true)"
                    >
                      Retry
                    </button>
                  </div>

                  <table
                    v-else-if="
                      responsesState[record.id] === 'loaded' &&
                      responsesByCall[record.id]?.length
                    "
                    class="min-w-full divide-y divide-gray-200"
                  >
                    <caption class="sr-only">
                      Individual responders for this altar call
                    </caption>
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          class="px-4 py-2.5 text-left text-[10px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                        >
                          Responder
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2.5 text-left text-[10px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                        >
                          Gender
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2.5 text-left text-[10px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                        >
                          Phone
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2.5 text-left text-[10px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                        >
                          Hostel / Room
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2.5 text-left text-[10px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                        >
                          Assigned To
                        </th>
                        <th
                          scope="col"
                          class="px-4 py-2.5 text-left text-[10px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                        >
                          Follow-Up
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr
                        v-for="response in responsesByCall[record.id]"
                        :key="response.id"
                      >
                        <td class="px-4 py-3 whitespace-nowrap text-xs font-bold text-gray-800">
                          {{ response.fullName || "Unnamed responder" }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-600 capitalize">
                          {{ response.gender || "—" }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-600 font-jetbrains">
                          {{ response.phoneNumber || "—" }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                          {{ response.hostel || "—"
                          }}<span v-if="response.roomNumber">
                            · {{ response.roomNumber }}</span
                          >
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                          {{ response.assignedTo || "Unassigned" }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <span
                            class="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-jetbrains font-bold uppercase tracking-wider"
                            :class="
                              response.followUpStatus === 'DONE'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-amber-50 text-amber-700'
                            "
                          >
                            {{
                              response.followUpStatus === "DONE"
                                ? "Done"
                                : "Not done"
                            }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p
                    v-else
                    class="py-6 text-center text-xs text-gray-500 italic"
                  >
                    No individual responders were captured for this call.
                  </p>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <!-- No matches -->
        <div
          v-if="!isFetching && altarCalls.length > 0 && filtered.length === 0"
          class="py-16 text-center border-t border-gray-100"
        >
          <Icon
            name="heroicons:magnifying-glass"
            class="mx-auto h-10 w-10 text-gray-300 mb-4"
          />
          <h3 class="text-sm font-bold text-gray-900 mb-1 font-jetbrains">
            No altar calls match your filters
          </h3>
          <button
            class="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 font-jetbrains hover:bg-gray-50 transition-colors"
            @click="reset"
          >
            Clear filters
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-if="!isFetching && altarCalls.length === 0"
          class="py-20 text-center border-t border-gray-100"
        >
          <Icon
            name="heroicons:megaphone"
            class="mx-auto h-12 w-12 text-gray-300 mb-4"
          />
          <h3 class="text-sm font-bold text-gray-900 mb-1">
            No altar calls recorded
          </h3>
          <p class="text-gray-500 text-xs px-5">
            Get started by logging a response for a recent event.
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

    <!-- Slide-over Drawer for Creating Altar Call -->
    <SlideOver
      :is-open="isDrawerOpen"
      title="Record Altar Call Response"
      :before-close="confirmDiscardDraft"
      @close="closeDrawer"
    >
      <div class="p-1 font-poppins">
        <!-- Step 1: Select Event using our reusable component -->
        <div class="mb-6 pb-6 border-b border-gray-100">
          <label
            for="altar-calls-event"
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Select Target Event
          </label>
          <SearchableSelect
            v-model="selectedEventId"
            input-id="altar-calls-event"
            :options="events"
            display-key="formattedName"
            value-key="id"
            placeholder="Type to search events..."
          />
        </div>

        <!-- Step 2: Form Component -->
        <div v-if="selectedEventId">
          <h4
            class="text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-4"
          >
            Response Details
          </h4>
          <!-- We reuse the form component built for the individual event view -->
          <EventAltarCallForm
            ref="altarCallFormRef"
            :loading="isSubmitting"
            @submit="handleAltarCallSubmit"
          />
        </div>

        <!-- Awaiting Selection State -->
        <div
          v-else
          class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200"
        >
          <Icon
            name="heroicons:calendar"
            class="h-8 w-8 text-gray-300 mx-auto mb-3"
          />
          <p
            class="text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest"
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

// Extracted both formatters to keep it DRY!
import { formatEventDisplay, formatDate } from "~/utils/formatters";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast();

const altarCalls = ref([]);
const events = ref([]);
const isFetching = ref(true);
const isDrawerOpen = ref(false);
const isSubmitting = ref(false);
const selectedEventId = ref("");
const altarCallFormRef = ref(null);
const confirm = useConfirm();

// Responder drill-down state
const expandedId = ref(null);
const responsesByCall = ref({});
const responsesState = ref({});

const {
  search,
  filters,
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
} = useListControls(altarCalls, {
  searchFields: [
    "callType",
    "additionalComments",
    "eventDetails.service",
    "eventDetails.specialProgram",
    "eventDetails.programDay",
  ],
  defaultFilters: { callType: "ALL" },
  filter: (record, activeFilters) =>
    activeFilters.callType === "ALL" ||
    record.callType === activeFilters.callType,
  sorters: {
    date: (a, b) =>
      new Date(a.eventDetails?.eventDate || 0) -
      new Date(b.eventDetails?.eventDate || 0),
    responders: (a, b) =>
      (Number(a.totalResponders) || 0) - (Number(b.totalResponders) || 0),
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

const loadResponders = async (record, force = false) => {
  if (!force && responsesByCall.value[record.id]) return;

  responsesState.value = { ...responsesState.value, [record.id]: "loading" };
  try {
    const responses = await $fetch(
      `${config.public.apiBase}/admin/altar-calls/responses/${record.id}`,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    responsesByCall.value = {
      ...responsesByCall.value,
      [record.id]: responses,
    };
    responsesState.value = { ...responsesState.value, [record.id]: "loaded" };
  } catch (error) {
    console.error("Failed to load responders:", error);
    responsesState.value = { ...responsesState.value, [record.id]: "error" };
  }
};

const toggleResponders = (record) => {
  if (expandedId.value === record.id) {
    expandedId.value = null;
    return;
  }
  expandedId.value = record.id;
  if (!responsesByCall.value[record.id]) {
    loadResponders(record);
  }
};

const confirmDiscardDraft = async () => {
  if (!altarCallFormRef.value?.isDirty?.()) return true;
  return await confirm.ask({
    title: "Discard Altar Call?",
    message: "You have unsaved details in this form. Close and discard them?",
    confirmText: "Discard",
    cancelText: "Keep Editing",
    isDestructive: true,
  });
};

definePageMeta({
  allowedUserTypes: ["executive"],
});

const fetchData = async () => {
  isFetching.value = true;
  try {
    // 1. Fetch Event Altar Calls using the new endpoint we just made
    const callsRes = await $fetch(
      `${config.public.apiBase}/admin/altar-calls/global`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    altarCalls.value = callsRes;

    // 2. Fetch Events to populate the searchable dropdown
    const evRes = await $fetch(`${config.public.apiBase}/admin/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    events.value = evRes
      .map((ev) => ({ ...ev, formattedName: formatEventDisplay(ev) }))
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("Could not load global altar call data.");
  } finally {
    isFetching.value = false;
  }
};

onMounted(fetchData);

const openCreateDrawer = () => {
  selectedEventId.value = "";
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const handleAltarCallSubmit = async (formData) => {
  isSubmitting.value = true;

  // Optimistically add the record so the table updates instantly
  const event = events.value.find((ev) => ev.id === selectedEventId.value);
  const optimisticRecord = {
    id: `optimistic-${Date.now()}`,
    eventId: selectedEventId.value,
    ...formData,
    totalResponders: Number(formData.totalResponders) || 0,
    eventDetails: event || null,
    _optimistic: true,
  };
  altarCalls.value = [optimisticRecord, ...altarCalls.value];
  altarCallFormRef.value?.resetForm();
  closeDrawer();

  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/altar-calls`,
      {
        method: "POST",
        body: { eventId: optimisticRecord.eventId, ...formData },
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    // Swap the optimistic record for the server-confirmed one
    const index = altarCalls.value.findIndex(
      (record) => record.id === optimisticRecord.id,
    );
    if (index !== -1) {
      altarCalls.value[index] = {
        ...optimisticRecord,
        ...(response?.data || {}),
        eventDetails: optimisticRecord.eventDetails,
        _optimistic: false,
      };
    }

    toast.success("Altar call recorded successfully.");
  } catch {
    // Roll back on failure
    altarCalls.value = altarCalls.value.filter(
      (record) => record.id !== optimisticRecord.id,
    );
    toast.error("Could not save the altar call record.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
