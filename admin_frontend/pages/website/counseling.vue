<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <AppHeading
      class="mb-8"
      title="Counseling page management"
      subtitle="Manage text and sections on the website's Counseling page."
    />

    <form
      class="space-y-13 border-t border-line pt-7"
      @submit.prevent="saveSettings"
    >
      <!-- Hero Banner -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Hero Banner
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Configure the top banner of the counseling page.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="counseling-hero-kicker"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Kicker</label
              >
              <input
                id="counseling-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Need Help?"
              >
            </div>
            <div>
              <label
                for="counseling-hero-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Headline</label
              >
              <input
                id="counseling-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Request Counseling"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="counseling-hero-image"
                class="block text-xs font-medium text-ink mb-2"
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
        </AppCard>
      </div>

      <!-- Form Details -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Form Details
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Manage the heading, description, and footer note for the counseling
            form.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 gap-6">
            <div>
              <label
                for="counseling-form-heading"
                class="block text-xs font-medium text-ink mb-2"
                >Form Heading</label
              >
              <input
                id="counseling-form-heading"
                v-model="formSection.formHeading"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Schedule a Session"
              >
            </div>
            <div>
              <label
                for="counseling-form-description"
                class="block text-xs font-medium text-ink mb-2"
                >Form Description</label
              >
              <textarea
                id="counseling-form-description"
                v-model="formSection.formDescription"
                rows="4"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
                placeholder="Enter a brief description..."
              />
            </div>
            <div>
              <label
                for="counseling-form-footer-note"
                class="block text-xs font-medium text-ink mb-2"
                >Form Footer Note</label
              >
              <input
                id="counseling-form-footer-note"
                v-model="formSection.formFooterNote"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
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
        </AppCard>
      </div>

      <!-- Sticky save bar: stays in flow at the end of the form and pins to
           the viewport bottom while the form is in view. Negative margins
           mirror main's padding (layout/default.vue) so the bar bleeds to
           the column edges without width calculations. -->
      <div
        class="sticky bottom-0 z-sticky -mx-4 -mb-5 mt-6 flex items-center justify-end gap-3 border-t border-line bg-surface/90 px-4 py-3 backdrop-blur-md md:-mx-6 md:-mb-6 md:px-6 lg:-mx-8 lg:-mb-8 lg:px-8"
      >
        <AppButton
          variant="secondary"
          size="lg"
          :disabled="isSaving"
          @click="loadSettings"
        >
          Discard
        </AppButton>
        <AppButton type="submit" size="lg" :loading="isSaving">
          {{ isSaving ? "Saving…" : "Save changes" }}
        </AppButton>
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
