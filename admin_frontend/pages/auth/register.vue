<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative"
    >
      <NuxtLink
        to="/"
        class="absolute top-5 left-1/2 -translate-x-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer"
      >
        <Icon name="heroicons:arrow-left" class="w-5 h-5" />
      </NuxtLink>

      <div class="text-center mb-8 mt-6">
        <h2 class="text-2xl font-bold text-black">C.O.P Admin</h2>
        <p class="text-md text-gray-700 mt-2">Register New Administrator</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-black mb-1"
            >Full Name</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon name="heroicons:user" class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors bg-white text-black"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-black mb-1"
            >Email</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon name="heroicons:envelope" class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors bg-white text-black"
              placeholder="admin@example.com"
            />
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-black mb-1"
            >Password</label
          >

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:lock-closed"
                class="h-5 w-5 text-gray-400"
              />
            </div>

            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors bg-white text-black"
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

        <div>
          <label
            for="adminType"
            class="block text-sm font-medium text-black mb-1"
          >
            Admin Type
          </label>

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon name="heroicons:user" class="h-5 w-5 text-gray-400" />
            </div>

            <select
              id="adminType"
              v-model="formData.type"
              required
              class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors bg-white text-black appearance-none"
            >
              <option value="" disabled selected>Select Admin Type</option>
              <option value="Website">Website</option>
              <option value="Executive">Executive</option>
              <option value="All">All</option>
            </select>

            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:chevron-down"
                class="h-4 w-4 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            for="adminType"
            class="block text-sm font-medium text-black mb-1"
          >
            Role
          </label>

          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Icon name="heroicons:user" class="h-5 w-5 text-gray-400" />
            </div>

            <select
              id="role"
              v-model="formData.role"
              required
              class="block w-full pl-10 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors bg-white text-black appearance-none"
            >
              <option value="" disabled selected>Select Role</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>

            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:chevron-down"
                class="h-4 w-4 text-gray-400"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer items-center"
        >
          <Icon
            name="heroicons:arrow-path"
            v-if="loading"
            width="4"
            height="4"
            class="mr-1 animate-spin"
          />
          {{ loading ? "Creating account..." : "Register Administrator" }}
        </button>

        <div v-if="errorMessage" class="rounded-md bg-red-50 p-3 mt-3">
          <div class="flex">
            <div class="shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm text-red-800">{{ errorMessage }}</h3>
            </div>
          </div>
        </div>

        <div v-if="successMessage" class="rounded-md bg-green-50 p-3 mt-3">
          <div class="flex">
            <div class="shrink-0">
              <svg
                class="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm text-green-800">{{ successMessage }}</h3>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();

const formData = ref({
  name: "",
  email: "",
  password: "",
  type: "",
  role: "",
});

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  formData.value.type = formData.value.type.toLowerCase(); // Ensure type is lowercase
  formData.value.role = formData.value.role.toLowerCase(); // Ensure role is lowercase

  try {
    const response = await $fetch(`${config.public.apiBase}/auth/register`, {
      method: "POST",
      body: formData.value,
    });

    successMessage.value = "Administrator successfully registered!";

    // Clear the form
    formData.value = { name: "", email: "", password: "", type: "", role: "" };
  } catch (error) {
    console.log(error);
    errorMessage.value =
      error.data?.error || "An error occurred during registration.";
  } finally {
    loading.value = false;
  }
};
</script>
