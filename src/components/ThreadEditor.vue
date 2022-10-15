<script setup>
import { useForm } from 'vee-validate';
import { computed, watch } from 'vue';
import threadSchema from '@/schemas/threadSchema.js';

const emit = defineEmits(['save', 'cancel', 'dirty', 'clean']);

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
});

const { handleSubmit, values } = useForm({
  validationSchema: threadSchema,
  initialValues: { title: props.title, text: props.text },
});
const isTitleExisting = computed(() => !!props.title);

watch(
  values,
  () => {
    if (values.title !== values.title || values.text !== props.text) {
      emit('dirty');
    } else {
      emit('clean');
    }
  },
  { deep: true }
);

const save = handleSubmit((form) => {
  emit('clean');
  emit('save', form);
});
</script>

<template>
  <form @submit.prevent="save">
    <AppField name="title" label="title" />
    <AppTextarea label="Content" name="text" rows="8" />

    <div class="btn-group">
      <button class="btn btn-ghost" type="button" @click="emit('cancel')">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ isTitleExisting ? 'Update' : 'Publish' }}
      </button>
    </div>
  </form>
</template>
