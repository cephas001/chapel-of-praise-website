<template>
  <div
    class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
  >
    <div>
      <component
        :is="tag"
        class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2"
      >
        {{ title }}
      </component>
      <p v-if="subtitle" class="text-gray-500 text-xs md:text-sm">
        {{ subtitle }}
      </p>
    </div>

    <slot name="actions" />
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  // Heading level: 1 = page title, 2 = section title (clamped 1-6)
  level: { type: Number, default: 2 },
});

const tag = computed(() => `h${Math.min(Math.max(props.level, 1), 6)}`);
</script>
