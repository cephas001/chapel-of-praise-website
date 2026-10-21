<template>
  <div>
    <label :for="id" class="mb-1.5 block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="optional" class="font-normal text-muted">(optional)</span>
      <template v-if="required">
        <span class="sr-only">(required)</span>
        <span aria-hidden="true" class="text-brand-600">*</span>
      </template>
    </label>

    <div v-if="as === 'select'" class="relative">
      <select
        :id="id"
        v-model="model"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :class="controlClass"
        v-bind="$attrs"
      >
        <slot />
      </select>
      <Icon
        name="heroicons:chevron-down"
        class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
    </div>

    <textarea
      v-else-if="as === 'textarea'"
      :id="id"
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      :class="controlClass"
      v-bind="$attrs"
    />

    <div v-else class="relative">
      <input
        :id="id"
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :class="controlClass"
        v-bind="$attrs"
      />
      <span
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <slot name="suffix" />
      </span>
    </div>

    <p v-if="error" :id="errorId" class="mt-1.5 text-sm text-brand-700">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="mt-1.5 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed, useSlots } from "vue";

defineOptions({ inheritAttrs: false });

const slots = useSlots();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  as: {
    type: String,
    default: "input",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  autocomplete: {
    type: String,
    default: undefined,
  },
  maxlength: {
    type: [String, Number],
    default: undefined,
  },
  rows: {
    type: [String, Number],
    default: 5,
  },
  required: {
    type: Boolean,
    default: false,
  },
  optional: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  hint: {
    type: String,
    default: "",
  },
});

const model = defineModel({ default: "" });

const errorId = computed(() => `${props.id}-error`);
const hintId = computed(() => `${props.id}-hint`);

const describedBy = computed(() => {
  if (props.error) return errorId.value;
  if (props.hint) return hintId.value;
  return undefined;
});

const controlClass = computed(() => [
  "w-full rounded-xl border bg-surface px-4 py-3 text-base text-gray-900 transition-colors placeholder:text-gray-400 focus:outline-none focus:bg-paper focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
  props.as === "select" ? "appearance-none pr-10" : "",
  props.as === "input" && slots.suffix ? "pr-14" : "",
  props.error
    ? "border-brand-600 focus:border-brand-600 focus:ring-brand-600/15"
    : "border-line focus:border-ink focus:ring-ink/10",
]);
</script>
