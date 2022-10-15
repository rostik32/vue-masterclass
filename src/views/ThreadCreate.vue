<script setup>
import router from '@/router';
import ThreadEditor from '@/components/ThreadEditor.vue';
import { onBeforeMount, ref } from 'vue';
import { useForumStore, useThreadStore } from '@/stores';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';
import { onBeforeRouteLeave } from 'vue-router';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['ready']);

const { isReady, dataReady } = useAsyncDataStatus();

const forumStore = useForumStore();
const threadStore = useThreadStore();
const forum = ref(null);
const formIsDirty = ref(false);

onBeforeRouteLeave(() => {
  if (formIsDirty.value) {
    const confirmed = confirm('Are you sure you want to leave? Unsaved changes will be lost!');

    if (!confirmed) {
      return false;
    }
  }
});

onBeforeMount(async () => {
  forum.value = await forumStore.fetchForum(props.id);
  dataReady();
  emit('ready');
});

const save = async ({ text, title }) => {
  const createdThread = await threadStore.createThread({
    title,
    text,
    forumId: props.id,
  });

  router.push({ name: 'threadShow', params: { id: createdThread.id } });
};

const cancel = () => router.push({ name: 'forum' });
</script>

<template>
  <div v-if="isReady" class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor
      @save="save"
      @cancel="cancel"
      @dirty="formIsDirty = true"
      @clean="formIsDirty = false"
    />
  </div>
</template>
