<template>
  <div
    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full font-poppins"
  >
    <div
      class="px-6 py-5 border-b border-gray-200 flex items-start justify-between bg-white"
    >
      <div>
        <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
          Altar Calls
        </h3>
        <p class="text-xs text-gray-500">
          Manage response categories for this event.
        </p>
      </div>

      <button
        @click="openDrawer"
        class="inline-flex items-center px-4 py-2 text-[11px] font-bold text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-jetbrains shadow-sm"
      >
        <Icon name="heroicons:plus" class="mr-1.5 h-4 w-4" />
        Record
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
      <p
        class="text-[11px] font-bold font-jetbrains text-gray-500 uppercase tracking-widest animate-pulse"
      >
        Loading altar calls...
      </p>
    </div>

    <div
      v-else-if="altarCalls.length === 0"
      class="flex-1 flex flex-col justify-center items-center text-center py-14 px-8"
    >
      <Icon name="heroicons:megaphone" class="h-10 w-10 text-gray-300 mb-4" />
      <h4 class="text-sm font-jetbrains font-bold text-gray-900 mb-1">
        No Altar Calls
      </h4>
      <p class="text-xs text-gray-500 mb-6 max-w-xs">
        Start recording altar call responses for this event.
      </p>
      <button
        @click="openDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        Record Call
      </button>
    </div>

    <div
      v-else
      class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200"
    >
      <ul class="divide-y divide-gray-100">
        <li
          v-for="call in altarCalls"
          :key="call.id"
          @click="$emit('select-call', call)"
          class="group cursor-pointer px-6 py-5 hover:bg-gray-50/50 transition-colors"
          :class="selectedCall?.id === call.id ? 'bg-gray-50/80' : ''"
        >
          <div>
            <p
              class="text-[11px] font-jetbrains font-bold uppercase tracking-widest text-gray-500 mb-2"
            >
              {{ call.callType }}
            </p>
            <p class="text-xs text-gray-500 truncate max-w-[250px] font-medium">
              {{ call.additionalComments || "No additional comments" }}
            </p>
          </div>

          <div
            class="inline-flex items-center justify-between rounded-md bg-white border border-gray-200 px-2.5 py-1.5 mt-3 shadow-sm"
          >
            <span
              class="text-[10px] font-bold font-jetbrains uppercase tracking-wider text-gray-600"
            >
              {{ call.totalResponders }} Responders
            </span>
            <Icon
              name="heroicons:chevron-right"
              class="ml-2 h-3.5 w-3.5 text-gray-300 group-hover:text-black transition-colors"
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
      `${config.public.apiBase}/admin/altar-calls/event/${props.eventId}`,
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

    const response = await $fetch(
      `${config.public.apiBase}/admin/altar-calls`,
      {
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

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
