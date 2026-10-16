<template>
  <LoadingScreen :isLoading="pending" />
  <div class="bg-white text-black w-full font-sans">
    <!-- Static Hero Banner -->
    <section
      class="relative w-full pt-10 md:pt-0 h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden bg-black text-white"
    >
      <div class="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>
      <!-- Pinkish overlay -->
      <div
        class="absolute inset-0 bg-pink-900/30 mix-blend-multiply z-10 pointer-events-none"
      ></div>

      <!-- Unified Image Tag -->
      <img
        :src="pageContent.hero.image"
        alt="About Us Hero"
        class="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div
        class="relative z-20 text-center px-4 mt-8 flex flex-col items-center"
      >
        <!-- Small Pill Badge -->
        <div
          class="bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 mb-6 flex items-center justify-center gap-2"
        >
          <span class="w-3 h-3 rounded-full bg-blue-500"></span>
          <span
            class="text-xs md:text-sm font-bold uppercase tracking-widest text-white"
          >
            {{ pageContent.hero.kicker }}
          </span>
        </div>

        <!-- Hero Heading (v-html handles both API data and default fallbacks) -->
        <h1
          class="text-5xl sm:text-7xl md:text-[5.5rem] font-impact uppercase leading-[0.9] text-white drop-shadow-lg flex flex-col items-center whitespace-pre-line text-center"
          v-html="pageContent.hero.headline"
        ></h1>
      </div>
    </section>

    <!-- Main Content Container -->
    <main class="w-full bg-white py-20 md:py-32">
      <div class="max-w-[85rem] mx-auto px-4 md:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <!-- Left: Bold Heading -->
          <div class="lg:col-span-4 pl-0">
            <h2
              class="font-impact uppercase leading-[0.9] text-[3.5rem] md:text-[4.5rem]"
            >
              <span class="text-black block mb-1">{{
                pageContent.vision.headlineBlack
              }}</span>
              <span class="text-[#e25858] block">{{
                pageContent.vision.headlineColored
              }}</span>
            </h2>
          </div>

          <!-- Right: Two Column Text -->
          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <!-- Column 1 -->
              <div
                class="text-[#4b5563] leading-relaxed font-light text-[0.95rem] md:text-[1.05rem] vision-content-blocks"
                v-html="pageContent.vision.col1"
              ></div>

              <!-- Column 2 -->
              <div
                class="text-[#4b5563] leading-relaxed font-light text-[0.95rem] md:text-[1.05rem] vision-content-blocks"
                v-html="pageContent.vision.col2"
              ></div>
            </div>
          </div>
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
  title: "About Us | Chapel of Praise",
});

const config = useRuntimeConfig();

// Using lazy: true ensures your <LoadingScreen /> works properly during route transitions
const { data: pageData, pending } = await useFetch(
  `${config.public.apiBaseUrl}/public/about`,
  { lazy: true, server: true },
);

// Centralized computed property for all page content & fallbacks
const pageContent = computed(() => {
  const apiData = pageData.value || {};
  const hero = apiData.heroSection || {};
  const vision = apiData.visionSection || {};

  return {
    hero: {
      image: hero.heroImage || defaultHeroImage,
      kicker: hero.heroKicker || "The family at COP",
      // If no API data, supply the default HTML string
      headline:
        hero.heroHeadline ||
        `<span>In Christ, For</span>\n<span>Christ,</span>\n<span class="text-[#e25858] mt-1">With Joy!</span>`,
    },
    // Inside your computed property:
    vision: {
      headlineBlack: vision.visionHeadlineBlack || "We serve God",
      headlineColored: vision.visionHeadlineColored || "By His Spirit",
      col1:
        vision.visionContentCol1 ||
        `
    <p>Chapel of Praise (COP) is a mission-minded teaching ministry founded with a profound vision. <span class="font-bold text-black">Our vision is to see all people celebrate endless life in Christ Jesus and fully embrace the power of His death, burial, and resurrection.</span></p>
    <p>At COP, we are committed to knowing Christ deeply and making Him known across the world. We nurture spiritual growth through in-depth teaching services, powerful prayer sessions, and outreach programs, empowering believers to live out their faith boldly. Our services are marked by the gifts of the Spirit, where prayer, prophecies, and spiritual songs flow freely in an atmosphere of worship.</p>
  `,
      col2:
        vision.visionContentCol2 ||
        `
    <p>We hold firmly to the Word of God as the ultimate standard for doctrine, and we believe that the greatest demonstration of God's love is found in the redemptive work of Christ. Through His grace, we are blessed and righteous in His sight.</p>
    <p>Under Reverend Ibiwunmi Alo and Apostle Iren's leadership, COP has grown from a campus fellowship into a global ministry with over 15,000 members and more than 30 campuses across Nigeria, Europe, Canada, and the USA. We are the hands and feet of Christ, spreading the gospel to the uttermost parts of the earth—one billion souls in 10,000 cities for Christ.</p>
  `,
    },
  };
});
</script>

<style scoped>
/* Ensures that any <p> tags coming from the API (or fallback) have a natural gap */
.vision-content-blocks :deep(p:not(:last-child)) {
  margin-bottom: 1.15rem; /* Reduced for a more natural reading flow */
}
</style>
