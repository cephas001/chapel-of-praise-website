<template>
  <div
    aria-live="polite"
    aria-label="Notifications"
    class="fixed bottom-10 right-0 z-overlay flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :role="toast.type === 'error' ? 'alert' : 'status'"
        class="pointer-events-auto overflow-hidden rounded-surface border bg-surface shadow-overlay flex items-stretch"
        :class="borderColors[toast.type]"
      >
        <div
          class="p-4 flex items-center justify-center shrink-0"
          :class="bgColors[toast.type]"
        >
          <Icon
            :name="icons[toast.type]"
            class="text-2xl"
            :class="iconColors[toast.type]"
          />
        </div>

        <div class="py-3 px-4 flex-grow flex flex-col justify-center">
          <h4 class="text-sm font-semibold text-ink leading-tight">
            {{ toast.title }}
          </h4>
          <p class="text-xs text-muted mt-0.5 leading-snug">
            {{ toast.message }}
          </p>
        </div>

        <button
          aria-label="Dismiss notification"
          class="px-4 text-muted hover:text-ink transition-colors focus:outline-none"
          @click="remove(toast.id)"
        >
          <Icon name="material-symbols:close" class="text-lg" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useAppToast } from "~/composables/useAppToast";

const { toasts, remove } = useAppToast();

// Dictionaries to map the toast 'type' to specific Tailwind classes
const borderColors = {
  success: "border-success-line",
  error: "border-danger-line",
  info: "border-line",
  warning: "border-warning-line",
};
const bgColors = {
  success: "bg-success-surface",
  error: "bg-danger-surface",
  info: "bg-subtle",
  warning: "bg-warning-surface",
};
const iconColors = {
  success: "text-success-text",
  error: "text-danger-text",
  info: "text-ink",
  warning: "text-warning-text",
};
const icons = {
  success: "material-symbols:check-circle",
  error: "material-symbols:error",
  info: "material-symbols:info",
  warning: "material-symbols:notifications-active",
};
</script>

<style scoped>
/* Smooth slide-in-from-right animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9); /* Slides out to the right */
}
/* This ensures other toasts smoothly slide up when one is removed */
.toast-move {
  transition: transform 0.4s ease;
}
</style>
