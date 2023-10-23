import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { ref } from 'vue';
import axios from 'axios';

export const useNoteStore = defineStore('note', () => {
  // state
  const notes = ref([]);
  const userNotes = ref([]);

  // getters

  // actions
  async function fetchPublicNotes() {
    try {
      const response = await axios.get('http://localhost:3000/api/notes/all-public');

      if (!response.data.publicNotes.length) return;

      notes.value = response.data.publicNotes;
    } catch (error) {
      console.error({ error });
    }
  }

  async function fetchUserNotes() {
    try {
      const authStore = useAuthStore();
      const response = await axios.get('http://localhost:3000/api/notes', {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });

      if (!response.data.userNotes.length) return;

      userNotes.value = response.data.userNotes;
    } catch (error) {
      console.error({ error });
    }
  }

  async function uploadNote(note) {
    try {
      const authStore = useAuthStore();
      const response = await axios.post('http://localhost:3000/api/notes', note, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });

      if (!response.data.newNote) throw new Error('Failed to upload note. Please try again later!');

      userNotes.value.push(response.data.newNote);
    } catch (error) {
      console.error({ error });
    }
  }

  // updateNote
  async function updateNote(id, payload) {
    try {
      const authStore = useAuthStore();
      const response = await axios.patch(`http://localhost:3000/api/notes/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });

      if (!response.data.updatedNote)
        throw new Error('Failed to update note. Please try again later!');

      userNotes.value = userNotes.value.map((note) =>
        note._id === id ? response.data.updatedNote : note
      );
    } catch (error) {
      console.error({ error });
    }
  }

  async function deleteNote(id) {
    const authStore = useAuthStore();
    const response = await axios.delete(`http://localhost:3000/api/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });

    if (!response.data.deletedNote)
      throw new Error('Failed to delete note. Please try again later!');

    userNotes.value = userNotes.value.filter((note) => note._id !== id);
  }

  // return
  return { fetchPublicNotes, fetchUserNotes, uploadNote, updateNote, deleteNote, notes, userNotes };
});
