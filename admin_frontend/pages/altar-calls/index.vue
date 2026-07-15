<!-- pages/altar-calls/index.vue -->
<template>
  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <!-- Header -->
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Altar Calls
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Review altar call responses and categories across all events.
        </p>
      </div>

      <button
        @click="openCreateDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        Record Altar Call
      </button>
    </div>

    <!-- Data Table Container -->
    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <!-- Loading State -->
      <div v-if="isFetching" class="py-20 text-center">
        <Icon
          name="heroicons:arrow-path"
          class="mx-auto h-10 w-10 text-gray-400 animate-spin mb-4"
        />
        <h3
          class="text-[11px] font-bold font-jetbrains text-gray-500 uppercase tracking-widest animate-pulse"
        >
          Loading altar call records...
        </h3>
      </div>

      <div
        v-else
        class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50/50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap w-1/3"
              >
                Event Details
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Call Type
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Responders
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="record in altarCalls"
              :key="record.id"
              class="hover:bg-gray-50/50 transition-colors group"
            >
              <!-- Event Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs md:text-sm font-bold text-gray-900">
                  <!-- Condition 1: If it's a Special Program, show the Program Name and Day -->
                  <template
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    {{
                      record.eventDetails?.specialProgram || "Special Program"
                    }}
                    <span
                      v-if="record.eventDetails?.programDay"
                      class="font-semibold text-gray-900"
                    >
                      - {{ record.eventDetails.programDay }}
                    </span>
                  </template>
                  <!-- Condition 2: If it's a regular service, just show the service name -->
                  <template v-else>
                    {{ record.eventDetails?.service || "Unknown Event" }}
                  </template>
                </div>

                <div
                  class="text-[11px] font-jetbrains font-semibold tracking-wide uppercase mt-1 text-gray-600"
                >
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
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-jetbrains font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100"
                >
                  {{ record.callType }}
                </span>
              </td>

              <!-- Responders Column -->
              <td
                class="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm font-black text-black"
              >
                {{ record.totalResponders || 0 }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div
          v-if="altarCalls.length === 0"
          class="py-20 text-center border-t border-gray-100"
        >
          <Icon
            name="heroicons:megaphone"
            class="mx-auto h-12 w-12 text-gray-300 mb-4"
          />
          <h3 class="text-sm font-bold text-gray-900 mb-1">
            No altar calls recorded
          </h3>
          <p class="text-gray-500 text-xs px-5">
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
      <div class="p-1 font-poppins">
        <!-- Step 1: Select Event using our reusable component -->
        <div class="mb-6 pb-6 border-b border-gray-100">
          <label
            class="block text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-2"
          >
            Select Target Event
          </label>
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
          <h4
            class="text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-4"
          >
            Response Details
          </h4>
          <!-- We reuse the form component built for the individual event view -->
          <EventAltarCallForm
            @submit="handleAltarCallSubmit"
            :loading="isSubmitting"
          />
        </div>

        <!-- Awaiting Selection State -->
        <div
          v-else
          class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200"
        >
          <Icon
            name="heroicons:calendar"
            class="h-8 w-8 text-gray-300 mx-auto mb-3"
          />
          <p
            class="text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest"
          >
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

// Extracted both formatters to keep it DRY!
import { formatEventDisplay, formatDate } from "~/utils/formatters";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useAppToast();

const altarCalls = ref([]);
const events = ref([]);
const isFetching = ref(true);
const isDrawerOpen = ref(false);
const isSubmitting = ref(false);
const selectedEventId = ref("");

const fetchData = async () => {
  isFetching.value = true;
  try {
    // 1. Fetch Event Altar Calls using the new endpoint we just made
    const callsRes = await $fetch(
      `${config.public.apiBase}/admin/altar-calls/global`,
      {
        headers: { Authorization: `Bearer ${authStore.token}` },
      },
    );

    altarCalls.value = callsRes;

    // 2. Fetch Events to populate the searchable dropdown
    const evRes = await $fetch(`${config.public.apiBase}/admin/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    events.value = evRes
      .map((ev) => ({ ...ev, formattedName: formatEventDisplay(ev) }))
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("Could not load global altar call data.");
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
    await $fetch(`${config.public.apiBase}/admin/altar-calls`, {
      method: "POST",
      body: { eventId: selectedEventId.value, ...formData },
      headers: { Authorization: `Bearer ${authStore.token}` },
    });

    toast.success("Altar call recorded successfully.");
    closeDrawer();
    fetchData(); // Refresh the table automatically
  } catch (error) {
    toast.error("Could not save the altar call record.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
