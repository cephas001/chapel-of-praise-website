<template>
  <div class="flex h-screen bg-gray-50 text-gray-900">
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 z-40 bg-gray-900/50 transition-opacity md:hidden"
    ></div>

    <aside
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
      ]"
    >
      <div
        class="h-16 flex items-center px-6 border-b border-gray-100 shrink-0"
      >
        <h1 class="text-lg font-bold tracking-tight">COP Admin</h1>
        <button
          @click="isSidebarOpen = false"
          class="ml-auto md:hidden text-black hover:text-gray-600 flex items-center"
        >
          <Icon name="heroicons:x-mark" class="h-6 w-6" />
        </button>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <!-- Dashboard -->
        <AppNavLink
          text="Dashboard"
          iconName="heroicons:home"
          url="/"
          @click="isSidebarOpen = false"
        />

        <!-- Web Management -->
        <AppNavTabLabel
          v-model="showWebManagement"
          label="Website Management"
        />

        <div v-show="showWebManagement">
          <AppNavLink
            text="Homepage"
            iconName="heroicons:home"
            url="/pages/homepage"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="About Page"
            iconName="heroicons:information-circle"
            url="/pages/about"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="Leadership Page"
            iconName="heroicons:user-group"
            url="/pages/leadership"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="Ministries Page"
            iconName="heroicons:heart"
            url="/pages/ministries"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="Giving Page"
            iconName="heroicons:banknotes"
            url="/pages/giving"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="Contact Page"
            iconName="heroicons:phone"
            url="/pages/contact"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="Prayer Page"
            iconName="heroicons:sparkles"
            url="/pages/prayer"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="Counseling Page"
            iconName="heroicons:chat-bubble-left-right"
            url="/pages/counseling"
            @click="isSidebarOpen = false"
          />
        </div>

        <!-- Event Oversight -->
        <AppNavTabLabel v-model="showEventOversight" label="Event Oversight" />

        <div v-show="showEventOversight">
          <AppNavLink
            text="Events"
            iconName="heroicons:calendar"
            url="/events"
            @click="isSidebarOpen = false"
          />

          <AppNavLink
            text="Event Unit Attendance"
            iconName="heroicons:clipboard-document-check"
            url="/"
            @click="isSidebarOpen = false"
          />

          <AppNavLink
            text="Event Head Count"
            iconName="heroicons:users"
            url="/"
            @click="isSidebarOpen = false"
          />

          <AppNavLink
            text="Altar Calls"
            iconName="heroicons:megaphone"
            url="/"
            @click="isSidebarOpen = false"
          />
        </div>

        <!-- Unit Management -->
        <AppNavTabLabel v-model="showUnitManagement" label="Unit Management" />

        <div v-show="showUnitManagement">
          <AppNavLink
            text="Unit Members"
            iconName="heroicons:users"
            url="/"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text=" Meeting Attendance"
            iconName="heroicons:clipboard-document-check"
            url="/"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text=" Executives"
            iconName="heroicons:user-group"
            url="/"
            @click="isSidebarOpen = false"
          />
        </div>

        <!-- Evangelism -->
        <AppNavTabLabel v-model="showEvangelism" label="Evangelism" />

        <div v-show="showEvangelism">
          <AppNavLink
            text="Follow-up Records"
            iconName="heroicons:users"
            url="/"
            @click="isSidebarOpen = false"
          />
        </div>

        <!-- Workers in Training -->
        <AppNavTabLabel v-model="showWIT" label="Workers in Training" />

        <div v-show="showWIT">
          <AppNavLink
            text="Trainees"
            iconName="heroicons:academic-cap"
            url="/"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="Training Attendance"
            iconName="heroicons:clipboard-document-check"
            url="/"
            @click="isSidebarOpen = false"
          />
        </div>

        <!-- Special Meetings -->
        <AppNavTabLabel
          v-model="showSpecialMeetings"
          label="Special Meetings"
        />

        <div v-show="showSpecialMeetings">
          <AppNavLink
            text="Special Meetings"
            iconName="heroicons:calendar"
            url="/"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="Meeting Attendance"
            iconName="heroicons:clipboard-document-check"
            url="/"
            @click="isSidebarOpen = false"
          />
        </div>

        <!-- Data Inference -->
        <AppNavTabLabel v-model="showDataSummaries" label="Data Inference" />

        <div v-show="showDataSummaries">
          <AppNavLink
            text="Data Visualization"
            iconName="heroicons:chart-bar"
            url="/"
            @click="isSidebarOpen = false"
          />
          <AppNavLink
            text="Data Summaries"
            iconName="heroicons:presentation-chart-bar"
            url="/"
            @click="isSidebarOpen = false"
          />
        </div>
      </nav>

      <div
        class="p-4 border-t border-gray-100 shrink-0 flex flex-col items-center"
      >
        <div class="flex items-center pb-4 w-full">
          <div
            class="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold"
          >
            {{ userInitial }}
          </div>
          <div class="ml-3 truncate">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ auth.user?.email || "Administrator" }}
            </p>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
        >
          {{ auth.user ? "Logout" : "Login" }}
        </button>

        <NuxtLink
          v-if="auth.user?.role === 'super_admin'"
          to="/auth/register"
          @click="isSidebarOpen = false"
          class="mt-3 text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium cursor-pointer"
        >
          + Add new administrator
        </NuxtLink>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden w-full relative">
      <div
        class="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 h-16 shrink-0"
      >
        <div class="flex items-center">
          <button
            @click="isSidebarOpen = true"
            class="text-black hover:text-gray-900 rounded-md mr-3 cursor-pointer flex items-center"
          >
            <Icon name="heroicons:bars-3" class="h-6 w-6 font-bold" />
          </button>
          <h1 class="text-lg font-bold tracking-tight">COP Admin</h1>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 md:p-8">
        <slot />
      </div>
    </main>

    <ForbiddenModal />
    <AlertModal />
    <ConfirmModal />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();

const showEventOversight = ref(true);
const showUnitManagement = ref(true);
const showEvangelism = ref(true);
const showWIT = ref(true);
const showSpecialMeetings = ref(true);
const showDataSummaries = ref(true);
const showWebManagement = ref(true);

// Track if the mobile sidebar is open
const isSidebarOpen = ref(false);

const userInitial = computed(() => {
  if (auth.user?.email) {
    return auth.user.email.charAt(0).toUpperCase();
  }
  return "R";
});

function handleLogout() {
  auth.logout();
}
</script>
