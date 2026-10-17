<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-overlay flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        @click="closeAlert"
      />

      <div
        class="relative w-full max-w-sm overflow-hidden rounded-surface border border-line bg-surface p-6 text-center shadow-overlay transform transition animate-fade-in-up"
      >
        <div
          class="mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-5"
          :class="theme.bgClass"
        >
          <svg
            v-if="type === 'success'"
            class="h-7 w-7 text-success-text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>

          <svg
            v-else-if="type === 'error'"
            class="h-7 w-7 text-danger-text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>

          <svg
            v-else
            class="h-7 w-7 text-warning-text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 class="mb-2 text-base font-semibold text-ink">
          {{ title }}
        </h3>
        <p class="mb-6 text-sm leading-relaxed text-muted">
          {{ message }}
        </p>

        <AppButton class="w-full" size="lg" @click="closeAlert">
          Okay
        </AppButton>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import { useAlertModal } from "~/composables/useAlertModal";

const { isOpen, title, message, type, closeAlert } = useAlertModal();

// Dynamically compute the colors based on the alert type
const theme = computed(() => {
  switch (type.value) {
    case "success":
      return { bgClass: "bg-success-surface" };
    case "error":
      return { bgClass: "bg-danger-surface" };
    case "warning":
    case "info":
    default:
      return { bgClass: "bg-warning-surface" };
  }
});
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
