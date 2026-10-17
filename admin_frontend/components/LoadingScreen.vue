<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-overlay bg-surface/95 backdrop-blur-md flex flex-col items-center justify-center"
    >
      <!-- Static Logo with subtle pulse -->
      <div class="relative w-40 sm:w-48 h-auto mb-10">
        <!-- The 'invert' class turns your white PNG into stark black -->
        <img
          src="~/assets/images/Chapel Of Praise Logo.png"
          alt="Chapel of Praise"
          class="w-full h-full object-contain invert opacity-90 animate-pulse-slow"
        >
      </div>

      <!-- Minimalist Loading Indicator -->
      <div class="flex flex-col items-center gap-4">
        <!-- Sleek progress track -->
        <div class="h-[2px] w-32 bg-line overflow-hidden rounded-full">
          <div class="h-full bg-ink rounded-full animate-progress"/>
        </div>

        <!-- Technical micro-copy -->
        <p class="text-xs font-mono font-medium text-muted animate-pulse">
          Loading environment…
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* A more premium, slower pulse for the logo */
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Indeterminate loading bar animation */
@keyframes progress {
  0% {
    width: 0%;
    transform: translateX(-100%);
  }
  50% {
    width: 40%;
    transform: translateX(30%);
  }
  100% {
    width: 100%;
    transform: translateX(200%);
  }
}

.animate-progress {
  animation: progress 1.5s infinite cubic-bezier(0.65, 0, 0.35, 1);
  transform-origin: left;
}
</style>
