// stores/auth.js
import { defineStore } from "pinia";
import { useCookie, useNuxtApp, useRuntimeConfig } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: useCookie("admin_user").value || null,
    token: useCookie("admin_token").value || null,
    firebaseReady: false,
  }),

  actions: {
    async ensureFirebase() {
      const { $firebaseAuth } = useNuxtApp();

      if (typeof $firebaseAuth !== "function") {
        throw new Error("Firebase authentication is unavailable.");
      }

      const auth = await $firebaseAuth();
      this.firebaseReady = true;
      return auth;
    },

    setAuth(userData, token) {
      this.user = userData;
      this.token = token;

      // Firebase tokens expire in 1 hour, so we lower the maxAge
      const tokenCookie = useCookie("admin_token", { maxAge: 60 * 60 });
      const userCookie = useCookie("admin_user", { maxAge: 60 * 60 * 8 }); // User data can stay longer

      tokenCookie.value = token;
      userCookie.value = userData;
    },

    updateUserName(name) {
      if (!this.user) return;

      this.user = { ...this.user, name };

      const userCookie = useCookie("admin_user", { maxAge: 60 * 60 * 8 });
      userCookie.value = this.user;
    },

    clearAuth() {
      this.user = null;
      this.token = null;

      useCookie("admin_token").value = null;
      useCookie("admin_user").value = null;
    },

    // Rebuilds the session from a still-valid Firebase token when the
    // admin_user cookie has expired. Returns true on success.
    async syncUser(token) {
      const config = useRuntimeConfig();

      try {
        const response = await $fetch(
          `${config.public.apiBase}/admin/auth/login`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response?.user) return false;

        this.setAuth(response.user, token);
        return true;
      } catch (error) {
        console.error("Failed to re-sync user session:", error);
        return false;
      }
    },

    async logout() {
      try {
        const auth = await this.ensureFirebase();
        const { signOut } = await import("firebase/auth");
        await signOut(auth);
      } catch (error) {
        console.error("Firebase logout error", error);
      }

      this.clearAuth();

      return navigateTo("/auth/login"); // Must match the public route in middleware/auth.global.js
    },
  },
});
