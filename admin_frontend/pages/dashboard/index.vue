<template>
  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Dashboard Quick Links
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Access external services and operational tools.
        </p>
      </div>

      <button
        v-if="isSuperAdmin"
        @click="openAddCategoryDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
      >
        <Icon name="heroicons:folder-plus" class="mr-2 h-4 w-4" />
        Add Category
      </button>
    </div>

    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3
        class="text-[11px] font-bold font-jetbrains text-gray-500 uppercase tracking-widest animate-pulse"
      >
        Loading Quick Links...
      </h3>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
    >
      <div
        v-for="(section, index) in dashboardSections"
        :key="section.id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full transition-all duration-200"
      >
        <div
          class="bg-gray-50/50 border-b border-gray-100 px-5 py-4 flex justify-between items-center"
        >
          <h3 class="text-sm font-jetbrains font-bold text-black">
            {{ section.title }}
          </h3>
          <button
            v-if="isSuperAdmin"
            @click="openAddLinkDrawer(section.id)"
            class="text-gray-400 hover:text-black transition-colors p-1 rounded-md hover:bg-gray-200/50"
            title="Add Link"
          >
            <Icon name="heroicons:plus" class="h-4 w-4" />
          </button>
        </div>

        <div class="p-3 flex-1 flex flex-col gap-1">
          <div
            v-if="!section.links || section.links.length === 0"
            class="text-center py-10"
          >
            <p
              class="text-[11px] font-jetbrains font-bold text-gray-400 uppercase tracking-widest"
            >
              No links available
            </p>
          </div>

          <a
            v-for="link in section.links"
            :key="link.id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
          >
            <span
              class="text-xs md:text-sm font-semibold text-gray-800 tracking-wide transition-colors truncate pr-4"
            >
              {{ link.label }}
            </span>
            <div class="flex items-center gap-3 shrink-0">
              <button
                v-if="isSuperAdmin"
                @click.prevent="handleDeleteLink(section.id, link.id)"
                class="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 rounded hover:bg-red-50"
                title="Remove Link"
              >
                <Icon name="heroicons:trash" class="h-4 w-4" />
              </button>
              <Icon
                name="heroicons:arrow-top-right-on-square"
                class="h-4 w-4 text-gray-400 group-hover:text-black transition-colors"
              />
            </div>
          </a>
        </div>
      </div>
    </div>

    <SlideOver
      :is-open="isDrawerOpen"
      title="Add New Link"
      @close="closeDrawer"
    >
      <form @submit.prevent="submitNewLink" class="p-1 font-poppins space-y-6">
        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Link Label
          </label>
          <input
            v-model="newLinkData.label"
            type="text"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
            placeholder="e.g. Staff Directory"
          />
        </div>

        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            URL
          </label>
          <input
            v-model="newLinkData.url"
            type="url"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
            placeholder="https://..."
          />
        </div>

        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Category
          </label>
          <div class="relative">
            <select
              v-model="newLinkData.sectionId"
              required
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled>Select Category...</option>
              <option
                v-for="section in dashboardSections"
                :key="section.id"
                :value="section.id"
              >
                {{ section.title }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <Icon
                name="heroicons:chevron-down"
                class="h-4 w-4 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full inline-flex items-center justify-center rounded-xl bg-black px-8 py-3.5 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
          >
            <Icon
              v-if="isSubmitting"
              name="heroicons:arrow-path"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isSubmitting ? "Saving..." : "Save Link" }}
          </button>
        </div>
      </form>
    </SlideOver>

    <SlideOver
      :is-open="isCategoryDrawerOpen"
      title="Add New Category"
      @close="closeCategoryDrawer"
    >
      <form
        @submit.prevent="submitNewCategory"
        class="p-1 font-poppins space-y-6"
      >
        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Category Title
          </label>
          <input
            v-model="newCategoryData.title"
            type="text"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
            placeholder="e.g. Media & Assets"
          />
        </div>

        <div class="pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isSubmittingCategory"
            class="w-full inline-flex items-center justify-center rounded-xl bg-black px-8 py-3.5 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
          >
            <Icon
              v-if="isSubmittingCategory"
              name="heroicons:arrow-path"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ isSubmittingCategory ? "Saving..." : "Create Category" }}
          </button>
        </div>
      </form>
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRuntimeConfig } from "#app";
import { useAlertModal } from "@/composables/useAlertModal";
import { useErrorModal } from "@/composables/useErrorModal";
import { useAuthStore } from "@/stores/auth";

const config = useRuntimeConfig();
const alertModal = useAlertModal();
const errorModal = useErrorModal();
const authStore = useAuthStore();

// Permission check
const isSuperAdmin = computed(() => authStore.user?.role === "super_admin");

const isFetching = ref(true);
const isSubmitting = ref(false);
const isDrawerOpen = ref(false);
const isCategoryDrawerOpen = ref(false);
const isSubmittingCategory = ref(false);

const newLinkData = ref({
  label: "",
  url: "",
  sectionId: "",
});

const newCategoryData = ref({
  title: "",
});

const dashboardSections = ref([]);

// Fetch all dashboard links
const fetchLinks = async () => {
  isFetching.value = true;
  try {
    const data = await $fetch(`${config.public.apiBase}/dashboard-links`, {
      method: "GET",
    });
    if (data && Array.isArray(data)) {
      dashboardSections.value = data;
    }
  } catch (error) {
    console.error("Failed to fetch quick links:", error);
    errorModal.show({
      title: "Fetch Error",
      message: "Failed to load the dashboard links. Please try again.",
    });
  } finally {
    isFetching.value = false;
  }
};

// Drawer controls
const openAddLinkDrawer = (sectionId) => {
  newLinkData.value = { label: "", url: "", sectionId };
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

// Submit new link
const submitNewLink = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      categoryId: newLinkData.value.sectionId, // backend expects categoryId
      label: newLinkData.value.label,
      url: newLinkData.value.url,
    };

    await $fetch(`${config.public.apiBase}/dashboard-links/link`, {
      method: "POST",
      body: payload,
    });

    alertModal.show({
      title: "Success",
      message: "New link added successfully.",
      type: "success",
    });
    closeDrawer();
    await fetchLinks();
  } catch (error) {
    console.error("Failed to add link:", error);
    errorModal.show({
      title: "Save Error",
      message: "There was an issue saving the new link.",
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Delete link
const handleDeleteLink = async (sectionId, linkId) => {
  if (!confirm("Are you sure you want to remove this link?")) return;

  try {
    await $fetch(
      `${config.public.apiBase}/dashboard-links/${sectionId}/${linkId}`,
      {
        method: "DELETE",
      },
    );

    // Optimistic UI update
    const sectionIndex = dashboardSections.value.findIndex(
      (s) => s.id === sectionId,
    );
    if (sectionIndex !== -1) {
      dashboardSections.value[sectionIndex].links = dashboardSections.value[
        sectionIndex
      ].links.filter((l) => l.id !== linkId);
    }
  } catch (error) {
    console.error("Failed to delete link:", error);
    errorModal.show({
      title: "Delete Error",
      message: "Could not remove the link at this time.",
    });
  }
};

// Category drawer controls
const openAddCategoryDrawer = () => {
  newCategoryData.value = { title: "" };
  isCategoryDrawerOpen.value = true;
};

const closeCategoryDrawer = () => {
  isCategoryDrawerOpen.value = false;
};

// Submit new category
const submitNewCategory = async () => {
  isSubmittingCategory.value = true;
  try {
    await $fetch(`${config.public.apiBase}/dashboard-links/category`, {
      method: "POST",
      body: newCategoryData.value,
    });

    alertModal.show({
      title: "Success",
      message: "New category created successfully.",
      type: "success",
    });
    closeCategoryDrawer();
    await fetchLinks();
  } catch (error) {
    console.error("Failed to add category:", error);
    errorModal.show({
      title: "Save Error",
      message: "There was an issue creating the category.",
    });
  } finally {
    isSubmittingCategory.value = false;
  }
};

onMounted(() => {
  fetchLinks();
});
</script>
