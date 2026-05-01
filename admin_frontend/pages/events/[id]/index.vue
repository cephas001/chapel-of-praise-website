<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div class="mb-8">
      <NuxtLink
        to="/events"
        class="inline-flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 px-5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-colors"
      >
        <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
        Back to Events
      </NuxtLink>

      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6"
        v-if="event"
      >
        <div>
          <div
            v-if="isFetching"
            class="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"
          ></div>
          <h1
            v-else
            class="text-3xl font-black text-black tracking-tight mb-1 font-roboto"
          >
            {{
              event?.service === "SPECIAL PROGRAM"
                ? event?.specialProgram
                : event?.service
            }}
          </h1>
        </div>

        <button
          v-if="!isFetching"
          class="inline-flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 px-5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-colors"
        >
          <Icon name="heroicons:document-arrow-down" class="mr-2 h-5 w-5" />
          Export Report
        </button>
      </div>
    </div>

    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900">Loading Event Details...</h3>
    </div>

    <div
      v-else-if="event"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3
            class="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3"
          >
            Overview
          </h3>

          <div class="space-y-4">
            <div>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
              >
                Date
              </p>
              <p class="text-sm font-semibold text-black flex items-center">
                <Icon
                  name="heroicons:calendar"
                  class="mr-2 h-4 w-4 text-gray-400"
                />
                {{ formatDate(event.eventDate) }}
              </p>
            </div>

            <div>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
              >
                Time
              </p>
              <p class="text-sm font-semibold text-black flex items-center">
                <Icon
                  name="heroicons:clock"
                  class="mr-2 h-4 w-4 text-gray-400"
                />
                {{ event.startTime }} - {{ event.endTime }}
              </p>
            </div>

            <div v-if="event.programDay">
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
              >
                Program Day
              </p>
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-50 text-black"
              >
                {{ event.programDay }}
              </span>
            </div>

            <div>
              <p
                class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
              >
                Description
              </p>
              <p
                class="text-sm text-black leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100"
              >
                {{
                  event.eventDescription || "No additional details provided."
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <EventHeadCount :eventId="eventId" />

          <div
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center group hover:shadow-md transition-shadow"
          >
            <div
              class="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors"
            >
              <Icon name="heroicons:clipboard-document-check" class="h-6 w-6" />
            </div>
            <h3 class="text-lg font-bold text-black mb-1">Unit Attendance</h3>
            <p class="text-sm text-gray-500 mb-4">
              Record and review attendance by chapel unit.
            </p>

            <NuxtLink
              :to="`/events/${eventId}/attendance`"
              class="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Manage Attendance &rarr;
            </NuxtLink>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventHeadCount :eventId="eventId" />

            <EventAltarCalls
              :eventId="eventId"
              @select-call="(call) => (selectedAltarCall = call)"
              :selected-call="selectedAltarCall"
            />
          </div>

          <EventFollowUps
            :eventId="eventId"
            :selected-call="selectedAltarCall"
          />
        </div>
      </div>
    </div>

    <div v-else class="py-30 text-center">
      <Icon
        name="heroicons:exclamation-triangle"
        class="mx-auto h-12 w-12 text-red-400 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 mb-1">Event not found</h3>
      <p class="text-gray-500 text-sm mb-6">
        The event you are looking for does not exist or has been deleted.
      </p>
      <NuxtLink to="/events" class="text-sm font-semibold text-black underline"
        >Return to Events</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRuntimeConfig } from "#app";
import { useAlertModal } from "~/composables/useAlertModal";

const route = useRoute();
const config = useRuntimeConfig();
const { showAlert } = useAlertModal();
const selectedAltarCall = ref(null);

const eventId = route.params.id;
const event = ref(null);
const isFetching = ref(true);

const fetchEventDetails = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/events/${eventId}`);
    event.value = response;
  } catch (error) {
    console.error("Failed to fetch event details:", error);
    showAlert("Could not retrieve event details.", "error");
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
