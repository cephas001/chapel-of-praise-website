<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full font-montserrat"
  >
    <div
      class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50"
    >
      <div class="flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-600"
        >
          <Icon name="heroicons:megaphone" class="h-5 w-5" />
        </div>
        <h3 class="text-lg font-bold text-gray-900">Altar Calls</h3>
      </div>

      <button
        @click="openDrawer"
        class="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
      >
        <Icon name="heroicons:plus" class="h-4 w-4" />
        Record Call
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
      <p class="text-sm text-gray-500 font-medium">Loading altar calls...</p>
    </div>

    <div
      v-else-if="altarCalls.length === 0"
      class="p-8 text-center flex-1 flex flex-col items-center justify-center group"
    >
      <div
        class="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors"
      >
        <Icon name="heroicons:sparkles" class="h-6 w-6" />
      </div>
      <h4 class="text-base font-bold text-gray-900 mb-1">No Altar Calls</h4>
      <p class="text-sm text-gray-500 mb-5">
        No altar calls have been recorded for this event yet.
      </p>
      <button
        @click="openDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 transition-colors"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        Record Call
      </button>
    </div>

    <div v-else class="flex-1 overflow-y-auto">
      <ul class="divide-y divide-gray-100">
        <li
          v-for="call in altarCalls"
          :key="call.id"
          @click="$emit('select-call', call)"
          class="p-4 sm:px-6 hover:bg-gray-50/50 transition-colors cursor-pointer group flex items-center justify-between"
          :class="selectedCall?.id === call.id ? 'bg-gray-50' : ''"
        >
          <div>
            <p class="text-sm font-bold text-gray-900 mb-0.5">
              {{ call.callType }}
            </p>
            <p class="text-xs text-gray-500 truncate max-w-[200px]">
              {{ call.additionalComments || "No additional comments" }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-100"
            >
              {{ call.totalResponders }}
            </span>
            <Icon
              name="heroicons:chevron-right"
              class="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors"
            />
          </div>
        </li>
      </ul>
    </div>

    <SlideOver
      :is-open="isDrawerOpen"
      title="Record Altar Call"
      @close="closeDrawer"
    >
      <EventAltarCallForm :loading="isSubmitting" @submit="handleFormSubmit" />
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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

const emit = defineEmits(["select-call"]);

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

const altarCalls = ref([]);
const isFetching = ref(true);
const isSubmitting = ref(false);
const isDrawerOpen = ref(false);

const fetchAltarCalls = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/altar-calls/event/${props.eventId}`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    altarCalls.value = response;
  } catch (error) {
    console.error("Failed to fetch altar calls:", error);
    showAlert("Error", "Could not load altar call data.", "error");
  } finally {
    isFetching.value = false;
  }
};

onMounted(() => {
  fetchAltarCalls();
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

    const response = await $fetch(`${config.public.apiBase}/altar-calls`, {
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    altarCalls.value.unshift(response.data);
    showAlert("Success", "Altar call recorded successfully.", "success");
    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    showAlert("Action Failed", "Could not save the altar call.", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
