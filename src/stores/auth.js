import { defineStore } from 'pinia';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useUserStore } from '@/stores';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const authObserverUnsubcribe = ref(null);

  function initAuthentication() {
    const userStore = useUserStore();

    if (authObserverUnsubcribe.value) authObserverUnsubcribe.value();

    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          await userStore.fetchAuthUser();
          resolve(user);
        } else {
          resolve(null);
        }
      });

      authObserverUnsubcribe.value = unsubscribe;
    });
  }

  async function registerUserWithEmail({ email, password, name, username, avatar = null }) {
    const userStore = useUserStore();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    if (avatar) {
      avatar = await userStore.updateProfileImage({
        userId: userCredential.user.uid,
        image: avatar,
      });
    }

    await userStore.createUser({
      name,
      username,
      avatar,
      email,
      id: userCredential.user.uid,
      registeredAt: userCredential.user.metadata.createdAt,
    });
  }

  async function signInWithEmail({ email, password }) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const userRef = doc(db, 'users', result.user.uid);
    const user = await getDoc(userRef);

    if (!user.exists()) {
      const userStore = useUserStore();

      return userStore.createUser({
        id: result.user.uid,
        name: result.user.displayName,
        username: result.user.email,
        email: result.user.email,
        avatar: result.user.photoURL,
        registeredAt: result.user.metadata.createdAt,
      });
    }
  }

  async function signOut() {
    const userStore = useUserStore();

    await signOutFirebase(auth);
    userStore.authId = null;
  }

  return {
    registerUserWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    initAuthentication,
  };
});
