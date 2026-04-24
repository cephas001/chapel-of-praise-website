<template>
  <form @submit.prevent="handleSubmit" class="space-y-5 pb-8 font-montserrat">
    <div>
      <label class="block text-sm font-bold text-gray-900 mb-1.5"
        >Altar Call Category</label
      >
      <div class="relative">
        <select
          v-model="formData.callType"
          required
          class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
        >
          <option value="" disabled>Select Call Type</option>
          <option value="SALVATION">SALVATION</option>
          <option value="REDEDICATION">REDEDICATION</option>
          <option value="HOLY GHOST BAPTISM">HOLY GHOST BAPTISM</option>
          <option value="HEALING">HEALING</option>
          <option value="SPECIAL MINISTRATION">SPECIAL MINISTRATION</option>
          <option value="OTHER">OTHER</option>
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
        >Number of Responders</label
      >
      <input
        v-model.number="formData.totalResponders"
        type="number"
        min="1"
        required
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        placeholder="e.g. 25"
      />
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-900 mb-1.5"
        >Additional Comments</label
      >
      <textarea
        v-model="formData.additionalComments"
        rows="3"
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium resize-none"
        placeholder="Any notes regarding this altar call..."
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
        Record Altar Call
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
  callType: "",
  totalResponders: "",
  additionalComments: "",
});

const handleSubmit = () => {
  emit("submit", { ...formData });
  // Reset form after submit intent
  formData.callType = "";
  formData.totalResponders = "";
  formData.additionalComments = "";
};
</script>
