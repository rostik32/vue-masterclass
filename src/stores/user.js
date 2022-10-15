import { findById } from '@/utils';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usePostStore, useThreadStore } from '@/stores';
import { fetchItems, fetchItem } from '@/utils/storeUtils.js';
import { doc, setDoc, updateDoc } from '@firebase/firestore';
import { getDownloadURL, ref as firebaseRef, uploadBytes } from 'firebase/storage';
import { db, auth, storage } from '@/config/firebase';
import useNotifications from '@/composables/useNotifications';

export const useUserStore = defineStore('user', () => {
  const postStore = usePostStore();
  const threadStore = useThreadStore();

  const authId = ref(null);
  const users = ref([]);
  const user = computed(() => (id) => {
    const user = findById(users.value, id);

    if (!user) return null;

    return {
      ...user,
      get posts() {
        return postStore.posts.filter((post) => post.userId === id);
      },
      get threads() {
        return threadStore.threads.filter((thread) => thread.userId === id);
      },
      get postsCount() {
        return user?.postsCount || 0;
      },
      get threadsCount() {
        return user?.threads?.length || 0;
      },
    };
  });

  const authUser = computed(() => user.value(authId.value));

  async function updateProfileImage({ userId, image }) {
    try {
      const avatarRef = firebaseRef(
        storage,
        `uploads/${userId || authId.value}/images/${Date.now()}-${image.name}`
      );

      await uploadBytes(avatarRef, image);
      const imageUrl = await getDownloadURL(avatarRef);

      return imageUrl;
    } catch (error) {
      const { addNotification } = useNotifications();

      addNotification({ message: 'Error uploading image avatar', timer: 5000, type: 'error' });
    }
  }

  async function updateUser({
    avatar = null,
    username = null,
    email = null,
    bio = null,
    name = null,
    website = null,
    location = null,
  }) {
    const userRef = doc(db, 'users', authId.value);
    await updateDoc(userRef, { avatar, username, email, bio, name, website, location });
  }

  async function createUser({ id, name, username, email, avatar = null, registeredAt }) {
    const newUser = {
      name,
      username,
      email,
      avatar,
      registeredAt,
      lowerCaseUsername: username.toLowerCase(),
    };

    await setDoc(doc(db, 'users', id), newUser);
    await fetchAuthUser();
  }

  async function fetchUser(id) {
    return fetchItem(users.value, 'users', id);
  }

  async function fetchUsers(ids) {
    return fetchItems(users.value, 'users', ids);
  }

  async function fetchAuthUser() {
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    await fetchItem(users.value, 'users', userId);
    authId.value = userId;
  }

  return {
    authUser,
    fetchUser,
    user,
    users,
    authId,
    fetchUsers,
    fetchAuthUser,
    createUser,
    updateUser,
    updateProfileImage,
  };
});
