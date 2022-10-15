<script setup>
import { useUserStore, useExternalStore } from '@/stores';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const userStore = useUserStore();
const externalStore = useExternalStore();
const router = useRouter();

const activeUser = ref({ ...props.user });
const username = ref(null);
const isImageLoading = ref(false);

onBeforeMount(async () => {
  externalStore.getAllCountries();
});

const save = () => {
  userStore.updateUser({ ...activeUser.value });
  goToProfile();
};

const goToProfile = () => router.push({ name: 'profile' });

const handleAvatarImage = async (event) => {
  const image = event.target.files[0];

  isImageLoading.value = true;
  const uploadedImage = await userStore.updateProfileImage({ image });
  activeUser.value.avatar = uploadedImage || activeUser.value.avatar;
  isImageLoading.value = false;
};
</script>

<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <p class="text-center avatar-edit">
        <label>
          <AppAvatarImg
            :src="activeUser.avatar"
            :alt="`${activeUser.name} profile picture`"
            class="avatar-xlarge img-update"
          />

          <div class="avatar-upload-overlay">
            <AppSpinner v-if="isImageLoading" color="white" />
            <FaIcon v-else icon="fa-camera" size="3x" :style="{ color: 'white', opacity: '0.7' }" />
          </div>

          <input hidden type="file" @change="handleAvatarImage" />
        </label>
      </p>

      <div class="form-group">
        <input
          ref="username"
          v-model="activeUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>

      <div class="form-group">
        <input
          v-model="activeUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
        />
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          id="user_bio"
          v-model="activeUser.bio"
          class="form-input"
          placeholder="Write a few words about yourself."
        ></textarea>
      </div>

      <div class="stats">
        <span>{{ props.user.postsCount }} posts</span>
        <span>{{ props.user.threadsCount }} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input
          id="user_website"
          v-model="activeUser.website"
          autocomplete="off"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input id="user_email" v-model="activeUser.email" autocomplete="off" class="form-input" />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input
          id="user_location"
          v-model="activeUser.location"
          autocomplete="off"
          list="countries"
          class="form-input"
        />
      </div>

      <datalist id="countries">
        <option
          v-for="country in externalStore.countries"
          :key="country.name.official"
          :value="country.name.official"
        ></option>
      </datalist>

      <div class="btn-group space-between">
        <button type="button" class="btn-ghost" @click="goToProfile">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>
