<template>
  <div class="relative min-h-screen pb-12 pt-5">
    <AppHeading
      class="mb-8"
      title="Image library"
      subtitle="Upload and manage the images used across the Chapel of Praise website."
    />

    <div class="border-t border-line pt-7">
      <MediaUploader
        variant="page"
        multiple
        @uploaded="handleUploaded"
      />

      <div class="mt-3 flex flex-col gap-2 sm:flex-row">
        <div class="relative flex-1">
          <label for="image-url" class="sr-only">Paste an image URL</label>
          <Icon
            name="heroicons:link"
            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            id="image-url"
            v-model="imageUrl"
            type="url"
            placeholder="or paste an image URL (https://...)"
            class="w-full rounded-control border border-line bg-subtle py-2.5 pl-9 pr-4 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-surface md:text-sm"
            @keydown.enter.prevent="addImageByUrl"
          >
        </div>
        <AppButton
          variant="secondary"
          :disabled="!imageUrl.trim()"
          :loading="isAddingUrl"
          @click="addImageByUrl"
        >
          Add URL
        </AppButton>
      </div>
      <p v-if="urlError" class="mt-2 text-xs text-danger-text">
        {{ urlError }}
      </p>
    </div>

    <section class="mt-10 border-t border-line pt-7">
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-ink">Uploaded images</h3>
          <p class="mt-1 text-xs text-muted">
            {{ images.length }}
            {{ images.length === 1 ? "image" : "images" }} in your library
          </p>
        </div>
        <button
          type="button"
          class="rounded-control p-2 text-muted transition-colors hover:bg-subtle hover:text-ink"
          :disabled="isLoading"
          aria-label="Refresh image library"
          @click="loadImages()"
        >
          <Icon
            name="heroicons:arrow-path"
            class="h-4 w-4"
            :class="{ 'animate-spin': isLoading }"
          />
        </button>
      </div>

      <MediaLibraryGrid
        :images="images"
        :is-loading="isLoading"
        :skeleton-count="10"
        columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        empty-title="Your image library is empty"
        empty-description="Add images above to use them throughout your website."
      >
        <template #meta="{ image }">
          <p class="mt-1 font-mono text-xs text-muted">
            {{
              image.storageProvider === "external"
                ? "External image"
                : formatFileSize(image.size)
            }}
          </p>
        </template>

        <template #actions="{ image }">
          <div
            class="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-ink/55 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          />
          <button
            type="button"
            class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-control bg-surface/95 text-danger-text opacity-100 transition hover:bg-danger-text/85 hover:text-white disabled:cursor-not-allowed sm:opacity-0 sm:group-hover:opacity-100"
            :disabled="deletingId === image.id"
            :aria-label="`Delete ${image.name}`"
            @click="confirmDelete(image)"
          >
            <Icon
              :name="
                deletingId === image.id
                  ? 'heroicons:arrow-path'
                  : 'heroicons:trash'
              "
              class="h-4 w-4"
              :class="{ 'animate-spin': deletingId === image.id }"
            />
          </button>
        </template>
      </MediaLibraryGrid>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useConfirm } from "~/composables/useConfirm";
import { formatFileSize, isValidImageUrl } from "~/utils/media";

definePageMeta({ allowedUserTypes: ["website"] });

const toast = useAppToast();
const confirm = useConfirm();
const {
  images,
  isLoading,
  loadImages,
  addImage,
  addExternalUrl,
  deleteImage,
} = useMediaLibrary();

const imageUrl = ref("");
const urlError = ref("");
const isAddingUrl = ref(false);
const deletingId = ref(null);

const handleUploaded = (image) => addImage(image);

const addImageByUrl = async () => {
  const url = imageUrl.value.trim();
  if (!url || isAddingUrl.value) return;

  urlError.value = "";

  if (!isValidImageUrl(url)) {
    urlError.value =
      "Enter a valid image URL starting with http:// or https://.";
    return;
  }

  isAddingUrl.value = true;

  try {
    await addExternalUrl(url);
    imageUrl.value = "";
    toast.success("Image added to your library.");
  } catch (error) {
    urlError.value = error?.data?.message || "Could not add that image URL.";
  } finally {
    isAddingUrl.value = false;
  }
};

const confirmDelete = async (image) => {
  const answer = await confirm.ask({
    title: "Delete image",
    message: `Are you sure you want to delete “${image.name}”? This cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    isDestructive: true,
  });
  if (!answer) return;

  deletingId.value = image.id;

  try {
    await deleteImage(image.id);
    toast.success("Image deleted.");
  } catch (error) {
    console.error("Failed to delete image:", error);
    toast.error("Could not delete the image.");
  } finally {
    deletingId.value = null;
  }
};

onMounted(() => loadImages());
</script>
