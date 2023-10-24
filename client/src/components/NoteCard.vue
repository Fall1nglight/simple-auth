<script setup>
import { format, formatDistanceToNow } from 'date-fns';
import { computed } from 'vue';

// props
const props = defineProps({
  note: Object
});

// computed
const updatedAt = computed(() =>
  props.note.updatedAt
    ? `Last updated ${formatDistanceToNow(props.note.updatedAt)}`
    : 'Note has not been updated..'
);

const createdAt = computed(() => `Created on ${format(props.note.createdAt, 'MM/dd/yyyy')}`);
</script>

<template>
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

    <div class="card-footer d-flex flex-column">
      <span> {{ createdAt }} </span>
      <span> {{ updatedAt }}</span>
    </div>
  </div>
</template>

<style scoped></style>
