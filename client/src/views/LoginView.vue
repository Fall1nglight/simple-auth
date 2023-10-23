<script setup>
// imports
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import schemas from '../schemas/index';

// store
const authStore = useAuthStore();

// router
const router = useRouter();

// refs
const user = ref({
  email: '',
  password: ''
});

// functions
const handleSubmit = async () => {
  try {
    await schemas.login.validateAsync(user.value);
    await authStore.login(user.value);

    // reset user ref
    user.value.email = '';
    user.value.password = '';

    router.push({ name: 'profile' });
  } catch (error) {
    console.error({ error });
  }
};
</script>

<template>
  <section class="login mt-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-6">
          <form @submit.prevent="handleSubmit">
            <div class="row mb-3">
              <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>

              <div class="col-sm-8">
                <input v-model="user.email" type="email" class="form-control" id="inputEmail" />
              </div>
            </div>

            <div class="row mb-3">
              <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>

              <div class="col-sm-8">
                <input
                  v-model="user.password"
                  type="password"
                  class="form-control"
                  id="inputPassword"
                />
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-sm-2"></div>
              <div class="col-sm-8">
                <button type="submit" class="btn btn-dark">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
