<script setup>
import { useUserStore } from '@/stores';

const props = defineProps({
  threads: {
    require: true,
    type: Array,
    default: () => [],
  },
});

const userStore = useUserStore();

const userById = (userId) => {
  return userStore.user(userId);
};
</script>

<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <template v-if="props.threads.length">
        <div v-for="thread in props.threads" :key="thread.id" class="thread">
          <div v-if="userById(thread.userId)">
            <p>
              <RouterLink :to="{ name: 'threadShow', params: { id: thread.id } }">
                {{ thread.title }}
              </RouterLink>
            </p>
            <p class="text-faded text-xsmall">
              By <a href="profile.html">{{ userById(thread.userId).name }}</a
              >, <AppDate :timestamp="thread.publishedAt" />.
            </p>
          </div>

          <div v-if="userById(thread.userId)" class="activity">
            <p class="replies-count">{{ thread.repliesCount }} reply</p>

            <AppAvatarImg
              class="avatar-medium"
              :src="userById(thread.userId).avatar"
              :alt="userById(thread.userId).name"
            />

            <div>
              <p class="text-xsmall">
                <a href="profile.html">{{ userById(thread.userId).name }}</a>
              </p>
              <p class="text-xsmall text-faded">
                <AppDate :timestamp="thread.publishedAt" />
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-if="!props.threads.length" style="padding: 10px; text-align: center">
      <em>No threads available(</em>
    </div>
  </div>
</template>
