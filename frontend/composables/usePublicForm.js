import { ref } from "vue";
import { useRuntimeConfig } from "#app";

export const usePublicForm = ({ path, successMessage, fallbackError }) => {
  const config = useRuntimeConfig();

  const loading = ref(false);
  const errorMessage = ref("");
  const success = ref("");
  const website = ref("");

  const submit = async (payload) => {
    if (loading.value) return false;

    loading.value = true;
    errorMessage.value = "";
    success.value = "";

    try {
      await $fetch(`${config.public.apiBaseUrl}${path}`, {
        method: "POST",
        body: { ...payload, website: website.value },
      });

      success.value = successMessage;
      return true;
    } catch (error) {
      errorMessage.value =
        error?.data?.error ||
        fallbackError ||
        "Something went wrong. Please try again.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    errorMessage.value = "";
    success.value = "";
    website.value = "";
  };

  return { loading, errorMessage, success, website, submit, reset };
};
