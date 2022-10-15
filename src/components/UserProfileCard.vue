<script setup>
const props = defineProps({
  user: {
    type: Object,
    default: () => {},
  },
});
</script>

<template>
  <div class="profile-card">
    <p class="text-center">
      <AppAvatarImg :src="props.user.avatar" class="avatar-xlarge" />
    </p>

    <h1 class="title">{{ props.user.username }}</h1>

    <p class="text-lead">{{ props.user.name }}</p>

    <p class="text-justify">
      {{ props.user.bio || 'No bio specified.' }}
    </p>

    <span class="online">{{ props.user.username }} is online</span>

    <div class="stats">
      <span>{{ props.user.postsCount }} posts</span>
      <span>{{ props.user.threadsCount }} threads</span>
    </div>

    <hr />

    <p v-if="props.user.website" class="text-large text-center">
      <i class="fa fa-globe"></i>
      <a :href="props.user.website">{{ props.user.website }}</a>
    </p>
  </div>

  <p class="text-xsmall text-faded text-center">Member since june 2003, last visited 4 hours ago</p>

  <div class="text-center">
    <hr />
    <RouterLink :to="{ name: 'profileEdit' }" class="btn-green btn-small">
      Edit Profile
    </RouterLink>
  </div>
</template>
