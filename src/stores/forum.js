import { fetchItems, fetchItem } from '@/utils/storeUtils.js';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useForumStore = defineStore('forum', () => {
  const forums = ref([]);

  async function fetchForum(id) {
    return fetchItem(forums.value, 'forums', id);
  }

  async function fetchForums(ids) {
    return fetchItems(forums.value, 'forums', ids);
  }

  return {
    forums,
    fetchForums,
    fetchForum,
  };
});
