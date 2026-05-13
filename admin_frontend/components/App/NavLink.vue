<template>
  <NuxtLink
    :to="url"
    @click="emit('click')"
    :class="[
      'flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 border border-transparent',
      checkActiveRoute(url)
        ? 'bg-slate-100 text-slate-950 border-slate-200 shadow-sm dark:bg-slate-800 dark:text-white dark:border-slate-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white',
    ]"
  >
    <Icon :name="iconName" class="mr-3 h-5 w-5 opacity-80" />

    {{ text }}
  </NuxtLink>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    default: "heroicons:rectangle-stack",
  },
  url: {
    type: String,
    required: true,
  },
});

const checkActiveRoute = (url) => {
  return route.path == url;
};

const emit = defineEmits(["click"]);
</script>
