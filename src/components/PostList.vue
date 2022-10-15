<script setup>
import PostEditor from './PostEditor.vue';
import { useUserStore, usePostStore } from '@/stores';
import { ref } from 'vue';

const props = defineProps({
  posts: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const userStore = useUserStore();
const postStore = usePostStore();

const editing = ref(null);

const toggleEdit = (id) => {
  editing.value = id === editing.value ? null : id;
};

const updatePost = async (post) => {
  await postStore.updatePost(post);
  editing.value = null;
};

const userById = (userId) => {
  return userStore.user(userId);
};
</script>

<template>
  <div class="post-list">
    <div v-for="post in props.posts" :key="post.id" class="post">
      <div class="user-info">
        <a href="#" class="user-name">
          {{ userById(post.userId).name }}
        </a>

        <a href="#">
          <AppAvatarImg
            class="avatar-large"
            :src="userById(post.userId).avatar"
            :alt="userById(post.userId).name"
          />
        </a>

        <p class="desktop-only text-small">{{ userById(post.userId).postsCount }} posts</p>

        <p class="desktop-only text-small">{{ userById(post.userId).threadsCount }} threads</p>

        <span class="online desktop-only">online</span>
      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor v-if="editing === post.id" :post="post" @save="updatePost" />
          <p v-else>
            {{ post.text }}
          </p>
        </div>

        <button
          v-if="post.userId === userStore.authId"
          style="margin-left: auto; padding-left: 5px; align-self: flex-start"
          class="link-unstyled"
          title="Make a change"
          @click="toggleEdit(post.id)"
        >
          <FaIcon icon="fa-pencil" />
        </button>
      </div>

      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="editing-info">edited</div>
        <AppDate :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>
