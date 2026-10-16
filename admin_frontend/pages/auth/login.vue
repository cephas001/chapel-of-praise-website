<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <div class="text-center mb-6">
        <h2
          class="text-base md:text-xl font-bold text-black uppercase font-jetbrains"
        >
          Chapel of Praise
        </h2>
        <p class="text-xs md:text-sm text-gray-700 mt-1 font-jetbrains">
          Admin Portal
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label
            for="email"
            class="block text-xs md:text-sm text-black mb-1 font-jetbrains font-medium"
            >Email
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:envelope"
                class="md:h-5 md:w-5 text-black"
              />
            </div>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg text-xs md:text-sm transition-colors bg-white text-black"
              placeholder="reviewer@example.com"
            >
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-xs md:text-sm font-medium text-black mb-1 font-jetbrains"
            >Password</label
          >

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon name="heroicons:lock-closed" class="h-5 w-5 text-black" />
            </div>

            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg text-xs md:text-sm transition-colors bg-white text-black"
              placeholder="••••••••"
            >

            <button
              type="button"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-black focus:outline-none"
              @click="showPassword = !showPassword"
            >
              <Icon v-if="!showPassword" name="heroicons:eye" class="h-5 w-5" />

              <Icon v-else name="heroicons:eye-slash" class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            class="text-xs text-gray-600 hover:text-black underline underline-offset-2 font-jetbrains"
            @click="handleForgotPassword"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center gap-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-xs md:text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer font-jetbrains"
        >
          <Icon
            v-if="loading"
            name="heroicons:arrow-path"
            width="4"
            height="4"
            class="animate-spin"
          />
          {{ loading ? "Signing in..." : "Sign In" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRuntimeConfig, navigateTo, useNuxtApp } from "#app";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

definePageMeta({ layout: false });

const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $auth } = useNuxtApp(); // Get Firebase Auth from the plugin
const loading = ref(false);
const showPassword = ref(false);

const toast = useAppToast();

const formData = reactive({
  email: "",
  password: "",
});

async function handleLogin() {
  loading.value = true;
  try {
    // 1. Log in via Firebase FIRST
    const userCredential = await signInWithEmailAndPassword(
      $auth,
      formData.email,
      formData.password,
    );

    // 2. Get the secure Firebase ID Token
    const firebaseToken = await userCredential.user.getIdToken();

    // 3. Sync with your backend using the new login-sync route
    const response = await $fetch(`${config.public.apiBase}/admin/auth/login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firebaseToken}`, // Pass the token manually this one time
      },
    });

    // 4. Save to Pinia and Cookies (Just like before!)
    authStore.setAuth(response.user, firebaseToken);

    toast.success("Login successful!");
    navigateTo("/dashboard");
  } catch (error) {
    // Surface the real reason instead of collapsing every failure into
    // one generic message.
    const status = error?.response?.status || error?.statusCode;
    const backendMessage = error?.data?.error || error?.data?.message;

    if (status === 429) {
      toast.error(
        backendMessage ||
          "Too many login attempts. Please try again in 15 minutes.",
      );
    } else if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      toast.error("Invalid email or password");
    } else if (error.code === "auth/too-many-requests") {
      toast.error(
        "Too many attempts. Please wait a few minutes and try again.",
      );
    } else if (
      error.code === "auth/network-request-failed" ||
      (typeof navigator !== "undefined" && !navigator.onLine)
    ) {
      toast.error("Network error. Check your connection and try again.");
    } else {
      toast.error(backendMessage || "An error occurred during login");
    }
  } finally {
    loading.value = false;
  }
}

async function handleForgotPassword() {
  if (!formData.email) {
    toast.error(
      "Enter your email address above first, then select “Forgot password?”.",
    );
    return;
  }

  try {
    await sendPasswordResetEmail($auth, formData.email);
    toast.success("Password reset email sent. Check your inbox.");
  } catch (error) {
    console.error("Password reset error:", error);
    toast.error("Could not send the reset email. Please try again later.");
  }
}
</script>
