import { onMounted, onBeforeUnmount } from "vue";

// Guards against losing unsaved edits: intercepts browser unload (refresh/close)
// and in-app route navigation while isDirty is true.
export const useUnsavedChanges = (isDirty, options = {}) => {
  const confirm = useConfirm();

  const handleBeforeUnload = (event) => {
    if (!isDirty.value) return;
    event.preventDefault();
    event.returnValue = "";
  };

  onMounted(() => window.addEventListener("beforeunload", handleBeforeUnload));
  onBeforeUnmount(() =>
    window.removeEventListener("beforeunload", handleBeforeUnload),
  );

  onBeforeRouteLeave(async () => {
    if (!isDirty.value) return true;

    return await confirm.ask({
      title: options.title || "Unsaved Changes",
      message:
        options.message ||
        "You have unsaved changes on this page. Leave anyway and discard them?",
      confirmText: options.confirmText || "Leave & Discard",
      cancelText: options.cancelText || "Stay",
      isDestructive: true,
    });
  });
};
