<template>
  <div class="overflow-hidden rounded-surface border border-line bg-surface">
    <div v-if="$slots.header" class="border-b border-line px-5 py-4">
      <slot name="header" />
    </div>

    <div :class="bodyClass">
      <slot />
    </div>

    <div v-if="$slots.footer" class="border-t border-line px-5 py-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Escape hatch for edge-to-edge bodies (e.g. tables): body-class="p-0"
  bodyClass: { type: String, default: "p-5" },
});
</script>
