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
          Ministries Management
        </h1>
        <p class="text-gray-500 mt-1">
          Manage text and sections on the Ministries page.
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
            Hero Section
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-black mb-1">Hero Kicker</label>
              <input
                v-model="formData.heroKicker"
                type="text"
                class="block w-full px-4 py-2.5 rounded-xl border-gray-300 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="e.g. Our Ministries"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-black mb-1">Hero Headline</label>
              <input
                v-model="formData.heroHeadline"
                type="text"
                class="block w-full px-4 py-2.5 rounded-xl border-gray-300 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-black mb-1">Hero Image URL</label>
              <input
                v-model="formData.heroImageUrl"
                type="url"
                class="block w-full px-4 py-2.5 rounded-xl border-gray-300 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <!-- Ministries List -->
        <div class="space-y-5">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 class="text-lg font-bold text-gray-900">
              Ministries
            </h3>
            <button type="button" @click="addMinistry" class="text-sm font-bold text-blue-600 hover:text-blue-800">
              + Add Ministry
            </button>
          </div>
          <div class="space-y-8">
            <div v-for="(ministry, index) in formData.ministries" :key="'ministry' + index" class="p-5 border border-gray-200 rounded-xl bg-gray-50 relative">
              <button type="button" @click="removeMinistry(index)" class="absolute top-4 right-4 text-red-500 hover:text-red-700">
                <Icon name="heroicons:trash" class="h-5 w-5" />
              </button>
              <h4 class="text-md font-bold mb-4">Ministry {{ index + 1 }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-bold text-black mb-1">Name</label>
                  <input
                    v-model="ministry.name"
                    type="text"
                    class="block w-full px-4 py-2.5 rounded-xl border-gray-300 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                    placeholder="e.g. Youth Ministry"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold text-black mb-1">Subtitle / Alias</label>
                  <input
                    v-model="ministry.subtitle"
                    type="text"
                    class="block w-full px-4 py-2.5 rounded-xl border-gray-300 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                    placeholder="e.g. T.L.C"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-bold text-black mb-1">Description</label>
                  <textarea
                    v-model="ministry.description"
                    rows="3"
                    class="block w-full px-4 py-2.5 rounded-xl border-gray-300 text-black shadow-sm focus:border-black focus:ring-black sm:text-sm transition-colors"
                  ></textarea>
                </div>
              </div>
            </div>
            <div v-if="formData.ministries.length === 0" class="text-sm text-gray-500 text-center py-4">
              No ministries added yet.
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
          >
            <Icon
              v-if="isSaving"
              name="heroicons:arrow-path"
              class="animate-spin -ml-1 mr-2 h-5 w-5"
            />
            {{ isSaving ? "Saving Changes..." : "Save Changes" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { useAlertModal } from '@/composables/useAlertModal';
import { useErrorModal } from '@/composables/useErrorModal';

definePageMeta({
  middleware: ["auth"],
});

const { $api } = useNuxtApp();
const alertModal = useAlertModal();
const errorModal = useErrorModal();

const isFetching = ref(true);
const isSaving = ref(false);

const formData = ref({
  heroKicker: '',
  heroHeadline: '',
  heroImageUrl: '',
  ministries: []
});

const fetchSettings = async () => {
  isFetching.value = true;
  try {
    const { data } = await $api.get('/api/admin/ministries');
    if (data) {
      formData.value.heroKicker = data.heroKicker || '';
      formData.value.heroHeadline = data.heroHeadline || '';
      formData.value.heroImageUrl = data.heroImageUrl || '';
      formData.value.ministries = Array.isArray(data.ministries) ? data.ministries : [];
    }
  } catch (error) {
    console.error('Failed to fetch ministries settings:', error);
    errorModal.show({
      title: 'Fetch Error',
      message: 'Failed to fetch the ministries configuration. Please try again.',
    });
  } finally {
    isFetching.value = false;
  }
};

const addMinistry = () => {
  formData.value.ministries.push({
    name: '',
    subtitle: '',
    description: ''
  });
};

const removeMinistry = (index) => {
  formData.value.ministries.splice(index, 1);
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    await $api.put('/api/admin/ministries', formData.value);
    alertModal.show({
      title: 'Success',
      message: 'Ministries page configuration has been updated successfully.',
      type: 'success'
    });
  } catch (error) {
    console.error('Failed to save ministries settings:', error);
    errorModal.show({
      title: 'Save Error',
      message: 'There was an issue saving your changes. Please check your connection and try again.',
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>