<script setup lang="ts">
import { ref, computed } from 'vue'
import AddWorkout from './components/AddWorkout.vue'
import AppHeader from './components/AppHeader.vue'
import Statistics from './components/Statistics.vue'
import WorkoutList from './components/WorkoutList.vue'
import EmptyState from './components/EmptyState.vue'

const totalDuration = computed(() =>
  workouts.value.reduce((sum, workout) => sum + Number(workout.duration), 0)
);

const workoutCount = computed(() => workouts.value.length);

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

function updateWorkout(index: number, updatedWorkout: Workout) {
  workouts.value[index] = updatedWorkout
}

// Hilfsfunktionen für bessere Darstellung
const averageDuration = computed(() => 
  workouts.value.length > 0 ? Math.round(totalDuration.value / workouts.value.length) : 0
)
</script>

<template>
  <div class="app-container">
    <AppHeader />
    
    <main class="app-main">
      <div class="hero-section">
        <h1 class="app-title">
          <span class="app-icon">🏋️‍♂️</span>
          Fitness-Tracker
          <span class="app-subtitle">Deine persönliche Trainings-App</span>
        </h1>
      </div>

      <AddWorkout @add="addWorkout" />

      <div class="content-section">
        <Statistics 
          :workoutCount="workoutCount"
          :totalDuration="totalDuration"
          :averageDuration="averageDuration"
        />

        <WorkoutList 
          v-if="workouts.length > 0"
          :workouts="workouts"
          @delete="deleteWorkout"
          @update="updateWorkout"
        />

        <EmptyState v-else />
      </div>
    </main>
  </div>
</template>



<style scoped>
/* Apple Design System - Minimalistische Eleganz */
.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  color: #1d1d1f;
  position: relative;
  padding-bottom: 2rem; /* Extra Padding am Ende statt Footer */
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 3rem 2rem 1rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
}

.app-title {
  font-size: 3rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.app-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.app-subtitle {
  font-size: 1.25rem;
  font-weight: 400;
  color: #86868b;
  letter-spacing: -0.01em;
  margin-top: 0.5rem;
}

/* Main Content */
.app-main {
  position: relative;
  z-index: 10;
}

.content-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem; /* Extra Padding unten für besseren Abschluss */
  display: grid;
  gap: 3rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-title {
    font-size: 2.5rem;
  }
  
  .app-subtitle {
    font-size: 1.1rem;
  }
  
  .content-section {
    padding: 1.5rem;
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
  
  .content-section {
    padding: 1rem;
  }
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>