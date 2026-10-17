<!-- pages/register.vue -->
<template>
  <div class="relative min-h-screen pt-5">
    <AppHeading
      class="mb-8"
      title="Registration"
      subtitle="Register a new administrator and assign their access privileges."
    />

    <!-- Main Form -->
    <form
      class="space-y-13 border-t border-line pt-7"
      @submit.prevent="handleRegister"
    >
      <!-- Section 1: Account Details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Account Details
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Provide the personal details, authentication credentials, and system
            roles for the new admin.
          </p>
        </div>

        <AppCard
          class="md:col-span-2" body-class="p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
              <label
                for="name"
                class="block text-xs font-medium text-ink mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. John Doe"
              >
            </div>

            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-xs font-medium text-ink mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="admin@example.com"
              >
            </div>

            <!-- Password -->
            <div class="md:col-span-2">
              <label
                for="password"
                class="block text-xs font-medium text-ink mb-2"
              >
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="8"
                  :aria-invalid="errors.password ? 'true' : 'false'"
                  aria-describedby="password-hint password-error"
                  class="w-full rounded-control border bg-subtle px-4 py-2.5 pr-12 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                  :class="
                    errors.password ? 'border-danger-text' : 'border-line'
                  "
                  placeholder="••••••••"
                >
                <button
                  type="button"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-muted hover:text-ink focus:outline-none transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <Icon
                    v-if="!showPassword"
                    name="heroicons:eye"
                    class="h-4 w-4"
                  />
                  <Icon v-else name="heroicons:eye-slash" class="h-4 w-4" />
                </button>
              </div>
              <p id="password-hint" class="text-xs text-muted mt-1.5">
                At least 8 characters.
              </p>
              <p
                v-if="errors.password"
                id="password-error"
                role="alert"
                class="text-xs text-danger-text font-medium mt-1.5"
              >
                {{ errors.password }}
              </p>
            </div>

            <!-- Confirm Password -->
            <div class="md:col-span-2">
              <label
                for="confirm-password"
                class="block text-xs font-medium text-ink mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                v-model="formData.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                :aria-invalid="errors.confirmPassword ? 'true' : 'false'"
                aria-describedby="confirm-password-error"
                class="w-full rounded-control border bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                :class="
                  errors.confirmPassword ? 'border-danger-text' : 'border-line'
                "
                placeholder="••••••••"
              >
              <p
                v-if="errors.confirmPassword"
                id="confirm-password-error"
                role="alert"
                class="text-xs text-danger-text font-medium mt-1.5"
              >
                {{ errors.confirmPassword }}
              </p>
            </div>

            <!-- Admin Type -->
            <div>
              <label
                for="adminType"
                class="block text-xs font-medium text-ink mb-2"
              >
                Admin Type
              </label>
              <div class="relative">
                <select
                  id="adminType"
                  v-model="formData.type"
                  required
                  class="w-full appearance-none cursor-pointer rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
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
                    class="h-4 w-4 text-muted"
                  />
                </div>
              </div>
            </div>

            <!-- Role -->
            <div>
              <label
                for="role"
                class="block text-xs font-medium text-ink mb-2"
              >
                Role
              </label>
              <div class="relative">
                <select
                  id="role"
                  v-model="formData.role"
                  required
                  class="w-full appearance-none cursor-pointer rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
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
                    class="h-4 w-4 text-muted"
                  />
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Sticky save bar: stays in flow at the end of the form and pins to
           the viewport bottom while the form is in view. Negative margins
           mirror main's padding (layout/default.vue) so the bar bleeds to
           the column edges without width calculations. -->
      <div
        class="sticky bottom-0 z-sticky -mx-4 -mb-5 mt-6 flex items-center justify-end gap-3 border-t border-line bg-surface/90 px-4 py-3 backdrop-blur-md md:-mx-6 md:-mb-6 md:px-6 lg:-mx-8 lg:-mb-8 lg:px-8"
      >
        <AppButton type="submit" size="lg" :loading="loading">
          {{ loading ? "Registering…" : "Register administrator" }}
        </AppButton>
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
  confirmPassword: "",
  type: "",
  role: "",
});

const errors = ref({ password: "", confirmPassword: "" });
const loading = ref(false);
const showPassword = ref(false);

const validateForm = () => {
  errors.value = { password: "", confirmPassword: "" };

  if (formData.value.password.length < 8) {
    errors.value.password = "Password must be at least 8 characters long.";
  }
  if (formData.value.confirmPassword !== formData.value.password) {
    errors.value.confirmPassword = "Passwords do not match.";
  }

  return !errors.value.password && !errors.value.confirmPassword;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  loading.value = true;

  // Ensure type and role are normalized before sending
  const payload = {
    name: formData.value.name,
    email: formData.value.email,
    password: formData.value.password,
    type: formData.value.type.toLowerCase(),
    role: formData.value.role.toLowerCase(),
  };

  try {
    await $fetch(`${config.public.apiBase}/admin/auth/register`, {
      method: "POST",
      body: payload,
    });

    toast.success("Administrator successfully registered!");

    // Clear the form on success
    formData.value = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      type: "",
      role: "",
    };
    errors.value = { password: "", confirmPassword: "" };
  } catch (error) {
    console.error(error.data?.error || error);
    toast.error(error.data?.error || "An error occurred during registration.");
  } finally {
    loading.value = false;
  }
};
</script>
