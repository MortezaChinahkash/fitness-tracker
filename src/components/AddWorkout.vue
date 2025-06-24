<template>
  <form @submit.prevent="addWorkout">
    <input v-model="type" placeholder="Art des Workouts" required />
    <input type="number" v-model="duration" placeholder="Dauer (Minuten)" required />
    <input type="date" v-model="date" required />
    <button type="submit">Hinzufügen</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Reaktive Felder
const type = ref('')
const duration = ref(0)
const date = ref('')

// Das Event vorbereiten (damit wir Daten an die App schicken können)
const emit = defineEmits(['add'])

function addWorkout() {
  // An die Haupt-App schicken:
  emit('add', {
    type: type.value,
    duration: duration.value,
    date: date.value
  })

  // Felder zurücksetzen
  type.value = ''
  duration.value = 0
  date.value = ''
}
</script>
