<template>
  <div class="w-full bg-paper text-ink">
    <AppPageHero
      priority
      kicker="Chapel of praise"
      title="Workers biodata"
      :image="heroImage"
      :fallback="heroImages.celebrations"
    />

    <section class="bg-surface py-16 md:py-24">
      <AppContainer>
        <div
          class="mx-auto max-w-3xl rounded-2xl border border-line bg-paper p-6 md:p-10"
        >
          <div v-if="successMessage">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700"
            >
              <Icon name="heroicons:check" class="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 class="mt-5 text-xl font-semibold">Registration complete</h2>
            <p class="mt-3 text-base font-light leading-7 text-gray-600">
              {{ successMessage }}
            </p>
            <AppButton variant="ghost" class="mt-6" @click="resetForm">
              Register another worker
            </AppButton>
          </div>

          <form v-else class="space-y-10" @submit.prevent="handleRegister">
            <div>
              <h2 class="border-b border-line pb-3 text-lg font-semibold">
                Unit verification
              </h2>
              <div class="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <AppField
                  id="chapelUnit"
                  v-model="formData.chapelUnit"
                  as="select"
                  label="Your unit"
                  required
                >
                  <option value="" disabled>Select your unit</option>
                  <option
                    v-for="unit in availableUnits"
                    :key="unit"
                    :value="unit"
                  >
                    {{ unit }}
                  </option>
                </AppField>

                <AppField
                  id="passkey"
                  v-model="passkeyModel"
                  :type="showPasskey ? 'text' : 'password'"
                  label="Unit passkey"
                  maxlength="32"
                  placeholder="Enter your unit passkey"
                  autocomplete="off"
                  autocapitalize="characters"
                  required
                >
                  <template #suffix>
                    <button
                      type="button"
                      class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                      :aria-label="
                        showPasskey ? 'Hide passkey' : 'Show passkey'
                      "
                      :aria-pressed="showPasskey"
                      @click="showPasskey = !showPasskey"
                    >
                      <Icon
                        :name="
                          showPasskey ? 'heroicons:eye-slash' : 'heroicons:eye'
                        "
                        class="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </template>
                </AppField>
              </div>
            </div>

            <div>
              <h2 class="border-b border-line pb-3 text-lg font-semibold">
                Personal information
              </h2>
              <div class="mt-5 space-y-6">
                <AppField
                  id="name"
                  v-model="formData.name"
                  label="Full name"
                  autocomplete="name"
                  maxlength="150"
                  placeholder="Surname Firstname"
                  required
                />

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <AppField
                    id="gender"
                    v-model="formData.gender"
                    as="select"
                    label="Gender"
                    required
                  >
                    <option value="" disabled>Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </AppField>

                  <AppField
                    id="dateOfBirth"
                    v-model="formData.dateOfBirth"
                    type="date"
                    label="Date of birth"
                    required
                  />
                </div>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <AppField
                    id="phoneNumber"
                    v-model="formData.phoneNumber"
                    type="tel"
                    label="Phone number"
                    autocomplete="tel"
                    maxlength="32"
                    placeholder="090..."
                    required
                  />

                  <AppField
                    id="whatsappPhoneNumber"
                    v-model="formData.whatsappPhoneNumber"
                    type="tel"
                    label="WhatsApp number"
                    autocomplete="tel"
                    maxlength="32"
                    placeholder="090..."
                    required
                  />
                </div>

                <AppField
                  id="emailAddress"
                  v-model="formData.emailAddress"
                  type="email"
                  label="Email address"
                  autocomplete="email"
                  maxlength="254"
                  placeholder="flourish@gmail.com"
                  required
                />
              </div>
            </div>

            <div>
              <h2 class="border-b border-line pb-3 text-lg font-semibold">
                Academic profile
              </h2>
              <div class="mt-5 space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <AppField
                    id="matricNumber"
                    v-model="formData.matricNumber"
                    label="Matric number"
                    maxlength="50"
                    required
                  />

                  <AppField
                    id="level"
                    v-model="formData.level"
                    as="select"
                    label="Level"
                    required
                  >
                    <option value="" disabled>Select</option>
                    <option value="100">100 level</option>
                    <option value="200">200 level</option>
                    <option value="300">300 level</option>
                    <option value="400">400 level</option>
                    <option value="500">500 level</option>
                  </AppField>
                </div>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <AppField
                    id="schoolDepartment"
                    v-model="formData.schoolDepartment"
                    label="School department"
                    maxlength="150"
                    placeholder="e.g. Computer Science"
                    required
                  />

                  <AppField
                    id="relationshipStatus"
                    v-model="formData.relationshipStatus"
                    as="select"
                    label="Relationship status"
                    required
                  >
                    <option value="" disabled>Select</option>
                    <option value="SINGLE">Single</option>
                    <option value="IN A RELATIONSHIP">In a relationship</option>
                    <option value="ENGAGED">Engaged</option>
                    <option value="MARRIED">Married</option>
                  </AppField>
                </div>
              </div>
            </div>

            <div
              v-if="errorMessage"
              role="alert"
              class="flex gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4"
            >
              <Icon
                name="heroicons:x-circle"
                class="h-5 w-5 shrink-0 text-brand-600"
                aria-hidden="true"
              />
              <p class="text-sm font-medium text-brand-700">
                {{ errorMessage }}
              </p>
            </div>

            <AppButton type="submit" :loading="loading" class="w-full">
              {{ loading ? "Submitting..." : "Complete registration" }}
            </AppButton>
          </form>
        </div>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRuntimeConfig, useSeoMeta } from "#app";
import { heroImages } from "~/utils/staticImages";

const heroImage = heroImages.celebrations.src;

useSeoMeta({
  title: "Workers Biodata | Chapel of Praise",
  description: "Official worker registration portal for Chapel of Praise.",
  robots: "noindex, nofollow",
});

const config = useRuntimeConfig();

const availableUnits = ref([]);
const showPasskey = ref(false);

onMounted(async () => {
  try {
    availableUnits.value = await $fetch(
      `${config.public.apiBaseUrl}/members/units`,
    );
  } catch (error) {
    console.error("Failed to load chapel units", error);
  }
});

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

const passkeyModel = computed({
  get: () => formData.passkey,
  set: (value) => {
    formData.passkey = String(value ?? "").toUpperCase();
  },
});

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await $fetch(`${config.public.apiBaseUrl}/members/register-worker`, {
      method: "POST",
      body: formData,
    });

    successMessage.value = `You have successfully registered as a worker in the ${formData.chapelUnit} unit. Your unit head has been notified.`;
  } catch (error) {
    errorMessage.value =
      error.data?.error ||
      "Registration failed. Please check your passkey and try again.";
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  successMessage.value = "";
  showPasskey.value = false;
  Object.keys(formData).forEach((key) => (formData[key] = ""));
};
</script>
