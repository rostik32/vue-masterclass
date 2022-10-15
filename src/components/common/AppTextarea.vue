<script setup>
import { toRef, useAttrs, watch } from 'vue';
import { useField } from 'vee-validate';

const props = defineProps({
  modelValue: {
    type: undefined,
    default: undefined,
  },

  label: {
    type: String,
    default: '',
  },

  name: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const attrs = useAttrs();

const { value, setValue, errorMessage } = useField(toRef(props, 'name'));

watch(
  () => value.value,
  (newValue) => {
    emit('update:modelValue', newValue);
  }
);

watch(
  () => props.modelValue,
  (newValue) => {
    setValue(newValue);
  }
);
</script>

<template>
  <div class="form-group">
    <label v-if="props.label" :for="props.label">{{ props.label }}</label>

    <textarea
      :id="props.label"
      v-model="value"
      class="form-input"
      v-bind="attrs"
      :name="props.name"
    />
    <span v-if="errorMessage" class="form-error">{{ errorMessage }}</span>
  </div>
</template>

<style></style>
