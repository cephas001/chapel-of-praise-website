<template>
  <div class="flex gap-2">
    <input :id="inputId" :value="modelValue" type="url" readonly tabindex="-1" class="min-w-0 flex-1 cursor-default rounded-control border border-line bg-subtle px-4 py-2.5 text-xs text-ink outline-none md:text-sm" :placeholder="placeholder" >
    <button type="button" class="inline-flex shrink-0 items-center gap-2 rounded-control border border-line bg-surface px-3 py-2.5 font-mono text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-subtle sm:px-4" @click="isOpen = true"><Icon name="heroicons:photo" class="h-4 w-4" /><span class="hidden sm:inline">Choose image</span></button>
  </div>
  <MediaSelectorModal v-model="isOpen" @select="selectImage" />
</template>

<script setup>
import { ref } from "vue";

defineProps({ modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Choose an image from your library" }, inputId: { type: String, default: undefined } });
const emit = defineEmits(["update:modelValue"]);
const isOpen = ref(false);
const selectImage = (url) => emit("update:modelValue", url);
</script>
