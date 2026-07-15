<template>
  <div
    class="flex h-screen w-full bg-[#f9f9f9] text-[#1b1b1b] antialiased overflow-hidden font-poppins relative"
  >
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 z-70 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
    ></div>

    <header
      class="md:hidden flex justify-between items-center px-4 w-full bg-white border-b border-gray-200 absolute top-0 h-14 z-60"
    >
      <div class="flex items-center justify-between w-full gap-3">
        <button
          @click="isSidebarOpen = true"
          class="p-2 text-black hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center"
        >
          <Icon name="heroicons:bars-3" class="h-5 w-5" />
        </button>
        <div class="pr-2">
          <img
            src="/coplogo.jpg"
            alt="Logo"
            class="h-8 w-8 md:hidden rounded-md"
          />
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
        @click="isSidebarOpen = false"
        class="md:hidden absolute top-4 right-4 pr-2 py-2 text-gray-800 transition-colors flex items-center justify-between w-full pl-10"
      >
        <div class="">
          <img
            src="/coplogo.jpg"
            alt="Logo"
            class="h-8 w-8 md:hidden rounded-md"
          />
        </div>
        <Icon name="heroicons:x-mark" class="h-6 w-6" />
      </button>

      <div class="flex-1 overflow-y-auto overflow-x-hidden px-4 sidebar-scroll">
        <div class="space-y-6 pb-8 pt-12 pl-2">
          <div>
            <AppNavTabLabel v-model="showHelpMenu" label="Dashboard & Help" />
            <ul v-show="showHelpMenu" class="space-y-1 mt-2">
              <AppNavLink
                text="Dashboard"
                iconName="heroicons:home"
                url="/dashboard"
                @click="closeOnMobile"
                @open-tab="showHelpMenu = true"
              />
              <AppNavLink
                text="Help & Support"
                iconName="heroicons:question-mark-circle"
                url="/dashboard/help"
                @click="closeOnMobile"
                @open-tab="showHelpMenu = true"
              />
            </ul>
          </div>

          <div>
            <AppNavTabLabel
              v-model="showWebManagement"
              label="Website Management"
            />
            <ul v-show="showWebManagement" class="space-y-1 mt-2">
              <AppNavLink
                text="Homepage"
                iconName="heroicons:home"
                url="/website/homepage"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="About Page"
                iconName="heroicons:book-open"
                url="/website/about"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Leadership Page"
                iconName="heroicons:users"
                url="/website/leadership"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Ministries Page"
                iconName="heroicons:building-office"
                url="/website/ministries"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Giving Page"
                iconName="heroicons:hand-raised"
                url="/website/giving"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Contact Page"
                iconName="heroicons:envelope"
                url="/website/contact"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Prayer Page"
                iconName="heroicons:sun"
                url="/website/prayer"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Counseling Page"
                iconName="heroicons:chat-bubble-left-ellipsis"
                url="/website/counseling"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
              <AppNavLink
                text="Events Page"
                iconName="heroicons:calendar"
                url="/website/events-calendar"
                @click="closeOnMobile"
                @open-tab="showWebManagement = true"
              />
            </ul>
          </div>

          <div>
            <AppNavTabLabel
              v-model="showEventOversight"
              label="Event Oversight"
            />
            <ul v-show="showEventOversight" class="space-y-1 mt-2">
              <AppNavLink
                text="Events"
                iconName="heroicons:calendar"
                url="/events"
                @click="closeOnMobile"
                @open-tab="showEventOversight = true"
              />
              <AppNavLink
                text="Unit Attendance"
                iconName="heroicons:clipboard-document-check"
                url="/event-attendance"
                @click="closeOnMobile"
                @open-tab="showEventOversight = true"
              />
              <AppNavLink
                text="Head Count"
                iconName="heroicons:users"
                url="/headcounts"
                @click="closeOnMobile"
                @open-tab="showEventOversight = true"
              />
              <AppNavLink
                text="Altar Calls"
                iconName="heroicons:megaphone"
                url="/altar-calls"
                @click="closeOnMobile"
                @open-tab="showEventOversight = true"
              />
            </ul>
          </div>

          <div>
            <AppNavTabLabel
              v-model="showUnitManagement"
              label="Unit Management"
            />
            <ul v-show="showUnitManagement" class="space-y-1 mt-2">
              <AppNavLink
                text="Unit Members"
                iconName="heroicons:users"
                url="/members"
                @click="closeOnMobile"
                @open-tab="showUnitManagement = true"
              />
              <AppNavLink
                text="Meeting Attendance"
                iconName="heroicons:clipboard-document-check"
                url="/unit-meetings"
                @click="closeOnMobile"
                @open-tab="showUnitManagement = true"
              />
              <!-- <AppNavLink
                text="Executives"
                iconName="heroicons:user-group"
                url="/executives"
                @click="closeOnMobile"
              /> -->
            </ul>
          </div>

          <div>
            <AppNavTabLabel v-model="showEvangelism" label="Evangelism" />
            <ul v-show="showEvangelism" class="space-y-1 mt-2">
              <AppNavLink
                text="Follow-up Records"
                iconName="heroicons:megaphone"
                url="/follow-ups"
                @click="closeOnMobile"
                @open-tab="showEvangelism = true"
              />
            </ul>
          </div>

          <div>
            <AppNavTabLabel
              v-model="showDataSummaries"
              label="Data Inference"
            />
            <ul v-show="showDataSummaries" class="space-y-1 mt-2">
              <AppNavLink
                text="Data Visualization"
                iconName="heroicons:chart-bar"
                url="/analytics/visuals"
                @click="closeOnMobile"
                @open-tab="showDataSummaries = true"
              />
              <AppNavLink
                text="Data Summaries"
                iconName="heroicons:presentation-chart-bar"
                url="/analytics/summaries"
                @click="closeOnMobile"
                @open-tab="showDataSummaries = true"
              />
            </ul>
          </div>
        </div>
      </div>

      <div
        class="border-t border-gray-100 py-4 mt-auto flex items-center justify-between px-6"
      >
        <p class="text-xs text-black truncate">
          {{ auth.user?.email || "Administrator" }}
        </p>

        <button
          @click="handleLogout"
          class="transition-colors duration-200 font-montserrat text-sm font-bold text-black flex items-center"
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

    <ForbiddenModal />
    <AlertModal />
    <ConfirmModal />
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
// Assuming you have components like AppNavLink and AppNavTabLabel registered globally or imported here

const auth = useAuthStore();

// Accordion states
const showEventOversight = ref(false);
const showUnitManagement = ref(false);
const showEvangelism = ref(false);
const showDataSummaries = ref(false);
const showWebManagement = ref(false);
const showHelpMenu = ref(false);

const isSidebarOpen = ref(false);

const closeOnMobile = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};

const userInitial = computed(() => {
  if (auth.user?.email) {
    return auth.user.email.charAt(0).toUpperCase();
  }
  return "A"; // Default to 'A' for Administrator
});

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
