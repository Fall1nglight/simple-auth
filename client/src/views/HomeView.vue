<script setup>
import { storeToRefs } from 'pinia';
import { useNoteStore } from '../stores/note';
import NoteCard from '../components/NoteCard.vue';

// stores
const noteStore = useNoteStore();
const { notes } = storeToRefs(noteStore);
</script>

<template>
  <section class="notes mt-5">
    <div class="container">
      <div class="row">
        <div v-for="note in notes" :key="note._id" class="col">
          <NoteCard :note="note"></NoteCard>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
