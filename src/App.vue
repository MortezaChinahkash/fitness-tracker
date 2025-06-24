<script setup lang="ts">
import { ref, computed } from 'vue'
import AddWorkout from './components/AddWorkout.vue'

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

// Hilfsfunktionen für bessere Darstellung
const averageDuration = computed(() => 
  workouts.value.length > 0 ? Math.round(totalDuration.value / workouts.value.length) : 0
);

function getWorkoutEmoji(type: string): string {
  const emojiMap: { [key: string]: string } = {
    'laufen': '🏃‍♂️',
    'krafttraining': '💪',
    'yoga': '🧘‍♀️',
    'radfahren': '🚴‍♂️',
    'schwimmen': '🏊‍♂️',
    'wandern': '🥾',
    'fußball': '⚽',
    'basketball': '🏀',
    'tennis': '🎾',
    'boxen': '🥊',
    'pilates': '🤸‍♀️',
    'crossfit': '🏋️‍♀️'
  };
  const key = type.toLowerCase();
  return emojiMap[key] || '🏃‍♂️';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1 class="app-title">
        <span class="app-icon">🏋️‍♂️</span>
        Fitness-Tracker
        <span class="app-subtitle">Deine persönliche Trainings-App</span>
      </h1>
    </header>

    <main class="app-main">
      <!-- Wir übergeben die Funktion als Event-Listener an die Komponente -->
      <AddWorkout @add="addWorkout" />

      <div class="content-section">
        <div class="stats-container">
          <h2 class="section-title">
            <span class="section-icon">📊</span>
            Deine Statistik
          </h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-number">{{ workoutCount }}</div>
                <div class="stat-label">Workouts</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⏰</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalDuration }}</div>
                <div class="stat-label">Minuten</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔥</div>
              <div class="stat-content">
                <div class="stat-number">{{ averageDuration }}</div>
                <div class="stat-label">Ø Dauer</div>
              </div>
            </div>
          </div>
        </div>

        <div class="workouts-container" v-if="workouts.length > 0">
          <h2 class="section-title">
            <span class="section-icon">📋</span>
            Deine Workouts
          </h2>
          <div class="workouts-list">
            <div v-for="(workout, index) in workouts" :key="index" class="workout-card">
              <div class="workout-header">
                <div class="workout-type">
                  <span class="workout-emoji">{{ getWorkoutEmoji(workout.type) }}</span>
                  <h3>{{ workout.type }}</h3>
                </div>
                <button @click="deleteWorkout(index)" class="delete-button">
                  <span>🗑️</span>
                </button>
              </div>
              <div class="workout-details">
                <div class="workout-info">
                  <span class="info-icon">⏱️</span>
                  <span>{{ workout.duration }} Minuten</span>
                </div>
                <div class="workout-info">
                  <span class="info-icon">📅</span>
                  <span>{{ formatDate(workout.date) }}</span>
                </div>
              </div>
              <div v-if="workout.notes" class="workout-notes">
                <span class="notes-icon">📝</span>
                <p>{{ workout.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">🎯</div>
          <h3>Noch keine Workouts</h3>
          <p>Füge dein erstes Workout hinzu und starte deine Fitness-Reise!</p>
        </div>
      </div>
    </main>
  </div>


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
.stats {
  margin-bottom: 2rem;
  background: #333;
  padding: 1rem;
  border-radius: 8px;
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