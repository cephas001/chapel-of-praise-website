<!-- pages/follow-ups/index.vue -->
<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
    >
      <AppPageHeader
        text="Follow-Up & Welfare"
        description="Track, contact, and leave notes on first-timers and altar call responders."
        classList="mt-5"
      />

      <button
        @click="openCreateDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-900 transition-colors shrink-0"
      >
        <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
        New Follow-Up Record
      </button>
    </div>

    <!-- Data State -->
    <div v-if="isFetching" class="py-20 text-center">
      <Icon
        name="heroicons:arrow-path"
        class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
      />
      <h3 class="text-sm font-bold text-gray-900">Loading records...</h3>
    </div>

    <!-- The Grid of Cards -->
    <div
      v-else-if="followUps.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
      class="bg-white rounded-2xl border border-gray-100 p-12 text-center"
    >
      <Icon
        name="heroicons:users"
        class="mx-auto h-12 w-12 text-gray-300 mb-4"
      />
      <h3 class="text-lg font-bold text-gray-900 mb-1">No follow-ups needed</h3>
      <p class="text-gray-500 text-sm">
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
        class="p-1 space-y-5 font-montserrat pb-8"
      >
        <div>
          <label class="block text-sm font-bold text-gray-900 mb-1.5"
            >Full Name</label
          >
          <input
            v-model="form.fullName"
            type="text"
            required
            class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg text-sm transition-colors text-black font-medium"
            placeholder="e.g. Jane Doe"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-1.5"
              >Category</label
            >
            <select
              v-model="form.category"
              required
              class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg text-sm transition-colors text-black font-medium appearance-none bg-white"
            >
              <option value="First Timer">First Timer</option>
              <option value="New Convert">New Convert</option>
              <option value="Welfare">Welfare Check</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-900 mb-1.5"
              >Phone Number</label
            >
            <input
              v-model="form.phoneNumber"
              type="tel"
              class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg text-sm transition-colors text-black font-medium"
              placeholder="080..."
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-900 mb-1.5"
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
          <label class="block text-sm font-bold text-gray-900 mb-1.5"
            >Initial Note (Optional)</label
          >
          <textarea
            v-model="form.initialNote"
            rows="3"
            class="block w-full px-3 py-2.5 border border-gray-300 focus:border-black outline-none rounded-lg text-sm transition-colors text-black font-medium resize-none"
            placeholder="Context or details about this person..."
          ></textarea>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            :disabled="isCreating"
            class="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-black hover:bg-gray-900 focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
import { useAlertModal } from "~/composables/useAlertModal";
import { formatEventDisplay } from "~/utils/formatters";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

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
    const followRes = await $fetch(`${config.public.apiBase}/follow-ups`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    followUps.value = followRes;

    // Fetch Events for the dropdown
    const evRes = await $fetch(`${config.public.apiBase}/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    events.value = evRes
      .map((ev) => ({ ...ev, formattedName: formatEventDisplay(ev) }))
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  } catch (error) {
    showAlert("Error", "Could not load data.", "error");
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
    await $fetch(`${config.public.apiBase}/follow-ups`, {
      method: "POST",
      body: { ...form },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    showAlert("Success", "Record created successfully.", "success");
    closeDrawer();
    fetchData();
  } catch (error) {
    showAlert("Error", "Could not save the record.", "error");
  } finally {
    isCreating.value = false;
  }
};

// Handle the event emitted from the ActionCard
const handleAddNote = async ({ id, text, onSuccess, onError }) => {
  try {
    await $fetch(`${config.public.apiBase}/follow-ups/${id}/notes`, {
      method: "POST",
      body: {
        text,
        authorName: authStore.user?.displayName || "Executive", // Ensure your auth store exposes displayName!
      },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    // Instead of doing a full page refetch, we just manually fetch data to keep UI snappy
    fetchData();
    onSuccess(); // Triggers the card to clear its input field
  } catch (error) {
    showAlert("Error", "Failed to add note.", "error");
    onError();
  }
};
</script>
