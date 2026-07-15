<template>
  <NuxtLink
    :to="url"
    @click="emit('click')"
    :class="[
      'flex items-center px-2 py-2 text-xs md:text-sm font-jetbrains transition-colors duration-200 border-l-[3px] group tracking-wide',
      checkActiveRoute(url)
        ? 'border-black text-black tracking-wider'
        : 'border-transparent text-black  hover:bg-gray-50 hover:border-gray-200',
    ]"
  >
    <Icon
      :name="iconName"
      :class="[
        'mr-3 h-4 w-4 transition-colors duration-200',
        checkActiveRoute(url) ? 'text-black' : 'text-gray-800',
      ]"
    />
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
  if (route.path == url) {
    emit("open-tab", true);
  }
  return route.path == url;
};

const emit = defineEmits(["click", "open-tab"]);
</script>
