<template>
  <component
    :is="componentTag"
    v-bind="{ ...componentAttrs, ...$attrs }"
    :type="isNative ? type : undefined"
    :disabled="isNative ? isDisabled : undefined"
    :tabindex="!isNative && isDisabled ? -1 : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :aria-disabled="!isNative && isDisabled ? 'true' : undefined"
    :class="classes"
  >
    <Icon
      v-if="loading"
      name="heroicons:arrow-path"
      class="h-4 w-4 shrink-0 animate-spin"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>

<script setup>
import { computed, resolveComponent } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "md",
  },
  to: {
    type: [String, Object],
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: "button",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const NuxtLink = resolveComponent("NuxtLink");

const isNative = computed(() => !props.to && !props.href);
const isDisabled = computed(() => props.disabled || props.loading);

const componentTag = computed(() => {
  if (props.to) return NuxtLink;
  if (props.href) return "a";
  return "button";
});

const componentAttrs = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href };
  return {};
});

const sizeClasses = {
  sm: "px-4 py-2",
  md: "px-6 py-3",
};

const variantClasses = {
  primary: "bg-ink text-paper hover:bg-brand-600",
  inverse: "bg-paper text-ink hover:bg-brand-600 hover:text-paper",
  ghost: "border border-ink text-ink hover:bg-ink hover:text-paper",
  "ghost-inverse":
    "border border-white/80 text-white hover:bg-paper hover:text-ink",
  link: "text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline",
};

const classes = computed(() => [
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600",
  props.variant === "link" ? "" : sizeClasses[props.size] || sizeClasses.md,
  variantClasses[props.variant] || variantClasses.primary,
  isDisabled.value ? "pointer-events-none opacity-60" : "",
]);
</script>
