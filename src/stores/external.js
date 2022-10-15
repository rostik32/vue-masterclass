import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useExternalStore = defineStore('external', () => {
  const countries = ref([]);

  const getAllCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    countries.value = await response.json();
  };

  return {
    countries,
    getAllCountries,
  };
});
