<template>
  <NuxtImg
    v-if="isBlobImage"
    :src="src"
    :alt="alt"
    :sizes="blobSizes"
    :format="format"
    :densities="densities"
    :fit="fit"
    :quality="quality"
    :width="width"
    :height="height"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchpriority"
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
      :width="width"
      :height="height"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchpriority"
      v-bind="$attrs"
    >
  </picture>
  <img
    v-else
    :src="src"
    :alt="alt"
    :sizes="staticSizes"
    :width="width"
    :height="height"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchpriority"
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
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
  sizes: {
    type: [String, Object],
    default: undefined,
  },
  format: {
    type: String,
    default: "webp",
  },
  densities: {
    type: String,
    default: "1x",
  },
  fit: {
    type: String,
    default: undefined,
  },
  quality: {
    type: [String, Number],
    default: 78,
  },
  loading: {
    type: String,
    default: "lazy",
  },
  decoding: {
    type: String,
    default: "async",
  },
  fetchpriority: {
    type: String,
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

const SCREEN_MIN_WIDTH = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

const DEFAULT_FLUID_SIZES = {
  xs: "100vw",
  sm: "100vw",
  md: "100vw",
  lg: "100vw",
  xl: "100vw",
  xxl: "100vw",
};

const buildCssSizes = (entries) => {
  const normalized = entries
    .filter(({ value }) => value !== undefined && value !== null && value !== "")
    .map(({ key, value }) => {
      let min = SCREEN_MIN_WIDTH[key];

      if (!Number.isFinite(min)) {
        min = Number.parseInt(key, 10);
      }

      if (!Number.isFinite(min)) {
        min = 0;
      }

      return { min, value: String(value) };
    })
    .sort((left, right) => left.min - right.min)
    .filter(
      (entry, index, list) => index === 0 || entry.value !== list[index - 1].value,
    );

  if (!normalized.length) return undefined;
  if (normalized.length === 1) return normalized[0].value;

  return [
    ...normalized
      .slice(1)
      .map(({ min, value }) => `(min-width: ${min}px) ${value}`),
    normalized[0].value,
  ].join(", ");
};

const toCssSizes = (sizes) => {
  if (!sizes) return undefined;
  if (typeof sizes === "string") {
    if (!sizes.includes(":") || sizes.includes("(")) return sizes;

    return buildCssSizes(
      sizes
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((token) => {
          const [key, value] = token.split(":");
          return value
            ? { key, value }
            : { key: "xs", value: token };
        }),
    );
  }

  return buildCssSizes(
    Object.entries(sizes).map(([key, value]) => ({ key, value })),
  );
};

const isBlobImage = computed(() => {
  if (!props.src) return false;

  try {
    const hostname = new URL(props.src, "http://localhost").hostname;
    return hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
});

const blobSizes = computed(() => {
  if (props.sizes) return props.sizes;
  if (props.width) return undefined;
  return DEFAULT_FLUID_SIZES;
});

const staticSizes = computed(() => toCssSizes(props.sizes));
</script>
