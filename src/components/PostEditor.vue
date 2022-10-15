<script setup>
import postSchema from '@/schemas/postSchema';
import { useForm } from 'vee-validate';

const props = defineProps({
  post: {
    type: Object,
    default: () => ({ text: null }),
  },
});

const emit = defineEmits(['save']);

const { handleSubmit, resetForm } = useForm({
  validationSchema: postSchema,
  initialValues: {
    post: props.post.text,
  },
});

const save = handleSubmit((values) => {
  emit('save', { text: values.post });

  resetForm();
});
</script>

<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <AppTextarea rows="10" name="post" />

      <div class="form-actions">
        <button class="form-button btn-green btn-small">
          {{ post.id ? 'Update post' : 'Submit post' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
