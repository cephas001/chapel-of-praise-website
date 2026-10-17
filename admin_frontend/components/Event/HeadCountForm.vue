<template>
  <form class="space-y-6 pt-2" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          for="headcount-male-students"
          class="block text-xs font-medium text-ink mb-2"
          >Male Students</label
        >
        <input
          id="headcount-male-students"
          v-model.number="formData.maleStudents"
          type="number"
          min="0"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        >
      </div>
      <div>
        <label
          for="headcount-female-students"
          class="block text-xs font-medium text-ink mb-2"
          >Female Students</label
        >
        <input
          id="headcount-female-students"
          v-model.number="formData.femaleStudents"
          type="number"
          min="0"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        >
      </div>

      <div>
        <label
          for="headcount-male-visitors"
          class="block text-xs font-medium text-ink mb-2"
          >Male Visitors</label
        >
        <input
          id="headcount-male-visitors"
          v-model.number="formData.maleVisitors"
          type="number"
          min="0"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        >
      </div>
      <div>
        <label
          for="headcount-female-visitors"
          class="block text-xs font-medium text-ink mb-2"
          >Female Visitors</label
        >
        <input
          id="headcount-female-visitors"
          v-model.number="formData.femaleVisitors"
          type="number"
          min="0"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        >
      </div>
    </div>

    <div
      class="bg-subtle p-4 rounded-surface border border-line mt-4 flex justify-between items-center"
    >
      <span
        class="text-xs md:text-sm font-semibold text-ink"
        >Total Head Count</span
      >
      <span class="font-mono text-xl font-semibold text-ink">{{
        totalCount
      }}</span>
    </div>

    <div>
      <label
        for="headcount-additional-comments"
        class="block text-xs font-medium text-ink mb-2"
        >Additional Comments</label
      >
      <textarea
        id="headcount-additional-comments"
        v-model="formData.additionalComments"
        rows="3"
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
        placeholder="Any notes about the attendance..."
      />
    </div>

    <div class="pt-6 border-t border-line">
      <AppButton
        type="submit"
        size="lg"
        :loading="loading"
        class="w-full"
      >
        {{ isEditing ? "Save changes" : "Submit head count" }}
      </AppButton>
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
