<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-overlay flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      />

      <div
        class="relative w-full max-w-md overflow-hidden rounded-surface border border-line bg-surface p-6 text-center shadow-overlay transform transition animate-fade-in-up sm:p-8"
      >
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-danger-surface mb-6"
        >
          <svg
            class="h-8 w-8 text-danger-text"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h3 class="mb-2 text-base font-semibold text-ink">
          {{ errorTitle }}
        </h3>
        <p class="mb-8 text-sm text-muted leading-relaxed">
          {{ errorMessage }}
        </p>

        <AppButton class="w-full" size="lg" @click="closeModal">
          Understood
        </AppButton>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useErrorModal } from "~/composables/useErrorModal";

const { isOpen, errorMessage, errorTitle, closeModal } = useErrorModal();
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
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
