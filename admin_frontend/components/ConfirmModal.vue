<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center px-4 sm:px-0"
    >
      <div
        class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        @click="respond(false)"
      />

      <Transition name="scale">
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- keydown Esc/Tab on a focusable dialog is the accessible pattern -->
        <div
          v-if="isOpen"
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="messageId"
          tabindex="-1"
          class="relative z-10 w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white text-center shadow-2xl outline-none"
          @keydown.esc.stop.prevent="respond(false)"
          @keydown.tab="trapFocus"
        >
          <div class="p-6 sm:p-8">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              :class="
                isDestructive
                  ? 'bg-red-50 text-red-600'
                  : 'bg-blue-50 text-blue-600'
              "
            >
              <Icon
                :name="
                  isDestructive
                    ? 'material-symbols:warning'
                    : 'material-symbols:help'
                "
                class="text-3xl"
              />
            </div>

            <h3 :id="titleId" class="mb-2 text-sm font-bold text-gray-900 font-jetbrains">
              {{ title }}
            </h3>
            <p :id="messageId" class="text-xs md:text-sm text-gray-500 leading-relaxed">
              {{ message }}
            </p>
          </div>

          <div class="flex items-center border-t border-gray-200 bg-gray-50/70">
            <button
              ref="cancelButtonRef"
              class="flex-1 py-4 text-xs md:text-sm font-jetbrains text-gray-600 hover:bg-gray-100 transition-colors border-r border-gray-200 outline-none"
              @click="respond(false)"
            >
              {{ cancelText }}
            </button>
            <button
              class="flex-1 py-4 text-xs md:text-sm font-jetbrains transition-colors outline-none"
              :class="
                isDestructive
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-blue-600 hover:bg-blue-50'
              "
              @click="respond(true)"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick, useId } from "vue";
import { useConfirm } from "~/composables/useConfirm";

// The component just reads the state and fires the respond() function
const {
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  isDestructive,
  respond,
} = useConfirm();

const dialogRef = ref(null);
const cancelButtonRef = ref(null);
const titleId = useId();
const messageId = useId();

// Move focus into the dialog when it opens (cancel is the safe default)
watch(isOpen, async (open) => {
  if (open) {
    await nextTick();
    (cancelButtonRef.value || dialogRef.value)?.focus();
  }
});

// Keep Tab focus cycling inside the dialog
const trapFocus = (event) => {
  const focusable = dialogRef.value?.querySelectorAll(
    "button:not([disabled])",
  );
  if (!focusable || focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};
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

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
