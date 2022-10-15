import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/config/firebase.js';
import { findById } from '@/utils';
import { fetchItem } from '@/utils/storeUtils';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([]);
  const getCategotyById = computed(() => (id) => findById(categories.value, id));

  async function fetchCategory(id) {
    return fetchItem(categories.value, 'categories', id);
  }

  async function fetchCategories() {
    const docsRef = collection(db, 'categories');
    const docsSnap = await getDocs(docsRef);
    const fetchedCategories = docsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    categories.value = fetchedCategories;

    return fetchedCategories;
  }

  return {
    categories,
    getCategotyById,
    fetchCategories,
    fetchCategory,
  };
});
