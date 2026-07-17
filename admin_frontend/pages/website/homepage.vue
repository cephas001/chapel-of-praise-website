<template>
  <LoadingScreen :isLoading="isFetching" />

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

    <!-- Main Form -->
    <form
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
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Hero Kicker
              </label>
              <input
                v-model="heroSection.heroKicker"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Shining the Gospel light"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Hero Headline
              </label>
              <input
                v-model="heroSection.heroHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="Our Church"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Background Video URL
              </label>
              <input
                v-model="heroSection.heroVideoUrl"
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
              >
                Primary CTA Label
              </label>
              <input
                v-model="heroSection.heroCta1Label"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="Join Us"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Primary CTA Link
              </label>
              <input
                v-model="heroSection.heroCta1Link"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="/about"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Secondary CTA Label
              </label>
              <input
                v-model="heroSection.heroCta2Label"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="Watch Live"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Secondary CTA Link
              </label>
              <input
                v-model="heroSection.heroCta2Link"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="/live"
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

      <!-- Section 2: Action Cards -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-8 border-gray-200"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Action Cards
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Manage the featured action cards below the hero.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border shadow-sm border-gray-200 flex flex-col"
        >
          <div class="p-6 space-y-6">
            <div
              v-for="(card, index) in actionCardsSection.actionCards"
              :key="'card' + index"
              class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative"
            >
              <span
                class="absolute top-4 right-4 text-[11px] font-bold text-gray-400 uppercase font-jetbrains flex items-center justify-center gap-2"
              >
                Card {{ index + 1 }}
                <Icon
                  name="heroicons:minus-circle"
                  class="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                  @click="removeActionCard(index)"
                />
              </span>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div class="md:col-span-2">
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Image URL
                  </label>
                  <input
                    v-model="card.image"
                    type="url"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Kicker
                  </label>
                  <input
                    v-model="card.kicker"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Title
                  </label>
                  <input
                    v-model="card.title"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    CTA Label
                  </label>
                  <input
                    v-model="card.ctaLabel"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    CTA Link
                  </label>
                  <input
                    v-model="card.ctaLink"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end gap-3">
            <button
              class="inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 px-6 py-3 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors font-jetbrains"
              @click.prevent="addActionCard"
            >
              Add Card
            </button>
            <SaveSectionButton
              :is-loading="sectionSavingState.actionCardsSection"
              @click="
                handleSaveSection('actionCardsSection', actionCardsSection)
              "
            />
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
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Welcome Badge
              </label>
              <input
                v-model="welcomeSection.welcomeBadge"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Welcome Headline
              </label>
              <input
                v-model="welcomeSection.welcomeHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Welcome Description
              </label>
              <textarea
                v-model="welcomeSection.welcomeDescription"
                rows="4"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.welcomeSection"
              @click="handleSaveSection('welcomeSection', welcomeSection)"
            />
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
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Background Image URL
              </label>
              <input
                v-model="championsSection.championImage"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="https://..."
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Champion Headline
              </label>
              <input
                v-model="championsSection.championHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Champion Description
              </label>
              <textarea
                v-model="championsSection.championDescription"
                rows="3"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                CTA Label
              </label>
              <input
                v-model="championsSection.championCtaLabel"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Learn More"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                CTA Link
              </label>
              <input
                v-model="championsSection.championCtaLink"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.championsSection"
              @click="handleSaveSection('championsSection', championsSection)"
            />
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
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 space-y-6">
            <div
              v-for="(slide, index) in editorialSection.editorialSlides"
              :key="'slide' + index"
              class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative"
            >
              <span
                class="absolute top-4 right-4 text-[11px] font-bold text-gray-400 uppercase font-jetbrains flex items-center gap-2"
              >
                Slide {{ index + 1 }}
                <Icon
                  name="heroicons:minus-circle"
                  class="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                  @click="removeEditorialCard(index)"
                />
              </span>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Kicker
                  </label>
                  <input
                    v-model="slide.kicker"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Title
                  </label>
                  <input
                    v-model="slide.title"
                    type="text"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm"
                  />
                </div>
                <div class="md:col-span-2">
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    v-model="slide.description"
                    rows="2"
                    class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm resize-none shadow-sm"
                  ></textarea>
                </div>
                <div class="md:col-span-2 border-t border-gray-200 pt-5 mt-2">
                  <label
                    class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-3"
                  >
                    Slide Images (4 URLs Required)
                  </label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      v-for="imgIndex in 4"
                      :key="`img-${index}-${imgIndex}`"
                    >
                      <input
                        v-model="slide.images[imgIndex - 1]"
                        type="url"
                        :placeholder="`Image ${imgIndex} URL`"
                        class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end gap-3">
            <button
              class="inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 px-6 py-3 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors font-jetbrains"
              @click.prevent="addEditorialCard"
            >
              Add Slide
            </button>
            <SaveSectionButton
              :is-loading="sectionSavingState.editorialSection"
              @click="handleSaveSection('editorialSection', editorialSection)"
            />
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
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col"
        >
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Leadership Badge
              </label>
              <input
                v-model="leadershipSection.leadershipBadge"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Leadership Headline
              </label>
              <input
                v-model="leadershipSection.leadershipHeadline"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Leadership Image URL
              </label>
              <input
                v-model="leadershipSection.leadershipImage"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="https://..."
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                Leadership Bio
              </label>
              <textarea
                v-model="leadershipSection.leadershipBio"
                rows="4"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                CTA Label
              </label>
              <input
                v-model="leadershipSection.leadershipCtaLabel"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="e.g. Read More"
              />
            </div>
            <div>
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >
                CTA Link
              </label>
              <input
                v-model="leadershipSection.leadershipCtaLink"
                type="text"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              />
            </div>
          </div>
          <div class="px-6 pb-6 pt-2 flex justify-end">
            <SaveSectionButton
              :is-loading="sectionSavingState.leadershipSection"
              @click="handleSaveSection('leadershipSection', leadershipSection)"
            />
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
          class="inline-flex items-center justify-center rounded-xl bg-black px-8 py-3 text-xs md:text-sm text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
        >
          <Icon
            v-if="isSaving"
            name="heroicons:arrow-path"
            class="mr-2 h-4 w-4 animate-spin"
          />
          {{ isSaving ? "Saving Everything..." : "Save All Changes" }}
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

// Config & Utilities
const confirm = useConfirm();

// Section Data
const heroSection = reactive({
  heroKicker: "",
  heroHeadline: "",
  heroVideoUrl: "",
  heroCta1Label: "",
  heroCta1Link: "",
  heroCta2Label: "",
  heroCta2Link: "",
});

const welcomeSection = reactive({
  welcomeBadge: "",
  welcomeHeadline: "",
  welcomeDescription: "",
});

const actionCardsSection = reactive({
  actionCards: [],
});

const championsSection = reactive({
  championHeadline: "",
  championDescription: "",
  championImage: "",
  championCtaLabel: "",
  championCtaLink: "",
});

// Explicitly initialize with 4 empty strings to ensure v-model binding works natively
const editorialSection = reactive({
  editorialSlides: [
    { images: ["", "", "", ""], kicker: "", title: "", description: "" },
    { images: ["", "", "", ""], kicker: "", title: "", description: "" },
    { images: ["", "", "", ""], kicker: "", title: "", description: "" },
  ],
});

const leadershipSection = reactive({
  leadershipBadge: "",
  leadershipHeadline: "",
  leadershipBio: "",
  leadershipImage: "",
  leadershipCtaLabel: "",
  leadershipCtaLink: "",
});

// Section Map
const sectionsMap = {
  heroSection,
  welcomeSection,
  actionCardsSection,
  championsSection,
  editorialSection,
  leadershipSection,
};

// State for individual section saves
const sectionSavingState = reactive({
  heroSection: false,
  welcomeSection: false,
  actionCardsSection: false,
  championsSection: false,
  editorialSection: false,
  leadershipSection: false,
});

// Helpers: Add/Remove
const addActionCard = () => {
  actionCardsSection.actionCards.push({
    image: "",
    kicker: "",
    title: "",
    ctaLabel: "",
    ctaLink: "",
  });
};

const removeActionCard = async (index) => {
  const answer = await confirm.ask({
    title: "Remove Card",
    message:
      "Are you sure you want to delete this card? Once saved this action is irreversible.",
    confirmText: "Remove",
    cancelText: "Cancel",
    isDestructive: true,
  });

  if (answer) {
    actionCardsSection.actionCards.splice(index, 1);
  }
};

const addEditorialCard = () => {
  editorialSection.editorialSlides.push({
    kicker: "",
    title: "",
    description: "",
    images: ["", "", "", ""], // explicitly pushing 4 empty strings
  });
};

const removeEditorialCard = async (index) => {
  const answer = await confirm.ask({
    title: "Remove Card",
    message:
      "Are you sure you want to delete this slide? Once saved this action is irreversible.",
    confirmText: "Remove",
    cancelText: "Cancel",
    isDestructive: true,
  });

  if (answer) {
    editorialSection.editorialSlides.splice(index, 1);
  }
};

// Custom parser to handle the specific array mapping for homepage
const homepageParser = (response, map) => {
  Object.entries(response).forEach(([key, value]) => {
    if (map[key]) {
      if (key === "actionCardsSection" && value.actionCards) {
        map.actionCardsSection.actionCards = value.actionCards;
      } else if (key === "editorialSection" && value.editorialSlides) {
        map.editorialSection.editorialSlides = value.editorialSlides.map(
          (slide) => ({
            ...slide,
            images: Array.isArray(slide.images)
              ? [...slide.images, "", "", "", ""].slice(0, 4)
              : ["", "", "", ""],
          }),
        );
      } else {
        Object.assign(map[key], value);
      }
    }
  });
};

// Initialize the composable
const { isFetching, isSaving, loadSettings, saveSettings, saveSection } =
  usePageManager("homepage", sectionsMap, { customParser: homepageParser });

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
