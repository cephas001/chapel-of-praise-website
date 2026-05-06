<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-montserrat"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-black text-gray-900 tracking-tight">
          Chapel of Praise
        </h2>
        <p class="mt-2 text-sm text-gray-600 font-medium">
          Official Worker Registration Portal
        </p>
      </div>

      <div
        class="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100"
      >
        <div v-if="successMessage" class="text-center py-12">
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6"
          >
            <Icon name="heroicons:check" class="h-8 w-8 text-green-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            Registration Complete!
          </h3>
          <p class="text-gray-500 mb-8 max-w-sm mx-auto">
            {{ successMessage }}
          </p>
          <button
            @click="resetForm"
            class="inline-flex justify-center rounded-xl border border-transparent bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 transition-colors"
          >
            Register Another Worker
          </button>
        </div>

        <form v-else @submit.prevent="handleRegister" class="space-y-8">
          <div
            class="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4"
          >
            <h4
              class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center"
            >
              <Icon
                name="heroicons:shield-check"
                class="w-4 h-4 mr-2 text-gray-400"
              />
              Unit Authentication
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-1.5"
                  >Select Your Unit</label
                >
                <div class="relative">
                  <select
                    v-model="formData.chapelUnit"
                    required
                    class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
                  >
                    <option value="" disabled>Choose Unit...</option>
                    <option
                      v-for="unit in availableUnits"
                      :key="unit"
                      :value="unit"
                    >
                      {{ unit }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
                  >
                    <Icon
                      name="heroicons:chevron-down"
                      class="h-4 w-4 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-900 mb-1.5"
                  >Unit Passkey</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <Icon name="heroicons:key" class="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    v-model="formData.passkey"
                    type="password"
                    required
                    class="block w-full pl-9 pr-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium uppercase"
                    placeholder="Enter 6-character key"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4
              class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2"
            >
              Personal Information
            </h4>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-1.5"
                  >Full Name</label
                >
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
                  placeholder="Surname Firstname"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-900 mb-1.5"
                    >Gender</label
                  >
                  <select
                    v-model="formData.gender"
                    required
                    class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
                  >
                    <option value="" disabled>Select</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
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

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="student@mcpherson.edu.ng"
                />
              </div>
            </div>
          </div>

          <div>
            <h4
              class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2"
            >
              Academic Profile
            </h4>

            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-900 mb-1.5"
                    >Matric Number</label
                  >
                  <input
                    v-model="formData.matricNumber"
                    type="text"
                    required
                    class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-900 mb-1.5"
                    >Level</label
                  >
                  <select
                    v-model="formData.level"
                    required
                    class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
                  >
                    <option value="" disabled>Select</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label class="block text-sm font-bold text-gray-900 mb-1.5"
                    >Relationship Status</label
                  >
                  <select
                    v-model="formData.relationshipStatus"
                    required
                    class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg sm:text-sm transition-colors text-black font-medium appearance-none bg-white"
                  >
                    <option value="" disabled>Select</option>
                    <option value="SINGLE">SINGLE</option>
                    <option value="IN A RELATIONSHIP">IN A RELATIONSHIP</option>
                    <option value="ENGAGED">ENGAGED</option>
                    <option value="MARRIED">MARRIED</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="errorMessage"
            class="rounded-xl bg-red-50 p-4 border border-red-100"
          >
            <div class="flex">
              <Icon
                name="heroicons:x-circle"
                class="h-5 w-5 text-red-400 mr-3 shrink-0"
              />
              <h3 class="text-sm font-semibold text-red-800">
                {{ errorMessage }}
              </h3>
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer items-center"
            >
              <Icon
                v-if="loading"
                name="heroicons:arrow-path"
                class="mr-2 h-5 w-5 animate-spin"
              />
              {{
                loading ? "Verifying & Submitting..." : "Complete Registration"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRuntimeConfig } from "#app";

// This is the public frontend, so no authStore is needed here.
const config = useRuntimeConfig();

const availableUnits = [
  "Choir",
  "Editorial",
  "Ushering",
  "Protocol",
  "Media",
  "Prayer",
  "Drama",
  "Bible Study",
  "Evangelism",
  "Technical",
  "Welfare",
  "Academic",
];

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const formData = reactive({
  chapelUnit: "",
  passkey: "",
  name: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
  whatsappPhoneNumber: "",
  emailAddress: "",
  matricNumber: "",
  level: "",
  schoolDepartment: "",
  relationshipStatus: "",
});

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Note: No Authorization header needed as this is a public route
    const response = await $fetch(
      `${config.public.apiBaseUrl}/members/register-worker`,
      {
        method: "POST",
        body: formData,
      },
    );

    successMessage.value = `You have successfully registered as a worker in the ${formData.chapelUnit} unit. Your unit head has been notified.`;
  } catch (error) {
    console.error(error);
    errorMessage.value =
      error.data?.error ||
      "Registration failed. Please check your passkey and try again.";
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  successMessage.value = "";
  Object.keys(formData).forEach((key) => (formData[key] = ""));
};
</script>
