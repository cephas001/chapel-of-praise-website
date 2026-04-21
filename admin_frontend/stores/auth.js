// stores/auth.js
import { defineStore } from "pinia";
import { useCookie, useNuxtApp } from "#app";
import { signOut } from "firebase/auth"; // ADD THIS

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: useCookie("admin_user").value || null,
    token: useCookie("admin_token").value || null,
  }),

  actions: {
    setAuth(userData, token) {
      this.user = userData;
      this.token = token;

      // Firebase tokens expire in 1 hour, so we lower the maxAge
      const tokenCookie = useCookie("admin_token", { maxAge: 60 * 60 });
      const userCookie = useCookie("admin_user", { maxAge: 60 * 60 * 8 }); // User data can stay longer

      tokenCookie.value = token;
      userCookie.value = userData;
    },

    async logout() {
      // Make this async
      try {
        const { $auth } = useNuxtApp();
        if ($auth) await signOut($auth); // Log out of Firebase
      } catch (error) {
        console.error("Firebase logout error", error);
      }

      this.user = null;
      this.token = null;

      const tokenCookie = useCookie("admin_token");
      const userCookie = useCookie("admin_user");

      tokenCookie.value = null;
      userCookie.value = null;

      navigateTo("/login"); // Note: You had "/login" here, but your middleware checks "/auth/login". Ensure this matches!
    },
  },
});
