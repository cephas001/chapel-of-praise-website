<!-- pages/altar-calls/index.vue -->
<template>
  <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
    >
      <AppPageHeader
        text="Global Altar Calls"
        description="Review altar call responses and categories across all events."
        classList="mt-5"
      />

      <button
        @click="openCreateDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-900 transition-colors"
      >
        <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
        Record Altar Call
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
          Loading altar call records...
        </h3>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3"
              >
                Event Details
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Call Type
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Responders
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                Comments
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-50">
            <tr
              v-for="record in altarCalls"
              :key="record.id"
              class="hover:bg-gray-50/50 transition-colors"
            >
              <!-- Event Column -->
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

              <!-- Category Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700"
                >
                  {{ record.callType }}
                </span>
              </td>

              <!-- Responders Column -->
              <td
                class="px-6 py-4 whitespace-nowrap text-center text-sm font-black text-black"
              >
                {{ record.totalResponders || 0 }}
              </td>

              <!-- Notes Column -->
              <td class="px-6 py-4">
                <div
                  class="text-sm text-gray-600 line-clamp-2 max-w-xs"
                  :title="record.additionalComments"
                >
                  {{ record.additionalComments || "No additional comments" }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="altarCalls.length === 0"
          class="p-12 text-center border-t border-gray-100"
        >
          <Icon
            name="heroicons:megaphone"
            class="mx-auto h-12 w-12 text-gray-300 mb-4"
          />
          <h3 class="text-lg font-bold text-gray-900 mb-1">
            No altar calls recorded
          </h3>
          <p class="text-gray-500 text-sm">
            Get started by logging a response for a recent event.
          </p>
        </div>
      </div>
    </div>

    <!-- Slide-over Drawer for Creating Altar Call -->
    <SlideOver
      :is-open="isDrawerOpen"
      title="Record Altar Call Response"
      @close="closeDrawer"
    >
      <div class="p-1 font-montserrat">
        <!-- Step 1: Select Event using our reusable component -->
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

        <!-- Step 2: Form Component -->
        <div v-if="selectedEventId">
          <h4 class="text-sm font-bold text-gray-900 mb-4">Response Details</h4>
          <!-- We reuse the form component built for the individual event view -->
          <EventAltarCallForm
            @submit="handleAltarCallSubmit"
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

// Extracted both formatters to keep it DRY!
import { formatEventDisplay, formatDate } from "~/utils/formatters";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const { showAlert } = useAlertModal();

const altarCalls = ref([]);
const events = ref([]);
const isFetching = ref(true);
const isDrawerOpen = ref(false);
const isSubmitting = ref(false);
const selectedEventId = ref("");

const fetchData = async () => {
  isFetching.value = true;
  try {
    // 1. Fetch Global Altar Calls using the new endpoint we just made
    const callsRes = await $fetch(
      `${config.public.apiBase}/altar-calls/global`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );
    altarCalls.value = callsRes;

    console.log(altarCalls.value);

    // 2. Fetch Events to populate the searchable dropdown
    const evRes = await $fetch(`${config.public.apiBase}/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    events.value = evRes
      .map((ev) => ({ ...ev, formattedName: formatEventDisplay(ev) }))
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  } catch (error) {
    console.error("Fetch error:", error);
    showAlert("Error", "Could not load global altar call data.", "error");
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

const handleAltarCallSubmit = async (formData) => {
  isSubmitting.value = true;
  try {
    // POST to the standard altar call endpoint, attaching the selected event ID
    await $fetch(`${config.public.apiBase}/altar-calls`, {
      method: "POST",
      body: { eventId: selectedEventId.value, ...formData },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    showAlert("Success", "Altar call recorded successfully.", "success");
    closeDrawer();
    fetchData(); // Refresh the table automatically
  } catch (error) {
    showAlert("Error", "Could not save the altar call record.", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
