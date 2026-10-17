<!-- components/ui/ActionCard.vue -->
<template>
  <AppCard
    class="flex h-full flex-col" body-class="p-5 flex flex-1 flex-col"
  >
    <!-- Top Section: Header & Badges -->
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="text-sm md:text-base font-semibold text-ink line-clamp-1">
          {{ record.fullName }}
        </h3>
        <p
          class="font-mono text-xs font-medium text-muted mt-0.5"
        >
          {{ record.category }}
        </p>
      </div>

      <!-- Status Badge -->
      <span
        class="inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-mono font-semibold"
        :class="{
          'bg-warning-surface text-warning-text': record.status === 'Pending',
          'bg-subtle text-muted': record.status === 'Contacted',
          'bg-success-surface text-success-text': record.status === 'Completed',
        }"
      >
        {{ record.status }}
      </span>
    </div>

    <!-- Status Update Control -->
    <div class="mb-4 flex items-center gap-2">
      <label
        :for="`status-${record.id}`"
        class="font-mono text-xs font-medium text-muted shrink-0"
      >
        Status
      </label>
      <div class="relative flex-1">
        <select
          :id="`status-${record.id}`"
          :value="record.status"
          :disabled="isUpdatingStatus"
          class="w-full appearance-none cursor-pointer rounded-control border border-line bg-subtle py-1.5 pl-3 pr-8 font-mono text-xs font-semibold text-ink outline-none transition-colors focus:border-ink focus:bg-surface disabled:opacity-60"
          @change="submitStatusChange"
        >
          <option value="Pending">Pending</option>
          <option value="Contacted">Contacted</option>
          <option value="Completed">Completed</option>
        </select>
        <Icon
          name="heroicons:chevron-down"
          class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted"
        />
      </div>
      <Icon
        v-if="isUpdatingStatus"
        name="heroicons:arrow-path"
        class="h-3.5 w-3.5 text-muted animate-spin shrink-0"
      />
    </div>

    <!-- Event Link (If applicable) -->
    <div
      v-if="record.eventDetails"
      class="mb-4 flex items-center font-mono text-xs font-medium text-muted"
    >
      <Icon
        name="heroicons:calendar"
        class="h-3.5 w-3.5 mr-1.5 text-muted"
      />
      <span class="line-clamp-1">{{
        formatEventDisplay(record.eventDetails)
      }}</span>
    </div>

    <!-- Quick Contact Actions -->
    <div v-if="record.phoneNumber" class="flex gap-2 mb-6">
      <a
        :href="`tel:${record.phoneNumber}`"
        class="flex-1 inline-flex items-center justify-center rounded-surface border border-line bg-surface px-3 py-2 text-xs text-ink transition-colors hover:bg-subtle"
        title="Call"
      >
        <Icon name="heroicons:phone" class="h-4 w-4 mr-1.5" /> Call
      </a>
      <a
        :href="`https://wa.me/${cleanPhone(record.phoneNumber)}`"
        target="_blank"
        class="flex-1 inline-flex items-center justify-center rounded-surface bg-success-surface px-3 py-2 text-xs text-success-text transition-colors hover:bg-success-line"
        title="WhatsApp"
      >
        <Icon
          name="heroicons:chat-bubble-oval-left-ellipsis"
          class="h-4 w-4 mr-1.5"
        />
        WhatsApp
      </a>
    </div>
    <div
      v-else
      class="mb-6 rounded-surface bg-subtle px-3 py-2 text-center text-xs italic text-muted"
    >
      No phone number provided
    </div>

    <!-- Divider -->
    <div class="w-full h-px bg-subtle mb-4"/>

    <!-- Threading Section -->
    <div class="flex-1 flex flex-col min-h-[150px]">
      <h4
        class="text-xs font-semibold text-ink mb-3 flex items-center justify-between"
      >
        Notes Thread
        <span
          class="rounded-full bg-subtle px-2 py-0.5 font-mono text-xs text-muted"
          >{{ record.notesThread?.length || 0 }}</span
        >
      </h4>

      <!-- The Notes -->
      <div
        class="flex-1 overflow-y-auto pr-2 space-y-3 mb-4 max-h-[200px]"
      >
        <div
          v-if="!record.notesThread || record.notesThread.length === 0"
          class="text-xs text-muted italic text-center py-4"
        >
          No notes added yet.
        </div>

        <div
          v-for="(note, index) in record.notesThread"
          v-else
          :key="index"
          class="bg-subtle p-3 rounded-surface border border-line"
        >
          <div class="text-xs text-ink font-medium mb-1.5 leading-relaxed">
            {{ note.text }}
          </div>
          <div
            class="flex justify-between items-center text-xs text-muted font-semibold font-mono"
          >
            <span>{{ note.authorName }}</span>
            <span>{{ formatTime(note.timestamp) }}</span>
          </div>
        </div>
      </div>

      <!-- Add Note Input -->
      <div class="mt-auto relative flex items-center">
        <input
          v-model="newNote"
          type="text"
          aria-label="Add a comment"
          placeholder="Add a comment..."
          class="w-full rounded-surface border border-line bg-subtle py-2 pl-3 pr-10 text-xs font-medium text-ink outline-none transition-colors focus:border-ink focus:bg-surface"
          :disabled="isSubmitting"
          @keyup.enter="submitNote"
        >
        <button
          aria-label="Add note"
          :disabled="!newNote.trim() || isSubmitting"
          class="absolute right-1.5 rounded-control p-1.5 text-muted transition-colors hover:bg-subtle disabled:opacity-50 disabled:hover:bg-transparent"
          @click="submitNote"
        >
          <Icon
            v-if="isSubmitting"
            name="heroicons:arrow-path"
            class="h-4 w-4 animate-spin"
          />
          <Icon
            v-else
            name="heroicons:paper-airplane"
            class="h-4 w-4 transform -rotate-45"
          />
        </button>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { ref } from "vue";
import { formatEventDisplay, cleanPhone  } from "~/utils/formatters";



const props = defineProps({
  record: { type: Object, required: true },
});

const emit = defineEmits(["add-note", "update-status"]);

const newNote = ref("");
const isSubmitting = ref(false);
const isUpdatingStatus = ref(false);

// Format the timestamp for the notes
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
};

const submitStatusChange = (event) => {
  const newStatus = event.target.value;

  if (newStatus === props.record.status) return;

  isUpdatingStatus.value = true;
  // Emit to the parent page, which owns the API call
  emit("update-status", {
    id: props.record.id,
    status: newStatus,
    onSuccess: () => {
      isUpdatingStatus.value = false;
    },
    onError: () => {
      // Revert the select to the record's current status
      event.target.value = props.record.status;
      isUpdatingStatus.value = false;
    },
  });
};

const submitNote = async () => {
  if (!newNote.value.trim() || isSubmitting.value) return;

  isSubmitting.value = true;
  // We emit the event up to the parent page to handle the actual API call
  // We pass a callback function to reset the UI once the API call succeeds
  emit("add-note", {
    id: props.record.id,
    text: newNote.value,
    onSuccess: () => {
      newNote.value = "";
      isSubmitting.value = false;
    },
    onError: () => {
      isSubmitting.value = false;
    },
  });
};
</script>
