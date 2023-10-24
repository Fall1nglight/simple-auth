<script setup>
import { ref } from 'vue';
import { useNoteStore } from '../stores/note';
import schemas from '../schemas';

// store
const noteStore = useNoteStore();

// props
const props = defineProps({
  note: Object
});

// refs
const editingState = ref(false);
const newNote = ref({
  title: props.note.title,
  body: props.note.body,
  public: props.note.public
});

// functions
const handleToggleStatus = async (note) => {
  try {
    const payload = { public: !note.public };
    await noteStore.updateNote(note._id, payload);
  } catch (error) {
    console.error({ error });
  }
};

const toggleEditingState = () => (editingState.value = !editingState.value);

const handleDelete = async (id) => {
  try {
    if (!confirm('Are you sure to delete this note?')) return;

    await noteStore.deleteNote(id);
  } catch (error) {
    console.error({ error });
  }
};

const handleSubmit = async () => {
  try {
    await schemas.edit.validateAsync(newNote.value);
    await noteStore.updateNote(props.note._id, newNote.value);

    editingState.value = false;
  } catch (error) {
    console.error({ error });
  }
};
</script>

<template>
  <div class="card" :class="[note.public ? 'border border-success' : 'border border-danger']">
    <div class="card-header d-flex">
      Note

      <span class="ms-auto">
        <i
          @click="handleToggleStatus(note)"
          class="bi bi-check2-circle"
          title="Set public status"
        ></i>

        <i @click="toggleEditingState" class="bi bi-wrench mx-3" title="Modify note"></i>

        <i @click="handleDelete(note._id)" class="bi bi-x-circle" title="Delete note"></i>
      </span>
    </div>

    <div v-if="!editingState" class="card-body">
      <blockquote class="blockquote mb-0">
        <p>{{ note.title }}</p>

        <footer class="blockquote-footer">
          {{ note.body }}
        </footer>
      </blockquote>
    </div>

    <div v-else class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <!-- <label for="inputTitleEditing" class="form-label">Title</label> -->
          <input v-model="newNote.title" type="text" class="form-control" id="inputTitleEditing" />
        </div>

        <div class="mb-3">
          <textarea v-model="newNote.body" class="form-control" id="inputBody" rows="3"></textarea>
        </div>

        <div class="mb-3 form-check">
          <input
            v-model="newNote.public"
            type="checkbox"
            class="form-check-input"
            id="exampleCheck1"
          />
          <label class="form-check-label" for="exampleCheck1">Public</label>
        </div>

        <button type="submit" class="btn btn-dark">Edit</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
#inputBody {
  resize: none;
}

.bi {
  cursor: pointer;
}
</style>
