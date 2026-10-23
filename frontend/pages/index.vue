<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      size="full"
      priority
      animated
      :kicker="pageData.hero.kicker"
      :title="pageData.hero.headline"
      :fallback="heroImages.chapel"
    >
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <AppButton
          variant="inverse"
          :href="pageData.hero.cta1Link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ pageData.hero.cta1Label }}
        </AppButton>
        <AppButton variant="ghost-inverse" :to="pageData.hero.cta2Link">
          {{ pageData.hero.cta2Label }}
        </AppButton>
      </div>
    </AppPageHero>

    <section class="py-16 md:py-24">
      <AppContainer>
        <h2
          class="font-impact max-w-4xl text-3xl uppercase leading-none sm:text-4xl md:text-5xl"
        >
          {{ pageData.welcome.headline }}
        </h2>
        <p
          class="mt-5 max-w-2xl text-lg font-light leading-relaxed text-gray-600"
        >
          {{ pageData.welcome.description }}
        </p>

        <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="card in cardsToDisplay"
            :key="card.title"
            :to="card.to || card.ctaLink"
            class="group overflow-hidden rounded-2xl border border-line bg-paper transition-colors hover:border-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-surface">
              <AppImage
                :src="card.image"
                :alt="card.title"
                :sizes="{ xs: '100vw', sm: '100vw', md: '33vw' }"
                width="640"
                height="480"
                fit="cover"
                class="h-full w-full object-cover [@media(hover:hover)]:grayscale transition-[filter] duration-500 group-hover:grayscale-0 motion-reduce:transition-none"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="p-6">
              <p class="text-sm font-medium text-brand-600">
                {{ card.kicker }}
              </p>
              <h3 class="mt-2 text-xl font-semibold">{{ card.title }}</h3>
              <p class="mt-4 text-sm font-semibold text-brand-600">
                {{ card.ctaLabel }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </AppContainer>
    </section>

    <section class="pb-16 md:pb-24" aria-labelledby="whole-life-heading">
      <AppContainer>
        <div
          class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-12"
        >
          <div class="md:col-span-2 lg:col-span-7 lg:pr-10 xl:pr-16">
            <div class="flex items-center gap-3">
              <span
                class="h-0.5 w-10 rounded-full bg-brand-600"
                aria-hidden="true"
              />
              <p class="text-sm font-medium text-brand-600">
                {{ pageData.beyondSunday.kicker }}
              </p>
            </div>

            <h2
              id="whole-life-heading"
              class="mt-5 font-impact text-5xl uppercase leading-[0.95] sm:text-6xl lg:text-7xl"
            >
              <span
                v-for="(line, index) in pageData.beyondSunday.headlineLines"
                :key="`beyond-sunday-line-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h2>

            <p
              class="mt-6 max-w-xl text-base font-light leading-relaxed text-gray-600 md:text-lg"
            >
              {{ pageData.beyondSunday.description }}
            </p>
          </div>

          <NuxtLink
            :to="pageData.beyondSunday.spiritualCtaLink"
            class="group relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-line bg-ink text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 md:col-span-2 lg:col-span-5 lg:row-span-2 lg:min-h-[500px]"
          >
            <AppImage
              :src="pageData.beyondSunday.image.src"
              :avif-srcset="pageData.beyondSunday.image.avifSrcset"
              :webp-srcset="pageData.beyondSunday.image.webpSrcset"
              :width="pageData.beyondSunday.image.width"
              :height="pageData.beyondSunday.image.height"
              sizes="(min-width: 1024px) 42vw, 100vw"
              fit="cover"
              alt=""
              class="absolute inset-0 h-full w-full object-cover object-center transition-[filter] duration-500 motion-reduce:transition-none"
              loading="lazy"
              decoding="async"
            />
            <div
              class="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/90"
              aria-hidden="true"
            />

            <div class="relative mt-auto p-7 md:p-9">
              <span
                class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white"
              >
                <Icon
                  name="heroicons:book-open"
                  class="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
              <h3
                class="mt-5 font-impact text-3xl uppercase leading-none md:text-4xl"
              >
                {{ pageData.beyondSunday.spiritualTitle }}
              </h3>
              <p
                class="mt-3 max-w-xs text-sm font-light leading-6 text-white/80 md:text-base"
              >
                {{ pageData.beyondSunday.spiritualDescription }}
              </p>
              <span
                class="mt-6 inline-flex border-b border-white/40 pb-1 text-sm font-semibold text-white transition-colors group-hover:border-white group-focus-visible:border-white"
              >
                {{ pageData.beyondSunday.spiritualCtaLabel }}
              </span>
            </div>
          </NuxtLink>

          <article
            class="flex flex-col rounded-2xl border border-line bg-paper p-6 md:p-8 lg:col-span-4"
          >
            <Icon
              name="heroicons:academic-cap"
              class="h-7 w-7 text-brand-600"
              aria-hidden="true"
            />
            <h3
              class="mt-6 font-impact text-2xl uppercase leading-none md:text-3xl"
            >
              {{ pageData.beyondSunday.academicTitle }}
            </h3>
            <p class="mt-4 text-sm font-light leading-6 text-gray-600">
              {{ pageData.beyondSunday.academicDescription }}
            </p>
            <AppButton
              variant="link"
              :to="pageData.beyondSunday.academicCtaLink"
              class="mt-auto self-start pt-6"
            >
              {{ pageData.beyondSunday.academicCtaLabel }}
            </AppButton>
          </article>

          <article
            class="flex flex-col rounded-2xl border border-line bg-paper p-6 md:p-8 lg:col-span-3"
          >
            <Icon
              name="heroicons:heart"
              class="h-7 w-7 text-brand-600"
              aria-hidden="true"
            />
            <h3
              class="mt-6 font-impact text-2xl uppercase leading-none md:text-3xl"
            >
              {{ pageData.beyondSunday.emotionalTitle }}
            </h3>
            <p class="mt-4 text-sm font-light leading-6 text-gray-600">
              {{ pageData.beyondSunday.emotionalDescription }}
            </p>
            <AppButton
              variant="link"
              :to="pageData.beyondSunday.emotionalCtaLink"
              class="mt-auto self-start pt-6"
            >
              {{ pageData.beyondSunday.emotionalCtaLabel }}
            </AppButton>
          </article>
        </div>
      </AppContainer>
    </section>

    <section class="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <AppImage
        :src="pageData.champions.image"
        :sizes="fullBleedSizes"
        alt=""
        class="absolute inset-0 h-full w-full object-cover opacity-50 grayscale-[0.5]"
        loading="lazy"
        decoding="async"
      />
      <div
        class="absolute inset-0 bg-linear-to-b from-black/80 via-black/55 to-black/75 lg:bg-linear-to-r lg:from-black/85 lg:via-black/45 lg:to-black/20"
        aria-hidden="true"
      />
      <AppContainer class="relative z-10">
        <h2
          class="max-w-3xl font-impact text-4xl uppercase leading-none md:text-5xl lg:text-6xl"
        >
          {{ pageData.champions.headline }}
        </h2>
        <p
          class="mt-6 max-w-2xl text-base font-light leading-relaxed text-white/80 md:text-lg"
        >
          {{ pageData.champions.description }}
        </p>
        <AppButton
          variant="inverse"
          class="mt-8"
          :to="pageData.champions.ctaLink"
        >
          {{ pageData.champions.ctaLabel }}
        </AppButton>
      </AppContainer>
    </section>

    <div class="relative w-full bg-ink text-paper">
      <section
        v-for="(section, sIndex) in sectionsToDisplay"
        :key="section.id || sIndex"
        class="sticky top-0 flex h-screen w-full items-center overflow-hidden border-t border-white/10 bg-ink"
        :style="{ zIndex: sIndex + 10 }"
      >
        <AppImage
          v-if="section.images?.[0]"
          :src="section.images[0]"
          :sizes="fullBleedSizes"
          alt=""
          class="absolute inset-0 h-full w-full object-cover opacity-50 grayscale-[0.5]"
          loading="lazy"
          decoding="async"
        />
        <div
          class="absolute inset-0 bg-linear-to-b from-black/80 via-black/55 to-black/75 lg:bg-linear-to-r lg:from-black/85 lg:via-black/50 lg:to-black/20"
          aria-hidden="true"
        />
        <AppContainer class="relative z-10">
          <span
            class="mb-5 block h-0.5 w-10 rounded-full bg-brand-600"
            aria-hidden="true"
          />
          <p class="mb-3 text-sm font-medium text-white">
            {{ section.kicker }}
          </p>
          <h2
            class="max-w-3xl font-impact text-5xl uppercase leading-none sm:text-6xl md:text-7xl"
          >
            {{ section.title }}
          </h2>
          <p
            class="mt-6 max-w-2xl text-base font-light leading-relaxed text-white/80 md:text-lg"
          >
            {{ section.description }}
          </p>
        </AppContainer>
      </section>
    </div>

    <section class="py-16 md:py-24">
      <AppContainer>
        <div
          class="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20"
        >
          <div class="overflow-hidden rounded-2xl">
            <AppImage
              :src="pageData.leadership.image"
              sizes="xs:100vw md:50vw"
              width="640"
              height="800"
              fit="cover"
              alt="Reverend Ibiwunmi Alo, lead pastor of Chapel of Praise"
              class="aspect-[4/5] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <h2
              class="font-impact text-3xl uppercase leading-none md:text-4xl lg:text-5xl"
            >
              {{ pageData.leadership.headline }}
            </h2>
            <p
              class="mt-6 text-base font-light leading-relaxed text-gray-600 md:text-lg"
            >
              {{ pageData.leadership.bio }}
            </p>
            <AppButton
              variant="ghost"
              class="mt-8"
              :to="pageData.leadership.ctaLink"
            >
              {{ pageData.leadership.ctaLabel }}
            </AppButton>
          </div>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useFetch, useSeoMeta } from "#app";

import { heroImages } from "~/utils/staticImages";

const fullBleedSizes = {
  xs: "100vw",
  sm: "100vw",
  md: "100vw",
  lg: "100vw",
  xl: "100vw",
  xxl: "100vw",
};

useSeoMeta({
  title: "Chapel of Praise | McPherson University Chapel",
  description:
    "Chapel of Praise is a vibrant campus church at McPherson University, raising a generation of champions who shine the gospel light.",
  ogTitle: "Chapel of Praise | McPherson University Chapel",
  ogDescription:
    "A vibrant campus church at McPherson University, raising a generation of champions who shine the gospel light.",
});

const config = useRuntimeConfig();

const { data: homepageData } = await useFetch(
  `${config.public.apiBaseUrl}/public/homepage`,
  { lazy: import.meta.client },
);

const defaultBeyondSunday = {
  kicker: "Beyond Sunday",
  headline: "Your whole\nlife matters",
  description:
    "University life is intense. We're here for your spiritual growth, academic excellence, and emotional wellness, not just Sunday.",
  spiritualTitle: "Spiritual growth",
  spiritualDescription: "Deepen your faith and discover your purpose.",
  spiritualCtaLabel: "Explore ministries",
  spiritualCtaLink: "/ministries",
  academicTitle: "Academic excellence",
  academicDescription:
    "Study hubs, mentorship, and a community that pushes you to lead.",
  academicCtaLabel: "View Academic Hub",
  academicCtaLink: "/academic-hub",
  emotionalTitle: "Emotional wellness",
  emotionalDescription:
    "Safe spaces, welfare support, and professional counselling.",
  emotionalCtaLabel: "Request counselling",
  emotionalCtaLink: "/counselling",
};

const textOr = (value, fallback) => {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
};

const buildBeyondSunday = (section = {}) => {
  const customImage = textOr(section.beyondSundayImage, "");
  const headline = textOr(
    section.beyondSundayHeadline,
    defaultBeyondSunday.headline,
  );
  const headlineLines = headline
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    kicker: textOr(section.beyondSundayKicker, defaultBeyondSunday.kicker),
    headlineLines:
      headlineLines.length > 0 ? headlineLines : ["Your whole life matters"],
    description: textOr(
      section.beyondSundayDescription,
      defaultBeyondSunday.description,
    ),
    image: customImage
      ? { src: customImage, width: 1920, height: 1280 }
      : heroImages.chapel,
    spiritualTitle: textOr(
      section.beyondSundaySpiritualTitle,
      defaultBeyondSunday.spiritualTitle,
    ),
    spiritualDescription: textOr(
      section.beyondSundaySpiritualDescription,
      defaultBeyondSunday.spiritualDescription,
    ),
    spiritualCtaLabel: textOr(
      section.beyondSundaySpiritualCtaLabel,
      defaultBeyondSunday.spiritualCtaLabel,
    ),
    spiritualCtaLink: textOr(
      section.beyondSundaySpiritualCtaLink,
      defaultBeyondSunday.spiritualCtaLink,
    ),
    academicTitle: textOr(
      section.beyondSundayAcademicTitle,
      defaultBeyondSunday.academicTitle,
    ),
    academicDescription: textOr(
      section.beyondSundayAcademicDescription,
      defaultBeyondSunday.academicDescription,
    ),
    academicCtaLabel: textOr(
      section.beyondSundayAcademicCtaLabel,
      defaultBeyondSunday.academicCtaLabel,
    ),
    academicCtaLink: textOr(
      section.beyondSundayAcademicCtaLink,
      defaultBeyondSunday.academicCtaLink,
    ),
    emotionalTitle: textOr(
      section.beyondSundayEmotionalTitle,
      defaultBeyondSunday.emotionalTitle,
    ),
    emotionalDescription: textOr(
      section.beyondSundayEmotionalDescription,
      defaultBeyondSunday.emotionalDescription,
    ),
    emotionalCtaLabel: textOr(
      section.beyondSundayEmotionalCtaLabel,
      defaultBeyondSunday.emotionalCtaLabel,
    ),
    emotionalCtaLink: textOr(
      section.beyondSundayEmotionalCtaLink,
      defaultBeyondSunday.emotionalCtaLink,
    ),
  };
};

const pageData = computed(() => {
  const data = homepageData.value || {};

  return {
    beyondSunday: buildBeyondSunday(data.beyondSundaySection || {}),
    hero: {
      kicker: data.heroSection?.heroKicker || "Shining the Gospel Light",
      headline: data.heroSection?.heroHeadline || "McPherson University Chapel",
      cta1Label: data.heroSection?.heroCta1Label || "Watch us",
      cta1Link:
        data.heroSection?.heroCta1Link || "https://www.youtube.com/@mcucop",
      cta2Label: data.heroSection?.heroCta2Label || "About us",
      cta2Link: data.heroSection?.heroCta2Link || "/about",
    },
    welcome: {
      headline: data.welcomeSection?.welcomeHeadline || "Welcome Home!",
      description:
        data.welcomeSection?.welcomeDescription ||
        "Dive into our teachings, events and community. Your journey of faith begins here.",
    },
    champions: {
      image:
        data.championsSection?.championImage || heroImages.celebrations.src,
      headline: data.championsSection?.championHeadline || "Great Champions",
      description:
        data.championsSection?.championDescription ||
        "We are a vibrant family of young believers, passionate about God's Word. We are committed to rising as the next generation of champions, who always shine the gospel light.",
      ctaLabel: data.championsSection?.championCtaLabel || "Join us",
      ctaLink: data.championsSection?.championCtaLink || "/events-calendar",
    },
    leadership: {
      image: data.leadershipSection?.leadershipImage || heroImages.pastor.src,
      headline: data.leadershipSection?.leadershipHeadline || "Our Chaplain",
      bio:
        data.leadershipSection?.leadershipBio ||
        "Reverend Mrs Ibiwunmi Alo is the chaplain of Chapel of Praise, a dynamic teaching ministry dedicated to preaching the gospel of the kingdom, and helping young people discover their purpose in Christ.",
      ctaLabel: data.leadershipSection?.leadershipCtaLabel || "Read more",
      ctaLink: data.leadershipSection?.leadershipCtaLink || "/about",
    },
  };
});

const defaultCards = [
  {
    kicker: "Who we are",
    title: "About us",
    ctaLabel: "Learn more",
    ctaLink: "/about",
    image: heroImages.about.src,
  },
  {
    kicker: "Join our community",
    title: "Connect with us",
    ctaLabel: "Get in touch",
    ctaLink: "/contact",
    image: heroImages.connect.src,
  },
  {
    kicker: "Endless praise",
    title: "Celebrations",
    ctaLabel: "See events",
    ctaLink: "/events-calendar",
    image: heroImages.celebrations.src,
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

const defaultEditorialSections = [
  {
    id: 1,
    kicker: "The experience",
    title: "Vibrant Worship",
    description:
      "Experience the transformative power of God's presence through high-energy praise and deep, intimate worship.",
    images: [heroImages.about.src],
  },
  {
    id: 2,
    kicker: "The foundation",
    title: "Deep Word",
    description:
      "Rooted in scripture. We believe in building a foundation of excellence and integrity through unadulterated teachings.",
    images: [heroImages.celebrations.src],
  },
  {
    id: 3,
    kicker: "The people",
    title: "Strong Community",
    description:
      "A vibrant family of young believers. Find your tribe, grow together, and shine the gospel light in your world.",
    images: [heroImages.connect.src],
  },
];

const sectionsToDisplay = computed(() => {
  const incomingSections =
    homepageData.value?.editorialSection?.editorialSlides;
  if (incomingSections?.length > 0) {
    const isValid = incomingSections.every(
      ({ images, kicker, title, description }) =>
        [kicker, title, description].every(
          (field) => typeof field === "string" && field.trim() !== "",
        ) &&
        Array.isArray(images) &&
        typeof images[0] === "string" &&
        images[0].trim() !== "",
    );
    if (isValid) return incomingSections;
  }
  return defaultEditorialSections;
});
</script>
