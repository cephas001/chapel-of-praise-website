<template>
  <div :class="classList">
    <h1
      class="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight mb-2"
    >
      {{ text }}
    </h1>
    <p class="text-base text-slate-500 dark:text-slate-400 font-medium" v-if="description">
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
