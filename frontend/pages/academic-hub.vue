<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      priority
      :kicker="pageData.hero.kicker"
      :title="pageData.hero.headline"
      :image="pageData.hero.image"
      :fallback="heroImages.about"
    />

    <section class="py-16 md:py-24">
      <AppContainer>
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div class="lg:col-span-5">
            <p class="text-sm font-medium text-brand-600">
              {{ pageData.intro.kicker }}
            </p>
            <h2
              class="mt-4 max-w-md font-impact text-4xl uppercase leading-[0.95] md:text-5xl"
            >
              {{ pageData.intro.headline }}
            </h2>
          </div>

          <div class="lg:col-span-7">
            <p class="text-lg font-light leading-relaxed text-gray-600">
              {{ pageData.intro.description }}
            </p>
            <p class="mt-5 text-base font-light leading-7 text-gray-600">
              University life is more than lectures and deadlines. The Academic
              Hub helps you grow in knowledge, discipline, and confidence while
              keeping Christ at the centre of your campus life.
            </p>
          </div>
        </div>

        <div class="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          <article
            v-for="(item, index) in supportAreas"
            :key="item.title"
            class="relative overflow-hidden rounded-2xl border border-line bg-surface p-7 md:p-9"
          >
            <span
              class="absolute right-7 top-7 font-mono text-xs font-semibold text-muted md:right-9 md:top-9"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <Icon
              :name="item.icon"
              class="h-7 w-7 text-brand-600"
              aria-hidden="true"
            />
            <h3 class="mt-8 text-xl font-semibold">{{ item.title }}</h3>
            <p class="mt-3 text-base font-light leading-7 text-gray-600">
              {{ item.description }}
            </p>
          </article>
        </div>
      </AppContainer>
    </section>

    <section class="relative overflow-hidden bg-ink py-16 text-paper md:py-24">
      <div
        class="absolute inset-0 bg-linear-to-br from-brand-600/20 via-transparent to-transparent"
        aria-hidden="true"
      />
      <AppContainer class="relative">
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div class="lg:col-span-7">
            <p class="text-sm font-medium text-white/70">Take the next step</p>
            <h2
              class="mt-4 max-w-2xl font-impact text-4xl uppercase leading-none md:text-5xl"
            >
              Your studies matter to God.
            </h2>
            <p
              class="mt-6 max-w-xl text-base font-light leading-relaxed text-white/80 md:text-lg"
            >
              Let's help you finish this season with clarity, support, and
              purpose. Connect with the chapel team or find a ministry where you
              can grow and serve.
            </p>
          </div>

          <div class="flex flex-col gap-3 lg:col-span-5 lg:items-end">
            <AppButton variant="inverse" to="/contact" class="w-full sm:w-auto">
              Connect with us
            </AppButton>
            <AppButton
              variant="ghost-inverse"
              to="/ministries"
              class="w-full sm:w-auto"
            >
              Explore ministries
            </AppButton>
          </div>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useFetch, useHead, useSeoMeta } from "#app";
import { heroImages } from "~/utils/staticImages";

const defaultAcademicDescription =
  "Study hubs, mentorship, and a community that pushes you to lead.";

const supportAreas = [
  {
    icon: "heroicons:book-open",
    title: "Study hubs",
    description:
      "Join focused study sessions where you can learn, revise, and stay accountable with other students.",
  },
  {
    icon: "heroicons:user-group",
    title: "Mentorship",
    description:
      "Connect with senior students and alumni who can offer practical guidance for your academic journey.",
  },
  {
    icon: "heroicons:academic-cap",
    title: "Leadership development",
    description:
      "Build the character and competence to serve well in class, in church, and beyond campus.",
  },
  {
    icon: "heroicons:heart",
    title: "Pastoral support",
    description:
      "When the pressure builds, our team is here to listen, pray with you, and point you to the right help.",
  },
];

useHead({
  title: "Academic Hub | Chapel of Praise",
});

useSeoMeta({
  description:
    "Find study support, mentorship, leadership development, and pastoral care through the Chapel of Praise Academic Hub.",
  ogTitle: "Academic Hub | Chapel of Praise",
  ogDescription:
    "Study with purpose and lead with character through the Chapel of Praise Academic Hub.",
});

const config = useRuntimeConfig();

const { data: fetchedData } = await useFetch(
  `${config.public.apiBaseUrl}/public/academic-hub`,
  { lazy: import.meta.client },
);

const textOr = (value, fallback) => {
  const text = typeof value === "string" ? value.trim() : "";
  return text || fallback;
};

const pageData = computed(() => {
  const apiData = fetchedData.value || {};
  const customImage = textOr(apiData.beyondSundayImage, "");

  return {
    hero: {
      kicker: textOr(apiData.beyondSundayKicker, "Beyond Sunday"),
      headline: "Academic Hub",
      image: customImage || heroImages.about.src,
    },
    intro: {
      kicker: textOr(apiData.beyondSundayAcademicTitle, "Academic excellence"),
      headline: "Study with purpose. Lead with character.",
      description: textOr(
        apiData.beyondSundayAcademicDescription,
        defaultAcademicDescription,
      ),
    },
  };
});
</script>
