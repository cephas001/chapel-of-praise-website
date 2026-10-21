<template>
  <div>
    <AppRouteProgress />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useHead, useRoute, useRuntimeConfig, useSeoMeta } from "#app";

const config = useRuntimeConfig();
const route = useRoute();

const siteUrl = computed(() =>
  String(config.public.siteUrl || "").replace(/\/$/, ""),
);
const pageUrl = computed(() => `${siteUrl.value}${route.path}`);
const ogImage = computed(() => `${siteUrl.value}/og-image.jpg`);

useHead({
  link: [{ rel: "canonical", href: pageUrl }],
});

useSeoMeta({
  ogUrl: pageUrl,
  ogImage,
  twitterImage: ogImage,
});
</script>
