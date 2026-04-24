<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full font-montserrat"
  >
    <div
      class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50"
    >
      <div class="flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"
        >
          <Icon name="heroicons:users" class="h-5 w-5" />
        </div>
        <h3 class="text-lg font-bold text-black">Event Demographics</h3>
      </div>

      <button
        v-if="headcount && !isFetching"
        @click="openDrawer"
        class="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
      >
        <Icon name="heroicons:pencil-square" class="h-4 w-4" />
        Edit
      </button>
    </div>

    <div
      v-if="isFetching"
      class="p-8 text-center flex-1 flex flex-col justify-center"
    >
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-8 w-8 text-gray-400 animate-spin mb-3"
      />
      <p class="text-sm text-gray-500 font-medium">Loading demographics...</p>
    </div>

    <div
      v-else-if="!headcount"
      class="p-8 text-center flex-1 flex flex-col items-center justify-center group"
    >
      <h4 class="text-base font-bold text-gray-900 mb-1">
        No Head Count Recorded
      </h4>
      <p class="text-sm text-gray-500 mb-5">
        Demographic data has not been logged for this event yet.
      </p>
      <button
        @click="openDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 transition-colors"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        Add Head Count
      </button>
    </div>

    <div v-else class="p-6 flex-1 flex flex-col">
      <div class="grid grid-cols-2 gap-x-6 gap-y-6 mb-6">
        <div>
          <p
            class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
          >
            Students
          </p>
          <div class="flex items-center gap-4">
            <p class="text-sm text-gray-900">
              <span class="font-bold">{{ headcount.maleStudents }}</span> Male
            </p>
            <p class="text-sm text-gray-900">
              <span class="font-bold">{{ headcount.femaleStudents }}</span>
              Female
            </p>
          </div>
        </div>
        <div>
          <p
            class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
          >
            Visitors
          </p>
          <div class="flex items-center gap-4">
            <p class="text-sm text-gray-900">
              <span class="font-bold">{{ headcount.maleVisitors }}</span> Male
            </p>
            <p class="text-sm text-gray-900">
              <span class="font-bold">{{ headcount.femaleVisitors }}</span>
              Female
            </p>
          </div>
        </div>
      </div>

      <div
        class="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between mt-auto"
      >
        <span class="text-sm font-bold text-gray-700 uppercase tracking-wider"
          >Total Attendance</span
        >
        <span class="text-2xl font-black text-black">{{ totalCount }}</span>
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
