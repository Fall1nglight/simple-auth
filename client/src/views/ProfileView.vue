<script setup>
import { storeToRefs } from 'pinia';
import NoteCardWithForm from '../components/NoteCardWithForm.vue';
import NoteForm from '../components/NoteForm.vue';
import { useNoteStore } from '../stores/note';

// stores
const noteStore = useNoteStore();
const { userNotes } = storeToRefs(noteStore);
</script>

<template>
  <section class="profile mt-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-6">
          <NoteForm></NoteForm>
        </div>
      </div>

      <div class="row">
        <div v-for="note in userNotes" :key="note._id" class="col">
          <NoteCardWithForm :note="note"></NoteCardWithForm>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
