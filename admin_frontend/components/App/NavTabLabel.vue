<template>
  <p
    class="my-2 px-3 py-2.5 text-sm rounded-xl flex items-center justify-between text-slate-900 dark:text-slate-100 font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all duration-200 group selection:bg-transparent"
    @click="toggle"
  >
    <span class="flex items-center">{{ label }}</span>

    <Icon
      name="heroicons:chevron-right-solid"
      :class="[
        'h-4 w-4 transition-transform duration-200 text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white',
        modelValue ? 'rotate-90' : '',
      ]"
    />
  </p>
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
