import { ref } from "vue";

export const useMediaLibrary = () => {
  const config = useRuntimeConfig();
  const toast = useAppToast();
  const images = ref([]);
  const isLoading = ref(true);

  const loadImages = async ({ silent = false } = {}) => {
    if (!silent) isLoading.value = true;

    try {
      images.value = await $fetch(`${config.public.apiBase}/admin/media`);
    } catch (error) {
      console.error("Failed to load the image library:", error);
      toast.error("Could not load your image library.");
    } finally {
      if (!silent) isLoading.value = false;
    }
  };

  const addImage = (image) => {
    if (!image?.id) return;
    images.value = [
      image,
      ...images.value.filter((item) => item.id !== image.id),
    ];
  };

  const addExternalUrl = async (url) => {
    const image = await $fetch(`${config.public.apiBase}/admin/media`, {
      method: "POST",
      body: {
        name: url.split("/").pop() || "External image",
        url,
      },
    });

    addImage(image);
    return image;
  };

  const deleteImage = async (id) => {
    await $fetch(`${config.public.apiBase}/admin/media/${id}`, {
      method: "DELETE",
    });

    images.value = images.value.filter((image) => image.id !== id);
  };

  return {
    images,
    isLoading,
    loadImages,
    addImage,
    addExternalUrl,
    deleteImage,
  };
};
