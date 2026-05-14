<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <NuxtLink
          to="/"
          class="inline-flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors mb-2"
        >
          <Icon name="heroicons:arrow-left" class="mr-2 h-4 w-4" />
          Back to Dashboard
        </NuxtLink>
        <h1 class="text-3xl font-black text-slate-950 dark:text-white tracking-tight font-roboto">
          Leadership Management
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">
          Manage text and sections on the Leadership page.
        </p>
      </div>
    </div>

    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-slate-400 dark:text-slate-600 animate-spin mb-4"
      />
      <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100">Loading Configuration...</h3>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
      <form @submit.prevent="saveSettings" class="space-y-8">
        
        <!-- Hero Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Hero Section
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Hero Kicker</label>
              <input
                v-model="formData.heroKicker"
                type="text"
                class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                placeholder="e.g. Our Leaders"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Hero Headline</label>
              <input
                v-model="formData.heroHeadline"
                type="text"
                class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Hero Image URL</label>
              <input
                v-model="formData.heroImageUrl"
                type="url"
                class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <!-- Team Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Team Section Overview
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Headline</label>
              <input
                v-model="formData.teamHeadline"
                type="text"
                class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Description</label>
              <textarea
                v-model="formData.teamDescription"
                rows="3"
                class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Chaplaincy List -->
        <div class="space-y-5">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Chaplaincy List
            </h3>
            <button type="button" @click="addChaplain" class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              + Add Chaplain
            </button>
          </div>
          <div class="space-y-8">
            <div v-for="(chaplain, index) in formData.chaplaincyList" :key="'chaplain' + index" class="p-5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 relative">
              <button type="button" @click="removeChaplain(index)" class="absolute top-4 right-4 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                <Icon name="heroicons:trash" class="h-5 w-5" />
              </button>
              <h4 class="text-md font-bold text-slate-950 dark:text-white mb-4">Chaplain {{ index + 1 }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Name</label>
                  <input
                    v-model="chaplain.name"
                    type="text"
                    class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Title</label>
                  <input
                    v-model="chaplain.title"
                    type="text"
                    class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Image URL</label>
                  <input
                    v-model="chaplain.imageUrl"
                    type="url"
                    class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Bio</label>
                  <textarea
                    v-model="chaplain.bio"
                    rows="3"
                    class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                  ></textarea>
                </div>
              </div>
            </div>
            <div v-if="formData.chaplaincyList.length === 0" class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              No chaplains added yet.
            </div>
          </div>
        </div>

        <!-- Student Executives List -->
        <div class="space-y-5">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Student Executives List
            </h3>
            <button type="button" @click="addExecutive" class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              + Add Executive
            </button>
          </div>
          <div class="space-y-8">
            <div v-for="(exec, index) in formData.studentExecutivesList" :key="'exec' + index" class="p-5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 relative">
              <button type="button" @click="removeExecutive(index)" class="absolute top-4 right-4 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                <Icon name="heroicons:trash" class="h-5 w-5" />
              </button>
              <h4 class="text-md font-bold text-slate-950 dark:text-white mb-4">Executive {{ index + 1 }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Name</label>
                  <input
                    v-model="exec.name"
                    type="text"
                    class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Title</label>
                  <input
                    v-model="exec.title"
                    type="text"
                    class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Image URL</label>
                  <input
                    v-model="exec.imageUrl"
                    type="url"
                    class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-slate-950 dark:text-white mb-1">Bio</label>
                  <textarea
                    v-model="exec.bio"
                    rows="3"
                    class="block w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:border-slate-950 dark:focus:border-white focus:ring-slate-950 dark:focus:ring-white sm:text-sm transition-colors"
                  ></textarea>
                </div>
              </div>
            </div>
            <div v-if="formData.studentExecutivesList.length === 0" class="text-sm text-gray-500 text-center py-4">
              No student executives added yet.
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="pt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
          <button
            type="button"
            @click="fetchSettings"
            class="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            :disabled="isSaving"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-slate-950 dark:bg-white dark:text-slate-950 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-950 dark:focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSaving"
          >
            <Icon
              v-if="isSaving"
              name="heroicons:arrow-path"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isSaving ? "Saving..." : "Save Configuration" }}
          </button>
        </div>

      </form>
    </div>
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

const defaultChaplain = () => ({ name: '', title: '', bio: '', imageUrl: '' });
const defaultExecutive = () => ({ name: '', title: '', bio: '', imageUrl: '' });

const addChaplain = () => formData.value.chaplaincyList.push(defaultChaplain());
const removeChaplain = (index) => formData.value.chaplaincyList.splice(index, 1);

const addExecutive = () => formData.value.studentExecutivesList.push(defaultExecutive());
const removeExecutive = (index) => formData.value.studentExecutivesList.splice(index, 1);

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
    showAlert("Success!", "Leadership configuration updated successfully.", "success");
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
