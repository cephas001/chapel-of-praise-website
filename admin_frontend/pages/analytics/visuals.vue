<template>
  <div class="relative min-h-screen pb-20 pt-5 font-poppins">
    <LoadingScreen :is-loading="isFetching" />

    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Data Visualization
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Visual trends for attendance, altar calls and follow-up progress.
      </p>
    </div>

    <!-- Monthly Attendance -->
    <section
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8"
    >
      <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
        <h3 class="text-sm font-jetbrains font-bold text-black">
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
            <span class="text-[11px] font-bold text-gray-700">
              {{ month.total }}
            </span>
            <div
              class="w-full max-w-16 rounded-t-lg bg-black transition-all"
              :style="{ height: barHeight(month.total, maxMonthly) }"
            />
            <span
              class="text-[11px] font-jetbrains font-bold text-gray-500 uppercase"
            >
              {{ month.label }}
            </span>
          </div>
        </div>
        <p v-if="!totalAttendance" class="mt-4 text-xs text-gray-500">
          No attendance data recorded yet.
        </p>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Altar Calls by Type -->
      <section
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
          <h3 class="text-sm font-jetbrains font-bold text-black">
            Altar Call Responders by Type
          </h3>
        </div>
        <div class="p-6 space-y-5">
          <template v-if="altarCallTypeTotals.length">
            <div v-for="row in altarCallTypeTotals" :key="row.type">
              <div class="flex items-center justify-between mb-1.5">
                <span
                  class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-600"
                >
                  {{ row.type }}
                </span>
                <span class="text-xs font-bold text-gray-900">
                  {{ row.responders }}
                </span>
              </div>
              <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="h-full bg-black rounded-full transition-all"
                  :style="{
                    width: percentage(row.responders, totalResponders),
                  }"
                />
              </div>
            </div>
          </template>
          <p v-else class="text-xs text-gray-500">
            No altar calls recorded yet.
          </p>
        </div>
      </section>

      <!-- Follow-ups by Status -->
      <section
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
          <h3 class="text-sm font-jetbrains font-bold text-black">
            Follow-up Progress
          </h3>
        </div>
        <div class="p-6 space-y-5">
          <template v-if="followUps.length">
            <div v-for="row in followUpRows" :key="row.label">
              <div class="flex items-center justify-between mb-1.5">
                <span
                  class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-600"
                >
                  {{ row.label }}
                </span>
                <span class="text-xs font-bold text-gray-900">
                  {{ row.value }}
                </span>
              </div>
              <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="h-full bg-black rounded-full transition-all"
                  :style="{
                    width: percentage(row.value, followUps.length),
                  }"
                />
              </div>
            </div>
          </template>
          <p v-else class="text-xs text-gray-500">
            No follow-up records yet.
          </p>
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
