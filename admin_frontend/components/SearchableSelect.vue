<!-- components/ui/SearchableSelect.vue -->
<template>
  <div class="relative font-montserrat" ref="selectContainer">
    <!-- Input Field -->
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        @focus="openDropdown"
        :placeholder="placeholder"
        class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 focus:border-black outline-none rounded-xl sm:text-sm transition-colors text-black font-semibold bg-white cursor-text"
      />
      <div
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <Icon name="heroicons:chevron-up-down" class="h-4 w-4 text-gray-400" />
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto"
    >
      <ul class="py-1">
        <li
          v-if="filteredOptions.length === 0"
          class="px-4 py-3 text-sm text-gray-500 italic text-center"
        >
          No results found.
        </li>
        <li
          v-else
          v-for="option in filteredOptions"
          :key="option[valueKey]"
          @click="selectOption(option)"
          class="px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
          :class="{ 'bg-gray-50 font-bold': modelValue === option[valueKey] }"
        >
          <!-- We use a slot so you can pass custom formatting (like the complex event date format) -->
          <slot name="option" :option="option">
            {{ option[displayKey] }}
          </slot>
        </li>
      </ul>
    </div>

    <!-- Invisible overlay to handle outside clicks cleanly without extra libraries -->
    <div v-if="isOpen" @click="closeDropdown" class="fixed inset-0 z-40"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  options: { type: Array, required: true },
  placeholder: { type: String, default: "Search and select..." },
  displayKey: { type: String, default: "name" }, // What to type/search by default
  valueKey: { type: String, default: "id" }, // What is actually emitted (the ID)
});

const emit = defineEmits(["update:modelValue", "change"]);

const isOpen = ref(false);
const searchQuery = ref("");

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

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const lowerQuery = searchQuery.value.toLowerCase();
  return props.options.filter((opt) =>
    String(opt[props.displayKey]).toLowerCase().includes(lowerQuery),
  );
});

const openDropdown = () => {
  searchQuery.value = ""; // Clear to allow searching all
  isOpen.value = true;
};

const closeDropdown = () => {
  isOpen.value = false;
  setInitialQuery(); // Reset to selected value's text if they didn't pick anything
};

const selectOption = (option) => {
  searchQuery.value = option[props.displayKey];
  emit("update:modelValue", option[props.valueKey]);
  emit("change", option);
  isOpen.value = false;
};
</script>
