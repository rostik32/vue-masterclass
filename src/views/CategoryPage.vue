<script setup>
import ForumList from '@/components/ForumList.vue';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';
import { useCategoryStore, useForumStore } from '@/stores';
import { onBeforeMount } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['ready']);

const { isReady, dataReady } = useAsyncDataStatus();

const categoryStore = useCategoryStore();
const forumStore = useForumStore();

onBeforeMount(async () => {
  const category = await categoryStore.fetchCategory(props.id);

  await forumStore.fetchForums(category.forums);
  dataReady();
  emit('ready');
});

const getForumsForCategory = () => {
  return forumStore.forums.filter((forum) => forum.categoryId === props.id);
};
</script>

<template>
  <div v-if="isReady" class="container push-top col-full">
    <h1>{{ categoryStore.getCategotyById(props.id).name }}</h1>

    <ForumList
      v-if="categoryStore.getCategotyById(props.id)"
      :forums="getForumsForCategory()"
      :title="categoryStore.getCategotyById(props.id).name"
    />
  </div>
</template>
