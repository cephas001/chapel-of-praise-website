<template>
  <NuxtImg
    v-if="isBlobImage"
    :src="src"
    :alt="alt"
    v-bind="$attrs"
  />
  <img
    v-else
    :src="src"
    :alt="alt"
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
</script>
