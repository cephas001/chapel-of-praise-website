<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <!-- Page Header -->
    <AppHeading
      class="mb-8"
      title="About page management"
      subtitle="Manage text and sections on the website's About page."
    />

    <!-- Main Form -->
    <form
      class="space-y-13 border-t border-line pt-7"
      @submit.prevent="saveSettings"
    >
      <!-- Section 1: Hero Banner -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Hero Banner
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Configure the hero section of the about page.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="about-hero-kicker"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Kicker</label
              >
              <input
                id="about-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. The family at COP"
              >
            </div>
            <div>
              <label
                for="about-hero-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Headline</label
              >
              <input
                id="about-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="about-hero-image"
                class="block text-xs font-medium text-ink mb-2"
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
        </AppCard>
      </div>

      <!-- Vision / Mission Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Vision & Mission Section
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Manage the vision headline and descriptive paragraphs.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                for="about-vision-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Section Headline</label
              >
              <textarea
                id="about-vision-headline"
                v-model="visionSection.visionHeadline"
                rows="2"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
                placeholder="e.g. We serve God by His Spirit"
              />
              <p class="mt-2 text-xs text-muted">
                Each line renders on its own line.
              </p>
            </div>

            <div class="md:col-span-2 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-ink">Paragraphs</span>
                <span class="text-xs text-muted">
                  Each paragraph renders as its own block.
                </span>
              </div>

              <div
                v-for="(paragraph, index) in visionSection.visionParagraphs"
                :key="'vision-paragraph' + index"
                class="bg-subtle/60 rounded-surface p-5 border border-line relative"
              >
                <span
                  class="absolute top-4 right-4 text-xs font-semibold text-muted font-mono flex items-center gap-2"
                >
                  Paragraph {{ index + 1 }}
                  <Icon
                    name="heroicons:minus-circle"
                    class="h-4 w-4 text-danger-text cursor-pointer hover:text-danger-text transition-colors"
                    @click="removeParagraph(index)"
                  />
                </span>
                <textarea
                  :id="`about-vision-paragraph-${index}`"
                  v-model="visionSection.visionParagraphs[index]"
                  rows="4"
                  class="mt-2 w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm resize-none"
                  placeholder="Write one paragraph..."
                />
              </div>

              <AddItemButton label="Add paragraph" @click="addParagraph" />
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.visionSection"
              @click="handleSaveSection('visionSection', visionSection)"
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

const visionSection = reactive({
  visionHeadline: "",
  visionParagraphs: [""],
  visionContentCol1: "",
  visionContentCol2: "",
  visionHeadlineBlack: "",
  visionHeadlineColored: "",
});

const sectionsMap = {
  heroSection,
  visionSection,
};

const htmlToParagraphs = (html) => {
  const source = String(html ?? "").trim();
  if (!source) return [];

  const doc = new DOMParser().parseFromString(source, "text/html");
  const blocks = [...doc.querySelectorAll("p")]
    .map((element) => element.textContent.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (blocks.length > 0) return blocks;

  return source
    .replace(/<[^>]+>/g, " ")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
};

const aboutParser = (response, map) => {
  Object.entries(response).forEach(([key, value]) => {
    if (!map[key]) return;

    if (key === "visionSection") {
      const legacyParagraphs = [
        ...htmlToParagraphs(value.visionContentCol1),
        ...htmlToParagraphs(value.visionContentCol2),
      ];
      const paragraphs = Array.isArray(value.visionParagraphs)
        ? value.visionParagraphs
            .map((paragraph) => String(paragraph ?? "").trim())
            .filter(Boolean)
        : legacyParagraphs;
      const headline =
        String(value.visionHeadline ?? "").trim() ||
        [value.visionHeadlineBlack, value.visionHeadlineColored]
          .map((line) => String(line ?? "").trim())
          .filter(Boolean)
          .join("\n");

      map.visionSection.visionParagraphs =
        paragraphs.length > 0 ? paragraphs : [""];
      map.visionSection.visionHeadline = headline;
      map.visionSection.visionContentCol1 = "";
      map.visionSection.visionContentCol2 = "";
      map.visionSection.visionHeadlineBlack = "";
      map.visionSection.visionHeadlineColored = "";
      return;
    }

    Object.assign(map[key], value);
  });
};

// State for individual section saves
const sectionSavingState = reactive({
  heroSection: false,
  visionSection: false,
});

const confirm = useConfirm();

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings, saveSection } =
  usePageManager("about", sectionsMap, {
    reloadOnSave: true,
    customParser: aboutParser,
  });

const addParagraph = () => {
  visionSection.visionParagraphs.push("");
};

const removeParagraph = async (index) => {
  const answer = await confirm.ask({
    title: "Remove Paragraph",
    message:
      "Are you sure you want to delete this paragraph? Once saved this action is irreversible.",
    confirmText: "Remove",
    cancelText: "Cancel",
    isDestructive: true,
  });

  if (answer) {
    visionSection.visionParagraphs.splice(index, 1);
  }
};

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
