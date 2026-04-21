<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[9999] overflow-hidden">
      <div
        class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        @click="close"
      ></div>

      <div class="fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
        <div
          class="w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-white shadow-2xl flex flex-col h-full animate-slide-in-right"
        >
          <div
            class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50"
          >
            <h2 class="text-xl font-bold text-gray-900 font-montserrat">
              {{ title }}
            </h2>
            <button
              @click="close"
              class="text-gray-400 hover:text-black transition-colors focus:outline-none p-2 rounded-full hover:bg-gray-100"
            >
              <Icon name="heroicons:x-mark" class="h-6 w-6" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style scoped>
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out forwards;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
