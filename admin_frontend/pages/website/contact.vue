<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Contact Page Management
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Manage text and sections on the Contact page.
      </p>
    </div>

    <form
      @submit.prevent="saveSettings"
      class="space-y-13 border-t border-gray-200 pt-7"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Hero Section
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the top banner of the contact page.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Kicker</label
              >
              <input
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Get in touch"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Headline</label
              >
              <input
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Image URL</label
              >
              <input
                v-model="heroSection.heroImage"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Form Section
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Manage the heading and description for the contact form.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Form Heading</label
              >
              <input
                v-model="formSection.formHeading"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Form Description</label
              >
              <textarea
                v-model="formSection.formDescription"
                rows="3"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Campus Information
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Update physical location details and service times.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Campus Location Name</label
              >
              <input
                v-model="campusSection.campusName"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Service Times Title</label
              >
              <input
                v-model="campusSection.serviceTimesTitle"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Campus Address</label
              >
              <textarea
                v-model="campusSection.campusAddress"
                rows="2"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Service Times Details</label
              >
              <textarea
                v-model="campusSection.serviceTimesDetails"
                rows="2"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Contact Methods & Social
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Set up the public email, phone numbers, and social media links.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Email</label
              >
              <input
                v-model="contactSection.email"
                type="email"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Phone</label
              >
              <input
                v-model="contactSection.phone"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Instagram URL</label
              >
              <input
                v-model="contactSection.instagramUrl"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Twitter URL</label
              >
              <input
                v-model="contactSection.twitterUrl"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Youtube URL</label
              >
              <input
                v-model="contactSection.youtubeUrl"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="fixed bottom-0 right-0 w-full md:w-[calc(100%-18rem)] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-end space-x-4 z-30"
      >
        <button
          type="button"
          @click="loadSettings"
          class="px-5 py-2.5 text-xs md:text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-jetbrains"
          :disabled="isSaving"
        >
          Discard
        </button>
        <button
          type="submit"
          :disabled="isSaving"
          class="inline-flex items-center justify-center rounded-xl bg-black px-8 py-3 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
        >
          <Icon
            v-if="isSaving"
            name="heroicons:arrow-path"
            class="mr-2 h-5 w-5 animate-spin"
          />
          {{ isSaving ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";

definePageMeta({
  allowedUserTypes: ["website"],
});

const heroSection = reactive({
  heroKicker: "",
  heroHeadline: "",
  heroImage: "",
});

const formSection = reactive({
  formHeading: "",
  formDescription: "",
});

const campusSection = reactive({
  campusName: "",
  campusAddress: "",
  serviceTimesTitle: "",
  serviceTimesDetails: "",
});

const contactSection = reactive({
  email: "",
  phone: "",
  instagramUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
});

const sectionsMap = {
  heroSection,
  formSection,
  campusSection,
  contactSection,
};

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings } = usePageManager(
  "contact",
  sectionsMap,
  { reloadOnSave: true },
);

onMounted(() => {
  loadSettings();
});
</script>
