<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <AppHeading
      class="mb-8"
      title="Giving page management"
      subtitle="Manage text and sections on the website's Giving page."
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
            Configure the top banner of the giving page.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="giving-hero-kicker"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Kicker</label
              >
              <input
                id="giving-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Giving & Tithes"
              >
            </div>
            <div>
              <label
                for="giving-hero-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Headline</label
              >
              <input
                id="giving-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="giving-hero-image"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Background Image URL</label
              >
              <MediaPickerInput
                v-model="heroSection.heroImage"
                input-id="giving-hero-image"
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

      <!-- Section Content -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Section Content
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Manage the main headline and description for the giving options.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                for="giving-section-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Section Headline</label
              >
              <input
                id="giving-section-headline"
                v-model="headlineSection.sectionHeadline"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Ways to Give"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="giving-section-description"
                class="block text-xs font-medium text-ink mb-2"
                >Section Description</label
              >
              <textarea
                id="giving-section-description"
                v-model="headlineSection.sectionDescription"
                rows="4"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
                placeholder="Enter description text..."
              />
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.headlineSection"
              @click="handleSaveSection('headlineSection', headlineSection)"
            />
          </div>
        </AppCard>
      </div>

      <!-- Bank Transfer Details -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Bank Transfer Details
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Configure the direct bank transfer account details.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="giving-bank-name"
                class="block text-xs font-medium text-ink mb-2"
                >Bank Name</label
              >
              <input
                id="giving-bank-name"
                v-model="bankDetailsSection.bankName"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Access Bank"
              >
            </div>
            <div>
              <label
                for="giving-account-name"
                class="block text-xs font-medium text-ink mb-2"
                >Account Name</label
              >
              <input
                id="giving-account-name"
                v-model="bankDetailsSection.accountName"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Chapel of Praise"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="giving-account-number"
                class="block text-xs font-medium text-ink mb-2"
                >Account Number</label
              >
              <input
                id="giving-account-number"
                v-model="bankDetailsSection.accountNumber"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. 1234567890"
              >
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.bankDetailsSection"
              @click="
                handleSaveSection('bankDetailsSection', bankDetailsSection)
              "
            />
          </div>
        </AppCard>
      </div>

      <!-- Online Payment -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Online Payment
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Set up the external payment gateway link.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                for="giving-online-description"
                class="block text-xs font-medium text-ink mb-2"
                >Description Text</label
              >
              <textarea
                id="giving-online-description"
                v-model="onlinePaymentSection.onlinePaymentDescription"
                rows="3"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
                placeholder="e.g. Pay securely online via Paystack"
              />
            </div>
            <div class="md:col-span-2">
              <label
                for="giving-online-button-url"
                class="block text-xs font-medium text-ink mb-2"
                >Button URL</label
              >
              <input
                id="giving-online-button-url"
                v-model="onlinePaymentSection.onlinePaymentButtonUrl"
                type="url"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="https://paystack.com/..."
              >
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.onlinePaymentSection"
              @click="
                handleSaveSection('onlinePaymentSection', onlinePaymentSection)
              "
            />
          </div>
        </AppCard>
      </div>

      <SaveBar :loading="isSaving" />
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

const headlineSection = reactive({
  sectionHeadline: "",
  sectionDescription: "",
});

const bankDetailsSection = reactive({
  bankName: "",
  accountName: "",
  accountNumber: "",
});

const onlinePaymentSection = reactive({
  onlinePaymentDescription: "",
  onlinePaymentButtonUrl: "",
});

const sectionsMap = {
  heroSection,
  headlineSection,
  bankDetailsSection,
  onlinePaymentSection,
};

// State for individual section saves
const sectionSavingState = reactive({
  heroSection: false,
  headlineSection: false,
  bankDetailsSection: false,
  onlinePaymentSection: false,
});

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings, saveSection } =
  usePageManager("giving", sectionsMap, { reloadOnSave: true });

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
