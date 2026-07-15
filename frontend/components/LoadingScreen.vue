<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-white/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center font-poppins"
    >
      <!-- Static Logo with graceful pulse -->
      <div class="relative w-40 sm:w-48 h-auto mb-10">
        <!-- The 'invert' class turns the white PNG into stark black -->
        <img
          src="~/assets/images/Chapel Of Praise Logo.png"
          alt="Chapel of Praise"
          class="w-full h-full object-contain invert opacity-90 animate-pulse-graceful"
        />
      </div>

      <!-- Minimalist Loading Indicator -->
      <div class="flex flex-col items-center gap-4">
        <!-- Sleek progress track -->
        <div class="h-[2px] w-32 bg-gray-200 overflow-hidden rounded-full">
          <!-- Injected #e94e4e here -->
          <div
            class="h-full bg-[#e94e4e] rounded-full animate-progress shadow-[0_0_8px_rgba(233,78,78,0.4)]"
          ></div>
        </div>

        <!-- Welcoming micro-copy -->
        <p
          class="text-[10px] font-jetbrains font-bold text-gray-400 uppercase tracking-widest animate-pulse"
        >
          Please Wait...
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
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* A slower, more welcoming pulse for the public side */
.animate-pulse-graceful {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
  animation: progress 2s infinite cubic-bezier(0.65, 0, 0.35, 1);
  transform-origin: left;
}
</style>
