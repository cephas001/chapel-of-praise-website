<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          User Management
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          View and manage authenticated users. Promote admins, edit profiles, or
          remove accounts.
        </p>
      </div>

      <button
        @click="navigateTo('/auth/register')"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
      >
        <Icon name="heroicons:user-plus" class="mr-2 h-4 w-4" />
        New User
      </button>
    </div>

    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50/50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                User
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Role
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Type
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="user in users"
              :key="user.uid"
              class="group hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-sm shrink-0"
                  >
                    {{
                      user.name
                        ? user.name.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()
                    }}
                  </div>
                  <div>
                    <div class="text-xs md:text-sm font-bold text-gray-900">
                      {{ user.name || "—" }}
                    </div>
                    <div
                      class="text-xs text-gray-500 mt-0.5 font-jetbrains font-medium tracking-wide flex items-center gap-1"
                    >
                      <Icon name="heroicons:envelope" class="h-3 w-3" />
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                {{ user.email }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-gray-100 text-gray-700"
                >
                  {{ user.role }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-700">
                {{ user.type || "—" }}
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="relative inline-flex items-center">
                  <button
                    @click.stop="toggleDropdown($event, user)"
                    class="p-1 rounded hover:bg-gray-200 transition-colors text-gray-500"
                    title="Actions"
                  >
                    <Icon name="heroicons:ellipsis-vertical" class="h-5 w-5" />
                  </button>

                  <Teleport to="body">
                    <div
                      v-if="activeDropdown === 'user_' + user.uid"
                      v-click-outside="closeDropdown"
                      class="absolute w-44 bg-white border border-gray-100 rounded-lg shadow-xl p-1 flex flex-col z-[9999]"
                      :style="dropdownStyle"
                    >
                      <button
                        v-if="user.role !== 'super_admin'"
                        @click="confirmUpgrade(user)"
                        class="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-gray-50 text-black"
                      >
                        Promote User
                      </button>

                      <button
                        @click="openEditDrawer(user)"
                        class="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-gray-50 text-black"
                      >
                        Edit User
                      </button>

                      <div class="my-1 border-t border-gray-100"></div>

                      <button
                        @click="confirmDelete(user)"
                        class="w-full text-left px-3 py-2 text-xs text-red-600 rounded-md hover:bg-red-50"
                      >
                        Delete User
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
        v-if="!isFetching && users.length === 0"
        class="py-20 text-center border-t border-gray-100"
      >
        <Icon
          name="heroicons:users"
          class="mx-auto h-12 w-12 text-gray-300 mb-4"
        />
        <h3 class="text-sm font-bold text-gray-900 mb-1 font-jetbrains">
          No users found
        </h3>
        <p class="text-gray-500 text-xs md:text-sm px-5">
          Users will appear here once created.
        </p>
      </div>
    </div>

    <!-- SlideOver: Create / Edit User -->
    <SlideOver
      :is-open="isDrawerOpen"
      :title="selectedUser ? 'Edit User' : 'Register New User'"
      @close="closeDrawer"
    >
      <form @submit.prevent="submitUserForm" class="p-1 font-poppins space-y-6">
        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Full Name
          </label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Email
          </label>
          <input
            v-model="formData.email"
            type="email"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
            placeholder="user@example.com"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >
              Role
            </label>
            <select
              v-model="formData.role"
              required
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none cursor-pointer"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label
              class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >
              Type
            </label>
            <select
              v-model="formData.type"
              required
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none cursor-pointer"
            >
              <option value="website">Website</option>
              <option value="executive">Executive</option>
              <option value="all">All</option>
            </select>
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
            {{
              isSubmitting
                ? selectedUser
                  ? "Updating..."
                  : "Saving..."
                : selectedUser
                  ? "Update User"
                  : "Create User"
            }}
          </button>
        </div>
      </form>
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

const users = ref([]);

const isFetching = ref(true);
const isSubmitting = ref(false);

const activeDropdown = ref(null);
const dropdownStyle = ref({});
const isDrawerOpen = ref(false);
const selectedUser = ref(null);

const formData = ref({
  name: "",
  email: "",
  role: "admin",
  type: "website",
});

const fetchUsers = async () => {
  isFetching.value = true;
  try {
    const res = await $fetch(`${config.public.apiBase}/admin/auth/users`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    users.value = (res || []).map((u) => ({
      uid: u.uid || u.user_id || u.sub,
      name: u.name || u.displayName || "",
      email: u.email || "",
      role: u.role || u.customClaims?.role || u.role || "admin",
      type: u.type || u.customClaims?.type || u.type || "website",
    }));
  } catch (error) {
    console.error("Failed to fetch users:", error);
    toast.error("Could not load users.");
  } finally {
    isFetching.value = false;
  }
};

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

const openEditDrawer = (user) => {
  selectedUser.value = { ...user };
  Object.assign(formData.value, {
    name: user.name,
    email: user.email,
    role: user.role,
    type: user.type,
  });
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

      const res = await $fetch(
        `${config.public.apiBase}/admin/auth/update/${uid}`,
        {
          method: "PUT",
          body: payload,
          headers: { Authorization: `Bearer ${authStore.token}` },
        },
      );

      const idx = users.value.findIndex((u) => u.uid === uid);
      if (idx !== -1) users.value[idx] = { uid, ...payload };
      toast.success("User updated successfully");
    } else {
      const payload = {
        name: formData.value.name,
        email: formData.value.email,
        password: Math.random().toString(36).slice(-8),
        role: formData.value.role,
        type: formData.value.type,
      };

      const res = await $fetch(`${config.public.apiBase}/admin/auth/register`, {
        method: "POST",
        body: payload,
        headers: { Authorization: `Bearer ${authStore.token}` },
      });

      if (res?.user) {
        users.value.unshift({
          uid: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          type: res.user.type,
        });
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

const confirmUpgrade = async (user) => {
  closeDropdown();
  const answer = await confirm.ask({
    title: "Promote User",
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

    const idx = users.value.findIndex((u) => u.uid === user.uid);
    if (idx !== -1) users.value[idx].role = "super_admin";
    toast.success("User promoted to super_admin");
  } catch (error) {
    console.error("Upgrade error:", error);
    toast.error(error.data?.error || "Could not promote user.");
  }
};

const confirmDelete = async (user) => {
  closeDropdown();
  const answer = await confirm.ask({
    title: "Delete User",
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

    users.value = users.value.filter((u) => u.uid !== user.uid);
    toast.success("User deleted successfully");
  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error.data?.error || "Could not delete user.");
  }
};
</script>
