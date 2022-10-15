<script setup>
import { useForumStore } from '@/stores';
import ForumList from './ForumList.vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const forumStore = useForumStore();

const getForumsForCategory = (category) => {
  return forumStore.forums.filter((forum) => forum.categoryId === category.id);
};
</script>

<template>
  <template v-if="forumStore.forums">
    <ForumList
      v-for="category in props.categories"
      :key="category.id"
      :forums="getForumsForCategory(category)"
      :title="category.name"
      :category-id="category.id"
    />
  </template>
</template>
