<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      priority
      :kicker="pageData.hero.kicker"
      :title="pageData.hero.headline"
      :image="pageData.hero.image"
      :fallback="heroImages.celebrations"
    />

    <section class="py-16 md:py-24">
      <AppContainer>
        <div class="mx-auto max-w-3xl space-y-6">
          <template v-if="pending">
            <AppLoadingCard
              v-for="item in 2"
              :key="'event-loading-' + item"
              variant="event"
            />
          </template>

          <template v-else>
            <article
              v-for="(event, index) in pageData.events"
              :key="'event-' + index"
              class="flex flex-col gap-6 rounded-2xl border border-line bg-paper p-6 md:flex-row md:items-center md:gap-10 md:p-8"
            >
              <div
                class="w-20 shrink-0 rounded-xl border border-line bg-surface py-3 text-center"
              >
                <p class="text-sm font-medium text-brand-600">
                  {{ event.month }}
                </p>
                <p class="text-3xl font-semibold tabular-nums leading-none">
                  {{ event.day }}
                </p>
              </div>

              <div class="flex-1">
                <h2 class="text-xl font-semibold">{{ event.title }}</h2>
                <p
                  class="mt-2 whitespace-pre-line text-base font-light leading-7 text-gray-600"
                >
                  {{ event.description }}
                </p>
                <div
                  class="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted"
                >
                  <span
                    v-if="event.time"
                    class="inline-flex items-center gap-1.5"
                  >
                    <Icon
                      name="heroicons:clock"
                      class="h-4 w-4"
                      aria-hidden="true"
                    />
                    {{ event.time }}
                  </span>
                  <span
                    v-if="event.location"
                    class="inline-flex items-center gap-1.5"
                  >
                    <Icon
                      name="heroicons:map-pin"
                      class="h-4 w-4"
                      aria-hidden="true"
                    />
                    {{ event.location }}
                  </span>
                </div>
              </div>
            </article>

            <div
              v-if="pageData.events.length === 0"
              class="rounded-2xl border border-line bg-surface py-10 px-5 text-center"
            >
              <h2 class="text-xl font-semibold">No events scheduled yet</h2>
              <p class="mt-3 text-base font-light leading-7 text-gray-600">
                Follow us on YouTube to catch our services and stay updated on
                what's coming next.
              </p>
              <AppButton
                variant="ghost"
                class="mt-6"
                href="https://www.youtube.com/@mcucop"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube
              </AppButton>
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

const defaultHeroImage = heroImages.celebrations.src;

useHead({
  title: "Events Calendar | Chapel of Praise",
});

useSeoMeta({
  description:
    "See upcoming services, worship nights, and events at Chapel of Praise.",
  ogTitle: "Events Calendar | Chapel of Praise",
  ogDescription:
    "See upcoming services, worship nights, and events at Chapel of Praise.",
});

const config = useRuntimeConfig();

const { data: fetchedData, pending } = await useFetch(
  `${config.public.apiBaseUrl}/public/events-calendar`,
  { lazy: import.meta.client },
);

const pageData = computed(() => {
  const apiData = fetchedData.value?.data || fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const eventsSec = apiData.eventsSection || {};

  return {
    hero: {
      image: hero.heroImage || defaultHeroImage,
      kicker: hero.heroKicker || "What's happening",
      headline: hero.heroHeadline || "Events Calendar",
    },
    events: eventsSec.events || [],
  };
});
</script>
