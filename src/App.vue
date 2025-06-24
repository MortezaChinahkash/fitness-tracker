<script setup lang="ts">
import { ref } from 'vue'
import AddWorkout from './components/AddWorkout.vue'

// Eine Liste für alle Workouts
interface Workout {
  type: string
  duration: number
  date: string
}

const workouts = ref<Workout[]>([])

// Funktion, um ein Workout hinzuzufügen
function addWorkout(workout: Workout) {
  workouts.value.push(workout)
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
    </li>
  </ul>
</template>
