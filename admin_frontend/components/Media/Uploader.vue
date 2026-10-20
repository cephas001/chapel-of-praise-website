<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      :accept="MEDIA_ACCEPT"
      :multiple="multiple"
      :aria-label="multiple ? 'Choose images to upload' : 'Choose an image to upload'"
      class="hidden"
      @change="handleFiles"
    >

    <div
      class="group rounded-surface border-2 border-dashed border-line bg-surface transition-colors"
      :class="[
        variant === 'page' ? 'p-6 text-center sm:p-9' : 'px-4 py-3',
        isDragging
          ? 'border-ink bg-subtle'
          : 'hover:border-ink hover:bg-subtle',
        !multiple && isUploading
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer',
      ]"
      role="button"
      tabindex="0"
      :aria-disabled="!multiple && isUploading ? 'true' : undefined"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="dropFiles"
    >
      <template v-if="variant === 'page'">
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-subtle text-ink transition-colors group-hover:bg-ink group-hover:text-white"
        >
          <Icon name="heroicons:arrow-up-tray" class="h-6 w-6" />
        </div>
        <p class="font-mono text-sm font-semibold text-ink">
          {{ multiple ? 'Drop images here or' : 'Drop an image here or' }}
          <span class="underline underline-offset-4">browse your device</span>
        </p>
        <p class="mt-2 text-xs text-muted">
          JPG, PNG, WEBP or GIF, up to 8 MB per image
        </p>
      </template>

      <div v-else class="flex items-center gap-3">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-subtle text-ink transition-colors group-hover:bg-ink group-hover:text-white"
        >
          <Icon name="heroicons:arrow-up-tray" class="h-4 w-4" />
        </span>
        <div class="min-w-0">
          <p class="text-xs font-medium text-ink">
            Drop an image here or
            <span class="underline underline-offset-4">browse</span>
          </p>
          <p class="mt-0.5 text-[11px] text-muted">
            JPG, PNG, WEBP or GIF, up to 8 MB
          </p>
        </div>
      </div>
    </div>

    <p
      v-if="variant === 'compact' && isUploading"
      class="mt-2 text-xs text-muted"
      role="status"
    >
      Uploading. The image will be selected when it finishes.
    </p>

    <div v-if="uploadQueue.length" class="mt-3 space-y-2">
      <div
        v-for="item in uploadQueue"
        :key="item.id"
        class="flex items-start gap-3 rounded-surface border px-3 py-2.5"
        :class="
          item.status === 'error'
            ? 'border-danger-line bg-danger-surface/50'
            : 'border-line bg-surface'
        "
      >
        <Icon
          :name="
            item.status === 'error'
              ? 'heroicons:exclamation-triangle'
              : 'heroicons:photo'
          "
          class="mt-0.5 h-4 w-4 shrink-0"
          :class="
            item.status === 'error' ? 'text-danger-text' : 'text-muted'
          "
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-semibold text-ink">
            {{ item.file.name }}
          </p>
          <div
            class="mt-1.5 h-1 overflow-hidden rounded-full bg-subtle"
            role="progressbar"
            :aria-label="`Upload progress for ${item.file.name}`"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="item.status === 'error' ? 100 : item.progress"
          >
            <div
              class="h-full transition-colors"
              :class="
                item.status === 'error' ? 'bg-danger-text' : 'bg-ink'
              "
              :style="{
                width: `${item.status === 'error' ? 100 : item.progress}%`,
              }"
            />
          </div>
          <p
            v-if="item.status === 'error'"
            class="mt-1.5 text-xs text-danger-text"
          >
            {{ item.error }}
          </p>
        </div>

        <span
          v-if="item.status === 'uploading'"
          class="font-mono text-[11px] font-medium text-muted"
        >
          {{ item.progress }}%
        </span>
        <span
          v-else-if="item.status === 'done'"
          class="text-xs font-semibold text-success-text"
        >
          Uploaded
        </span>
        <div v-else class="flex items-center gap-1">
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-control text-muted transition-colors hover:bg-subtle hover:text-ink"
            :aria-label="`Retry upload of ${item.file.name}`"
            title="Retry"
            @click="retryUpload(item)"
          >
            <Icon name="heroicons:arrow-path" class="h-4 w-4" />
          </button>
          <button
            type="button"
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
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useAuthStore } from "~/stores/auth";
import {
  MEDIA_ACCEPT,
  validateMediaFile,
} from "~/utils/media";

const props = defineProps({
  variant: {
    type: String,
    default: "compact",
    validator: (value) => ["compact", "page"].includes(value),
  },
  multiple: { type: Boolean, default: false },
});

const emit = defineEmits(["uploaded", "update:uploading"]);

const config = useRuntimeConfig();
const toast = useAppToast();
const authStore = useAuthStore();
const fileInput = ref(null);
const uploadQueue = ref([]);
const isDragging = ref(false);
let dragDepth = 0;

const isUploading = computed(() =>
  uploadQueue.value.some((item) => item.status === "uploading"),
);

watch(isUploading, (uploading) => emit("update:uploading", uploading));

const openPicker = () => {
  if (!props.multiple && isUploading.value) return;
  fileInput.value?.click();
};

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

      if (xhr.status >= 200 && xhr.status < 300 && payload) {
        resolve(payload);
      } else {
        reject(new Error(payload?.message || "Upload failed."));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(
      JSON.stringify({ name: item.file.name, type: item.file.type, data }),
    );
  });

const uploadFile = async (item) => {
  item.status = "uploading";
  item.error = "";
  item.progress = 5;

  try {
    const data = await readFile(item.file);
    item.progress = 30;
    const image = await uploadWithProgress(item, data);
    item.progress = 100;
    item.status = "done";
    emit("uploaded", image);
  } catch (error) {
    console.error("Failed to upload image:", error);
    item.status = "error";
    item.error = error?.message || "Upload failed.";
    toast.error(`Could not upload ${item.file.name}.`);
  }
};

const queueFiles = async (fileList) => {
  if (!props.multiple && isUploading.value) return;

  let files = [...fileList];

  if (!props.multiple && files.length > 1) {
    toast.info(
      "Add one image at a time here. Use the image library for batches.",
    );
    files = files.slice(0, 1);
  }

  const validFiles = files.filter((file) => {
    const error = validateMediaFile(file);
    if (error) toast.error(error);
    return !error;
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

  const succeeded = queue.filter((item) => item.status === "done");

  if (succeeded.length) {
    window.setTimeout(() => {
      uploadQueue.value = uploadQueue.value.filter(
        (item) => !succeeded.includes(item),
      );
    }, 1100);
  }
};

const retryUpload = (item) => uploadFile(item);
const dismissQueueItem = (item) => {
  uploadQueue.value = uploadQueue.value.filter((entry) => entry !== item);
};

const handleFiles = (event) => {
  if (event.target.files?.length) queueFiles(event.target.files);
  event.target.value = "";
};

const handleDragEnter = () => {
  dragDepth += 1;
  isDragging.value = true;
};

const handleDragLeave = () => {
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) isDragging.value = false;
};

const dropFiles = (event) => {
  dragDepth = 0;
  isDragging.value = false;
  queueFiles(event.dataTransfer.files);
};
</script>
