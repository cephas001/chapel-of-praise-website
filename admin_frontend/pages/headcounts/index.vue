<!-- pages/headcounts/index.vue -->
<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
    >
      <AppPageHeader
        text="Global Headcounts"
        description="Review attendance totals across all events and services."
        classList="mt-5"
      />

      <button
        @click="openCreateDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-900 transition-colors"
      >
        <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
        Record New Headcount
      </button>
    </div>

    <!-- Data Table -->
    <div
      class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <!-- Loading State -->
      <div v-if="isFetching" class="p-12 text-center">
        <Icon
          name="heroicons:arrow-path"
          class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
        />
        <h3 class="text-sm font-bold text-gray-900">
          Loading aggregate headcounts...
        </h3>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Event Name & Date
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Male
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Female
              </th>

              <th
                scope="col"
                class="px-6 py-4 text-right text-xs font-bold text-gray-900 uppercase tracking-wider"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-50">
            <tr
              v-for="record in headcounts"
              :key="record.id"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <!-- Event Details Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-bold text-gray-900">
                  <!-- Condition 1: If it's a Special Program, show the Program Name and Day -->
                  <template
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    {{
                      record.eventDetails?.specialProgram || "Special Program"
                    }}
                    <span
                      v-if="record.eventDetails?.programDay"
                      class="font-semibold text-gray-600"
                    >
                      - {{ record.eventDetails.programDay }}
                    </span>
                  </template>
                  <!-- Condition 2: If it's a regular service, just show the service name -->
                  <template v-else>
                    {{ record.eventDetails?.service || "Unknown Event" }}
                  </template>
                </div>

                <div class="text-xs text-gray-500 mt-0.5">
                  {{ formatDate(record.eventDetails?.eventDate) }}
                  <span
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    • Special Program
                  </span>
                </div>
              </td>

              <!-- Male Students -->
              <td
                class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 font-medium"
              >
                {{ record.maleStudents || 0 }}
              </td>

              <!-- Female Students -->
              <td
                class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 font-medium"
              >
                {{ record.femaleStudents || 0 }}
              </td>

              <!-- Total Visitors (Male + Female combined for a cleaner table) -->
              <td
                class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 font-medium"
              >
                {{ (record.maleVisitors || 0) + (record.femaleVisitors || 0) }}
              </td>

              <!-- Grand Total (Sums all 4 fields) -->
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-black text-blue-600"
              >
                {{
                  (record.maleStudents || 0) +
                  (record.femaleStudents || 0) +
                  (record.maleVisitors || 0) +
                  (record.femaleVisitors || 0)
                }}
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="headcounts.length === 0"
          class="p-12 text-center border-t border-gray-100"
        >
          <Icon
            name="heroicons:users"
            class="mx-auto h-12 w-12 text-gray-300 mb-4"
          />
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            No headcounts found
          </h3>
          <p class="text-gray-500 text-sm">
            Get started by recording attendance for a recent event.
          </p>
        </div>
      </div>
    </div>

    <!-- Slide-over Drawer for Creating Headcount -->
    <SlideOver
      :is-open="isDrawerOpen"
      title="Record Event Headcount"
      @close="closeDrawer"
    >
      <div class="p-1 font-montserrat">
        <!-- Step 1: Select Event using our new component -->
        <div class="mb-6 pb-6 border-b border-gray-100">
          <label
            class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
            >Select Target Event</label
          >
          <SearchableSelect
            v-model="selectedEventId"
            :options="events"
            displayKey="formattedName"
            valueKey="id"
            placeholder="Type to search events..."
          />
        </div>

        <!-- Step 2: Inject the component we built previously -->
        <!-- Only render if an event is selected so it knows where to save -->
        <div v-if="selectedEventId">
          <h4 class="text-sm font-bold text-gray-900 mb-4">Enter Counts</h4>
          <!-- We reuse the form component from your event/[id].vue! -->
          <EventHeadCountForm
            @submit="handleHeadcountSubmit"
            :loading="isSubmitting"
          />
        </div>

        <div
          v-else
          class="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200"
        >
          <Icon
            name="heroicons:calendar"
            class="h-8 w-8 text-gray-300 mx-auto mb-2"
          />
          <p class="text-xs text-gray-500 font-medium">
            Please select an event above first.
          </p>
        </div>
      </div>
    </SlideOver>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRuntimeConfig } from "#app";
import { useAuthStore } from "~/stores/auth";
import { useAlertModal } from "~/composables/useAlertModal";
import { formatEventDisplay } from "~/utils/formatters";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

const headcounts = ref([]);
const events = ref([]);
const isFetching = ref(true);
const isDrawerOpen = ref(false);
const isSubmitting = ref(false);
const selectedEventId = ref("");

// Helper for table dates
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const fetchData = async () => {
  isFetching.value = true;
  try {
    // 1. Fetch Headcounts (Requires a backend endpoint that joins headcount data with event details)
    const hcRes = await $fetch(`${config.public.apiBase}/headcounts`);
    headcounts.value = hcRes;
    console.log(hcRes);

    // 2. Fetch Events for the dropdown
    const evRes = await $fetch(`${config.public.apiBase}/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    // Add the formatted string to the object so SearchableSelect can filter by it
    events.value = evRes
      .map((ev) => ({ ...ev, formattedName: formatEventDisplay(ev) }))
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  } catch (error) {
    console.error("Fetch error:", error);
    showAlert("Error", "Could not load global headcount data.", "error");
  } finally {
    isFetching.value = false;
  }
};

onMounted(fetchData);

const openCreateDrawer = () => {
  selectedEventId.value = "";
  isDrawerOpen.value = true;
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const handleHeadcountSubmit = async (formData) => {
  isSubmitting.value = true;
  try {
    // Post to the exact same endpoint we used in the embedded view
    await $fetch(`${config.public.apiBase}/headcounts`, {
      method: "POST",
      body: { eventId: selectedEventId.value, ...formData },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    showAlert("Success", "Headcount saved successfully.", "success");
    closeDrawer();
    fetchData(); // Refresh the table
  } catch (error) {
    showAlert("Error", "Could not save the headcount.", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
