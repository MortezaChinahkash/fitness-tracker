<script setup lang="ts">
import { ref, computed } from 'vue'
import AddWorkout from './components/AddWorkout.vue'
import AppHeader from './components/AppHeader.vue'
import Statistics from './components/Statistics.vue'
import WorkoutList from './components/WorkoutList.vue'
import EmptyState from './components/EmptyState.vue'
import ProfileView from './components/ProfileView.vue'

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

// Navigation State
const currentView = ref('dashboard')

function navigateToView(view: string) {
  currentView.value = view
}

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
  }
  const key = type.toLowerCase()
  return emojiMap[key] || '🏃‍♂️'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}
</script>

<template>
  <div class="app-container">
    <AppHeader :currentView="currentView" @navigate="navigateToView" />
    
    <main class="app-main">
      <div class="hero-section">
        <h1 class="app-title">
          <span class="app-icon">🏋️‍♂️</span>
          Fitness-Tracker
          <span class="app-subtitle">Deine persönliche Trainings-App</span>
        </h1>
      </div>

      <!-- Dashboard View -->
      <div v-if="currentView === 'dashboard'" class="content-section">
        <AddWorkout @add="addWorkout" />
        
        <Statistics 
          :workoutCount="workoutCount"
          :totalDuration="totalDuration"
          :averageDuration="averageDuration"
        />

        <div v-if="workouts.length > 0" class="recent-workouts">
          <h2 class="section-title">
            <span class="section-icon">⏱️</span>
            Letzte Aktivitäten
          </h2>
          <div class="recent-list">
            <div v-for="(workout, index) in workouts.slice(-3)" :key="index" class="recent-item">
              <span class="recent-emoji">{{ getWorkoutEmoji(workout.type) }}</span>
              <div class="recent-content">
                <h4>{{ workout.type }}</h4>
                <p>{{ workout.duration }} Minuten • {{ formatDate(workout.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Workouts View -->
      <div v-else-if="currentView === 'workouts'" class="content-section">
        <AddWorkout @add="addWorkout" />

        <WorkoutList 
          v-if="workouts.length > 0"
          :workouts="workouts"
          @delete="deleteWorkout"
          @update="updateWorkout"
        />

        <EmptyState v-else />
      </div>

      <!-- Statistics View -->
      <div v-else-if="currentView === 'statistics'" class="content-section">
        <Statistics 
          :workoutCount="workoutCount"
          :totalDuration="totalDuration"
          :averageDuration="averageDuration"
        />
      </div>

      <!-- Profile View -->
      <div v-else-if="currentView === 'profile'" class="content-section">
        <ProfileView />
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

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 2rem 0;
  letter-spacing: -0.02em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.section-icon {
  font-size: 2rem;
}

/* Recent Workouts - Dashboard */
.recent-workouts {
  margin-top: 2rem;
}

.recent-list {
  display: grid;
  gap: 1rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.2s ease;
}

.recent-item:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06);
}

.recent-emoji {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.recent-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
  text-transform: capitalize;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.recent-content p {
  margin: 0;
  font-size: 0.85rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
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
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .recent-item {
    padding: 0.75rem;
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
  
  .section-title {
    font-size: 1.5rem;
  }
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>