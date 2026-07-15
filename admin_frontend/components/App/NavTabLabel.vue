<template>
  <div
    class="pr-4 py-2 mt-4 mb-1 flex items-center justify-between cursor-pointer group selection:bg-transparent"
    @click="toggle"
  >
    <span
      class="text-[11px] text-black font-bold uppercase tracking-widest font-jetbrains transition-colors duration-200"
    >
      {{ label }}
    </span>

    <Icon
      name="heroicons:chevron-right-solid"
      :class="[
        'h-3.5 w-3.5 transition-transform duration-200 :text-black',
        modelValue ? 'rotate-90' : '',
      ]"
    />
  </div>
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
