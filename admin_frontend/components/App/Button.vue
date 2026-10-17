<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <Icon v-if="icon" :name="icon" :class="iconClasses" />
    <slot />
  </NuxtLink>

  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    :class="classes"
    @click="$emit('click', $event)"
  >
    <Icon
      v-if="loading"
      name="heroicons:arrow-path"
      :class="[iconClasses, 'animate-spin']"
    />
    <Icon v-else-if="icon" :name="icon" :class="iconClasses" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // primary | secondary | ghost | danger (solid, destructive confirms only)
  variant: { type: String, default: "primary" },
  // sm (36px) | md (40px) | lg (48px — touch-first actions on mobile PWA)
  size: { type: String, default: "md" },
  type: { type: String, default: "button" },
  to: { type: String, default: "" },
  icon: { type: String, default: "" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

defineEmits(["click"]);

const variantClasses = {
  primary: "bg-ink text-white hover:bg-ink/85 active:bg-ink",
  secondary:
    "border border-line bg-surface text-ink hover:border-ink hover:bg-subtle",
  ghost: "text-muted hover:bg-subtle hover:text-ink",
  danger: "bg-danger-text text-white hover:bg-danger-text/85 active:bg-danger-text",
};

const sizeClasses = {
  sm: "h-9 gap-1.5 px-3.5 text-sm",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
};

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const classes = computed(() => [
  "inline-flex shrink-0 select-none items-center justify-center rounded-control font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  variantClasses[props.variant] || variantClasses.primary,
  sizeClasses[props.size] || sizeClasses.md,
]);

const iconClasses = computed(() => [
  "shrink-0",
  iconSizeClasses[props.size] || iconSizeClasses.md,
]);
</script>
