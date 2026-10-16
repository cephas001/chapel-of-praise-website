<!-- components/SaveSectionButton.vue -->
<template>
  <AppButton
    :loading="isLoading"
    :disabled="disabled"
    @click="$emit('click')"
  >
    {{ isLoading ? loadingLabel : label }}
  </AppButton>
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
    default: "Save Changes",
  },
  loadingLabel: {
    type: String,
    default: "Saving...",
  },
});

defineEmits(["click"]);
</script>
