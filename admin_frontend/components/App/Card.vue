<template>
  <div
    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
  >
    <div
      v-if="$slots.header"
      class="bg-gray-50/50 border-b border-gray-100 px-6 py-5"
    >
      <slot name="header" />
    </div>
    <div :class="bodyClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Override the default body padding when a section needs edge-to-edge content
  bodyClass: { type: String, default: "p-6" },
});
</script>
