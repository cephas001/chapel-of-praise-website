<template>
  <NuxtLink
    :to="url"
    :class="[
      'group relative flex items-center gap-2.5 rounded-control px-3 py-2 text-sm transition-colors',
      isActive
        ? 'bg-subtle text-ink before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-0.5 before:rounded-full before:bg-ink'
        : 'text-muted hover:bg-subtle hover:text-ink',
    ]"
    @click="emit('click')"
  >
    <Icon
      :name="iconName"
      class="h-4 w-4 shrink-0 transition-colors"
      :class="isActive ? 'text-ink' : 'text-muted group-hover:text-ink'"
    />
    {{ text }}
  </NuxtLink>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRoute } from "vue-router";

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

const emit = defineEmits(["click", "open-tab"]);
const route = useRoute();

const isActive = computed(() => route.path === props.url);

// Keep the owning accordion group open whenever this link is the active route.
watch(
  isActive,
  (active) => {
    if (active) emit("open-tab", true);
  },
  { immediate: true },
);
</script>
