<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <AppHeading
      class="mb-8"
      title="Contact page management"
      subtitle="Manage text and sections on the Contact page."
    />

    <form
      class="space-y-13 border-t border-line pt-7"
      @submit.prevent="saveSettings"
    >
      <!-- Hero Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Hero Section
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Configure the top banner of the contact page.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="contact-hero-kicker"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Kicker</label
              >
              <input
                id="contact-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Get in touch"
              >
            </div>
            <div>
              <label
                for="contact-hero-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Headline</label
              >
              <input
                id="contact-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="contact-hero-image"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Image URL</label
              >
              <MediaPickerInput
                v-model="heroSection.heroImage"
                input-id="contact-hero-image"
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

      <!-- Form Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Form Section
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Manage the heading and description for the contact form.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                for="contact-form-heading"
                class="block text-xs font-medium text-ink mb-2"
                >Form Heading</label
              >
              <input
                id="contact-form-heading"
                v-model="formSection.formHeading"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="contact-form-description"
                class="block text-xs font-medium text-ink mb-2"
                >Form Description</label
              >
              <textarea
                id="contact-form-description"
                v-model="formSection.formDescription"
                rows="3"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
              />
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

      <!-- Campus Information -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Campus Information
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Update physical location details and service times.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="contact-campus-name"
                class="block text-xs font-medium text-ink mb-2"
                >Campus Location Name</label
              >
              <input
                id="contact-campus-name"
                v-model="campusSection.campusName"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div>
              <label
                for="contact-service-times-title"
                class="block text-xs font-medium text-ink mb-2"
                >Service Times Title</label
              >
              <input
                id="contact-service-times-title"
                v-model="campusSection.serviceTimesTitle"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="contact-campus-address"
                class="block text-xs font-medium text-ink mb-2"
                >Campus Address</label
              >
              <textarea
                id="contact-campus-address"
                v-model="campusSection.campusAddress"
                rows="2"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
              />
            </div>
            <div class="md:col-span-2">
              <label
                for="contact-service-times-details"
                class="block text-xs font-medium text-ink mb-2"
                >Service Times Details</label
              >
              <textarea
                id="contact-service-times-details"
                v-model="campusSection.serviceTimesDetails"
                rows="2"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
              />
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.campusSection"
              @click="handleSaveSection('campusSection', campusSection)"
            />
          </div>
        </AppCard>
      </div>

      <!-- Contact Methods & Social -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Contact Methods & Social
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Set up the public email, phone numbers, and social media links.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="contact-email"
                class="block text-xs font-medium text-ink mb-2"
                >Email</label
              >
              <input
                id="contact-email"
                v-model="contactSection.email"
                type="email"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div>
              <label
                for="contact-phone"
                class="block text-xs font-medium text-ink mb-2"
                >Phone</label
              >
              <input
                id="contact-phone"
                v-model="contactSection.phone"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="contact-instagram"
                class="block text-xs font-medium text-ink mb-2"
                >Instagram URL</label
              >
              <input
                id="contact-instagram"
                v-model="contactSection.instagramUrl"
                type="url"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="contact-twitter"
                class="block text-xs font-medium text-ink mb-2"
                >Twitter URL</label
              >
              <input
                id="contact-twitter"
                v-model="contactSection.twitterUrl"
                type="url"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="contact-youtube"
                class="block text-xs font-medium text-ink mb-2"
                >Youtube URL</label
              >
              <input
                id="contact-youtube"
                v-model="contactSection.youtubeUrl"
                type="url"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.contactSection"
              @click="handleSaveSection('contactSection', contactSection)"
            />
          </div>
        </AppCard>
      </div>

      <SaveBar :loading="isSaving">
        <AppButton
          variant="secondary"
          size="lg"
          :disabled="isSaving"
          @click="loadSettings"
        >
          Discard
        </AppButton>
      </SaveBar>
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

// State for individual section saves
const sectionSavingState = reactive({
  heroSection: false,
  formSection: false,
  campusSection: false,
  contactSection: false,
});

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings, saveSection } =
  usePageManager("contact", sectionsMap, { reloadOnSave: true });

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
