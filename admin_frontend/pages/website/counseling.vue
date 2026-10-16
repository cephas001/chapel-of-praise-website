<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Counseling Page Management
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Manage text and sections on the website's Counseling page.
      </p>
    </div>

    <form
      class="space-y-13 border-t border-gray-200 pt-7"
      @submit.prevent="saveSettings"
    >
      <!-- Hero Banner -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            Hero Banner
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the top banner of the counseling page.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="counseling-hero-kicker"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Kicker</label
              >
              <input
                id="counseling-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Need Help?"
              >
            </div>
            <div>
              <label
                for="counseling-hero-headline"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Headline</label
              >
              <input
                id="counseling-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Request Counseling"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="counseling-hero-image"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Background Image URL</label
              >
              <MediaPickerInput
                v-model="heroSection.heroImage"
                input-id="counseling-hero-image"
              />
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.heroSection"
              @click="handleSaveSection('heroSection', heroSection)"
            />
          </div>
        </div>
      </div>

      <!-- Form Details -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            Form Details
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Manage the heading, description, and footer note for the counseling
            form.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 gap-6">
            <div>
              <label
                for="counseling-form-heading"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Form Heading</label
              >
              <input
                id="counseling-form-heading"
                v-model="formSection.formHeading"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Schedule a Session"
              >
            </div>
            <div>
              <label
                for="counseling-form-description"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Form Description</label
              >
              <textarea
                id="counseling-form-description"
                v-model="formSection.formDescription"
                rows="4"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                placeholder="Enter a brief description..."
              />
            </div>
            <div>
              <label
                for="counseling-form-footer-note"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Form Footer Note</label
              >
              <input
                id="counseling-form-footer-note"
                v-model="formSection.formFooterNote"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Your information is kept confidential."
              >
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.formSection"
              @click="handleSaveSection('formSection', formSection)"
            />
          </div>
        </div>
      </div>

      <!-- Sticky Footer -->
      <div
        class="fixed bottom-0 right-0 w-full md:w-[calc(100%-18rem)] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-end space-x-4 z-30"
      >
        <button
          type="button"
          class="px-5 py-2.5 text-xs md:text-sm text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-jetbrains"
          :disabled="isSaving"
          @click="loadSettings"
        >
          Discard
        </button>
        <button
          type="submit"
          :disabled="isSaving"
          class="inline-flex items-center justify-center rounded-xl bg-black px-8 py-3 text-xs md:text-sm text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
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
  formFooterNote: "",
});

const sectionsMap = {
  heroSection,
  formSection,
};

// State for individual section saves
const sectionSavingState = reactive({
  heroSection: false,
  formSection: false,
});

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings, saveSection } =
  usePageManager("counselling", sectionsMap, { reloadOnSave: true });

// Section-specific save handler
const handleSaveSection = async (sectionKey, sectionData) => {
  sectionSavingState[sectionKey] = true;
  try {
    await saveSection(sectionKey, sectionData);
  } finally {
    sectionSavingState[sectionKey] = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>
