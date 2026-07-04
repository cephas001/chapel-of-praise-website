<template>
  <div :class="classList">
    <h1 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
      {{ text }}
    </h1>
    <p v-if="description" class="text-xs md:text-sm text-gray-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  classList: {
    type: String,
    default: "",
  },
});
</script>
