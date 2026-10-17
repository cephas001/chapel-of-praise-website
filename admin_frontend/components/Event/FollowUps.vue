<template>
  <AppCard
    class="mt-6 flex h-full flex-col lg:mt-0" body-class="flex min-h-0 flex-1 flex-col"
  >
    <div
      class="px-6 py-5 border-b border-line flex items-start justify-between"
    >
      <div class="flex items-start gap-3">
        <div
          v-if="responses.length > 0"
          class="h-10 w-10 rounded-full bg-subtle border border-line flex items-center justify-center text-muted shrink-0"
        >
          <Icon name="heroicons:user-plus" class="h-5 w-5" />
        </div>

        <div
          v-else
          class="flex-1 overflow-y-auto"
          style="max-height: 400px"
        >
          <p v-if="selectedCall" class="text-xs text-muted">
            For:
            <span class="font-semibold text-ink">{{
              selectedCall.callType
            }}</span>
          </p>
          <p v-else class="text-xs text-muted">
            Select a call to view individuals.
          </p>
        </div>
      </div>

      <AppButton
        v-if="selectedCall"
        variant="secondary"
        size="sm"
        icon="heroicons:plus"
        class="shrink-0"
        @click="openDrawer"
      >
        Add
      </AppButton>
    </div>

    <div
      v-if="!selectedCall"
      class="flex-1 p-8 text-center flex flex-col items-center justify-center bg-subtle/50"
    >
      <Icon
        name="heroicons:cursor-arrow-rays"
        class="h-10 w-10 text-line mb-3"
      />
      <h4 class="text-sm font-semibold text-muted mb-1">
        Select an Altar Call
      </h4>
      <p class="text-xs text-muted max-w-xs">
        Click on an altar call category to view or add specific individuals.
      </p>
    </div>

    <div
      v-else-if="isFetching"
      class="flex-1 p-8 text-center flex flex-col items-center justify-center"
    >
      <Icon
        name="heroicons:arrow-path"
        class="h-8 w-8 text-muted animate-spin mb-3"
      />
      <p
        class="font-mono text-xs font-medium text-muted animate-pulse"
      >
        Loading responses...
      </p>
    </div>

    <div
      v-else-if="responses.length === 0"
      class="flex-1 p-8 text-center flex flex-col items-center justify-center"
    >
      <Icon name="heroicons:users" class="h-10 w-10 text-line mb-3" />
      <h4 class="text-sm font-semibold text-ink mb-1">
        No Individuals Recorded
      </h4>
      <p class="text-xs text-muted mb-4 max-w-xs">
        Add the first responder for this {{ selectedCall.callType }} call.
      </p>
    </div>

    <div
      v-else
      class="flex-1 overflow-y-auto max-h-100"
    >
      <ul class="divide-y divide-line">
        <li
          v-for="response in responses"
          :key="response.id"
          class="p-5 hover:bg-subtle/60 transition-colors"
        >
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-sm font-semibold text-ink">
              {{ response.fullName }}
            </h4>
            <span
              class="inline-flex items-center rounded-badge border px-2 py-0.5 font-mono text-xs font-medium"
              :class="
                response.followUpStatus === 'DONE'
                  ? 'bg-success-surface text-success-text border-success-line'
                  : 'bg-warning-surface text-warning-text border-warning-line'
              "
            >
              {{ response.followUpStatus }}
            </span>
          </div>

          <div class="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            <div
              v-if="response.phoneNumber"
              class="flex items-center text-xs text-muted font-medium"
            >
              <Icon
                name="heroicons:phone"
                class="h-3.5 w-3.5 mr-1.5 text-muted"
              />
              {{ response.phoneNumber }}
            </div>
            <div
              v-if="response.hostel"
              class="flex items-center text-xs text-muted font-medium"
            >
              <Icon
                name="heroicons:building-office-2"
                class="h-3.5 w-3.5 mr-1.5 text-muted"
              />
              {{ response.hostel }}
              {{ response.roomNumber ? `(Rm ${response.roomNumber})` : "" }}
            </div>
            <div
              v-if="response.assignedTo"
              class="flex items-center text-xs text-muted font-medium"
            >
              <Icon
                name="heroicons:user-circle"
                class="h-3.5 w-3.5 mr-1.5 text-muted"
              />
              Assigned:
              <span class="font-semibold text-ink ml-1">{{
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
      :before-close="confirmDiscardDraft"
      @close="closeDrawer"
    >
      <EventAltarCallResponseForm
        ref="responseFormRef"
        :loading="isSubmitting"
        @submit="handleFormSubmit"
      />
    </SlideOver>
  </AppCard>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";

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
const toast = useAppToast(); // auto-imported

const responses = ref([]);
const isFetching = ref(false);
const isSubmitting = ref(false);
const isDrawerOpen = ref(false);
const responseFormRef = ref(null);
const confirm = useConfirm();

const confirmDiscardDraft = async () => {
  if (!responseFormRef.value?.isDirty?.()) return true;
  return await confirm.ask({
    title: "Discard Responder Details?",
    message: "You have unsaved details in this form. Close and discard them?",
    confirmText: "Discard",
    cancelText: "Keep Editing",
    isDestructive: true,
  });
};

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
      toast.error("Could not load individual responses."); // migrated
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
    responseFormRef.value?.resetForm();
    toast.success("Individual response recorded."); // migrated
    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    toast.error("Could not save the response."); // migrated
  } finally {
    isSubmitting.value = false;
  }
};
</script>
