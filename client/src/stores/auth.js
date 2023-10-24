import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  // store
  const user = ref({
    _id: '',
    email: '',
    role: '',
    createdAt: 0,
    lastLogin: 0,
    updatedAt: 0,
    active: true,
    iat: 0,
    exp: 0
  });

  // get token from localStorage
  const localToken = localStorage.getItem('token') || '';

  const token = ref(localToken);

  // getters
  const isLoggedIn = computed(() => !!user.value._id);
  const isAdmin = computed(() => user.value.role === 'admin');
  const hasToken = computed(() => !!token.value);
  const getExpDate = computed(() => user.value.exp * 1000);

  // actions
  function setToken(newToken) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function resetToken() {
    token.value = '';
    localStorage.removeItem('token');
  }

  async function checkUser() {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/checkuser', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });

      if (!response.data.user) return;

      user.value = response.data.user;
    } catch (error) {
      console.error({ error });
    }
  }

  async function login(user) {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', user);

      if (!response.data.token) throw new Error('Failed to receive token from API.');

      setToken(response.data.token);

      await checkUser();
    } catch (error) {
      console.error({ error });
    }
  }

  async function signup(user) {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', user);

      if (!response.data.token) throw new Error('Failed to receive token from API.');

      setToken(response.data.token);

      await checkUser();
    } catch (error) {
      console.error({ error });
    }
  }

  function resetStore() {
    user.value = {
      _id: '',
      email: '',
      role: '',
      createdAt: 0,
      lastLogin: 0,
      updatedAt: 0,
      active: true,
      iat: 0,
      exp: 0
    };

    resetToken();
  }

  function logout() {
    resetStore();
  }

  // return
  return {
    user,
    token,
    login,
    signup,
    checkUser,
    resetToken,
    logout,
    isLoggedIn,
    isAdmin,
    hasToken,
    getExpDate,
    setToken
  };
});
