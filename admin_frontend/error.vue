<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-poppins"
  >
    <div
      class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center"
    >
      <div
        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100"
      >
        <Icon
          :name="
            error.statusCode === 404
              ? 'heroicons:magnifying-glass'
              : 'heroicons:exclamation-triangle'
          "
          class="h-7 w-7 text-gray-700"
        />
      </div>

      <p
        class="text-[11px] font-jetbrains font-bold uppercase tracking-widest text-gray-500 mb-2"
      >
        Error {{ error.statusCode }}
      </p>

      <h1 class="text-lg md:text-xl font-bold text-black font-jetbrains mb-3">
        {{
          error.statusCode === 404 ? "Page Not Found" : "Something Went Wrong"
        }}
      </h1>

      <p class="text-xs md:text-sm text-gray-500 mb-8 leading-relaxed">
        {{
          error.statusCode === 404
            ? "The page you are looking for does not exist or may have been moved."
            : error.statusMessage ||
              "An unexpected error occurred. Please try again."
        }}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-xs text-white shadow-sm hover:bg-gray-800 transition-colors font-jetbrains cursor-pointer"
          @click="handleClear"
        >
          <Icon name="heroicons:home" class="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
        <button
          class="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 px-6 py-3 text-xs text-gray-700 shadow-sm hover:bg-gray-50 transition-colors font-jetbrains cursor-pointer"
          @click="handleBack"
        >
          Go Back
        </button>
      </div>
    </div>
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
