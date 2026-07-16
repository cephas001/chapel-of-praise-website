<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Giving Page Management
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Manage text and sections on the website's Giving page.
      </p>
    </div>

    <form
      @submit.prevent="saveSettings"
      class="space-y-13 border-t border-gray-200 pt-7"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Hero Banner
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the top banner of the giving page.
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
                placeholder="e.g. Giving & Tithes"
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
                >Hero Background Image URL</label
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
            Section Content
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Manage the main headline and description for the giving options.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Section Headline</label
              >
              <input
                v-model="headlineSection.sectionHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Ways to Give"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Section Description</label
              >
              <textarea
                v-model="headlineSection.sectionDescription"
                rows="4"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                placeholder="Enter description text..."
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
            Bank Transfer Details
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the direct bank transfer account details.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Bank Name</label
              >
              <input
                v-model="bankDetailsSection.bankName"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Access Bank"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Account Name</label
              >
              <input
                v-model="bankDetailsSection.accountName"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Chapel of Praise"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Account Number</label
              >
              <input
                v-model="bankDetailsSection.accountNumber"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. 1234567890"
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
            Online Payment
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Set up the external payment gateway link.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Description Text</label
              >
              <textarea
                v-model="onlinePaymentSection.onlinePaymentDescription"
                rows="3"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                placeholder="e.g. Pay securely online via Paystack"
              ></textarea>
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Button URL</label
              >
              <input
                v-model="onlinePaymentSection.onlinePaymentButtonUrl"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="https://paystack.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="fixed bottom-0 right-0 w-full md:w-[calc(100%-18rem)] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-end z-30"
      >
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

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings } = usePageManager(
  "giving",
  sectionsMap,
  { reloadOnSave: true },
);

onMounted(() => {
  loadSettings();
});
</script>
