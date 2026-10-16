<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        About Page Management
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Manage text and sections on the website's About page.
      </p>
    </div>

    <!-- Main Form -->
    <form
      class="space-y-13 border-t border-gray-200 pt-7"
      @submit.prevent="saveSettings"
    >
      <!-- Section 1: Hero Banner -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            Hero Banner
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the hero section of the about page.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="about-hero-kicker"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Kicker</label
              >
              <input
                id="about-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. The family at COP"
              >
            </div>
            <div>
              <label
                for="about-hero-headline"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Headline</label
              >
              <input
                id="about-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="about-hero-image"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Background Image URL</label
              >
              <MediaPickerInput
                v-model="heroSection.heroImage"
                input-id="about-hero-image"
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

      <!-- Vision / Mission Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            Vision & Mission Section
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Manage the core vision statements and descriptive columns.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="about-vision-headline-black"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Section Headline (Black Text)</label
              >
              <input
                id="about-vision-headline-black"
                v-model="visionSection.visionHeadlineBlack"
                type="text"
                class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. We serve God"
              >
            </div>
            <div>
              <label
                for="about-vision-headline-colored"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Section Headline (Colored Text)</label
              >
              <input
                id="about-vision-headline-colored"
                v-model="visionSection.visionHeadlineColored"
                type="text"
                class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. By His Spirit"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="about-vision-content-1"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Content Column 1</label
              >
              <textarea
                id="about-vision-content-1"
                v-model="visionSection.visionContentCol1"
                rows="6"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                placeholder="Enter the first column of text..."
              />
            </div>
            <div class="md:col-span-2">
              <label
                for="about-vision-content-2"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Content Column 2</label
              >
              <textarea
                id="about-vision-content-2"
                v-model="visionSection.visionContentCol2"
                rows="6"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                placeholder="Enter the second column of text..."
              />
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.visionSection"
              @click="handleSaveSection('visionSection', visionSection)"
            />
          </div>
        </div>
      </div>

      <!-- Sticky Footer -->
      <div
        class="fixed bottom-0 right-0 w-full md:w-[calc(100%-18rem)] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-end z-30"
      >
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

const visionSection = reactive({
  visionHeadlineBlack: "",
  visionHeadlineColored: "",
  visionContentCol1: "",
  visionContentCol2: "",
});

const sectionsMap = {
  heroSection,
  visionSection,
};

// State for individual section saves
const sectionSavingState = reactive({
  heroSection: false,
  visionSection: false,
});

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings, saveSection } =
  usePageManager("about", sectionsMap, { reloadOnSave: true });

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
