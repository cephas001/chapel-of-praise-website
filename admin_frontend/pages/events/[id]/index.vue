<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="pt-5 font-montserrat">
    <div class="mb-8">
      <NuxtLink
        to="/events"
        class="inline-flex items-center text-xs font-jetbrains font-bold text-gray-500 hover:text-black transition-colors mb-5"
      >
        <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
        Back to Events
      </NuxtLink>

      <div
        v-if="event"
        class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
      >
        <div>
          <h2
            class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2"
          >
            {{
              event.service === "SPECIAL PROGRAM"
                ? event.specialProgram
                : event.service
            }}
          </h2>

          <p class="text-gray-600 text-xs md:text-sm max-w-xl">
            View attendance, altar calls, demographics and follow-up records for
            this event.
          </p>
        </div>

        <button
          class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
        >
          <Icon name="heroicons:document-arrow-down" class="mr-2 h-4 w-4" />
          Export Report
        </button>
      </div>
    </div>

    <div v-if="event" class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-6">
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <h3
            class="text-md font-bold text-black mb-4 border-b border-slate-200 font-jetbrains pb-3"
          >
            Overview
          </h3>

          <div class="space-y-5">
            <div>
              <p
                class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-600 mb-2"
              >
                Date
              </p>
              <p
                class="text-xs md:text-sm text-black flex items-center font-poppins"
              >
                <Icon
                  name="heroicons:calendar"
                  class="mr-2 h-4 w-4 text-black"
                />
                {{ formatDate(event.eventDate) }}
              </p>
            </div>

            <div>
              <p
                class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-600 mb-2"
              >
                Time
              </p>
              <p
                class="text-xs md:text-sm text-black flex items-center font-poppins"
              >
                <Icon
                  name="heroicons:clock"
                  class="mr-2 h-4 w-4 text-slate-400 dark:text-slate-500"
                />
                {{ event.startTime }} - {{ event.endTime }}
              </p>
            </div>

            <div v-if="event.programDay">
              <p
                class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-600 mb-2"
              >
                Program Day
              </p>
              <p
                class="text-xs md:text-sm text-black flex items-center font-poppins"
              >
                <Icon
                  name="heroicons:calendar"
                  class="mr-2 h-4 w-4 text-black"
                />
                {{ event.programDay }}
              </p>
            </div>

            <div class="mt-1">
              <p
                class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-600 mb-2"
              >
                Description
              </p>
              <p
                class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs md:text-sm text-gray-700 leading-relaxed"
              >
                {{ event.eventDescription || "No additional details provided" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventHeadCount :eventId="eventId" />

          <div
            class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between gap-5 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start gap-4">
              <div
                class="h-12 w-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-black shrink-0"
              >
                <Icon
                  name="heroicons:clipboard-document-check"
                  class="h-6 w-6"
                />
              </div>

              <div class="space-y-1">
                <p
                  class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-500"
                >
                  Attendance
                </p>
                <h3 class="text-md font-bold text-black font-jetbrains">
                  Unit Attendance
                </h3>
                <p class="text-sm text-gray-500 leading-relaxed">
                  Record and review attendance by chapel unit.
                </p>
              </div>
            </div>

            <NuxtLink
              :to="`/events/${eventId}/attendance`"
              class="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains w-fit"
            >
              Manage Attendance &rarr;
            </NuxtLink>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

    <div v-else class="py-24 text-center">
      <Icon
        name="heroicons:exclamation-triangle"
        class="mx-auto h-12 w-12 text-red-400 mb-4"
      />
      <h3 class="text-sm font-bold text-black font-jetbrains">
        Event not found
      </h3>
      <p class="text-gray-500 text-xs md:text-sm mb-6">
        The event you are looking for does not exist or has been deleted.
      </p>
      <NuxtLink
        to="/events"
        class="text-xs md:text-sm font-semibold text-black underline"
        >Return to Events</NuxtLink
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRuntimeConfig } from "#app";

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
