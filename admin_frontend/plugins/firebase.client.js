// plugins/firebase.client.js
import { initializeApp } from "firebase/app";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import { useAuthStore } from "~/stores/auth";
import { useCookie, useRuntimeConfig, defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
  };

  // 1. Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // 2. Set up the auto-refresh listener immediately
  const authStore = useAuthStore();
  const tokenCookie = useCookie("admin_token", { maxAge: 60 * 60 });

  onIdTokenChanged(auth, async (user) => {
    if (user) {
      // User is logged in, grab the freshest token and update the cookie
      const token = await user.getIdToken();
      tokenCookie.value = token;
      authStore.token = token; // Keep Pinia in sync
    } else {
      // User is logged out: clear any leftover token/state so a stale
      // admin_user cookie can't keep the UI in a zombie session.
      tokenCookie.value = null;

      if (authStore.user || authStore.token) {
        authStore.clearAuth();
      }
    }
  });

  // 3. Provide $auth to the rest of the Nuxt app
  return {
    provide: {
      auth,
    },
  };
});
