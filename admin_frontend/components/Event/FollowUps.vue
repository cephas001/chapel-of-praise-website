<template>
  <div
    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full font-poppins mt-6 lg:mt-0"
  >
    <div
      class="px-6 py-5 border-b border-gray-200 flex items-start justify-between bg-white"
    >
      <div class="flex items-start gap-3">
        <div
          v-if="responses.length > 0"
          class="h-10 w-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0"
        >
          <Icon name="heroicons:user-plus" class="h-5 w-5" />
        </div>

        <div
          v-else
          class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200"
          style="max-height: 400px"
        >
          <p class="text-xs text-gray-500" v-if="selectedCall">
            For:
            <span class="font-bold text-black">{{
              selectedCall.callType
            }}</span>
          </p>
          <p class="text-xs text-gray-500" v-else>
            Select a call to view individuals.
          </p>
        </div>
      </div>

      <button
        v-if="selectedCall"
        @click="openDrawer"
        class="inline-flex items-center px-4 py-2 text-[11px] font-bold text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-jetbrains shadow-sm shrink-0"
      >
        <Icon name="heroicons:plus" class="mr-1.5 h-4 w-4" />
        Add
      </button>
    </div>

    <div
      v-if="!selectedCall"
      class="flex-1 p-8 text-center flex flex-col items-center justify-center bg-gray-50/30"
    >
      <Icon
        name="heroicons:cursor-arrow-rays"
        class="h-10 w-10 text-gray-300 mb-3"
      />
      <h4 class="text-sm font-jetbrains font-bold text-gray-600 mb-1">
        Select an Altar Call
      </h4>
      <p class="text-xs text-gray-500 max-w-xs">
        Click on an altar call category to view or add specific individuals.
      </p>
    </div>

    <div
      v-else-if="isFetching"
      class="flex-1 p-8 text-center flex flex-col items-center justify-center"
    >
      <Icon
        name="heroicons:arrow-path"
        class="h-8 w-8 text-gray-400 animate-spin mb-3"
      />
      <p
        class="text-[11px] font-bold font-jetbrains text-gray-500 uppercase tracking-widest animate-pulse"
      >
        Loading responses...
      </p>
    </div>

    <div
      v-else-if="responses.length === 0"
      class="flex-1 p-8 text-center flex flex-col items-center justify-center"
    >
      <Icon name="heroicons:users" class="h-10 w-10 text-gray-300 mb-3" />
      <h4 class="text-sm font-jetbrains font-bold text-gray-900 mb-1">
        No Individuals Recorded
      </h4>
      <p class="text-xs text-gray-500 mb-4 max-w-xs">
        Add the first responder for this {{ selectedCall.callType }} call.
      </p>
    </div>

    <div
      v-else
      class="flex-1 overflow-y-auto max-h-100 scrollbar-thin scrollbar-thumb-gray-200"
    >
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
              class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider border"
              :class="
                response.followUpStatus === 'DONE'
                  ? 'bg-green-50 text-green-700 border-green-100'
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              "
            >
              {{ response.followUpStatus }}
            </span>
          </div>

          <div class="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            <div
              class="flex items-center text-xs text-gray-600 font-medium"
              v-if="response.phoneNumber"
            >
              <Icon
                name="heroicons:phone"
                class="h-3.5 w-3.5 mr-1.5 text-gray-400"
              />
              {{ response.phoneNumber }}
            </div>
            <div
              class="flex items-center text-xs text-gray-600 font-medium"
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
              class="flex items-center text-xs text-gray-600 font-medium"
              v-if="response.assignedTo"
            >
              <Icon
                name="heroicons:user-circle"
                class="h-3.5 w-3.5 mr-1.5 text-gray-400"
              />
              Assigned:
              <span class="font-bold text-gray-900 ml-1">{{
                response.assignedTo
              }}</span>
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
        `${config.public.apiBase}/admin/altar-calls/responses/${newCall.id}`,
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

    const res = await $fetch(
      `${config.public.apiBase}/admin/altar-calls/responses`,
      {
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

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
