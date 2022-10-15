<script setup>
const emit = defineEmits(['ready']);
emit('ready');
</script>

<template>
  <div class="col-full text-center">
    <h1>Not Found</h1>
    <RouterLink :to="{ name: 'Home' }"> Read some cool threads </RouterLink>
  </div>
</template>

<style lang="scss" scoped></style>
