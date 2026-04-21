<template>
  <NuxtLink
    :to="url"
    @click="emit('click')"
    :class="`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors  hover:bg-gray-50  hover:text-black ${checkActiveRoute(url) ? 'bg-gray-100 text-black' : 'text-gray-600'}`"
  >
    <Icon :name="iconName" class="mr-3 h-5 w-5 opacity-75" />

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
