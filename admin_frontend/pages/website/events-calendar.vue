<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <!-- Page Header -->
    <AppHeading
      class="mb-8"
      title="Events calendar management"
      subtitle="Manage the hero banner and upcoming events listing."
    />

    <!-- Main Form -->
    <form
      class="space-y-13 border-t border-line pt-7"
      @submit.prevent="saveSettings"
    >
      <!-- Section 1: Hero Banner -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Hero Banner
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Configure the header section of the events page.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                for="events-calendar-hero-image"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Image URL</label
              >
              <MediaPickerInput
                v-model="heroSection.heroImage"
                input-id="events-calendar-hero-image"
              />
            </div>
            <div>
              <label
                for="events-calendar-hero-kicker"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Kicker</label
              >
              <input
                id="events-calendar-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. What's happening"
              >
            </div>
            <div>
              <label
                for="events-calendar-hero-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Headline</label
              >
              <input
                id="events-calendar-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Events Calendar"
              >
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.heroSection"
              @click="handleSaveSection('heroSection', heroSection)"
            />
          </div>
        </AppCard>
      </div>

      <!-- Section 2: Events Listing -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-8 border-line"
      >
        <!-- Left Column: Header Info -->
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Upcoming Events
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Manage the list of events shown on the calendar.
          </p>
        </div>

        <!-- Right Column: Form Container -->
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <!-- Events Wrapper -->
          <div class="p-6 space-y-6">
            <div
              v-for="(event, index) in eventsSection.events"
              :key="'event-' + index"
              class="bg-subtle/60 rounded-surface p-5 border border-line relative"
            >
              <span
                class="absolute top-4 right-4 text-xs font-semibold text-muted font-mono flex items-center justify-center gap-2"
              >
                Event {{ index + 1 }}

                <Icon
                  name="heroicons:minus-circle"
                  class="h-4 w-4 text-danger-text cursor-pointer hover:text-danger-text transition-colors"
                  @click="removeEvent(index)"
                />
              </span>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div>
                  <label
                    :for="`event-month-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                  >
                    Month
                  </label>
                  <input
                    :id="`event-month-${index}`"
                    v-model="event.month"
                    type="text"
                    class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                    placeholder="e.g. SEP"
                  >
                </div>

                <div>
                  <label
                    :for="`event-day-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                  >
                    Day
                  </label>
                  <input
                    :id="`event-day-${index}`"
                    v-model="event.day"
                    type="text"
                    class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                    placeholder="e.g. 15"
                  >
                </div>

                <div class="md:col-span-2">
                  <label
                    :for="`event-title-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                  >
                    Event Title
                  </label>
                  <input
                    :id="`event-title-${index}`"
                    v-model="event.title"
                    type="text"
                    class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                    placeholder="e.g. Midweek Communion Service"
                  >
                </div>

                <div class="md:col-span-2">
                  <label
                    :for="`event-description-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    :id="`event-description-${index}`"
                    v-model="event.description"
                    rows="3"
                    class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
                    placeholder="Details about the event..."
                  />
                </div>

                <div>
                  <label
                    :for="`event-time-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                  >
                    Time
                  </label>
                  <input
                    :id="`event-time-${index}`"
                    v-model="event.time"
                    type="text"
                    class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                    placeholder="e.g. 6:00 PM"
                  >
                </div>

                <div>
                  <label
                    :for="`event-location-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                  >
                    Location
                  </label>
                  <input
                    :id="`event-location-${index}`"
                    v-model="event.location"
                    type="text"
                    class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                    placeholder="e.g. Main Auditorium"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Add & Save Button Container -->
          <div class="px-6 pb-6 pt-2 flex justify-end gap-3">
            <AppButton variant="secondary" @click.prevent="addEvent">
              Add Event
            </AppButton>
            <SaveSectionButton
              :is-loading="sectionSavingState.eventsSection"
              @click="handleSaveSection('eventsSection', eventsSection)"
            />
          </div>
        </AppCard>
      </div>

      <!-- Sticky save bar: stays in flow at the end of the form and pins to
           the viewport bottom while the form is in view. Negative margins
           mirror main's padding (layout/default.vue) so the bar bleeds to
           the column edges without width calculations. -->
      <div
        class="sticky bottom-0 z-sticky -mx-4 -mb-5 mt-6 flex items-center justify-end gap-3 border-t border-line bg-surface/90 px-4 py-3 backdrop-blur-md md:-mx-6 md:-mb-6 md:px-6 lg:-mx-8 lg:-mb-8 lg:px-8"
      >
        <AppButton type="submit" size="lg" :loading="isSaving">
          {{ isSaving ? "Saving…" : "Save changes" }}
        </AppButton>
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

// State for individual section saves
const sectionSavingState = reactive({
  heroSection: false,
  eventsSection: false,
});

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
const { isFetching, isSaving, loadSettings, saveSettings, saveSection } =
  usePageManager("events-calendar", sectionsMap, {
    customParser: eventsCalendarParser,
  });

// Section-specific save handler
const handleSaveSection = async (sectionKey, sectionData) => {
  sectionSavingState[sectionKey] = true;
  try {
    await saveSection(sectionKey, sectionData);
  } finally {
    sectionSavingState[sectionKey] = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>
