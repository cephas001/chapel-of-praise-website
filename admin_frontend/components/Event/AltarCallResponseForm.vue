<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 pt-2 font-poppins">
    <div>
      <label
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Full Name</label
      >
      <input
        v-model="formData.fullName"
        type="text"
        required
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
        placeholder="e.g. Osifowora Abolaji"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Gender</label
        >
        <div class="relative">
          <select
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
            <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Phone Number</label
        >
        <input
          v-model="formData.phoneNumber"
          type="tel"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
          placeholder="090..."
        />
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 border-t border-gray-200 pt-5 mt-2">
      <div class="col-span-2">
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Hostel</label
        >
        <input
          v-model="formData.hostel"
          type="text"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
          placeholder="e.g. Faye Curtis 1"
        />
      </div>
      <div>
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Room</label
        >
        <input
          v-model="formData.roomNumber"
          type="text"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
          placeholder="e.g. 37"
        />
      </div>
    </div>

    <div class="border-t border-gray-200 pt-5 mt-2">
      <label
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Assign Follow-up To (Optional)</label
      >
      <input
        v-model="formData.assignedTo"
        type="text"
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
        placeholder="Name of Evangelism team member..."
      />
    </div>

    <div>
      <label
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Notes</label
      >
      <textarea
        v-model="formData.notes"
        rows="2"
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
        placeholder="Any specific prayer points or comments..."
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
        Record Response
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({
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
  // Reset form
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
</script>
