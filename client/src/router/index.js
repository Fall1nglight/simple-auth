import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SignupView from '../views/SignupView.vue';
import LoginView from '../views/LoginView.vue';
import LogoutView from '../views/LogoutView.vue';
import ProfileView from '../views/ProfileView.vue';

import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import { useNoteStore } from '../stores/note';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { fetchPublicNotes: true }
    },

    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { preventLoggedIn: true }
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { preventLoggedIn: true }
    },

    {
      path: '/logout',
      name: 'logout',
      component: LogoutView,
      meta: { requiresAuth: true }
    },

    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, fetchUserNotes: true }
    }
  ]
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const { isLoggedIn, hasToken } = storeToRefs(authStore);

  // implement refresh token

  if (!isLoggedIn.value && hasToken.value) {
    await authStore.checkUser();
    if (!isLoggedIn.value) authStore.resetToken();
  }

  if (to.meta.requiresAuth && !isLoggedIn.value) return { name: 'home' };
  if (to.meta.preventLoggedIn && isLoggedIn.value) return { name: 'home' };
});

router.beforeResolve(async (to) => {
  if (to.meta.fetchPublicNotes) {
    try {
      const noteStore = useNoteStore();
      await noteStore.fetchPublicNotes();
    } catch (error) {
      console.error({ error });
    }
  }

  if (to.meta.fetchUserNotes) {
    try {
      const noteStore = useNoteStore();
      await noteStore.fetchUserNotes();
    } catch (error) {
      console.error({ error });
    }
  }
});

export default router;
