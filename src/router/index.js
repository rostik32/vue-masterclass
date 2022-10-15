import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/views/HomePage.vue';
import NotFound from '@/views/NotFound.vue';
import { useUserStore, useAuthStore, useThreadStore, useSubsribtionsStore } from '@/stores';
import { findById } from '@/utils';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/thread/:id',
      name: 'threadShow',
      props: true,
      component: () => import('@/views/ThreadShow.vue'),
      async beforeEnter(to) {
        const threadStore = useThreadStore();
        await threadStore.fetchThread(to.params.id);

        const threadExists = findById(threadStore.threads, to.params.id);

        if (threadExists) {
          return;
        } else {
          return {
            name: 'NotFound',
            params: { pathMatch: to.path.substring(1).split('/') },
            query: to.query,
            hash: to.hash,
          };
        }
      },
    },
    {
      path: '/forum/:id',
      name: 'forum',
      props: true,
      component: () => import('@/views/ForumPage.vue'),
    },
    {
      path: '/forum/:id/thread/create',
      name: 'threadCreate',
      component: () => import('@/views/ThreadCreate.vue'),
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/thread/:id/edit',
      name: 'threadEdit',
      component: () => import('@/views/ThreadEdit.vue'),
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/category/:id',
      name: 'category',
      props: true,
      component: () => import('@/views/CategoryPage.vue'),
    },
    {
      path: '/me',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue'),
      meta: {
        toTop: true,
        scrollSmooth: true,
        requiresAuth: true,
      },
    },
    {
      path: '/me/edit',
      name: 'profileEdit',
      component: () => import('@/views/ProfilePage.vue'),
      props: { edit: true },
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterPage.vue'),
      meta: {
        requiresGuest: true,
      },
    },
    {
      path: '/sign-in',
      name: 'signIn',
      component: () => import('@/views/SignIn.vue'),
      meta: {
        requiresGuest: true,
      },
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],

  scrollBehavior(to) {
    const scroll = {};

    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.scrollSmooth) scroll.behavior = 'smooth';

    return scroll;
  },
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  useSubsribtionsStore().unsubscribeAllSnapshots();

  await authStore.initAuthentication();

  if (to.meta.requiresAuth && !userStore.authId)
    return { name: 'signIn', query: { redirectTo: to.path } };

  if (to.meta.requiresGuest && userStore.authId) return { name: 'Home' };
});

export default router;
