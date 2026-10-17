<template>
  <div
    class="min-h-screen flex items-center justify-center bg-canvas px-4"
  >
    <AppCard
      class="max-w-md w-full" body-class="p-8 text-center"
    >
      <div
        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-surface bg-subtle border border-line"
      >
        <Icon
          :name="
            error.statusCode === 404
              ? 'heroicons:magnifying-glass'
              : 'heroicons:exclamation-triangle'
          "
          class="h-7 w-7 text-ink"
        />
      </div>

      <p
        class="font-mono text-xs font-medium text-muted mb-2"
      >
        Error {{ error.statusCode }}
      </p>

      <h1 class="text-lg md:text-xl font-semibold text-ink mb-3">
        {{
          error.statusCode === 404 ? "Page not found" : "Something went wrong"
        }}
      </h1>

      <p class="text-xs md:text-sm text-muted mb-8 leading-relaxed">
        {{
          error.statusCode === 404
            ? "The page you are looking for does not exist or may have been moved."
            : error.statusMessage ||
              "An unexpected error occurred. Please try again."
        }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <AppButton
          class="w-full sm:w-auto"
          icon="heroicons:home"
          @click="handleClear"
        >
          Back to dashboard
        </AppButton>
        <AppButton
          variant="secondary"
          class="w-full sm:w-auto"
          @click="handleBack"
        >
          Go back
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

<script setup>
const props = defineProps({
  error: { type: Object, required: true },
});

const handleClear = () => clearError({ redirect: "/dashboard" });

const handleBack = () => {
  if (import.meta.client && window.history.length > 1) {
    window.history.back();
  } else {
    clearError({ redirect: "/dashboard" });
  }
};

useHead({
  title: `${props.error.statusCode} · COP Admin`,
});
</script>
