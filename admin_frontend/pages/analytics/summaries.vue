<template>
  <div class="relative min-h-screen pb-20 pt-5 font-poppins">
    <LoadingScreen :is-loading="isFetching" />

    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Data Summaries
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        A snapshot of events, attendance, altar calls, follow-ups and
        membership across the chapel.
      </p>
    </div>

    <!-- KPI Row -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
    >
      <div
        v-for="kpi in kpis"
        :key="kpi.label"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
      >
        <div
          class="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 mb-4"
        >
          <Icon :name="kpi.icon" class="h-5 w-5" />
        </div>
        <p
          class="text-[11px] font-jetbrains font-bold text-gray-600 uppercase tracking-widest mb-1"
        >
          {{ kpi.label }}
        </p>
        <h4 class="text-2xl font-black text-gray-900">{{ kpi.value }}</h4>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Follow-ups by Status -->
      <section
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
          <h3 class="text-sm font-jetbrains font-bold text-black">
            Follow-ups by Status
          </h3>
        </div>
        <div class="p-6">
          <ul v-if="followUps.length" class="space-y-4">
            <li
              v-for="row in followUpRows"
              :key="row.label"
              class="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0"
            >
              <span
                class="text-xs font-jetbrains font-bold uppercase tracking-wide text-gray-600"
              >
                {{ row.label }}
              </span>
              <span class="text-sm font-black text-gray-900">
                {{ row.value }}
              </span>
            </li>
          </ul>
          <p v-else class="text-xs text-gray-500">
            No follow-up records yet.
          </p>
        </div>
      </section>

      <!-- Altar Calls by Type -->
      <section
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
          <h3 class="text-sm font-jetbrains font-bold text-black">
            Altar Calls by Type
          </h3>
        </div>
        <div class="p-6">
          <ul v-if="altarCallTypeTotals.length" class="space-y-4">
            <li
              v-for="row in altarCallTypeTotals"
              :key="row.type"
              class="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0"
            >
              <span
                class="text-xs font-jetbrains font-bold uppercase tracking-wide text-gray-600"
              >
                {{ row.type }}
              </span>
              <span class="text-xs font-bold text-gray-900">
                {{ row.responders }} responders
                <span class="text-gray-500">· {{ row.calls }} calls</span>
              </span>
            </li>
          </ul>
          <p v-else class="text-xs text-gray-500">No altar calls recorded yet.</p>
        </div>
      </section>

      <!-- Events by Service -->
      <section
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
          <h3 class="text-sm font-jetbrains font-bold text-black">
            Events by Service
          </h3>
        </div>
        <div class="p-6">
          <ul v-if="eventsByService.length" class="space-y-4">
            <li
              v-for="row in eventsByService"
              :key="row.service"
              class="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0"
            >
              <span
                class="text-xs font-jetbrains font-bold uppercase tracking-wide text-gray-600"
              >
                {{ row.service }}
              </span>
              <span class="text-sm font-black text-gray-900">
                {{ row.count }}
              </span>
            </li>
          </ul>
          <p v-else class="text-xs text-gray-500">No events recorded yet.</p>
        </div>
      </section>

      <!-- Members by Unit -->
      <section
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
          <h3 class="text-sm font-jetbrains font-bold text-black">
            Members by Unit
          </h3>
        </div>
        <div class="p-6">
          <ul v-if="membersByUnit.length" class="space-y-4">
            <li
              v-for="row in membersByUnit"
              :key="row.unit"
              class="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0"
            >
              <span
                class="text-xs font-jetbrains font-bold uppercase tracking-wide text-gray-600"
              >
                {{ row.unit }}
              </span>
              <span class="text-sm font-black text-gray-900">
                {{ row.count }}
              </span>
            </li>
          </ul>
          <p v-else class="text-xs text-gray-500">No members registered yet.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAnalyticsData } from "@/composables/useAnalyticsData";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const {
  isFetching,
  load,
  events,
  followUps,
  totalAttendance,
  totalResponders,
  followUpStatusCounts,
  altarCallTypeTotals,
  eventsByService,
  membersByUnit,
} = useAnalyticsData();

const kpis = computed(() => [
  {
    label: "Total Events",
    value: events.value.length,
    icon: "heroicons:calendar-days",
  },
  {
    label: "Total Attendance",
    value: totalAttendance.value,
    icon: "heroicons:user-group",
  },
  {
    label: "Altar Call Responders",
    value: totalResponders.value,
    icon: "heroicons:megaphone",
  },
  {
    label: "Pending Follow-ups",
    value: followUpStatusCounts.value.Pending || 0,
    icon: "heroicons:clipboard-document-list",
  },
]);

const followUpRows = computed(() =>
  Object.entries(followUpStatusCounts.value).map(([label, value]) => ({
    label,
    value,
  })),
);

onMounted(load);
</script>
