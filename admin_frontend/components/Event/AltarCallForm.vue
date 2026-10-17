<template>
  <form class="space-y-6 pt-2" @submit.prevent="handleSubmit">
    <div>
      <label
        for="altar-call-type"
        class="block text-xs font-medium text-ink mb-2"
        >Altar Call Category</label
      >
      <div class="relative">
        <select
          id="altar-call-type"
          v-model="formData.callType"
          required
          class="w-full appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
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
          <Icon name="heroicons:chevron-down" class="h-4 w-4 text-muted" />
        </div>
      </div>
    </div>

    <div>
      <label
        for="altar-call-responders"
        class="block text-xs font-medium text-ink mb-2"
        >Number of Responders</label
      >
      <input
        id="altar-call-responders"
        v-model.number="formData.totalResponders"
        type="number"
        min="1"
        required
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        placeholder="e.g. 25"
      >
    </div>

    <div>
      <label
        for="altar-call-comments"
        class="block text-xs font-medium text-ink mb-2"
        >Additional Comments</label
      >
      <textarea
        id="altar-call-comments"
        v-model="formData.additionalComments"
        rows="3"
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
        placeholder="Any notes regarding this altar call..."
      />
    </div>

    <div class="pt-6 border-t border-line">
      <AppButton
        type="submit"
        size="lg"
        :loading="loading"
        class="w-full"
      >
        Record altar call
      </AppButton>
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
  callType: "",
  totalResponders: "",
  additionalComments: "",
});

const handleSubmit = () => {
  emit("submit", { ...formData });
};

const resetForm = () => {
  formData.callType = "";
  formData.totalResponders = "";
  formData.additionalComments = "";
};

const isDirty = () =>
  Boolean(
    formData.callType || formData.totalResponders || formData.additionalComments,
  );

defineExpose({ resetForm, isDirty });
</script>
