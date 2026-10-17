<template>
  <AppCard
    class="flex h-full flex-col" body-class="flex min-h-0 flex-1 flex-col"
  >
    <div
      class="px-6 py-5 border-b border-line flex items-start justify-between"
    >
      <div>
        <h3 class="text-base font-semibold text-ink">
          Event Demographics
        </h3>

        <p class="text-xs text-muted mt-1">
          Attendance breakdown for this event.
        </p>
      </div>

      <button
        v-if="headcount && !isFetching"
        aria-label="Edit demographics"
        class="rounded-control p-2 text-muted transition-colors hover:bg-subtle hover:text-ink"
        @click="openDrawer"
      >
        <Icon name="heroicons:pencil-square" class="h-4 w-4" />
      </button>
    </div>

    <div
      v-if="isFetching"
      class="py-16 flex flex-col items-center justify-center"
    >
      <Icon
        name="heroicons:arrow-path"
        class="h-8 w-8 text-muted animate-spin mb-4"
      />

      <p class="font-mono text-xs font-medium text-muted animate-pulse">
        Loading demographics...
      </p>
    </div>

    <div
      v-else-if="!headcount"
      class="flex-1 flex flex-col items-center justify-center py-14 px-8 text-center"
    >
      <Icon name="heroicons:users" class="h-10 w-10 text-line mb-4" />

      <h4 class="text-sm font-semibold text-ink mb-2">
        No Demographics Recorded
      </h4>

      <p class="text-xs text-muted mb-6 max-w-xs">
        Record attendance demographics for this event.
      </p>

      <AppButton icon="heroicons:plus" @click="openDrawer">
        Record head count
      </AppButton>
    </div>

    <div v-else class="p-6 flex-1 flex flex-col">
      <div class="grid grid-cols-2 gap-5">
        <div class="bg-subtle border border-line rounded-control p-4">
          <p
            class="font-mono text-xs font-medium text-muted mb-3"
          >
            Students
          </p>
          <div class="space-y-2">
            <p class="text-xs text-ink">
              <span class="font-semibold">{{ headcount.maleStudents }}</span> Male
            </p>
            <p class="text-xs text-ink">
              <span class="font-semibold">{{ headcount.femaleStudents }}</span>
              Female
            </p>
          </div>
        </div>
        <div class="bg-subtle border border-line rounded-control p-4">
          <p
            class="font-mono text-xs font-medium text-muted mb-3"
          >
            Visitors
          </p>
          <div class="space-y-2">
            <p class="text-xs text-ink">
              <span class="font-semibold">{{ headcount.maleVisitors }}</span> Male
            </p>
            <p class="text-xs text-ink">
              <span class="font-semibold">{{ headcount.femaleVisitors }}</span>
              Female
            </p>
          </div>
        </div>
      </div>

      <div
        class="bg-subtle rounded-surface p-4 border border-line flex items-center justify-between mt-3"
      >
        <span
          class="font-mono text-xs font-medium text-ink"
          >Total Attendance</span
        >
        <span class="text-base font-semibold text-ink">{{ totalCount }}</span>
      </div>
    </div>

    <SlideOver
      :is-open="isDrawerOpen"
      :title="headcount ? 'Edit Head Count' : 'Record Head Count'"
      @close="closeDrawer"
    >
      <EventHeadCountForm
        :initial-data="headcount"
        :loading="isSubmitting"
        @submit="handleFormSubmit"
      />
    </SlideOver>
  </AppCard>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";

const props = defineProps({
  eventId: {
    type: String,
    required: true,
  },
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast(); // auto-imported

const headcount = ref(null);
const isFetching = ref(true);
const isSubmitting = ref(false);
const isDrawerOpen = ref(false);

const totalCount = computed(() => {
  if (!headcount.value) return 0;
  return (
    (headcount.value.maleStudents || 0) +
    (headcount.value.femaleStudents || 0) +
    (headcount.value.maleVisitors || 0) +
    (headcount.value.femaleVisitors || 0)
  );
});

const fetchHeadcount = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/headcounts/event/${props.eventId}`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    headcount.value = response; // Will be null if it doesn't exist
  } catch (error) {
    console.error("Failed to fetch headcount:", error);
    toast.error("Could not load headcount data."); // migrated
  } finally {
    isFetching.value = false;
  }
};

onMounted(() => {
  fetchHeadcount();
});

const openDrawer = () => {
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const handleFormSubmit = async (formData) => {
  isSubmitting.value = true;
  try {
    const payload = {
      eventId: props.eventId,
      ...formData,
    };

    const response = await $fetch(`${config.public.apiBase}/admin/headcounts`, {
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    headcount.value = response.data;
    toast.success("Event demographics saved successfully."); // migrated
    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    toast.error("Could not save the demographics."); // migrated
  } finally {
    isSubmitting.value = false;
  }
};
</script>
