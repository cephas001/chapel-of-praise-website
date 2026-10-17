<template>
  <form class="space-y-6 pt-2" @submit.prevent="handleSubmit">
    <div>
      <label
        for="responder-full-name"
        class="block text-xs font-medium text-ink mb-2"
        >Full Name</label
      >
      <input
        id="responder-full-name"
        v-model="formData.fullName"
        type="text"
        required
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        placeholder="e.g. Osifowora Abolaji"
      >
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          for="responder-gender"
          class="block text-xs font-medium text-ink mb-2"
          >Gender</label
        >
        <div class="relative">
          <select
            id="responder-gender"
            v-model="formData.gender"
            required
            class="w-full appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          >
            <option value="" disabled>Select</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
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
          for="responder-phone"
          class="block text-xs font-medium text-ink mb-2"
          >Phone Number</label
        >
        <input
          id="responder-phone"
          v-model="formData.phoneNumber"
          type="tel"
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          placeholder="090..."
        >
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 border-t border-line pt-5 mt-2">
      <div class="col-span-2">
        <label
          for="responder-hostel"
          class="block text-xs font-medium text-ink mb-2"
          >Hostel</label
        >
        <input
          id="responder-hostel"
          v-model="formData.hostel"
          type="text"
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          placeholder="e.g. Faye Curtis 1"
        >
      </div>
      <div>
        <label
          for="responder-room"
          class="block text-xs font-medium text-ink mb-2"
          >Room</label
        >
        <input
          id="responder-room"
          v-model="formData.roomNumber"
          type="text"
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          placeholder="e.g. 37"
        >
      </div>
    </div>

    <div class="border-t border-line pt-5 mt-2">
      <label
        for="responder-assigned-to"
        class="block text-xs font-medium text-ink mb-2"
        >Assign Follow-up To (Optional)</label
      >
      <input
        id="responder-assigned-to"
        v-model="formData.assignedTo"
        type="text"
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        placeholder="Name of Evangelism team member..."
      >
    </div>

    <div>
      <label
        for="responder-notes"
        class="block text-xs font-medium text-ink mb-2"
        >Notes</label
      >
      <textarea
        id="responder-notes"
        v-model="formData.notes"
        rows="2"
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
        placeholder="Any specific prayer points or comments..."
      />
    </div>

    <div class="pt-6 border-t border-line">
      <AppButton
        type="submit"
        size="lg"
        :loading="loading"
        class="w-full"
      >
        Record response
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
