<template>
  <div
    class="grid gap-3"
    :class="columns"
    :aria-busy="isLoading ? 'true' : undefined"
  >
    <template v-if="isLoading">
      <div
        v-for="index in skeletonCount"
        :key="index"
        class="aspect-square animate-pulse rounded-surface bg-line"
        aria-hidden="true"
      />
    </template>

    <template v-else-if="images.length">
      <component
        :is="selectable ? 'button' : 'article'"
        v-for="image in images"
        :key="image.id"
        :type="selectable ? 'button' : undefined"
        class="group overflow-hidden rounded-surface border border-line bg-surface text-left transition-colors"
        :class="
          selectable
            ? 'hover:border-ink focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2'
            : ''
        "
        :aria-label="selectable ? `Select ${image.name}` : undefined"
        @click="handleCardClick(image)"
      >
        <div class="relative aspect-square overflow-hidden bg-subtle">
          <img
            :src="image.url"
            :alt="image.name"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          >

          <div
            v-if="selectable"
            class="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
          >
            <span
              class="rounded-control bg-surface px-3 py-2 font-mono text-xs font-medium text-ink"
            >
              Select image
            </span>
          </div>

          <slot v-else name="actions" :image="image" />
        </div>

        <div class="p-3">
          <p class="truncate text-xs font-medium text-ink" :title="image.name">
            {{ image.name }}
          </p>
          <slot name="meta" :image="image">
            <p class="mt-1 font-mono text-xs text-muted">
              {{ formatDate(image.createdAt) || "Uploaded image" }}
            </p>
          </slot>
        </div>
      </component>
    </template>

    <div
      v-else
      class="col-span-full rounded-surface border border-dashed border-line bg-surface px-5 py-14 text-center"
    >
      <Icon :name="emptyIcon" class="mx-auto h-9 w-9 text-line" />
      <p class="mt-3 font-mono text-sm font-medium text-ink">
        {{ emptyTitle }}
      </p>
      <p v-if="emptyDescription" class="mt-1 text-xs text-muted">
        {{ emptyDescription }}
      </p>
      <slot name="empty-actions" />
    </div>
  </div>
</template>

<script setup>
import { formatDate } from "~/utils/formatters";

const props = defineProps({
  images: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
  columns: {
    type: String,
    default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  },
  skeletonCount: { type: Number, default: 8 },
  emptyIcon: { type: String, default: "heroicons:photo" },
  emptyTitle: { type: String, default: "No images available" },
  emptyDescription: { type: String, default: "" },
});

const emit = defineEmits(["select"]);

const handleCardClick = (image) => {
  if (props.selectable) emit("select", image);
};
</script>
