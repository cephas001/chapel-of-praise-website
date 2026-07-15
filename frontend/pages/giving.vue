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
        alt="Giving Hero"
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
    <main class="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
      <h2 class="text-3xl md:text-4xl font-impact uppercase mb-6 text-black">
        {{ pageData.headline.title }}
      </h2>
      <p
        class="text-md md:text-lg text-gray-600 font-light leading-relaxed mb-12"
      >
        {{ pageData.headline.description }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <!-- Bank Transfer Card -->
        <div class="bg-gray-50 border border-gray-200 rounded-2xl p-8">
          <Icon
            name="heroicons:building-library"
            class="w-10 h-10 text-[#e94e4e] mb-4"
          />
          <h3 class="text-2xl font-impact uppercase text-black mb-4">
            Bank Transfer
          </h3>
          <div class="space-y-4 text-gray-700 font-light">
            <div>
              <p
                class="text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Bank Name
              </p>
              <p class="text-lg font-medium text-black">
                {{ pageData.bank.name }}
              </p>
            </div>
            <div>
              <p
                class="text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Account Name
              </p>
              <p class="text-lg font-medium text-black">
                {{ pageData.bank.accountName }}
              </p>
            </div>
            <div>
              <p
                class="text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                Account Number
              </p>
              <p class="text-2xl font-medium tracking-widest text-[#e25858]">
                {{ pageData.bank.accountNumber }}
              </p>
            </div>
          </div>
        </div>

        <!-- Online Payment Card -->
        <div
          class="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 flex flex-col justify-between"
        >
          <div>
            <Icon
              name="heroicons:credit-card"
              class="w-10 h-10 text-[#e94e4e] mb-4"
            />
            <h3 class="text-2xl font-impact uppercase text-black mb-4">
              Give Online
            </h3>
            <p class="text-gray-600 font-light mb-8">
              {{ pageData.online.description }}
            </p>
          </div>
          <a
            v-if="pageData.online.buttonUrl"
            :href="pageData.online.buttonUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="block w-full bg-black hover:bg-[#e94e4e] text-white font-bold py-4 rounded-xl transition-colors uppercase tracking-wider text-sm text-center"
          >
            Give Now
          </a>
          <button
            v-else
            class="w-full bg-black hover:bg-[#e94e4e] text-white font-bold py-4 rounded-xl transition-colors uppercase tracking-wider text-sm"
          >
            Give Now
          </button>
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
  title: "Giving | Chapel of Praise",
});

const config = useRuntimeConfig();

// SSR optimized fetching
const { data: fetchedData, pending } = await useFetch(
  `${config.public.apiBaseUrl}/public/giving`,
  { lazy: true, server: true },
);

// Centralized computed property mapped to backend sections
const pageData = computed(() => {
  const apiData = fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const headline = apiData.headlineSection || {};
  const bank = apiData.bankDetailsSection || {};
  const online = apiData.onlinePaymentSection || {};

  return {
    hero: {
      image: hero.heroImage || defaultHeroImage,
      kicker: hero.heroKicker || "Partner with us",
      headline: hero.heroHeadline || "Giving",
    },
    headline: {
      title: headline.sectionHeadline || "Worship Through Giving",
      description:
        headline.sectionDescription ||
        "Your generosity helps us continue our mission to shine the gospel light globally and raise the next generation of champions. Thank you for partnering with Chapel of Praise.",
    },
    bank: {
      name: bank.bankName || "Guaranty Trust Bank (GTB)",
      accountName: bank.accountName || "Chapel of Praise",
      accountNumber: bank.accountNumber || "0123456789",
    },
    online: {
      description:
        online.onlinePaymentDescription ||
        "Make a secure online donation via our payment gateway using your debit or credit card.",
      buttonUrl: online.onlinePaymentButtonUrl || "",
    },
  };
});
</script>
