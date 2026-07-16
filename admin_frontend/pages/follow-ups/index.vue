<!-- pages/follow-ups/index.vue -->
<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Follow-Up & Welfare
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Track, contact, and leave notes on first-timers and altar call
          responders.
        </p>
      </div>

      <button
        @click="openCreateDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        New Follow-Up Record
      </button>
    </div>

    <!-- The Grid of Cards -->
    <div
      v-if="followUps.length > 0"
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ActionCard
        v-for="record in followUps"
        :key="record.id"
        :record="record"
        @add-note="handleAddNote"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
    >
      <Icon
        name="heroicons:users"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900 mb-1 font-jetbrains">
        No follow-ups needed
      </h3>
      <p class="text-gray-500 text-xs md:text-sm">
        Create a new record to start tracking.
      </p>
    </div>

    <!-- Drawer for Creating a New Record -->
    <SlideOver
      :is-open="isDrawerOpen"
      title="New Follow-Up"
      @close="closeDrawer"
    >
      <form
        @submit.prevent="submitNewRecord"
        class="space-y-6 pt-2 font-poppins"
      >
        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >Full Name</label
          >
          <input
            v-model="form.fullName"
            type="text"
            required
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >Category</label
            >
            <select
              v-model="form.category"
              required
              class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm appearance-none"
            >
              <option value="First Timer">First Timer</option>
              <option value="New Convert">New Convert</option>
              <option value="Welfare">Welfare Check</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label
              class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
              >Phone Number</label
            >
            <input
              v-model="form.phoneNumber"
              type="tel"
              class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm"
              placeholder="080..."
            />
          </div>
        </div>

        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >Link to Event (Optional)</label
          >
          <SearchableSelect
            v-model="form.eventId"
            :options="events"
            displayKey="formattedName"
            valueKey="id"
            placeholder="Search events..."
          />
        </div>

        <div>
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
            >Initial Note (Optional)</label
          >
          <textarea
            v-model="form.initialNote"
            rows="3"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm resize-none"
            placeholder="Context or details about this person..."
          ></textarea>
        </div>

        <div class="pt-6 border-t border-gray-200">
          <button
            type="submit"
            :disabled="isCreating"
            class="w-full inline-flex items-center justify-center rounded-xl bg-black px-8 py-3.5 text-xs md:text-sm font-bold text-white shadow-sm hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-jetbrains"
          >
            <Icon
              v-if="isCreating"
              name="heroicons:arrow-path"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Save Record
          </button>
        </div>
      </form>
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { formatEventDisplay } from "~/utils/formatters";

definePageMeta({
  allowedUserTypes: ["executive"],
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast(); // auto-imported

const followUps = ref([]);
const events = ref([]);
const isFetching = ref(true);
const isDrawerOpen = ref(false);
const isCreating = ref(false);

const form = reactive({
  fullName: "",
  category: "First Timer",
  phoneNumber: "",
  eventId: "",
  initialNote: "",
});

const fetchData = async () => {
  isFetching.value = true;
  try {
    // Fetch Follow Ups
    const followRes = await $fetch(
      `${config.public.apiBase}/admin/follow-ups`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    followUps.value = followRes;

    // Fetch Events for the dropdown
    const evRes = await $fetch(`${config.public.apiBase}/admin/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    events.value = evRes
      .map((ev) => ({ ...ev, formattedName: formatEventDisplay(ev) }))
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  } catch (error) {
    toast.error("Could not load data."); // migrated
  } finally {
    isFetching.value = false;
  }
};

onMounted(fetchData);

const openCreateDrawer = () => {
  Object.assign(form, {
    fullName: "",
    category: "First Timer",
    phoneNumber: "",
    eventId: "",
    initialNote: "",
  });
  isDrawerOpen.value = true;
};

const closeDrawer = () => (isDrawerOpen.value = false);

const submitNewRecord = async () => {
  isCreating.value = true;
  try {
    await $fetch(`${config.public.apiBase}/admin/follow-ups`, {
      method: "POST",
      body: { ...form },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    toast.success("Record created successfully."); // migrated
    closeDrawer();
    fetchData();
  } catch (error) {
    toast.error("Could not save the record."); // migrated
  } finally {
    isCreating.value = false;
  }
};

// Handle the event emitted from the ActionCard
const handleAddNote = async ({ id, text, onSuccess, onError }) => {
  try {
    await $fetch(`${config.public.apiBase}/admin/follow-ups/${id}/notes`, {
      method: "POST",
      body: {
        text,
        authorName: authStore.user?.displayName || "Executive",
      },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    // Instead of doing a full page refetch, we just manually fetch data to keep UI snappy
    fetchData();
    onSuccess(); // Triggers the card to clear its input field
  } catch (error) {
    toast.error("Failed to add note."); // migrated
    onError();
  }
};
</script>
