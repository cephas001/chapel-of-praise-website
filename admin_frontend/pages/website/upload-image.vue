<template>
  <div class="relative min-h-screen pb-12 pt-5">
    <AppHeading
      class="mb-8"
      title="Image library"
      subtitle="Upload and manage the images used across the Chapel of Praise website."
    />

    <div class="border-t border-line pt-7">
      <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple aria-label="Add images to library" class="hidden" @change="handleFiles" >
      <div
        class="group cursor-pointer rounded-surface border-2 border-dashed border-line bg-surface p-6 text-center transition-colors hover:border-ink hover:bg-subtle sm:p-9"
        :class="{ 'border-ink bg-subtle': isDragging }"
        role="button"
        tabindex="0"
        @click="openPicker"
        @keydown.enter="openPicker"
        @keydown.space.prevent="openPicker"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="dropFiles"
      >
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-subtle text-ink transition-colors group-hover:bg-ink group-hover:text-white">
          <Icon name="heroicons:arrow-up-tray" class="h-6 w-6" />
        </div>
        <p class="font-mono text-sm font-semibold text-ink">Drop images here or <span class="underline underline-offset-4">browse your device</span></p>
        <p class="mt-2 text-xs text-muted">JPG, PNG, WEBP or GIF · Up to 8 MB per image</p>
      </div>

      <div class="mt-3 flex flex-col gap-2 sm:flex-row">
        <div class="relative flex-1">
          <label for="image-url" class="sr-only">Paste an image URL</label>
          <Icon name="heroicons:link" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
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
      <p v-if="urlError" class="mt-2 text-xs text-danger-text">{{ urlError }}</p>

      <div v-if="uploadQueue.length" class="mt-5 space-y-3">
        <div
          v-for="item in uploadQueue"
          :key="item.id"
          class="flex items-start gap-3 rounded-surface border px-4 py-3"
          :class="item.status === 'error' ? 'border-danger-line bg-danger-surface/50' : 'border-line bg-surface'"
        >
          <Icon
            :name="item.status === 'error' ? 'heroicons:exclamation-triangle' : 'heroicons:photo'"
            class="mt-0.5 h-5 w-5 shrink-0"
            :class="item.status === 'error' ? 'text-danger-text' : 'text-muted'"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-semibold text-ink">{{ item.file.name }}</p>
            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-subtle">
              <div
                class="h-full transition-colors"
                :class="item.status === 'error' ? 'bg-danger-text' : 'bg-ink'"
                :style="{ width: `${item.status === 'error' ? 100 : item.progress}%` }"
              />
            </div>
            <p v-if="item.status === 'error'" class="mt-1.5 text-xs text-danger-text">{{ item.error }}</p>
          </div>

          <span v-if="item.status === 'uploading'" class="text-xs font-semibold text-muted">{{ item.progress }}%</span>
          <span v-else-if="item.status === 'done'" class="text-xs font-semibold text-success-text">Uploaded</span>
          <div v-else class="flex items-center gap-1">
            <button
              class="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-subtle hover:text-ink"
              :aria-label="`Retry upload of ${item.file.name}`"
              title="Retry"
              @click="retryUpload(item)"
            >
              <Icon name="heroicons:arrow-path" class="h-4 w-4" />
            </button>
            <button
              class="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-subtle hover:text-ink"
              :aria-label="`Dismiss ${item.file.name}`"
              title="Dismiss"
              @click="dismissQueueItem(item)"
            >
              <Icon name="heroicons:x-mark" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <section class="mt-10 border-t border-line pt-7">
      <div class="mb-5 flex items-end justify-between gap-4">
        <div><h3 class="text-base font-semibold text-ink">Uploaded images</h3><p class="mt-1 text-xs text-muted">{{ images.length }} {{ images.length === 1 ? 'image' : 'images' }} in your library</p></div>
        <button class="rounded-control p-2 text-muted transition-colors hover:bg-subtle hover:text-ink" :disabled="isLoading" aria-label="Refresh image library" @click="loadImages"><Icon name="heroicons:arrow-path" class="h-4 w-4" :class="{ 'animate-spin': isLoading }" /></button>
      </div>

      <div v-if="isLoading" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div v-for="index in 10" :key="index" class="aspect-square animate-pulse rounded-surface bg-line" />
      </div>
      <div v-else-if="images.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <article v-for="image in images" :key="image.id" class="group overflow-hidden rounded-surface border border-line bg-surface">
          <div class="relative aspect-square overflow-hidden bg-subtle">
            <img :src="image.url" :alt="image.name" loading="lazy" decoding="async" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" >
            <div class="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-ink/55 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <button class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-control bg-surface/95 text-danger-text opacity-100 transition hover:bg-danger-text/85 hover:text-white sm:opacity-0 sm:group-hover:opacity-100" :disabled="deletingId === image.id" :aria-label="`Delete ${image.name}`" @click="confirmDelete(image)">
              <Icon :name="deletingId === image.id ? 'heroicons:arrow-path' : 'heroicons:trash'" class="h-4 w-4" :class="{ 'animate-spin': deletingId === image.id }" />
            </button>
          </div>
          <div class="p-3"><p class="truncate text-xs font-semibold text-ink" :title="image.name">{{ image.name }}</p><p class="mt-1 text-xs text-muted">{{ formatSize(image.size) }}</p></div>
        </article>
      </div>
      <div v-else class="rounded-surface border border-dashed border-line bg-surface px-5 py-14 text-center"><Icon name="heroicons:photo" class="mx-auto h-9 w-9 text-line" /><p class="mt-3 font-mono text-sm font-semibold text-ink">Your image library is empty</p><p class="mt-1 text-xs text-muted">Upload images above to use them throughout your website.</p></div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useConfirm } from "~/composables/useConfirm";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ allowedUserTypes: ["website"] });

const config = useRuntimeConfig();
const toast = useAppToast();
const confirm = useConfirm();
const authStore = useAuthStore();
const fileInput = ref(null);
const images = ref([]);
const uploadQueue = ref([]);
const isLoading = ref(true);
const isDragging = ref(false);
const deletingId = ref(null);
const imageUrl = ref("");
const urlError = ref("");
const isAddingUrl = ref(false);
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxFileSize = 8 * 1024 * 1024;

const openPicker = () => fileInput.value?.click();
const formatSize = (bytes = 0) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const loadImages = async () => {
  isLoading.value = true;
  try { images.value = await $fetch(`${config.public.apiBase}/admin/media`); }
  catch (error) { console.error("Failed to load image library:", error); toast.error("Could not load your image library."); }
  finally { isLoading.value = false; }
};

const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result.split(",")[1]);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

// Upload via XHR so real upload progress can be tracked (fetch has no
// progress events). The first 30% represents reading the file locally.
const uploadWithProgress = (item, data) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${config.public.apiBase}/admin/media`);
    xhr.setRequestHeader("Content-Type", "application/json");
    if (authStore.token) {
      xhr.setRequestHeader("Authorization", `Bearer ${authStore.token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        item.progress = 30 + Math.round((event.loaded / event.total) * 70);
      }
    };

    xhr.onload = () => {
      let payload = null;
      try {
        payload = JSON.parse(xhr.responseText || "null");
      } catch {
        payload = null;
      }
      if (xhr.status >= 200 && xhr.status < 300 && payload) resolve(payload);
      else reject(new Error(payload?.message || "Upload failed."));
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(
      JSON.stringify({ name: item.file.name, type: item.file.type, data }),
    );
  });

const uploadFile = async (item) => {
  item.status = "uploading";
  item.error = "";
  try {
    item.progress = 5;
    const data = await readFile(item.file);
    item.progress = 30;
    const image = await uploadWithProgress(item, data);
    item.progress = 100;
    item.status = "done";
    images.value.unshift(image);
  } catch (error) {
    console.error("Failed to upload image:", error);
    item.status = "error";
    item.error = error?.message || "Upload failed.";
    toast.error(`Could not upload ${item.file.name}.`);
  }
};

const retryUpload = (item) => {
  uploadFile(item);
};

const dismissQueueItem = (item) => {
  uploadQueue.value = uploadQueue.value.filter((entry) => entry !== item);
};

const addImageByUrl = async () => {
  const url = imageUrl.value.trim();
  if (!url || isAddingUrl.value) return;

  urlError.value = "";
  if (!/^https?:\/\//i.test(url)) {
    urlError.value = "Image URLs must start with http:// or https://.";
    return;
  }

  isAddingUrl.value = true;
  try {
    const image = await $fetch(`${config.public.apiBase}/admin/media`, {
      method: "POST",
      body: {
        name: url.split("/").pop() || "External image",
        url,
      },
    });
    images.value.unshift(image);
    imageUrl.value = "";
    toast.success("Image added to your library.");
  } catch (error) {
    urlError.value = error?.data?.message || "Could not add that image URL.";
  } finally {
    isAddingUrl.value = false;
  }
};

const queueFiles = async (fileList) => {
  const files = [...fileList];
  const validFiles = files.filter((file) => {
    if (allowedTypes.includes(file.type) && file.size <= maxFileSize) return true;
    toast.error(`${file.name} must be a JPG, PNG, WEBP, or GIF under 8 MB.`);
    return false;
  });
  const queue = validFiles.map((file) => ({
    id: `${file.name}-${file.lastModified}-${Math.random()}`,
    file,
    progress: 0,
    status: "uploading",
    error: "",
  }));
  uploadQueue.value.push(...queue);
  await Promise.all(queue.map(uploadFile));

  // Successful uploads fade out of the queue; failures stay for retry
  const succeeded = queue.filter((item) => item.status === "done");
  window.setTimeout(() => {
    uploadQueue.value = uploadQueue.value.filter(
      (item) => !succeeded.includes(item),
    );
  }, 1100);
};

const handleFiles = (event) => { queueFiles(event.target.files); event.target.value = ""; };
const dropFiles = (event) => { isDragging.value = false; queueFiles(event.dataTransfer.files); };

const confirmDelete = async (image) => {
  const answer = await confirm.ask({ title: "Delete image", message: `Are you sure you want to delete “${image.name}”? This cannot be undone.`, confirmText: "Delete", cancelText: "Cancel", isDestructive: true });
  if (!answer) return;
  deletingId.value = image.id;
  try { await $fetch(`${config.public.apiBase}/admin/media/${image.id}`, { method: "DELETE" }); images.value = images.value.filter((item) => item.id !== image.id); toast.success("Image deleted."); }
  catch (error) { console.error("Failed to delete image:", error); toast.error("Could not delete the image."); }
  finally { deletingId.value = null; }
};

onMounted(loadImages);
</script>
