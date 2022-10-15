<script setup>
import { useField } from 'vee-validate';
import { watch, toRef } from 'vue';

const props = defineProps({
  modelValue: {
    type: undefined,
    default: undefined,
  },

  type: {
    type: String,
    default: 'text',
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

    <input
      :id="props.label"
      v-model="value"
      :name="props.name"
      :type="props.type"
      class="form-input"
    />

    <span v-if="errorMessage" class="form-error">{{ errorMessage }}</span>
  </div>
</template>

<style></style>
