<!-- pages/headcounts/index.vue -->
<template>
  <LoadingScreen :isLoading="isFetching" />

  <div class="relative min-h-screen pb-32 pt-5 font-poppins">
    <div
      class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h2 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-2">
          Event Headcounts
        </h2>
        <p class="text-gray-500 text-xs md:text-sm">
          Review attendance totals across all events and services.
        </p>
      </div>

      <button
        @click="openCreateDrawer"
        class="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains shrink-0"
      >
        <Icon name="heroicons:plus" class="mr-2 h-4 w-4" />
        Record New Headcount
      </button>
    </div>

    <div
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50/50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Event Name & Date
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Male
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-center text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Female
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-right text-[11px] font-jetbrains font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="record in headcounts"
              :key="record.id"
              class="hover:bg-gray-50/50 transition-colors group"
            >
              <td class="px-6 py-4 whitespace-nowrap font-jetbrains">
                <div class="text-xs md:text-sm font-bold text-gray-800">
                  <template
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    {{
                      record.eventDetails?.specialProgram || "Special Program"
                    }}
                    <span
                      v-if="record.eventDetails?.programDay"
                      class="font-semibold text-gray-800"
                    >
                      - {{ record.eventDetails.programDay }}
                    </span>
                  </template>
                  <template v-else>
                    {{ record.eventDetails?.service || "Unknown Event" }}
                  </template>
                </div>

                <div
                  class="text-[11px] font-jetbrains font-semibold tracking-wide uppercase mt-1 text-gray-500"
                >
                  {{ formatDate(record.eventDetails?.eventDate) }}
                  <span
                    v-if="record.eventDetails?.service === 'SPECIAL PROGRAM'"
                  >
                    • Special Program
                  </span>
                </div>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm text-gray-600 font-medium"
              >
                {{ record.maleStudents || 0 + record.maleVisitors || 0 }}
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm text-gray-600 font-medium"
              >
                {{ record.femaleStudents || 0 + record.femaleVisitors || 0 }}
              </td>

              <!-- <td
                class="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm text-gray-600 font-medium"
              >
                {{ (record.maleVisitors || 0) + (record.femaleVisitors || 0) }}
              </td> -->

              <td
                class="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm font-black text-black"
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
          class="py-20 text-center border-t border-gray-100"
        >
          <Icon
            name="heroicons:users"
            class="mx-auto h-12 w-12 text-gray-300 mb-4"
          />
          <h3 class="text-sm font-bold text-gray-900 mb-1">
            No headcounts found
          </h3>
          <p class="text-gray-500 text-xs px-5">
            Get started by recording attendance for a recent event.
          </p>
        </div>
      </div>
    </div>

    <SlideOver
      :is-open="isDrawerOpen"
      title="Record Event Headcount"
      @close="closeDrawer"
    >
      <div class="p-1 font-poppins">
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

        <div v-if="selectedEventId">
          <h4
            class="text-[11px] font-jetbrains font-bold text-gray-700 uppercase tracking-wide mb-4"
          >
            Enter Counts
          </h4>
          <EventHeadCountForm
            @submit="handleHeadcountSubmit"
            :loading="isSubmitting"
          />
        </div>

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
    const hcRes = await $fetch(`${config.public.apiBase}/admin/headcounts`);
    headcounts.value = hcRes;
    console.log(hcRes);

    // 2. Fetch Events for the dropdown
    const evRes = await $fetch(`${config.public.apiBase}/admin/events`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    // Add the formatted string to the object so SearchableSelect can filter by it
    events.value = evRes
      .map((ev) => ({ ...ev, formattedName: formatEventDisplay(ev) }))
      .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  } catch (error) {
    console.error("Fetch error:", error);
    showAlert("Error", "Could not load event headcount data.", "error");
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
    await $fetch(`${config.public.apiBase}/admin/headcounts`, {
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
