<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
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
            class="hidden sm:flex items-center px-3.5 py-2 border rounded-control transition-colors"
            :class="
              syncBadge.tone === 'error'
                ? 'bg-danger-surface border-danger-line hover:border-danger-text cursor-pointer'
                : 'bg-subtle border-line cursor-default'
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
              class="text-xs font-medium"
              :class="
                syncBadge.tone === 'error' ? 'text-danger-text' : 'text-muted'
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
      <AppCard
        v-for="(stat, index) in quickStats"
        :key="index"
        class="relative overflow-hidden group"
      >
        <div class="mb-4">
          <div
            class="h-10 w-10 rounded-control bg-subtle flex items-center justify-center text-muted group-hover:bg-ink group-hover:text-white transition-colors"
          >
            <Icon :name="stat.icon" class="h-5 w-5" />
          </div>
        </div>
        <p class="text-sm text-muted mb-1">
          {{ stat.label }}
        </p>
        <h4 class="text-2xl font-semibold font-mono text-ink">
          {{ stat.value }}
        </h4>
      </AppCard>
    </div>

    <!-- Main Content Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Module Navigation -->
      <div class="lg:col-span-2 space-y-6">
        <AppCard body-class="p-2">
          <template #header>
            <h3 class="text-base font-semibold text-ink">Core modules</h3>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <NuxtLink
              v-for="module in coreModules"
              :key="module.id"
              :to="module.route"
              class="group flex items-start p-4 rounded-control hover:bg-subtle border border-transparent hover:border-line transition-colors cursor-pointer"
            >
              <div
                class="h-10 w-10 rounded-control border border-line bg-surface flex items-center justify-center shrink-0 group-hover:border-muted transition-colors"
              >
                <Icon
                  :name="module.icon"
                  class="h-5 w-5 text-muted group-hover:text-ink"
                />
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="text-sm font-semibold text-ink">
                    {{ module.title }}
                  </h4>
                  <Icon
                    name="heroicons:arrow-right"
                    class="h-4 w-4 text-line opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition"
                  />
                </div>
                <p class="text-sm text-muted leading-relaxed">
                  {{ module.description }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </AppCard>

        <!-- Secondary/External Links Preview -->
        <AppCard
          v-if="canViewOperations"
          body-class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6"
        >
          <div class="flex items-center gap-4 mb-4 sm:mb-0">
            <div
              class="h-12 w-12 rounded-full bg-subtle border border-line flex items-center justify-center shrink-0"
            >
              <Icon name="heroicons:link" class="h-6 w-6 text-ink" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-ink mb-1">
                External tools & quick links
              </h3>
              <p class="text-sm text-muted">
                Access external services and other tools.
              </p>
            </div>
          </div>
          <AppButton
            variant="secondary"
            class="w-full shrink-0 sm:w-auto"
            @click="navigateTo('/dashboard/quick-links')"
          >
            Open quick links
          </AppButton>
        </AppCard>
      </div>

      <!-- Right Column: Context & Helpful Info -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Permissions Explainer Panel -->
        <AppCard>
          <template #header>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:shield-check" class="h-4 w-4 text-muted" />
              <h3 class="text-base font-semibold text-ink">Permissions</h3>
            </div>
          </template>
          <p class="text-sm text-muted leading-relaxed mb-6">
            Your account has specific access levels to keep data safe. Here is
            how it works:
          </p>

          <!-- Scannable Feature List -->
          <ul class="space-y-5 mb-6">
            <li class="flex items-start gap-3">
              <div
                class="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-subtle flex items-center justify-center border border-line"
              >
                <Icon name="heroicons:lock-closed" class="h-3 w-3 text-muted" />
              </div>
              <div>
                <strong class="text-sm font-semibold text-ink block mb-1">
                  Secure sessions
                </strong>
                <p class="text-sm text-muted leading-relaxed">
                  You must remain actively signed in.
                </p>
              </div>
            </li>

            <li class="flex items-start gap-3">
              <div
                class="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-subtle flex items-center justify-center border border-line"
              >
                <Icon name="heroicons:users" class="h-3 w-3 text-muted" />
              </div>
              <div>
                <strong class="text-sm font-semibold text-ink block mb-1">
                  Tailored access
                </strong>
                <p class="text-sm text-muted leading-relaxed">
                  Your permissions are tied to your role. You will only see the
                  tools you need.
                </p>
              </div>
            </li>
          </ul>

          <!-- Info Callout -->
          <div class="p-4 bg-subtle border border-line rounded-control">
            <div class="flex items-start gap-2.5">
              <Icon
                name="heroicons:information-circle"
                class="h-4 w-4 text-muted shrink-0 mt-0.5"
              />
              <p class="text-xs text-muted leading-relaxed">
                If you attempt to open a restricted page, you will be redirected
                back to your dashboard.
              </p>
            </div>
          </div>
        </AppCard>
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
    return { dot: "bg-success-text", text: "Connected", tone: "idle" };
  }
  if (statsState.value === "loading") {
    return {
      dot: "bg-warning-text animate-pulse",
      text: "Syncing…",
      tone: "idle",
    };
  }
  if (statsState.value === "error") {
    return {
      dot: "bg-danger-text",
      text: "Sync failed — retry",
      tone: "error",
    };
  }
  return { dot: "bg-success-text", text: "Data synced", tone: "idle" };
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
    description: "Manage upcoming services.",
    icon: "heroicons:calendar",
    route: "/events",
  },
  {
    id: "altar-calls",
    access: "operations",
    title: "Altar Call Records",
    description: "Track responses and assign follow-ups.",
    icon: "heroicons:megaphone",
    route: "/altar-calls",
  },
  {
    id: "website",
    access: "website",
    title: "Website Content",
    description: "Edit the chapel website's pages.",
    icon: "heroicons:globe-alt",
    route: "/website/homepage",
  },

  {
    id: "profile",
    access: "always",
    title: "My Profile",
    description: "Update your personal details.",
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
