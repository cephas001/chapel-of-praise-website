<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <!-- Page Header -->
    <AppHeading
      class="mb-8"
      title="Leadership management"
      subtitle="Manage text and sections on the Leadership page."
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
            Configure the top banner of the leadership page.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="leadership-hero-kicker"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Kicker</label
              >
              <input
                id="leadership-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
                placeholder="e.g. Our Leaders"
              >
            </div>
            <div>
              <label
                for="leadership-hero-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Headline</label
              >
              <input
                id="leadership-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="leadership-hero-image"
                class="block text-xs font-medium text-ink mb-2"
                >Hero Background Image URL</label
              >
              <MediaPickerInput
                v-model="heroSection.heroImageUrl"
                input-id="leadership-hero-image"
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

      <!-- Team Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Team Section Overview
          </h3>
          <p class="text-xs md:text-sm text-muted">
            Provide a general introduction to the leadership team.
          </p>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                for="leadership-team-headline"
                class="block text-xs font-medium text-ink mb-2"
                >Headline</label
              >
              <input
                id="leadership-team-headline"
                v-model="teamSection.teamHeadline"
                type="text"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="leadership-team-description"
                class="block text-xs font-medium text-ink mb-2"
                >Description</label
              >
              <textarea
                id="leadership-team-description"
                v-model="teamSection.teamDescription"
                rows="3"
                class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm resize-none"
              />
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.teamSection"
              @click="handleSaveSection('teamSection', teamSection)"
            />
          </div>
        </AppCard>
      </div>

      <!-- Chaplaincy List -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Chaplaincy List
          </h3>
          <p class="text-xs md:text-sm text-muted mb-5">
            Manage the pastoral and spiritual leadership team.
          </p>
          <AppButton variant="secondary" size="sm" @click="addChaplain">
            + Add Chaplain
          </AppButton>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 space-y-6">
            <div
              v-if="chaplaincySection.chaplaincyList.length === 0"
              class="text-xs text-muted text-center py-4"
            >
              No chaplains added yet.
            </div>
            <div
              v-for="(chaplain, index) in chaplaincySection.chaplaincyList"
              :key="'chaplain' + index"
              class="bg-subtle/60 rounded-surface p-5 border border-line relative pt-12"
            >
              <span
                class="absolute top-5 left-5 text-xs font-semibold text-muted font-mono"
                >Chaplain {{ index + 1 }}</span
              >
              <button
                type="button"
                class="absolute top-4 right-4 text-danger-text transition-colors p-1 flex items-center"
                title="Remove Chaplain"
                @click="removeChaplain(index)"
              >
                <Icon name="heroicons:minus-circle" class="h-4 w-4" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <div>
                  <label
                    :for="`chaplain-name-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Name</label
                  >
                  <input
                    :id="`chaplain-name-${index}`"
                    v-model="chaplain.name"
                    type="text"
                    class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
                  >
                </div>
                <div>
                  <label
                    :for="`chaplain-title-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Title</label
                  >
                  <input
                    :id="`chaplain-title-${index}`"
                    v-model="chaplain.title"
                    type="text"
                    class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
                  >
                </div>
                <div class="md:col-span-2">
                  <label
                    :for="`chaplain-image-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Image URL</label
                  >
                  <MediaPickerInput
                    v-model="chaplain.imageUrl"
                    :input-id="`chaplain-image-${index}`"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    :for="`chaplain-bio-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Bio</label
                  >
                  <textarea
                    :id="`chaplain-bio-${index}`"
                    v-model="chaplain.bio"
                    rows="3"
                    class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.chaplaincySection"
              @click="handleSaveSection('chaplaincySection', chaplaincySection)"
            />
          </div>
        </AppCard>
      </div>

      <!-- Student Executives List -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-line pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-semibold text-ink mb-1">
            Student Executives
          </h3>
          <p class="text-xs md:text-sm text-muted mb-5">
            Manage the student leadership council.
          </p>
          <AppButton variant="secondary" size="sm" @click="addExecutive">
            + Add Executive
          </AppButton>
        </div>
        <AppCard
          class="md:col-span-2" body-class="flex flex-col"
        >
          <div class="p-6 space-y-6">
            <div
              v-if="studentExecutivesSection.studentExecutivesList.length === 0"
              class="text-xs text-muted text-center py-4"
            >
              No student executives added yet.
            </div>
            <div
              v-for="(
                exec, index
              ) in studentExecutivesSection.studentExecutivesList"
              :key="'exec' + index"
              class="bg-subtle/60 rounded-surface p-5 border border-line relative pt-12"
            >
              <span
                class="absolute top-5 left-5 text-xs font-semibold text-muted font-mono"
                >Executive {{ index + 1 }}</span
              >
              <button
                type="button"
                class="absolute top-4 right-4 text-danger-text transition-colors p-1"
                title="Remove Executive"
                @click="removeExecutive(index)"
              >
                <Icon name="heroicons:trash" class="h-4 w-4" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    :for="`exec-name-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Name</label
                  >
                  <input
                    :id="`exec-name-${index}`"
                    v-model="exec.name"
                    type="text"
                    class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
                  >
                </div>
                <div>
                  <label
                    :for="`exec-title-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Title</label
                  >
                  <input
                    :id="`exec-title-${index}`"
                    v-model="exec.title"
                    type="text"
                    class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm"
                  >
                </div>
                <div class="md:col-span-2">
                  <label
                    :for="`exec-image-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Image URL</label
                  >
                  <MediaPickerInput
                    v-model="exec.imageUrl"
                    :input-id="`exec-image-${index}`"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    :for="`exec-bio-${index}`"
                    class="block text-xs font-medium text-ink mb-2"
                    >Bio</label
                  >
                  <textarea
                    :id="`exec-bio-${index}`"
                    v-model="exec.bio"
                    rows="3"
                    class="w-full rounded-control border border-line bg-surface px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink md:text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.studentExecutivesSection"
              @click="
                handleSaveSection(
                  'studentExecutivesSection',
                  studentExecutivesSection,
                )
              "
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

const teamSection = reactive({
  teamHeadline: "",
  teamDescription: "",
});

const chaplaincySection = reactive({
  chaplaincyList: [],
});

const studentExecutivesSection = reactive({
  studentExecutivesList: [],
});

const sectionsMap = {
  heroSection,
  teamSection,
  chaplaincySection,
  studentExecutivesSection,
};

const confirm = useConfirm();

// State for individual section saves
const sectionSavingState = reactive({
  heroSection: false,
  teamSection: false,
  chaplaincySection: false,
  studentExecutivesSection: false,
});

const defaultChaplain = () => ({ name: "", title: "", bio: "", imageUrl: "" });
const defaultExecutive = () => ({ name: "", title: "", bio: "", imageUrl: "" });

const addChaplain = () =>
  chaplaincySection.chaplaincyList.push(defaultChaplain());
const removeChaplain = async (index) => {
  const answer = await confirm.ask({
    title: "Remove Chaplain",
    message: "Remove this chaplain entry? Any unsaved edits to it will be lost.",
    confirmText: "Remove",
    cancelText: "Cancel",
    isDestructive: true,
  });
  if (!answer) return;
  chaplaincySection.chaplaincyList.splice(index, 1);
};

const addExecutive = () =>
  studentExecutivesSection.studentExecutivesList.push(defaultExecutive());
const removeExecutive = async (index) => {
  const answer = await confirm.ask({
    title: "Remove Executive",
    message:
      "Remove this executive entry? Any unsaved edits to it will be lost.",
    confirmText: "Remove",
    cancelText: "Cancel",
    isDestructive: true,
  });
  if (!answer) return;
  studentExecutivesSection.studentExecutivesList.splice(index, 1);
};

// Custom parser to handle the specific array mapping for leadership page
const leadershipPageParser = (response, map) => {
  Object.entries(response).forEach(([key, value]) => {
    if (map[key]) {
      if (key === "chaplaincySection" && value.chaplaincyList) {
        map.chaplaincySection.chaplaincyList = value.chaplaincyList;
      } else if (
        key === "studentExecutivesSection" &&
        value.studentExecutivesList
      ) {
        map.studentExecutivesSection.studentExecutivesList =
          value.studentExecutivesList;
      } else {
        Object.assign(map[key], value);
      }
    }
  });
};

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings, saveSection } =
  usePageManager("leadership", sectionsMap, {
    customParser: leadershipPageParser,
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
