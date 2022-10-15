<script setup>
const props = defineProps({
  forums: {
    type: Array,
    default: () => [],
    required: true,
  },
  title: {
    type: String,
    default: 'Forums',
    required: false,
  },
  categoryId: {
    type: String,
    default: '',
    required: false,
  },
});

const forumThreadsWord = (length) => {
  if (length) {
    return length > 0 ? 'threads' : 'thread';
  } else {
    return 'No threads';
  }
};
</script>

<template>
  <div class="col-full">
    <div class="forum-list">
      <h2 class="list-title">
        <RouterLink
          v-if="props.categoryId"
          :to="{ name: 'category', params: { id: props.categoryId } }"
        >
          {{ title }}
        </RouterLink>
        <span v-else>{{ title }}</span>
      </h2>

      <div v-for="forum in props.forums" :key="forum.id" class="forum-listing">
        <div class="forum-details">
          <RouterLink class="text-xlarge" :to="{ name: 'forum', params: { id: forum.id } }">
            {{ forum.name }}
          </RouterLink>
          <p>{{ forum.description }}</p>
        </div>

        <div class="threads-count">
          <p>
            <span class="count">{{ forum.threads?.length }}</span>
            {{ forumThreadsWord(forum.threads?.length) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
