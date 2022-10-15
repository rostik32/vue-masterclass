import { findById, upsert } from '@/utils';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usePostStore, useUserStore, useSubsribtionsStore } from '@/stores';

import { fetchItems, fetchItem, makeAppendChildToParent } from '@/utils/storeUtils.js';
import {
  writeBatch,
  doc,
  collection,
  arrayUnion,
  serverTimestamp,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { chunk } from 'lodash-es';

export const useThreadStore = defineStore('thread', () => {
  const userStore = useUserStore();
  const postStore = usePostStore();

  const threads = ref([]);
  const threadById = computed(() => (id) => {
    const thread = findById(threads.value, id);

    return {
      ...thread,
      author: findById(userStore.users, thread.userId),
      get repliesCount() {
        return thread.posts.length - 1;
      },
      get contributorsCount() {
        return thread.contributors?.length;
      },
    };
  });

  async function updateThread({ title, text, threadId }) {
    let thread = findById(threads.value, threadId);
    let post = findById(postStore.posts, thread.posts[0]);

    const batch = writeBatch(db);
    const threadRef = doc(db, 'threads', threadId);
    const postRef = doc(db, 'posts', post.id);

    batch.update(threadRef, {
      title,
    });
    batch.update(postRef, {
      text,
    });

    await batch.commit();
  }

  async function createThread({ title, text, forumId }) {
    let newThread = {
      publishedAt: serverTimestamp(),
      userId: userStore.authId,
      forumId,
      title,
    };

    const batch = writeBatch(db);
    const threadsRef = doc(collection(db, 'threads'));
    const forumRef = doc(db, 'forums', forumId);
    const userRef = doc(db, 'users', userStore.authId);

    batch.set(threadsRef, newThread);
    batch.update(forumRef, {
      threads: arrayUnion(threadsRef.id),
    });
    batch.update(userRef, {
      threads: arrayUnion(threadsRef.id),
    });

    await batch.commit();

    newThread = await getDoc(threadsRef);

    threads.value.push({ ...newThread, id: threadsRef.id });
    await postStore.createPost({ text, threadId: threadsRef.id });

    return newThread;
  }

  async function fetchThread(id) {
    return fetchItem(threads.value, 'threads', id);
  }

  async function fetchThreads(ids) {
    return await fetchItems(threads.value, 'threads', ids);
  }

  async function fetchPaginationThreads(ids, page, perPage = 10) {
    threads.value = [];
    const chunks = chunk(ids, perPage);
    const limitedIds = chunks[page - 1];

    return await fetchThreads(limitedIds);
  }

  async function subscribeOnThread(id, callback) {
    const subscribtionsStore = useSubsribtionsStore();
    const docRef = doc(db, 'threads', id);
    let item = null;

    const unsub = onSnapshot(docRef, (doc) => {
      const isLocal = doc.metadata.hasPendingWrites;
      let previousItem = findById(threads.value, id);

      item = { id: doc.id, ...doc.data() };

      upsert(threads.value, item);
      callback({ isLocal, item, previousItem });
    });

    subscribtionsStore.appendUnsubscribe(unsub);

    return item;
  }

  const appendContributorToThread = makeAppendChildToParent('contributors', threads.value);

  return {
    threads,
    threadById,
    createThread,
    fetchThread,
    fetchThreads,
    fetchPaginationThreads,
    updateThread,
    appendContributorToThread,
    subscribeOnThread,
  };
});
