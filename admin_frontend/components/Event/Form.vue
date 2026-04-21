<template>
  <form @submit.prevent="handleSubmit" class="space-y-5 pb-8 font-montserrat">
    <div>
      <label class="block text-sm font-bold text-black mb-1.5"
        >Event Date</label
      >
      <input
        v-model="formData.eventDate"
        type="date"
        required
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
      />
    </div>

    <div>
      <label class="block text-sm font-bold text-black mb-1.5"
        >Service Type</label
      >
      <div class="relative">
        <select
          v-model="formData.service"
          required
          class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
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
          <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>

    <template v-if="formData.service === 'SPECIAL PROGRAM'">
      <div class="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
        <div>
          <label class="block text-sm font-bold text-black mb-1.5"
            >Special Program Category</label
          >
          <div class="relative">
            <select
              v-model="formData.specialProgram"
              required
              class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
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
                class="h-4 w-4 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-black mb-1.5"
            >Program Day / Label</label
          >
          <input
            v-model="formData.programDay"
            type="text"
            placeholder="e.g. Day 1, Grand Finale"
            class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
          />
        </div>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-bold text-black mb-1.5"
          >Start Time</label
        >
        <input
          v-model="formData.startTime"
          type="time"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        />
      </div>
      <div>
        <label class="block text-sm font-bold text-black mb-1.5"
          >End Time</label
        >
        <input
          v-model="formData.endTime"
          type="time"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-bold text-black mb-1.5"
        >Event Description</label
      >
      <textarea
        v-model="formData.eventDescription"
        rows="4"
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium resize-none"
        placeholder="Add details, notes, or focus points for this event..."
      ></textarea>
    </div>

    <div class="pt-4">
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer items-center"
      >
        <Icon
          v-if="loading"
          name="heroicons:arrow-path"
          class="mr-2 h-4 w-4 animate-spin"
        />
        {{ isEditing ? "Save Changes" : "Create Event" }}
      </button>
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
