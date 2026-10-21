<template>
  <div
    class="min-h-screen flex items-center justify-center bg-subtle px-4 sm:px-6 lg:px-8"
  >
    <AppCard
      class="max-w-md w-full" body-class="p-8"
    >
      <div class="text-center mb-6">
        <h2
          class="text-base md:text-xl font-semibold text-ink"
        >
          Chapel of Praise
        </h2>
        <p class="text-xs md:text-sm text-muted mt-1">
          Admin Portal
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label
            for="email"
            class="block text-xs font-medium text-ink mb-1"
            >Email
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:envelope"
                class="md:h-5 md:w-5 text-ink"
              />
            </div>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="block w-full rounded-control border border-line bg-surface py-2.5 pl-10 pr-3 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
              placeholder="reviewer@example.com"
            >
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-xs font-medium text-ink mb-1"
            >Password</label
          >

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon name="heroicons:lock-closed" class="h-5 w-5 text-ink" />
            </div>

            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="block w-full rounded-control border border-line bg-surface py-2.5 pl-10 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
              placeholder="••••••••"
            >

            <button
              type="button"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-muted transition-colors hover:text-ink focus:outline-none"
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
            class="text-xs text-muted underline underline-offset-2 transition-colors hover:text-ink"
            @click="handleForgotPassword"
          >
            Forgot password?
          </button>
        </div>

        <AppButton
          type="submit"
          size="lg"
          :loading="loading"
          class="w-full"
        >
          {{ loading ? "Signing in..." : "Sign in" }}
        </AppButton>
      </form>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRuntimeConfig, navigateTo, useNuxtApp } from "#app";

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
    const { signInWithEmailAndPassword } = await import("firebase/auth");

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
    const { sendPasswordResetEmail } = await import("firebase/auth");
    await sendPasswordResetEmail($auth, formData.email);
    toast.success("Password reset email sent. Check your inbox.");
  } catch (error) {
    console.error("Password reset error:", error);
    toast.error("Could not send the reset email. Please try again later.");
  }
}
</script>
