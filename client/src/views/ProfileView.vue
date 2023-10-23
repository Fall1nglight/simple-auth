<script setup>
import { ref } from 'vue';
import { useNoteStore } from '../stores/note';
import schemas from '../schemas';
import { storeToRefs } from 'pinia';

// stores
const noteStore = useNoteStore();
const { userNotes } = storeToRefs(noteStore);

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

const handleToggleStatus = async (note) => {
  try {
    const payload = { public: !note.public };
    await noteStore.updateNote(note._id, payload);
  } catch (error) {
    console.error({ error });
  }
};

const handleButtons = async () => {};

const handleDelete = async (id) => {
  try {
    if (!confirm('Are you sure to delete this note?')) return;

    await noteStore.deleteNote(id);
  } catch (error) {
    console.error({ error });
  }
};
</script>

<template>
  <section class="profile mt-5">
    <div class="container">
      <div class="row">
        <div class="col-6">
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
                <textarea
                  v-model="note.body"
                  class="form-control"
                  id="inputBody"
                  rows="3"
                ></textarea>
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
        </div>
      </div>

      <div class="row">
        <div v-for="note in userNotes" :key="note._id" class="col">
          <div class="card">
            <div class="card-header d-flex">
              Note

              <span class="ms-auto">
                <i
                  @click="handleToggleStatus(note)"
                  class="bi bi-check2-circle"
                  title="Set public status"
                ></i>

                <i
                  @click="handleButtons(note._id, newNote)"
                  class="bi bi-wrench mx-3"
                  title="Modify note"
                ></i>

                <i @click="handleDelete(note._id)" class="bi bi-x-circle" title="Delete note"></i>
              </span>
            </div>
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

<style scoped>
#inputBody {
  resize: none;
}

.bi {
  cursor: pointer;
}
</style>
