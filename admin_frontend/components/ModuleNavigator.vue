<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur transition-all duration-300 group flex flex-col hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_16px_40px_rgba(2,6,23,0.35)] dark:hover:shadow-[0_28px_70px_rgba(2,6,23,0.48)]"
  >
    <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700"></div>
    <div class="flex items-center gap-4 mb-4">
      <div :class="iconBoxClass">
        <Icon :name="iconName" class="w-6 h-6" />
      </div>

      <h3 class="text-xl font-bold text-slate-950 dark:text-white">{{ title }}</h3>
    </div>

    <p class="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed grow">
      {{ description }}
    </p>

    <div
      class="flex flex-col sm:flex-row gap-3 mt-auto"
      v-if="links.length > 0"
    >
      <NuxtLink
        :to="link.url"
        class="flex-1 text-center py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-200"
        :class="
          link.type === 'primary'
            ? 'bg-slate-950 text-white border-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:border-white dark:hover:bg-slate-200'
            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-950 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white'
        "
        v-for="(link, index) in links"
        :key="index"
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
  links: [
    {
      text: String,
      url: String,
      type: {
        type: String,
        default: "primary", // or 'secondary'
      },
    },
  ],
});

const iconPalette = {
  teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-500 group-hover:text-white dark:bg-teal-500/15 dark:text-teal-300 dark:group-hover:bg-teal-500 dark:group-hover:text-white",
  orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-500/15 dark:text-orange-300 dark:group-hover:bg-orange-500 dark:group-hover:text-white",
  blue: "bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-500/15 dark:text-sky-300 dark:group-hover:bg-sky-500 dark:group-hover:text-white",
  purple: "bg-violet-50 text-violet-600 group-hover:bg-violet-500 group-hover:text-white dark:bg-violet-500/15 dark:text-violet-300 dark:group-hover:bg-violet-500 dark:group-hover:text-white",
  red: "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white dark:bg-rose-500/15 dark:text-rose-300 dark:group-hover:bg-rose-500 dark:group-hover:text-white",
  green: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white dark:bg-emerald-500/15 dark:text-emerald-300 dark:group-hover:bg-emerald-500 dark:group-hover:text-white",
};

const iconBoxClass = computed(() => {
  return [
    "p-3 rounded-2xl transition-colors duration-200 flex items-center",
    iconPalette[props.iconColor] || iconPalette.orange,
  ];
});
</script>
