// composables/useCursorPagination.js
import { ref } from "vue";

/**
 * "Load more" pagination backed by an API cursor (see GET /admin/auth/users).
 *
 * @param {Object} options
 * @param {(params: { cursor?: string }) => Promise<{ items: Array, nextCursor: string|null, hasMore: boolean }>} options.fetcher
 * @param {(raw: any) => any} [options.mapItem]
 */
export function useCursorPagination({ fetcher, mapItem = (item) => item }) {
  const items = ref([]);
  const isFetching = ref(true);
  const isLoadingMore = ref(false);
  const hasMore = ref(false);
  const nextCursor = ref(null);

  const applyPage = (response) => {
    items.value.push(...(response?.items || []).map(mapItem));
    nextCursor.value = response?.nextCursor || null;
    hasMore.value = Boolean(response?.hasMore);
  };

  const load = async () => {
    isFetching.value = true;
    try {
      items.value = [];
      applyPage(await fetcher({}));
    } finally {
      isFetching.value = false;
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || isLoadingMore.value || !nextCursor.value) return;
    isLoadingMore.value = true;
    try {
      applyPage(await fetcher({ cursor: nextCursor.value }));
    } finally {
      isLoadingMore.value = false;
    }
  };

  const prepend = (item) => items.value.unshift(item);
  const removeWhere = (predicate) => {
    items.value = items.value.filter((item) => !predicate(item));
  };
  const updateWhere = (predicate, patch) => {
    const index = items.value.findIndex(predicate);
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...patch };
    }
  };

  return {
    items,
    isFetching,
    isLoadingMore,
    hasMore,
    nextCursor,
    load,
    loadMore,
    prepend,
    removeWhere,
    updateWhere,
  };
}
