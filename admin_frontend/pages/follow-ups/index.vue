<!-- pages/follow-ups/index.vue -->
<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <AppHeading
      class="mb-8"
      title="Follow-ups & welfare"
      subtitle="Track, contact, and leave notes on first-timers and altar call responders."
    >
      <template #actions>
        <AppButton icon="heroicons:plus" @click="openCreateDrawer">
          New follow-up
        </AppButton>
      </template>
    </AppHeading>

    <!-- List Controls -->
    <AppCard
      class="mb-6"
      body-class="flex flex-col gap-3 p-4 lg:flex-row lg:items-center"
    >
      <div class="relative flex-1 min-w-0">
        <label for="followups-search" class="sr-only">Search follow-ups</label>
        <Icon
          name="heroicons:magnifying-glass"
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
        <input
          id="followups-search"
          v-model="search"
          type="search"
          placeholder="Search by name, phone, category or event..."
          class="w-full rounded-control border border-line bg-subtle py-2.5 pl-9 pr-4 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
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
            class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
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
            class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
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
            class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
          >
            <option value="date:desc">Newest first</option>
            <option value="date:asc">Oldest first</option>
            <option value="name:asc">Name A–Z</option>
          </select>
        </div>
      </div>
    </AppCard>

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
    <AppCard
      v-else-if="followUps.length > 0"
      body-class="p-12 text-center"
    >
      <Icon
        name="heroicons:magnifying-glass"
        class="mx-auto mb-4 h-12 w-12 text-line"
      />
      <h3 class="mb-1 text-sm font-semibold text-ink">
        No follow-ups match your filters
      </h3>
      <AppButton variant="secondary" size="sm" class="mt-4" @click="reset">
        Clear filters
      </AppButton>
    </AppCard>

    <!-- Empty State -->
    <AppCard v-else body-class="p-12 text-center">
      <Icon
        name="heroicons:users"
        class="mx-auto mb-4 h-12 w-12 text-line"
      />
      <h3 class="mb-1 text-sm font-semibold text-ink">
        No follow-ups needed
      </h3>
      <p class="text-xs text-muted md:text-sm">
        Create a new record to start tracking.
      </p>
    </AppCard>

    <!-- Pagination -->
    <AppCard
      v-if="totalPages > 1"
      class="mt-8"
      body-class="flex items-center justify-between gap-4 px-6 py-4"
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
    </AppCard>

    <!-- Drawer for Creating a New Record -->
    <SlideOver
      :is-open="isDrawerOpen"
      title="New follow-up"
      @close="closeDrawer"
    >
      <form
        class="space-y-6 pt-2"
        @submit.prevent="submitNewRecord"
      >
        <div>
          <label
            for="followup-name"
            class="block text-xs font-medium text-ink mb-2"
            >Full name</label
          >
          <input
            id="followup-name"
            v-model="form.fullName"
            type="text"
            required
            class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
            placeholder="e.g. Jane Doe"
          >
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="followup-category"
              class="block text-xs font-medium text-ink mb-2"
              >Category</label
            >
            <select
              id="followup-category"
              v-model="form.category"
              required
              class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
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
              class="block text-xs font-medium text-ink mb-2"
              >Phone number</label
            >
            <input
              id="followup-phone"
              v-model="form.phoneNumber"
              type="tel"
              class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              placeholder="080..."
            >
          </div>
        </div>

        <div>
          <label
            for="followup-event"
            class="block text-xs font-medium text-ink mb-2"
            >Link to event (optional)</label
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
            class="block text-xs font-medium text-ink mb-2"
            >Initial note (optional)</label
          >
          <textarea
            id="followup-initial-note"
            v-model="form.initialNote"
            rows="3"
            class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
            placeholder="Context or details about this person..."
          />
        </div>

        <div class="border-t border-line pt-6">
          <AppButton
            type="submit"
            size="lg"
            class="w-full"
            :loading="isCreating"
          >
            {{ isCreating ? "Saving…" : "Save record" }}
          </AppButton>
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
