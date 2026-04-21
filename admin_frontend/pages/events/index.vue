<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
    >
      <AppPageHeader
        text="Event Management"
        description="Manage all upcoming and past chapel events."
        classList="mt-5"
      />

      <button
        @click="openCreateDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
      >
        <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
        New Event
      </button>
    </div>

    <div
      class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div v-if="isFetching" class="p-12 text-center">
        <Icon
          name="heroicons:arrow-path"
          class="mx-auto h-8 w-8 text-gray-400 animate-spin mb-4"
        />
        <h3 class="text-sm font-bold text-gray-900">Loading Events...</h3>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-nowrap"
              >
                Event Details
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-nowrap"
              >
                Service Type
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-nowrap"
              >
                Date & Time
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-50">
            <tr
              v-for="event in events"
              :key="event.id"
              class="hover:bg-gray-50/50 transition-colors group"
              @click="navigateTo(`/events/${event.id}`)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-bold text-gray-900 font-roboto">
                    {{
                      event.service === "SPECIAL PROGRAM"
                        ? event.specialProgram
                        : event.service
                    }}
                  </div>
                  <div
                    class="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate"
                  >
                    {{ event.eventDescription || "No description provided" }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap flex gap-2 flex-col">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold w-fit"
                  :class="getBadgeColor(event.service)"
                >
                  {{ event.service }}
                </span>
                <div
                  v-if="event.programDay"
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold w-fit"
                  :class="getBadgeColor(event.service)"
                >
                  {{ event.programDay }}
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">
                  {{ formatDate(event.eventDate) }}
                </div>
                <div class="text-xs text-gray-500 mt-0.5 font-medium">
                  {{ event.startTime }} - {{ event.endTime }}
                </div>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="openEditDrawer(event)"
                    class="text-black transition-colors p-2 rounded-lg hover:bg-gray-100"
                    title="Edit Event"
                  >
                    <Icon name="heroicons:pencil-square" class="h-5 w-5" />
                  </button>
                  <button
                    @click="handleDeleteEvent(event.id)"
                    class="text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                    title="Delete Event"
                  >
                    <Icon name="heroicons:trash" class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isFetching && events.length === 0" class="p-12 text-center">
        <Icon
          name="heroicons:calendar"
          class="mx-auto h-12 w-12 text-gray-300 mb-4"
        />
        <h3 class="text-lg font-bold text-gray-900 mb-1">No events found</h3>
        <p class="text-gray-500 text-sm">
          Get started by creating a new event for the chapel.
        </p>
      </div>
    </div>

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
import { useAlertModal } from "~/composables/useAlertModal";
import { useConfirm } from "~/composables/useConfirm";

const config = useRuntimeConfig();
const { showAlert } = useAlertModal();
const confirm = useConfirm();

const events = ref([]);
const isFetching = ref(true);
const isSubmitting = ref(false);

const isDrawerOpen = ref(false);
const selectedEvent = ref(null);

// Fetch all events on mount
const fetchEvents = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/events`);
    events.value = response;
  } catch (error) {
    showAlert("Failed to retrieve events from the server", "error");
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
        `${config.public.apiBase}/events/${selectedEvent.value.id}`,
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
      const response = await $fetch(`${config.public.apiBase}/events`, {
        method: "POST",
        body: formData,
      });

      // Add to beginning of local array
      events.value.unshift(response.event);
    }

    showAlert("Event saved successfully", "success");
    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    showAlert(
      "Action Failed",
      error.data?.error || "Could not save the event.",
      "error",
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
    await $fetch(`${config.public.apiBase}/events/${id}`, {
      method: "DELETE",
    });

    // Remove event from local state
    events.value = events.value.filter((e) => e.id !== id);
    showAlert("Event deleted successfully", "success");
  } catch (error) {
    console.error("Delete error:", error);
    showAlert(
      "Action Failed",
      error.data?.error || "Could not delete the event.",
      "error",
    );
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
