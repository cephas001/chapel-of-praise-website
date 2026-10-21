<template>
  <div class="flex justify-center">
    <AppButton
      variant="secondary"
      icon="heroicons:plus"
      @click="$emit('click')"
    >
      {{ label }}
    </AppButton>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});

defineEmits(["click"]);
</script>
