<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="pt-5 pb-10">
    <div class="mb-8">
      <NuxtLink
        to="/events"
        class="inline-flex items-center text-xs font-medium text-muted transition-colors hover:text-ink mb-5"
      >
        <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
        Back to Events
      </NuxtLink>

      <div
        v-if="event"
        class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
      >
        <div>
          <AppHeading
            :title="event.service === 'SPECIAL PROGRAM' ? event.specialProgram : event.service"
            subtitle="View attendance, altar calls, demographics and follow-up records for this event."
          />
        </div>
      </div>
    </div>

    <div v-if="event" class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-6">
        <AppCard
          body-class="p-6 space-y-6"
        >
          <h3
            class="text-base font-semibold text-ink mb-4 border-b border-line pb-3"
          >
            Overview
          </h3>

          <div class="space-y-5">
            <div>
              <p
                class="font-mono text-xs font-medium text-muted mb-2"
              >
                Date
              </p>
              <p
                class="text-xs md:text-sm text-ink flex items-center"
              >
                <Icon
                  name="heroicons:calendar"
                  class="mr-2 h-4 w-4 text-ink"
                />
                {{ formatDate(event.eventDate) }}
              </p>
            </div>

            <div>
              <p
                class="font-mono text-xs font-medium text-muted mb-2"
              >
                Time
              </p>
              <p
                class="text-xs md:text-sm text-ink flex items-center"
              >
                <Icon
                  name="heroicons:clock"
                  class="mr-2 h-4 w-4 text-muted"
                />
                {{ event.startTime }} - {{ event.endTime }}
              </p>
            </div>

            <div v-if="event.programDay">
              <p
                class="font-mono text-xs font-medium text-muted mb-2"
              >
                Program Day
              </p>
              <p
                class="text-xs md:text-sm text-ink flex items-center"
              >
                <Icon
                  name="heroicons:calendar"
                  class="mr-2 h-4 w-4 text-ink"
                />
                {{ event.programDay }}
              </p>
            </div>

            <div class="mt-1">
              <p
                class="font-mono text-xs font-medium text-muted mb-2"
              >
                Description
              </p>
              <p
                class="bg-subtle border border-line rounded-control p-4 text-xs md:text-sm text-ink leading-relaxed"
              >
                {{ event.eventDescription || "No additional details provided" }}
              </p>
            </div>
          </div>
        </AppCard>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventHeadCount :event-id="eventId" />

          <AppCard
            body-class="p-6 flex flex-col justify-between gap-5"
          >
            <div class="flex items-start gap-4">
              <div
                class="h-12 w-12 rounded-surface bg-subtle border border-line flex items-center justify-center text-ink shrink-0"
              >
                <Icon
                  name="heroicons:clipboard-document-check"
                  class="h-6 w-6"
                />
              </div>

              <div class="space-y-1">
                <p
                  class="font-mono text-xs font-medium text-muted"
                >
                  Attendance
                </p>
                <h3 class="text-base font-semibold text-ink">
                  Unit Attendance
                </h3>
                <p class="text-xs md:text-sm text-muted leading-relaxed">
                  Record and review attendance by chapel unit.
                </p>
              </div>
            </div>

            <AppButton :to="`/events/${eventId}/attendance`" class="w-fit">
              Manage attendance &rarr;
            </AppButton>
          </AppCard>

          <div>
            <EventAltarCalls
              :event-id="eventId"
              :selected-call="selectedAltarCall"
              @select-call="(call) => (selectedAltarCall = call)"
            />
          </div>

          <EventFollowUps
            :event-id="eventId"
            :selected-call="selectedAltarCall"
          />
        </div>
      </div>
    </div>

    <div v-else class="py-24 text-center">
      <Icon
        name="heroicons:exclamation-triangle"
        class="mx-auto h-12 w-12 text-danger-text mb-4"
      />
      <h3 class="text-sm font-semibold text-ink">
        Event not found
      </h3>
      <p class="text-muted text-xs md:text-sm mb-6">
        The event you are looking for does not exist or has been deleted.
      </p>
      <NuxtLink
        to="/events"
        class="text-xs md:text-sm font-semibold text-ink underline"
        >Return to Events</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRuntimeConfig } from "#app";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const route = useRoute();
const config = useRuntimeConfig();
const toast = useAppToast(); // auto-imported
const selectedAltarCall = ref(null);

const eventId = route.params.id;
const event = ref(null);
const isFetching = ref(true);

const fetchEventDetails = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/events/${eventId}`,
    );
    event.value = response;
  } catch (error) {
    console.error("Failed to fetch event details:", error);
    toast.error("Could not retrieve event details."); // migrated
  } finally {
    isFetching.value = false;
  }
};

onMounted(() => {
  fetchEventDetails();
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};
</script>
