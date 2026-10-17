<template>
  <AppCard
    class="flex h-full flex-col" body-class="flex min-h-0 flex-1 flex-col"
  >
    <div
      class="px-6 py-5 border-b border-line flex items-start justify-between"
    >
      <div>
        <h3 class="text-base font-semibold text-ink mb-1">
          Altar Calls
        </h3>
        <p class="text-xs text-muted">
          Manage response categories for this event.
        </p>
      </div>

      <AppButton
        variant="secondary"
        size="sm"
        icon="heroicons:plus"
        @click="openDrawer"
      >
        Record
      </AppButton>
    </div>

    <div
      v-if="isFetching"
      class="py-16 flex flex-col items-center justify-center"
    >
      <Icon
        name="heroicons:arrow-path"
        class="h-8 w-8 text-muted animate-spin mb-4"
      />
      <p
        class="font-mono text-xs font-medium text-muted animate-pulse"
      >
        Loading altar calls...
      </p>
    </div>

    <div
      v-else-if="altarCalls.length === 0"
      class="flex-1 flex flex-col justify-center items-center text-center py-14 px-8"
    >
      <Icon name="heroicons:megaphone" class="h-10 w-10 text-line mb-4" />
      <h4 class="text-sm font-semibold text-ink mb-1">
        No Altar Calls
      </h4>
      <p class="text-xs text-muted mb-6 max-w-xs">
        Start recording altar call responses for this event.
      </p>
      <AppButton icon="heroicons:plus" @click="openDrawer">
        Record call
      </AppButton>
    </div>

    <div
      v-else
      class="flex-1 overflow-y-auto"
    >
      <ul class="divide-y divide-line">
        <li
          v-for="call in altarCalls"
          :key="call.id"
          role="button"
          tabindex="0"
          :aria-label="`View details for ${call.callType} altar call`"
          class="group cursor-pointer px-6 py-5 hover:bg-subtle/60 transition-colors"
          :class="selectedCall?.id === call.id ? 'bg-subtle' : ''"
          @click="$emit('select-call', call)"
          @keydown.enter.self.prevent="$emit('select-call', call)"
          @keydown.space.self.prevent="$emit('select-call', call)"
        >
          <div>
            <p
              class="font-mono text-xs font-medium text-muted mb-2"
            >
              {{ call.callType }}
            </p>
            <p class="text-xs text-muted truncate max-w-[250px] font-medium">
              {{ call.additionalComments || "No additional comments" }}
            </p>
          </div>

          <div
            class="inline-flex items-center justify-between rounded-badge bg-surface border border-line px-2.5 py-1.5 mt-3"
          >
            <span
              class="font-mono text-xs font-medium text-muted"
            >
              {{ call.totalResponders }} Responders
            </span>
            <Icon
              name="heroicons:chevron-right"
              class="ml-2 h-3.5 w-3.5 text-line group-hover:text-ink transition-colors"
            />
          </div>
        </li>
      </ul>
    </div>

    <SlideOver
      :is-open="isDrawerOpen"
      title="Record Altar Call"
      :before-close="confirmDiscardDraft"
      @close="closeDrawer"
    >
      <EventAltarCallForm
        ref="altarCallFormRef"
        :loading="isSubmitting"
        @submit="handleFormSubmit"
      />
    </SlideOver>
  </AppCard>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";

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

defineEmits(["select-call"]);

const config = useRuntimeConfig();
const toast = useAppToast();

const altarCalls = ref([]);
const isFetching = ref(true);
const isSubmitting = ref(false);
const isDrawerOpen = ref(false);
const altarCallFormRef = ref(null);
const confirm = useConfirm();

const confirmDiscardDraft = async () => {
  if (!altarCallFormRef.value?.isDirty?.()) return true;
  return await confirm.ask({
    title: "Discard Altar Call?",
    message: "You have unsaved details in this form. Close and discard them?",
    confirmText: "Discard",
    cancelText: "Keep Editing",
    isDestructive: true,
  });
};

const fetchAltarCalls = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/altar-calls/event/${props.eventId}`,
    );
    altarCalls.value = response;
  } catch (error) {
    console.error("Failed to fetch altar calls:", error);
    toast.error("Failed to fetch altar calls. Please try again later.");
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
      },
    );

    altarCalls.value.unshift(response.data);
    altarCallFormRef.value?.resetForm();
    toast.success("Altar call recorded successfully!");
    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);

    toast.error(
      error.data?.error ||
        "Could not submit the form. Please check your input and try again.",
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>
