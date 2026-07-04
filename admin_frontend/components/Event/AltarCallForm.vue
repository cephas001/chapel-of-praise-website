<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 pt-2 font-poppins">
    <div>
      <label
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Altar Call Category</label
      >
      <div class="relative">
        <select
          v-model="formData.callType"
          required
          class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none"
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
      <label
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Number of Responders</label
      >
      <input
        v-model.number="formData.totalResponders"
        type="number"
        min="1"
        required
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
        placeholder="e.g. 25"
      />
    </div>

    <div>
      <label
        class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
        >Additional Comments</label
      >
      <textarea
        v-model="formData.additionalComments"
        rows="3"
        class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
        placeholder="Any notes regarding this altar call..."
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
