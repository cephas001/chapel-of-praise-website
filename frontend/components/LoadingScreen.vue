<template>
  <Transition name="fade">
    <div v-if="isLoading" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="flex flex-col items-center justify-center gap-6">
        <!-- Animated Logo -->
        <div class="relative w-32 h-32">
          <img 
            src="~/assets/images/Chapel Of Praise Logo.png" 
            alt="Loading..." 
            class="w-full h-full object-contain animate-spin"
          />
        </div>
        
        <!-- Loading Text -->
        <div class="text-center">
          <p class="text-slate-600 font-light text-sm tracking-wider uppercase">Loading Content</p>
          <div class="flex justify-center gap-1 mt-2">
            <span class="w-2 h-2 bg-[#f04f23] rounded-full animate-bounce" style="animation-delay: 0s;"></span>
            <span class="w-2 h-2 bg-[#f04f23] rounded-full animate-bounce" style="animation-delay: 0.2s;"></span>
            <span class="w-2 h-2 bg-[#f04f23] rounded-full animate-bounce" style="animation-delay: 0.4s;"></span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 2s linear infinite;
}

@keyframes bounce {
  0%, 80%, 100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite;
}
</style>
