<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <NuxtLink
          to="/"
          class="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-2"
        >
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
          Back to Dashboard
        </NuxtLink>
        <h1 class="text-3xl font-black text-black tracking-tight font-roboto">
          Contact Page Management
        </h1>
        <p class="text-gray-500 mt-1">
          Manage text and sections on the Contact page.
        </p>
      </div>
    </div>

    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900">Loading Configuration...</h3>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
      <form @submit.prevent="saveSettings" class="space-y-8">
        
        <!-- Hero Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Hero Section
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-black mb-1">Hero Kicker</label>
              <input
                v-model="formData.heroKicker"
                type="text"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Get in touch"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Hero Headline</label>
              <input
                v-model="formData.heroHeadline"
                type="text"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Hero Image URL</label>
              <input
                v-model="formData.heroImage"
                type="url"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Form Section
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Form Heading</label>
              <input
                v-model="formData.formHeading"
                type="text"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Form Description</label>
              <textarea
                v-model="formData.formDescription"
                rows="3"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Campus Info -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Campus Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-black mb-1">Campus Location Name</label>
              <input
                v-model="formData.campusName"
                type="text"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Campus Address</label>
              <textarea
                v-model="formData.campusAddress"
                rows="2"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Service Times Title</label>
              <input
                v-model="formData.serviceTimesTitle"
                type="text"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Service Times Details</label>
              <textarea
                v-model="formData.serviceTimesDetails"
                rows="2"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Contact Methods -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Contact Methods & Social
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-black mb-1">Email</label>
              <input
                v-model="formData.email"
                type="email"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Phone</label>
              <input
                v-model="formData.phone"
                type="text"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Instagram URL</label>
              <input
                v-model="formData.instagramUrl"
                type="url"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Twitter URL</label>
              <input
                v-model="formData.twitterUrl"
                type="url"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Youtube URL</label>
              <input
                v-model="formData.youtubeUrl"
                type="url"
                class="block w-full rounded-xl border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex justify-center items-center rounded-xl border border-transparent bg-black px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            <Icon
              v-if="isSaving"
              name="heroicons:arrow-path"
              class="animate-spin -ml-1 mr-2 h-5 w-5"
            />
            {{ isSaving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAlertModal } from "~/composables/useAlertModal";

const config = useRuntimeConfig();
const { showAlert } = useAlertModal();

const isFetching = ref(true);
const isSaving = ref(false);

const formData = reactive({
  heroKicker: "",
  heroHeadline: "",
  heroImage: "",
  formHeading: "",
  formDescription: "",
  campusName: "",
  campusAddress: "",
  serviceTimesTitle: "",
  serviceTimesDetails: "",
  email: "",
  phone: "",
  instagramUrl: "",
  twitterUrl: "",
  youtubeUrl: ""
});

const loadSettings = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/admin/contact`);
    if (response) {
      Object.keys(formData).forEach(key => {
        if (response[key] !== undefined) {
          formData[key] = response[key];
        }
      });
    }
  } catch (err) {
    showAlert("Error", "Failed to load contact settings.");
    console.error(err);
  } finally {
    isFetching.value = false;
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/admin/contact`, {
      method: "PUT",
      body: formData,
    });
    showAlert("Success", "Contact settings saved successfully!");
  } catch (err) {
    showAlert("Error", "Failed to save contact settings.");
    console.error(err);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>