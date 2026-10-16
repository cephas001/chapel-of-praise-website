<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Event Management
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Manage all upcoming and past chapel events.
        </p>
      </div>

      <button
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
        @click="openCreateDrawer"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        New Event
      </button>
    </div>

    <!-- Main Container -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- List Controls -->
      <div
        class="border-b border-gray-100 p-4 flex flex-col lg:flex-row gap-3 lg:items-center"
      >
        <div class="relative flex-1 min-w-0">
          <label for="events-search" class="sr-only">Search events</label>
          <Icon
            name="heroicons:magnifying-glass"
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          />
          <input
            id="events-search"
            v-model="search"
            type="search"
            placeholder="Search by service, description or program day..."
            class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white"
          >
        </div>

        <div class="flex flex-col sm:flex-row gap-3 shrink-0">
          <div>
            <label for="events-service-filter" class="sr-only">
              Filter by service type
            </label>
            <select
              id="events-service-filter"
              v-model="filters.service"
              class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
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
              class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
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
              class="w-full sm:w-auto rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-8 py-2.5 text-xs md:text-sm text-black outline-none transition-all focus:border-black focus:bg-white appearance-none cursor-pointer"
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
      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <caption class="sr-only">All events</caption>
          <thead class="bg-gray-50/50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Event Details
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Service Type
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Date & Time
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
              v-for="event in paged"
              :key="event.id"
              class="group hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-xs md:text-sm text-black font-bold">
                    {{
                      event.service === "SPECIAL PROGRAM"
                        ? event.specialProgram
                        : event.service
                    }}
                  </div>
                  <div
                    class="text-[11px] font-jetbrains text-gray-500 mt-0.5 max-w-[250px] truncate font-medium"
                  >
                    {{ event.eventDescription || "No description provided" }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap flex gap-2 flex-col">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider w-fit"
                  :class="getBadgeColor(event.service)"
                >
                  {{ event.service }}
                </span>
                <div
                  v-if="event.programDay"
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider w-fit"
                  :class="getBadgeColor(event.service)"
                >
                  {{ event.programDay }}
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs md:text-sm text-black">
                  {{ formatDate(event.eventDate) }}
                </div>
                <div
                  class="text-xs text-gray-500 mt-0.5 font-jetbrains font-medium tracking-wide"
                >
                  {{ event.startTime }} - {{ event.endTime }}
                </div>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end gap-1">
                  <button
                    class="text-gray-500 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-100"
                    title="Open Event"
                    aria-label="Open event"
                    @click="navigateTo(`/events/${event.id}`)"
                  >
                    <Icon name="heroicons:eye" class="h-4 w-4" />
                  </button>
                  <button
                    class="text-gray-500 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-100"
                    title="Edit Event"
                    aria-label="Edit event"
                    @click="openEditDrawer(event)"
                  >
                    <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                  </button>
                  <button
                    class="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
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
          v-if="!isFetching && events.length > 0 && filtered.length === 0"
          class="py-16 text-center border-t border-gray-100"
        >
          <Icon
            name="heroicons:magnifying-glass"
            class="mx-auto h-10 w-10 text-gray-300 mb-4"
          />
          <h3 class="text-sm font-bold text-black mb-1 font-jetbrains">
            No events match your filters
          </h3>
          <button
            class="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 font-jetbrains hover:bg-gray-50 transition-colors"
            @click="reset"
          >
            Clear filters
          </button>
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

      <!-- Empty State -->
      <div v-if="!isFetching && events.length === 0" class="py-20 text-center">
        <Icon
          name="heroicons:calendar"
          class="mx-auto h-12 w-12 text-gray-300 mb-4"
        />
        <h3 class="text-sm font-bold text-black mb-2">No events found</h3>
        <p class="text-gray-500 text-xs px-5 font-mono">
          Get started by creating a new event for the chapel.
        </p>
      </div>
    </div>

    <!-- SlideOver Drawer -->
    <SlideOver
      :is-open="isDrawerOpen"
      :title="selectedEvent ? 'Edit Event' : 'Create New Event'"
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
import { computed, ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useConfirm } from "~/composables/useConfirm";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const confirm = useConfirm();
const toast = useAppToast();

const events = ref([]);
const isFetching = ref(true);
const isSubmitting = ref(false);

const eventLabel = (event) =>
  event.service === "SPECIAL PROGRAM"
    ? event.specialProgram || event.service
    : event.service;

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

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
} = useListControls(events, {
  searchFields: ["service", "specialProgram", "eventDescription", "programDay"],
  defaultFilters: { service: "ALL", time: "all" },
  filter: (event, activeFilters) => {
    if (
      activeFilters.service !== "ALL" &&
      event.service !== activeFilters.service
    ) {
      return false;
    }
    if (activeFilters.time !== "all") {
      const isUpcoming = new Date(event.eventDate || 0) >= startOfToday();
      if (activeFilters.time === "upcoming" && !isUpcoming) return false;
      if (activeFilters.time === "past" && isUpcoming) return false;
    }
    return true;
  },
  sorters: {
    date: (a, b) => new Date(a.eventDate || 0) - new Date(b.eventDate || 0),
    name: (a, b) => String(eventLabel(a)).localeCompare(String(eventLabel(b))),
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

const isDrawerOpen = ref(false);
const selectedEvent = ref(null);

// Fetch all events on mount
const fetchEvents = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/admin/events`);
    events.value = response;
  } catch (error) {
    console.error("Error fetching events:", error);
    toast.error("Could not fetch events. Please try again.");
  } finally {
    isFetching.value = false;
  }
};

onMounted(() => {
  fetchEvents();
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
      // UPDATE Existing Event
      const response = await $fetch(
        `${config.public.apiBase}/admin/events/${selectedEvent.value.id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      // Update local state optimistically
      const index = events.value.findIndex(
        (e) => e.id === selectedEvent.value.id,
      );
      if (index !== -1) events.value[index] = response.event;
    } else {
      // CREATE New Event
      const response = await $fetch(`${config.public.apiBase}/admin/events`, {
        method: "POST",
        body: formData,
      });

      // Add to beginning of local array
      events.value.unshift(response.event);
    }

    toast.success(
      selectedEvent.value
        ? "Event updated successfully!"
        : "Event created successfully!",
    );
    closeDrawer();
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
    title: "Delete Event",
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

    // Remove event from local state
    events.value = events.value.filter((e) => e.id !== id);
    toast.success("Event deleted successfully");
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
      return "bg-blue-50 text-blue-700";
    case "BIBLE STUDY":
      return "bg-green-50 text-green-700";
    case "PRAYER MEETING":
      return "bg-purple-50 text-purple-700";
    case "SPECIAL PROGRAM":
      return "bg-orange-50 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
</script>
