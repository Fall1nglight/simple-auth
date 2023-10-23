<script setup>
import { storeToRefs } from 'pinia';
import { useNoteStore } from '../stores/note';

// stores
const noteStore = useNoteStore();
const { notes } = storeToRefs(noteStore);
</script>

<template>
  <section class="notes mt-5">
    <div class="container">
      <div class="row">
        <div v-for="note in notes" :key="note._id" class="col">
          <div class="card">
            <div class="card-header">Note</div>
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                <p>{{ note.title }}</p>
                <footer class="blockquote-footer">
                  {{ note.body }}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
