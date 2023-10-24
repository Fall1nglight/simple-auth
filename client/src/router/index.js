import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SignupView from '../views/SignupView.vue';
import LoginView from '../views/LoginView.vue';
import LogoutView from '../views/LogoutView.vue';
import ProfileView from '../views/ProfileView.vue';

import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import { useNoteStore } from '../stores/note';
import axios from 'axios';

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
  const { isLoggedIn, hasToken, getExpDate } = storeToRefs(authStore);

  if (hasToken.value && !isLoggedIn.value) {
    await authStore.checkUser();
    if (!isLoggedIn.value) authStore.resetToken();
  }

  console.log('logged in: ' + isLoggedIn.value);
  console.log('has token:' + hasToken.value);

  if (to.meta.requiresAuth && !isLoggedIn.value) return { name: 'home' };
  if (to.meta.preventLoggedIn && isLoggedIn.value) return { name: 'home' };

  if (isLoggedIn.value) {
    // refresh token
    const currentTime = new Date().getTime();
    const timeDiff = getExpDate.value - currentTime;
    const timeDiffInMins = timeDiff / 60000;

    console.log(`Remaining time: ${timeDiffInMins}`);
    console.log(`Time till refresh ${timeDiffInMins - 5}`);

    if (timeDiffInMins <= 0) {
      console.log('Token has expired, logging out...');
      authStore.resetToken();
    }

    if (timeDiffInMins <= 5) {
      // request refresh token
      try {
        console.log('Token is about to expire, requesting a new one...');

        const response = await axios.get('http://localhost:3000/api/auth/refresh-token', {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        });

        if (!response.data.token) return;

        authStore.setToken(response.data.token);

        console.log(`Old token was replaced with: ${response.data.token}`);
      } catch (error) {
        console.error({ error });
      }
    }
  }
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
