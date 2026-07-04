<template>
  <div
    class="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 group flex flex-col hover:-translate-y-1 hover:shadow-md"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"
    ></div>
    <div class="flex items-center gap-4 mb-4">
      <div :class="iconBoxClass">
        <Icon :name="iconName" class="w-6 h-6" />
      </div>

      <h3 class="text-sm md:text-base font-bold text-gray-900 font-jetbrains">
        {{ title }}
      </h3>
    </div>

    <p class="text-xs md:text-sm text-gray-500 mb-8 leading-relaxed grow">
      {{ description }}
    </p>

    <div
      class="flex flex-col sm:flex-row gap-3 mt-auto"
      v-if="links.length > 0"
    >
      <NuxtLink
        :to="link.url"
        class="flex-1 text-center py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold border transition-all duration-200 font-jetbrains"
        :class="
          link.type === 'primary'
            ? 'bg-black text-white border-black hover:bg-gray-800'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-black'
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
  teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-500 group-hover:text-white",
  orange:
    "bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white",
  blue: "bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white",
  purple:
    "bg-violet-50 text-violet-600 group-hover:bg-violet-500 group-hover:text-white",
  red: "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
  green:
    "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
};

const iconBoxClass = computed(() => {
  return [
    "p-3 rounded-2xl transition-colors duration-200 flex items-center",
    iconPalette[props.iconColor] || iconPalette.orange,
  ];
});
</script>
