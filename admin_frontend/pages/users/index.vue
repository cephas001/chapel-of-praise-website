<template>
  <LoadingScreen :is-loading="isFetching" />

  <div class="relative min-h-screen pt-5">
    <AppHeading
      class="mb-8"
      title="User management"
      subtitle="View and manage authenticated users. Promote admins, edit profiles, or remove accounts."
    >
      <template #actions>
        <AppButton icon="heroicons:user-plus" @click="openCreateDrawer">
          New user
        </AppButton>
      </template>
    </AppHeading>

    <AppCard body-class="p-0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-line">
          <caption class="sr-only">Admin user accounts</caption>
          <thead class="bg-subtle">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                User
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Role
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left font-mono text-xs font-medium whitespace-nowrap text-muted"
              >
                Type
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
              v-for="user in users"
              :key="user.uid"
              class="group transition-colors hover:bg-subtle/40"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-subtle font-mono text-sm font-medium text-ink"
                  >
                    {{
                      user.name
                        ? user.name.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()
                    }}
                  </div>
                  <div>
                    <div class="text-xs font-medium text-ink md:text-sm">
                      {{ user.name || "—" }}
                    </div>
                    <div
                      class="mt-0.5 flex items-center gap-1 text-xs text-muted"
                    >
                      <Icon name="heroicons:envelope" class="h-3 w-3" />
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-xs text-muted">
                {{ user.email }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center rounded-badge border border-line bg-subtle px-2.5 py-1 font-mono text-xs font-medium text-muted"
                >
                  {{ user.role }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-xs text-muted">
                {{ user.type || "—" }}
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="relative inline-flex items-center">
                  <button
                    class="rounded-control p-1 text-muted transition-colors hover:bg-subtle hover:text-ink"
                    title="Actions"
                    aria-label="User actions"
                    @click.stop="toggleDropdown($event, user)"
                  >
                    <Icon name="heroicons:ellipsis-vertical" class="h-5 w-5" />
                  </button>

                  <Teleport to="body">
                    <div
                      v-if="activeDropdown === 'user_' + user.uid"
                      v-click-outside="closeDropdown"
                      class="absolute z-overlay flex w-44 flex-col rounded-surface border border-line bg-surface p-1 shadow-overlay"
                      :style="dropdownStyle"
                    >
                      <button
                        v-if="user.role !== 'super_admin'"
                        class="w-full rounded-control px-3 py-2 text-left text-xs text-ink transition-colors hover:bg-subtle"
                        @click="confirmUpgrade(user)"
                      >
                        Promote user
                      </button>

                      <button
                        class="w-full rounded-control px-3 py-2 text-left text-xs text-ink transition-colors hover:bg-subtle"
                        @click="openEditDrawer(user)"
                      >
                        Edit user
                      </button>

                      <div class="my-1 border-t border-line" />

                      <button
                        class="w-full rounded-control px-3 py-2 text-left text-xs text-danger-text transition-colors hover:bg-danger-surface"
                        @click="confirmDelete(user)"
                      >
                        Delete user
                      </button>
                    </div>
                  </Teleport>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="hasMore"
        class="flex justify-center border-t border-line p-4"
      >
        <AppButton
          variant="secondary"
          size="sm"
          icon="heroicons:arrow-path"
          :loading="isLoadingMore"
          @click="loadMoreUsers"
        >
          {{ isLoadingMore ? "Loading…" : "Load more" }}
        </AppButton>
      </div>

      <div
        v-if="!isFetching && users.length === 0"
        class="border-t border-line py-20 text-center"
      >
        <Icon
          name="heroicons:users"
          class="mx-auto mb-4 h-12 w-12 text-line"
        />
        <h3 class="mb-1 text-sm font-semibold text-ink">
          No users found
        </h3>
        <p class="px-5 text-xs text-muted md:text-sm">
          Users will appear here once created.
        </p>
      </div>
    </AppCard>

    <!-- SlideOver: Create / Edit user -->
    <SlideOver
      :is-open="isDrawerOpen"
      :title="selectedUser ? 'Edit user' : 'Register new user'"
      :before-close="confirmDiscardUserForm"
      @close="closeDrawer"
    >
      <form class="space-y-6 p-1" @submit.prevent="submitUserForm">
        <div>
          <label
            for="user-name"
            class="block text-xs font-medium text-ink mb-2"
          >
            Full Name
          </label>
          <input
            id="user-name"
            v-model="formData.name"
            type="text"
            required
            class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
            placeholder="e.g. Jane Doe"
          >
        </div>

        <div>
          <label
            for="user-email"
            class="block text-xs font-medium text-ink mb-2"
          >
            Email
          </label>
          <input
            id="user-email"
            v-model="formData.email"
            type="email"
            required
            class="w-full rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
            placeholder="user@example.com"
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="user-role"
              class="block text-xs font-medium text-ink mb-2"
            >
              Role
            </label>
            <select
              id="user-role"
              v-model="formData.role"
              required
              class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm cursor-pointer"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label
              for="user-type"
              class="block text-xs font-medium text-ink mb-2"
            >
              Type
            </label>
            <select
              id="user-type"
              v-model="formData.type"
              required
              class="w-full cursor-pointer appearance-none rounded-control border border-line bg-subtle py-2.5 pl-4 pr-10 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm cursor-pointer"
            >
              <option value="website">Website</option>
              <option value="executive">Executive</option>
              <option value="all">All</option>
            </select>
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
                ? selectedUser
                  ? "Updating…"
                  : "Saving…"
                : selectedUser
                  ? "Update user"
                  : "Create user"
            }}
          </AppButton>
        </div>
      </form>
    </SlideOver>

    <!-- Temporary credentials (shown once after creating a user) -->
    <div
      v-if="createdCredentials"
      class="fixed inset-0 z-overlay flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-ink/40"
        aria-hidden="true"
        @click="createdCredentials = null"
      />
      <div
        class="relative w-full max-w-md rounded-surface border border-line bg-surface p-6 shadow-overlay"
      >
        <h3 class="mb-2 text-base font-semibold text-ink">
          User created
        </h3>
        <p class="mb-5 text-xs text-muted md:text-sm">
          Share these credentials with the user now — the temporary password
          is shown only once. They can change it anytime via "Forgot password"
          on the login page.
        </p>

        <div class="space-y-4 mb-6">
          <div>
            <p
              class="mb-1.5 text-xs font-medium text-ink"
            >
              Email
            </p>
            <p
              class="break-all rounded-control border border-line bg-subtle px-3 py-2.5 font-mono text-xs text-ink md:text-sm"
            >
              {{ createdCredentials.email }}
            </p>
          </div>
          <div>
            <p
              class="mb-1.5 text-xs font-medium text-ink"
            >
              Temporary password
            </p>
            <p
              class="break-all rounded-control border border-line bg-subtle px-3 py-2.5 font-mono text-xs text-ink md:text-sm"
            >
              {{ createdCredentials.password }}
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <AppButton
            variant="secondary"
            icon="heroicons:clipboard"
            class="flex-1"
            @click="copyCredentials"
          >
            Copy
          </AppButton>
          <AppButton class="flex-1" @click="createdCredentials = null">
            Done
          </AppButton>
        </div>
      </div>
    </div>
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

// Directive to detect outside clicks
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast();
const confirm = useConfirm();

const isSubmitting = ref(false);

const activeDropdown = ref(null);
const dropdownStyle = ref({});
const isDrawerOpen = ref(false);
const selectedUser = ref(null);
const createdCredentials = ref(null);
const initialFormSnapshot = ref("");

const formData = ref({
  name: "",
  email: "",
  role: "admin",
  type: "website",
});

const mapUser = (u) => ({
  uid: u.uid || u.user_id || u.sub,
  name: u.name || u.displayName || "",
  email: u.email || "",
  role: u.role || u.customClaims?.role || "admin",
  type: u.type || u.customClaims?.type || "website",
});

const {
  items: users,
  isFetching,
  isLoadingMore,
  hasMore,
  load: fetchUsers,
  loadMore: loadMoreUsers,
  prepend: prependUser,
  removeWhere: removeUserWhere,
  updateWhere: updateUserWhere,
} = useCursorPagination({
  fetcher: async ({ cursor } = {}) => {
    try {
      const res = await $fetch(`${config.public.apiBase}/admin/auth/users`, {
        query: cursor ? { cursor } : {},
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      return {
        items: res?.users || [],
        nextCursor: res?.nextCursor || null,
        hasMore: Boolean(res?.hasMore),
      };
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(cursor ? "Could not load more users." : "Could not load users.");
      return { items: [], nextCursor: null, hasMore: false };
    }
  },
  mapItem: mapUser,
});

onMounted(fetchUsers);

const toggleDropdown = (event, user) => {
  // 1. Capture the target element IMMEDIATELY
  const triggerButton = event.currentTarget;

  const id = "user_" + user.uid;

  if (activeDropdown.value === id) {
    activeDropdown.value = null;
    return;
  }

  activeDropdown.value = id;

  requestAnimationFrame(() => {
    // 2. Use the captured reference instead of relying on 'event'
    const rect = triggerButton.getBoundingClientRect();

    const dropdownWidth = 176;

    dropdownStyle.value = {
      top: `${rect.bottom + window.scrollY + 5}px`,
      left: `${rect.right + window.scrollX - dropdownWidth}px`,
      position: "absolute",
    };
  });
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

const openCreateDrawer = () => {
  selectedUser.value = null;
  Object.assign(formData.value, {
    name: "",
    email: "",
    role: "admin",
    type: "website",
  });
  initialFormSnapshot.value = JSON.stringify(formData.value);
  isDrawerOpen.value = true;
  closeDropdown();
};

const confirmDiscardUserForm = async () => {
  if (JSON.stringify(formData.value) === initialFormSnapshot.value) return true;
  return await confirm.ask({
    title: "Discard changes?",
    message:
      "You have unsaved changes to this user form. Close and discard them?",
    confirmText: "Discard",
    cancelText: "Keep editing",
    isDestructive: true,
  });
};

const openEditDrawer = (user) => {
  selectedUser.value = { ...user };
  Object.assign(formData.value, {
    name: user.name,
    email: user.email,
    role: user.role,
    type: user.type,
  });
  initialFormSnapshot.value = JSON.stringify(formData.value);
  isDrawerOpen.value = true;
  closeDropdown();
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  setTimeout(() => {
    selectedUser.value = null;
    Object.assign(formData.value, {
      name: "",
      email: "",
      role: "admin",
      type: "website",
    });
  }, 300);
};

const submitUserForm = async () => {
  isSubmitting.value = true;

  try {
    if (selectedUser.value) {
      const uid = selectedUser.value.uid;
      const payload = {
        name: formData.value.name,
        email: formData.value.email,
        role: formData.value.role,
        type: formData.value.type,
      };

      await $fetch(
        `${config.public.apiBase}/admin/auth/update/${uid}`,
        {
          method: "PUT",
          body: payload,
          headers: { Authorization: `Bearer ${authStore.token}` },
        },
      );

      updateUserWhere((u) => u.uid === uid, payload);
      toast.success("User updated successfully");
    } else {
      const payload = {
        name: formData.value.name,
        email: formData.value.email,
        role: formData.value.role,
        type: formData.value.type,
      };

      const res = await $fetch(`${config.public.apiBase}/admin/auth/register`, {
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      if (res?.user) {
        prependUser({
          uid: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          type: res.user.type,
        });
      }

      // The backend generates a temporary password when none is supplied;
      // show it once so the admin can hand it to the new user.
      if (res?.temporaryPassword) {
        createdCredentials.value = {
          email: res.user?.email || payload.email,
          password: res.temporaryPassword,
        };
      }
      toast.success("User created successfully");
    }

    closeDrawer();
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(error.data?.error || "Could not save the user.");
  } finally {
    isSubmitting.value = false;
  }
};

const copyCredentials = async () => {
  if (!createdCredentials.value) return;

  try {
    await navigator.clipboard.writeText(
      `Email: ${createdCredentials.value.email}\nTemporary password: ${createdCredentials.value.password}`,
    );
    toast.success("Credentials copied to clipboard");
  } catch {
    toast.error("Could not copy to clipboard");
  }
};

const confirmUpgrade = async (user) => {
  closeDropdown();
  const answer = await confirm.ask({
    title: "Promote user",
    message: `Promote ${user.name || user.email} to Super Admin? This grants full access.`,
    confirmText: "Promote",
    cancelText: "Cancel",
    isDestructive: false,
  });

  if (!answer) return;

  try {
    await $fetch(`${config.public.apiBase}/admin/auth/upgrade/${user.uid}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    updateUserWhere((u) => u.uid === user.uid, { role: "super_admin" });
    toast.success("User promoted to super_admin");
  } catch (error) {
    console.error("Upgrade error:", error);
    toast.error(error.data?.error || "Could not promote user.");
  }
};

const confirmDelete = async (user) => {
  closeDropdown();
  const answer = await confirm.ask({
    title: "Delete user",
    message: `Are you sure you want to permanently delete ${user.name || user.email}? This cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    isDestructive: true,
  });

  if (!answer) return;

  try {
    await $fetch(`${config.public.apiBase}/admin/auth/${user.uid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    removeUserWhere((u) => u.uid === user.uid);
    toast.success("User deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error.data?.error || "Could not delete user.");
  }
};
</script>
