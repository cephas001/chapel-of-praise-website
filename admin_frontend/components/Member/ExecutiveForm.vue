<template>
  <form class="space-y-6 pt-2" @submit.prevent="handleSubmit">
    <div>
      <label
        for="executive-name"
        class="block text-xs font-medium text-ink mb-2"
        >Full Name</label
      >
      <input
        id="executive-name"
        v-model="formData.name"
        type="text"
        required
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        placeholder="e.g. John Doe"
      >
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          for="executive-gender"
          class="block text-xs font-medium text-ink mb-2"
          >Gender</label
        >
        <div class="relative">
          <select
            id="executive-gender"
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
          for="executive-dob"
          class="block text-xs font-medium text-ink mb-2"
          >Date of Birth</label
        >
        <input
          id="executive-dob"
          v-model="formData.dateOfBirth"
          type="date"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        >
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          for="executive-phone"
          class="block text-xs font-medium text-ink mb-2"
          >Phone Number</label
        >
        <input
          id="executive-phone"
          v-model="formData.phoneNumber"
          type="tel"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          placeholder="090..."
        >
      </div>
      <div>
        <label
          for="executive-whatsapp"
          class="block text-xs font-medium text-ink mb-2"
          >WhatsApp Number</label
        >
        <input
          id="executive-whatsapp"
          v-model="formData.whatsappPhoneNumber"
          type="tel"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          placeholder="090..."
        >
      </div>
    </div>

    <div>
      <label
        for="executive-email"
        class="block text-xs font-medium text-ink mb-2"
        >Email Address</label
      >
      <input
        id="executive-email"
        v-model="formData.emailAddress"
        type="email"
        required
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        placeholder="executive@example.com"
      >
    </div>

    <div class="grid grid-cols-2 gap-4 border-t border-line pt-5 mt-2">
      <div>
        <label
          for="executive-matric"
          class="block text-xs font-medium text-ink mb-2"
          >Matric Number</label
        >
        <input
          id="executive-matric"
          v-model="formData.matricNumber"
          type="text"
          required
          class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          placeholder="e.g. 21010101"
        >
      </div>
      <div>
        <label
          for="executive-level"
          class="block text-xs font-medium text-ink mb-2"
          >Level</label
        >
        <div class="relative">
          <select
            id="executive-level"
            v-model="formData.level"
            required
            class="w-full appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          >
            <option value="" disabled>Select Level</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <Icon name="heroicons:chevron-down" class="h-4 w-4 text-muted" />
          </div>
        </div>
      </div>
    </div>

    <div>
      <label
        for="executive-department"
        class="block text-xs font-medium text-ink mb-2"
        >School Department</label
      >
      <input
        id="executive-department"
        v-model="formData.schoolDepartment"
        type="text"
        required
        class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
        placeholder="e.g. Computer Science"
      >
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label
          for="executive-chapel-unit"
          class="block text-xs font-medium text-ink mb-2"
          >Chapel Unit</label
        >
        <div class="relative">
          <select
            id="executive-chapel-unit"
            v-model="formData.chapelUnit"
            required
            class="w-full appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          >
            <option value="" disabled>Select Unit</option>
            <option v-for="unit in availableUnits" :key="unit" :value="unit">
              {{ unit }}
            </option>
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
          for="executive-relationship"
          class="block text-xs font-medium text-ink mb-2"
          >Relationship Status</label
        >
        <div class="relative">
          <select
            id="executive-relationship"
            v-model="formData.relationshipStatus"
            required
            class="w-full appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
          >
            <option value="" disabled>Select Status</option>
            <option value="SINGLE">SINGLE</option>
            <option value="IN A RELATIONSHIP">IN A RELATIONSHIP</option>
            <option value="ENGAGED">ENGAGED</option>
            <option value="MARRIED">MARRIED</option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <Icon name="heroicons:chevron-down" class="h-4 w-4 text-muted" />
          </div>
        </div>
      </div>
    </div>

    <div class="pt-4">
      <AppButton
        type="submit"
        size="lg"
        :loading="loading"
        class="w-full"
      >
        {{ isEditing ? "Save changes" : "Register executive" }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";

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
  name: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  whatsappPhoneNumber: "",
  emailAddress: "",
  matricNumber: "",
  level: "",
  schoolDepartment: "",
  chapelUnit: "",
  relationshipStatus: "",
});

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      Object.assign(formData, newVal);
      isEditing.value = true;
    } else {
      // Reset form
      Object.assign(formData, {
        name: "",
        gender: "",
        dateOfBirth: "",
        phoneNumber: "",
        whatsappPhoneNumber: "",
        emailAddress: "",
        matricNumber: "",
        level: "",
        schoolDepartment: "",
        chapelUnit: "",
        relationshipStatus: "",
      });
      isEditing.value = false;
    }
  },
  { immediate: true },
);

const { units: availableUnits, loadUnits } = useChapelUnits();

onMounted(loadUnits);

const handleSubmit = () => {
  emit("submit", { ...formData });
};
</script>
