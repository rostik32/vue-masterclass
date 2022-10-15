import { ref } from 'vue';

export function useAsyncDataStatus() {
  const isReady = ref(false);

  function dataReady() {
    isReady.value = true;
  }

  return {
    isReady,
    dataReady,
  };
}
