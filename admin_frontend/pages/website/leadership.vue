<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Leadership Management
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Manage text and sections on the Leadership page.
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
            Configure the top banner of the leadership page.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                for="leadership-hero-kicker"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Kicker</label
              >
              <input
                id="leadership-hero-kicker"
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Our Leaders"
              >
            </div>
            <div>
              <label
                for="leadership-hero-headline"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Headline</label
              >
              <input
                id="leadership-hero-headline"
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="leadership-hero-image"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
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
        </div>
      </div>

      <!-- Team Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            Team Section Overview
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Provide a general introduction to the leadership team.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                for="leadership-team-headline"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Headline</label
              >
              <input
                id="leadership-team-headline"
                v-model="teamSection.teamHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              >
            </div>
            <div class="md:col-span-2">
              <label
                for="leadership-team-description"
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Description</label
              >
              <textarea
                id="leadership-team-description"
                v-model="teamSection.teamDescription"
                rows="3"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              />
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.teamSection"
              @click="handleSaveSection('teamSection', teamSection)"
            />
          </div>
        </div>
      </div>

      <!-- Chaplaincy List -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            Chaplaincy List
          </h3>
          <p class="text-xs md:text-sm text-gray-500 mb-5">
            Manage the pastoral and spiritual leadership team.
          </p>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 text-[11px] text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-jetbrains shadow-sm"
            @click="addChaplain"
          >
            + Add Chaplain
          </button>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 space-y-6">
            <div
              v-if="chaplaincySection.chaplaincyList.length === 0"
              class="text-xs text-gray-500 text-center py-4"
            >
              No chaplains added yet.
            </div>
            <div
              v-for="(chaplain, index) in chaplaincySection.chaplaincyList"
              :key="'chaplain' + index"
              class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative pt-12"
            >
              <span
                class="absolute top-5 left-5 text-[11px] font-bold text-gray-500 uppercase font-jetbrains"
                >Chaplain {{ index + 1 }}</span
              >
              <button
                type="button"
                class="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors p-1 flex items-center"
                title="Remove Chaplain"
                @click="removeChaplain(index)"
              >
                <Icon name="heroicons:minus-circle" class="h-4 w-4" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                <div>
                  <label
                    :for="`chaplain-name-${index}`"
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                    >Name</label
                  >
                  <input
                    :id="`chaplain-name-${index}`"
                    v-model="chaplain.name"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                  >
                </div>
                <div>
                  <label
                    :for="`chaplain-title-${index}`"
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                    >Title</label
                  >
                  <input
                    :id="`chaplain-title-${index}`"
                    v-model="chaplain.title"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                  >
                </div>
                <div class="md:col-span-2">
                  <label
                    :for="`chaplain-image-${index}`"
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
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
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                    >Bio</label
                  >
                  <textarea
                    :id="`chaplain-bio-${index}`"
                    v-model="chaplain.bio"
                    rows="3"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
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
        </div>
      </div>

      <!-- Student Executives List -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-base font-jetbrains font-bold text-gray-900 mb-1">
            Student Executives
          </h3>
          <p class="text-xs md:text-sm text-gray-500 mb-5">
            Manage the student leadership council.
          </p>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 text-[11px] text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-jetbrains shadow-sm"
            @click="addExecutive"
          >
            + Add Executive
          </button>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 space-y-6">
            <div
              v-if="studentExecutivesSection.studentExecutivesList.length === 0"
              class="text-xs text-gray-500 text-center py-4"
            >
              No student executives added yet.
            </div>
            <div
              v-for="(
                exec, index
              ) in studentExecutivesSection.studentExecutivesList"
              :key="'exec' + index"
              class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative pt-12"
            >
              <span
                class="absolute top-5 left-5 text-[11px] font-bold text-gray-500 uppercase font-jetbrains"
                >Executive {{ index + 1 }}</span
              >
              <button
                type="button"
                class="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors p-1"
                title="Remove Executive"
                @click="removeExecutive(index)"
              >
                <Icon name="heroicons:trash" class="h-4 w-4" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    :for="`exec-name-${index}`"
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                    >Name</label
                  >
                  <input
                    :id="`exec-name-${index}`"
                    v-model="exec.name"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                  >
                </div>
                <div>
                  <label
                    :for="`exec-title-${index}`"
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                    >Title</label
                  >
                  <input
                    :id="`exec-title-${index}`"
                    v-model="exec.title"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                  >
                </div>
                <div class="md:col-span-2">
                  <label
                    :for="`exec-image-${index}`"
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
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
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                    >Bio</label
                  >
                  <textarea
                    :id="`exec-bio-${index}`"
                    v-model="exec.bio"
                    rows="3"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
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
