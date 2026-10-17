<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
    >
      <AppHeading
        title="Executive management"
        subtitle="Manage the roster of chapel executives across all units."
      />

      <AppButton
        icon="heroicons:user-plus"
        class="shrink-0"
        @click="openCreateDrawer"
      >
        New executive
      </AppButton>
    </div>

    <AppCard
      body-class="p-0"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-line">
          <caption class="sr-only">Executives</caption>
          <thead class="bg-subtle/60">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Executive
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Chapel Unit
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Academic Details
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="bg-surface divide-y divide-line">
            <tr
              v-for="exec in executives"
              :key="exec.id"
              class="group cursor-pointer px-6 py-5 hover:bg-subtle transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-subtle text-ink flex items-center justify-center font-semibold text-sm shrink-0"
                  >
                    {{ exec.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="text-xs md:text-sm font-semibold text-ink">
                      {{ exec.name }}
                    </div>
                    <div
                      class="text-xs text-muted mt-0.5 font-mono font-medium flex items-center gap-1"
                    >
                      <Icon name="heroicons:envelope" class="h-3 w-3" />
                      {{ exec.emailAddress }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-mono font-semibold bg-subtle text-ink"
                >
                  {{ exec.chapelUnit }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs md:text-sm font-semibold text-ink">
                  {{ exec.schoolDepartment }}
                </div>
                <div
                  class="text-xs text-muted mt-0.5 font-mono font-medium"
                >
                  Level {{ exec.level }} • {{ exec.matricNumber }}
                </div>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end gap-1">
                  <button
                    class="rounded-control p-2 text-muted transition-colors hover:bg-subtle hover:text-ink"
                    title="View / Edit Details"
                    aria-label="View or edit executive"
                    @click="openEditDrawer(exec)"
                  >
                    <Icon name="heroicons:pencil-square" class="h-4 w-4" />
                  </button>
                  <button
                    :disabled="deletingId === exec.id"
                    class="rounded-control p-2 text-muted transition-colors hover:bg-danger-surface hover:text-danger-text disabled:cursor-not-allowed disabled:opacity-50"
                    title="Delete Executive"
                    aria-label="Delete executive"
                    @click="handleDeleteExecutive(exec)"
                  >
                    <Icon
                      v-if="deletingId === exec.id"
                      name="heroicons:arrow-path"
                      class="h-4 w-4 animate-spin"
                    />
                    <Icon v-else name="heroicons:trash" class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!isFetching && executives.length === 0"
        class="py-20 text-center border-t border-line"
      >
        <Icon
          name="heroicons:users"
          class="mx-auto h-12 w-12 text-line mb-4"
        />
        <h3 class="text-sm font-semibold text-ink mb-1">
          No executives found
        </h3>
        <p class="text-muted text-xs md:text-sm">
          Get started by registering a new executive.
        </p>
      </div>
    </AppCard>

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
import { useConfirm } from "~/composables/useConfirm";

definePageMeta({
  accessToSuperAdminOnly: true,
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast(); // auto-imported
const confirm = useConfirm();

const executives = ref([]);
const isFetching = ref(true);
const isSubmitting = ref(false);
const deletingId = ref(null);

const isDrawerOpen = ref(false);
const selectedExecutive = ref(null);

const fetchExecutives = async () => {
  isFetching.value = true;
  try {
    const response = await $fetch(
      `${config.public.apiBase}/admin/members/executives`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    executives.value = response;
  } catch (error) {
    console.error("Failed to fetch executives:", error);
    toast.error("Failed to retrieve executives from the server."); // migrated
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
      // UPDATE existing executive
      const response = await $fetch(
        `${config.public.apiBase}/admin/members/executives/${selectedExecutive.value.id}`,
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
      toast.success("Executive updated successfully"); // migrated
    } else {
      // CREATE new executive
      const response = await $fetch(
        `${config.public.apiBase}/admin/members/executives`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${authStore.token}` },
        },
      );
      executives.value.unshift(response.data);
      toast.success("Executive registered successfully"); // migrated
    }

    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(error.data?.error || "Could not save the executive."); // migrated
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteExecutive = async (exec) => {
  const answer = await confirm.ask({
    title: "Delete Executive",
    message: `Are you sure you want to permanently delete ${exec.name}? This cannot be undone.`,
    confirmText: "Yes, Delete",
    cancelText: "Cancel",
  });
  if (!answer) return;

  deletingId.value = exec.id;
  try {
    await $fetch(
      `${config.public.apiBase}/admin/members/executives/${exec.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    executives.value = executives.value.filter((e) => e.id !== exec.id);
    toast.success("Executive deleted successfully"); // migrated
  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error.data?.error || "Could not delete the executive."); // migrated
  } finally {
    deletingId.value = null;
  }
};
</script>
