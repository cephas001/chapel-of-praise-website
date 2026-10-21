<template>
  <!--
    Structural shell: CSS Grid on lg+ (`256px | minmax(0, 1fr)`), document
    scroll — no nested h-screen overflow containers. The sidebar is an
    in-flow sticky rail; pages own their sticky save bars (`sticky bottom-0`
    inside the main column), so nothing hardcodes the sidebar width.
  -->
  <div
    class="min-h-dvh bg-canvas text-ink lg:grid lg:grid-cols-[256px_minmax(0,1fr)]"
  >
    <!-- Scrim: mobile drawer only; stays mounted so it can fade both ways -->
    <div
      class="fixed inset-0 z-scrim bg-ink/40 transition-opacity duration-200 ease-out motion-reduce:transition-none lg:hidden"
      :class="isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'"
      aria-hidden="true"
      @click="closeDrawer"
    />

    <!-- Sidebar: off-canvas drawer below lg, sticky rail on lg+ -->
    <aside
      id="admin-sidebar"
      :class="
        isSidebarOpen
          ? 'visible translate-x-0'
          : 'invisible -translate-x-full lg:visible lg:translate-x-0'
      "
      class="fixed inset-y-0 left-0 z-panel flex w-66 max-w-[85vw] flex-col border-r border-line bg-surface transition-[transform,visibility] duration-200 ease-out motion-reduce:transition-none lg:sticky lg:top-0 lg:z-0 lg:h-dvh lg:w-auto lg:max-w-none"
      aria-label="Primary navigation"
    >
      <!-- Brand -->
      <div
        class="flex items-center justify-between gap-2 border-b border-line pt-5 pb-3 pl-5 pr-3"
      >
        <NuxtLink to="/dashboard" class="min-w-0">
          <span class="block text-sm font-semibold tracking-tight text-ink">
            Chapel of Praise
          </span>
          <span class="mt-0.5 block font-mono text-xs font-medium text-muted">
            Admin
          </span>
        </NuxtLink>
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control text-muted transition-colors hover:bg-subtle hover:text-ink lg:hidden"
          aria-label="Close navigation"
          @click="closeDrawer"
        >
          <Icon name="heroicons:x-mark" class="h-5 w-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-3 pb-6">
        <div>
          <AppNavTabLabel v-model="showHelpMenu" label="Dashboard & help" />
          <ul v-show="showHelpMenu" class="space-y-0.5">
            <li>
              <AppNavLink
                text="Dashboard"
                icon-name="heroicons:home"
                url="/dashboard"
                @click="closeDrawer"
                @open-tab="showHelpMenu = true"
              />
            </li>
            <li v-if="canManageOperations">
              <AppNavLink
                text="Quick links"
                icon-name="heroicons:link"
                url="/dashboard/quick-links"
                @click="closeDrawer"
                @open-tab="showHelpMenu = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Help & getting started"
                icon-name="heroicons:question-mark-circle"
                url="/dashboard/help"
                @click="closeDrawer"
                @open-tab="showHelpMenu = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Your profile"
                icon-name="heroicons:user-circle"
                url="/dashboard/profile"
                @click="closeDrawer"
                @open-tab="showHelpMenu = true"
              />
            </li>
          </ul>
        </div>

        <div v-if="canManageWebsite">
          <AppNavTabLabel v-model="showWebManagement" label="Website" />
          <ul v-show="showWebManagement" class="space-y-0.5">
            <li>
              <AppNavLink
                text="Homepage"
                icon-name="heroicons:home"
                url="/website/homepage"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="About page"
                icon-name="heroicons:book-open"
                url="/website/about"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Leadership page"
                icon-name="heroicons:users"
                url="/website/leadership"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Ministries page"
                icon-name="heroicons:building-office"
                url="/website/ministries"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Giving page"
                icon-name="heroicons:hand-raised"
                url="/website/giving"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Contact page"
                icon-name="heroicons:envelope"
                url="/website/contact"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Prayer page"
                icon-name="heroicons:sun"
                url="/website/prayer"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Counseling page"
                icon-name="heroicons:chat-bubble-left-ellipsis"
                url="/website/counseling"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Events calendar"
                icon-name="heroicons:calendar"
                url="/website/events-calendar"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Upload web images"
                icon-name="heroicons:photo"
                url="/website/upload-image"
                @click="closeDrawer"
                @open-tab="showWebManagement = true"
              />
            </li>
          </ul>
        </div>

        <div v-if="canManageOperations">
          <AppNavTabLabel v-model="showEventOversight" label="Events" />
          <ul v-show="showEventOversight" class="space-y-0.5">
            <li>
              <AppNavLink
                text="Events"
                icon-name="heroicons:calendar"
                url="/events"
                @click="closeDrawer"
                @open-tab="showEventOversight = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Unit attendance"
                icon-name="heroicons:clipboard-document-check"
                url="/event-attendance"
                @click="closeDrawer"
                @open-tab="showEventOversight = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Head count"
                icon-name="heroicons:users"
                url="/headcounts"
                @click="closeDrawer"
                @open-tab="showEventOversight = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Altar calls"
                icon-name="heroicons:megaphone"
                url="/altar-calls"
                @click="closeDrawer"
                @open-tab="showEventOversight = true"
              />
            </li>
          </ul>
        </div>

        <div v-if="canManageOperations">
          <AppNavTabLabel v-model="showUnitManagement" label="Units" />
          <ul v-show="showUnitManagement" class="space-y-0.5">
            <li>
              <AppNavLink
                text="Unit members"
                icon-name="heroicons:users"
                url="/members"
                @click="closeDrawer"
                @open-tab="showUnitManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Meeting attendance"
                icon-name="heroicons:clipboard-document-check"
                url="/unit-meetings"
                @click="closeDrawer"
                @open-tab="showUnitManagement = true"
              />
            </li>
            <li v-if="isSuperAdmin">
              <AppNavLink
                text="Executives"
                icon-name="heroicons:user-group"
                url="/executives"
                @click="closeDrawer"
                @open-tab="showUnitManagement = true"
              />
            </li>
          </ul>
        </div>

        <div v-if="canManageOperations">
          <AppNavTabLabel v-model="showEvangelism" label="Evangelism" />
          <ul v-show="showEvangelism" class="space-y-0.5">
            <li>
              <AppNavLink
                text="Follow-up records"
                icon-name="heroicons:megaphone"
                url="/follow-ups"
                @click="closeDrawer"
                @open-tab="showEvangelism = true"
              />
            </li>
          </ul>
        </div>

        <div v-if="canManageOperations">
          <AppNavTabLabel v-model="showDataSummaries" label="Analytics" />
          <ul v-show="showDataSummaries" class="space-y-0.5">
            <li>
              <AppNavLink
                text="Data visualization"
                icon-name="heroicons:chart-bar"
                url="/analytics/visuals"
                @click="closeDrawer"
                @open-tab="showDataSummaries = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Data summaries"
                icon-name="heroicons:presentation-chart-bar"
                url="/analytics/summaries"
                @click="closeDrawer"
                @open-tab="showDataSummaries = true"
              />
            </li>
          </ul>
        </div>

        <div v-if="isSuperAdmin">
          <AppNavTabLabel v-model="showUserManagement" label="Users" />
          <ul v-show="showUserManagement" class="space-y-0.5">
            <li>
              <AppNavLink
                text="Register new user"
                icon-name="heroicons:user-plus"
                url="/auth/register"
                @click="closeDrawer"
                @open-tab="showUserManagement = true"
              />
            </li>
            <li>
              <AppNavLink
                text="Manage users"
                icon-name="heroicons:user-circle"
                url="/users"
                @click="closeDrawer"
                @open-tab="showUserManagement = true"
              />
            </li>
          </ul>
        </div>
      </nav>

      <!-- Account -->
      <div class="border-t border-line p-3">
        <p
          class="truncate px-3 pb-1.5 font-mono text-xs font-medium text-muted"
        >
          {{ auth.user?.email || "Administrator" }}
        </p>
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-subtle hover:text-ink"
          @click="handleLogout"
        >
          <Icon
            name="heroicons:arrow-right-on-rectangle"
            class="h-4 w-4 shrink-0"
          />
          Sign out
        </button>
      </div>
    </aside>

    <!-- Content column -->
    <div class="flex min-w-0 flex-col">
      <!-- Mobile header: 56px, sticky, below scrims so the drawer dims it -->
      <header
        class="sticky top-0 z-chrome flex h-14 items-center gap-1 border-b border-line bg-surface px-4 lg:hidden"
      >
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-control text-ink transition-colors hover:bg-subtle"
          :aria-expanded="isSidebarOpen ? 'true' : 'false'"
          aria-controls="admin-sidebar"
          aria-label="Open navigation"
          @click="isSidebarOpen = true"
        >
          <Icon name="heroicons:bars-3" class="h-5 w-5" />
        </button>
        <NuxtLink to="/dashboard">
          <img
            src="/images/logo-256.webp"
            width="507"
            height="492"
            alt="Chapel of Praise"
            class="invert w-15"
          >
        </NuxtLink>
      </header>

      <main class="min-w-0 flex-1 px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const route = useRoute();

const isSuperAdmin = computed(() => auth.user?.role === "super_admin");

// Mirrors middleware/auth.global.js: super_admin bypasses everything and the
// "all" type has full access, otherwise the exact type grants its section.
const canManageOperations = computed(
  () =>
    isSuperAdmin.value ||
    auth.user?.type === "all" ||
    auth.user?.type === "executive",
);
const canManageWebsite = computed(
  () =>
    isSuperAdmin.value ||
    auth.user?.type === "all" ||
    auth.user?.type === "website",
);

// Accordion states
const showHelpMenu = ref(false);
const showWebManagement = ref(false);
const showEventOversight = ref(false);
const showUnitManagement = ref(false);
const showEvangelism = ref(false);
const showDataSummaries = ref(false);
const showUserManagement = ref(false);

const isSidebarOpen = ref(false);

const closeDrawer = () => {
  isSidebarOpen.value = false;
};

// Navigating anywhere closes the drawer.
watch(() => route.path, closeDrawer);

// Lock background scroll while the drawer is open (mobile only can open it).
watch(isSidebarOpen, (open) => {
  document.documentElement.style.overflow = open ? "hidden" : "";
});

const onKeydown = (event) => {
  if (event.key === "Escape") closeDrawer();
};

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  document.documentElement.style.overflow = "";
});

function handleLogout() {
  closeDrawer();
  auth.logout();
}
</script>
