<template>
  <div class="relative min-h-screen pb-20 pt-5">
    <LoadingScreen :is-loading="isFetching" />

    <AppHeading
      class="mb-8"
      title="Data summaries"
      subtitle="A snapshot of events, attendance, altar calls, follow-ups and membership across the chapel."
    />

    <!-- KPI Row -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
    >
      <AppCard
        v-for="kpi in kpis"
        :key="kpi.label"
        body-class="p-5"
      >
        <div
          class="h-10 w-10 rounded-control bg-subtle flex items-center justify-center text-muted mb-4"
        >
          <Icon :name="kpi.icon" class="h-5 w-5" />
        </div>
        <p
          class="font-mono text-xs font-medium text-muted mb-1"
        >
          {{ kpi.label }}
        </p>
        <h4 class="text-2xl font-semibold text-ink">{{ kpi.value }}</h4>
      </AppCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Follow-ups by Status -->
      <AppCard body-class="p-0">
        <div class="bg-subtle/60 border-b border-line px-6 py-5">
          <h3 class="text-sm font-semibold text-ink">
            Follow-ups by Status
          </h3>
        </div>
        <div class="p-6">
          <ul v-if="followUps.length" class="space-y-4">
            <li
              v-for="row in followUpRows"
              :key="row.label"
              class="flex items-center justify-between border-b border-line last:border-0 pb-3 last:pb-0"
            >
              <span
                class="font-mono text-xs font-medium text-muted"
              >
                {{ row.label }}
              </span>
              <span class="text-sm font-semibold text-ink">
                {{ row.value }}
              </span>
            </li>
          </ul>
          <p v-else class="text-xs text-muted">
            No follow-up records yet.
          </p>
        </div>
      </AppCard>

      <!-- Altar Calls by Type -->
      <AppCard body-class="p-0">
        <div class="bg-subtle/60 border-b border-line px-6 py-5">
          <h3 class="text-sm font-semibold text-ink">
            Altar Calls by Type
          </h3>
        </div>
        <div class="p-6">
          <ul v-if="altarCallTypeTotals.length" class="space-y-4">
            <li
              v-for="row in altarCallTypeTotals"
              :key="row.type"
              class="flex items-center justify-between border-b border-line last:border-0 pb-3 last:pb-0"
            >
              <span
                class="font-mono text-xs font-medium text-muted"
              >
                {{ row.type }}
              </span>
              <span class="text-xs font-semibold text-ink">
                {{ row.responders }} responders
                <span class="text-muted">· {{ row.calls }} calls</span>
              </span>
            </li>
          </ul>
          <p v-else class="text-xs text-muted">No altar calls recorded yet.</p>
        </div>
      </AppCard>

      <!-- Events by Service -->
      <AppCard body-class="p-0">
        <div class="bg-subtle/60 border-b border-line px-6 py-5">
          <h3 class="text-sm font-semibold text-ink">
            Events by Service
          </h3>
        </div>
        <div class="p-6">
          <ul v-if="eventsByService.length" class="space-y-4">
            <li
              v-for="row in eventsByService"
              :key="row.service"
              class="flex items-center justify-between border-b border-line last:border-0 pb-3 last:pb-0"
            >
              <span
                class="font-mono text-xs font-medium text-muted"
              >
                {{ row.service }}
              </span>
              <span class="text-sm font-semibold text-ink">
                {{ row.count }}
              </span>
            </li>
          </ul>
          <p v-else class="text-xs text-muted">No events recorded yet.</p>
        </div>
      </AppCard>

      <!-- Members by Unit -->
      <AppCard body-class="p-0">
        <div class="bg-subtle/60 border-b border-line px-6 py-5">
          <h3 class="text-sm font-semibold text-ink">
            Members by Unit
          </h3>
        </div>
        <div class="p-6">
          <ul v-if="membersByUnit.length" class="space-y-4">
            <li
              v-for="row in membersByUnit"
              :key="row.unit"
              class="flex items-center justify-between border-b border-line last:border-0 pb-3 last:pb-0"
            >
              <span
                class="font-mono text-xs font-medium text-muted"
              >
                {{ row.unit }}
              </span>
              <span class="text-sm font-semibold text-ink">
                {{ row.count }}
              </span>
            </li>
          </ul>
          <p v-else class="text-xs text-muted">No members registered yet.</p>
        </div>
      </AppCard>
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
