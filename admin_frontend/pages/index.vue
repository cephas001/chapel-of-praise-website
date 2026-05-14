<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat space-y-8">
    <section class="relative overflow-hidden rounded-[2rem] border border-white/50 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_26%)]"></div>
      <div class="relative grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)] p-6 sm:p-8 lg:p-10 items-center">
        <div>
          <p class="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
            Mission control
          </p>
          <AppPageHeader
            :text="`Welcome back, ${name}`"
            description="Your dashboard is organized around the content, events, and ministry workflows you manage most often."
            classList="mt-4"
          />
          <p class="mt-5 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-7">
            Use the quick actions below to move between the most active areas of the admin panel, or open a module to continue a specific workflow.
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink to="/events" class="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
              <Icon name="heroicons:calendar" class="h-4 w-4" />
              Open Events
            </NuxtLink>
            <NuxtLink to="/pages/homepage" class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800">
              <Icon name="heroicons:document-text" class="h-4 w-4" />
              Edit Homepage
            </NuxtLink>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div class="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Core modules</p>
            <p class="mt-2 text-3xl font-black text-slate-950 dark:text-white">9</p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Primary workspace panels</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Focus mode</p>
            <p class="mt-2 text-lg font-bold text-slate-950 dark:text-white">System theme ready</p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Colors adapt to your OS preference</p>
          </div>
          <div class="sm:col-span-2 lg:col-span-1 xl:col-span-2 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm dark:border-slate-800 dark:bg-white dark:text-slate-950">
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-white/60 dark:text-slate-500">Suggested next step</p>
            <p class="mt-2 text-lg font-bold">Review event submissions</p>
            <p class="mt-1 text-sm text-white/75 dark:text-slate-600">Keep attendance, head count, and altar call data current after each service.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Website management</p>
          <h2 class="mt-2 text-2xl font-black text-slate-950 dark:text-white">Content and public pages</h2>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ModuleNavigator
          title="Pages Management"
          description="Update global page content for the Homepage, About Us page, and more."
          iconName="heroicons:document-text"
          iconColor="teal"
          :links="[
            { text: 'Manage Homepage', url: '/pages/homepage', type: 'primary' },
            { text: 'Manage About Page', url: '/pages/about', type: 'secondary' },
            { text: 'Manage Leadership Page', url: '/pages/leadership', type: 'secondary' },
            { text: 'Manage Ministries Page', url: '/pages/ministries', type: 'secondary' },
            { text: 'Manage Giving Page', url: '/pages/giving', type: 'secondary' },
            { text: 'Manage Contact Page', url: '/pages/contact', type: 'secondary' },
            { text: 'Manage Prayer Page', url: '/pages/prayer', type: 'secondary' },
            { text: 'Manage Counseling Page', url: '/pages/counseling', type: 'secondary' }
          ]"
        />

        <ModuleNavigator
          title="Public Events"
          description="Review event details, make changes to the schedule, and manage submissions for upcoming services and special programs."
          iconName="heroicons:calendar"
          iconColor="orange"
          :links="[{ text: 'View Events', url: '/events', type: 'primary' }]"
        />
      </div>
    </section>

    <section class="space-y-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Event oversight</p>
        <h2 class="mt-2 text-2xl font-black text-slate-950 dark:text-white">Attendance and response tracking</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ModuleNavigator
          title="Event Unit Attendance"
          description="Review event unit attendance records and submit attendance for concluded events."
          iconName="heroicons:clipboard-document-check"
          iconColor="blue"
          :links="[
            { text: 'View Records', url: '/', type: 'primary' },
            { text: 'Submit Attendance', url: '/', type: 'secondary' },
          ]"
        />

        <ModuleNavigator
          title="Event Head Count"
          description="Track and manage head count data for existing and upcoming events."
          iconName="heroicons:users"
          iconColor="purple"
          :links="[
            { text: 'View Records', url: '/', type: 'primary' },
            { text: 'Submit Head Count', url: '/', type: 'secondary' },
          ]"
        />

        <ModuleNavigator
          title="Altar Calls"
          description="Manage and track altar calls for concluded and upcoming events."
          iconName="heroicons:megaphone"
          iconColor="red"
          :links="[
            { text: 'View Records', url: '/', type: 'primary' },
            { text: 'Submit Altar Calls', url: '/', type: 'secondary' },
          ]"
        />
      </div>
    </section>

    <section class="space-y-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Ministry operations</p>
        <h2 class="mt-2 text-2xl font-black text-slate-950 dark:text-white">Teams, training, and follow-through</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ModuleNavigator
          title="Unit Members"
          description="Manage and track unit member information across various chapel units."
          iconName="heroicons:users"
          iconColor="green"
          :links="[{ text: 'Manage Members', url: '/', type: 'primary' }]"
        />

        <ModuleNavigator
          title="Unit Meeting Attendance"
          description="Manage and track unit meeting attendance records for concluded and upcoming meetings."
          iconName="heroicons:clipboard-document-check"
          iconColor="blue"
          :links="[
            { text: 'View Records', url: '/', type: 'primary' },
            { text: 'Submit Attendance', url: '/', type: 'secondary' },
          ]"
        />

        <ModuleNavigator
          title="Workers in Training"
          description="Manage workers in training for concluded and upcoming editions."
          iconName="heroicons:academic-cap"
          iconColor="orange"
          :links="[{ text: 'Manage Training', url: '/', type: 'primary' }]"
        />

        <ModuleNavigator
          title="Workers in Training Attendance"
          description="Manage attendance for workers in training sessions."
          iconName="heroicons:clipboard-document-check"
          iconColor="blue"
          :links="[{ text: 'Manage Attendance', url: '/', type: 'primary' }]"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const name = computed(() => auth.user?.name?.split(" ")[0] || "Administrator");
</script>
