<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 font-montserrat">
    <div class="mb-10">
      <h1
        class="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2"
      >
        Welcome back, {{ name }}
      </h1>
      <p class="text-base text-gray-500 font-medium">
        Here's your mission control for Chapel of Praise. What are we working on
        today?
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      <ModuleNavigator
        title="Events"
        description="Review event details, make changes to the schedule, and manage submissions for upcoming events."
        iconName="heroicons:calendar"
        iconColor="orange"
        :links="[{ text: 'View Events', url: '/', type: 'primary' }]"
      />

      <ModuleNavigator
        title="Event Unit Attendance"
        description="Review event unit attendance records, and submit attendance for concluded events."
        iconName="heroicons:clipboard-document-check"
        iconColor="blue"
        :links="[
          { text: 'View Records', url: '/', type: 'primary' },
          { text: 'Submit Attendance', url: '/', type: 'secondary' },
        ]"
      />

      <ModuleNavigator
        title="Event Head Count"
        description="Track and manage head count data for existing and upcoming events."
        iconName="heroicons:users"
        iconColor="purple"
        :links="[
          { text: 'View Records', url: '/', type: 'primary' },
          { text: 'Submit Head Count', url: '/', type: 'secondary' },
        ]"
      />

      <ModuleNavigator
        title="Altar Calls"
        description="Manage and track altar calls for concluded and upcoming events."
        iconName="heroicons:megaphone"
        iconColor="red"
        :links="[
          { text: 'View Records', url: '/', type: 'primary' },
          { text: 'Submit Altar Calls', url: '/', type: 'secondary' },
        ]"
      />

      <ModuleNavigator
        title="Unit Members"
        description="Manage and track unit member information across various chapel units."
        iconName="heroicons:users"
        iconColor="green"
        :links="[{ text: 'Manage Members', url: '/', type: 'primary' }]"
      />

      <ModuleNavigator
        title="Unit Meeting Attendance"
        description="Manage and track unit meeting attendance records for concluded and upcoming meetings."
        iconName="heroicons:clipboard-document-check"
        iconColor="blue"
        :links="[
          { text: 'View Records', url: '/', type: 'primary' },
          { text: 'Submit Attendance', url: '/', type: 'secondary' },
        ]"
      />

      <ModuleNavigator
        title="Workers in Training"
        description="Manage workers in training for concluded and upcoming editions."
        iconName="heroicons:academic-cap"
        iconColor="orange"
        :links="[{ text: 'Manage Training', url: '/', type: 'primary' }]"
      />

      <ModuleNavigator
        title="Workers in Training Attendance"
        description="Manage attendance for workers in training sessions."
        iconName="heroicons:clipboard-document-check"
        iconColor="blue"
        :links="[{ text: 'Manage Attendance', url: '/', type: 'primary' }]"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const name = computed(() => auth.user?.name?.split(" ")[0] || "Administrator");
</script>
