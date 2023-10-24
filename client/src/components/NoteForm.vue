<script setup>
import { ref } from 'vue';
import { useNoteStore } from '../stores/note';
import schemas from '../schemas';

// stores
const noteStore = useNoteStore();

// refs
const note = ref({
  title: '',
  body: '',
  public: true
});

// functions
const handleSubmit = async () => {
  try {
    await schemas.upload.validateAsync(note.value);
    await noteStore.uploadNote(note.value);

    // reset note ref
    note.value.title = '';
    note.value.body = '';
    note.value.public = '';
  } catch (error) {
    console.error({ error });
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="row mb-3">
      <label for="inputTitle" class="col-sm-2 col-form-label">Title</label>

      <div class="col-sm-8">
        <input v-model="note.title" type="text" class="form-control" id="inputTitle" />
      </div>
    </div>

    <div class="row mb-3">
      <label for="inputBody" class="col-sm-2 col-form-label">Body</label>

      <div class="col-sm-8">
        <textarea v-model="note.body" class="form-control" id="inputBody" rows="3"></textarea>
      </div>
    </div>

    <div class="row-mb-3">
      <label class="col-sm-2 col-form-label" for="flexCheckDefault">Public</label>

      <div class="col-sm-2">
        <input
          v-model="note.public"
          class="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
        />
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-sm-2"></div>
      <div class="col-sm-8">
        <button type="submit" class="btn btn-dark">Upload</button>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
