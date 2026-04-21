<template>
  <form @submit.prevent="handleSubmit" class="space-y-5 pb-8 font-montserrat">
    <div>
      <label class="block text-sm font-bold text-gray-900 mb-1.5"
        >Full Name</label
      >
      <input
        v-model="formData.fullName"
        type="text"
        required
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        placeholder="e.g. Osifowora Abolaji"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Gender</label
        >
        <div class="relative">
          <select
            v-model="formData.gender"
            required
            class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
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
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Phone Number</label
        >
        <input
          v-model="formData.phoneNumber"
          type="tel"
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
          placeholder="090..."
        />
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 border-t border-gray-100 pt-5 mt-5">
      <div class="col-span-2">
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Hostel</label
        >
        <input
          v-model="formData.hostel"
          type="text"
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
          placeholder="e.g. Faye Curtis 1"
        />
      </div>
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5">Room</label>
        <input
          v-model="formData.roomNumber"
          type="text"
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
          placeholder="e.g. 37"
        />
      </div>
    </div>

    <div class="border-t border-gray-100 pt-5 mt-5">
      <label class="block text-sm font-bold text-gray-900 mb-1.5"
        >Assign Follow-up To (Optional)</label
      >
      <input
        v-model="formData.assignedTo"
        type="text"
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        placeholder="Name of Evangelism team member..."
      />
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-900 mb-1.5">Notes</label>
      <textarea
        v-model="formData.notes"
        rows="2"
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium resize-none"
        placeholder="Any specific prayer points or comments..."
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
