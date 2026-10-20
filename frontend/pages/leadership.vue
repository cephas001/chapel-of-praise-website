<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      :kicker="pageData.hero.kicker"
      :title="pageData.hero.headline"
      :image="pageData.hero.image"
    />

    <section class="bg-surface py-16 md:py-24">
      <AppContainer>
        <h2 class="font-impact text-3xl uppercase leading-none md:text-4xl">
          {{ pageData.team.headline }}
        </h2>
        <p class="mt-4 max-w-2xl text-base font-light leading-7 text-gray-600">
          {{ pageData.team.description }}
        </p>

        <div class="mt-16 space-y-16">
          <section>
            <h3 class="font-impact text-2xl uppercase md:text-3xl">
              Chaplaincy
            </h3>

            <div
              class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              <article
                v-for="(chaplain, index) in pageData.chaplaincy"
                :key="'chaplain-' + index"
                class="flex flex-col items-center rounded-2xl border border-line bg-paper p-6 text-center"
              >
                <AppImage
                  :src="chaplain.imageUrl || defaultPastorImage"
                  :alt="chaplain.name || 'Chaplain'"
                  class="aspect-square w-40 rounded-2xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <h4 class="mt-6 text-xl font-semibold">
                  {{ chaplain.name }}
                </h4>
                <p class="mt-1 text-sm font-medium text-brand-600">
                  {{ chaplain.title }}
                </p>
                <p class="mt-4 text-sm font-light leading-6 text-gray-600">
                  {{ chaplain.bio }}
                </p>
              </article>

              <div
                v-if="pageData.chaplaincy.length === 0"
                class="col-span-full rounded-2xl border border-line bg-paper p-10 text-center"
              >
                <h4 class="text-xl font-semibold">No chaplains listed yet</h4>
                <p class="mt-3 text-base font-light text-gray-600">
                  Please check back soon.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 class="font-impact text-2xl uppercase md:text-3xl">
              Student Executives
            </h3>

            <div
              class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              <article
                v-for="(executive, index) in pageData.executives"
                :key="'exec-' + index"
                class="flex flex-col items-center rounded-2xl border border-line bg-paper p-6 text-center"
              >
                <AppImage
                  :src="executive.imageUrl || defaultConnectImage"
                  :alt="executive.name || 'Executive'"
                  class="aspect-square w-40 rounded-2xl object-cover grayscale"
                  loading="lazy"
                  decoding="async"
                />
                <h4 class="mt-6 text-xl font-semibold">
                  {{ executive.name }}
                </h4>
                <p class="mt-1 text-sm font-medium text-brand-600">
                  {{ executive.title }}
                </p>
                <p class="mt-4 text-sm font-light leading-6 text-gray-600">
                  {{ executive.bio }}
                </p>
              </article>

              <div
                v-if="pageData.executives.length === 0"
                class="col-span-full rounded-2xl border border-line bg-paper p-10 text-center"
              >
                <h4 class="text-xl font-semibold">
                  No student executives listed yet
                </h4>
                <p class="mt-3 text-base font-light text-gray-600">
                  Please check back soon.
                </p>
              </div>
            </div>
          </section>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useFetch, useHead, useSeoMeta } from "#app";
import defaultPastorImage from "~/assets/images/pastor.webp";
import defaultConnectImage from "~/assets/images/connect.webp";

useHead({
  title: "Leadership | Chapel of Praise",
});

useSeoMeta({
  description:
    "Meet the pastors, chaplaincy team, and student executives leading Chapel of Praise.",
  ogTitle: "Leadership | Chapel of Praise",
  ogDescription:
    "Meet the pastors, chaplaincy team, and student executives leading Chapel of Praise.",
});

const config = useRuntimeConfig();

const { data: fetchedData } = await useFetch(
  `${config.public.apiBaseUrl}/public/leadership`,
);

const pageData = computed(() => {
  const apiData = fetchedData.value?.data || fetchedData.value || {};

  const hero = apiData.heroSection || {};
  const team = apiData.teamSection || {};
  const chaplaincy = apiData.chaplaincySection || {};
  const execs = apiData.studentExecutivesSection || {};

  return {
    hero: {
      image: hero.heroImageUrl || defaultPastorImage,
      kicker: hero.heroKicker || "Our pastors and leaders",
      headline: hero.heroHeadline || "Leadership",
    },
    team: {
      headline: team.teamHeadline || "Meet the team",
      description:
        team.teamDescription ||
        "Dedicated men and women committed to shepherding the flock and advancing the kingdom of God.",
    },
    chaplaincy: chaplaincy.chaplaincyList || [],
    executives: execs.studentExecutivesList || [],
  };
});
</script>
