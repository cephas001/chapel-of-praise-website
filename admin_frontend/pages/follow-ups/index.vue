<!-- pages/follow-ups/index.vue -->
<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Follow-Up & Welfare
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Track, contact, and leave notes on first-timers and altar call
          responders.
        </p>
      </div>

      <button
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
        @click="openCreateDrawer"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        New Follow-Up Record
      </button>
    </div>

    <!-- List Controls -->
    <div
      class="mb-6 rounded-xl border border-gray-200 bg-white p-4 flex flex-col lg:flex-row gap-3 lg:items-center shadow-sm"
    >
      <div class="relative flex-1 min-w-0">
        <label for="followups-search" class="sr-only">Search follow-ups</label>
        <Icon
          name="heroicons:magnifying-glass"
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
        <input
          id="followups-search"
          v-model="search"
          type="search"
          placeholder="Search by name, phone, category or event..."
          class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white"
        >
      </div>

      <div class="flex flex-col sm:flex-row gap-3 shrink-0">
        <div>
          <label for="followups-status-filter" class="sr-only">
            Filter by status
          </label>
          <select
            id="followups-status-filter"
            v-model="filters.status"
            class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
          >
            <option value="ALL">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Contacted">Contacted</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label for="followups-category-filter" class="sr-only">
            Filter by category
          </label>
          <select
            id="followups-category-filter"
            v-model="filters.category"
            class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
          >
            <option value="ALL">All categories</option>
            <option value="First Timer">First Timer</option>
            <option value="New Convert">New Convert</option>
            <option value="Welfare Check">Welfare Check</option>
            <option value="General">General</option>
          </select>
        </div>

        <div>
          <label for="followups-sort" class="sr-only">Sort follow-ups</label>
          <select
            id="followups-sort"
            v-model="sortOption"
            class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
          >
            <option value="date:desc">Newest first</option>
            <option value="date:asc">Oldest first</option>
            <option value="name:asc">Name A–Z</option>
          </select>
        </div>
      </div>
    </div>

    <!-- The Grid of Cards -->
    <div
      v-if="paged.length > 0"
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ActionCard
        v-for="record in paged"
        :key="record.id"
        :record="record"
        @add-note="handleAddNote"
        @update-status="handleUpdateStatus"
      />
    </div>

    <!-- No Filter Matches -->
    <div
      v-else-if="followUps.length > 0"
      class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
    >
      <Icon
        name="heroicons:magnifying-glass"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900 mb-1 font-jetbrains">
        No follow-ups match your filters
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
      v-else
      class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
    >
      <Icon
        name="heroicons:users"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900 mb-1 font-jetbrains">
        No follow-ups needed
      </h3>
      <p class="text-gray-500 text-xs md:text-sm">
        Create a new record to start tracking.
      </p>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-8 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
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

    <!-- Drawer for Creating a New Record -->
    <SlideOver
      :is-open="isDrawerOpen"
      title="New Follow-Up"
      @close="closeDrawer"
    >
      <form
        class="space-y-6 pt-2 font-poppins"
        @submit.prevent="submitNewRecord"
      >
        <div>
          <label
            for="followup-name"
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >Full Name</label
          >
          <input
            id="followup-name"
            v-model="form.fullName"
            type="text"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
            placeholder="e.g. Jane Doe"
          >
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="followup-category"
              class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >Category</label
            >
            <select
              id="followup-category"
              v-model="form.category"
              required
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none"
            >
              <option value="First Timer">First Timer</option>
              <option value="New Convert">New Convert</option>
              <option value="Welfare Check">Welfare Check</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label
              for="followup-phone"
              class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >Phone Number</label
            >
            <input
              id="followup-phone"
              v-model="form.phoneNumber"
              type="tel"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              placeholder="080..."
            >
          </div>
        </div>

        <div>
          <label
            for="followup-event"
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >Link to Event (Optional)</label
          >
          <SearchableSelect
            v-model="form.eventId"
            input-id="followup-event"
            :options="events"
            display-key="formattedName"
            value-key="id"
            placeholder="Search events..."
          />
        </div>

        <div>
          <label
            for="followup-initial-note"
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >Initial Note (Optional)</label
          >
          <textarea
            id="followup-initial-note"
            v-model="form.initialNote"
            rows="3"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
            placeholder="Context or details about this person..."
          />
        </div>

        <div class="pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isCreating"
            class="w-full inline-flex items-center justify-center rounded-xl bg-black px-8 py-3.5 text-xs md:text-sm text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
          >
            <Icon
              v-if="isCreating"
              name="heroicons:arrow-path"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Save Record
          </button>
        </div>
      </form>
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { formatEventDisplay } from "~/utils/formatters";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast(); // auto-imported

const followUps = ref([]);
const events = ref([]);
const isFetching = ref(true);
const isDrawerOpen = ref(false);
const isCreating = ref(false);

const {
  search,
  filters,
  sortKey,
  sortDirection,
  page,
  pageSize,
  paged,
  total,
  totalPages,
  nextPage,
  prevPage,
  reset,
} = useListControls(followUps, {
  searchFields: [
    "fullName",
    "phoneNumber",
    "category",
    "eventDetails.service",
    "eventDetails.specialProgram",
  ],
  defaultFilters: { status: "ALL", category: "ALL" },
  filter: (record, activeFilters) => {
    if (activeFilters.status !== "ALL" && record.status !== activeFilters.status) {
      return false;
    }
    if (
      activeFilters.category !== "ALL" &&
      record.category !== activeFilters.category
    ) {
      return false;
    }
    return true;
  },
  sorters: {
    date: (a, b) =>
      new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
    name: (a, b) =>
      String(a.fullName || "").localeCompare(String(b.fullName || ""), undefined, {
        sensitivity: "base",
      }),
  },
  defaultSort: "date",
  defaultDirection: "desc",
});

const sortOption = computed({
  get: () => `${sortKey.value}:${sortDirection.value}`,
  set: (value) => {
    const [key, direction] = value.split(":");
    sortKey.value = key;
    sortDirection.value = direction;
  },
});

const form = reactive({
  fullName: "",
  category: "First Timer",
  phoneNumber: "",
  eventId: "",
  initialNote: "",
});

const fetchData = async () => {
  isFetching.value = true;
  try {
    // Fetch Follow Ups
    const followRes = await $fetch(
      `${config.public.apiBase}/admin/follow-ups`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    // Normalize legacy "Welfare" values so filters and badges always
    // read "Welfare Check"
    followUps.value = followRes.map((record) => ({
      ...record,
      category:
        record.category === "Welfare" ? "Welfare Check" : record.category,
    }));

    // Fetch Events for the dropdown
    const evRes = await $fetch(`${config.public.apiBase}/admin/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    events.value = evRes
      .map((ev) => ({ ...ev, formattedName: formatEventDisplay(ev) }))
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  } catch {
    toast.error("Could not load data."); // migrated
  } finally {
    isFetching.value = false;
  }
};

onMounted(fetchData);

const openCreateDrawer = () => {
  Object.assign(form, {
    fullName: "",
    category: "First Timer",
    phoneNumber: "",
    eventId: "",
    initialNote: "",
  });
  isDrawerOpen.value = true;
};

const closeDrawer = () => (isDrawerOpen.value = false);

const submitNewRecord = async () => {
  isCreating.value = true;

  // Optimistically add the record so the grid updates instantly
  const event = events.value.find((ev) => ev.id === form.eventId);
  const optimisticNote = form.initialNote
    ? {
        text: form.initialNote,
        authorName: "You",
        timestamp: new Date().toISOString(),
        _optimistic: true,
      }
    : null;
  const optimisticRecord = {
    id: `optimistic-${Date.now()}`,
    fullName: form.fullName,
    category: form.category,
    phoneNumber: form.phoneNumber,
    eventId: form.eventId || null,
    status: "Pending",
    notesThread: optimisticNote ? [optimisticNote] : [],
    eventDetails: event || null,
    createdAt: new Date().toISOString(),
    _optimistic: true,
  };
  followUps.value = [optimisticRecord, ...followUps.value];
  closeDrawer();

  try {
    const response = await $fetch(`${config.public.apiBase}/admin/follow-ups`, {
      method: "POST",
      body: { ...form },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    // Swap the optimistic record for the server-confirmed one
    const index = followUps.value.findIndex(
      (r) => r.id === optimisticRecord.id,
    );
    if (index !== -1) {
      followUps.value[index] = {
        ...optimisticRecord,
        ...(response?.id ? { id: response.id } : {}),
        _optimistic: false,
      };
    }

    toast.success("Record created successfully."); // migrated
  } catch {
    // Roll back on failure
    followUps.value = followUps.value.filter(
      (r) => r.id !== optimisticRecord.id,
    );
    toast.error("Could not save the record."); // migrated
  } finally {
    isCreating.value = false;
  }
};

// Handle the event emitted from the ActionCard
const handleAddNote = async ({ id, text, onSuccess, onError }) => {
  const record = followUps.value.find((r) => r.id === id);
  if (!record) {
    onError();
    return;
  }

  // Optimistically append the note so the card updates instantly
  if (!Array.isArray(record.notesThread)) record.notesThread = [];
  const optimisticNote = {
    text,
    authorName: "You",
    timestamp: new Date().toISOString(),
    _optimistic: true,
  };
  record.notesThread.push(optimisticNote);
  onSuccess(); // Triggers the card to clear its input field

  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/follow-ups/${id}/notes`,
      {
        method: "POST",
        body: { text },
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    // Replace the optimistic note with the server's version (real author/time)
    const serverNote = response?.note || (response?.text ? response : null);
    const noteIndex = record.notesThread.indexOf(optimisticNote);
    if (noteIndex !== -1 && serverNote) {
      record.notesThread[noteIndex] = serverNote;
    }
  } catch {
    // Roll back the note on failure
    record.notesThread = record.notesThread.filter(
      (note) => note !== optimisticNote,
    );
    toast.error("Failed to add note."); // migrated
    onError();
  }
};

// Handle status changes emitted from the ActionCard
const handleUpdateStatus = async ({ id, status, onSuccess, onError }) => {
  try {
    await $fetch(`${config.public.apiBase}/admin/follow-ups/${id}/status`, {
      method: "PATCH",
      body: { status },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    const record = followUps.value.find((r) => r.id === id);
    if (record) record.status = status;

    toast.success(`Marked as ${status}.`); // migrated
    onSuccess();
  } catch {
    toast.error("Failed to update status."); // migrated
    onError();
  }
};
</script>
