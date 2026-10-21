<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-20 z-[60]"
    aria-hidden="true"
  >
    <div
      class="h-0.5 w-full overflow-hidden bg-brand-100/50 transition-opacity duration-150 motion-reduce:transition-none"
      :class="isLoading ? 'opacity-100' : 'opacity-0'"
    >
      <div
        class="h-full origin-left bg-brand-600 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none"
        :style="{ transform: `scaleX(${progress / 100})` }"
      />
    </div>
  </div>

  <p class="sr-only" role="status" aria-live="polite" aria-atomic="true">
    {{ shouldAnnounce ? "Loading page" : "" }}
  </p>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from "vue";
import { useLoadingIndicator } from "#app";

const { isLoading, progress } = useLoadingIndicator({
  duration: 1800,
  throttle: 120,
  hideDelay: 300,
});

const shouldAnnounce = ref(false);
let announceTimer;

watch(isLoading, (loading) => {
  clearTimeout(announceTimer);

  if (!loading) {
    shouldAnnounce.value = false;
    return;
  }

  announceTimer = window.setTimeout(() => {
    shouldAnnounce.value = true;
  }, 180);
});

onBeforeUnmount(() => {
  clearTimeout(announceTimer);
});
</script>
