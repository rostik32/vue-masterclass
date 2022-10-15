<script setup>
import { useRoute } from 'vue-router';
import router from '@/router';
import { useAuthStore } from '@/stores';
import { useForm } from 'vee-validate';
import loginShema from '@/schemas/loginSchema.js';

const emit = defineEmits(['ready']);
emit('ready');

const authStore = useAuthStore();
const { handleSubmit } = useForm({ validationSchema: loginShema });

const route = useRoute();

const signInWithEmail = handleSubmit(async (event) => {
  try {
    await authStore.signInWithEmail(event);
    successRedirect();
  } catch (error) {
    alert(error.message);
  }
});

const signInWithGoogle = async () => {
  try {
    await authStore.signInWithGoogle();
    successRedirect();
  } catch (error) {
    alert(error.message);
  }
};

const successRedirect = async () => {
  const redirectTo = route.query.redirectTo || { name: 'Home' };

  router.push(redirectTo);
};
</script>

<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form class="card card-form" @submit="signInWithEmail">
        <h1 class="text-center">Login</h1>

        <AppField name="email" label="Email" />
        <AppField name="password" label="Password" type="password" />

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <RouterLink :to="{ name: 'register' }">Create an account?</RouterLink>
        </div>
      </form>

      <div class="push-top text-center">
        <button class="btn-red btn-xsmall" @click="signInWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>
