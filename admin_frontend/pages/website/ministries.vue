<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Ministries Management
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Manage text and sections on the Ministries page.
      </p>
    </div>

    <!-- Main Form -->
    <form
      class="space-y-13 border-t border-gray-200 pt-7"
      @submit.prevent="saveSettings"
    >
      <!-- Hero Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            Hero Section
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the top banner of the ministries page.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="ministries-hero-kicker"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Kicker</label
              >
              <input
                id="ministries-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Our Ministries"
              >
            </div>
            <div>
              <label
                for="ministries-hero-headline"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Headline</label
              >
              <input
                id="ministries-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="ministries-hero-image"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Image URL</label
              >
              <MediaPickerInput
                v-model="heroSection.heroImageUrl"
                input-id="ministries-hero-image"
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

      <!-- Ministries List -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            Ministries List
          </h3>
          <p class="text-xs md:text-sm text-gray-500 mb-5">
            Manage the different ministries in the church.
          </p>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 text-[11px] text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-jetbrains shadow-sm"
            @click="addMinistry"
          >
            + Add Ministry
          </button>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 space-y-6">
            <div
              v-if="ministriesSection.ministries.length === 0"
              class="text-xs text-gray-500 text-center py-4"
            >
              No ministries added yet.
            </div>
            <div
              v-for="(ministry, index) in ministriesSection.ministries"
              :key="'ministry' + index"
              class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative pt-12"
            >
              <span
                class="absolute top-5 left-5 text-[11px] font-bold text-gray-500 uppercase font-jetbrains"
                >Ministry {{ index + 1 }}</span
              >
              <button
                type="button"
                class="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors p-1 flex items-center"
                title="Remove Ministry"
                @click="removeMinistry(index)"
              >
                <Icon name="heroicons:minus-circle" class="h-4 w-4" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <div>
                  <label
                    :for="`ministry-name-${index}`"
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                    >Name</label
                  >
                  <input
                    :id="`ministry-name-${index}`"
                    v-model="ministry.name"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                    placeholder="e.g. Youth Ministry"
                  >
                </div>
                <div>
                  <label
                    :for="`ministry-subtitle-${index}`"
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                    >Subtitle / Alias</label
                  >
                  <input
                    :id="`ministry-subtitle-${index}`"
                    v-model="ministry.subtitle"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                    placeholder="e.g. T.L.C"
                  >
                </div>
                <div class="md:col-span-2">
                  <label
                    :for="`ministry-description-${index}`"
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                    >Description</label
                  >
                  <textarea
                    :id="`ministry-description-${index}`"
                    v-model="ministry.description"
                    rows="3"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.ministriesSection"
              @click="handleSaveSection('ministriesSection', ministriesSection)"
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
import { onMounted, reactive } from "vue";
import { useConfirm } from "~/composables/useConfirm";

definePageMeta({
  allowedUserTypes: ["website"],
});

const heroSection = reactive({
  heroKicker: "",
  heroHeadline: "",
  heroImageUrl: "",
});

const ministriesSection = reactive({
  ministries: [],
});

const sectionsMap = {
  heroSection,
  ministriesSection,
};

// State for individual section saves
const sectionSavingState = reactive({
  heroSection: false,
  ministriesSection: false,
});

const confirm = useConfirm();

const addMinistry = () => {
  ministriesSection.ministries.push({
    name: "",
    subtitle: "",
    description: "",
  });
};

const removeMinistry = async (index) => {
  const answer = await confirm.ask({
    title: "Remove Ministry",
    message: "Remove this ministry entry? Any unsaved edits to it will be lost.",
    confirmText: "Remove",
    cancelText: "Cancel",
    isDestructive: true,
  });
  if (!answer) return;
  ministriesSection.ministries.splice(index, 1);
};

// Custom parser to handle the specific array mapping for ministries page
const ministriesPageParser = (response, map) => {
  Object.entries(response).forEach(([key, value]) => {
    if (map[key]) {
      if (key === "ministriesSection" && value.ministries) {
        map.ministriesSection.ministries = value.ministries;
      } else {
        Object.assign(map[key], value);
      }
    }
  });
};

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings, saveSection } =
  usePageManager("ministries", sectionsMap, {
    customParser: ministriesPageParser,
  });

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
