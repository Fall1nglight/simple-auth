<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';

// stores
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-dark p-5">
    <div class="container">
      <a class="navbar-brand" href="#">Navbar</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link active">Home</RouterLink>
          </li>

          <li v-show="!authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/signup" class="nav-link">Sign up</RouterLink>
          </li>

          <li v-show="!authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/login" class="nav-link">Login</RouterLink>
          </li>

          <li v-show="authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/profile" class="nav-link">{{ user.email }}</RouterLink>
          </li>

          <li v-show="authStore.isLoggedIn" class="nav-item">
            <RouterLink to="/logout" class="nav-link">Logout</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-brand,
.nav-link {
  color: #fff !important;
}

.nav-link {
  letter-spacing: 1px;
}
</style>
