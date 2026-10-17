<template>
  <div
    v-if="showPrompt"
    class="fixed bottom-6 inset-x-0 mx-auto z-chrome animate-slide-up w-[calc(100%-3rem)] max-w-sm"
  >
    <div
      class="rounded-surface border border-line bg-surface p-5 text-ink shadow-overlay backdrop-blur-xl flex flex-col gap-4"
    >
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-control bg-ink text-white flex items-center justify-center shrink-0"
          >
            <Icon name="heroicons:squares-plus" class="h-6 w-6" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold">
              COP Admin App
            </span>
            <span class="text-xs font-medium text-muted mt-0.5">
              Fast, offline-ready chapel operations.
            </span>
          </div>
        </div>
        <button
          aria-label="Dismiss install prompt"
          class="rounded-control p-1 text-muted transition-colors hover:text-ink"
          @click="dismissPrompt"
        >
          <Icon name="heroicons:x-mark" class="h-5 w-5" />
        </button>
      </div>

      <AppButton
        v-if="!isIOS"
        icon="heroicons:arrow-down-tray"
        class="w-full"
        @click="installApp"
      >
        Install app
      </AppButton>

      <div
        v-else
        class="rounded-control border border-line bg-subtle p-3 text-xs font-medium leading-relaxed text-muted"
      >
        To install on iOS: tap the
        <span
          class="mx-1 inline-flex items-center justify-center rounded-badge border border-line bg-surface p-1"
        >
          <Icon name="heroicons:arrow-up-tray" class="h-3.5 w-3.5" />
        </span>
        <strong>Share</strong> icon below, then select
        <strong>Add to Home Screen</strong>.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const showPrompt = ref(false);
const deferredPrompt = ref(null);
const isIOS = ref(false);
let timer = null;

const handleBeforeInstallPrompt = (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt.value = e;
};

const dismissPrompt = () => {
  showPrompt.value = false;
  // Save to localStorage so we don't annoy them again for 7 days
  const expiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  localStorage.setItem("pwa-dismissed-until", expiry.toString());
};

const installApp = async () => {
  if (!deferredPrompt.value) return;

  // Show the native browser install prompt
  deferredPrompt.value.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice;
  if (outcome === "accepted") {
    showPrompt.value = false;
  }

  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt.value = null;
};

onMounted(() => {
  if (!import.meta.client) return;

  // 1. Check if the app is already installed (running in standalone mode)
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  if (isStandalone) return;

  // 2. Check if the user recently dismissed the prompt
  const dismissedUntil = localStorage.getItem("pwa-dismissed-until");
  if (dismissedUntil && new Date().getTime() < parseInt(dismissedUntil)) return;

  // 3. Detect if the user is on an iPhone/iPad
  const userAgent = window.navigator.userAgent.toLowerCase();
  isIOS.value = /iphone|ipad|ipod/.test(userAgent);

  // 4. Listen for the native install prompt event (Android/Desktop)
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

  // 5. Start the 3-second delay timer
  timer = setTimeout(() => {
    // If it's iOS (where beforeinstallprompt doesn't exist), OR if we successfully caught the Android prompt
    if (isIOS.value || deferredPrompt.value) {
      showPrompt.value = true;
    }
  }, 3000);

  // 6. Listen for successful installation to hide the UI
  window.addEventListener("appinstalled", () => {
    showPrompt.value = false;
    deferredPrompt.value = null;
  });
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );
    if (timer) clearTimeout(timer);
  }
});
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
