<script setup>
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <img :src="props.src || '/avatarPlaceholder.png'" />
</template>
