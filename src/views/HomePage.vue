<script setup>
import CategoryList from '@/components/CategoryList.vue';
import { onBeforeMount } from 'vue';
import { useCategoryStore, useForumStore } from '@/stores';
import { useAsyncDataStatus } from '@/composables/asyncDataStatus';

const emit = defineEmits(['ready']);

const categoryStore = useCategoryStore();
const forumStore = useForumStore();

const { isReady, dataReady } = useAsyncDataStatus();

onBeforeMount(async () => {
  const categories = await categoryStore.fetchCategories();
  const forumsIds = categories.map((category) => category.forums).flat();
  await forumStore.fetchForums(forumsIds);
  dataReady();
  emit('ready');
});
</script>

<template>
  <div v-if="isReady" class="container">
    <h1 class="push-top">Welcome to the Forum</h1>
    <CategoryList :categories="categoryStore.categories" />
  </div>
</template>
