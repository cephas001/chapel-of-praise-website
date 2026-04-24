<template>
  <form @submit.prevent="handleSubmit" class="space-y-5 pb-8 font-montserrat">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Male Students</label
        >
        <input
          v-model.number="formData.maleStudents"
          type="number"
          min="0"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        />
      </div>
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Female Students</label
        >
        <input
          v-model.number="formData.femaleStudents"
          type="number"
          min="0"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Male Visitors</label
        >
        <input
          v-model.number="formData.maleVisitors"
          type="number"
          min="0"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        />
      </div>
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Female Visitors</label
        >
        <input
          v-model.number="formData.femaleVisitors"
          type="number"
          min="0"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        />
      </div>
    </div>

    <div
      class="bg-purple-50 p-4 rounded-xl border border-purple-100 mt-4 flex justify-between items-center"
    >
      <span class="text-sm font-bold text-purple-900">Total Head Count</span>
      <span class="text-xl font-black text-purple-700">{{ totalCount }}</span>
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-900 mb-1.5"
        >Additional Comments</label
      >
      <textarea
        v-model="formData.additionalComments"
        rows="3"
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium resize-none"
        placeholder="Any notes about the attendance..."
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
