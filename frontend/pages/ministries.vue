<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      priority
      :kicker="pageData.hero.kicker"
      :title="pageData.hero.headline"
      :image="pageData.hero.image"
      :fallback="heroImages.chapel"
    />

    <section class="bg-surface py-16 md:py-24">
      <AppContainer>
        <div class="space-y-8">
          <template v-if="pending">
            <AppLoadingCard
              v-for="item in 3"
              :key="'ministry-loading-' + item"
            />
          </template>

          <template v-else>
            <article
              v-for="(ministry, index) in pageData.ministries"
              :key="'ministry-' + index"
              class="grid grid-cols-1 gap-6 rounded-2xl border border-line bg-paper p-6 md:grid-cols-3 md:p-10"
            >
              <div>
                <h2 class="text-xl font-semibold">{{ ministry.name }}</h2>
                <p class="mt-2 text-sm font-medium text-brand-600">
                  {{ ministry.subtitle }}
                </p>
              </div>
              <p
                class="whitespace-pre-line text-base font-light leading-7 text-gray-600 md:col-span-2"
              >
                {{ ministry.description }}
              </p>
            </article>

            <div
              v-if="pageData.ministries.length === 0"
              class="rounded-2xl border border-line bg-paper p-10 text-center"
            >
              <h2 class="text-xl font-semibold">No ministries listed</h2>
              <p class="mt-3 text-base font-light text-gray-600">
                Please check back soon.
              </p>
            </div>
          </template>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useFetch, useHead, useSeoMeta } from "#app";
import { heroImages } from "~/utils/staticImages";

const defaultHeroImage = heroImages.chapel.src;

useHead({
  title: "Ministries | Chapel of Praise",
});

useSeoMeta({
  description:
    "Discover the ministries of Chapel of Praise and find where you can serve and grow.",
  ogTitle: "Ministries | Chapel of Praise",
  ogDescription:
    "Discover the ministries of Chapel of Praise and find where you can serve and grow.",
});

const config = useRuntimeConfig();

const { data: fetchedData, pending } = await useFetch(
  `${config.public.apiBaseUrl}/public/ministries`,
  { lazy: import.meta.client },
);

const pageData = computed(() => {
  const apiData = fetchedData.value?.data || fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const ministriesSec = apiData.ministriesSection || {};

  const ministries = (ministriesSec.ministries || []).filter((ministry) => {
    return Object.values(ministry).every(
      (value) => typeof value !== "string" || value.trim() !== "",
    );
  });

  return {
    hero: {
      image: hero.heroImageUrl || defaultHeroImage,
      kicker: hero.heroKicker || "Get involved",
      headline: hero.heroHeadline || "Ministries",
    },
    ministries,
  };
});
</script>
