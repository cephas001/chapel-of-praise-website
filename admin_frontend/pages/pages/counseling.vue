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
          Counseling Page Management
        </h1>
        <p class="text-gray-500 mt-1">
          Manage text and sections on the website's Counseling page.
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
                class="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Need Help?"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Hero Headline</label>
              <input
                v-model="formData.heroHeadline"
                type="text"
                class="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Request Counseling"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Hero Background Image URL</label>
              <input
                v-model="formData.heroImage"
                type="url"
                class="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <!-- Form Details Section -->
        <div class="space-y-5">
          <h3 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Form Details
          </h3>
          <div class="grid grid-cols-1 gap-5">
            <div>
              <label class="block text-sm font-bold text-black mb-1">Form Heading</label>
              <input
                v-model="formData.formHeading"
                type="text"
                class="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Schedule a Session"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Form Description</label>
              <textarea
                v-model="formData.formDescription"
                rows="4"
                class="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="Enter a brief description..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Form Footer Note</label>
              <input
                v-model="formData.formFooterNote"
                type="text"
                class="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Your information is kept confidential."
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
import { useRuntimeConfig, useFetch } from "#app";
import { useAlertModal } from "~/composables/useAlertModal";

const config = useRuntimeConfig();
const { showAlert } = useAlertModal();

const isFetching = ref(true);
const isSaving = ref(false);

const formData = reactive({
  heroKicker: "",
  heroHeadline: "",
  heroImage: "",
  formHeading: "",
  formDescription: "",
  formFooterNote: "",
});

const loadSettings = async () => {
  isFetching.value = true;
  try {
    const { data } = await useFetch(`${config.public.apiBase}/api/admin/counseling`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    
    if (data.value) {
      Object.assign(formData, {
        heroKicker: data.value.heroKicker || "",
        heroHeadline: data.value.heroHeadline || "",
        heroImage: data.value.heroImage || "",
        formHeading: data.value.formHeading || "",
        formDescription: data.value.formDescription || "",
        formFooterNote: data.value.formFooterNote || "",
      });
    }
  } catch (error) {
    console.error("Error loading counseling settings", error);
  } finally {
    isFetching.value = false;
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/admin/counseling`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: formData,
    });
    showAlert("Success", "Counseling settings updated successfully");
  } catch (error) {
    console.error("Error saving counseling settings", error);
    showAlert("Error", "Failed to update counseling settings");
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>