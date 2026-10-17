<template>
  <div class="relative min-h-screen pt-5">
    <!-- Page Header -->
    <AppHeading
      class="mb-8"
      title="Help & documentation"
      subtitle="A comprehensive guide to managing the Chapel of Praise system."
    />

    <!-- Main Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Left Column: Navigation Sidebar -->
      <div class="lg:col-span-1">
        <AppCard
          class="sticky top-24" body-class="p-0"
        >
          <div class="bg-subtle/60 border-b border-line px-5 py-4">
            <h3
              class="text-xs font-mono font-semibold text-ink"
            >
              Topics
            </h3>
          </div>
          <div class="p-2 flex flex-col gap-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'text-left rounded-control px-4 py-2.5 text-xs font-medium transition-colors md:text-sm',
                activeTab === tab.id
                  ? 'bg-ink text-white'
                  : 'text-muted hover:bg-subtle hover:text-ink',
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </AppCard>
      </div>

      <!-- Right Column: Content Area -->
      <div class="lg:col-span-3 space-y-6">
        <!-- SECTION: Architecture & Overview -->
        <AppCard
          v-show="activeTab === 'overview'"
          class="animate-fade-in" body-class="p-6 lg:p-8"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-line pb-4"
          >
            <div
              class="h-8 w-8 rounded-control bg-subtle flex items-center justify-center border border-line"
            >
              <Icon
                name="heroicons:server-stack"
                class="h-4 w-4 text-ink"
              />
            </div>
            <h2 class="text-sm md:text-base font-semibold text-ink">
              System Architecture
            </h2>
          </div>

          <div class="space-y-4 text-xs md:text-sm text-ink leading-relaxed">
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

            <h4 class="text-sm font-semibold text-ink font-mono mt-6 mb-2">
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
        </AppCard>

        <!-- SECTION: Roles & Permissions -->
        <AppCard
          v-show="activeTab === 'permissions'"
          class="animate-fade-in" body-class="p-6 lg:p-8"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-line pb-4"
          >
            <div
              class="h-8 w-8 rounded-control bg-subtle flex items-center justify-center border border-line"
            >
              <Icon
                name="heroicons:shield-check"
                class="h-4 w-4 text-ink"
              />
            </div>
            <h2 class="text-sm md:text-base font-semibold text-ink">
              Roles & Permissions
            </h2>
          </div>

          <div class="space-y-6 text-xs md:text-sm text-ink leading-relaxed">
            <p>
              Access is heavily regulated by two main attributes:
              <strong>Role</strong> and <strong>Type</strong>.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 border border-line rounded-surface bg-subtle/60">
                <h4
                  class="font-semibold text-ink mb-2 flex items-center gap-2"
                >
                  <Icon name="heroicons:user" class="h-4 w-4 text-danger-text" />
                  User Roles
                </h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Admin:</strong> Standard users restricted by their
                    assigned "Type".
                  </li>
                  <li>
                    <strong>Super Admin:</strong> Bypasses all restrictions,
                    accesses all pages, and manages users and executives.
                  </li>
                </ul>
              </div>

              <div class="p-4 border border-line rounded-surface bg-subtle/60">
                <h4
                  class="font-semibold text-ink mb-2 flex items-center gap-2"
                >
                  <Icon name="heroicons:tag" class="h-4 w-4 text-muted" />
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
        </AppCard>

        <!-- SECTION: Core Workflows -->
        <AppCard
          v-show="activeTab === 'workflows'"
          class="animate-fade-in" body-class="p-6 lg:p-8"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-line pb-4"
          >
            <div
              class="h-8 w-8 rounded-control bg-subtle flex items-center justify-center border border-line"
            >
              <Icon
                name="heroicons:arrow-path-rounded-square"
                class="h-4 w-4 text-ink"
              />
            </div>
            <h2 class="text-sm md:text-base font-semibold text-ink">
              Core Workflows
            </h2>
          </div>

          <div class="space-y-8 text-xs md:text-sm text-ink leading-relaxed">
            <!-- Event Lifecycle -->
            <div>
              <h3 class="font-semibold text-ink text-base mb-3">
                The Event Lifecycle
              </h3>
              <p class="mb-4">
                Church executives handle events through a specific sequence:
              </p>

              <div
                class="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-line"
              >
                <div
                  class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full border-4 border-canvas bg-ink text-white font-semibold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10"
                  >
                    1
                  </div>
                  <div
                    class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-surface border border-line bg-subtle/60"
                  >
                    <h4
                      class="font-semibold text-ink text-xs mb-1"
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
                    class="flex items-center justify-center w-8 h-8 rounded-full border-4 border-canvas bg-ink text-white font-semibold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10"
                  >
                    2
                  </div>
                  <div
                    class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-surface border border-line bg-subtle/60"
                  >
                    <h4
                      class="font-semibold text-ink text-xs mb-1"
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
                    class="flex items-center justify-center w-8 h-8 rounded-full border-4 border-canvas bg-ink text-white font-semibold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10"
                  >
                    3
                  </div>
                  <div
                    class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-surface border border-line bg-subtle/60"
                  >
                    <h4
                      class="font-semibold text-ink text-xs mb-1"
                    >
                      Unit Attendance
                    </h4>
                    <p class="text-xs">
                      Select an event and unit to mark officiating workers as
                      Present or Excused.
                    </p>
                  </div>
                </div>

                <div
                  class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full border-4 border-canvas bg-ink text-white font-semibold text-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10"
                  >
                    4
                  </div>
                  <div
                    class="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-surface border border-line bg-subtle/60"
                  >
                    <h4
                      class="font-semibold text-ink text-xs mb-1"
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
            <div class="pt-6 border-t border-line">
              <h3 class="font-semibold text-ink text-sm mb-4">
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
                  "Save Changes" button at the bottom of the page.
                </li>
              </ul>
            </div>

            <!-- Unit Meeting Attendance -->
            <div class="pt-6 border-t border-line">
              <h3 class="font-semibold text-ink text-sm mb-4">
                Unit Meeting Attendance
              </h3>
              <ul class="list-disc pl-5 space-y-2 text-xs md:text-sm">
                <li>
                  This module is used strictly for unit meetings (distinct from
                  events).
                </li>
                <li>
                  Attendance records are <strong>synced to the backend</strong>
                  via the API.
                </li>
                <li>
                  After the first manual save, changes are saved automatically
                  after 1.2 seconds of inactivity. You can also use the "Save
                  Changes" button at any time.
                </li>
                <li>
                  A sync indicator shows the current save state
                  (<em>Saved</em>, <em>Unsaved</em>, <em>Saving...</em>).
                </li>
              </ul>
            </div>
          </div>
        </AppCard>

        <!-- SECTION: Troubleshooting -->
        <AppCard
          v-show="activeTab === 'troubleshooting'"
          class="animate-fade-in" body-class="p-6 lg:p-8"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-line pb-4"
          >
            <div
              class="h-8 w-8 rounded-control bg-subtle flex items-center justify-center border border-line"
            >
              <Icon
                name="heroicons:wrench-screwdriver"
                class="h-4 w-4 text-ink"
              />
            </div>
            <h2 class="text-sm md:text-base font-semibold text-ink">
              Troubleshooting & Edge Cases
            </h2>
          </div>

          <div
            class="space-y-6 text-xs md:text-sm text-muted leading-relaxed"
          >
            <div class="bg-danger-surface border border-danger-line rounded-surface p-4">
              <h4
                class="font-semibold text-danger-text text-xs mb-3"
              >
                Important Limitations
              </h4>
              <ul class="list-disc pl-5 space-y-2 text-danger-text/80">
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
              <h4 class="font-semibold text-ink mb-3">
                Common Errors
              </h4>
              <div class="border border-line rounded-surface overflow-hidden">
                <table class="min-w-full divide-y divide-line">
                  <caption class="sr-only">
                    Common error messages and their solutions
                  </caption>
                  <thead class="bg-subtle">
                    <tr>
                      <th
                        class="px-4 py-3 text-left font-mono text-xs font-medium text-muted"
                      >
                        Error Message
                      </th>
                      <th
                        class="px-4 py-3 text-left font-mono text-xs font-medium text-muted"
                      >
                        Cause & Resolution
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-line bg-surface">
                    <tr>
                      <td class="px-4 py-3 font-medium text-ink text-xs">
                        "Session Expired"
                      </td>
                      <td class="px-4 py-3 text-xs">
                        The Firebase ID token has expired; you must log in
                        again.
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-3 font-medium text-ink text-xs">
                        "Access Denied"
                      </td>
                      <td class="px-4 py-3 text-xs">
                        Your user role or type does not match the required
                        permissions for the page.
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-3 font-medium text-ink text-xs">
                        "Invalid passkey"
                      </td>
                      <td class="px-4 py-3 text-xs">
                        During public worker registration, the passkey entered
                        does not match the record in the unitPasskeys document.
                      </td>
                    </tr>
                    <tr>
                      <td class="px-4 py-3 font-medium text-ink text-xs">
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
              <h4 class="font-semibold text-ink mb-3">
                Automated Attendance Behavior
              </h4>
              <p class="text-xs md:text-sm">
                If an officiating worker is not manually marked as Present or
                Excused, the system automatically computes and flags them as
                Absent.
              </p>
            </div>
          </div>
        </AppCard>

        <!-- SECTION: PWA Installation -->
        <AppCard
          v-show="activeTab === 'pwa'"
          class="animate-fade-in" body-class="p-6 lg:p-8"
        >
          <div
            class="flex items-center gap-3 mb-6 border-b border-line pb-4"
          >
            <div
              class="h-8 w-8 rounded-control bg-subtle flex items-center justify-center border border-line"
            >
              <Icon
                name="heroicons:device-phone-mobile"
                class="h-4 w-4 text-ink"
              />
            </div>
            <h2 class="text-sm md:text-base font-semibold text-ink">
              Installing the PWA App
            </h2>
          </div>

          <div class="space-y-6 text-xs md:text-sm text-ink leading-relaxed">
            <p>
              The Chapel of Praise system can be installed as a Progressive Web
              App (PWA) on your device, giving you quick access directly from
              your home screen — just like a native app. Below are the steps for
              Android and iPhone.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Android -->
              <div class="p-4 border border-line rounded-surface bg-subtle/60">
                <h4
                  class="font-semibold text-ink mb-3 flex items-center gap-2"
                >
                  <Icon
                    name="simple-icons:android"
                    class="h-4 w-4 text-success-text"
                  />
                  Android (Chrome)
                </h4>
                <ol class="list-decimal pl-5 space-y-2">
                  <li>
                    Open <strong>Chrome</strong> and navigate to the Chapel of
                    Praise site.
                  </li>
                  <li>
                    Tap the <strong>three-dot menu</strong> (⋮) in the top-right
                    corner.
                  </li>
                  <li>Tap <strong>"Add to Home screen"</strong>.</li>
                  <li>
                    Tap <strong>"Add"</strong> on the confirmation dialog.
                  </li>
                </ol>
                <p class="mt-3 text-xs text-muted">
                  You may also see an install banner at the bottom of the screen
                  — tap <strong>"Install"</strong> to skip the menu steps.
                </p>
              </div>

              <!-- iPhone -->
              <div class="p-4 border border-line rounded-surface bg-subtle/60">
                <h4
                  class="font-semibold text-ink mb-3 flex items-center gap-2"
                >
                  <Icon
                    name="simple-icons:apple"
                    class="h-4 w-4 text-ink"
                  />
                  iPhone (Safari)
                </h4>
                <ol class="list-decimal pl-5 space-y-2">
                  <li>
                    Open <strong>Safari</strong> and navigate to the Chapel of
                    Praise site.
                  </li>
                  <li>
                    Tap the <strong>Share button</strong> (square with arrow) at
                    the bottom of the screen.
                  </li>
                  <li>
                    Scroll down and tap
                    <strong>"Add to Home Screen"</strong>.
                  </li>
                  <li>
                    Customise the name if desired, then tap
                    <strong>"Add"</strong> in the top-right corner.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </AppCard>
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
  { id: "pwa", label: "App Installation" },
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
