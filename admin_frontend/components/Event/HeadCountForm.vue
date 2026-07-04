<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 pt-2 font-poppins">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Male Students</label
        >
        <input
          v-model.number="formData.maleStudents"
          type="number"
          min="0"
          required
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
        />
      </div>
      <div>
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Female Students</label
        >
        <input
          v-model.number="formData.femaleStudents"
          type="number"
          min="0"
          required
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
        />
      </div>

      <div>
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Male Visitors</label
        >
        <input
          v-model.number="formData.maleVisitors"
          type="number"
          min="0"
          required
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
        />
      </div>
      <div>
        <label
          class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >Female Visitors</label
        >
        <input
          v-model.number="formData.femaleVisitors"
          type="number"
          min="0"
          required
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
        />
      </div>
    </div>

    <div
      class="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4 flex justify-between items-center"
    >
      <span
        class="text-xs md:text-sm font-bold text-gray-900 font-jetbrains uppercase tracking-wide"
        >Total Head Count</span
      >
      <span class="text-xl font-black text-black font-jetbrains">{{
        totalCount
      }}</span>
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
        placeholder="Any notes about the attendance..."
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
        {{ isEditing ? "Save Changes" : "Submit Head Count" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";

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
  maleStudents: 0,
  femaleStudents: 0,
  maleVisitors: 0,
  femaleVisitors: 0,
  additionalComments: "",
});

const totalCount = computed(() => {
  return (
    (formData.maleStudents || 0) +
    (formData.femaleStudents || 0) +
    (formData.maleVisitors || 0) +
    (formData.femaleVisitors || 0)
  );
});

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      Object.assign(formData, newVal);
      isEditing.value = true;
    } else {
      Object.assign(formData, {
        maleStudents: 0,
        femaleStudents: 0,
        maleVisitors: 0,
        femaleVisitors: 0,
        additionalComments: "",
      });
      isEditing.value = false;
    }
  },
  { immediate: true },
);

const handleSubmit = () => {
  emit("submit", { ...formData });
};
</script>
