import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSubsribtionsStore = defineStore('subscribtions', () => {
  const unsubscribes = ref([]);

  const appendUnsubscribe = (uns) => unsubscribes.value.push(uns);

  const unsubscribeAllSnapshots = () => {
    unsubscribes.value.forEach((unsubscribe) => unsubscribe());
    unsubscribes.value = [];
  };

  return {
    appendUnsubscribe,
    unsubscribeAllSnapshots,
  };
});
