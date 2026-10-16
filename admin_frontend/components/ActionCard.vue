<!-- components/ui/ActionCard.vue -->
<template>
  <div
    class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col h-full font-poppins hover:shadow-md transition-shadow"
  >
    <!-- Top Section: Header & Badges -->
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="text-sm md:text-base font-bold text-gray-900 line-clamp-1">
          {{ record.fullName }}
        </h3>
        <p
          class="text-[11px] font-semibold text-gray-500 mt-0.5 font-jetbrains uppercase tracking-wider"
        >
          {{ record.category }}
        </p>
      </div>

      <!-- Status Badge -->
      <span
        class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider"
        :class="{
          'bg-amber-50 text-amber-700': record.status === 'Pending',
          'bg-blue-50 text-blue-700': record.status === 'Contacted',
          'bg-green-50 text-green-700': record.status === 'Completed',
        }"
      >
        {{ record.status }}
      </span>
    </div>

    <!-- Status Update Control -->
    <div class="mb-4 flex items-center gap-2">
      <label
        :for="`status-${record.id}`"
        class="text-[10px] font-jetbrains font-bold uppercase tracking-wider text-gray-500 shrink-0"
      >
        Status
      </label>
      <div class="relative flex-1">
        <select
          :id="`status-${record.id}`"
          :value="record.status"
          :disabled="isUpdatingStatus"
          class="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-[11px] font-jetbrains font-bold uppercase tracking-wider text-gray-700 focus:bg-white focus:border-black outline-none transition-all cursor-pointer disabled:opacity-60"
          @change="submitStatusChange"
        >
          <option value="Pending">Pending</option>
          <option value="Contacted">Contacted</option>
          <option value="Completed">Completed</option>
        </select>
        <Icon
          name="heroicons:chevron-down"
          class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500"
        />
      </div>
      <Icon
        v-if="isUpdatingStatus"
        name="heroicons:arrow-path"
        class="h-3.5 w-3.5 text-gray-500 animate-spin shrink-0"
      />
    </div>

    <!-- Event Link (If applicable) -->
    <div
      v-if="record.eventDetails"
      class="mb-4 text-xs font-medium text-gray-500 flex items-center font-jetbrains"
    >
      <Icon
        name="heroicons:calendar"
        class="h-3.5 w-3.5 mr-1.5 text-gray-500"
      />
      <span class="line-clamp-1">{{
        formatEventDisplay(record.eventDetails)
      }}</span>
    </div>

    <!-- Quick Contact Actions -->
    <div v-if="record.phoneNumber" class="flex gap-2 mb-6">
      <a
        :href="`tel:${record.phoneNumber}`"
        class="flex-1 inline-flex justify-center items-center py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs transition-colors"
        title="Call"
      >
        <Icon name="heroicons:phone" class="h-4 w-4 mr-1.5" /> Call
      </a>
      <a
        :href="`https://wa.me/${cleanPhone(record.phoneNumber)}`"
        target="_blank"
        class="flex-1 inline-flex justify-center items-center py-2 px-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs transition-colors"
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
      class="mb-6 py-2 px-3 bg-gray-50 rounded-xl text-xs text-gray-500 text-center italic"
    >
      No phone number provided
    </div>

    <!-- Divider -->
    <div class="h-px bg-gray-100 w-full mb-4"/>

    <!-- Threading Section -->
    <div class="flex-1 flex flex-col min-h-[150px]">
      <h4
        class="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center justify-between font-jetbrains"
      >
        Notes Thread
        <span
          class="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-[10px] font-jetbrains"
          >{{ record.notesThread?.length || 0 }}</span
        >
      </h4>

      <!-- The Notes -->
      <div
        class="flex-1 overflow-y-auto pr-2 space-y-3 mb-4 max-h-[200px] scrollbar-thin scrollbar-thumb-gray-200"
      >
        <div
          v-if="!record.notesThread || record.notesThread.length === 0"
          class="text-xs text-gray-500 italic text-center py-4"
        >
          No notes added yet.
        </div>

        <div
          v-for="(note, index) in record.notesThread"
          v-else
          :key="index"
          class="bg-gray-50 p-3 rounded-xl border border-gray-200"
        >
          <div class="text-xs text-gray-800 font-medium mb-1.5 leading-relaxed">
            {{ note.text }}
          </div>
          <div
            class="flex justify-between items-center text-[10px] text-gray-500 font-semibold font-jetbrains"
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
          class="w-full bg-gray-50 border border-gray-200 focus:border-black focus:bg-white outline-none rounded-xl py-2 pl-3 pr-10 text-xs font-medium transition-all"
          :disabled="isSubmitting"
          @keyup.enter="submitNote"
        >
        <button
          aria-label="Add note"
          :disabled="!newNote.trim() || isSubmitting"
          class="absolute right-1.5 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
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
  </div>
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
