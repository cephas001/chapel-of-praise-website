<!-- components/ui/MemberCard.vue -->
<template>
  <AppCard
    class="flex h-full flex-col" body-class="p-5 flex flex-1 flex-col"
  >
    <!-- Header -->
    <div class="flex items-start gap-4 mb-4">
      <div
        class="h-12 w-12 rounded-full bg-subtle flex items-center justify-center text-muted font-semibold text-base shrink-0"
      >
        {{ initials }}
      </div>
      <div>
        <h3 class="text-sm md:text-base font-semibold text-ink line-clamp-1">
          {{ member.name }}
        </h3>
        <p
          class="font-mono text-xs font-medium mt-0.5"
          :class="
            member.memberType === 'EXECUTIVE'
              ? 'text-muted'
              : 'text-muted'
          "
        >
          {{ member.memberType === "EXECUTIVE" ? "Executive" : "Worker" }} •
          {{ member.gender }}
        </p>
      </div>
    </div>

    <!-- Quick Contact Actions -->
    <div v-if="member.phone" class="mt-auto flex gap-2">
      <a
        :href="`tel:${member.phone}`"
        class="flex-1 inline-flex items-center justify-center rounded-surface border border-line bg-surface px-3 py-2 text-xs text-ink transition-colors hover:bg-subtle"
        title="Call"
      >
        <Icon name="heroicons:phone" class="h-4 w-4 mr-1.5" /> Call
      </a>
      <a
        :href="`https://wa.me/${cleanPhone(member.phone)}`"
        target="_blank"
        class="flex-1 inline-flex items-center justify-center rounded-surface bg-success-surface px-3 py-2 text-xs text-success-text transition-colors hover:bg-success-line"
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
      class="mt-auto rounded-surface bg-subtle px-3 py-2 text-center text-xs italic text-muted"
    >
      No phone number
    </div>
  </AppCard>
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
