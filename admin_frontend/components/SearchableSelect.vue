<!-- components/ui/SearchableSelect.vue -->
<template>
  <div ref="selectContainer" class="relative">
    <!-- Input Field (combobox pattern) -->
    <div class="relative">
      <input
        :id="inputId"
        v-model="searchQuery"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="listboxId"
        :aria-activedescendant="activeOptionId"
        :placeholder="placeholder"
        class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-black focus:bg-white focus:border-black transition-all outline-none text-xs md:text-sm cursor-text"
        @focus="openDropdown"
        @keydown.down.prevent="moveActive(1)"
        @keydown.up.prevent="moveActive(-1)"
        @keydown.enter.prevent="commitActive"
        @keydown.esc.stop="closeDropdown"
        @keydown.tab="closeDropdown"
      >
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <Icon name="heroicons:chevron-up-down" class="h-4 w-4 text-gray-500" />
      </div>
    </div>

    <!-- Dropdown Menu (listbox) -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
    >
      <ul :id="listboxId" role="listbox" :aria-label="placeholder" class="py-1">
        <li
          v-if="filteredOptions.length === 0"
          class="px-4 py-3 text-xs md:text-sm text-gray-500 italic text-center"
          role="presentation"
        >
          No results found.
        </li>
        <li
          v-for="(option, index) in filteredOptions"
          v-else
          :id="optionElementId(option)"
          :key="option[valueKey]"
          role="option"
          tabindex="-1"
          :aria-selected="modelValue === option[valueKey] ? 'true' : 'false'"
          class="px-4 py-2.5 text-xs md:text-sm text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
          :class="{
            'bg-gray-50 font-bold': modelValue === option[valueKey],
            'bg-gray-100': index === activeIndex,
          }"
          @click="selectOption(option)"
          @keydown.enter.prevent="selectOption(option)"
          @mousemove="activeIndex = index"
        >
          <!-- We use a slot so you can pass custom formatting (like the complex event date format) -->
          <slot name="option" :option="option">
            {{ option[displayKey] }}
          </slot>
        </li>
      </ul>
    </div>

    <!-- Invisible overlay to handle outside clicks cleanly without extra libraries -->
    <div v-if="isOpen" class="fixed inset-0 z-40" aria-hidden="true" @click="closeDropdown"/>
  </div>
</template>

<script setup>
import { ref, computed, watch, useId } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  options: { type: Array, required: true },
  placeholder: { type: String, default: "Search and select..." },
  displayKey: { type: String, default: "name" }, // What to type/search by default
  valueKey: { type: String, default: "id" }, // What is actually emitted (the ID)
  inputId: { type: String, default: undefined }, // Optional id for label association
});

const emit = defineEmits(["update:modelValue", "change"]);

const listboxId = useId();
const isOpen = ref(false);
const searchQuery = ref("");
const activeIndex = ref(-1);

// Find the initially selected item to display its text
const setInitialQuery = () => {
  if (props.modelValue) {
    const selected = props.options.find(
      (opt) => opt[props.valueKey] === props.modelValue,
    );
    if (selected) searchQuery.value = selected[props.displayKey];
  }
};

watch(() => props.modelValue, setInitialQuery, { immediate: true });
watch(() => props.options, setInitialQuery);

// Reset the highlighted option whenever the filter text changes
watch(searchQuery, () => {
  activeIndex.value = -1;
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const lowerQuery = searchQuery.value.toLowerCase();
  return props.options.filter((opt) =>
    String(opt[props.displayKey]).toLowerCase().includes(lowerQuery),
  );
});

const optionElementId = (option) =>
  `${listboxId}-option-${String(option[props.valueKey]).replace(/[^\w-]+/g, "-")}`;

const activeOptionId = computed(() => {
  const option = filteredOptions.value[activeIndex.value];
  return option ? optionElementId(option) : undefined;
});

const openDropdown = () => {
  searchQuery.value = ""; // Clear to allow searching all
  activeIndex.value = -1;
  isOpen.value = true;
};

const closeDropdown = () => {
  isOpen.value = false;
  activeIndex.value = -1;
  setInitialQuery(); // Reset to selected value's text if they didn't pick anything
};

const selectOption = (option) => {
  searchQuery.value = option[props.displayKey];
  emit("update:modelValue", option[props.valueKey]);
  emit("change", option);
  isOpen.value = false;
  activeIndex.value = -1;
};

// Keyboard navigation helpers
const moveActive = (delta) => {
  if (!isOpen.value) openDropdown();

  const count = filteredOptions.value.length;
  if (count === 0) {
    activeIndex.value = -1;
    return;
  }

  const next = activeIndex.value + delta;
  if (next < 0) activeIndex.value = count - 1;
  else if (next >= count) activeIndex.value = 0;
  else activeIndex.value = next;
};

const commitActive = () => {
  if (!isOpen.value) {
    openDropdown();
    return;
  }

  const option = filteredOptions.value[activeIndex.value];
  if (option) selectOption(option);
};
</script>
