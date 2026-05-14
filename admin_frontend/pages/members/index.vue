<!-- pages/members/index.vue -->
<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <AppPageHeader
      text="Chapel Workforce"
      description="View the complete directory of workers and executives grouped by unit."
      classList="mb-8 mt-5"
    />

    <!-- Loading State -->
    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900">
        Loading workforce directory...
      </h3>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="members.length === 0"
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center"
    >
      <Icon
        name="heroicons:user-group"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 mb-1">No members found</h3>
      <p class="text-gray-500 text-sm">
        Register workers to see them appear in the directory.
      </p>
    </div>

    <!-- Grouped Sections -->
    <div v-else class="space-y-12">
      <div v-for="(group, unitName) in groupedMembers" :key="unitName">
        <!-- Section Header -->
        <div
          class="flex items-center justify-between mb-4 border-b border-gray-100 pb-2"
        >
          <h2 class="text-xl font-black text-gray-900 uppercase tracking-tight">
            {{ unitName }}
          </h2>
          <span
            class="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-bold"
          >
            {{ group.length }} Members
          </span>
        </div>

        <!-- Section Grid -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <MemberCard
            v-for="member in group"
            :key="member.id"
            :member="member"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { useAlertModal } from "~/composables/useAlertModal";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

const members = ref([]);
const isFetching = ref(true);

// Dynamically group the flat array of members by their unit property
const groupedMembers = computed(() => {
  const groups = {};

  members.value.forEach((member) => {
    // Fallback if a member somehow has no unit assigned
    const unit = member.unit || "Unassigned";

    if (!groups[unit]) {
      groups[unit] = [];
    }
    groups[unit].push(member);
  });

  // Sort the keys alphabetically so 'Academic' comes before 'Choir', etc.
  return Object.keys(groups)
    .sort()
    .reduce((acc, key) => {
      // Sort the members inside each group alphabetically by name
      acc[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
      return acc;
    }, {});
});

onMounted(async () => {
  try {
    // Assuming you have a global GET /api/members route on your backend
    const res = await $fetch(`${config.public.apiBase}/members`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    members.value = res;
  } catch (error) {
    console.error("Failed to load members:", error);
    showAlert("Error", "Could not load the workforce directory.", "error");
  } finally {
    isFetching.value = false;
  }
});
</script>
