<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useForumStore, useThreadStore, useUserStore } from '@/stores';
import ThreadList from '@/components/ThreadList.vue';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';
import { useRoute } from 'vue-router';
import router from '@/router';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['ready']);

const route = useRoute();

const { isReady, dataReady } = useAsyncDataStatus();

const threadStore = useThreadStore();
const forumStore = useForumStore();
const userStore = useUserStore();

const forum = ref(null);
const threads = ref(null);
const page = ref(parseInt(route.query.page) || 1);
const perPage = 2;

const threadsCount = computed(() => forum.value.threads?.length);
const totalPages = computed(() => {
  if (!threadsCount.value) return 0;

  return Math.ceil(threadsCount.value / perPage);
});

onBeforeMount(async () => {
  forum.value = await forumStore.fetchForum(props.id);
  await threadStore.fetchPaginationThreads(forum.value.threads, page.value, perPage);

  threads.value = threadStore.threads.map((thread) => thread.id).map(threadStore.threadById);
  await userStore.fetchUsers(threads.value.map((thread) => thread.userId));

  dataReady();
  emit('ready');
});

watch(page, (page) => {
  router.push({ query: { page } });
});
</script>

<template>
  <div v-if="isReady" class="col-full">
    <div v-if="forum" class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{ forum.name }}</h1>
          <p class="text-lead">{{ forum.description }}</p>
        </div>
        <RouterLink
          :to="{ name: 'threadCreate', params: { id: props.id } }"
          class="btn-green btn-small"
        >
          Start a thread
        </RouterLink>
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList :threads="threads" />

      <VPagination v-model="page" :pages="totalPages" active-color="#57AD8D" />
    </div>
  </div>
</template>
