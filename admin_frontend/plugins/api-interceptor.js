// plugins/api-interceptor.js
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";

// Shared guard so a burst of parallel 401s triggers a single logout cycle.
let isHandlingExpiredSession = false;

export default defineNuxtPlugin(() => {
  // Never wrap the server's global fetch: it would leak one request's token
  // into other requests. The admin app is client-only (ssr: false).
  if (!import.meta.client) return;

  const config = useRuntimeConfig();
  const apiBase = String(config.public.apiBase || "").replace(/\/+$/, "");

  // Captured while the plugin runs inside the Nuxt context so the async
  // response handler below can safely trigger the toast/modal.
  const toast = useAppToast();
  const errorModal = useErrorModal();

  // Nuxt 4.6 imports `$fetch` from a virtual module that snapshots
  // `globalThis.$fetch` when the app entry loads — before plugins run. That
  // means replacing `globalThis.$fetch` here no longer affects the
  // auto-imported `$fetch` used by pages and composables, so Authorization
  // headers were silently dropped and every protected call returned 401.
  //
  // ofetch resolves `globalThis.fetch` on each request, so wrapping the
  // native fetch intercepts every `$fetch` call instead.
  const nativeFetch = globalThis.fetch.bind(globalThis);

  const getRequestUrl = (input) => {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.href;
    return input?.url || "";
  };

  const readErrorBody = async (response) => {
    try {
      return await response.clone().json();
    } catch {
      return null;
    }
  };

  const handleUnauthorized = async (data) => {
    if (isHandlingExpiredSession) return;
    isHandlingExpiredSession = true;

    try {
      const backendMessage =
        data?.error || "Your session has expired. Please log in again.";
      toast.error(`Session Expired: ${backendMessage}`);

      const authStore = useAuthStore();
      await authStore.logout();
    } finally {
      isHandlingExpiredSession = false;
    }
  };

  globalThis.fetch = async (input, init = {}) => {
    if (!apiBase || !getRequestUrl(input).startsWith(apiBase)) {
      return nativeFetch(input, init);
    }

    const token = useCookie("admin_token").value;
    const headers = new Headers(
      init.headers || (input instanceof Request ? input.headers : undefined),
    );

    // Preserve explicitly supplied headers (the login page sends the freshly
    // issued Firebase token before it has been written to the cookie).
    if (token && !headers.has("authorization")) {
      headers.set("authorization", `Bearer ${token}`);
    }

    const response = await nativeFetch(input, { ...init, headers });

    if (response.status === 401 || response.status === 403) {
      // UI handling must never replace the actual response for the caller.
      try {
        const data = await readErrorBody(response);

        if (response.status === 401) {
          await handleUnauthorized(data);
        } else {
          const backendMessage =
            data?.error || "You do not have the required permissions.";
          errorModal.showError(backendMessage, "Access Denied");
        }
      } catch (error) {
        console.error("Failed to handle API authorization error:", error);
      }
    }

    return response;
  };
});
