<template>
  <form class="space-y-6 pt-2" @submit.prevent="handleSubmit">
    <div>
      <label
        for="event-date"
        class="block text-xs font-medium text-ink mb-2"
        >Event Date</label
      >
      <input
        id="event-date"
        v-model="formData.eventDate"
        type="date"
        required
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
      >
    </div>

    <div>
      <label
        for="event-service"
        class="block text-xs font-medium text-ink mb-2"
        >Service Type</label
      >
      <div class="relative">
        <select
          id="event-service"
          v-model="formData.service"
          required
          class="w-full appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        >
          <option value="" disabled>Select Service Type</option>
          <option value="PRAYER MEETING">PRAYER MEETING</option>
          <option value="BIBLE STUDY">BIBLE STUDY</option>
          <option value="SUNDAY SERVICE">SUNDAY SERVICE</option>
          <option value="SUNDAY SCHOOL">SUNDAY SCHOOL</option>
          <option value="SPECIAL PROGRAM">SPECIAL PROGRAM</option>
        </select>
        <div
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <Icon name="heroicons:chevron-down" class="h-4 w-4 text-muted" />
        </div>
      </div>
    </div>

    <template v-if="formData.service === 'SPECIAL PROGRAM'">
      <div
        class="bg-subtle/60 rounded-surface p-5 border border-line space-y-5"
      >
        <div>
          <label
            for="event-special-program"
            class="block text-xs font-medium text-ink mb-2"
            >Special Program Category</label
          >
          <div class="relative">
            <select
              id="event-special-program"
              v-model="formData.specialProgram"
              required
              class="w-full appearance-none rounded-control border border-line bg-surface py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
            >
              <option value="" disabled>Select Program</option>
              <option value="WORKERS MEETING">WORKERS MEETING</option>
              <option value="WORKERS RETREAT">WORKERS RETREAT</option>
              <option value="WORKERS VIGIL">WORKERS VIGIL</option>
              <option value="EXCO VIGIL">EXCO VIGIL</option>
              <option value="SAYCO">SAYCO</option>
              <option value="EXCELLENCE CONFERENCE">
                EXCELLENCE CONFERENCE
              </option>
              <option value="OTHER">OTHER</option>
            </select>
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:chevron-down"
                class="h-4 w-4 text-muted"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            for="event-program-day"
            class="block text-xs font-medium text-ink mb-2"
            >Program Day / Label</label
          >
          <input
            id="event-program-day"
            v-model="formData.programDay"
            type="text"
            placeholder="e.g. Day 1, Grand Finale"
            class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
          >
        </div>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-5">
      <div>
      <label
        for="event-start-time"
        class="block text-xs font-medium text-ink mb-2"
        >Start Time</label
      >
      <input
        id="event-start-time"
        v-model="formData.startTime"
          type="time"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm font-mono"
        >
      </div>
      <div>
      <label
        for="event-end-time"
        class="block text-xs font-medium text-ink mb-2"
        >End Time</label
      >
      <input
        id="event-end-time"
        v-model="formData.endTime"
          type="time"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm font-mono"
        >
      </div>
    </div>

    <div>
      <label
        for="event-description"
        class="block text-xs font-medium text-ink mb-2"
        >Event Description</label
      >
      <textarea
        id="event-description"
        v-model="formData.eventDescription"
        rows="4"
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
        placeholder="Add details, notes, or focus points for this event..."
      />
    </div>

    <div class="pt-6 border-t border-line">
      <AppButton
        type="submit"
        size="lg"
        :loading="loading"
        class="w-full"
      >
        {{ isEditing ? "Save changes" : "Create event" }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch } from "vue";

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit"]);

const isEditing = ref(!!props.initialData);

const formData = reactive({
  eventDate: "",
  service: "",
  specialProgram: "",
  programDay: "",
  startTime: "",
  endTime: "",
  eventDescription: "",
});

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      Object.assign(formData, newVal);
      isEditing.value = true;
    } else {
      // Reset form when drawer opens for a new entry
      Object.assign(formData, {
        eventDate: "",
        service: "",
        specialProgram: "",
        programDay: "",
        startTime: "",
        endTime: "",
        eventDescription: "",
      });
      isEditing.value = false;
    }
  },
  { immediate: true },
);

watch(
  () => formData.service,
  (newService) => {
    if (newService !== "SPECIAL PROGRAM") {
      formData.specialProgram = "";
      formData.programDay = "";
    }
  },
);

const handleSubmit = () => {
  emit("submit", { ...formData });
};
</script>
