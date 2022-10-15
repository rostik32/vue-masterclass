<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores';
import router from '@/router';
import { useForm } from 'vee-validate';
import registerSchema from '@/schemas/registerSchema.js';

const emit = defineEmits(['ready']);

emit('ready');

const authStore = useAuthStore();

const { handleSubmit, setFieldValue } = useForm({ validationSchema: registerSchema });

const avatarPreview = ref(null);

const register = handleSubmit(async (values) => {
  await authStore.registerUserWithEmail(values);

  router.push('/');
});

const registerWithGoogle = handleSubmit(async (values) => {
  await authStore.signInWithGoogle(values);

  router.push('/');
});

const handleImageUpload = (event) => {
  const avatarFile = event.target.files[0];
  const MAX_FILE_SIZE = 1024 * 800;

  if (avatarFile.size > MAX_FILE_SIZE) {
    event.target.value = '';
    return;
  }

  setFieldValue('avatar', avatarFile);
  avatarPreview.value = URL.createObjectURL(avatarFile);
};
</script>

<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form action="" class="card card-form" @submit.prevent="register">
        <h1 class="text-center">Register</h1>

        <AppField name="name" label="Full Name" />
        <AppField name="username" label="Username" />
        <AppField name="email" type="email" label="Email" />
        <AppField name="password" type="password" label="Password" />
        <AppFileField
          :preview="avatarPreview"
          name="avatar"
          label="Avatar"
          @change="handleImageUpload"
        />

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </form>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall" @click="registerWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>
