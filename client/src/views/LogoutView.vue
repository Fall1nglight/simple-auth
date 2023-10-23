<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// stores
const authStore = useAuthStore();

// router
const router = useRouter();

console.log('wasap');

authStore.logout();
router.push({ name: 'home' });
</script>

<template>
  <div></div>
</template>

<style scoped></style>
