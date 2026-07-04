<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
    >
      <div class="text-center mb-6">
        <h2
          class="text-md md:text-xl font-bold text-black uppercase font-jetbrains"
        >
          Chapel of Praise
        </h2>
        <p class="text-xs md:text-sm text-gray-700 mt-1 font-jetbrains">
          Admin Portal
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
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
            />
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
            />

            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black focus:outline-none"
            >
              <Icon v-if="!showPassword" name="heroicons:eye" class="h-5 w-5" />

              <Icon v-else name="heroicons:eye-slash" class="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center items-center gap-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-xs md:text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer font-jetbrains"
        >
          <Icon
            name="heroicons:arrow-path"
            v-if="loading"
            width="4"
            height="4"
            class="animate-spin"
          />
          {{ loading ? "Signing in..." : "Sign In" }}
        </button>

        <div v-if="errorMessage" class="rounded-md bg-red-50 p-3 mt-3">
          <div>
            <h3
              class="text-xs md:text-sm text-red-800 text-center font-literata tracking-wide"
            >
              {{ errorMessage }}
            </h3>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRuntimeConfig, navigateTo, useNuxtApp } from "#app";
import { signInWithEmailAndPassword } from "firebase/auth"; // ADD THIS

definePageMeta({ layout: false });

const authStore = useAuthStore();
const config = useRuntimeConfig();
const { $auth } = useNuxtApp(); // Get Firebase Auth from the plugin
const loading = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);

const formData = reactive({
  email: "",
  password: "",
});

async function handleLogin() {
  loading.value = true;
  errorMessage.value = "";

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
    const response = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firebaseToken}`, // Pass the token manually this one time
      },
    });

    // 4. Save to Pinia and Cookies (Just like before!)
    authStore.setAuth(response.user, firebaseToken);
    navigateTo("/dashboard");
  } catch (error) {
    // Map Firebase error codes to user-friendly messages
    console.log(error);
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      errorMessage.value = "Invalid email or password";
    } else {
      errorMessage.value = "An error occurred during login";
    }
  } finally {
    loading.value = false;
  }
}
</script>
