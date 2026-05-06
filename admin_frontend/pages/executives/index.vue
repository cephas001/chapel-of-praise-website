<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
    >
      <AppPageHeader
        text="Executive Management"
        description="Manage the roster of chapel executives across all units."
        classList="mt-5"
      />

      <button
        @click="openCreateDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
      >
        <Icon name="heroicons:user-plus" class="mr-2 h-5 w-5" />
        New Executive
      </button>
    </div>

    <div
      class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div v-if="isFetching" class="p-12 text-center">
        <Icon
          name="heroicons:arrow-path"
          class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
        />
        <h3 class="text-sm font-bold text-gray-900">Loading Executives...</h3>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Executive
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Chapel Unit
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Academic Details
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-50">
            <tr
              v-for="exec in executives"
              :key="exec.id"
              class="hover:bg-gray-50/50 transition-colors group"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold"
                  >
                    {{ exec.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="text-sm font-bold text-gray-900">
                      {{ exec.name }}
                    </div>
                    <div
                      class="text-xs text-gray-500 mt-0.5 flex items-center gap-1"
                    >
                      <Icon name="heroicons:envelope" class="h-3 w-3" />
                      {{ exec.emailAddress }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700"
                >
                  {{ exec.chapelUnit }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">
                  {{ exec.schoolDepartment }}
                </div>
                <div class="text-xs text-gray-500 mt-0.5 font-medium">
                  Level {{ exec.level }} • {{ exec.matricNumber }}
                </div>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="openEditDrawer(exec)"
                  class="text-gray-400 hover:text-black transition-colors p-2 rounded-lg hover:bg-gray-100"
                  title="View / Edit Details"
                >
                  <Icon name="heroicons:pencil-square" class="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!isFetching && executives.length === 0"
        class="p-12 text-center border-t border-gray-100"
      >
        <Icon
          name="heroicons:users"
          class="mx-auto h-12 w-12 text-gray-300 mb-4"
        />
        <h3 class="text-lg font-bold text-gray-900 mb-1">
          No executives found
        </h3>
        <p class="text-gray-500 text-sm">
          Get started by registering a new executive.
        </p>
      </div>
    </div>

    <SlideOver
      :is-open="isDrawerOpen"
      :title="
        selectedExecutive ? 'Edit Executive Details' : 'Register New Executive'
      "
      @close="closeDrawer"
    >
      <MemberExecutiveForm
        :initial-data="selectedExecutive"
        :loading="isSubmitting"
        @submit="handleFormSubmit"
      />
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { useAlertModal } from "~/composables/useAlertModal";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

const executives = ref([]);
const isFetching = ref(true);
const isSubmitting = ref(false);

const isDrawerOpen = ref(false);
const selectedExecutive = ref(null);

const fetchExecutives = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/members/executives`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    executives.value = response;
  } catch (error) {
    console.error("Failed to fetch executives:", error);
    showAlert(
      "Error",
      "Failed to retrieve executives from the server.",
      "error",
    );
  } finally {
    isFetching.value = false;
  }
};

onMounted(() => {
  fetchExecutives();
});

const openCreateDrawer = () => {
  selectedExecutive.value = null;
  isDrawerOpen.value = true;
};

const openEditDrawer = (exec) => {
  selectedExecutive.value = { ...exec };
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  setTimeout(() => {
    selectedExecutive.value = null;
  }, 300);
};

const handleFormSubmit = async (formData) => {
  isSubmitting.value = true;

  try {
    if (selectedExecutive.value) {
      // NOTE: You'll need to add a PUT route in memberRoutes.js if you want to support edits.
      // For now, this mimics the event update flow.
      const response = await $fetch(
        `${config.public.apiBase}/members/executives/${selectedExecutive.value.id}`,
        {
          method: "PUT",
          body: formData,
          headers: { Authorization: `Bearer ${authStore.token}` },
        },
      );
      const index = executives.value.findIndex(
        (e) => e.id === selectedExecutive.value.id,
      );
      if (index !== -1) executives.value[index] = response.data;
      showAlert("Success", "Executive updated successfully", "success");
    } else {
      // CREATE
      const response = await $fetch(
        `${config.public.apiBase}/members/executives`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${authStore.token}` },
        },
      );
      executives.value.unshift(response.data);
      showAlert("Success", "Executive registered successfully", "success");
    }

    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    showAlert(
      "Action Failed",
      error.data?.error || "Could not save the executive.",
      "error",
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>
