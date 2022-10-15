<script setup>
import { toRef } from 'vue';
import { useField } from 'vee-validate';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },

  name: {
    type: String,
    required: true,
  },

  accept: {
    type: String,
    default: 'image/*',
  },

  preview: {
    type: String,
    default: '',
  },
});

const { errorMessage, handleChange } = useField(toRef(props, 'name'));
</script>

<template>
  <div class="form-group">
    <label v-if="props.label" :for="props.label">{{ props.label }}</label>

    <input
      v-show="!props.preview"
      :id="props.label"
      :name="props.name"
      :accept="props.accept"
      type="file"
      class="form-input"
      @change="handleChange"
    />

    <div v-if="props.preview">
      <img :src="preview" class="avatar-xlarge" />
    </div>

    <span v-if="errorMessage" class="form-error">{{ errorMessage }}</span>
  </div>
</template>

<style></style>
