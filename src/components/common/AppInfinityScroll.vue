<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  done: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['load']);

const el = ref(null);
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) emit('load');
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.9,
    }
  );

  observer.observe(el.value);
});

onBeforeUnmount(() => {
  observer.unobserve(el.value);
});

watch(
  () => props.done,
  () => {
    if (props.done) observer.unobserve(el.value);
  }
);
</script>

<template>
  <div ref="el" class="intersection-observer"></div>
</template>

<style>
.intersection-observer {
  position: relative;
  z-index: -1;
  pointer-events: none;
  bottom: 200px;
}
</style>
