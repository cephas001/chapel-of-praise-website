<template>
  <!--
    Sticky save bar: stays in flow at the end of the form and pins to the
    viewport bottom while the form is in view. Negative margins mirror
    main's padding (layouts/default.vue) so the bar bleeds to the column
    edges without width calculations. Extra actions (e.g. Discard) go in
    the default slot; the primary button submits the form.
  -->
  <div
    class="sticky bottom-0 z-sticky -mx-4 -mb-5 mt-6 flex items-center justify-end gap-3 border-t border-line bg-surface/90 px-4 py-3 backdrop-blur-md md:-mx-6 md:-mb-6 md:px-6 lg:-mx-8 lg:-mb-8 lg:px-8"
  >
    <slot />
    <AppButton type="submit" size="lg" :loading="loading">
      {{ loading ? loadingLabel : label }}
    </AppButton>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Save changes",
  },
  loadingLabel: {
    type: String,
    default: "Saving…",
  },
});
</script>
