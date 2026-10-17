<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-panel overflow-hidden">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-ink/20 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        @click="requestClose"
      />

      <!-- Drawer Panel -->
      <div class="fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- keydown Esc/Tab on a focusable dialog is the accessible pattern -->
        <div
          ref="panelRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          class="w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-surface shadow-overlay flex flex-col h-full animate-slide-in-right border-l border-line outline-none"
          @keydown.esc.stop.prevent="requestClose"
          @keydown.tab="trapFocus"
        >
          <!-- Header -->
          <div
            class="px-6 pt-9 pb-5 border-b border-line flex items-center justify-between bg-surface"
          >
            <h2 :id="titleId" class="text-base font-semibold text-ink">
              {{ title }}
            </h2>
            <button
              aria-label="Close panel"
              class="text-muted hover:text-ink transition-colors focus:outline-none p-2 rounded-full hover:bg-subtle flex items-center justify-center"
              @click="requestClose"
            >
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </div>

          <!-- Body Content -->
          <div
            class="flex-1 overflow-y-auto p-6"
          >
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, useId } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // Optional guard. May return a boolean or a Promise<boolean>;
  // resolving false keeps the drawer open (used for unsaved-changes prompts).
  beforeClose: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(["close"]);

const panelRef = ref(null);
const titleId = useId();
let previouslyFocused = null;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = () =>
  Array.from(panelRef.value?.querySelectorAll(FOCUSABLE_SELECTOR) || []);

watch(
  () => props.isOpen,
  async (open) => {
    if (open) {
      previouslyFocused = document.activeElement;
      await nextTick();
      const focusable = getFocusableElements();
      (focusable[0] || panelRef.value)?.focus();
    } else if (previouslyFocused?.focus) {
      previouslyFocused.focus();
    }
  },
  { immediate: true },
);

// Keep Tab focus inside the dialog while it is open (focus trap)
const trapFocus = (event) => {
  const focusable = getFocusableElements();
  if (focusable.length === 0) return;

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

const requestClose = async () => {
  if (props.beforeClose) {
    const canClose = await props.beforeClose();
    if (!canClose) return;
  }
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
