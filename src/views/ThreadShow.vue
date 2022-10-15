<script setup>
import { onBeforeMount, computed } from 'vue';

import PostList from '@/components/PostList.vue';
import PostEditor from '@/components/PostEditor.vue';
import { useThreadStore, useUserStore, usePostStore } from '@/stores';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';
import useNotifications from '@/composables/useNotifications';
import { useRoute } from 'vue-router';
import { difference } from 'lodash-es';

const props = defineProps({
  id: {
    require: true,
    type: String,
    default: '',
  },
});

const emit = defineEmits(['ready']);
const route = useRoute();

const { isReady, dataReady } = useAsyncDataStatus();
const { addNotification } = useNotifications();

const threadStore = useThreadStore();
const postStore = usePostStore();
const userStore = useUserStore();

const thread = computed(() => threadStore.threadById(props.id));

onBeforeMount(async () => {
  await threadStore.subscribeOnThread(props.id, async ({ isLocal, item, previousItem }) => {
    if (!isReady.value || isLocal) {
      return;
    }

    const newPosts = difference(item.posts, previousItem.posts);
    await fetchPostsWithUsers(newPosts);

    addNotification({ message: 'Thread has been updated', timer: 3000 });
  });

  await fetchPostsWithUsers(thread.value.posts);
  dataReady();
  emit('ready');
});

const fetchPostsWithUsers = async (ids) => {
  const posts = await postStore.fetchPosts(ids);

  const userIds = posts.map((post) => post.userId);
  await userStore.fetchUsers(userIds);
};

const threadPosts = computed(() => postStore.posts.filter((post) => post.threadId === props.id));

const addPost = (eventData) => {
  const post = {
    ...eventData,
    threadId: props.id,
  };

  postStore.createPost(post);
};
</script>

<template>
  <div v-if="isReady" class="col-large push-top">
    <h1>
      {{ thread?.title }}
      <RouterLink
        v-if="thread.userId === userStore.authId"
        v-slot="{ navigate }"
        :to="{ name: 'threadEdit', params: { id: props.id } }"
      >
        <button class="btn-small btn-green" @click="navigate">Edit Thread</button>
      </RouterLink>
    </h1>

    <p>
      By <a href="#" class="link-unstyled">{{ thread?.author?.name }}</a
      >, <AppDate :timestamp="thread?.publishedAt" />.
      <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small">
        {{ thread?.repliesCount }} replies by {{ thread?.contributorsCount }} contributors
      </span>
    </p>

    <PostList :posts="threadPosts" />

    <PostEditor v-if="userStore.authId" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px">
      <span>
        <RouterLink :to="{ name: 'signIn', query: { redirectTo: route.path } }">
          Sign in
        </RouterLink>
        or
        <RouterLink :to="{ name: 'register', query: { redirectTo: route.path } }">
          Register
        </RouterLink>
        to reply
      </span>
    </div>
  </div>
</template>
