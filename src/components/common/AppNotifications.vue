<script setup>
import useNotifications from '@/composables/useNotifications.js';

const { notifications, removeNotification } = useNotifications();
</script>

<template>
  <div class="notifications">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification-type-${notification.type}`"
      >
        <span>{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)">x</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
.notifications {
  position: fixed;
  bottom: 20px;
  right: 0;
}

.notification {
  background-color: white;
  display: flex;
  justify-content: space-between;
  width: 350px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.15);
  padding: 10px 20px;
  margin-bottom: 5px;
  border-left: 5px solid #263959;
}

.notification-type-error {
  border-left: 5px solid #bd3e3e;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
