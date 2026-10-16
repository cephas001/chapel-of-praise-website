<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Welcome Header -->
    <AppHeading
      class="mb-8"
      title="Admin Overview"
      :subtitle="`Welcome back, ${authStore.user?.name?.split(' ')[0] || 'Admin'}. Here is what is happening today.`"
    >
      <template #actions>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="hidden sm:flex items-center px-4 py-2 border rounded-xl transition-colors"
            :class="
              syncBadge.tone === 'error'
                ? 'bg-red-50 border-red-100 hover:bg-red-100 cursor-pointer'
                : 'bg-gray-50 border-gray-200 cursor-default'
            "
            :disabled="syncBadge.tone !== 'error'"
            :title="
              syncBadge.tone === 'idle' && lastSyncedAt
                ? `Last synced at ${lastSyncedAt.toLocaleTimeString()}`
                : ''
            "
            @click="retrySync"
          >
            <div class="h-2 w-2 rounded-full mr-2" :class="syncBadge.dot" />
            <span
              class="text-[11px] font-jetbrains font-bold uppercase tracking-widest"
              :class="
                syncBadge.tone === 'error' ? 'text-red-600' : 'text-gray-600'
              "
            >
              {{ syncBadge.text }}
            </span>
          </button>
        </div>
      </template>
    </AppHeading>

    <!-- Top Stats Row -->
    <div
      v-if="quickStats.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
    >
      <div
        v-for="(stat, index) in quickStats"
        :key="index"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 relative overflow-hidden group"
      >
        <div class="mb-4">
          <div
            class="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors"
          >
            <Icon :name="stat.icon" class="h-5 w-5" />
          </div>
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
        <AppCard body-class="p-2">
          <template #header>
            <h3 class="text-sm font-jetbrains font-bold text-black">
              Core Modules
            </h3>
          </template>
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
        </AppCard>

        <!-- Secondary/External Links Preview -->
        <div
          v-if="canViewOperations"
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
            class="inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 px-5 py-2.5 text-xs text-gray-700 shadow-sm hover:bg-gray-50 transition-colors font-jetbrains shrink-0 w-full sm:w-auto"
            @click="navigateTo('/dashboard/quick-links')"
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
            <Icon name="heroicons:shield-check" class="h-4 w-4 text-gray-500" />
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
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const toast = useAppToast();
const authStore = useAuthStore();
const config = useRuntimeConfig();

const isFetching = ref(true);

const navigateTo = (path) => {
  router.push(path);
};

// Operations data is only readable by executive-type accounts.
const canViewOperations = computed(() => {
  const role = authStore.user?.role;
  const type = authStore.user?.type;
  return role === "super_admin" || type === "all" || type === "executive";
});

const canAccessWebsite = computed(() => {
  const role = authStore.user?.role;
  const type = authStore.user?.type;
  return role === "super_admin" || type === "all" || type === "website";
});

const quickStats = ref([]);

// Real sync state for the header badge: loading → online | error
const statsState = ref("loading");
const lastSyncedAt = ref(null);

const syncBadge = computed(() => {
  if (!canViewOperations.value) {
    return { dot: "bg-green-500", text: "Connected", tone: "idle" };
  }
  if (statsState.value === "loading") {
    return {
      dot: "bg-amber-400 animate-pulse",
      text: "Syncing...",
      tone: "idle",
    };
  }
  if (statsState.value === "error") {
    return { dot: "bg-red-500", text: "Sync Failed — Retry", tone: "error" };
  }
  return { dot: "bg-green-500", text: "Data Synced", tone: "idle" };
});

const isInCurrentMonth = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const loadStats = async () => {
  statsState.value = "loading";
  try {
    const [events, headcounts, followUps] = await Promise.all([
      $fetch(`${config.public.apiBase}/admin/events`),
      $fetch(`${config.public.apiBase}/admin/headcounts`),
      $fetch(`${config.public.apiBase}/admin/follow-ups`),
    ]);

    const eventsThisMonth = events.filter((event) =>
      isInCurrentMonth(event.eventDate),
    );

    const attendanceThisMonth = headcounts
      .filter(
        (hc) => hc.eventDetails && isInCurrentMonth(hc.eventDetails.eventDate),
      )
      .reduce((sum, hc) => sum + headcountTotal(hc), 0);

    const pendingFollowUps = followUps.filter(
      (followUp) => followUp.status === "Pending",
    );

    quickStats.value = [
      {
        label: "Events This Month",
        value: eventsThisMonth.length,
        icon: "heroicons:calendar-days",
      },
      {
        label: "Attendance This Month",
        value: attendanceThisMonth,
        icon: "heroicons:user-group",
      },
      {
        label: "Pending Follow-ups",
        value: pendingFollowUps.length,
        icon: "heroicons:megaphone",
      },
    ];

    lastSyncedAt.value = new Date();
    statsState.value = "online";
  } catch (error) {
    console.error("Failed to load dashboard statistics:", error);
    toast.error("Could not load dashboard statistics.");
    statsState.value = "error";
  }
};

const retrySync = () => {
  if (statsState.value !== "error") return;
  loadStats();
};

const allModules = [
  {
    id: "events",
    access: "operations",
    title: "Event Operations",
    description:
      "Manage upcoming services, special programs, and view historical event data.",
    icon: "heroicons:calendar",
    route: "/events",
  },
  {
    id: "altar-calls",
    access: "operations",
    title: "Altar Call Records",
    description:
      "Track responses, assign follow-ups, and manage salvation and rededication records.",
    icon: "heroicons:megaphone",
    route: "/altar-calls",
  },
  {
    id: "website",
    access: "website",
    title: "Website Content",
    description:
      "Edit the chapel website's pages, update content, and manage media.",
    icon: "heroicons:globe-alt",
    route: "/website/homepage",
  },

  {
    id: "profile",
    access: "always",
    title: "My Profile",
    description:
      "Update your personal details, secure your account, and revoke active sessions.",
    icon: "heroicons:finger-print",
    route: "/dashboard/profile",
  },
];

const coreModules = computed(() =>
  allModules.filter((module) => {
    if (module.access === "operations") return canViewOperations.value;
    if (module.access === "website") return canAccessWebsite.value;
    return true;
  }),
);

onMounted(async () => {
  if (canViewOperations.value) {
    await loadStats();
  } else {
    // Website-only accounts have no stats to sync
    statsState.value = "online";
  }
  isFetching.value = false;
});
</script>
