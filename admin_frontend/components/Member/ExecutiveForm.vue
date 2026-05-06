<template>
  <form @submit.prevent="handleSubmit" class="space-y-5 pb-8 font-montserrat">
    <div>
      <label class="block text-sm font-bold text-gray-900 mb-1.5"
        >Full Name</label
      >
      <input
        v-model="formData.name"
        type="text"
        required
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        placeholder="e.g. John Doe"
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
          >Date of Birth</label
        >
        <input
          v-model="formData.dateOfBirth"
          type="date"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Phone Number</label
        >
        <input
          v-model="formData.phoneNumber"
          type="tel"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
          placeholder="090..."
        />
      </div>
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >WhatsApp Number</label
        >
        <input
          v-model="formData.whatsappPhoneNumber"
          type="tel"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
          placeholder="090..."
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-900 mb-1.5"
        >Email Address</label
      >
      <input
        v-model="formData.emailAddress"
        type="email"
        required
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        placeholder="executive@example.com"
      />
    </div>

    <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 mt-5">
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Matric Number</label
        >
        <input
          v-model="formData.matricNumber"
          type="text"
          required
          class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
          placeholder="e.g. 21010101"
        />
      </div>
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Level</label
        >
        <div class="relative">
          <select
            v-model="formData.level"
            required
            class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
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
            <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-900 mb-1.5"
        >School Department</label
      >
      <input
        v-model="formData.schoolDepartment"
        type="text"
        required
        class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
        placeholder="e.g. Computer Science"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-bold text-gray-900 mb-1.5"
          >Chapel Unit</label
        >
        <div class="relative">
          <select
            v-model="formData.chapelUnit"
            required
            class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
          >
            <option value="" disabled>Select Unit</option>
            <option value="Choir">Choir</option>
            <option value="Editorial">Editorial</option>
            <option value="Ushering">Ushering</option>
            <option value="Protocol">Protocol</option>
            <option value="Media">Media</option>
            <option value="Prayer">Prayer</option>
            <option value="Drama">Drama</option>
            <option value="Bible Study">Bible Study</option>
            <option value="Evangelism">Evangelism</option>
            <option value="Technical">Technical</option>
            <option value="Welfare">Welfare</option>
            <option value="Academic">Academic</option>
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
          >Relationship Status</label
        >
        <div class="relative">
          <select
            v-model="formData.relationshipStatus"
            required
            class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
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
            <Icon name="heroicons:chevron-down" class="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
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
        {{ isEditing ? "Save Changes" : "Register Executive" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch } from "vue";

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

const handleSubmit = () => {
  emit("submit", { ...formData });
};
</script>
