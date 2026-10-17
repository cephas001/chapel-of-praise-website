<!-- pages/events/[id]/attendance.vue -->
<template>
  <div class="relative min-h-screen pt-5">
    <div
      class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <NuxtLink
          :to="`/events/${eventId}`"
          class="inline-flex items-center text-xs font-medium text-muted transition-colors hover:text-ink mb-3"
        >
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" /> Back to
          Event
        </NuxtLink>
        <AppHeading title="Event unit attendance" />
      </div>

      <div class="w-full sm:w-72">
        <div class="relative">
          <select
            :value="selectedUnit"
            aria-label="Select chapel unit"
            class="w-full appearance-none cursor-pointer rounded-control border border-line bg-surface py-2.5 pl-4 pr-10 text-xs font-semibold text-ink outline-none transition-colors focus:border-ink md:text-sm"
            @change="onUnitChange"
          >
            <option value="" disabled>Select Chapel Unit...</option>
            <option v-for="unit in availableUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <Icon name="heroicons:chevron-down" class="h-4 w-4 text-muted" />
          </div>
        </div>
      </div>
    </div>

    <EventAttendanceTable
      v-if="selectedUnit"
      ref="attendanceRef"
      :event-id="eventId"
      :unit-name="selectedUnit"
    />

    <AppCard
      v-else
      class="mt-8 border-dashed" body-class="p-16 text-center"
    >
      <Icon
        name="heroicons:cursor-arrow-rays"
        class="mx-auto h-10 w-10 text-line mb-4"
      />
      <h3 class="text-base font-semibold text-ink mb-1">
        Select a Unit
      </h3>
      <p class="text-xs md:text-sm text-muted">
        Choose a chapel unit from the dropdown above to load and manage the
        attendance roster.
      </p>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const route = useRoute();
const eventId = route.params.id;
const selectedUnit = ref("");
const attendanceRef = ref(null);
const confirm = useConfirm();

const { units: availableUnits, loadUnits } = useChapelUnits();

onMounted(loadUnits);

const onUnitChange = async (event) => {
  const nextUnit = event.target.value;
  if (attendanceRef.value?.isDirty) {
    const ok = await confirm.ask({
      title: "Unsaved Changes",
      message:
        "You have unsaved attendance changes for this roster. Switch units and discard them?",
      confirmText: "Discard & Switch",
      cancelText: "Stay",
      isDestructive: true,
    });
    if (!ok) {
      event.target.value = selectedUnit.value;
      return;
    }
  }
  selectedUnit.value = nextUnit;
};
</script>
