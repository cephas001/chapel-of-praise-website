<template>
  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Help & Documentation
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          A comprehensive guide to managing the Chapel of Praise system.
        </p>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left Column: Navigation Sidebar -->
      <div class="lg:col-span-1">
        <div
          class="sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
        >
          <div class="bg-gray-50/50 border-b border-gray-100 px-5 py-4">
            <h3
              class="text-xs font-jetbrains font-bold text-black uppercase tracking-widest"
            >
              Topics
            </h3>
          </div>
          <div class="p-2 flex flex-col gap-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'text-left px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors font-jetbrains',
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black',
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Content Area -->
      <div class="lg:col-span-3 space-y-6">
        <!-- SECTION: Architecture & Overview -->
        <div
          v-show="activeTab === 'overview'"
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8 animate-fade-in"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4"
          >
            <div
              class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"
            >
              <Icon
                name="heroicons:server-stack"
                class="h-4 w-4 text-gray-700"
              />
            </div>
            <h2 class="text-sm md:text-md font-bold text-black font-jetbrains">
              System Architecture
            </h2>
          </div>

          <div class="space-y-4 text-xs md:text-sm text-black leading-relaxed">
            <p>
              The Chapel of Praise digital ecosystem is split into three main
              components:
            </p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Admin Frontend:</strong> Built using Nuxt 4, Vue 3,
                Pinia, and Tailwind CSS. It runs as a client-side SPA.
              </li>
              <li>
                <strong>Backend API:</strong> Built on Express 5, utilizing the
                Firebase Admin SDK to interface with Firestore and Firebase
                Auth.
              </li>
              <li>
                <strong>Public Frontend:</strong> A separate Nuxt 4 app that
                makes read-only requests and has no Firebase dependencies.
              </li>
            </ul>

            <h4 class="text-sm font-bold text-black font-jetbrains mt-6 mb-2">
              Content Management (CMS)
            </h4>
            <ul class="list-disc pl-5 space-y-2">
              <li>
                Each public-facing page stores its content in a single Firestore
                document per page.
              </li>
              <li>
                The document ID corresponds directly to the page name (e.g., the
                homepage document is stored in the homepage collection).
              </li>
            </ul>
          </div>
        </div>

        <!-- SECTION: Roles & Permissions -->
        <div
          v-show="activeTab === 'permissions'"
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8 animate-fade-in"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4"
          >
            <div
              class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"
            >
              <Icon
                name="heroicons:shield-check"
                class="h-4 w-4 text-gray-700"
              />
            </div>
            <h2 class="text-sm md:text-md font-bold text-black font-jetbrains">
              Roles & Permissions
            </h2>
          </div>

          <div class="space-y-6 text-xs md:text-sm text-black leading-relaxed">
            <p>
              Access is heavily regulated by two main attributes:
              <strong>Role</strong> and <strong>Type</strong>.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                <h4
                  class="font-jetbrains font-bold text-black mb-2 flex items-center gap-2"
                >
                  <Icon name="heroicons:user" class="h-4 w-4 text-[#e94e4e]" />
                  User Roles
                </h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Admin:</strong> Standard users restricted by their
                    assigned "Type".
                  </li>
                  <li>
                    <strong>Super Admin:</strong> Bypasses all restrictions,
                    accesses all pages, and manages users and executives[cite:
                    1].
                  </li>
                </ul>
              </div>

              <div class="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                <h4
                  class="font-jetbrains font-bold text-black mb-2 flex items-center gap-2"
                >
                  <Icon name="heroicons:tag" class="h-4 w-4 text-blue-500" />
                  Access Types
                </h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Website:</strong> Can view and edit website CMS
                    content.
                  </li>
                  <li>
                    <strong>Executive:</strong> Can manage events, headcounts,
                    altar calls, attendance, and follow-ups.
                  </li>
                  <li>
                    <strong>All:</strong> Possesses both website and executive
                    capabilities, but cannot manage users.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION: Core Workflows -->
        <div
          v-show="activeTab === 'workflows'"
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8 animate-fade-in"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4"
          >
            <div
              class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"
            >
              <Icon
                name="heroicons:arrow-path-rounded-square"
                class="h-4 w-4 text-gray-700"
              />
            </div>
            <h2 class="text-sm md:text-md font-bold text-black font-jetbrains">
              Core Workflows
            </h2>
          </div>

          <div class="space-y-8 text-xs md:text-sm text-black leading-relaxed">
            <!-- Event Lifecycle -->
            <div>
              <h3 class="font-bold text-black text-base mb-3 font-jetbrains">
                The Event Lifecycle
              </h3>
              <p class="mb-4">
                Church executives handle events through a specific sequence:
              </p>

              <div
                class="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200"
              >
                <div
                  class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-black text-white font-bold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10"
                  >
                    1
                  </div>
                  <div
                    class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm"
                  >
                    <h4
                      class="font-bold text-black font-jetbrains text-xs uppercase mb-1"
                    >
                      Create Event
                    </h4>
                    <p class="text-xs">
                      Navigate to Events to define the date, service type, and
                      program specifics.
                    </p>
                  </div>
                </div>

                <div
                  class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-black text-white font-bold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10"
                  >
                    2
                  </div>
                  <div
                    class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm"
                  >
                    <h4
                      class="font-bold text-black font-jetbrains text-xs uppercase mb-1"
                    >
                      Record Headcounts
                    </h4>
                    <p class="text-xs">
                      Navigate to Head Counts to input male/female student and
                      visitor demographics.
                    </p>
                  </div>
                </div>

                <div
                  class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-black text-white font-bold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10"
                  >
                    3
                  </div>
                  <div
                    class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm"
                  >
                    <h4
                      class="font-bold text-black font-jetbrains text-xs uppercase mb-1"
                    >
                      Unit Attendance
                    </h4>
                    <p class="text-xs">
                      Select an event and unit to mark officiating workers as
                      Present or Pardoned.
                    </p>
                  </div>
                </div>

                <div
                  class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-black text-white font-bold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10"
                  >
                    4
                  </div>
                  <div
                    class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-gray-200 bg-gray-50/50 shadow-sm"
                  >
                    <h4
                      class="font-bold text-black font-jetbrains text-xs uppercase mb-1"
                    >
                      Altar Calls & Follow-ups
                    </h4>
                    <p class="text-xs">
                      Record altar calls from the event detail page, input
                      responder details, and track them via Follow-up Records.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Website Content Workflow -->
            <div class="pt-6 border-t border-gray-100">
              <h3 class="font-bold text-black text-sm mb-4 font-jetbrains">
                Updating Website Content
              </h3>
              <ul class="list-disc pl-5 space-y-2 text-xs md:text-sm">
                <li>
                  Navigate to the appropriate CMS page under Website Management.
                </li>
                <li>
                  Edit sections using standard text fields or by adding/removing
                  dynamic array items.
                </li>
                <li>
                  Click "Save Changes" on individual sections or use the sticky
                  "Save All Changes" button at the bottom of the page.
                </li>
              </ul>
            </div>

            <!-- Unit Meeting Attendance -->
            <div class="pt-6 border-t border-gray-100">
              <h3 class="font-bold text-black text-sm mb-4 font-jetbrains">
                Unit Meeting Attendance
              </h3>
              <ul class="list-disc pl-5 space-y-2 text-xs md:text-sm">
                <li>
                  This specific module is used strictly for unit meetings
                  (distinct from events).
                </li>
                <li>
                  Attendance data for these meetings is saved locally to your
                  browser's localStorage.
                </li>
                <li>
                  Because it is local, it does not sync to the backend, and
                  clearing browser data will result in data loss.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- SECTION: Troubleshooting -->
        <div
          v-show="activeTab === 'troubleshooting'"
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8 animate-fade-in"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4"
          >
            <div
              class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"
            >
              <Icon
                name="heroicons:wrench-screwdriver"
                class="h-4 w-4 text-gray-700"
              />
            </div>
            <h2 class="text-sm md:text-md font-bold text-black font-jetbrains">
              Troubleshooting & Edge Cases
            </h2>
          </div>

          <div
            class="space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed"
          >
            <div class="bg-red-50 border border-red-100 rounded-xl p-4">
              <h4
                class="font-bold text-red-700 font-jetbrains text-xs uppercase tracking-widest mb-3"
              >
                Important Limitations
              </h4>
              <ul class="list-disc pl-5 space-y-2 text-red-800/80">
                <li>
                  <strong>No Cascading Deletes:</strong> Deleting an event does
                  not automatically delete its related headcounts, altar calls,
                  attendance records, or follow-ups.
                </li>
                <li>
                  <strong>No Soft Deletes:</strong> The deletion of events and
                  users is permanent; there is no recovery mechanism.
                </li>
              </ul>
            </div>

            <div>
              <h4 class="font-bold text-black font-jetbrains mb-3">
                Common Errors
              </h4>
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-4 py-3 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase"
                      >
                        Error Message
                      </th>
                      <th
                        class="px-4 py-3 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase"
                      >
                        Cause & Resolution
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td class="px-4 py-3 font-medium text-black text-xs">
                        "Session Expired"
                      </td>
                      <td class="px-4 py-3 text-xs">
                        The Firebase ID token has expired; you must log in
                        again.
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-3 font-medium text-black text-xs">
                        "Access Denied"
                      </td>
                      <td class="px-4 py-3 text-xs">
                        Your user role or type does not match the required
                        permissions for the page.
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-3 font-medium text-black text-xs">
                        "Invalid passkey"
                      </td>
                      <td class="px-4 py-3 text-xs">
                        During public worker registration, the passkey entered
                        does not match the record in the unitPasskeys document.
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-3 font-medium text-black text-xs">
                        404 Error (Events)
                      </td>
                      <td class="px-4 py-3 text-xs">
                        The specific Event ID doesn't exist; it may have been
                        deleted. Note: Public content endpoints return empty
                        objects rather than a 404.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 class="font-bold text-black font-jetbrains mb-3">
                Automated Attendance Behavior
              </h4>
              <p class="text-xs md:text-sm">
                If an officiating worker is not manually marked as Present or
                Pardoned, the system automatically computes and flags them as
                Absent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const activeTab = ref("overview");

const tabs = [
  { id: "overview", label: "System Overview" },
  { id: "permissions", label: "Roles & Access" },
  { id: "workflows", label: "Core Workflows" },
  { id: "troubleshooting", label: "Troubleshooting" },
];
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
