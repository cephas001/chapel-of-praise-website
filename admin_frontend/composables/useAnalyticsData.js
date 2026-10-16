// composables/useAnalyticsData.js
import { ref, computed } from "vue";
import { headcountTotal } from "~/utils/formatters";

export function useAnalyticsData() {
  const config = useRuntimeConfig();
  const toast = useAppToast();

  const isFetching = ref(true);
  const events = ref([]);
  const headcounts = ref([]);
  const altarCalls = ref([]);
  const followUps = ref([]);
  const members = ref([]);

  const load = async () => {
    isFetching.value = true;
    try {
      const [
        eventsRes,
        headcountsRes,
        altarCallsRes,
        followUpsRes,
        membersRes,
      ] = await Promise.all([
        $fetch(`${config.public.apiBase}/admin/events`),
        $fetch(`${config.public.apiBase}/admin/headcounts`),
        $fetch(`${config.public.apiBase}/admin/altar-calls/global`),
        $fetch(`${config.public.apiBase}/admin/follow-ups`),
        $fetch(`${config.public.apiBase}/admin/members`),
      ]);

      events.value = eventsRes;
      headcounts.value = headcountsRes;
      altarCalls.value = altarCallsRes;
      followUps.value = followUpsRes;
      members.value = membersRes;
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      toast.error("Could not load analytics data. Please try again.");
    } finally {
      isFetching.value = false;
    }
  };

  const totalAttendance = computed(() =>
    headcounts.value.reduce((sum, hc) => sum + headcountTotal(hc), 0),
  );

  const totalResponders = computed(() =>
    altarCalls.value.reduce(
      (sum, call) => sum + (Number(call.totalResponders) || 0),
      0,
    ),
  );

  const followUpStatusCounts = computed(() => {
    const counts = { Pending: 0, Contacted: 0, Completed: 0 };
    followUps.value.forEach((followUp) => {
      const status = followUp.status || "Pending";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  });

  const altarCallTypeTotals = computed(() => {
    const totals = {};
    altarCalls.value.forEach((call) => {
      const type = call.callType || "OTHER";
      if (!totals[type]) totals[type] = { calls: 0, responders: 0 };
      totals[type].calls += 1;
      totals[type].responders += Number(call.totalResponders) || 0;
    });
    return Object.entries(totals)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.responders - a.responders);
  });

  const eventsByService = computed(() => {
    const counts = {};
    events.value.forEach((event) => {
      const service = event.service || "UNKNOWN";
      counts[service] = (counts[service] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count);
  });

  const membersByUnit = computed(() => {
    const counts = {};
    members.value.forEach((member) => {
      const unit = member.chapelUnit || "Unassigned";
      counts[unit] = (counts[unit] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([unit, count]) => ({ unit, count }))
      .sort((a, b) => b.count - a.count);
  });

  const monthlyAttendance = computed(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleString("en-US", { month: "short" }),
        total: 0,
      });
    }

    const monthMap = new Map(months.map((month) => [month.key, month]));
    headcounts.value.forEach((hc) => {
      const dateString = hc.eventDetails?.eventDate;
      if (!dateString) return;
      const date = new Date(dateString);
      const entry = monthMap.get(`${date.getFullYear()}-${date.getMonth()}`);
      if (entry) entry.total += headcountTotal(hc);
    });

    return months;
  });

  return {
    isFetching,
    load,
    events,
    headcounts,
    altarCalls,
    followUps,
    members,
    totalAttendance,
    totalResponders,
    followUpStatusCounts,
    altarCallTypeTotals,
    eventsByService,
    membersByUnit,
    monthlyAttendance,
  };
}
