<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <Icon v-if="icon" :name="icon" class="mr-2 h-4 w-4" />
    <slot />
  </NuxtLink>

  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    :class="classes"
    @click="$emit('click', $event)"
  >
    <Icon
      v-if="loading"
      name="heroicons:arrow-path"
      class="mr-2 h-4 w-4 animate-spin"
    />
    <Icon v-else-if="icon" :name="icon" class="mr-2 h-4 w-4" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // primary | secondary | danger | ghost
  variant: { type: String, default: "primary" },
  // sm | md | lg
  size: { type: String, default: "md" },
  type: { type: String, default: "button" },
  to: { type: String, default: "" },
  icon: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

defineEmits(["click"]);

const variantClasses = {
  primary: "bg-black text-white shadow-sm hover:bg-gray-800",
  secondary:
    "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-black",
};

const sizeClasses = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-xs md:text-sm",
  lg: "px-8 py-3.5 text-xs md:text-sm",
};

const classes = computed(() => [
  "inline-flex items-center justify-center rounded-xl font-jetbrains transition-all disabled:opacity-70 disabled:cursor-not-allowed",
  variantClasses[props.variant] || variantClasses.primary,
  sizeClasses[props.size] || sizeClasses.md,
]);
</script>
