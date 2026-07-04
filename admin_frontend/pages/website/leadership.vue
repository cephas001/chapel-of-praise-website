<template>
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
      <!-- Hero Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Hero Section
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Configure the top banner of the leadership page.
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
                placeholder="e.g. Our Leaders"
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
              />
            </div>
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Hero Background Image URL</label
              >
              <input
                v-model="formData.heroImageUrl"
                type="url"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Team Section Overview
          </h3>
          <p class="text-xs md:text-sm text-gray-500">
            Provide a general introduction to the leadership team.
          </p>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label
                class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                >Headline</label
              >
              <input
                v-model="formData.teamHeadline"
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
                v-model="formData.teamDescription"
                rows="3"
                class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Chaplaincy List -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Chaplaincy List
          </h3>
          <p class="text-xs md:text-sm text-gray-500 mb-5">
            Manage the pastoral and spiritual leadership team.
          </p>
          <button
            type="button"
            @click="addChaplain"
            class="inline-flex items-center px-4 py-2 text-[11px] font-bold text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-jetbrains shadow-sm"
          >
            + Add Chaplain
          </button>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div
            v-if="formData.chaplaincyList.length === 0"
            class="text-xs text-gray-500 text-center py-4"
          >
            No chaplains added yet.
          </div>
          <div
            v-for="(chaplain, index) in formData.chaplaincyList"
            :key="'chaplain' + index"
            class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative pt-12"
          >
            <span
              class="absolute top-5 left-5 text-[11px] font-bold text-gray-400 uppercase font-jetbrains"
              >Chaplain {{ index + 1 }}</span
            >
            <button
              type="button"
              @click="removeChaplain(index)"
              class="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors p-1"
              title="Remove Chaplain"
            >
              <Icon name="heroicons:trash" class="h-4 w-4" />
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Name</label
                >
                <input
                  v-model="chaplain.name"
                  type="text"
                  class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Title</label
                >
                <input
                  v-model="chaplain.title"
                  type="text"
                  class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
              <div class="md:col-span-2">
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Image URL</label
                >
                <input
                  v-model="chaplain.imageUrl"
                  type="url"
                  class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                  placeholder="https://..."
                />
              </div>
              <div class="md:col-span-2">
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Bio</label
                >
                <textarea
                  v-model="chaplain.bio"
                  rows="3"
                  class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Executives List -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8"
      >
        <div class="md:col-span-1">
          <h3 class="text-md font-jetbrains font-bold text-gray-900 mb-1">
            Student Executives
          </h3>
          <p class="text-xs md:text-sm text-gray-500 mb-5">
            Manage the student leadership council.
          </p>
          <button
            type="button"
            @click="addExecutive"
            class="inline-flex items-center px-4 py-2 text-[11px] font-bold text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-jetbrains shadow-sm"
          >
            + Add Executive
          </button>
        </div>
        <div
          class="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6"
        >
          <div
            v-if="formData.studentExecutivesList.length === 0"
            class="text-xs text-gray-500 text-center py-4"
          >
            No student executives added yet.
          </div>
          <div
            v-for="(exec, index) in formData.studentExecutivesList"
            :key="'exec' + index"
            class="bg-gray-50/50 rounded-xl p-5 border border-gray-200 relative pt-12"
          >
            <span
              class="absolute top-5 left-5 text-[11px] font-bold text-gray-400 uppercase font-jetbrains"
              >Executive {{ index + 1 }}</span
            >
            <button
              type="button"
              @click="removeExecutive(index)"
              class="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors p-1"
              title="Remove Executive"
            >
              <Icon name="heroicons:trash" class="h-4 w-4" />
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Name</label
                >
                <input
                  v-model="exec.name"
                  type="text"
                  class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
              <div>
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Title</label
                >
                <input
                  v-model="exec.title"
                  type="text"
                  class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                />
              </div>
              <div class="md:col-span-2">
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Image URL</label
                >
                <input
                  v-model="exec.imageUrl"
                  type="url"
                  class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm"
                  placeholder="https://..."
                />
              </div>
              <div class="md:col-span-2">
                <label
                  class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
                  >Bio</label
                >
                <textarea
                  v-model="exec.bio"
                  rows="3"
                  class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Footer -->
      <div
        class="fixed bottom-0 right-0 w-full md:w-[calc(100%-18rem)] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex justify-end space-x-4 z-30"
      >
        <button
          type="button"
          @click="fetchSettings"
          class="px-5 py-2.5 text-xs md:text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-jetbrains"
          :disabled="isSaving"
        >
          Discard
        </button>
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
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { useAlertModal } from "@/composables/useAlertModal";
import { useErrorModal } from "@/composables/useErrorModal";

definePageMeta({
  layout: "default",
});

const { $api } = useNuxtApp();
const { showAlert } = useAlertModal();
const { showError } = useErrorModal();

const isFetching = ref(true);
const isSaving = ref(false);

const formData = ref({
  heroKicker: "",
  heroHeadline: "",
  heroImageUrl: "",
  teamHeadline: "",
  teamDescription: "",
  chaplaincyList: [],
  studentExecutivesList: [],
});

const defaultChaplain = () => ({ name: "", title: "", bio: "", imageUrl: "" });
const defaultExecutive = () => ({ name: "", title: "", bio: "", imageUrl: "" });

const addChaplain = () => formData.value.chaplaincyList.push(defaultChaplain());
const removeChaplain = (index) =>
  formData.value.chaplaincyList.splice(index, 1);

const addExecutive = () =>
  formData.value.studentExecutivesList.push(defaultExecutive());
const removeExecutive = (index) =>
  formData.value.studentExecutivesList.splice(index, 1);

const fetchSettings = async () => {
  isFetching.value = true;
  try {
    const response = await $api.get("/admin/leadership");
    if (response.data && Object.keys(response.data).length > 0) {
      formData.value = {
        heroKicker: response.data.heroKicker || "",
        heroHeadline: response.data.heroHeadline || "",
        heroImageUrl: response.data.heroImageUrl || "",
        teamHeadline: response.data.teamHeadline || "",
        teamDescription: response.data.teamDescription || "",
        chaplaincyList: response.data.chaplaincyList || [],
        studentExecutivesList: response.data.studentExecutivesList || [],
      };
    }
  } catch (err) {
    showError("Failed to load leadership configuration.");
  } finally {
    isFetching.value = false;
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    await $api.put("/admin/leadership", formData.value);
    showAlert(
      "Success!",
      "Leadership configuration updated successfully.",
      "success",
    );
  } catch (err) {
    showError("Failed to save configuration. Please try again.");
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>
