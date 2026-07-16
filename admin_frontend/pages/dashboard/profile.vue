<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          My Profile
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Manage your account settings, security preferences, and administrative
          access.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openEditDrawer"
          class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
        >
          <Icon name="heroicons:pencil-square" class="mr-2 h-4 w-4" />
          Edit Profile
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Identity Card -->
      <div class="lg:col-span-1 space-y-6">
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col items-center p-8 text-center relative"
        >
          <!-- Verification Badge (Absolute Top Right) -->
          <div class="absolute top-4 right-4">
            <span
              v-if="currentUser.email_verified"
              class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100"
            >
              Verified
            </span>
            <span
              v-else
              class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100"
            >
              Unverified
            </span>
          </div>

          <!-- Avatar -->
          <div
            class="h-24 w-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 mb-4 shadow-inner mt-6"
          >
            <span class="text-2xl font-black font-jetbrains text-black p-3">
              {{ getInitials(currentUser.name) }}
            </span>
          </div>

          <!-- User Details -->
          <h3 class="text-md md:text-lg font-bold text-gray-900 mb-2">
            {{ currentUser.name }}
          </h3>
          <p
            class="text-xs md:text-sm font-medium text-gray-500 mb-4 flex items-center justify-center gap-1.5"
          >
            {{ currentUser.email }}
          </p>

          <!-- Badges Container -->
          <div class="flex flex-wrap items-center justify-center gap-2">
            <!-- Role Badge -->
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-jetbrains uppercase tracking-widest bg-black text-white shadow-sm"
            >
              <Icon
                name="heroicons:shield-check"
                class="h-4 w-4 mr-1.5 text-gray-300"
              />
              {{ formatRole(currentUser.role) }}
            </span>

            <!-- Access Type Badge -->
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-jetbrains uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
            >
              <Icon
                name="heroicons:server-stack"
                class="h-4 w-4 mr-1.5 text-blue-500"
              />
              {{ formatType(currentUser.type) }} Access
            </span>
          </div>

          <!-- Conditional Action: Verify Email -->
          <div
            v-if="!currentUser.email_verified"
            class="w-full mt-6 pt-6 border-t border-gray-100"
          >
            <button
              @click="sendVerificationEmail"
              :disabled="isSendingVerification"
              class="w-full inline-flex items-center justify-center rounded-lg bg-amber-50 px-4 py-2.5 text-[10px] md:text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors font-jetbrains"
            >
              <Icon
                v-if="isSendingVerification"
                name="heroicons:arrow-path"
                class="mr-2 h-3 w-3 animate-spin"
              />
              <Icon
                v-else
                name="heroicons:paper-airplane"
                class="mr-2 h-3 w-3"
              />
              {{
                isSendingVerification ? "Sending..." : "Send Verification Link"
              }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Details & Security -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Account Details Section -->
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
            <h3 class="text-sm font-jetbrains font-bold text-black">
              Security & Authentication
            </h3>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <!-- User ID (Masked/Read-Only) -->
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-600 uppercase tracking-widest mb-2"
                >
                  Account ID (UID)
                </label>
                <div
                  class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5"
                >
                  <span
                    class="text-xs font-jetbrains text-gray-700 truncate mr-3"
                  >
                    {{ maskUID(currentUser.uid) }}
                  </span>
                  <button
                    @click="copyToClipboard(currentUser.uid)"
                    class="text-gray-400 hover:text-black transition-colors"
                    title="Copy UID"
                  >
                    <Icon name="heroicons:clipboard-document" class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Sign In Provider -->
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-600 uppercase tracking-widest mb-2"
                >
                  Sign-In Provider
                </label>
                <div
                  class="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5"
                >
                  <Icon
                    :name="
                      getProviderIcon(currentUser.firebase.sign_in_provider)
                    "
                    class="h-4 w-4 text-gray-500 mr-2"
                  />
                  <span class="text-xs text-gray-700 capitalize">
                    {{ currentUser.firebase.sign_in_provider }}
                  </span>
                </div>
              </div>

              <!-- Last Authenticated -->
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-600 uppercase tracking-widest mb-2"
                >
                  Last Authenticated
                </label>
                <p class="text-xs md:text-sm font-jetbrains text-gray-900 mt-1">
                  {{ formatUnixTime(currentUser.auth_time) }}
                </p>
              </div>

              <!-- Session Expiry -->
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-600 uppercase tracking-widest mb-2"
                >
                  Session Expiry
                </label>
                <p class="text-xs md:text-sm font-jetbrains text-gray-900 mt-1">
                  {{ formatUnixTime(currentUser.exp) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
            <h3 class="text-sm font-jetbrains font-bold text-black">
              Account Actions
            </h3>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Password Reset -->
              <button
                @click="initiatePasswordReset"
                class="flex flex-col items-start p-4 rounded-xl border border-gray-200 hover:border-black hover:shadow-sm transition-all group text-left bg-white"
              >
                <div
                  class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-black group-hover:text-white transition-colors text-gray-600"
                >
                  <Icon name="heroicons:key" class="h-4 w-4" />
                </div>
                <h4
                  class="text-xs font-jetbrains font-bold text-gray-900 uppercase tracking-wide mb-2"
                >
                  Change Password
                </h4>
                <p class="text-xs text-gray-500 font-medium leading-relaxed">
                  Receive a secure link to update your current account password.
                </p>
              </button>

              <!-- Revoke Sessions -->
              <button
                @click="revokeSessions"
                class="flex flex-col items-start p-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group text-left bg-white"
              >
                <div
                  class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-red-100 group-hover:text-red-600 transition-colors text-gray-600"
                >
                  <Icon name="heroicons:shield-exclamation" class="h-4 w-4" />
                </div>
                <h4
                  class="text-xs font-jetbrains font-bold text-gray-900 group-hover:text-red-700 uppercase tracking-wide mb-2 transition-colors"
                >
                  Revoke Sessions
                </h4>
                <p
                  class="text-xs text-gray-500 group-hover:text-red-600/80 font-medium leading-relaxed transition-colors"
                >
                  Sign out of all active devices immediately if you suspect
                  unauthorized access.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Drawer -->
    <SlideOver
      :is-open="isEditDrawerOpen"
      title="Edit Profile"
      @close="closeEditDrawer"
    >
      <form
        @submit.prevent="submitProfileUpdate"
        class="p-1 font-poppins space-y-6"
      >
        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Full Name
          </label>
          <input
            v-model="editFormData.name"
            type="text"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
          />
        </div>

        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Email Address
          </label>
          <input
            v-model="editFormData.email"
            type="email"
            required
            disabled
            class="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed outline-none text-xs md:text-sm"
          />
          <p class="text-[10px] text-gray-400 mt-1.5 font-jetbrains">
            Email cannot be changed directly. Contact support for assistance.
          </p>
        </div>

        <div class="pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isSubmittingUpdate"
            class="w-full inline-flex items-center justify-center rounded-xl bg-black px-8 py-3.5 text-xs md:text-sm text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
          >
            <Icon
              v-if="isSubmittingUpdate"
              name="heroicons:arrow-path"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isSubmittingUpdate ? "Saving Changes..." : "Save Profile" }}
          </button>
        </div>
      </form>
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "@/stores/auth";
import { useConfirm } from "@/composables/useConfirm";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast();
const confirm = useConfirm();

// State
const isFetching = ref(true);
const isSendingVerification = ref(false);
const isEditDrawerOpen = ref(false);
const isSubmittingUpdate = ref(false);

// Permission check
const isSuperAdmin = computed(() => authStore.user?.role === "super_admin");

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

const sendVerificationEmail = async () => {
  isSendingVerification.value = true;
  try {
    // TODO: Connect to backend endpoint when ready
    // await $fetch(`${config.public.apiBase}/admin/auth/send-verification`, { ... })
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay

    toast.success(
      `A verification link has been sent to ${currentUser.value.email}.`,
    );
  } catch (error) {
    toast.error("Failed to send verification email. Please try again later.");
  } finally {
    isSendingVerification.value = false;
  }
};

const initiatePasswordReset = async () => {
  const answer = await confirm.ask({
    title: "Reset Password",
    message:
      "Are you sure you want to request a password reset? A secure link will be sent to your email.",
    confirmText: "Send Link",
    cancelText: "Cancel",
  });

  if (answer) {
    try {
      // TODO: Connect to backend endpoint when ready
      toast.success("Password reset instructions have been emailed to you.");
    } catch (error) {
      toast.error("Failed to send password reset link.");
    }
  }
};

const revokeSessions = async () => {
  const answer = await confirm.ask({
    title: "Revoke Sessions",
    message:
      "This will forcefully sign you out of all active devices. You will need to log in again. Proceed?",
    confirmText: "Revoke All",
    cancelText: "Cancel",
    isDestructive: true,
  });

  if (answer) {
    try {
      // TODO: Connect to backend endpoint when ready
      toast.success(
        "All active sessions have been terminated. Redirecting to login...",
      );
      // e.g., authStore.logout();
    } catch (error) {
      toast.error("Failed to revoke sessions.");
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
    const uid = currentUser.value.uid;
    const payload = {
      name: editFormData.value.name,
      // Note: We don't send the email here because it is disabled in the form
    };

    const response = await $fetch(
      `${config.public.apiBase}/admin/auth/update/${uid}`,
      {
        method: "PUT",
        body: payload,
      },
    );

    // Optimistically update the UI
    currentUser.value.name = response.user.name;

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
