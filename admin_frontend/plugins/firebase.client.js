import { useAuthStore } from "~/stores/auth";
import {
  useCookie,
  useRuntimeConfig,
  defineNuxtPlugin,
} from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
  };
  const authStore = useAuthStore();
  const tokenCookie = useCookie("admin_token", { maxAge: 60 * 60 });

  let authPromise = null;

  const initializeAuth = () => {
    if (authPromise) return authPromise;

    authPromise = Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
    ])
      .then(
        ([
          { initializeApp, getApp, getApps },
          { getAuth, onIdTokenChanged },
        ]) => {
          const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
          const auth = getAuth(app);

          onIdTokenChanged(auth, async (user) => {
            if (user) {
              const token = await user.getIdToken();
              tokenCookie.value = token;
              authStore.token = token;
            } else {
              tokenCookie.value = null;

              if (authStore.user || authStore.token) {
                authStore.clearAuth();
              }
            }
          });

          return auth;
        },
      )
      .catch((error) => {
        authPromise = null;
        console.error("Firebase initialization failed:", error);
        throw error;
      });

    return authPromise;
  };

  const scheduleIdleInitialization = () => {
    const initialize = () => {
      initializeAuth().catch(() => undefined);
    };

    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(initialize, { timeout: 2500 });
      return;
    }

    window.setTimeout(initialize, 300);
  };

  nuxtApp.hook("app:mounted", scheduleIdleInitialization);

  return {
    provide: {
      firebaseAuth: initializeAuth,
    },
  };
});
