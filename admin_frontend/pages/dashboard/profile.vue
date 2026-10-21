<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <!-- Page Header -->
    <AppHeading
      class="mb-8"
      title="My profile"
      subtitle="Manage your account settings, security preferences, and administrative access."
    >
      <template #actions>
        <AppButton icon="heroicons:pencil-square" @click="openEditDrawer">
          Edit profile
        </AppButton>
      </template>
    </AppHeading>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Identity Card -->
      <div class="lg:col-span-1 space-y-6">
        <AppCard
          body-class="relative flex flex-col items-center px-8 pt-8 pb-12 text-center"
        >
          <!-- Verification Badge (Absolute Top Right) -->
          <div class="absolute top-4 right-4">
            <span
              v-if="currentUser.email_verified"
              class="inline-flex items-center rounded-badge border border-success-line bg-success-surface px-2.5 py-1 font-mono text-xs font-medium text-success-text"
            >
              Verified
            </span>
            <span
              v-else
              class="inline-flex items-center rounded-badge border border-warning-line bg-warning-surface px-2.5 py-1 font-mono text-xs font-medium text-warning-text"
            >
              Unverified
            </span>
          </div>

          <!-- Avatar -->
          <div
            class="mb-4 mt-6 flex h-24 w-24 items-center justify-center rounded-full border border-line bg-subtle text-muted"
          >
            <span class="p-3 font-mono text-2xl font-semibold text-ink">
              {{ getInitials(currentUser.name) }}
            </span>
          </div>

          <!-- User Details -->
          <h3 class="mb-2 text-base font-semibold text-ink md:text-lg">
            {{ currentUser.name }}
          </h3>
          <p
            class="mb-4 flex items-center justify-center gap-1.5 text-xs font-medium text-muted md:text-sm"
          >
            {{ currentUser.email }}
          </p>

          <!-- Badges Container -->
          <div class="flex flex-wrap items-center justify-center gap-2">
            <!-- Role Badge -->
            <span
              class="inline-flex items-center rounded-badge bg-ink px-3 py-1.5 font-mono text-xs font-medium text-white md:text-xs"
            >
              <Icon
                name="heroicons:shield-check"
                class="mr-1.5 h-4 w-4 text-white/60"
              />
              {{ formatRole(currentUser.role) }}
            </span>

            <!-- Access Type Badge -->
            <span
              class="inline-flex items-center rounded-badge border border-line bg-surface px-3 py-1.5 font-mono text-xs font-medium text-ink md:text-xs"
            >
              <Icon
                name="heroicons:server-stack"
                class="mr-1.5 h-4 w-4 text-muted"
              />
              {{ formatType(currentUser.type) }} access
            </span>
          </div>
        </AppCard>
      </div>

      <!-- Right Column: Details & Security -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Account Details Section -->
        <AppCard body-class="p-0">
          <template #header>
            <h3 class="text-base font-semibold text-ink">
              Security & authentication
            </h3>
          </template>

          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <!-- User ID (Masked/Read-Only) -->
              <div>
                <span
                  class="block text-xs font-medium text-muted mb-2"
                >
                  Account ID (UID)
                </span>
                <div
                  class="flex items-center justify-between bg-subtle border border-line rounded-control px-4 py-2.5"
                >
                  <span
                    class="text-xs font-mono text-ink truncate mr-3"
                  >
                    {{ maskUID(currentUser.uid) }}
                  </span>
                  <button
                    class="text-muted hover:text-ink transition-colors"
                    title="Copy UID"
                    aria-label="Copy account ID"
                    @click="copyToClipboard(currentUser.uid)"
                  >
                    <Icon name="heroicons:clipboard-document" class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Sign In Provider -->
              <div>
                <span
                  class="block text-xs font-medium text-muted mb-2"
                >
                  Sign-in provider
                </span>
                <div
                  class="flex items-center bg-subtle border border-line rounded-control px-4 py-2.5"
                >
                  <Icon
                    :name="
                      getProviderIcon(currentUser.firebase.sign_in_provider)
                    "
                    class="h-4 w-4 text-muted mr-2"
                  />
                  <span class="text-xs text-ink capitalize">
                    {{ currentUser.firebase.sign_in_provider }}
                  </span>
                </div>
              </div>

              <!-- Last authenticated -->
              <div>
                <span
                  class="block text-xs font-medium text-muted mb-2"
                >
                  Last authenticated
                </span>
                <p class="text-xs md:text-sm font-mono text-ink mt-1">
                  {{ formatUnixTime(currentUser.auth_time) }}
                </p>
              </div>

              <!-- Session expiry -->
              <div>
                <span
                  class="block text-xs font-medium text-muted mb-2"
                >
                  Session expiry
                </span>
                <p class="text-xs md:text-sm font-mono text-ink mt-1">
                  {{ formatUnixTime(currentUser.exp) }}
                </p>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Quick Actions Section -->
        <AppCard body-class="p-0">
          <template #header>
            <h3 class="text-base font-semibold text-ink">
              Account actions
            </h3>
          </template>

          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Password Reset -->
              <button
                class="group flex flex-col items-start rounded-surface border border-line bg-surface p-4 text-left transition-colors hover:border-ink"
                @click="initiatePasswordReset"
              >
                <div
                  class="mb-3 flex h-8 w-8 items-center justify-center rounded-control bg-subtle text-muted transition-colors group-hover:bg-ink group-hover:text-white"
                >
                  <Icon name="heroicons:key" class="h-4 w-4" />
                </div>
                <h4 class="mb-2 text-sm font-semibold text-ink">
                  Change password
                </h4>
                <p class="text-xs leading-relaxed text-muted">
                  Receive a secure link to update your current account password.
                </p>
              </button>

              <!-- Verify email -->
              <button
                v-if="!currentUser.email_verified"
                class="group flex flex-col items-start rounded-surface border border-line bg-surface p-4 text-left transition-colors hover:border-ink"
                @click="initiateEmailVerification"
              >
                <div
                  class="mb-3 flex h-8 w-8 items-center justify-center rounded-control bg-subtle text-muted transition-colors group-hover:bg-ink group-hover:text-white"
                >
                  <Icon name="heroicons:envelope" class="h-4 w-4" />
                </div>
                <h4 class="mb-2 text-sm font-semibold text-ink">
                  Verify email address
                </h4>
                <p class="text-xs leading-relaxed text-muted">
                  Send a verification link to your email to confirm your account
                  ownership.
                </p>
              </button>
            </div>
          </div>
        </AppCard>
      </div>
    </div>

    <!-- Edit Profile Drawer -->
    <SlideOver
      :is-open="isEditDrawerOpen"
      title="Edit Profile"
      @close="closeEditDrawer"
    >
      <form
        class="space-y-6 p-1"
        @submit.prevent="submitProfileUpdate"
      >
        <div>
          <label
            for="profile-name"
            class="block text-xs font-medium text-ink mb-2"
          >
            Full Name
          </label>
          <input
            id="profile-name"
            v-model="editFormData.name"
            type="text"
            required
            class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          >
        </div>

        <div>
          <label
            for="profile-email"
            class="block text-xs font-medium text-ink mb-2"
          >
            Email Address
          </label>
          <input
            id="profile-email"
            v-model="editFormData.email"
            type="email"
            required
            disabled
            class="w-full cursor-not-allowed rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-muted outline-none md:text-sm"
          >
          <p class="mt-1.5 text-xs font-mono text-muted">
            Email cannot be changed directly. Contact support for assistance.
          </p>
        </div>

        <div class="border-t border-line pt-6">
          <AppButton
            type="submit"
            size="lg"
            class="w-full"
            :loading="isSubmittingUpdate"
          >
            {{ isSubmittingUpdate ? "Saving…" : "Save profile" }}
          </AppButton>
        </div>
      </form>
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "@/stores/auth";
import { useConfirm } from "@/composables/useConfirm";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast();
const confirm = useConfirm();

// State
const isFetching = ref(true);
const isEditDrawerOpen = ref(false);
const isSubmittingUpdate = ref(false);

// Base current user object structure
const currentUser = ref({
  name: "",
  role: "admin",
  type: "website",
  iss: "",
  aud: "",
  auth_time: 0,
  user_id: "",
  sub: "",
  iat: 0,
  exp: 0,
  email: "",
  email_verified: false,
  firebase: { identities: { email: [] }, sign_in_provider: "password" },
  uid: "",
});

const editFormData = ref({
  name: "",
  email: "",
});

// --- Formatting Helpers ---

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
};

const formatRole = (role) => {
  if (!role) return "User";
  return role.replace(/_/g, " ");
};

const formatType = (type) => {
  if (!type) return "Website";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const maskUID = (uid) => {
  if (!uid || uid.length < 8) return uid;
  return `${uid.substring(0, 4)}••••••••${uid.substring(uid.length - 4)}`;
};

const formatUnixTime = (timestamp) => {
  if (!timestamp) return "—";
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getProviderIcon = (provider) => {
  const map = {
    password: "heroicons:key",
    "google.com": "heroicons:globe-alt",
    "github.com": "heroicons:code-bracket",
  };
  return map[provider] || "heroicons:finger-print";
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Account ID copied to clipboard.");
  } catch (err) {
    console.error("Failed to copy", err);
    toast.error("Failed to copy Account ID.");
  }
};

// --- Data Fetching ---

const fetchUserProfile = async () => {
  isFetching.value = true;
  try {
    // Assuming authStore.user.id holds the currently logged-in user's ID
    const uid = authStore.user?.id;
    if (!uid) {
      toast.error("User ID not found. Please log in again.");
      return await navigateTo("/login");
    }

    const response = await $fetch(
      `${config.public.apiBase}/admin/auth/${uid}`,
      {
        method: "GET",
      },
    );

    // Merge the backend response with the existing structure
    currentUser.value = {
      ...currentUser.value,
      ...response,
      // Pulling auth_time and exp from authStore if not provided by the profile endpoint
      auth_time: authStore.user?.auth_time || currentUser.value.auth_time,
      exp: authStore.user?.exp || currentUser.value.exp,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast.error("Could not load your profile. Please refresh the page.");
  } finally {
    isFetching.value = false;
  }
};

onMounted(() => {
  fetchUserProfile();
});

// --- Actions ---

const initiatePasswordReset = async () => {
  const answer = await confirm.ask({
    title: "Reset Password",
    message:
      "Are you sure you want to request a password reset? A secure link will be sent to your email.",
    confirmText: "Send Link",
    cancelText: "Cancel",
    isDestructive: false,
  });

  if (answer) {
    try {
      const auth = await authStore.ensureFirebase();
      await sendPasswordResetEmail(auth, currentUser.value.email);
      toast.success("Password reset instructions have been emailed to you.");
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      toast.error("Failed to send password reset link.");
    }
  }
};

const initiateEmailVerification = async () => {
  const answer = await confirm.ask({
    title: "Verify Email Address",
    message: "This will send a verification link to your email. Proceed?",
    confirmText: "Send Link",
    cancelText: "Cancel",
    isDestructive: false,
  });

  if (answer) {
    try {
      const auth = await authStore.ensureFirebase();
      if (!auth.currentUser) {
        throw new Error("No authenticated user found");
      }
      await sendEmailVerification(auth.currentUser);
      toast.success("A verification link has been sent to your email.");
    } catch (error) {
      console.error("Failed to send verification email:", error);
      toast.error("Failed to send verification email.");
    }
  }
};

// --- Drawer Handling & Updates ---

const openEditDrawer = () => {
  editFormData.value.name = currentUser.value.name;
  editFormData.value.email = currentUser.value.email;
  isEditDrawerOpen.value = true;
};

const closeEditDrawer = () => {
  isEditDrawerOpen.value = false;
};

const submitProfileUpdate = async () => {
  isSubmittingUpdate.value = true;
  try {
    const payload = {
      name: editFormData.value.name,
      // Note: We don't send the email here because it is disabled in the form
    };

    const response = await $fetch(
      `${config.public.apiBase}/admin/auth/profile`,
      {
        method: "PUT",
        body: payload,
      },
    );

    // Keep local state, the Pinia store, and the persisted cookie in sync
    currentUser.value.name = response.user.name;
    authStore.updateUserName(response.user.name);

    toast.success("Your profile information has been successfully saved.");
    closeEditDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(error.data?.error || "Could not update profile information.");
  } finally {
    isSubmittingUpdate.value = false;
  }
};
</script>
