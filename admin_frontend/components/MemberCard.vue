<!-- components/ui/MemberCard.vue -->
<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col h-full font-montserrat hover:shadow-md transition-shadow"
  >
    <!-- Header -->
    <div class="flex items-start gap-4 mb-4">
      <div
        class="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg shrink-0"
      >
        {{ initials }}
      </div>
      <div>
        <h3 class="text-lg font-black text-gray-900 line-clamp-1">
          {{ member.name }}
        </h3>
        <p
          class="text-xs font-bold mt-0.5"
          :class="
            member.memberType === 'EXECUTIVE'
              ? 'text-blue-600'
              : 'text-gray-500'
          "
        >
          {{ member.memberType === "EXECUTIVE" ? "Executive" : "Worker" }} •
          {{ member.gender }}
        </p>
      </div>
    </div>

    <!-- Quick Contact Actions -->
    <div class="mt-auto flex gap-2" v-if="member.phone">
      <a
        :href="`tel:${member.phone}`"
        class="flex-1 inline-flex justify-center items-center py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-colors"
        title="Call"
      >
        <Icon name="heroicons:phone" class="h-4 w-4 mr-1.5" /> Call
      </a>
      <a
        :href="`https://wa.me/${cleanPhone(member.phone)}`"
        target="_blank"
        class="flex-1 inline-flex justify-center items-center py-2 px-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-bold transition-colors"
        title="WhatsApp"
      >
        <Icon
          name="heroicons:chat-bubble-oval-left-ellipsis"
          class="h-4 w-4 mr-1.5"
        />
        WhatsApp
      </a>
    </div>
    <div
      v-else
      class="mt-auto py-2 px-3 bg-gray-50 rounded-xl text-xs text-gray-400 text-center italic"
    >
      No phone number
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { cleanPhone } from "~/utils/formatters";

const props = defineProps({
  member: { type: Object, required: true },
});

const initials = computed(() => {
  if (!props.member.name) return "?";
  const parts = props.member.name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
});
</script>
