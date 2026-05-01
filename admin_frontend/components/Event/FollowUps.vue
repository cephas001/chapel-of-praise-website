<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col font-montserrat mt-6 lg:mt-0"
  >
    <div
      class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50"
    >
      <div class="flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600"
        >
          <Icon name="heroicons:user-plus" class="h-5 w-5" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-black">Individual Responses</h3>
          <p class="text-xs text-gray-500 font-medium mt-2" v-if="selectedCall">
            For:
            <span class="font-bold text-black">{{
              selectedCall.callType
            }}</span>
          </p>
        </div>
      </div>

      <button
        v-if="selectedCall"
        @click="openDrawer"
        class="text-sm font-semibold text-pink-600 hover:text-pink-800 transition-colors flex items-center gap-1"
      >
        <Icon name="heroicons:plus" class="h-4 w-4" />
        Add
      </button>
    </div>

    <div
      v-if="!selectedCall"
      class="p-8 text-center flex flex-col items-center justify-center bg-gray-50/30"
    >
      <Icon
        name="heroicons:cursor-arrow-rays"
        class="h-10 w-10 text-gray-300 mb-3"
      />
      <h4 class="text-sm font-bold text-gray-600 mb-1">Select an Altar Call</h4>
      <p class="text-xs text-gray-500">
        Click on an altar call category above to view or add specific
        individuals.
      </p>
    </div>

    <div
      v-else-if="isFetching"
      class="p-8 text-center flex flex-col justify-center"
    >
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-8 w-8 text-gray-400 animate-spin mb-3"
      />
      <p class="text-sm text-gray-500 font-medium">Loading responses...</p>
    </div>

    <div
      v-else-if="responses.length === 0"
      class="p-8 text-center flex flex-col items-center justify-center"
    >
      <Icon name="heroicons:users" class="h-10 w-10 text-gray-300 mb-3" />
      <h4 class="text-sm font-bold text-gray-900 mb-1">
        No Individuals Recorded
      </h4>
      <p class="text-xs text-gray-500 mb-4">
        Add the first responder for this {{ selectedCall.callType }} call.
      </p>
    </div>

    <div v-else class="overflow-y-auto max-h-[400px]">
      <ul class="divide-y divide-gray-100">
        <li
          v-for="response in responses"
          :key="response.id"
          class="p-5 hover:bg-gray-50/50 transition-colors"
        >
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-sm font-bold text-gray-900">
              {{ response.fullName }}
            </h4>
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              :class="
                response.followUpStatus === 'DONE'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-amber-50 text-amber-700'
              "
            >
              {{ response.followUpStatus }}
            </span>
          </div>

          <div class="flex flex-wrap gap-x-4 gap-y-2 mt-2">
            <div
              class="flex items-center text-xs text-gray-600"
              v-if="response.phoneNumber"
            >
              <Icon
                name="heroicons:phone"
                class="h-3.5 w-3.5 mr-1.5 text-gray-400"
              />
              {{ response.phoneNumber }}
            </div>
            <div
              class="flex items-center text-xs text-gray-600"
              v-if="response.hostel"
            >
              <Icon
                name="heroicons:building-office-2"
                class="h-3.5 w-3.5 mr-1.5 text-gray-400"
              />
              {{ response.hostel }}
              {{ response.roomNumber ? `(Rm ${response.roomNumber})` : "" }}
            </div>
            <div
              class="flex items-center text-xs text-gray-600"
              v-if="response.assignedTo"
            >
              <Icon
                name="heroicons:user-circle"
                class="h-3.5 w-3.5 mr-1.5 text-gray-400"
              />
              Assigned:
              <span class="font-semibold ml-1">{{ response.assignedTo }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <SlideOver
      :is-open="isDrawerOpen"
      :title="`Add Responder - ${selectedCall?.callType || ''}`"
      @close="closeDrawer"
    >
      <EventAltarCallResponseForm
        :loading="isSubmitting"
        @submit="handleFormSubmit"
      />
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { useAlertModal } from "~/composables/useAlertModal";

const props = defineProps({
  eventId: {
    type: String,
    required: true,
  },
  selectedCall: {
    type: Object,
    default: null,
  },
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

const responses = ref([]);
const isFetching = ref(false);
const isSubmitting = ref(false);
const isDrawerOpen = ref(false);

// Watch for changes in the selected altar call to fetch corresponding responses
watch(
  () => props.selectedCall,
  async (newCall) => {
    if (!newCall) {
      responses.value = [];
      return;
    }

    isFetching.value = true;
    try {
      const res = await $fetch(
        `${config.public.apiBase}/altar-calls/responses/${newCall.id}`,
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
        },
      );
      responses.value = res;
    } catch (error) {
      console.error("Failed to fetch responses:", error);
      showAlert("Error", "Could not load individual responses.", "error");
    } finally {
      isFetching.value = false;
    }
  },
  { immediate: true },
);

const openDrawer = () => {
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const handleFormSubmit = async (formData) => {
  if (!props.selectedCall) return;

  isSubmitting.value = true;
  try {
    const payload = {
      eventId: props.eventId,
      altarCallId: props.selectedCall.id,
      ...formData,
    };

    const res = await $fetch(`${config.public.apiBase}/altar-calls/responses`, {
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    responses.value.unshift(res.data);
    showAlert("Success", "Individual response recorded.", "success");
    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    showAlert("Action Failed", "Could not save the response.", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
