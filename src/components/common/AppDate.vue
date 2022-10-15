<script setup>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { computed } from 'vue';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const props = defineProps({
  timestamp: {
    type: [Number, Object],
    default: 0,
  },
});

const normalizedTimestamp = computed(() => props.timestamp?.seconds || props.timestamp);
const diffForHumans = computed(() => dayjs.unix(normalizedTimestamp.value).fromNow());
const humanFriendlyDate = computed(() => dayjs.unix(normalizedTimestamp.value).format('llll'));
</script>

<template>
  <span :title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>
