<template>
  <button
    type="button"
    class="group flex w-full items-center justify-between rounded-control px-3 pb-1.5 pt-5 text-left"
    :aria-expanded="modelValue ? 'true' : 'false'"
    @click="toggle"
  >
    <span
      class="font-mono text-xs font-medium text-muted transition-colors group-hover:text-ink"
    >
      {{ label }}
    </span>

    <Icon
      name="heroicons:chevron-right"
      aria-hidden="true"
      :class="[
        'h-3.5 w-3.5 transition-transform duration-200 group-hover:text-ink',
        modelValue ? 'rotate-90 text-ink' : 'text-muted',
      ]"
    />
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const toggle = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>
