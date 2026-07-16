<template>
  <LoadingScreen :isLoading="isFetching" />

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
        @click="openCreateDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        New Event
      </button>
    </div>

    <!-- Main Container -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- Data Table -->
      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
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
              v-for="event in events"
              :key="event.id"
              class="group cursor-pointer px-6 py-5 hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-xs md:text-sm font-bold text-gray-900">
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
                <div class="text-xs md:text-sm font-bold text-gray-900">
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
                    @click="navigateTo(`/events/${event.id}`)"
                    class="text-gray-400 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-100"
                    title="Open Event"
                  >
                    <Icon name="heroicons:eye" class="h-4 w-4" />
                  </button>
                  <button
                    @click="openEditDrawer(event)"
                    class="text-gray-400 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-100"
                    title="Edit Event"
                  >
                    <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                  </button>
                  <button
                    @click="handleDeleteEvent(event.id)"
                    class="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Delete Event"
                  >
                    <Icon name="heroicons:trash" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
import { ref, onMounted } from "vue";
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

const isDrawerOpen = ref(false);
const selectedEvent = ref(null);

// Fetch all events on mount
const fetchEvents = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/admin/events`);
    events.value = response;
  } catch (error) {
    console.log("Error fetching events:", error);
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
