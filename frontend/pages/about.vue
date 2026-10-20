<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      :kicker="pageContent.hero.kicker"
      :image="pageContent.hero.image"
    >
      <template #title>
        <h1
          class="max-w-5xl font-impact text-4xl uppercase leading-[0.95] sm:text-5xl md:text-6xl"
          v-html="pageContent.hero.headline"
        />
      </template>
    </AppPageHero>

    <section class="py-16 md:py-24">
      <AppContainer>
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div class="lg:col-span-4">
            <h2
              class="font-impact text-4xl uppercase leading-[0.95] md:text-5xl"
            >
              <span class="block">{{ pageContent.vision.headlineBlack }}</span>
              <span class="block">{{ pageContent.vision.headlineColored }}</span>
            </h2>
          </div>

          <div class="lg:col-span-8">
            <div class="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
              <div
                class="vision-content-blocks text-base font-light leading-7 text-gray-600"
                v-html="pageContent.vision.col1"
              />
              <div
                class="vision-content-blocks text-base font-light leading-7 text-gray-600"
                v-html="pageContent.vision.col2"
              />
            </div>
          </div>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRuntimeConfig, useFetch, useHead, useSeoMeta } from "#app";
import DOMPurify from "isomorphic-dompurify";
import defaultHeroImage from "~/assets/images/chapel.webp";

useHead({
  title: "About Us | Chapel of Praise",
});

useSeoMeta({
  description:
    "Learn about Chapel of Praise: our vision, mission, and the story of a campus fellowship growing into a global ministry.",
  ogTitle: "About Us | Chapel of Praise",
  ogDescription:
    "Our vision, mission, and the story of a campus fellowship growing into a global ministry.",
});

const config = useRuntimeConfig();

const { data: pageData } = await useFetch(
  `${config.public.apiBaseUrl}/public/about`,
);

const sanitizeHtml = (html) =>
  DOMPurify.sanitize(String(html ?? ""), { USE_PROFILES: { html: true } });

const pageContent = computed(() => {
  const apiData = pageData.value || {};
  const hero = apiData.heroSection || {};
  const vision = apiData.visionSection || {};

  return {
    hero: {
      image: hero.heroImage || defaultHeroImage,
      kicker: hero.heroKicker || "The family at COP",
      headline: sanitizeHtml(
        hero.heroHeadline ||
          '<span class="block">In Christ, For</span><span class="block">Christ,</span><span class="block">With joy!</span>',
      ),
    },
    vision: {
      headlineBlack: vision.visionHeadlineBlack || "We serve God",
      headlineColored: vision.visionHeadlineColored || "By His Spirit",
      col1: sanitizeHtml(
        vision.visionContentCol1 ||
          `
    <p>Chapel of Praise (COP) is a mission-minded teaching ministry founded with a profound vision. <span class="font-bold text-ink">Our vision is to see all people celebrate endless life in Christ Jesus and fully embrace the power of His death, burial, and resurrection.</span></p>
    <p>At COP, we are committed to knowing Christ deeply and making Him known across the world. We nurture spiritual growth through in-depth teaching services, powerful prayer sessions, and outreach programs, empowering believers to live out their faith boldly. Our services are marked by the gifts of the Spirit, where prayer, prophecies, and spiritual songs flow freely in an atmosphere of worship.</p>
  `,
      ),
      col2: sanitizeHtml(
        vision.visionContentCol2 ||
          `
    <p>We hold firmly to the Word of God as the ultimate standard for doctrine, and we believe that the greatest demonstration of God's love is found in the redemptive work of Christ. Through His grace, we are blessed and righteous in His sight.</p>
    <p>Under Reverend Ibiwunmi Alo and Apostle Iren's leadership, COP has grown from a campus fellowship into a global ministry with over 15,000 members and more than 30 campuses across Nigeria, Europe, Canada, and the USA. We are the hands and feet of Christ, spreading the gospel to the uttermost parts of the earth—one billion souls in 10,000 cities for Christ.</p>
  `,
      ),
    },
  };
});
</script>

<style scoped>
.vision-content-blocks :deep(p:not(:last-child)) {
  margin-bottom: 1.15rem;
}
</style>
