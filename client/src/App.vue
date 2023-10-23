<script setup>
import NavigationBar from './components/NavigationBar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <header>
    <NavigationBar></NavigationBar>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
