<template>
  <div
    class="flex h-screen w-full bg-[#f9f9f9] text-[#1b1b1b] antialiased overflow-hidden font-poppins relative"
  >
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-70 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
      aria-hidden="true"
      @click="isSidebarOpen = false"
    />

    <header
      class="md:hidden flex justify-between items-center px-4 w-full bg-white border-b border-gray-200 absolute top-0 h-14 z-60"
    >
      <div class="flex items-center justify-between w-full gap-3">
        <button
          aria-label="Open navigation menu"
          class="p-2 text-black hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
          @click="isSidebarOpen = true"
        >
          <Icon name="heroicons:bars-3" class="h-5 w-5" />
        </button>
        <div class="pr-2">
          <NuxtLink to="/dashboard" aria-label="Go to dashboard">
            <img
              src="@/assets/images/Chapel Of Praise Logo.png"
              alt="Chapel of Praise logo"
              class="w-15 md:hidden rounded-md invert"
            >
          </NuxtLink>
        </div>
      </div>
    </header>

    <aside
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed md:relative top-0 left-0 z-80 flex flex-col justify-between pt-6 md:pt-8 bg-white border-r border-gray-200 w-72 h-screen flex-shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0',
      ]"
      style="will-change: transform"
    >
      <button
        aria-label="Close navigation menu"
        class="md:hidden absolute top-4 right-4 pr-2 py-2 text-gray-800 transition-colors flex items-center justify-end w-full pl-10"
        @click="isSidebarOpen = false"
      >
        <Icon name="heroicons:x-mark" class="h-6 w-6" />
      </button>

      <div class="flex-1 overflow-y-auto overflow-x-hidden px-4 sidebar-scroll">
        <div class="space-y-6 pb-8 pt-8 pl-2">
          <div>
            <AppNavTabLabel v-model="showHelpMenu" label="Dashboard & Help" />
            <ul v-show="showHelpMenu" class="space-y-1 mt-2">
              <AppNavLink
                text="Dashboard"
                icon-name="heroicons:home"
                url="/dashboard"
                @click="closeOnMobile"
                @open-tab="showHelpMenu = true"
              />
              <AppNavLink
                v-if="canManageOperations"
                text="Quick Links"
                icon-name="heroicons:link"
                url="/dashboard/quick-links"
                @click="closeOnMobile"
                @open-tab="showHelpMenu = true"
              />
              <AppNavLink
                text="Help & Support"
                icon-name="heroicons:question-mark-circle"
                url="/dashboard/help"
                @click="closeOnMobile"
                @open-tab="showHelpMenu = true"
              />
              <AppNavLink
                text="Your Profile"
                icon-name="heroicons:user-circle"
                url="/dashboard/profile"
                @click="closeOnMobile"
                @open-tab="showHelpMenu = true"
              />
            </ul>
          </div>

          <div v-if="canManageWebsite">
            <AppNavTabLabel
              v-model="showWebManagement"
              label="Website Management"
            />
            <ul v-show="showWebManagement" class="space-y-1 mt-2">
              <AppNavLink
                text="Homepage"
                icon-name="heroicons:home"
                url="/website/homepage"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="About Page"
                icon-name="heroicons:book-open"
                url="/website/about"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Leadership Page"
                icon-name="heroicons:users"
                url="/website/leadership"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Ministries Page"
                icon-name="heroicons:building-office"
                url="/website/ministries"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Giving Page"
                icon-name="heroicons:hand-raised"
                url="/website/giving"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Contact Page"
                icon-name="heroicons:envelope"
                url="/website/contact"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Prayer Page"
                icon-name="heroicons:sun"
                url="/website/prayer"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Counseling Page"
                icon-name="heroicons:chat-bubble-left-ellipsis"
                url="/website/counseling"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Events Page"
                icon-name="heroicons:calendar"
                url="/website/events-calendar"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Upload Web Images"
                icon-name="heroicons:photo"
                url="/website/upload-image"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
            </ul>
          </div>

          <div v-if="canManageOperations">
            <AppNavTabLabel
              v-model="showEventOversight"
              label="Event Oversight"
            />
            <ul v-show="showEventOversight" class="space-y-1 mt-2">
              <AppNavLink
                text="Events"
                icon-name="heroicons:calendar"
                url="/events"
                @click="closeOnMobile"
                @open-tab="showEventOversight = true"
              />
              <AppNavLink
                text="Unit Attendance"
                icon-name="heroicons:clipboard-document-check"
                url="/event-attendance"
                @click="closeOnMobile"
                @open-tab="showEventOversight = true"
              />
              <AppNavLink
                text="Head Count"
                icon-name="heroicons:users"
                url="/headcounts"
                @click="closeOnMobile"
                @open-tab="showEventOversight = true"
              />
              <AppNavLink
                text="Altar Calls"
                icon-name="heroicons:megaphone"
                url="/altar-calls"
                @click="closeOnMobile"
                @open-tab="showEventOversight = true"
              />
            </ul>
          </div>

          <div v-if="canManageOperations">
            <AppNavTabLabel
              v-model="showUnitManagement"
              label="Unit Management"
            />
            <ul v-show="showUnitManagement" class="space-y-1 mt-2">
              <AppNavLink
                text="Unit Members"
                icon-name="heroicons:users"
                url="/members"
                @click="closeOnMobile"
                @open-tab="showUnitManagement = true"
              />
              <AppNavLink
                text="Meeting Attendance"
                icon-name="heroicons:clipboard-document-check"
                url="/unit-meetings"
                @click="closeOnMobile"
                @open-tab="showUnitManagement = true"
              />
              <AppNavLink
                v-if="isSuperAdmin"
                text="Executives"
                icon-name="heroicons:user-group"
                url="/executives"
                @click="closeOnMobile"
                @open-tab="showUnitManagement = true"
              />
            </ul>
          </div>

          <div v-if="canManageOperations">
            <AppNavTabLabel v-model="showEvangelism" label="Evangelism" />
            <ul v-show="showEvangelism" class="space-y-1 mt-2">
              <AppNavLink
                text="Follow-up Records"
                icon-name="heroicons:megaphone"
                url="/follow-ups"
                @click="closeOnMobile"
                @open-tab="showEvangelism = true"
              />
            </ul>
          </div>

          <div v-if="canManageOperations">
            <AppNavTabLabel
              v-model="showDataSummaries"
              label="Analytics"
            />
            <ul v-show="showDataSummaries" class="space-y-1 mt-2">
              <AppNavLink
                text="Data Visualization"
                icon-name="heroicons:chart-bar"
                url="/analytics/visuals"
                @click="closeOnMobile"
                @open-tab="showDataSummaries = true"
              />
              <AppNavLink
                text="Data Summaries"
                icon-name="heroicons:presentation-chart-bar"
                url="/analytics/summaries"
                @click="closeOnMobile"
                @open-tab="showDataSummaries = true"
              />
            </ul>
          </div>

          <div v-if="isSuperAdmin">
            <AppNavTabLabel
              v-model="showUserManagement"
              label="User Management"
            />
            <ul v-show="showUserManagement" class="space-y-1 mt-2">
              <AppNavLink
                text="Register New User"
                icon-name="heroicons:user-plus"
                url="/auth/register"
                @click="closeOnMobile"
                @open-tab="showUserManagement = true"
              />
              <AppNavLink
                text="Manage Users"
                icon-name="heroicons:user-circle"
                url="/users"
                @click="closeOnMobile"
                @open-tab="showUserManagement = true"
              />
            </ul>
          </div>
        </div>
      </div>

      <div
        class="border-t border-gray-100 py-4 mt-auto flex items-center justify-between px-6"
      >
        <p class="text-xs text-black truncate font-mono">
          {{ auth.user?.email || "Administrator" }}
        </p>

        <button
          aria-label="Log out"
          class="transition-colors duration-200 font-jetbrains text-sm text-black flex items-center"
          @click="handleLogout"
        >
          <Icon
            name="heroicons:arrow-right-on-rectangle"
            class="h-4 w-4 text-red-600"
          />
        </button>
      </div>
    </aside>

    <main
      class="flex-1 overflow-y-auto bg-[#f9f9f9] p-4 md:p-8 w-full pt-20 md:pt-8 h-screen"
    >
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "~/stores/auth";
// Assuming you have components like AppNavLink and AppNavTabLabel registered globally or imported here

const auth = useAuthStore();

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
const showEventOversight = ref(false);
const showUnitManagement = ref(false);
const showEvangelism = ref(false);
const showDataSummaries = ref(false);
const showWebManagement = ref(false);
const showHelpMenu = ref(false);
const showUserManagement = ref(false);

const isSidebarOpen = ref(false);

const closeOnMobile = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};

function handleLogout() {
  auth.logout();
}
</script>

<style>
/* Thinner, seamless scrollbar */
.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.sidebar-scroll {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
</style>
