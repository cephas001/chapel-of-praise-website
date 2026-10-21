<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <!-- Page Header -->
    <AppHeading
      class="mb-8"
      title="Event management"
      subtitle="Manage all upcoming and past chapel events."
    >
      <template #actions>
        <AppButton icon="heroicons:plus" @click="openCreateDrawer">
          New event
        </AppButton>
      </template>
    </AppHeading>

    <!-- Main Container -->
    <AppCard body-class="p-0">
      <!-- List Controls -->
      <div
        class="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center"
      >
        <div class="relative flex-1 min-w-0">
          <label for="events-search" class="sr-only">Search events</label>
          <Icon
            name="heroicons:magnifying-glass"
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            id="events-search"
            v-model="search"
            type="search"
            placeholder="Search by service, description or program day..."
            class="w-full rounded-control border border-line bg-subtle py-2.5 pl-9 pr-4 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          />
        </div>

        <div class="flex flex-col sm:flex-row gap-3 shrink-0">
          <div>
            <label for="events-service-filter" class="sr-only">
              Filter by service type
            </label>
            <select
              id="events-service-filter"
              v-model="filters.service"
              class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
            >
              <option value="ALL">All service types</option>
              <option value="SUNDAY SERVICE">Sunday Service</option>
              <option value="BIBLE STUDY">Bible Study</option>
              <option value="PRAYER MEETING">Prayer Meeting</option>
              <option value="SPECIAL PROGRAM">Special Program</option>
            </select>
          </div>

          <div>
            <label for="events-time-filter" class="sr-only">
              Filter by time
            </label>
            <select
              id="events-time-filter"
              v-model="filters.time"
              class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
            >
              <option value="all">All time</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          <div>
            <label for="events-sort" class="sr-only">Sort events</label>
            <select
              id="events-sort"
              v-model="sortOption"
              class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-3 pr-8 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface sm:w-auto md:text-sm"
            >
              <option value="date:desc">Newest first</option>
              <option value="date:asc">Oldest first</option>
              <option value="name:asc">Name A–Z</option>
              <option value="name:desc">Name Z–A</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-line">
          <caption class="sr-only">
            All events
          </caption>
          <thead class="bg-subtle">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Event details
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Service type
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Date & time
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
              v-for="event in events"
              :key="event.id"
              class="group transition-colors hover:bg-subtle/40"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-xs font-medium text-ink md:text-sm">
                    {{
                      event.service === "SPECIAL PROGRAM"
                        ? event.specialProgram
                        : event.service
                    }}
                  </div>
                  <div class="mt-0.5 max-w-[250px] truncate text-xs text-muted">
                    {{ event.eventDescription || "No description provided" }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap flex gap-2 flex-col">
                <span
                  class="inline-flex w-fit items-center rounded-badge border px-2 py-0.5 font-mono text-xs font-medium"
                  :class="getBadgeColor(event.service)"
                >
                  {{ event.service }}
                </span>
                <div
                  v-if="event.programDay"
                  class="inline-flex w-fit items-center rounded-badge border px-2.5 py-1 font-mono text-xs font-medium"
                  :class="getBadgeColor(event.service)"
                >
                  {{ event.programDay }}
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-mono text-xs text-ink md:text-sm">
                  {{ formatDate(event.eventDate) }}
                </div>
                <div class="mt-0.5 font-mono text-xs text-muted">
                  {{ event.startTime }} – {{ event.endTime }}
                </div>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end gap-1">
                  <button
                    class="rounded-control p-2 text-muted transition-colors hover:bg-subtle hover:text-ink"
                    title="Open Event"
                    aria-label="Open event"
                    @click="navigateTo(`/events/${event.id}`)"
                  >
                    <Icon name="heroicons:eye" class="h-4 w-4" />
                  </button>
                  <button
                    class="rounded-control p-2 text-muted transition-colors hover:bg-subtle hover:text-ink"
                    title="Edit Event"
                    aria-label="Edit event"
                    @click="openEditDrawer(event)"
                  >
                    <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                  </button>
                  <button
                    class="rounded-control p-2 text-muted transition-colors hover:bg-danger-surface hover:text-danger-text"
                    title="Delete Event"
                    aria-label="Delete event"
                    @click="handleDeleteEvent(event.id)"
                  >
                    <Icon name="heroicons:trash" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- No matches -->
        <div
          v-if="!isFetching && events.length === 0 && hasActiveFilters"
          class="border-t border-line py-16 text-center"
        >
          <Icon
            name="heroicons:magnifying-glass"
            class="mx-auto mb-4 h-10 w-10 text-line"
          />
          <h3 class="mb-1 text-sm font-semibold text-ink">
            No events match your filters
          </h3>
          <AppButton variant="secondary" size="sm" class="mt-4" @click="reset">
            Clear filters
          </AppButton>
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

      <!-- Empty State -->
      <div
        v-if="!isFetching && events.length === 0 && !hasActiveFilters"
        class="py-20 text-center"
      >
        <Icon
          name="heroicons:calendar"
          class="mx-auto mb-4 h-12 w-12 text-line"
        />
        <h3 class="mb-2 text-sm font-semibold text-ink">No events found</h3>
        <p class="px-5 text-xs text-muted">
          Get started by creating a new event for the chapel.
        </p>
      </div>
    </AppCard>

    <!-- SlideOver Drawer -->
    <SlideOver
      :is-open="isDrawerOpen"
      :title="selectedEvent ? 'Edit event' : 'Create new event'"
      @close="closeDrawer"
    >
      <EventForm
        :initial-data="selectedEvent"
        :loading="isSubmitting"
        @submit="handleFormSubmit"
      />
    </SlideOver>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRuntimeConfig } from "#app";
import { useConfirm } from "~/composables/useConfirm";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const confirm = useConfirm();
const toast = useAppToast();

const pageSize = 10;
const events = ref([]);
const isFetching = ref(true);
const isSubmitting = ref(false);
const search = ref("");
const filters = ref({ service: "ALL", time: "all" });
const sortOption = ref("date:desc");
const page = ref(1);
const total = ref(0);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize)),
);
const hasActiveFilters = computed(
  () =>
    search.value.trim().length > 0 ||
    filters.value.service !== "ALL" ||
    filters.value.time !== "all",
);

const isDrawerOpen = ref(false);
const selectedEvent = ref(null);

let requestSequence = 0;
let filterTimer;

const fetchEvents = async () => {
  const requestId = ++requestSequence;
  isFetching.value = true;

  try {
    const response = await $fetch(`${config.public.apiBase}/admin/events`, {
      query: {
        paginated: 1,
        limit: pageSize,
        offset: (page.value - 1) * pageSize,
        search: search.value.trim() || undefined,
        service: filters.value.service,
        time: filters.value.time,
        sort: sortOption.value,
      },
    });

    if (requestId !== requestSequence) return;

    events.value = response.events;
    total.value = response.total;

    if (page.value > totalPages.value) {
      page.value = totalPages.value;
      await fetchEvents();
    }
  } catch (error) {
    if (requestId !== requestSequence) return;
    console.error("Error fetching events:", error);
    toast.error("Could not fetch events. Please try again.");
  } finally {
    if (requestId === requestSequence) {
      isFetching.value = false;
    }
  }
};

const scheduleFilterFetch = () => {
  clearTimeout(filterTimer);
  filterTimer = setTimeout(() => {
    page.value = 1;
    fetchEvents();
  }, 250);
};

watch([search, filters, sortOption], scheduleFilterFetch, { deep: true });

const reset = () => {
  search.value = "";
  filters.value = { service: "ALL", time: "all" };
  sortOption.value = "date:desc";
};

const nextPage = () => {
  if (page.value >= totalPages.value) return;
  page.value += 1;
  fetchEvents();
};

const prevPage = () => {
  if (page.value <= 1) return;
  page.value -= 1;
  fetchEvents();
};

onMounted(() => {
  fetchEvents();
});

onBeforeUnmount(() => {
  clearTimeout(filterTimer);
});

// Drawer Controls
const openCreateDrawer = () => {
  selectedEvent.value = null;
  isDrawerOpen.value = true;
};

const openEditDrawer = (event) => {
  selectedEvent.value = { ...event };
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  setTimeout(() => {
    selectedEvent.value = null;
  }, 300); // Wait for slide animation to finish
};

// Form Submission Handler
const handleFormSubmit = async (formData) => {
  isSubmitting.value = true;

  try {
    if (selectedEvent.value) {
      await $fetch(
        `${config.public.apiBase}/admin/events/${selectedEvent.value.id}`,
        {
          method: "PUT",
          body: formData,
        },
      );
    } else {
      await $fetch(`${config.public.apiBase}/admin/events`, {
        method: "POST",
        body: formData,
      });
    }

    toast.success(
      selectedEvent.value
        ? "Event updated successfully!"
        : "Event created successfully!",
    );
    closeDrawer();
    await fetchEvents();
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(
      error.data?.error ||
        "Could not submit the form. Please check your input and try again.",
    );
  } finally {
    isSubmitting.value = false;
  }
};

// Delete Event Handler
const handleDeleteEvent = async (id) => {
  const answer = await confirm.ask({
    title: "Delete event",
    message:
      "Are you sure you want to delete this event? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    isDestructive: true,
  });

  if (!answer) {
    return;
  }

  try {
    await $fetch(`${config.public.apiBase}/admin/events/${id}`, {
      method: "DELETE",
    });

    toast.success("Event deleted successfully");
    await fetchEvents();
  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error.data?.error || "Could not delete the event.");
  }
};

// UI Helpers
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const getBadgeColor = (serviceType) => {
  switch (serviceType) {
    case "SUNDAY SERVICE":
      return "border-line bg-subtle text-ink";
    case "BIBLE STUDY":
      return "border-line bg-subtle text-muted";
    case "PRAYER MEETING":
      return "border-line bg-subtle text-muted";
    case "SPECIAL PROGRAM":
      return "border-ink bg-ink text-white";
    default:
      return "border-line bg-subtle text-muted";
  }
};
</script>
