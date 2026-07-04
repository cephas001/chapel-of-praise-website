<!-- pages/homepage.vue -->
<template>
  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Page Header -->
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Homepage Management
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        Manage text and sections on the main website homepage.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isFetching" class="py-15 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3
        class="text-xs md:text-sm font-bold text-gray-900 font-jetbrains animate-pulse"
      >
        Loading Configuration...
      </h3>
    </div>

    <!-- Main Form -->
    <form
      v-else
      @submit.prevent="saveSettings"
      class="space-y-13 border-t border-gray-200 pt-7"
    >
      <!-- Section 1: Hero Banner -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Hero Banner
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the first section of the homepage.
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
                v-model="formData.heroKicker"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Shining the Gospel light"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Headline</label
              >
              <input
                v-model="formData.heroHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="Our Church"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Background Video URL</label
              >
              <input
                v-model="formData.heroVideo"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="https://example.com/video.mp4"
              />
              <p class="text-xs text-gray-500 mt-1.5 font-lora">
                Recommended: .mp4, Max size: 20MB
              </p>
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Primary CTA Label</label
              >
              <input
                v-model="formData.heroCta1Label"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="Join Us"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Primary CTA Link</label
              >
              <input
                v-model="formData.heroCta1Link"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="/about"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Secondary CTA Label</label
              >
              <input
                v-model="formData.heroCta2Label"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="Watch Live"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Secondary CTA Link</label
              >
              <input
                v-model="formData.heroCta2Link"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="/live"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Action Cards -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Action Cards
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Manage the three featured action cards below the hero.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div
            v-for="(card, index) in formData.actionCards"
            :key="'card' + index"
            class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative"
          >
            <span
              class="absolute top-4 right-4 text-[11px] font-bold text-gray-400 uppercase font-jetbrains"
              >Card {{ index + 1 }}</span
            >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              <div class="md:col-span-2">
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Image URL</label
                >
                <input
                  v-model="card.image"
                  type="url"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Kicker</label
                >
                <input
                  v-model="card.kicker"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Title</label
                >
                <input
                  v-model="card.title"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >CTA Label</label
                >
                <input
                  v-model="card.ctaLabel"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >CTA Link</label
                >
                <input
                  v-model="card.ctaLink"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Welcome Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Welcome Section
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            The introductory text block for your church.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Welcome Badge</label
              >
              <input
                v-model="formData.welcomeBadge"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Welcome Headline</label
              >
              <input
                v-model="formData.welcomeHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Welcome Description</label
              >
              <textarea
                v-model="formData.welcomeDescription"
                rows="4"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Great Champions Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Great Champions
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the spotlight section for testimonies or ministry focus.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Background Image URL</label
              >
              <input
                v-model="formData.championImage"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="https://..."
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Champion Headline</label
              >
              <input
                v-model="formData.championHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Champion Description</label
              >
              <textarea
                v-model="formData.championDescription"
                rows="3"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >CTA Label</label
              >
              <input
                v-model="formData.championCtaLabel"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Learn More"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >CTA Link</label
              >
              <input
                v-model="formData.championCtaLink"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Section 5: Editorial Slides -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Sticky Editorial
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Manage the scrolling text slides overlaying the background image.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div
            v-for="(slide, index) in formData.editorialSlides"
            :key="'slide' + index"
            class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative"
          >
            <span
              class="absolute top-4 right-4 text-[11px] font-bold text-gray-400 uppercase font-jetbrains"
              >Slide {{ index + 1 }}</span
            >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Kicker</label
                >
                <input
                  v-model="slide.kicker"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Title</label
                >
                <input
                  v-model="slide.title"
                  type="text"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
              <div class="md:col-span-2">
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Description</label
                >
                <textarea
                  v-model="slide.description"
                  rows="2"
                  class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 6: Leadership Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Leadership Section
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Introduce the lead pastor or core leadership team.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Leadership Badge</label
              >
              <input
                v-model="formData.leadershipBadge"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Leadership Headline</label
              >
              <input
                v-model="formData.leadershipHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Leadership Image URL</label
              >
              <input
                v-model="formData.leadershipImage"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="https://..."
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Leadership Bio</label
              >
              <textarea
                v-model="formData.leadershipBio"
                rows="4"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >CTA Label</label
              >
              <input
                v-model="formData.leadershipCtaLabel"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Read More"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >CTA Link</label
              >
              <input
                v-model="formData.leadershipCtaLink"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
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
import { ref, reactive, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAlertModal } from "~/composables/useAlertModal";

const config = useRuntimeConfig();
const { showAlert } = useAlertModal();

const isFetching = ref(true);
const isSaving = ref(false);

const formData = reactive({
  heroKicker: "",
  heroHeadline: "",
  heroVideo: "",
  heroCta1Label: "",
  heroCta1Link: "",
  heroCta2Label: "",
  heroCta2Link: "",
  welcomeBadge: "",
  welcomeHeadline: "",
  welcomeDescription: "",
  actionCards: [
    { image: "", kicker: "", title: "", ctaLabel: "", ctaLink: "" },
    { image: "", kicker: "", title: "", ctaLabel: "", ctaLink: "" },
    { image: "", kicker: "", title: "", ctaLabel: "", ctaLink: "" },
  ],
  championHeadline: "",
  championDescription: "",
  championImage: "",
  championCtaLabel: "",
  championCtaLink: "",
  editorialSlides: [
    { kicker: "", title: "", description: "" },
    { kicker: "", title: "", description: "" },
    { kicker: "", title: "", description: "" },
  ],
  leadershipBadge: "",
  leadershipHeadline: "",
  leadershipBio: "",
  leadershipImage: "",
  leadershipCtaLabel: "",
  leadershipCtaLink: "",
});

const loadSettings = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/admin/homepage`);
    if (response) {
      Object.keys(formData).forEach((key) => {
        if (response[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            formData[key] =
              response[key].length > 0 ? response[key] : formData[key];
          } else {
            formData[key] = response[key];
          }
        }
      });
    }
  } catch (error) {
    console.error("Failed to load homepage settings:", error);
    showAlert("Could not load current settings.", "error");
  } finally {
    isFetching.value = false;
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/admin/homepage`, {
      method: "PUT",
      body: formData,
    });
    showAlert("Homepage settings saved successfully!", "success");
  } catch (error) {
    console.error("Failed to save homepage settings:", error);
    showAlert("Could not save settings. Please try again.", "error");
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>
