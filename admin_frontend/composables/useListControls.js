// composables/useListControls.js
import { computed, ref, unref, watch } from "vue";

// Supports dotted paths like "eventDetails.service"
const accessPath = (item, path) =>
  path
    .split(".")
    .reduce((value, key) => (value == null ? value : value[key]), item);

/**
 * Client-side search / filter / sort / pagination for list pages that
 * receive the full collection from their API.
 *
 * @param {import("vue").Ref<Array>|Array} source - the list to control
 * @param {Object} options
 * @param {string[]} options.searchFields - item paths searched by the search box
 * @param {(item: any, filters: Object) => boolean} [options.filter] - filter predicate
 * @param {Object} [options.defaultFilters] - initial filter values
 * @param {Object<string, (a: any, b: any) => number>} [options.sorters] - comparators, ascending
 * @param {string} [options.defaultSort] - sorter key applied on load
 * @param {"asc"|"desc"} [options.defaultDirection]
 * @param {number} [options.pageSize]
 */
export function useListControls(source, options = {}) {
  const {
    searchFields = [],
    filter = null,
    defaultFilters = {},
    sorters = {},
    defaultSort = "",
    defaultDirection = "desc",
    pageSize = 10,
  } = options;

  const search = ref("");
  const filters = ref({ ...defaultFilters });
  const sortKey = ref(defaultSort);
  const sortDirection = ref(defaultDirection);
  const page = ref(1);

  const normalize = (value) => String(value ?? "").toLowerCase();

  const filtered = computed(() => {
    let items = [...(unref(source) || [])];

    const term = normalize(search.value).trim();
    if (term && searchFields.length) {
      items = items.filter((item) =>
        searchFields.some((field) =>
          normalize(accessPath(item, field)).includes(term),
        ),
      );
    }

    if (filter) {
      items = items.filter((item) => filter(item, filters.value));
    }

    const comparator = sorters[sortKey.value];
    if (comparator) {
      const direction = sortDirection.value === "asc" ? 1 : -1;
      items.sort((a, b) => direction * comparator(a, b));
    }

    return items;
  });

  const total = computed(() => filtered.value.length);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(total.value / pageSize)),
  );
  const paged = computed(() => {
    const start = (page.value - 1) * pageSize;
    return filtered.value.slice(start, start + pageSize);
  });

  const setPage = (next) => {
    page.value = Math.min(Math.max(1, next), totalPages.value);
  };

  const reset = () => {
    search.value = "";
    filters.value = { ...defaultFilters };
  };

  // Return to the first page whenever the criteria change
  watch([search, filters, sortKey, sortDirection], () => setPage(1), {
    deep: true,
  });
  // And clamp when filtering shrinks the result set below the current page
  watch(totalPages, (max) => {
    if (page.value > max) page.value = max;
  });

  return {
    search,
    filters,
    sortKey,
    sortDirection,
    page,
    pageSize,
    filtered,
    paged,
    total,
    totalPages,
    setPage,
    nextPage: () => setPage(page.value + 1),
    prevPage: () => setPage(page.value - 1),
    reset,
  };
}
