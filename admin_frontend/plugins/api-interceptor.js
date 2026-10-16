// plugins/api-interceptor.js
import { defineNuxtPlugin, useCookie } from "#app";
import { useAuthStore } from "~/stores/auth";

// Shared guard so a burst of parallel 401s triggers a single logout cycle.
let isHandlingExpiredSession = false;

export default defineNuxtPlugin(() => {
  // Captured while the plugin runs inside the Nuxt context so the
  // async response handler below can safely trigger the modal.
  const errorModal = useErrorModal();

  const customFetch = $fetch.create({
    onRequest({ options }) {
      // Safely grab the token (Works in Vue components)
      const token = useCookie("admin_token").value;

      if (token) {
        // The bulletproof way to modify headers in Nuxt/ofetch
        // We wrap existing headers in a native Headers object, then use .set()
        const headers = new Headers(options.headers || {});
        headers.set("authorization", `Bearer ${token}`);

        // Reassign the properly formatted headers back to the options
        options.headers = headers;
      }
    },

    async onResponseError({ response }) {
      const status = response.status;
      const data = response._data;

      // Tag the response so local catch blocks know to ignore it!
      response._handledGlobally = true;

      if (status === 401) {
        if (isHandlingExpiredSession) return;
        isHandlingExpiredSession = true;

        try {
          const backendMessage =
            data?.error || "Your session has expired. Please log in again.";
          useAppToast().error(`Session Expired: ${backendMessage}`);

          const authStore = useAuthStore();
          await authStore.logout();
        } finally {
          isHandlingExpiredSession = false;
        }

        return;
      }

      if (status === 403) {
        const backendMessage =
          data?.error || "You do not have the required permissions.";
        errorModal.showError(backendMessage, "Access Denied");
      }
    },
  });

  globalThis.$fetch = customFetch;
});
