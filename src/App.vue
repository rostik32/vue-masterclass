<script setup>
import { onBeforeMount, ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import TheNavbar from './components/TheNavbar.vue';
import { useUserStore } from './stores';
import NProgress from 'nprogress/nprogress.js';
import router from './router';

NProgress.configure({
  speed: 300,
  showSpinner: false,
});

const route = useRoute();

const userStore = useUserStore();

const showPage = ref(false);

onBeforeMount(async () => {
  await userStore.fetchAuthUser();
});

const onPageReady = () => {
  showPage.value = true;
  NProgress.done();
};

router.beforeEach(() => {
  NProgress.start();
});
</script>

<template>
  <TheNavbar />

  <div class="container">
    <RouterView
      v-show="showPage"
      :key="`${route.path}${JSON.stringify(route.query)}`"
      @ready="onPageReady"
    />
    <AppSpinner v-show="!showPage" />
  </div>

  <AppNotifications />
</template>

<style>
@import './assets/style.css';
@import '~/nprogress/nprogress.css';

#nprogress .bar {
  background-color: #57ad8d;
}
</style>
