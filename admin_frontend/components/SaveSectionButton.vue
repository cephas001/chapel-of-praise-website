<!-- components/SaveSectionButton.vue -->
<template>
  <button
    @click.prevent="$emit('click')"
    :disabled="isLoading || disabled"
    class="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-xs md:text-sm text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
  >
    <Icon
      v-if="isLoading"
      name="heroicons:arrow-path"
      class="mr-2 h-4 w-4 animate-spin"
    />
    {{ isLoading ? loadingLabel : label }}
  </button>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Save Section",
  },
  loadingLabel: {
    type: String,
    default: "Saving...",
  },
});

defineEmits(["click"]);
</script>
