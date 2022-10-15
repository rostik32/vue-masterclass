<script setup>
import PostList from '@/components/PostList.vue';
import UserProfileCard from '@/components/UserProfileCard.vue';
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue';
import { usePostStore, useUserStore } from '@/stores';
import { onBeforeMount } from 'vue';

const props = defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['ready']);

const userStore = useUserStore();
const postStore = usePostStore();

const fetchAuthUserPosts = async () => {
  await postStore.fetchAuthUserPosts();
};

onBeforeMount(async () => {
  await fetchAuthUserPosts();
  emit('ready');
});
</script>

<template>
  <div v-if="userStore.authUser" class="flex-grid">
    <div class="col-3 push-top">
      <UserProfileCard v-if="!props.edit" :user="userStore.authUser" />
      <UserProfileCardEditor v-else :user="userStore.authUser" />
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> {{ userStore.authUser.name }} recent activity </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />

      <PostList :posts="userStore.authUser.posts" />
      <AppInfinityScroll
        :done="userStore.authUser.postsCount === userStore.authUser.posts.length"
        @load="fetchAuthUserPosts"
      />
    </div>
  </div>
</template>
