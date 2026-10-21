<template>
  <NuxtImg
    v-if="isBlobImage"
    :src="src"
    :alt="alt"
    :sizes="sizes"
    :format="format || 'webp'"
    :densities="densities || '1x'"
    :fit="fit"
    :quality="quality"
    v-bind="$attrs"
  />
  <picture v-else-if="avifSrcset || webpSrcset" class="contents">
    <source
      v-if="avifSrcset"
      type="image/avif"
      :srcset="avifSrcset"
      :sizes="staticSizes"
    >
    <source
      v-if="webpSrcset"
      type="image/webp"
      :srcset="webpSrcset"
      :sizes="staticSizes"
    >
    <img
      :src="src"
      :alt="alt"
      :sizes="staticSizes"
      :srcset="webpSrcset"
      v-bind="$attrs"
    >
  </picture>
  <img
    v-else
    :src="src"
    :alt="alt"
    :sizes="staticSizes"
    v-bind="$attrs"
  >
</template>

<script setup>
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
  sizes: {
    type: [String, Object],
    default: undefined,
  },
  format: {
    type: String,
    default: "",
  },
  densities: {
    type: String,
    default: "",
  },
  fit: {
    type: String,
    default: undefined,
  },
  quality: {
    type: [String, Number],
    default: undefined,
  },
  avifSrcset: {
    type: String,
    default: undefined,
  },
  webpSrcset: {
    type: String,
    default: undefined,
  },
});

const isBlobImage = computed(() => {
  if (!props.src) return false;

  try {
    const hostname = new URL(props.src, "http://localhost").hostname;
    return hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
});

const staticSizes = computed(() =>
  typeof props.sizes === "string" ? props.sizes : undefined,
);
</script>
