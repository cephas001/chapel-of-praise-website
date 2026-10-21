<template>
  <section
    class="relative flex w-full items-center justify-center overflow-hidden bg-ink text-paper"
    :class="size === 'full' ? 'min-h-svh' : 'h-[50vh] min-h-[400px]'"
  >
    <AppImage
      v-if="displayImage"
      :src="displayImage"
      :sizes="displaySizes"
      :width="displayWidth"
      :height="displayHeight"
      :avif-srcset="isFallback ? fallback?.avifSrcset : undefined"
      :webp-srcset="isFallback ? fallback?.webpSrcset : undefined"
      alt=""
      class="absolute inset-0 h-full w-full translate-y-12 object-cover object-top opacity-60 grayscale-[0.3] md:translate-y-0"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
    />

    <div
      class="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80"
      aria-hidden="true"
    />

    <div
      class="relative z-10 flex w-full flex-col items-center px-4 pt-20 text-center"
      :class="{ 'hero-seq': animated }"
    >
      <span
        class="mb-5 h-0.5 w-10 rounded-full bg-brand-600"
        aria-hidden="true"
      />

      <p v-if="kicker" class="mb-3 text-sm font-medium text-white">
        {{ kicker }}
      </p>

      <h1
        v-if="title && !$slots.title"
        class="max-w-5xl font-impact uppercase leading-[0.95]"
        :class="
          size === 'full'
            ? 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
            : 'text-4xl sm:text-5xl md:text-6xl'
        "
      >
        {{ title }}
      </h1>

      <slot name="title" />

      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  kicker: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  fallback: {
    type: Object,
    default: null,
  },
  sizes: {
    type: [String, Object],
    default: undefined,
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
  size: {
    type: String,
    default: "sub",
  },
  priority: {
    type: Boolean,
    default: false,
  },
  animated: {
    type: Boolean,
    default: false,
  },
});

const isFallback = computed(
  () =>
    !!props.fallback &&
    (!props.image || props.image === props.fallback.src),
);

const displayImage = computed(() =>
  isFallback.value ? props.fallback?.src : props.image,
);

const displayWidth = computed(() =>
  isFallback.value ? props.fallback?.width : props.width,
);

const displayHeight = computed(() =>
  isFallback.value ? props.fallback?.height : props.height,
);

const displaySizes = computed(() => {
  if (props.sizes) return props.sizes;
  if (isFallback.value) return "100vw";

  return {
    xs: "100vw",
    sm: "100vw",
    md: "100vw",
    lg: "100vw",
    xl: "100vw",
    xxl: "100vw",
  };
});
</script>

<style scoped>
.hero-seq {
  animation: hero-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-seq {
    animation: none;
  }
}
</style>
