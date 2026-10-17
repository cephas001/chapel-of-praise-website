<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <!-- Page Header -->
    <AppHeading
      class="mb-8"
      title="Ministries management"
      subtitle="Manage text and sections on the Ministries page."
    />

    <!-- Main Form -->
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
            Configure the top banner of the ministries page.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="ministries-hero-kicker"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Kicker</label
              >
              <input
                id="ministries-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Our Ministries"
              >
            </div>
            <div>
              <label
                for="ministries-hero-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Headline</label
              >
              <input
                id="ministries-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="ministries-hero-image"
                class="block text-xs font-medium text-ink mb-2"
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
        </AppCard>
      </div>

      <!-- Ministries List -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Ministries List
          </h3>
          <p class="text-xs md:text-sm text-muted mb-5">
            Manage the different ministries in the church.
          </p>
          <AppButton variant="secondary" size="sm" @click="addMinistry">
            + Add Ministry
          </AppButton>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 space-y-6">
            <div
              v-if="ministriesSection.ministries.length === 0"
              class="text-xs text-muted text-center py-4"
            >
              No ministries added yet.
            </div>
            <div
              v-for="(ministry, index) in ministriesSection.ministries"
              :key="'ministry' + index"
              class="bg-subtle/60 rounded-surface p-5 border border-line relative pt-12"
            >
              <span
                class="absolute top-5 left-5 text-xs font-semibold text-muted font-mono"
                >Ministry {{ index + 1 }}</span
              >
              <button
                type="button"
                class="absolute top-4 right-4 text-danger-text transition-colors p-1 flex items-center"
                title="Remove Ministry"
                @click="removeMinistry(index)"
              >
                <Icon name="heroicons:minus-circle" class="h-4 w-4" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <div>
                  <label
                    :for="`ministry-name-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Name</label
                  >
                  <input
                    :id="`ministry-name-${index}`"
                    v-model="ministry.name"
                    type="text"
                    class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
                    placeholder="e.g. Youth Ministry"
                  >
                </div>
                <div>
                  <label
                    :for="`ministry-subtitle-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Subtitle / Alias</label
                  >
                  <input
                    :id="`ministry-subtitle-${index}`"
                    v-model="ministry.subtitle"
                    type="text"
                    class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
                    placeholder="e.g. T.L.C"
                  >
                </div>
                <div class="md:col-span-2">
                  <label
                    :for="`ministry-description-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Description</label
                  >
                  <textarea
                    :id="`ministry-description-${index}`"
                    v-model="ministry.description"
                    rows="3"
                    class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm resize-none"
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
