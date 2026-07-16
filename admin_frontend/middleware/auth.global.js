// middleware/require-auth-and-type.ts
import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useCookie,
  useNuxtApp,
} from "#app";
import { useAuthStore } from "~/stores/auth";
import { useAppToast } from "~/composables/useAppToast";

export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Token check
  const token = useCookie("admin_token");
  const publicRoutes = ["/auth/login"];

  // 2. If no token and trying to access a private page -> login
  if (!token.value && !publicRoutes.includes(to.path)) {
    // On client show toast; on server just redirect
    if (import.meta.client) {
      const toast = useAppToast();
      toast.error("Please log in to continue.");
    }
    return navigateTo("/auth/login");
  }

  // 3. If token exists and trying to view login -> redirect to home
  if (token.value && to.path === "/auth/login") {
    return navigateTo("/");
  }

  // 4. Authorization by page meta.allowedUserTypes
  // If page doesn't declare allowedUserTypes, treat as unrestricted (change to deny-by-default if desired)
  const rawAllowed = to.meta?.allowedUserTypes ?? null;
  const accessSuperOnly = Boolean(to.meta?.accessToSuperAdminOnly);

  // 5. Get user info from your store
  const authStore = useAuthStore();
  const userRole = authStore.user?.role;
  const userType = authStore.user?.type;

  // If page is restricted to super_admin only
  if (accessSuperOnly) {
    if (userRole === "super_admin") return;
    if (import.meta.client) {
      useAppToast().warning(
        "The requested page is restricted to Super Admins only.",
      );
      if (from && from.path && from.path !== to.path)
        return navigateTo(from.fullPath || from.path);
      return navigateTo("/");
    }
    return navigateTo("/");
  }

  if (!rawAllowed) return;

  // Normalize allowed to a Set for fast lookup
  const allowedArr = Array.isArray(rawAllowed) ? rawAllowed : [rawAllowed];
  const allowedSet = new Set(allowedArr);

  // super_admin bypass
  if (userRole === "super_admin") return;

  // admin logic: allow if user.type === 'all' or in allowedSet
  if (userRole === "admin") {
    if (userType === "all") return;
    if (allowedSet.has(userType)) return;
  }

  // 6. Unauthorized: show toast on client and navigate back (or fallback)
  const fallback = "/dashboard";
  if (import.meta.client) {
    useAppToast().warning(
      `You do not have permission to access the requested page.`,
    );
    // Prefer returning to previous route if available and different
    if (from && from.path && from.path !== to.path) {
      return navigateTo(from.fullPath || from.path);
    } else {
      return navigateTo(fallback);
    }
  } else {
    // Server-side redirect (no toast)
    return navigateTo(fallback);
  }
});
