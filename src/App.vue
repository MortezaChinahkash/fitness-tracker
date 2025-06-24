<script setup lang="ts">
import { ref } from 'vue'
import AddWorkout from './components/AddWorkout.vue'

// Eine Liste für alle Workouts
interface Workout {
  type: string
  duration: number
  date: string
  notes?: string
}

const workouts = ref<Workout[]>([])

// Funktion, um ein Workout hinzuzufügen
function addWorkout(workout: Workout) {
  workouts.value.push(workout)
}

function deleteWorkout(index: number) {
  workouts.value.splice(index, 1)
}
</script>

<template>
  <h1>Fitness-Tracker 🏋️‍♂️</h1>
  <!-- Wir übergeben die Funktion als Event-Listener an die Komponente -->
  <AddWorkout @add="addWorkout" />

  <h2>Deine Workouts:</h2>


  <ul>
  <li v-for="(workout, index) in workouts" :key="index">
    <b>{{ workout.type }}</b> – {{ workout.duration }} min – {{ workout.date }}
    <div v-if="workout.notes">📝 {{ workout.notes }}</div>
    <button @click="deleteWorkout(index)">Löschen</button>
  </li>
</ul>


</template>


<style scoped>
body {
  background: #181818;
  color: #f8f8f8;
  font-family: sans-serif;
}
h1 {
  margin-bottom: 1rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #222;
  padding: 1rem;
  border-radius: 8px;
}
input, textarea {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  background: #51d6a9;
  color: #181818;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 1rem;
  background: #222;
  padding: 1rem;
  border-radius: 8px;
}
</style>