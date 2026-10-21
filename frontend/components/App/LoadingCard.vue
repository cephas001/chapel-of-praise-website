<template>
  <article
    v-if="variant === 'row'"
    class="loading-reveal grid grid-cols-1 gap-6 rounded-2xl border border-line bg-paper p-6 md:grid-cols-3 md:p-10"
    aria-hidden="true"
  >
    <div class="motion-safe:animate-pulse">
      <div class="h-5 w-2/3 rounded-sm bg-line" />
      <div class="mt-3 h-3 w-1/3 rounded-sm bg-line/80" />
    </div>
    <div class="space-y-3 motion-safe:animate-pulse md:col-span-2">
      <div class="h-3 w-full rounded-sm bg-line/80" />
      <div class="h-3 w-11/12 rounded-sm bg-line/80" />
      <div class="h-3 w-4/5 rounded-sm bg-line/70" />
    </div>
  </article>

  <article
    v-else-if="variant === 'event'"
    class="loading-reveal flex flex-col gap-6 rounded-2xl border border-line bg-paper p-6 md:flex-row md:items-center md:gap-10 md:p-8"
    aria-hidden="true"
  >
    <div
      class="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-surface motion-safe:animate-pulse"
    >
      <div class="h-3 w-10 rounded-sm bg-line" />
      <div class="mt-2 h-6 w-8 rounded-sm bg-line" />
    </div>
    <div class="flex-1 space-y-3 motion-safe:animate-pulse">
      <div class="h-5 w-2/3 rounded-sm bg-line" />
      <div class="h-3 w-full rounded-sm bg-line/80" />
      <div class="h-3 w-4/5 rounded-sm bg-line/70" />
      <div class="flex gap-5 pt-1">
        <div class="h-3 w-20 rounded-sm bg-line/70" />
        <div class="h-3 w-24 rounded-sm bg-line/70" />
      </div>
    </div>
  </article>

  <article
    v-else
    class="loading-reveal flex flex-col items-center rounded-2xl border border-line bg-paper p-6 text-center"
    aria-hidden="true"
  >
    <div
      class="aspect-square w-40 rounded-2xl bg-line motion-safe:animate-pulse"
    />
    <div class="mt-6 h-5 w-32 rounded-sm bg-line motion-safe:animate-pulse" />
    <div
      class="mt-2 h-3 w-24 rounded-sm bg-line/80 motion-safe:animate-pulse"
    />
    <div class="mt-5 w-full space-y-2 motion-safe:animate-pulse">
      <div class="h-3 w-full rounded-sm bg-line/80" />
      <div class="h-3 w-4/5 rounded-sm bg-line/70" />
    </div>
  </article>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: "row",
  },
});
</script>
