<script setup>
import router from '@/router';
import { useAuthStore, useUserStore } from '@/stores';
import { ref } from 'vue';

const userStore = useUserStore();
const authStore = useAuthStore();

const isNavbarOpened = ref(false);
const isDropdownOpened = ref(false);

router.beforeEach(() => {
  isNavbarOpened.value = false;
});
</script>

<template>
  <header
    id="header"
    v-page-scroll="() => (isNavbarOpened = false)"
    v-click-outside="() => (isNavbarOpened = false)"
    class="header"
  >
    <RouterLink :to="{ name: 'Home' }" class="logo">
      <img src="@/assets/svg/vueschool-logo.svg" />
    </RouterLink>

    <div class="btn-hamburger" @click="isNavbarOpened = !isNavbarOpened">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{ 'navbar-open': isNavbarOpened }">
      <ul>
        <li v-if="userStore.authUser" class="navbar-user">
          <a
            v-click-outside="() => (isDropdownOpened = false)"
            @click.prevent="isDropdownOpened = !isDropdownOpened"
          >
            <AppAvatarImg
              :src="userStore.authUser.avatar"
              class="avatar-small"
              :alt="`${userStore.authUser.name} profile avatar`"
            />
            <span>
              {{ userStore.authUser.name }}
              <img class="icon-profile" src="@/assets/svg/arrow-profile.svg" />
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{ 'active-drop': isDropdownOpened }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <RouterLink :to="{ name: 'profile' }">View profile</RouterLink>
              </li>

              <li class="dropdown-menu-item">
                <a @click.prevent="authStore.signOut(), router.push({ name: 'Home' })">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>

        <li v-if="!userStore.authUser" class="navbar-item">
          <RouterLink :to="{ name: 'signIn' }">Sign in</RouterLink>
        </li>
        <li v-if="!userStore.authUser" class="navbar-item">
          <RouterLink :to="{ name: 'register' }">Register</RouterLink>
        </li>

        <li v-if="userStore.authUser" class="navbar-mobile-item">
          <RouterLink :to="{ name: 'profile' }">View profile</RouterLink>
        </li>
        <li v-if="userStore.authUser" class="navbar-mobile-item">
          <a @click.prevent="authStore.signOut(), router.push({ name: 'Home' })">Sign Out</a>
        </li>
      </ul>

      <!-- <ul>
        <li class="navbar-item">
          <a href="index.html">Home</a>
        </li>
        <li class="navbar-item">
          <a href="category.html">Category</a>
        </li>
        <li class="navbar-item">
          <a href="forum.html">Forum</a>
        </li>
        <li class="navbar-item">
          <a href="thread.html">Thread</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="profile.html">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="#">Logout</a>
        </li>
      </ul> -->
    </nav>
  </header>
</template>
