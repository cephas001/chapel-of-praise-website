<template>
  <div
    class="relative overflow-hidden rounded-surface border border-line bg-surface p-6 transition duration-300 group flex flex-col hover:-translate-y-1"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line to-transparent"
    />
    <div class="flex items-center gap-4 mb-4">
      <div :class="iconBoxClass">
        <Icon :name="iconName" class="w-6 h-6" />
      </div>

      <h3 class="text-sm md:text-base font-semibold text-ink">
        {{ title }}
      </h3>
    </div>

    <p class="text-xs md:text-sm text-muted mb-8 leading-relaxed grow">
      {{ description }}
    </p>

    <div
      v-if="links.length > 0"
      class="flex flex-col sm:flex-row gap-3 mt-auto"
    >
      <NuxtLink
        v-for="(link, index) in links"
        :key="index"
        :to="link.url"
        class="flex-1 rounded-surface border px-4 py-2.5 text-center text-xs font-medium transition-colors duration-200 md:text-sm"
        :class="
          link.type === 'primary'
            ? 'bg-ink text-white border-ink hover:bg-ink/85'
            : 'bg-surface text-ink border-line hover:bg-subtle'
        "
      >
        {{ link.text }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    default: "heroicons:rectangle-stack",
  },
  iconColor: {
    type: String,
    default: "orange",
  },
  links: {
    type: Array,
    default: () => [],
  },
});

const iconPalette = {
  teal: "bg-subtle text-muted group-hover:bg-ink group-hover:text-white",
  orange:
    "bg-subtle text-muted group-hover:bg-ink group-hover:text-white",
  blue: "bg-subtle text-muted group-hover:bg-ink group-hover:text-white",
  purple:
    "bg-subtle text-muted group-hover:bg-ink group-hover:text-white",
  red: "bg-subtle text-muted group-hover:bg-ink group-hover:text-white",
  green:
    "bg-subtle text-muted group-hover:bg-ink group-hover:text-white",
};

const iconBoxClass = computed(() => {
  return [
    "p-3 rounded-surface transition-colors duration-200 flex items-center",
    iconPalette[props.iconColor] || iconPalette.orange,
  ];
});
</script>
