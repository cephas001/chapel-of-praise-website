<template>
  <LoadingScreen :isLoading="pending" />
  <div class="bg-white text-black w-full font-sans">
    <!-- HERO SECTION -->
    <section
      class="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black text-white"
    >
      <div class="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
      <img
        src="~/assets/images/chapel.webp"
        alt="Hero Background"
        class="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div
        class="relative z-20 text-center px-4 max-w-6xl mx-auto flex flex-col items-center justify-center mt-20"
      >
        <p
          class="text-xs md:text-sm font-bold uppercase tracking-widest mb-5 text-white/90"
        >
          {{ pageData.hero.kicker }}
        </p>

        <h1
          class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-impact uppercase leading-none md:leading-[1.1] mb-6 text-white max-w-3xl mx-auto"
        >
          <template
            v-for="(word, index) in pageData.hero.headlineWords"
            :key="index"
          >
            <span :class="{ 'text-[#e94e4e]': index === 1 }">{{ word }}</span>
            <template v-if="index < pageData.hero.headlineWords.length - 1">{{
              " "
            }}</template>
          </template>
        </h1>

        <div class="flex gap-4 mt-4">
          <NuxtLink
            :to="pageData.hero.cta1Link"
            class="bg-white hover:bg-gray-200 text-black font-bold py-3 px-7 rounded-full transition-colors uppercase tracking-wider text-xs md:text-sm"
          >
            {{ pageData.hero.cta1Label }}
          </NuxtLink>
          <NuxtLink
            :to="pageData.hero.cta2Link"
            class="border-2 border-white/80 hover:bg-white hover:text-black text-white font-bold py-3 px-7 rounded-full transition-colors uppercase tracking-wider text-xs md:text-sm relative z-20"
          >
            {{ pageData.hero.cta2Label }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- WELCOME SECTION -->
    <div class="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-16">
      <section
        class="mb-10 md:mb-14 animate-fade-in-up text-center md:text-left flex flex-col items-center md:items-start"
      >
        <div
          class="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black/60 mb-6"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#e94e4e]"></span>
          {{ pageData.welcome.badge }}
        </div>
        <!-- Changed to H2 for better SEO -->
        <h2
          class="text-4xl sm:text-5xl md:text-6xl font-impact uppercase text-black max-w-4xl leading-none"
        >
          {{ pageData.welcome.headline }}
        </h2>
        <p
          class="mt-4 text-md md:text-lg text-gray-500 max-w-2xl font-medium leading-relaxed"
        >
          {{ pageData.welcome.description }}
        </p>
      </section>

      <!-- CARDS SECTION -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="(card, index) in cardsToDisplay"
          :key="card.title"
          :to="card.to || card.ctaLink"
          class="group relative min-h-[22rem] md:min-h-[28rem] overflow-hidden card-reveal rounded-lg"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <div
            class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
            :style="cardBackground(card.image)"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"
          ></div>

          <div
            class="relative h-full flex flex-col justify-between p-6 text-white"
          >
            <div
              class="mb-2 transition-transform duration-500 transform group-hover:-translate-y-2"
            >
              <p
                class="text-[10px] uppercase tracking-widest font-semibold text-white/90"
              >
                {{ card.kicker }}
              </p>
              <h3
                class="mt-2 text-3xl md:text-4xl font-black leading-none tracking-tight"
              >
                {{ card.title }}
              </h3>
            </div>
            <span
              class="inline-flex items-center gap-2 uppercase tracking-wider text-xs font-bold text-white/95"
            >
              {{ card.cta || card.ctaLabel }}
              <Icon name="heroicons:arrow-long-right" class="w-5 h-5" />
            </span>
          </div>
        </NuxtLink>
      </section>
    </div>

    <!-- CHAMPIONS SECTION -->
    <section
      class="relative w-full py-32 flex items-center bg-black overflow-hidden"
    >
      <img
        :src="pageData.champions.image"
        alt="Building a People of Excellence"
        class="absolute inset-0 w-full h-full object-cover z-0 opacity-20 grayscale"
      />
      <div
        class="relative z-20 container mx-auto px-4 md:px-12 flex items-center h-full"
      >
        <div class="max-w-3xl text-left">
          <h2
            class="text-4xl md:text-5xl lg:text-6xl font-impact uppercase mb-6 leading-none text-white"
          >
            {{ pageData.champions.headline }}
          </h2>
          <p
            class="text-base md:text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed font-light"
          >
            {{ pageData.champions.description }}
          </p>
          <NuxtLink
            :to="pageData.champions.ctaLink"
            class="bg-[#e94e4e] hover:bg-white hover:text-black text-white font-bold py-3 px-7 rounded-full transition-colors inline-block uppercase tracking-wider text-xs md:text-sm"
          >
            {{ pageData.champions.ctaLabel }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- EDITORIAL SCATTERED IMAGES SECTION -->
    <div
      class="relative w-full bg-black text-white"
      id="editorial-sticky-container"
    >
      <section
        v-for="(section, sIndex) in sectionsToDisplay"
        :key="sIndex"
        class="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden border-t border-white/10"
        :class="[
          sIndex === 0
            ? 'bg-zinc-950 z-10'
            : sIndex === 1
              ? 'bg-zinc-900 z-20'
              : 'bg-black z-30',
        ]"
      >
        <div class="absolute inset-0 z-0 pointer-events-none opacity-60">
          <img
            v-for="(img, iIndex) in section.images"
            :key="`${sIndex}-${iIndex}`"
            :src="img"
            alt="Scattered Imagery"
            class="editorial-scattered-image absolute w-40 h-56 md:w-64 md:h-80 object-cover rounded-sm shadow-2xl transition-transform duration-1000 ease-out"
            :style="
              scatteredImageStyles[`${sIndex}-${iIndex}`] || { opacity: 0 }
            "
          />
        </div>

        <div
          class="relative z-10 text-center max-w-3xl px-4 pointer-events-none"
        >
          <p
            class="text-xs md:text-sm font-bold uppercase tracking-widest mb-4 text-[#e94e4e]"
          >
            {{ section.kicker }}
          </p>
          <h2
            class="text-5xl sm:text-6xl md:text-7xl font-impact uppercase leading-none mb-6 drop-shadow-xl"
          >
            {{ section.title }}
          </h2>
          <p
            class="text-base md:text-lg lg:text-xl font-light text-white/90 drop-shadow-md"
          >
            {{ section.description }}
          </p>
        </div>
      </section>
    </div>

    <!-- LEADERSHIP SECTION -->
    <section
      class="relative w-full bg-white text-black py-20 md:py-24 flex items-center z-40"
    >
      <div class="container mx-auto px-4 md:px-12 max-w-6xl">
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          <div
            class="relative w-full aspect-[4/5] md:aspect-[3/4] flex justify-center overflow-hidden rounded-xl"
          >
            <img
              src="~/assets/images/pastor.webp"
              alt="Our Lead Pastor"
              class="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
          <div class="text-left flex flex-col justify-center">
            <div class="flex items-center gap-3 mb-6">
              <Icon name="heroicons:globe-alt" class="w-6 h-6 text-[#e94e4e]" />
              <span
                class="text-[10px] font-bold tracking-widest uppercase text-gray-500"
              >
                {{ pageData.leadership.badge }}
              </span>
            </div>
            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-impact uppercase mb-6 leading-none"
            >
              {{ pageData.leadership.headline }}
            </h2>
            <p
              class="text-gray-600 mb-8 leading-relaxed text-base md:text-lg font-light"
            >
              {{ pageData.leadership.bio }}
            </p>
            <div>
              <NuxtLink
                :to="pageData.leadership.ctaLink"
                class="border-2 border-black hover:bg-black hover:text-white text-black font-bold py-3 px-7 rounded-full transition-colors inline-block uppercase tracking-wider text-xs"
              >
                {{ pageData.leadership.ctaLabel }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRuntimeConfig, useFetch } from "#app";

// Existing Image Imports
import aboutImage from "~/assets/images/about.webp";
import connectImage from "~/assets/images/connect.webp";
import celebrationsImage from "~/assets/images/celebrations.webp";

const config = useRuntimeConfig();

// 1. Better Data Fetching Strategy using Nuxt's useFetch (handles SSR out of the box)
const { data: homepageData, pending } = await useFetch(
  `${config.public.apiBaseUrl}/public/homepage`,
  {
    lazy: true, // Prevents route blocking, loading screen handles the UI state
    server: true, // Enables SSR
  },
);

// 2. Computed Page Data - Centralizes all fallback logic to keep template clean
const pageData = computed(() => {
  const data = homepageData.value || {};
  const heroText =
    data.heroSection?.heroHeadline || "McPherson University Chapel";

  return {
    hero: {
      kicker: data.heroSection?.heroKicker || "Shining the Gospel Light",
      headlineWords: heroText.split(" "),
      cta1Label: data.heroSection?.heroCta1Label || "Watch Us",
      cta1Link: data.heroSection?.heroCta1Link || "/",
      cta2Label: data.heroSection?.heroCta2Label || "About Us",
      cta2Link: data.heroSection?.heroCta2Link || "/about",
    },
    welcome: {
      badge: data.welcomeSection?.welcomeBadge || "Welcome to COP",
      headline: data.welcomeSection?.welcomeHeadline || "Welcome Home!",
      description:
        data.welcomeSection?.welcomeDescription ||
        "Dive into our teachings, events and community. Your journey of faith begins here.",
    },
    champions: {
      image:
        data.championsSection?.championsBackgroundImage || celebrationsImage,
      headline: data.championsSection?.championsHeadline || "Great Champions",
      description:
        data.championsSection?.championsDescription ||
        "We are a vibrant family of young believers, passionate about God's Word. We are committed to rising as the next generation of champions, who always shine the gospel light.",
      ctaLabel: data.championsSection?.championsCtaLabel || "Join Us",
      ctaLink: data.championsSection?.championsCtaLink || "/events",
    },
    leadership: {
      badge: data.leadershipSection?.leadershipBadge || "Chapel Leadership",
      headline: data.leadershipSection?.leadershipHeadline || "Our Lead Pastor",
      bio:
        data.leadershipSection?.leadershipBio ||
        "Reverend Ibiwunmi Alo is the lead pastor of Chapel of Praise, a dynamic teaching ministry dedicated to spreading the gospel and helping people discover their purpose in Christ. With a passion for the Word of God and a heart for missions, Apostle Iren has led the church to establish Over 30 campuses across Nigeria, North America, and the UK.",
      ctaLabel: data.leadershipSection?.leadershipCtaLabel || "Read More",
      ctaLink: data.leadershipSection?.leadershipCtaLink || "/about",
    },
  };
});

// Action Cards Logic
const defaultCards = [
  {
    kicker: "Who We Are",
    title: "About us",
    ctaLabel: "Learn More",
    ctaLink: "/",
    image: aboutImage,
  },
  {
    kicker: "Join Our Community",
    title: "Connect with us",
    ctaLabel: "Sign Up",
    ctaLink: "/",
    image: connectImage,
  },
  {
    kicker: "Endless Celebration",
    title: "Celebrations",
    ctaLabel: "Learn More",
    ctaLink: "/",
    image: celebrationsImage,
  },
];

const cardsToDisplay = computed(() => {
  const incomingCards = homepageData.value?.actionCardsSection?.actionCards;
  if (
    incomingCards?.length > 0 &&
    incomingCards.every((card) =>
      Object.values(card).every((field) => field !== ""),
    )
  ) {
    return incomingCards;
  }
  return defaultCards;
});

// Editorial Sections Logic
const defaultEditorialSections = [
  {
    id: 1,
    kicker: "The Experience",
    title: "Vibrant Worship",
    description:
      "Experience the transformative power of God's presence through high-energy praise and deep, intimate worship.",
    images: [
      aboutImage,
      connectImage,
      celebrationsImage,
      aboutImage,
      celebrationsImage,
    ],
  },
  {
    id: 2,
    kicker: "The Foundation",
    title: "Deep Word",
    description:
      "Rooted in scripture. We believe in building a foundation of excellence and integrity through unadulterated teachings.",
    images: [
      celebrationsImage,
      aboutImage,
      connectImage,
      celebrationsImage,
      aboutImage,
    ],
  },
  {
    id: 3,
    kicker: "The People",
    title: "Strong Community",
    description:
      "A vibrant family of young believers. Find your tribe, grow together, and shine the gospel light in your world.",
    images: [
      connectImage,
      celebrationsImage,
      aboutImage,
      connectImage,
      celebrationsImage,
    ],
  },
];

const sectionsToDisplay = computed(() => {
  const incomingSections =
    homepageData.value?.editorialSection?.editorialSlides;
  if (incomingSections?.length > 0) {
    const isValid = incomingSections.every((section) => {
      return Object.values(section).every((field) => {
        if (Array.isArray(field))
          return (
            field.length > 0 &&
            field.every((img) => typeof img === "string" && img.trim() !== "")
          );
        return typeof field === "string" && field.trim() !== "";
      });
    });
    if (isValid) return incomingSections;
  }
  return defaultEditorialSections;
});

// Function for card gradients
const cardBackground = (imagePath) => {
  const atmosphere =
    "linear-gradient(140deg, rgba(15,17,21,0.68), rgba(240,79,35,0.2), rgba(11,14,20,0.72))";
  return { backgroundImage: `${atmosphere}, url('${imagePath}')` };
};

// 3. Replaced DOM manipulation with Reactive State
// To prevent hydration mismatches, we run the randomizer only on the client side via onMounted.
const scatteredImageStyles = ref({});

onMounted(() => {
  const newStyles = {};

  sectionsToDisplay.value.forEach((section, sIndex) => {
    section.images.forEach((img, iIndex) => {
      const randomLeft = Math.floor(Math.random() * 70) + 5;
      const randomTop = Math.floor(Math.random() * 70) + 5;
      const randomRotation = Math.floor(Math.random() * 40) - 20;
      const randomScale = (Math.random() * 0.3 + 0.85).toFixed(2);
      const delay = (Math.random() * 3).toFixed(2);
      const duration = (Math.random() * 3 + 5).toFixed(2);

      newStyles[`${sIndex}-${iIndex}`] = {
        left: `${randomLeft}%`,
        top: `${randomTop}%`,
        "--rot": `${randomRotation}deg`,
        "--scl": randomScale,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity: 1, // reveals after hydration to prevent jump
      };
    });
  });

  scatteredImageStyles.value = newStyles;
});
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(var(--rot)) scale(var(--scl));
  }
  50% {
    transform: translateY(-20px) rotate(var(--rot)) scale(var(--scl));
  }
}

.editorial-scattered-image {
  animation: float ease-in-out infinite;
}
</style>
