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
        alt="Ministries Hero"
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
    <main class="w-full bg-[#f3f4f7] py-20 md:py-32">
      <div class="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <!-- Ministry Rows - Dynamic -->
        <div
          v-for="(ministry, index) in pageData.ministries"
          :key="'ministry-' + index"
          class="bg-white p-8 md:p-12 border border-gray-100 rounded-2xl flex flex-col md:flex-row gap-8 items-center text-center md:text-left"
        >
          <div class="w-full md:w-1/3">
            <h3 class="text-3xl font-impact uppercase text-black mb-2">
              {{ ministry.name }}
            </h3>
            <p
              class="text-[#e25858] text-sm uppercase font-bold tracking-widest"
            >
              {{ ministry.subtitle }}
            </p>
          </div>
          <div class="w-full md:w-2/3">
            <p
              class="text-gray-600 font-light leading-relaxed whitespace-pre-line"
            >
              {{ ministry.description }}
            </p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="pageData.ministries.length === 0" class="text-center py-12">
          <p class="text-gray-500 font-light text-base md:text-lg px-5">
            No ministries listed at this time. Check back soon!
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useFetch, useHead } from "#app";
import defaultHeroImage from "~/assets/images/chapel.png";

useHead({
  title: "Ministries | Chapel of Praise",
});

const config = useRuntimeConfig();

// SSR optimized fetching
const { data: fetchedData, pending } = await useFetch(
  `${config.public.apiBaseUrl}/public/ministries`,
  { lazy: true, server: true },
);

// Centralized computed property mapped to backend sections
const pageData = computed(() => {
  const apiData = fetchedData.value?.data || fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const ministriesSec = apiData.ministriesSection || {};

  // Filter ministries: exclude any object where one of its fields is an empty string
  const ministries = (ministriesSec.ministries || []).filter((m) => {
    return Object.values(m).every(
      (val) => typeof val !== "string" || val.trim() !== "",
    );
  });

  return {
    hero: {
      image: hero.heroImageUrl || defaultHeroImage,
      kicker: hero.heroKicker || "Get Involved",
      headline: hero.heroHeadline || "Ministries",
    },
    ministries,
  };
});
</script>
