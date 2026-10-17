<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <!-- INVISIBLE OVERLAY: Closes dropdowns when clicking outside -->
    <div
      v-if="activeDropdown"
      class="fixed inset-0 z-scrim"
      aria-hidden="true"
      @click="closeDropdown"
    />

    <AppHeading
      class="mb-8"
      title="Dashboard quick links"
      subtitle="Access external services and operational tools."
    >
      <template #actions>
        <AppButton
          v-if="isSuperAdmin"
          icon="heroicons:folder-plus"
          @click="openAddCategoryDrawer"
        >
          Add category
        </AppButton>
      </template>
    </AppHeading>

    <div
      v-if="!isSuperAdmin"
      class="mt-6 flex items-start gap-2.5 rounded-control border border-line bg-subtle px-4 py-3"
    >
      <Icon
        name="heroicons:eye"
        class="mt-0.5 h-4 w-4 shrink-0 text-muted"
      />
      <p class="text-xs font-medium leading-relaxed text-ink">
        You have view-only access to Quick Links. Contact a super admin to add
        or edit links.
      </p>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 items-start"
    >
      <AppCard
        v-for="section in dashboardSections"
        :key="section.id"
        body-class="p-0"
        class="flex flex-col"
      >
        <div
          class="flex items-center justify-between border-b border-line bg-subtle/50 px-5 py-4"
        >
          <h3 class="text-sm font-semibold text-ink">
            {{ section.title }}
          </h3>

          <div class="flex items-center gap-1">
            <!-- Collapse Button (Visible to everyone) -->
            <button
              class="rounded-control p-1.5 text-muted transition-colors hover:bg-subtle hover:text-ink"
              :title="
                collapsedSections[section.id]
                  ? 'Expand section'
                  : 'Collapse section'
              "
              @click="toggleCollapse(section.id)"
            >
              <Icon
                name="heroicons:chevron-down"
                class="h-5 w-5 transition-transform duration-200"
                :class="{ 'rotate-180': !collapsedSections[section.id] }"
              />
            </button>

            <!-- Super Admin Dropdown -->
            <div v-if="isSuperAdmin" class="relative z-panel">
              <button
                class="rounded-control p-1.5 text-muted transition-colors hover:bg-subtle hover:text-ink"
                @click="toggleDropdown('category_' + section.id)"
              >
                <Icon name="heroicons:ellipsis-vertical" class="h-5 w-5" />
              </button>

              <!-- Native Vue Dropdown Menu -->
              <div
                v-if="activeDropdown === 'category_' + section.id"
                class="absolute right-0 mt-2 flex w-40 flex-col rounded-surface border border-line bg-surface p-2 shadow-overlay"
              >
                <button
                  class="w-full rounded-control px-3 py-2 text-left text-xs text-ink transition-colors hover:bg-subtle"
                  @click="
                    openEditCategoryDrawer(section);
                    closeDropdown();
                  "
                >
                  Edit category
                </button>
                <button
                  class="w-full rounded-control px-3 py-2 text-left text-xs text-ink transition-colors hover:bg-subtle"
                  @click="
                    openAddLinkDrawer(section.id);
                    closeDropdown();
                  "
                >
                  Add link
                </button>
                <div class="my-1 border-t border-line" />
                <button
                  class="w-full rounded-control px-3 py-2 text-left text-xs text-danger-text transition-colors hover:bg-danger-surface"
                  @click="
                    handleDeleteCategory(section.id);
                    closeDropdown();
                  "
                >
                  Delete category
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Links Container (Hidden when collapsed) -->
        <div
          v-show="!collapsedSections[section.id]"
          class="p-3 flex-1 flex flex-col gap-1"
        >
          <div
            v-if="!section.links || section.links.length === 0"
            class="text-center py-5"
          >
            <p class="font-mono text-xs text-muted">
              No links available
            </p>
          </div>

          <div
            v-for="link in section.links"
            :key="link.id"
            class="group flex items-center justify-between rounded-control border border-transparent p-3 transition-colors hover:border-line hover:bg-subtle/60"
          >
            <a
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="min-w-0 flex-1 truncate pr-4 font-mono text-xs text-ink transition-colors md:text-sm"
            >
              {{ link.label }}
            </a>

            <div
              v-if="isSuperAdmin"
              class="shrink-0 relative z-panel"
            >
              <button
                class="rounded-control p-1 text-muted transition-colors hover:bg-subtle hover:text-ink"
                aria-label="Link actions"
                @click="toggleDropdown('link_' + link.id)"
              >
                <Icon
                  name="heroicons:ellipsis-vertical"
                  class="h-4 w-4 text-muted group-hover:text-ink"
                />
              </button>

              <!-- Native Vue Dropdown Menu -->
              <div
                v-if="activeDropdown === 'link_' + link.id"
                class="absolute right-0 mt-2 flex w-32 flex-col rounded-surface border border-line bg-surface p-1 shadow-overlay"
              >
                <button
                  class="w-full rounded-control px-3 py-2 text-left text-xs text-ink transition-colors hover:bg-subtle"
                  @click="
                    openEditLinkDrawer(section.id, link);
                    closeDropdown();
                  "
                >
                  Edit
                </button>
                <button
                  class="w-full rounded-control px-3 py-2 text-left text-xs text-danger-text transition-colors hover:bg-danger-surface"
                  @click="
                    handleDeleteLink(section.id, link.id);
                    closeDropdown();
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <SlideOver
      :is-open="isDrawerOpen"
      :title="editingLinkId ? 'Edit link' : 'Add new link'"
      @close="closeDrawer"
    >
      <form class="space-y-6 p-1" @submit.prevent="submitNewLink">
        <div>
          <label
            for="quicklink-label"
            class="block text-xs font-medium text-ink mb-2"
          >
            Link Label
          </label>
          <input
            id="quicklink-label"
            v-model="newLinkData.label"
            type="text"
            required
            class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
            placeholder="e.g. Staff Directory"
          >
        </div>

        <div>
          <label
            for="quicklink-url"
            class="block text-xs font-medium text-ink mb-2"
          >
            URL
          </label>
          <input
            id="quicklink-url"
            v-model="newLinkData.url"
            type="url"
            required
            class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
            placeholder="https://..."
          >
        </div>

        <div>
          <label
            for="quicklink-category"
            class="block text-xs font-medium text-ink mb-2"
          >
            Category
          </label>
          <div class="relative">
            <select
              id="quicklink-category"
              v-model="newLinkData.sectionId"
              required
              class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm cursor-pointer"
            >
              <option value="" disabled>Select category…</option>
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
                class="h-4 w-4 text-muted"
              />
            </div>
          </div>
        </div>

        <div class="border-t border-line pt-6">
          <AppButton
            type="submit"
            size="lg"
            class="w-full"
            :loading="isSubmitting"
          >
            {{
              isSubmitting
                ? "Saving…"
                : editingLinkId
                  ? "Update link"
                  : "Save link"
            }}
          </AppButton>
        </div>
      </form>
    </SlideOver>

    <SlideOver
      :is-open="isCategoryDrawerOpen"
      :title="editingCategoryId ? 'Edit category' : 'Add new category'"
      @close="closeCategoryDrawer"
    >
      <form
        class="space-y-6 p-1"
        @submit.prevent="submitNewCategory"
      >
        <div>
          <label
            for="quicklink-category-title"
            class="block text-xs font-medium text-ink mb-2"
          >
            Category Title
          </label>
          <input
            id="quicklink-category-title"
            v-model="newCategoryData.title"
            type="text"
            required
            class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
            placeholder="e.g. Media & Assets"
          >
        </div>

        <div class="border-t border-line pt-6">
          <AppButton
            type="submit"
            size="lg"
            class="w-full"
            :loading="isSubmittingCategory"
          >
            {{
              isSubmittingCategory
                ? "Saving…"
                : editingCategoryId
                  ? "Update category"
                  : "Create category"
            }}
          </AppButton>
        </div>
      </form>
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "@/stores/auth";
import { useConfirm } from "~/composables/useConfirm";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast();
const confirm = useConfirm();

// Permission check
const isSuperAdmin = computed(() => authStore.user?.role === "super_admin");

const isFetching = ref(true);
const isSubmitting = ref(false);
const isDrawerOpen = ref(false);
const isCategoryDrawerOpen = ref(false);
const isSubmittingCategory = ref(false);

// Add ID trackers for edit modes
const editingCategoryId = ref(null);
const editingLinkId = ref(null);
const editingSectionIdForLink = ref(null);

// --- COLLAPSE STATE ---
const collapsedSections = ref({});

const toggleCollapse = (sectionId) => {
  collapsedSections.value[sectionId] = !collapsedSections.value[sectionId];
};

// --- DROPDOWN STATE ---
// Tracks which specific menu is currently open (e.g., 'category_123' or 'link_456')
const activeDropdown = ref(null);

const toggleDropdown = (id) => {
  activeDropdown.value = activeDropdown.value === id ? null : id;
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

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
    const data = await $fetch(
      `${config.public.apiBase}/admin/dashboard-links`,
      {
        method: "GET",
      },
    );
    if (data && Array.isArray(data)) {
      dashboardSections.value = data;
    }
  } catch (error) {
    console.error("Failed to fetch quick links:", error);
    toast.error("Failed to fetch quick links");
  } finally {
    isFetching.value = false;
  }
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

// Delete link
const handleDeleteLink = async (sectionId, linkId) => {
  if (!isSuperAdmin.value) return;
  const answer = await confirm.ask({
    title: "Remove link",
    message: "Are you sure you want to remove this link?",
    confirmText: "Remove",
    cancelText: "Cancel",
    isDestructive: true,
  });
  if (!answer) return;

  try {
    await $fetch(
      `${config.public.apiBase}/admin/dashboard-links/${sectionId}/${linkId}`,
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
    toast.error("Failed to delete link");
  }
};

const closeCategoryDrawer = () => {
  isCategoryDrawerOpen.value = false;
};

// Open Edit Mode
const openEditCategoryDrawer = (category) => {
  editingCategoryId.value = category.id;
  newCategoryData.value = { title: category.title };
  isCategoryDrawerOpen.value = true;
};

// Modify your existing openAddCategoryDrawer to reset the ID
const openAddCategoryDrawer = () => {
  editingCategoryId.value = null;
  newCategoryData.value = { title: "" };
  isCategoryDrawerOpen.value = true;
};

// Modify your existing submitNewCategory to handle both POST and PUT
const submitNewCategory = async () => {
  if (!isSuperAdmin.value) return;
  isSubmittingCategory.value = true;
  try {
    if (editingCategoryId.value) {
      // UPDATE CATEGORY
      await $fetch(
        `${config.public.apiBase}/admin/dashboard-links/category/${editingCategoryId.value}`,
        {
          method: "PUT",
          body: newCategoryData.value,
        },
      );
      toast.success("Category updated successfully.");
    } else {
      // CREATE CATEGORY
      await $fetch(`${config.public.apiBase}/admin/dashboard-links/category`, {
        method: "POST",
        body: newCategoryData.value,
      });
      toast.success("New category created successfully.");
    }

    closeCategoryDrawer();
    await fetchLinks();
  } catch (error) {
    console.error("Failed to save category:", error);
    toast.error("Failed to save category");
  } finally {
    isSubmittingCategory.value = false;
  }
};

const handleDeleteCategory = async (categoryId) => {
  if (!isSuperAdmin.value) return;
  const answer = await confirm.ask({
    title: "Delete category",
    message:
      "Are you sure you want to delete this entire category and all its links?",
    confirmText: "Delete",
    cancelText: "Cancel",
    isDestructive: true,
  });
  if (!answer) return;

  try {
    await $fetch(
      `${config.public.apiBase}/admin/dashboard-links/category/${categoryId}`,
      {
        method: "DELETE",
      },
    );

    // Optimistic UI update
    dashboardSections.value = dashboardSections.value.filter(
      (s) => s.id !== categoryId,
    );
    toast.success("Category deleted successfully.");
  } catch (error) {
    console.error("Failed to delete category:", error);
    toast.error("Failed to delete category");
  }
};

// Open Edit Mode
const openEditLinkDrawer = (sectionId, link) => {
  editingLinkId.value = link.id;
  editingSectionIdForLink.value = sectionId;
  newLinkData.value = { label: link.label, url: link.url, sectionId };
  isDrawerOpen.value = true;
};

// Modify your existing openAddLinkDrawer to reset the ID
const openAddLinkDrawer = (sectionId) => {
  editingLinkId.value = null;
  editingSectionIdForLink.value = null;
  newLinkData.value = { label: "", url: "", sectionId };
  isDrawerOpen.value = true;
};

// Modify your existing submitNewLink to handle both POST and PUT
const submitNewLink = async () => {
  if (!isSuperAdmin.value) return;
  isSubmitting.value = true;
  try {
    const payload = {
      categoryId: newLinkData.value.sectionId,
      label: newLinkData.value.label,
      url: newLinkData.value.url,
    };

    if (editingLinkId.value) {
      // UPDATE LINK
      await $fetch(
        `${config.public.apiBase}/admin/dashboard-links/${editingSectionIdForLink.value}/${editingLinkId.value}`,
        {
          method: "PUT",
          body: payload,
        },
      );
      toast.success("Link updated successfully");
    } else {
      // CREATE LINK
      await $fetch(`${config.public.apiBase}/admin/dashboard-links/link`, {
        method: "POST",
        body: payload,
      });
      toast.success("New link added successfully");
    }

    closeDrawer();
    await fetchLinks();
  } catch (error) {
    console.error("Failed to save link:", error);
    toast.error("Failed to save link");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchLinks();
});
</script>
