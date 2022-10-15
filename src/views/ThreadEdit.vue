<script setup>
import { onBeforeMount, ref } from 'vue';
import router from '@/router';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';
import ThreadEditor from '@/components/ThreadEditor.vue';
import { usePostStore, useThreadStore } from '@/stores';
import { findById } from '@/utils';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['ready']);

const { isReady, dataReady } = useAsyncDataStatus();

const threadStore = useThreadStore();
const postStore = usePostStore();
const thread = ref(null);
const text = ref('');

onBeforeMount(async () => {
  const fetchedThread = await threadStore.fetchThread(props.id);
  await postStore.fetchPost(fetchedThread.posts[0]);
  thread.value = threadStore.threadById(props.id);
  text.value = findById(postStore.posts, thread.value.posts[0]).text;
  dataReady();
  emit('ready');
});

const save = ({ title, text }) => {
  threadStore.updateThread({
    title,
    text,
    threadId: props.id,
  });

  router.push({ name: 'threadShow', params: { id: props.id } });
};
const cancel = () => router.push({ name: 'forum' });
</script>

<template>
  <div v-if="isReady" class="col-full push-top">
    <h1>Update thread</h1>

    <ThreadEditor :title="thread.title" :text="text" @save="save" @cancel="cancel" />
  </div>
</template>
