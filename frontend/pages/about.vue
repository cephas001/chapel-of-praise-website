<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      :kicker="pageContent.hero.kicker"
      :image="pageContent.hero.image"
      :fallback="heroImages.chapel"
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
              <span
                v-for="(line, index) in pageContent.vision.headlineLines"
                :key="`vision-headline-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h2>
          </div>

          <div class="lg:col-span-8">
            <div
              v-if="pageContent.vision.usesLegacy"
              class="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2"
            >
              <div
                class="vision-content-blocks text-base font-light leading-7 text-gray-600"
                v-html="pageContent.vision.legacyCol1"
              />
              <div
                class="vision-content-blocks text-base font-light leading-7 text-gray-600"
                v-html="pageContent.vision.legacyCol2"
              />
            </div>
            <div
              v-else
              class="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2"
            >
              <div class="space-y-5">
                <p
                  v-for="(paragraph, index) in pageContent.vision
                    .leftParagraphs"
                  :key="`vision-left-${index}`"
                  class="text-base font-light leading-7 text-gray-600"
                >
                  {{ paragraph }}
                </p>
              </div>
              <div class="space-y-5">
                <p
                  v-for="(paragraph, index) in pageContent.vision
                    .rightParagraphs"
                  :key="`vision-right-${index}`"
                  class="text-base font-light leading-7 text-gray-600"
                >
                  {{ paragraph }}
                </p>
              </div>
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
import { heroImages } from "~/utils/staticImages";

const defaultHeroImage = heroImages.chapel.src;

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

const defaultVisionParagraphs = [
  "Chapel of Praise (COP) is a mission-minded teaching ministry founded with a profound vision. Our vision is to see all people celebrate endless life in Christ Jesus and fully embrace the power of His death, burial, and resurrection.",
  "At COP, we are committed to knowing Christ deeply and making Him known across the world. We nurture spiritual growth through in-depth teaching services, powerful prayer sessions, and outreach programs, empowering believers to live out their faith boldly. Our services are marked by the gifts of the Spirit, where prayer, prophecies, and spiritual songs flow freely in an atmosphere of worship.",
  "We hold firmly to the Word of God as the ultimate standard for doctrine, and we believe that the greatest demonstration of God's love is found in the redemptive work of Christ. Through His grace, we are blessed and righteous in His sight.",
];

const normalizeParagraphs = (paragraphs) =>
  (Array.isArray(paragraphs) ? paragraphs : [])
    .map((paragraph) => String(paragraph ?? "").trim())
    .filter(Boolean);

const pageContent = computed(() => {
  const apiData = pageData.value || {};
  const hero = apiData.heroSection || {};
  const vision = apiData.visionSection || {};

  const paragraphs = normalizeParagraphs(vision.visionParagraphs);
  const legacyCol1 = String(vision.visionContentCol1 ?? "").trim();
  const legacyCol2 = String(vision.visionContentCol2 ?? "").trim();
  const usesLegacy =
    paragraphs.length === 0 && Boolean(legacyCol1 || legacyCol2);
  const displayParagraphs =
    paragraphs.length > 0 || usesLegacy
      ? paragraphs
      : defaultVisionParagraphs;
  const midpoint = Math.ceil(displayParagraphs.length / 2);
  const headlineLines = String(vision.visionHeadline ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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
      headlineLines:
        headlineLines.length > 0
          ? headlineLines
          : ["We serve God", "By His Spirit"],
      leftParagraphs: displayParagraphs.slice(0, midpoint),
      rightParagraphs: displayParagraphs.slice(midpoint),
      usesLegacy,
      legacyCol1: sanitizeHtml(legacyCol1),
      legacyCol2: sanitizeHtml(legacyCol2),
    },
  };
});
</script>

<style scoped>
.vision-content-blocks :deep(p:not(:last-child)) {
  margin-bottom: 1.15rem;
}
</style>
