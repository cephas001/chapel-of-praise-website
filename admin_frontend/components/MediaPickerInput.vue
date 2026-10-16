<template>
  <div class="flex gap-2">
    <input :id="inputId" :value="modelValue" type="url" readonly tabindex="-1" class="min-w-0 flex-1 cursor-default bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-black outline-none text-xs md:text-sm" :placeholder="placeholder" >
    <button type="button" class="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-jetbrains text-[11px] text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-black sm:px-4" @click="isOpen = true"><Icon name="heroicons:photo" class="h-4 w-4" /><span class="hidden sm:inline">Choose image</span></button>
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
