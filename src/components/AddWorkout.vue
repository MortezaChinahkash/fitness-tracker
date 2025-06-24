<template>
  <form @submit.prevent="addWorkout">
    <input v-model="type" placeholder="Art des Workouts" required />
    <input type="number" v-model="duration" placeholder="Dauer (Minuten)" required />
    <input type="date" v-model="date" required />
    <button type="submit">Hinzufügen</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const type = ref('');
const duration = ref(0);
const date = ref('');

function addWorkout() {
  // Hier später: Eintrag an die Haupt-App senden!
  console.log('Workout hinzufügen:', type.value, duration.value, date.value);
  // Felder zurücksetzen
  type.value = '';
  duration.value = 0;
  date.value = '';
}
</script>