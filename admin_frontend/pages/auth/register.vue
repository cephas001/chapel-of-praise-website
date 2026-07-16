<!-- pages/register.vue -->
<template>
  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Registration
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Register a new administrator and assign their access privileges.
      </p>
    </div>

    <!-- Main Form -->
    <form
      @submit.prevent="handleRegister"
      class="space-y-13 border-t border-gray-200 pt-7"
    >
      <!-- Section 1: Account Details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Account Details
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Provide the personal details, authentication credentials, and system
            roles for the new admin.
          </p>
        </div>

        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
              <label
                for="name"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. John Doe"
              />
            </div>

            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="admin@example.com"
              />
            </div>

            <!-- Password -->
            <div class="md:col-span-2">
              <label
                for="password"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-12 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black focus:outline-none transition-colors"
                >
                  <Icon
                    v-if="!showPassword"
                    name="heroicons:eye"
                    class="h-4 w-4"
                  />
                  <Icon v-else name="heroicons:eye-slash" class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Admin Type -->
            <div>
              <label
                for="adminType"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Admin Type
              </label>
              <div class="relative">
                <select
                  id="adminType"
                  v-model="formData.type"
                  required
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Admin Type</option>
                  <option value="Website">Website</option>
                  <option value="Executive">Executive</option>
                  <option value="All">All</option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
                >
                  <Icon
                    name="heroicons:chevron-down"
                    class="h-4 w-4 text-gray-400"
                  />
                </div>
              </div>
            </div>

            <!-- Role -->
            <div>
              <label
                for="role"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Role
              </label>
              <div class="relative">
                <select
                  id="role"
                  v-model="formData.role"
                  required
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <div
                  class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none"
                >
                  <Icon
                    name="heroicons:chevron-down"
                    class="h-4 w-4 text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Footer -->
      <div
        class="fixed bottom-0 right-0 w-full md:w-[calc(100%-18rem)] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-end z-30"
      >
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center rounded-xl bg-black px-8 py-3 text-xs md:text-sm text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
        >
          <Icon
            v-if="loading"
            name="heroicons:arrow-path"
            class="mr-2 h-4 w-4 animate-spin"
          />
          {{ loading ? "Registering..." : "Register Administrator" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();
const toast = useAppToast(); // Assuming this is auto-imported

definePageMeta({
  accessToSuperAdminOnly: true,
});

const formData = ref({
  name: "",
  email: "",
  password: "",
  type: "",
  role: "",
});

const loading = ref(false);
const showPassword = ref(false);

const handleRegister = async () => {
  loading.value = true;

  // Ensure type and role are normalized before sending
  const payload = {
    ...formData.value,
    type: formData.value.type.toLowerCase(),
    role: formData.value.role.toLowerCase(),
  };

  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/auth/register`,
      {
        method: "POST",
        body: payload,
      },
    );

    toast.success("Administrator successfully registered!");

    // Clear the form on success
    formData.value = { name: "", email: "", password: "", type: "", role: "" };
  } catch (error) {
    console.error(error.data?.error || error);
    toast.error(error.data?.error || "An error occurred during registration.");
  } finally {
    loading.value = false;
  }
};
</script>
