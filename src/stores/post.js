import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useThreadStore, useUserStore } from '@/stores';
import { fetchItems, fetchItem, makeAppendChildToParent } from '@/utils/storeUtils.js';
import {
  writeBatch,
  doc,
  collection,
  arrayUnion,
  serverTimestamp,
  getDoc,
  increment,
  updateDoc,
  getDocs,
  where,
  query,
  orderBy,
  startAfter,
  limit,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { upsert } from '@/utils';

export const usePostStore = defineStore('post', () => {
  const userStore = useUserStore();
  const threadStore = useThreadStore();

  const posts = ref([]);
  let lastAuthUserPost = null;

  async function createPost({ text, threadId }) {
    let newPost = {
      text,
      threadId,
      publishedAt: serverTimestamp(),
      userId: userStore.authId,
    };
    const batch = writeBatch(db);
    const postRef = doc(collection(db, 'posts'));
    const threadRef = doc(db, 'threads', threadId);
    const userRef = doc(db, 'users', userStore.authId);

    batch.set(postRef, newPost);
    batch.update(threadRef, {
      contributors: arrayUnion(newPost.userId),
      posts: arrayUnion(postRef.id),
    });
    batch.update(userRef, {
      postsCount: increment(1),
    });

    await batch.commit();
    await userStore.fetchAuthUser();
    newPost = await getDoc(postRef);

    posts.value.push({ ...newPost.data(), id: newPost.id });
    appendPostToThread(postRef.id, threadId);
    threadStore.appendContributorToThread(userStore.authId, threadId);
  }

  async function updatePost({ text, id }) {
    const post = {
      text,
      edited: {
        at: serverTimestamp(),
        by: userStore.authId,
        moderate: false,
      },
    };

    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, post);
    await fetchPost(id);
  }

  async function fetchPost(id) {
    return fetchItem(posts.value, 'posts', id);
  }

  async function fetchPosts(ids) {
    return fetchItems(posts.value, 'posts', ids);
  }

  async function fetchAuthUserPosts() {
    const postsRef = collection(db, 'posts');
    let queryPosts = query(
      postsRef,
      where('userId', '==', userStore.authId),
      orderBy('publishedAt', 'desc'),
      startAfter(lastAuthUserPost || ''),
      limit(2)
    );

    const fetchedPosts = await getDocs(queryPosts);
    lastAuthUserPost = fetchedPosts.docs.at(-1);

    fetchedPosts.forEach((post) => upsert(posts.value, { id: post.id, ...post.data() }));
  }

  const appendPostToThread = makeAppendChildToParent('posts', threadStore.threads);

  return {
    createPost,
    posts,
    fetchPost,
    fetchPosts,
    fetchAuthUserPosts,
    updatePost,
  };
});
