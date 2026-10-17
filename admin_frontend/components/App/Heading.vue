<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div class="min-w-0">
      <component :is="tag" :class="titleClasses">
        {{ title }}
      </component>
      <p
        v-if="subtitle"
        class="mt-1.5 max-w-[72ch] text-sm leading-relaxed text-muted md:text-base"
      >
        {{ subtitle }}
      </p>
    </div>

    <div v-if="$slots.actions" class="flex shrink-0 flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  // 1 = page title, 2 = section heading, 3+ = card heading
  level: { type: Number, default: 1 },
});

const tag = computed(() => `h${Math.min(Math.max(props.level, 1), 6)}`);

const titleClasses = computed(() => {
  if (props.level <= 1) {
    return "text-2xl font-semibold tracking-tight text-ink md:text-3xl";
  }
  if (props.level === 2) {
    return "text-lg font-semibold tracking-tight text-ink md:text-xl";
  }
  return "text-base font-semibold text-ink";
});
</script>
