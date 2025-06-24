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
/* Globale Container-Styles */
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
}

.app-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 106, 106, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(238, 90, 36, 0.3) 0%, transparent 50%);
  pointer-events: none;
  z-index: 1;
}

/* Header */
.app-header {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem 2rem 1rem;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.app-icon {
  font-size: 3.5rem;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2));
}

.app-subtitle {
  font-size: 1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.5px;
}

/* Main Content */
.app-main {
  position: relative;
  z-index: 10;
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  gap: 2rem;
}

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1.5rem 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.section-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
}

/* Statistik Cards */
.stats-container {
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) calc(0.1s * var(--delay, 0)) both;
}

.stat-card:nth-child(1) { --delay: 1; }
.stat-card:nth-child(2) { --delay: 2; }
.stat-card:nth-child(3) { --delay: 3; }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.stat-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.1));
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Workouts Container */
.workouts-container {
  margin-top: 1rem;
}

.workouts-list {
  display: grid;
  gap: 1.5rem;
}

.workout-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) calc(0.1s * var(--index, 0)) both;
}

.workout-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.workout-type {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.workout-emoji {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-radius: 14px;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.1));
}

.workout-type h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
  text-transform: capitalize;
}

.delete-button {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border: none;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.delete-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
  background: linear-gradient(135deg, #ee5a24, #ff6b6b);
}

.delete-button span {
  font-size: 1.2rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.workout-details {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}

.workout-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.info-icon {
  font-size: 1rem;
  opacity: 0.7;
}

.workout-notes {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  background: rgba(102, 126, 234, 0.05);
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.notes-icon {
  font-size: 1.1rem;
  margin-top: 0.1rem;
  opacity: 0.7;
}

.workout-notes p {
  margin: 0;
  color: #4a5568;
  line-height: 1.5;
  font-style: italic;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeIn 0.8s ease-out;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.empty-state p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-title {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 0.9rem;
  }
  
  .content-section {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .workout-details {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 1.5rem 1rem 0.5rem;
  }
  
  .app-title {
    font-size: 1.75rem;
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .workout-card {
    padding: 1.25rem;
  }
}

/* Animationen */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Fokus-Indikatoren für Barrierefreiheit */
.delete-button:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Hover-Effekte für Desktop */
@media (hover: hover) {
  .stat-card:hover .stat-icon {
    transform: scale(1.05);
  }
  
  .workout-card:hover .workout-emoji {
    transform: scale(1.1);
  }
}
</style>