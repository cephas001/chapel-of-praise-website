<template>
  <form class="space-y-6 pt-2 font-poppins" @submit.prevent="handleSubmit">
    <div>
      <label
        for="responder-full-name"
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Full Name</label
      >
      <input
        id="responder-full-name"
        v-model="formData.fullName"
        type="text"
        required
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
        placeholder="e.g. Osifowora Abolaji"
      >
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          for="responder-gender"
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Gender</label
        >
        <div class="relative">
          <select
            id="responder-gender"
            v-model="formData.gender"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none"
          >
            <option value="" disabled>Select</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      <div>
        <label
          for="responder-phone"
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Phone Number</label
        >
        <input
          id="responder-phone"
          v-model="formData.phoneNumber"
          type="tel"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
          placeholder="090..."
        >
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 border-t border-gray-200 pt-5 mt-2">
      <div class="col-span-2">
        <label
          for="responder-hostel"
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Hostel</label
        >
        <input
          id="responder-hostel"
          v-model="formData.hostel"
          type="text"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
          placeholder="e.g. Faye Curtis 1"
        >
      </div>
      <div>
        <label
          for="responder-room"
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Room</label
        >
        <input
          id="responder-room"
          v-model="formData.roomNumber"
          type="text"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
          placeholder="e.g. 37"
        >
      </div>
    </div>

    <div class="border-t border-gray-200 pt-5 mt-2">
      <label
        for="responder-assigned-to"
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Assign Follow-up To (Optional)</label
      >
      <input
        id="responder-assigned-to"
        v-model="formData.assignedTo"
        type="text"
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
        placeholder="Name of Evangelism team member..."
      >
    </div>

    <div>
      <label
        for="responder-notes"
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Notes</label
      >
      <textarea
        id="responder-notes"
        v-model="formData.notes"
        rows="2"
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
        placeholder="Any specific prayer points or comments..."
      />
    </div>

    <div class="pt-6 border-t border-gray-200">
      <button
        type="submit"
        :disabled="loading"
        class="w-full inline-flex items-center justify-center rounded-xl bg-black px-8 py-3.5 text-xs md:text-sm text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
      >
        <Icon
          v-if="loading"
          name="heroicons:arrow-path"
          class="mr-2 h-4 w-4 animate-spin"
        />
        Record Response
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from "vue";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit"]);

const formData = reactive({
  fullName: "",
  gender: "",
  phoneNumber: "",
  hostel: "",
  roomNumber: "",
  assignedTo: "",
  notes: "",
});

const handleSubmit = () => {
  emit("submit", { ...formData });
};

const resetForm = () => {
  Object.assign(formData, {
    fullName: "",
    gender: "",
    phoneNumber: "",
    hostel: "",
    roomNumber: "",
    assignedTo: "",
    notes: "",
  });
};

const isDirty = () => Object.values(formData).some((value) => value !== "");

defineExpose({ resetForm, isDirty });
</script>
