<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Welcome Header -->
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Admin Overview
        </h2>
        <p class="text-gray-600 text-xs md:text-sm">
          Welcome back, {{ authStore.user?.name?.split(" ")[0] || "Admin" }}.
          Here is what is happening today.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="hidden sm:flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
        >
          <div
            class="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2"
          ></div>
          <span
            class="text-[11px] font-jetbrains font-bold text-gray-600 uppercase tracking-widest"
          >
            System Operational
          </span>
        </div>
      </div>
    </div>

    <!-- Top Stats Row -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
    >
      <div
        v-for="(stat, index) in quickStats"
        :key="index"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 relative overflow-hidden group"
      >
        <div class="flex justify-between items-start mb-4">
          <div
            class="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors"
          >
            <Icon :name="stat.icon" class="h-5 w-5" />
          </div>
          <span
            class="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-jetbrains font-bold tracking-wider"
            :class="
              stat.trend > 0
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-600'
            "
          >
            <Icon
              :name="
                stat.trend > 0
                  ? 'heroicons:arrow-trending-up'
                  : 'heroicons:minus'
              "
              class="h-3 w-3 mr-1"
            />
            {{ Math.abs(stat.trend) }}%
          </span>
        </div>
        <p
          class="text-[11px] font-jetbrains font-bold text-gray-600 uppercase tracking-widest mb-1"
        >
          {{ stat.label }}
        </p>
        <h4 class="text-2xl font-black text-gray-900">
          {{ stat.value }}
        </h4>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Module Navigation -->
      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
            <h3 class="text-sm font-jetbrains font-bold text-black">
              Core Modules
            </h3>
          </div>
          <div class="p-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <NuxtLink
                v-for="module in coreModules"
                :key="module.id"
                :to="module.route"
                class="group flex items-start p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
              >
                <div
                  class="h-10 w-10 rounded-lg border border-gray-100 bg-white flex items-center justify-center shrink-0 shadow-sm group-hover:border-gray-300 transition-colors"
                >
                  <Icon
                    :name="module.icon"
                    class="h-5 w-5 text-gray-600 group-hover:text-black"
                  />
                </div>
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <h4
                      class="text-sm font-bold text-black group-hover:text-black transition-colors"
                    >
                      {{ module.title }}
                    </h4>
                    <Icon
                      name="heroicons:arrow-right"
                      class="h-4 w-4 text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </div>
                  <p class="text-xs text-gray-700 font-medium leading-relaxed">
                    {{ module.description }}
                  </p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Secondary/External Links Preview -->
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col sm:flex-row items-center justify-between p-6"
        >
          <div class="flex items-center gap-4 mb-4 sm:mb-0">
            <div
              class="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0"
            >
              <Icon name="heroicons:link" class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-sm font-jetbrains font-bold text-black mb-1">
                External Tools & Quick Links
              </h3>
              <p class="text-xs text-gray-500">
                Access external services, drive folders and other operational
                tools.
              </p>
            </div>
          </div>
          <button
            @click="navigateTo('/admin/quick-links')"
            class="inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors font-jetbrains shrink-0 w-full sm:w-auto"
          >
            Open Quick Links
          </button>
        </div>
      </div>

      <!-- Right Column: Context & Helpful Info -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Permissions Explainer Panel -->
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <!-- Standardized Card Header -->
          <div
            class="bg-gray-50/50 border-b border-gray-100 px-6 py-5 flex items-center gap-2"
          >
            <Icon name="heroicons:shield-check" class="h-4 w-4 text-gray-400" />
            <h3 class="text-sm font-jetbrains font-bold text-black">
              Access & Permissions
            </h3>
          </div>

          <div class="p-6">
            <p class="text-xs font-medium leading-relaxed text-black mb-6">
              To keep Chapel data secure, your account is configured with
              specific access levels. Here is how it works:
            </p>

            <!-- Scannable Feature List -->
            <ul class="space-y-5 mb-6">
              <li class="flex items-start gap-3">
                <div
                  class="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100"
                >
                  <Icon
                    name="heroicons:lock-closed"
                    class="h-3 w-3 text-gray-600"
                  />
                </div>
                <div>
                  <strong
                    class="text-[11px] font-jetbrains uppercase tracking-widest text-black block mb-1"
                  >
                    Secure Sessions
                  </strong>
                  <p class="text-xs text-gray-700 leading-relaxed font-medium">
                    You must remain actively signed in. Inactive sessions will
                    securely lock you out to protect data.
                  </p>
                </div>
              </li>

              <li class="flex items-start gap-3">
                <div
                  class="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100"
                >
                  <Icon name="heroicons:users" class="h-3 w-3 text-gray-600" />
                </div>
                <div>
                  <strong
                    class="text-[11px] font-jetbrains uppercase tracking-widest text-black block mb-1"
                  >
                    Tailored Access
                  </strong>
                  <p class="text-xs text-gray-700 leading-relaxed font-medium">
                    Your permissions are tied to your role (e.g., Website,
                    Executive). You will only see the tools you need.
                  </p>
                </div>
              </li>

              <li class="flex items-start gap-3">
                <div
                  class="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100"
                >
                  <Icon name="heroicons:star" class="h-3 w-3 text-[#e94e4e]" />
                </div>
                <div>
                  <strong
                    class="text-[11px] font-jetbrains uppercase tracking-widest text-black block mb-1"
                  >
                    Super Admins
                  </strong>
                  <p class="text-xs text-gray-700 leading-relaxed font-medium">
                    Users with Super Admin privileges bypass all restrictions
                    and have full control over the system.
                  </p>
                </div>
              </li>
            </ul>

            <!-- Info Callout -->
            <div class="p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <div class="flex items-start gap-2.5">
                <Icon
                  name="heroicons:information-circle"
                  class="h-4 w-4 text-gray-700 shrink-0 mt-0.5"
                />
                <p class="text-[11px] text-black leading-relaxed font-medium">
                  If you attempt to open a restricted page, you will see a quick
                  alert and be safely redirected back to your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const toast = useAppToast();
const authStore = useAuthStore();

const isFetching = ref(true);

const showDismissToast = () => {
  toast.success("Tip dismissed");
};

const navigateTo = (path) => {
  router.push(path);
};

// --- Mock Data for Dashboard Layout ---

const quickStats = ref([
  { label: "Website Users", value: "-", trend: 0, icon: "heroicons:users" },
  {
    label: "Events This Month",
    value: "-",
    trend: 0,
    icon: "heroicons:calendar-days",
  },
  {
    label: "Recent Responders",
    value: "-",
    trend: 0,
    icon: "heroicons:megaphone",
  },
]);

const coreModules = ref([
  {
    id: "events",
    title: "Event Operations",
    description:
      "Manage upcoming services, special programs, and view historical event data.",
    icon: "heroicons:calendar",
    route: "/events",
  },
  {
    id: "altar-calls",
    title: "Altar Call Records",
    description:
      "Track responses, assign follow-ups, and manage salvation and rededication records.",
    icon: "heroicons:megaphone",
    route: "/altar-calls",
  },
  {
    id: "website",
    title: "Website Content",
    description:
      "Edit the chapel website's pages, update content, and manage media.",
    icon: "heroicons:globe-alt",
    route: "/homepage",
  },

  {
    id: "profile",
    title: "My Profile",
    description:
      "Update your personal details, secure your account, and revoke active sessions.",
    icon: "heroicons:finger-print",
    route: "/dashboard/profile",
  },
]);

// --- Helpers ---
const extractMonth = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", { month: "short" });
};

const extractDay = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", { day: "2-digit" });
};

onMounted(() => {
  // Simulate initial data load
  setTimeout(() => {
    isFetching.value = false;
  }, 600);
});
</script>
