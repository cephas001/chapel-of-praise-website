<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col"
  >
    <div class="flex items-center gap-4 mb-4">
      <div
        :class="`bg-${iconColor}-50 text-${iconColor}-600 p-3 rounded-xl group-hover:bg-${iconColor}-500 group-hover:text-black transition-colors duration-200 flex items-center`"
      >
        <Icon :name="iconName" class="w-6 h-6" />
      </div>

      <h3 class="text-xl font-bold text-black">{{ title }}</h3>
    </div>

    <p class="text-sm text-gray-500 mb-8 leading-relaxed grow">
      {{ description }}
    </p>

    <div
      class="flex flex-col sm:flex-row gap-3 mt-auto"
      v-if="links.length > 0"
    >
      <NuxtLink
        :to="link.url"
        class="flex-1 text-center py-2.5 px-4 rounded-xl text-sm font-semibold border transition-colors"
        :class="
          link.type === 'primary'
            ? ' bg-black text-white  hover:bg-gray-900 '
            : ' bg-gray-50 text-gray-700  border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors'
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
</script>
