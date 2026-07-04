<template>
  <div
    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full"
  >
    <div
      class="px-6 py-5 border-b border-gray-200 flex items-start justify-between"
    >
      <div>
        <h3 class="text-md font-bold font-jetbrains text-black">
          Event Demographics
        </h3>

        <p class="text-xs text-gray-500 mt-1">
          Attendance breakdown for this event.
        </p>
      </div>

      <button
        v-if="headcount && !isFetching"
        @click="openDrawer"
        class="inline-flex items-center text-xs font-bold font-jetbrains text-gray-500 hover:text-black transition-colors"
      >
        <Icon name="heroicons:pencil-square" class="mr-1.5 h-4 w-4" />
      </button>
    </div>

    <div
      v-if="isFetching"
      class="py-16 flex flex-col items-center justify-center"
    >
      <Icon
        name="heroicons:arrow-path"
        class="h-8 w-8 text-gray-400 animate-spin mb-4"
      />

      <p class="text-xs font-bold font-jetbrains text-gray-500 animate-pulse">
        Loading demographics...
      </p>
    </div>

    <div
      v-else-if="!headcount"
      class="flex-1 flex flex-col items-center justify-center py-14 px-8 text-center"
    >
      <Icon name="heroicons:users" class="h-10 w-10 text-gray-300 mb-4" />

      <h4 class="text-sm font-bold font-jetbrains text-black mb-2">
        No Demographics Recorded
      </h4>

      <p class="text-xs text-gray-500 mb-6 max-w-xs">
        Record attendance demographics for this event.
      </p>

      <button
        @click="openDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold font-jetbrains text-white hover:bg-gray-800 transition-colors"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />

        Record Head Count
      </button>
    </div>

    <div v-else class="p-6 flex-1 flex flex-col">
      <div class="grid grid-cols-2 gap-5">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p
            class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-500 mb-3"
          >
            Students
          </p>
          <div class="space-y-2">
            <p class="text-xs text-gray-900">
              <span class="font-bold">{{ headcount.maleStudents }}</span> Male
            </p>
            <p class="text-xs text-gray-900">
              <span class="font-bold">{{ headcount.femaleStudents }}</span>
              Female
            </p>
          </div>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p
            class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-500 mb-3"
          >
            Visitors
          </p>
          <div class="space-y-2">
            <p class="text-xs text-gray-900">
              <span class="font-bold">{{ headcount.maleVisitors }}</span> Male
            </p>
            <p class="text-xs text-gray-900">
              <span class="font-bold">{{ headcount.femaleVisitors }}</span>
              Female
            </p>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between mt-3"
      >
        <span
          class="text-[11px] font-jetbrains font-bold uppercase tracking-wide text-gray-700"
          >Total Attendance</span
        >
        <span class="text-md font-black text-black">{{ totalCount }}</span>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { useAlertModal } from "~/composables/useAlertModal";

const props = defineProps({
  eventId: {
    type: String,
    required: true,
  },
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

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
      `${config.public.apiBase}/headcounts/event/${props.eventId}`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    headcount.value = response; // Will be null if it doesn't exist
  } catch (error) {
    console.error("Failed to fetch headcount:", error);
    showAlert("Error", "Could not load headcount data.", "error");
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

    const response = await $fetch(`${config.public.apiBase}/headcounts`, {
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    headcount.value = response.data;
    showAlert("Success", "Event demographics saved successfully.", "success");
    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    showAlert("Action Failed", "Could not save the demographics.", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
