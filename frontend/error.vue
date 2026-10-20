<template>
  <NuxtLayout name="default">
    <section
      class="flex min-h-[70vh] items-center justify-center bg-paper px-4 py-24 text-ink"
    >
      <div class="max-w-xl text-center">
        <span
          class="mx-auto mb-5 block h-0.5 w-10 rounded-full bg-brand-600"
          aria-hidden="true"
        />
        <p class="text-sm font-medium text-brand-600">
          {{ isNotFound ? "404" : "Error " + statusCode }}
        </p>
        <h1
          class="mt-3 font-impact text-5xl uppercase leading-none sm:text-6xl md:text-7xl"
        >
          {{ title }}
        </h1>
        <p class="mt-6 text-base font-light leading-7 text-gray-600">
          {{ description }}
        </p>
        <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <AppButton variant="primary" @click="goHome">
            Back to home
          </AppButton>
          <AppButton variant="ghost" @click="goBack">Go back</AppButton>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import { computed } from "vue";
import { clearError, useRouter, useSeoMeta } from "#app";

const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
});

const router = useRouter();

const statusCode = computed(() => Number(props.error?.statusCode) || 500);
const isNotFound = computed(() => statusCode.value === 404);
const title = computed(() =>
  isNotFound.value ? "Page Not Found" : "Something Went Wrong",
);
const description = computed(() => {
  if (isNotFound.value) {
    return "The page you are looking for does not exist or may have moved. Check the address or return to the homepage.";
  }

  return (
    props.error?.statusMessage ||
    "An unexpected error occurred. Please try again or return to the homepage."
  );
});

useSeoMeta({
  title: computed(() => `${title.value} | Chapel of Praise`),
  robots: "noindex, nofollow",
});

function goHome() {
  clearError({ redirect: "/" });
}

function goBack() {
  if (typeof window !== "undefined" && window.history.length > 1) {
    router.back();
    return;
  }

  goHome();
}
</script>
