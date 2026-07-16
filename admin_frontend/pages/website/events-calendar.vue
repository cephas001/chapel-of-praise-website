<!-- pages/events-calendar.vue -->
<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Events Calendar Management
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Manage the hero banner and upcoming events listing.
      </p>
    </div>

    <!-- Main Form -->
    <form
      @submit.prevent="saveSettings"
      class="space-y-13 border-t border-gray-200 pt-7"
    >
      <!-- Section 1: Hero Banner -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Hero Banner
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the header section of the events page.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Image URL</label
              >
              <input
                v-model="heroSection.heroImage"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="https://example.com/image.webp"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Kicker</label
              >
              <input
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. What's happening"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Headline</label
              >
              <input
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Events Calendar"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Events Listing -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-8 border-gray-200"
      >
        <!-- Left Column: Header Info -->
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Upcoming Events
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Manage the list of events shown on the calendar.
          </p>
        </div>

        <!-- Right Column: Form Container -->
        <div
          class="md:col-span-2 bg-white rounded-xl border shadow-sm border-gray-200 flex flex-col"
        >
          <!-- Events Wrapper -->
          <div class="p-6 space-y-6">
            <div
              v-for="(event, index) in eventsSection.events"
              :key="'event-' + index"
              class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative"
            >
              <span
                class="absolute top-4 right-4 text-[11px] font-bold text-gray-400 uppercase font-jetbrains flex items-center justify-center gap-2"
              >
                Event {{ index + 1 }}

                <Icon
                  name="heroicons:minus-circle"
                  class="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                  @click="removeEvent(index)"
                />
              </span>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Month
                  </label>
                  <input
                    v-model="event.month"
                    type="text"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                    placeholder="e.g. SEP"
                  />
                </div>

                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Day
                  </label>
                  <input
                    v-model="event.day"
                    type="text"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                    placeholder="e.g. 15"
                  />
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Event Title
                  </label>
                  <input
                    v-model="event.title"
                    type="text"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                    placeholder="e.g. Midweek Communion Service"
                  />
                </div>

                <div class="md:col-span-2">
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    v-model="event.description"
                    rows="3"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                    placeholder="Details about the event..."
                  ></textarea>
                </div>

                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Time
                  </label>
                  <input
                    v-model="event.time"
                    type="text"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                    placeholder="e.g. 6:00 PM"
                  />
                </div>

                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Location
                  </label>
                  <input
                    v-model="event.location"
                    type="text"
                    class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                    placeholder="e.g. Main Auditorium"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Add Button Container -->
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <button
              class="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
              @click.prevent="addEvent"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>

      <!-- Sticky Footer -->
      <div
        class="fixed bottom-0 right-0 w-full md:w-[calc(100%-18rem)] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-end z-30"
      >
        <button
          type="submit"
          :disabled="isSaving"
          class="inline-flex items-center justify-center rounded-xl bg-black px-8 py-3 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
        >
          <Icon
            v-if="isSaving"
            name="heroicons:arrow-path"
            class="mr-2 h-4 w-4 animate-spin"
          />
          {{ isSaving ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";

definePageMeta({
  allowedUserTypes: ["website"],
});

// Config & Utilities
const confirm = useConfirm();

// Section Data
const heroSection = reactive({
  heroImage: "",
  heroKicker: "",
  heroHeadline: "",
});

const eventsSection = reactive({
  events: [],
});

// Section Map
const sectionsMap = {
  heroSection,
  eventsSection,
};

// Helpers: Add/Remove Events
const addEvent = () => {
  eventsSection.events.push({
    month: "",
    day: "",
    title: "",
    description: "",
    time: "",
    location: "",
  });
};

const removeEvent = async (index) => {
  const answer = await confirm.ask({
    title: "Remove Event",
    message:
      "Are you sure you want to delete this event? Once saved this action is irreversible.",
    confirmText: "Remove",
    cancelText: "Cancel",
    isDestructive: true,
  });

  if (answer) {
    eventsSection.events.splice(index, 1);
  }
};

// Custom parser to handle the dynamic events array
const eventsCalendarParser = (response, map) => {
  Object.entries(response).forEach(([key, value]) => {
    if (map[key]) {
      if (key === "eventsSection" && value.events) {
        map.eventsSection.events = value.events;
      } else {
        Object.assign(map[key], value);
      }
    }
  });
};

// Initialize the composable utilizing the pageEndpoint "events-calendar"
const { isFetching, isSaving, loadSettings, saveSettings } = usePageManager(
  "events-calendar",
  sectionsMap,
  { customParser: eventsCalendarParser },
);

onMounted(() => {
  loadSettings();
});
</script>
