<template>
  <section
    class="relative flex w-full items-center justify-center overflow-hidden bg-ink text-paper"
    :class="
      size === 'full' ? 'min-h-svh' : 'h-[50vh] min-h-[400px]'
    "
  >
    <AppImage
      v-if="image"
      :src="image"
      :srcset="srcset"
      :sizes="sizes"
      :width="width"
      :height="height"
      alt=""
      class="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      decoding="async"
    />

    <div class="absolute inset-0 bg-black/60" aria-hidden="true" />

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
defineProps({
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
  srcset: {
    type: String,
    default: undefined,
  },
  sizes: {
    type: String,
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
