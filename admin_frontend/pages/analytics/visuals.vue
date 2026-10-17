<template>
  <div class="relative min-h-screen pb-20 pt-5">
    <LoadingScreen :is-loading="isFetching" />

    <AppHeading
      class="mb-8"
      title="Data visualization"
      subtitle="Visual trends for attendance, altar calls and follow-up progress."
    />

    <!-- Monthly Attendance -->
    <AppCard class="mb-8" body-class="p-0">
      <div class="bg-subtle/60 border-b border-line px-6 py-5">
        <h3 class="text-sm font-semibold text-ink">
          Attendance Trend (Last 6 Months)
        </h3>
      </div>
      <div class="p-6">
        <div class="h-56 flex items-end gap-3">
          <div
            v-for="month in monthlyAttendance"
            :key="month.key"
            class="flex-1 h-full flex flex-col items-center justify-end gap-2"
          >
            <span class="text-xs font-semibold text-ink">
              {{ month.total }}
            </span>
            <div
              class="w-full max-w-16 rounded-t-control bg-ink transition-colors"
              :style="{ height: barHeight(month.total, maxMonthly) }"
            />
            <span
              class="font-mono text-xs font-medium text-muted"
            >
              {{ month.label }}
            </span>
          </div>
        </div>
        <p v-if="!totalAttendance" class="mt-4 text-xs text-muted">
          No attendance data recorded yet.
        </p>
      </div>
    </AppCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Altar Calls by Type -->
      <AppCard body-class="p-0">
        <div class="bg-subtle/60 border-b border-line px-6 py-5">
          <h3 class="text-sm font-semibold text-ink">
            Altar Call Responders by Type
          </h3>
        </div>
        <div class="p-6 space-y-5">
          <template v-if="altarCallTypeTotals.length">
            <div v-for="row in altarCallTypeTotals" :key="row.type">
              <div class="flex items-center justify-between mb-1.5">
                <span
                  class="font-mono text-xs font-medium text-muted"
                >
                  {{ row.type }}
                </span>
                <span class="text-xs font-semibold text-ink">
                  {{ row.responders }}
                </span>
              </div>
              <div class="h-2 rounded-full bg-subtle overflow-hidden">
                <div
                  class="h-full bg-ink rounded-full transition-colors"
                  :style="{
                    width: percentage(row.responders, totalResponders),
                  }"
                />
              </div>
            </div>
          </template>
          <p v-else class="text-xs text-muted">
            No altar calls recorded yet.
          </p>
        </div>
      </AppCard>

      <!-- Follow-ups by Status -->
      <AppCard body-class="p-0">
        <div class="bg-subtle/60 border-b border-line px-6 py-5">
          <h3 class="text-sm font-semibold text-ink">
            Follow-up Progress
          </h3>
        </div>
        <div class="p-6 space-y-5">
          <template v-if="followUps.length">
            <div v-for="row in followUpRows" :key="row.label">
              <div class="flex items-center justify-between mb-1.5">
                <span
                  class="font-mono text-xs font-medium text-muted"
                >
                  {{ row.label }}
                </span>
                <span class="text-xs font-semibold text-ink">
                  {{ row.value }}
                </span>
              </div>
              <div class="h-2 rounded-full bg-subtle overflow-hidden">
                <div
                  class="h-full bg-ink rounded-full transition-colors"
                  :style="{
                    width: percentage(row.value, followUps.length),
                  }"
                />
              </div>
            </div>
          </template>
          <p v-else class="text-xs text-muted">
            No follow-up records yet.
          </p>
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
  followUps,
  totalAttendance,
  totalResponders,
  followUpStatusCounts,
  altarCallTypeTotals,
  monthlyAttendance,
} = useAnalyticsData();

const maxMonthly = computed(() =>
  Math.max(...monthlyAttendance.value.map((month) => month.total), 0),
);

const followUpRows = computed(() =>
  Object.entries(followUpStatusCounts.value).map(([label, value]) => ({
    label,
    value,
  })),
);

// Scaled to 80% so the bar never collides with the value label above it.
const barHeight = (value, max) => {
  if (!max || max <= 0) return "2%";
  return `${Math.max((value / max) * 80, 2)}%`;
};

const percentage = (value, total) => {
  if (!total || total <= 0) return "2%";
  return `${Math.max((value / total) * 100, 2)}%`;
};

onMounted(load);
</script>
