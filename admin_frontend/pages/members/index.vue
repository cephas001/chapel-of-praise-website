<!-- pages/members/index.vue -->
<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div class="mb-8">
      <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
        Chapel Workforce
      </h2>
      <p class="text-gray-500 text-xs md:text-sm">
        View the complete directory of workers and executives grouped by unit.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3
        class="text-xs md:text-sm font-bold text-gray-900 font-jetbrains animate-pulse"
      >
        Loading workforce directory...
      </h3>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="members.length === 0"
      class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
    >
      <Icon
        name="heroicons:user-group"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900 mb-1 font-jetbrains">
        No members found
      </h3>
      <p class="text-gray-500 text-xs md:text-sm">
        Register workers to see them appear in the directory.
      </p>
    </div>

    <!-- Grouped Sections -->
    <div v-else class="space-y-10">
      <div v-for="(group, unitName) in groupedMembers" :key="unitName">
        <!-- Section Header -->
        <div
          class="flex items-center justify-between mb-4 border-b border-gray-200 pb-3"
        >
          <h2
            class="text-sm md:text-base font-bold text-gray-900 uppercase tracking-widest font-jetbrains"
          >
            {{ unitName }}
          </h2>
          <span
            class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-600 font-jetbrains uppercase tracking-wider"
          >
            {{ group.length }} Members
          </span>
        </div>

        <!-- Section Grid -->
        <div
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast(); // auto-imported

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
    const res = await $fetch(`${config.public.apiBase}/admin/members`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    members.value = res;
  } catch (error) {
    console.error("Failed to load members:", error);
    toast.error("Could not load the workforce directory."); // migrated
  } finally {
    isFetching.value = false;
  }
});
</script>
