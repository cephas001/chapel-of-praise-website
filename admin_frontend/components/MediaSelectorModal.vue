<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-overlay flex items-end justify-center p-0 sm:items-center sm:p-6"
    >
      <div
        class="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-hidden="true"
        @click="close"
      />
      <Transition name="scale">
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- keydown Esc/Tab on a focusable dialog is the accessible pattern -->
        <section
          v-if="modelValue"
          ref="dialogRef"
          class="relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-surface bg-surface shadow-overlay outline-none sm:rounded-surface"
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-selector-title"
          :aria-busy="isUploading ? 'true' : undefined"
          tabindex="-1"
          @keydown.esc.stop.prevent="close"
          @keydown.tab="trapFocus"
        >
          <header
            class="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6"
          >
            <div>
              <h2
                id="media-selector-title"
                class="text-base font-semibold text-ink"
              >
                Choose an image
              </h2>
              <p class="mt-1 text-sm text-muted">
                Select an existing image or add a new one.
              </p>
            </div>
            <button
              type="button"
              class="rounded-control p-2 text-muted transition-colors hover:bg-subtle hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="isUploading"
              aria-label="Close media selector"
              @click="close"
            >
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </header>

          <main class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <div class="mb-4 flex flex-col gap-2 lg:flex-row">
              <div class="relative flex-1">
                <label for="media-selector-search" class="sr-only">
                  Search images
                </label>
                <Icon
                  name="heroicons:magnifying-glass"
                  class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                />
                <input
                  id="media-selector-search"
                  ref="searchInput"
                  v-model="searchQuery"
                  type="search"
                  placeholder="Search images by name…"
                  class="w-full rounded-control border border-line bg-subtle py-2.5 pl-9 pr-4 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface"
                >
              </div>
              <div class="flex flex-1 gap-2">
                <div class="relative flex-1">
                  <label for="media-selector-url" class="sr-only">
                    Paste an image URL
                  </label>
                  <Icon
                    name="heroicons:link"
                    class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  />
                  <input
                    id="media-selector-url"
                    v-model="imageUrl"
                    type="url"
                    placeholder="or paste an image URL"
                    class="w-full rounded-control border border-line bg-subtle py-2.5 pl-9 pr-4 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface"
                    @keydown.enter.prevent="useUrl"
                  >
                </div>
                <button
                  type="button"
                  class="inline-flex shrink-0 items-center justify-center rounded-control border border-line bg-surface px-4 py-2.5 font-mono text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!imageUrl.trim() || isUploading"
                  @click="useUrl"
                >
                  Use URL
                </button>
              </div>
            </div>

            <MediaUploader
              class="mb-4"
              variant="compact"
              :multiple="false"
              @uploaded="handleUploaded"
              @update:uploading="isUploading = $event"
            />

            <div
              :inert="isUploading || undefined"
              :class="{ 'opacity-60': isUploading }"
            >
              <MediaLibraryGrid
                :images="filteredImages"
                :is-loading="isLoading"
                selectable
                :skeleton-count="12"
                :empty-icon="
                  images.length
                    ? 'heroicons:magnifying-glass'
                    : 'heroicons:photo'
                "
                :empty-title="
                  images.length
                    ? 'No images match your search'
                    : 'No images yet'
                "
                :empty-description="
                  images.length
                    ? 'Try a different name.'
                    : 'Add one above, or open the image library.'
                "
                @select="selectImage"
              >
                <template v-if="images.length" #empty-actions>
                  <button
                    type="button"
                    class="mt-3 rounded-control border border-line bg-surface px-4 py-2 font-mono text-xs font-medium text-ink transition-colors hover:bg-subtle"
                    @click="clearSearch"
                  >
                    Clear search
                  </button>
                </template>
              </MediaLibraryGrid>
            </div>
          </main>

          <footer class="border-t border-line px-5 py-3 sm:px-6">
            <NuxtLink
              to="/website/upload-image"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open image library in a new tab"
              class="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-muted transition-colors hover:text-ink"
            >
              Open image library
              <Icon
                name="heroicons:arrow-top-right-on-square"
                class="h-3.5 w-3.5"
              />
            </NuxtLink>
          </footer>
        </section>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { isValidImageUrl } from "~/utils/media";

const props = defineProps({ modelValue: { type: Boolean, default: false } });
const emit = defineEmits(["update:modelValue", "select"]);

const {
  images,
  isLoading,
  loadImages,
  addImage,
} = useMediaLibrary();
const toast = useAppToast();
const dialogRef = ref(null);
const searchInput = ref(null);
const searchQuery = ref("");
const imageUrl = ref("");
const isUploading = ref(false);
let previouslyFocused = null;
let previousBodyOverflow = "";
let bodyLocked = false;

const filteredImages = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return images.value;

  return images.value.filter((image) =>
    String(image.name || "")
      .toLowerCase()
      .includes(query),
  );
});

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = () =>
  Array.from(
    dialogRef.value?.querySelectorAll(FOCUSABLE_SELECTOR) || [],
  ).filter(
    (element) =>
      element.getClientRects().length > 0 && !element.closest("[inert]"),
  );

const trapFocus = (event) => {
  const focusable = getFocusableElements();
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (document.activeElement === dialogRef.value) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
    return;
  }

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const clearSearch = async () => {
  searchQuery.value = "";
  await nextTick();
  searchInput.value?.focus();
};

const selectImage = (image) => {
  if (isUploading.value) return;
  emit("select", image.url);
  emit("update:modelValue", false);
};

const close = () => {
  if (isUploading.value) return;
  emit("update:modelValue", false);
};

const handleUploaded = (image) => {
  isUploading.value = false;
  addImage(image);
  selectImage(image);
  toast.success("Image uploaded and selected.");
};

const useUrl = () => {
  const url = imageUrl.value.trim();
  if (!url || isUploading.value) return;

  if (!isValidImageUrl(url)) {
    toast.error("Enter a valid image URL starting with http:// or https://.");
    return;
  }

  selectImage({ url });
};

const refreshOnFocus = () => {
  if (props.modelValue && !isUploading.value) {
    loadImages({ silent: true });
  }
};

const lockBody = () => {
  if (bodyLocked) return;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  bodyLocked = true;
};

const unlockBody = () => {
  if (!bodyLocked) return;
  document.body.style.overflow = previousBodyOverflow;
  bodyLocked = false;
};

onMounted(() => window.addEventListener("focus", refreshOnFocus));

onBeforeUnmount(() => {
  window.removeEventListener("focus", refreshOnFocus);
  unlockBody();
});

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement;
      searchQuery.value = "";
      imageUrl.value = "";
      isUploading.value = false;
      lockBody();
      loadImages();
      await nextTick();
      dialogRef.value?.focus();
    } else {
      unlockBody();
      if (previouslyFocused?.focus) previouslyFocused.focus();
    }
  },
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: translateY(1rem) scale(0.98);
}
</style>
