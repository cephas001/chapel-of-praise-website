<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <NuxtLink
          to="/"
          class="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-2"
        >
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
          Back to Dashboard
        </NuxtLink>
        <h1 class="text-3xl font-black text-black tracking-tight font-roboto">
          Homepage Management
        </h1>
        <p class="text-gray-500 mt-1">
          Manage text and sections on the main website homepage.
        </p>
      </div>
    </div>

    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900">Loading Configuration...</h3>
    </div>

    <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <form @submit.prevent="saveSettings" class="space-y-8">
        
        <!-- Hero Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Hero Banner
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-black mb-1">Hero Kicker</label>
              <input
                v-model="formData.heroKicker"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Shining the Gospel light"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Hero Headline</label>
              <input
                v-model="formData.heroHeadline"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Hero Background Video URL</label>
              <input
                v-model="formData.heroVideo"
                type="url"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="https://..."
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Primary CTA Label</label>
              <input
                v-model="formData.heroCta1Label"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Watch Us"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Primary CTA Link</label>
              <input
                v-model="formData.heroCta1Link"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="/..."
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Secondary CTA Label</label>
              <input
                v-model="formData.heroCta2Label"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. About Us"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Secondary CTA Link</label>
              <input
                v-model="formData.heroCta2Link"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="/..."
              />
            </div>
          </div>
        </div>

        <!-- Action Cards Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Action Cards Section
          </h3>
          <div class="space-y-8">
            <div v-for="(card, index) in formData.actionCards" :key="'card' + index" class="p-5 border border-gray-200 rounded-xl bg-gray-50">
              <h4 class="text-md font-bold mb-4">Card {{ index + 1 }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-black mb-1">Background Image URL</label>
                  <input
                    v-model="card.image"
                    type="url"
                    class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-black mb-1">Kicker</label>
                  <input
                    v-model="card.kicker"
                    type="text"
                    class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-black mb-1">Title</label>
                  <input
                    v-model="card.title"
                    type="text"
                    class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-black mb-1">CTA Label</label>
                  <input
                    v-model="card.ctaLabel"
                    type="text"
                    class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-black mb-1">CTA Link</label>
                  <input
                    v-model="card.ctaLink"
                    type="text"
                    class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Welcome Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Welcome Section
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-black mb-1">Welcome Badge</label>
              <input
                v-model="formData.welcomeBadge"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Welcome Headline</label>
              <input
                v-model="formData.welcomeHeadline"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Welcome Description</label>
              <textarea
                v-model="formData.welcomeDescription"
                rows="3"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Champions Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Great Champions Section
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-black mb-1">Champion Headline</label>
              <input
                v-model="formData.championHeadline"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Champion Background Image URL</label>
              <input
                v-model="formData.championImage"
                type="url"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="https://..."
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Champion Description</label>
              <textarea
                v-model="formData.championDescription"
                rows="3"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">CTA Label</label>
              <input
                v-model="formData.championCtaLabel"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Learn More"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">CTA Link</label>
              <input
                v-model="formData.championCtaLink"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Sticky Editorial Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Sticky Editorial Section
          </h3>
          <div class="space-y-8">
            <div v-for="(slide, index) in formData.editorialSlides" :key="'slide' + index" class="p-5 border border-gray-200 rounded-xl bg-gray-50">
              <h4 class="text-md font-bold mb-4">Slide {{ index + 1 }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-black mb-1">Kicker</label>
                  <input
                    v-model="slide.kicker"
                    type="text"
                    class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-black mb-1">Title</label>
                  <input
                    v-model="slide.title"
                    type="text"
                    class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-black mb-1">Description</label>
                  <textarea
                    v-model="slide.description"
                    rows="2"
                    class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Leadership Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Leadership Section
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-black mb-1">Leadership Badge</label>
              <input
                v-model="formData.leadershipBadge"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Leadership Headline</label>
              <input
                v-model="formData.leadershipHeadline"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Leadership Image URL</label>
              <input
                v-model="formData.leadershipImage"
                type="url"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="https://..."
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Leadership Bio</label>
              <textarea
                v-model="formData.leadershipBio"
                rows="4"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">CTA Label</label>
              <input
                v-model="formData.leadershipCtaLabel"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Read More"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">CTA Link</label>
              <input
                v-model="formData.leadershipCtaLink"
                type="text"
                class="block w-full rounded-xl border-gray-300 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
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
        { image: "", kicker: "", title: "", ctaLabel: "", ctaLink: "" }
      ],
      championHeadline: "",
      championDescription: "",
      championImage: "",
      championCtaLabel: "",
      championCtaLink: "",
      editorialSlides: [
        { kicker: "", title: "", description: "" },
        { kicker: "", title: "", description: "" },
        { kicker: "", title: "", description: "" }
      ],
      leadershipBadge: "",
      leadershipHeadline: "",
      leadershipBio: "",
      leadershipImage: "",
      leadershipCtaLabel: "",
      leadershipCtaLink: ""
    });

const loadSettings = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/admin/homepage`);
    if (response) {
      Object.keys(formData).forEach(key => {
        if (response[key] !== undefined) {
          if (Array.isArray(formData[key])) {
            // Overwrite if it has items, otherwise keep the default empty objects
            formData[key] = response[key].length > 0 ? response[key] : formData[key];
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
      body: formData
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