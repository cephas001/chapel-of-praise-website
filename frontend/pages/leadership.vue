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
        alt="Leadership Hero"
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

    <!-- Main Content Container -->
    <main class="w-full bg-[#f3f4f7] py-20 md:py-32">
      <div class="max-w-7xl mx-auto px-4 md:px-8">
        <div class="text-center mb-16">
          <h2
            class="text-4xl md:text-5xl font-impact uppercase tracking-tight text-gray-900 mb-4"
          >
            {{ pageData.team.headline }}
          </h2>
          <p
            class="text-md md:text-lg text-gray-600 max-w-2xl mx-auto font-light"
          >
            {{ pageData.team.description }}
          </p>
        </div>

        <div class="space-y-20">
          <!-- Chaplaincy Section -->
          <section>
            <div class="mb-10 text-center md:text-left">
              <h3 class="text-3xl md:text-4xl font-impact uppercase text-black">
                Chaplaincy
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div
                v-for="(chaplain, index) in pageData.chaplaincy"
                :key="'chaplain-' + index"
                class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center"
              >
                <img
                  :src="chaplain.imageUrl || defaultPastorImage"
                  :alt="chaplain.name || 'Chaplain'"
                  class="w-40 h-40 rounded-full object-cover mb-6 shadow-md"
                />
                <h3 class="text-2xl font-impact uppercase text-black mb-1">
                  {{ chaplain.name }}
                </h3>
                <p
                  class="text-[#e25858] font-medium text-sm uppercase tracking-wider mb-4"
                >
                  {{ chaplain.title }}
                </p>
                <p class="text-gray-600 font-light text-sm leading-relaxed">
                  {{ chaplain.bio }}
                </p>
              </div>

              <div
                v-if="pageData.chaplaincy.length === 0"
                class="col-span-full text-center py-8"
              >
                <p class="text-gray-500 font-light px-5">
                  No chaplains listed at this time.
                </p>
              </div>
            </div>
          </section>

          <!-- Student Executives Section -->
          <section>
            <div class="mb-10 text-center md:text-left">
              <h3 class="text-3xl md:text-4xl font-impact uppercase text-black">
                Student Executives
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div
                v-for="(exec, index) in pageData.executives"
                :key="'exec-' + index"
                class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center"
              >
                <img
                  :src="exec.imageUrl || defaultConnectImage"
                  :alt="exec.name || 'Executive'"
                  class="w-40 h-40 rounded-full object-cover mb-6 shadow-md"
                />
                <h3 class="text-2xl font-impact uppercase text-black mb-1">
                  {{ exec.name }}
                </h3>
                <p
                  class="text-[#e25858] font-medium text-sm uppercase tracking-wider mb-4"
                >
                  {{ exec.title }}
                </p>
                <p class="text-gray-600 font-light text-sm leading-relaxed">
                  {{ exec.bio }}
                </p>
              </div>

              <div
                v-if="pageData.executives.length === 0"
                class="col-span-full text-center py-8"
              >
                <p class="text-gray-500 font-light px-5">
                  No student executives listed at this time.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useFetch, useHead } from "#app";
import defaultPastorImage from "~/assets/images/pastor.webp";
import defaultConnectImage from "~/assets/images/connect.webp";

useHead({
  title: "Leadership | Chapel of Praise",
});

const config = useRuntimeConfig();

// SSR optimized fetching
const { data: fetchedData, pending } = await useFetch(
  `${config.public.apiBaseUrl}/public/leadership`,
  { lazy: true, server: true },
);

// Centralized computed property mapped to backend sections
const pageData = computed(() => {
  // Ensure we safely unwrap the data, handling cases where it might be nested in a 'data' object
  const apiData = fetchedData.value?.data || fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const team = apiData.teamSection || {};
  const chaplaincy = apiData.chaplaincySection || {};
  const execs = apiData.studentExecutivesSection || {};

  return {
    hero: {
      image: hero.heroImageUrl || defaultPastorImage,
      kicker: hero.heroKicker || "Our Pastors & Leaders",
      headline: hero.heroHeadline || "Leadership",
    },
    team: {
      headline: team.teamHeadline || "Meet The Team",
      description:
        team.teamDescription ||
        "Dedicated men and women committed to shepherding the flock and advancing the kingdom of God.",
    },
    chaplaincy: chaplaincy.chaplaincyList || [],
    executives: execs.studentExecutivesList || [],
  };
});
</script>
