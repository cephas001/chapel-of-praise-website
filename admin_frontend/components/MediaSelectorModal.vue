<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-[9998] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" @click="close" />
      <Transition name="scale">
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- keydown Esc on a focusable dialog is the accessible pattern -->
        <section v-if="modelValue" ref="dialogRef" class="relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl outline-none" role="dialog" aria-modal="true" aria-labelledby="media-selector-title" tabindex="-1" @keydown.esc.stop.prevent="close">
          <header class="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
            <div>
              <h2 id="media-selector-title" class="font-jetbrains text-sm font-bold text-gray-900">Choose an image</h2>
              <p class="mt-1 text-xs text-gray-500">Select an image from your website media library.</p>
            </div>
            <button type="button" class="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black" aria-label="Close media selector" @click="close"><Icon name="heroicons:x-mark" class="h-5 w-5" /></button>
          </header>

          <main class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div class="mb-4 flex flex-col gap-2 lg:flex-row">
              <div class="relative flex-1">
                <label for="media-selector-search" class="sr-only">Search images</label>
                <Icon name="heroicons:magnifying-glass" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input id="media-selector-search" v-model="searchQuery" type="search" placeholder="Search images by name..." class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-xs text-black outline-none transition-all focus:border-black focus:bg-white" >
              </div>
              <div class="flex gap-2 flex-1">
                <div class="relative flex-1">
                  <label for="media-selector-url" class="sr-only">Paste an image URL</label>
                  <Icon name="heroicons:link" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input id="media-selector-url" v-model="imageUrl" type="url" placeholder="or paste an image URL" class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-xs text-black outline-none transition-all focus:border-black focus:bg-white" @keydown.enter.prevent="useUrl">
                </div>
                <button type="button" class="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-jetbrains text-xs text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="!imageUrl.trim()" @click="useUrl">Use URL</button>
              </div>
            </div>

            <div v-if="isLoading" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <div v-for="index in 12" :key="index" class="aspect-square animate-pulse rounded-xl bg-gray-200" />
            </div>
            <div v-else-if="filteredImages.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <button v-for="image in filteredImages" :key="image.id" type="button" class="group overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" :aria-label="`Select ${image.name}`" @click="selectImage(image.url)">
                <div class="relative aspect-square overflow-hidden bg-gray-100">
                  <img :src="image.url" :alt="image.name" loading="lazy" decoding="async" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" >
                  <div class="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"><span class="rounded-lg bg-white px-3 py-2 font-jetbrains text-[11px] font-bold text-black">Select image</span></div>
                </div>
                <div class="p-3"><p class="truncate text-xs font-semibold text-gray-800" :title="image.name">{{ image.name }}</p><p class="mt-1 text-[11px] text-gray-500">{{ formatDate(image.createdAt) }}</p></div>
              </button>
            </div>
            <div v-else-if="images.length" class="rounded-xl border border-dashed border-gray-200 px-5 py-14 text-center">
              <Icon name="heroicons:magnifying-glass" class="mx-auto h-9 w-9 text-gray-300" />
              <p class="mt-3 font-jetbrains text-sm font-bold text-gray-800">No images match your search</p>
              <button type="button" class="mt-3 rounded-lg border border-gray-200 bg-white px-4 py-2 font-jetbrains text-[11px] text-gray-700 transition-colors hover:bg-gray-50" @click="searchQuery = ''">Clear search</button>
            </div>
            <div v-else class="rounded-xl border border-dashed border-gray-200 px-5 py-14 text-center"><Icon name="heroicons:photo" class="mx-auto h-9 w-9 text-gray-300" /><p class="mt-3 font-jetbrains text-sm font-bold text-gray-800">No images available</p><p class="mt-1 text-xs text-gray-500">Upload an image in the Image Library before selecting one.</p></div>
          </main>
        </section>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch, nextTick } from "vue";

const props = defineProps({ modelValue: { type: Boolean, default: false } });
const emit = defineEmits(["update:modelValue", "select"]);
const config = useRuntimeConfig();
const toast = useAppToast();
const images = ref([]);
const isLoading = ref(false);
const dialogRef = ref(null);
const searchQuery = ref("");
const imageUrl = ref("");

const orderedImages = computed(() => [...images.value].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));

const filteredImages = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return orderedImages.value;
  return orderedImages.value.filter((image) =>
    String(image.name || "").toLowerCase().includes(query),
  );
});

const loadImages = async () => {
  isLoading.value = true;
  try { images.value = await $fetch(`${config.public.apiBase}/admin/media`); }
  catch (error) { console.error("Failed to load media selector images:", error); toast.error("Could not load your image library."); }
  finally { isLoading.value = false; }
};

const close = () => emit("update:modelValue", false);
const selectImage = (url) => { emit("select", url); close(); };
const useUrl = () => {
  const url = imageUrl.value.trim();
  if (!url) return;
  if (!/^https?:\/\//i.test(url)) {
    toast.error("Image URLs must start with http:// or https://.");
    return;
  }
  selectImage(url);
};
const formatDate = (date) => date ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(date)) : "Uploaded image";

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    searchQuery.value = "";
    imageUrl.value = "";
    loadImages();
    await nextTick();
    dialogRef.value?.focus();
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scale-enter-active, .scale-leave-active { transition: all .2s ease; }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: translateY(1rem) scale(.98); }
</style>
