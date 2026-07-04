<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 pt-2 font-poppins">
    <div>
      <label
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Event Date</label
      >
      <input
        v-model="formData.eventDate"
        type="date"
        required
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
      />
    </div>

    <div>
      <label
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Service Type</label
      >
      <div class="relative">
        <select
          v-model="formData.service"
          required
          class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none"
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
      <div
        class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 space-y-5"
      >
        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >Special Program Category</label
          >
          <div class="relative">
            <select
              v-model="formData.specialProgram"
              required
              class="w-full bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm appearance-none"
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
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >Program Day / Label</label
          >
          <input
            v-model="formData.programDay"
            type="text"
            placeholder="e.g. Day 1, Grand Finale"
            class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
          />
        </div>
      </div>
    </template>

    <div class="grid grid-cols-2 gap-5">
      <div>
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Start Time</label
        >
        <input
          v-model="formData.startTime"
          type="time"
          required
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm font-jetbrains"
        />
      </div>
      <div>
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >End Time</label
        >
        <input
          v-model="formData.endTime"
          type="time"
          required
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm font-jetbrains"
        />
      </div>
    </div>

    <div>
      <label
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Event Description</label
      >
      <textarea
        v-model="formData.eventDescription"
        rows="4"
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
        placeholder="Add details, notes, or focus points for this event..."
      ></textarea>
    </div>

    <div class="pt-6 border-t border-gray-200">
      <button
        type="submit"
        :disabled="loading"
        class="w-full inline-flex items-center justify-center rounded-xl bg-black px-8 py-3.5 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
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
