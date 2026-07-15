<template>
  <LoadingScreen :isLoading="pending" />
  <div class="bg-white text-black w-full font-sans">
    <!-- Static Hero Banner -->
    <section
      class="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white"
    >
      <div class="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>

      <!-- Unified Hero Image -->
      <img
        :src="pageData.hero.image"
        alt="Events Hero"
        class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 grayscale"
      />

      <div class="relative z-20 text-center px-4 mt-16">
        <p
          class="text-xs md:text-sm font-bold uppercase tracking-widest mb-3 text-[#e94e4e]"
        >
          {{ pageData.hero.kicker }}
        </p>
        <h1
          class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none text-white drop-shadow-lg"
        >
          {{ pageData.hero.headline }}
        </h1>
      </div>
    </section>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-4 md:px-8 py-20 md:py-28">
      <div class="space-y-6">
        <!-- Dynamic Event Items -->
        <div
          v-for="(event, index) in pageData.events"
          :key="'event-' + index"
          class="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 hover:shadow-md transition-shadow"
        >
          <!-- Date Block -->
          <div
            class="shrink-0 text-center bg-white border border-gray-200 rounded-xl px-6 py-4 w-28"
          >
            <p class="text-sm font-bold uppercase text-[#e94e4e] mb-1">
              {{ event.month }}
            </p>
            <p class="text-4xl font-impact text-black">{{ event.day }}</p>
          </div>

          <!-- Details Block -->
          <div class="flex-1">
            <h3 class="text-2xl font-impact uppercase text-black mb-2">
              {{ event.title }}
            </h3>
            <p class="text-gray-600 font-light mb-3 whitespace-pre-line">
              {{ event.description }}
            </p>
            <div
              class="flex flex-wrap items-center gap-4 text-xs font-bold uppercase text-gray-500 tracking-wider"
            >
              <span v-if="event.time">
                <Icon
                  name="heroicons:clock"
                  class="w-4 h-4 inline mr-1 -mt-1"
                />
                {{ event.time }}
              </span>
              <span v-if="event.location">
                <Icon
                  name="heroicons:map-pin"
                  class="w-4 h-4 inline mr-1 -mt-1"
                />
                {{ event.location }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="pageData.events.length === 0" class="text-center py-12">
          <p class="text-gray-500 font-light text-lg">
            No upcoming events listed at this time. Check back soon!
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useFetch, useHead } from "#app";
import defaultHeroImage from "~/assets/images/celebrations.webp";

useHead({
  title: "Events Calendar | Chapel of Praise",
});

const config = useRuntimeConfig();

// SSR optimized fetching
const { data: fetchedData, pending } = await useFetch(
  `${config.public.apiBaseUrl}/public/events-calendar`,
  { lazy: true, server: true },
);

// Centralized computed property mapped to inferred backend sections
const pageData = computed(() => {
  // Safe unwrap in case the API nests the response inside a 'data' key
  const apiData = fetchedData.value?.data || fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const eventsSec = apiData.eventsSection || {};

  return {
    hero: {
      image: hero.heroImage || defaultHeroImage,
      kicker: hero.heroKicker || "What's happening",
      headline: hero.heroHeadline || "Events Calendar",
    },
    // Using a default array if the backend is empty, so you still see your design
    events: eventsSec.events || [
      {
        month: "SEP",
        day: "15",
        title: "Midweek Communion Service",
        description:
          "Join us for a powerful evening of the Word, prayer, and breaking of bread together as a family.",
        time: "6:00 PM",
        location: "Main Auditorium",
      },
      {
        month: "SEP",
        day: "22",
        title: "Campus Worship Night",
        description:
          "An intense night of worship, prophecies, and spiritual songs flowing freely in the Spirit.",
        time: "5:00 PM",
        location: "Campus Chapel",
      },
    ],
  };
});
</script>
