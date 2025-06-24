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
const editIndex = ref(-1) // Kein Eintrag wird editiert, solange -1
const editWorkout = ref<Workout | null>(null) // Temporäres Bearbeiten-Objekt

// Funktion, um ein Workout hinzuzufügen
function addWorkout(workout: Workout) {
  workouts.value.push(workout)
}

function deleteWorkout(index: number) {
  workouts.value.splice(index, 1)
}
function startEdit(index: number) {
  editIndex.value = index;
  // Deep Copy, damit Änderungen nicht sofort in der Liste sind
  editWorkout.value = { ...workouts.value[index] };
}

function saveEdit(index: number) {
  if (editWorkout.value) {
    workouts.value[index] = { ...editWorkout.value };
    editIndex.value = -1;
    editWorkout.value = null;
  }
}

function cancelEdit() {
  editIndex.value = -1;
  editWorkout.value = null;
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
      <AddWorkout @add="addWorkout" />

      <div class="content-section">
        <!-- Statistik -->
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

        <!-- Workouts Liste mit Editierfunktion -->
        <div class="workouts-container" v-if="workouts.length > 0">
          <h2 class="section-title">
            <span class="section-icon">📋</span>
            Deine Workouts
          </h2>
          <div class="workouts-list">
            <div v-for="(workout, index) in workouts" :key="index" class="workout-card">
              <template v-if="editIndex === index">
                <!-- Bearbeitungsformular -->
                <div class="workout-header">
                  <div class="workout-type">
                    <span class="workout-emoji">{{ getWorkoutEmoji(editWorkout!.type) }}</span>
                    <input v-model="editWorkout!.type" placeholder="Art des Workouts" required style="font-weight:bold; font-size:1.1rem;" />
                  </div>
                </div>
                <div class="workout-details">
                  <div class="workout-info">
                    <span class="info-icon">⏱️</span>
                    <input type="number" v-model="editWorkout!.duration" placeholder="Dauer (Minuten)" required style="width:70px;" />
                    <span>Minuten</span>
                  </div>
                  <div class="workout-info">
                    <span class="info-icon">📅</span>
                    <input type="date" v-model="editWorkout!.date" required />
                  </div>
                </div>
                <div class="workout-notes">
                  <span class="notes-icon">📝</span>
                  <textarea v-model="editWorkout!.notes" placeholder="Notizen (optional)" rows="2"></textarea>
                </div>
                <div style="margin-top:1rem;">
                  <button @click="saveEdit(index)" style="margin-right:1rem;">Speichern</button>
                  <button @click="cancelEdit">Abbrechen</button>
                </div>
              </template>
              <template v-else>
                <div class="workout-header">
                  <div class="workout-type">
                    <span class="workout-emoji">{{ getWorkoutEmoji(workout.type) }}</span>
                    <h3>{{ workout.type }}</h3>
                  </div>
                  <button @click="deleteWorkout(index)" class="delete-button">
                    <span>🗑️</span>
                  </button>
                  <button @click="startEdit(index)" class="delete-button" style="background: linear-gradient(135deg,#51d6a9,#1abc9c); margin-left: 0.5rem;">
                    <span>✏️</span>
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
              </template>
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
/* Apple Design System - Minimalistische Eleganz */
.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  color: #1d1d1f;
  position: relative;
}

/* Header im Apple Stil */
.app-header {
  position: relative;
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
  padding: 2rem;
  display: grid;
  gap: 3rem;
}

/* Section Titles im Apple Stil */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 2rem 0;
  letter-spacing: -0.02em;
}

.section-icon {
  font-size: 2rem;
}

/* Statistik Cards - Apple Card Design */
.stats-container {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #007AFF, #5856D6, #AF52DE);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
  filter: grayscale(0.3);
}

.stat-content {
  text-align: left;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.03em;
}

.stat-label {
  font-size: 1rem;
  font-weight: 500;
  color: #86868b;
  text-transform: none;
  letter-spacing: -0.01em;
}

/* Workouts Container */
.workouts-container {
  margin-top: 2rem;
}

.workouts-list {
  display: grid;
  gap: 1rem;
}

.workout-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.workout-card:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06);
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
  flex: 1;
}

.workout-emoji {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.workout-type h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  text-transform: capitalize;
  letter-spacing: -0.01em;
}

.workout-type input {
  background: #f5f5f7;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  outline: none;
  transition: all 0.2s ease;
}

.workout-type input:focus {
  border-color: #007AFF;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

/* Action Buttons im Apple Stil */
.delete-button {
  background: #ff3b30;
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.delete-button:hover {
  background: #d70015;
  transform: scale(1.05);
}

.delete-button[style*="background: linear-gradient(135deg,#51d6a9,#1abc9c)"] {
  background: #34c759 !important;
}

.delete-button[style*="background: linear-gradient(135deg,#51d6a9,#1abc9c)"]:hover {
  background: #28a745 !important;
}

.delete-button span {
  font-size: 1.1rem;
}

.workout-details {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.workout-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #86868b;
  font-size: 0.95rem;
}

.workout-info input {
  background: #f5f5f7;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
}

.workout-info input:focus {
  border-color: #007AFF;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
}

.info-icon {
  font-size: 1rem;
  opacity: 0.8;
}

.workout-notes {
  background: #f5f5f7;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.workout-notes textarea {
  background: transparent;
  border: none;
  width: 100%;
  resize: vertical;
  outline: none;
  font-family: inherit;
  color: #1d1d1f;
  line-height: 1.5;
}

.notes-icon {
  font-size: 1.1rem;
  margin-top: 0.1rem;
  opacity: 0.7;
}

.workout-notes p {
  margin: 0;
  color: #1d1d1f;
  line-height: 1.5;
  font-style: normal;
}

/* Edit Form Buttons */
.workout-card button {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.workout-card button:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.workout-card button:last-child {
  background: #8e8e93;
  margin-left: 0.5rem;
}

.workout-card button:last-child:hover {
  background: #6d6d70;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.02em;
}

.empty-state p {
  margin: 0;
  color: #86868b;
  font-size: 1.1rem;
  line-height: 1.5;
  font-weight: 400;
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
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .workout-details {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .workout-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .workout-header > div:last-child {
    align-self: flex-end;
    display: flex;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 2rem 1rem 1.5rem;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
  
  .content-section {
    padding: 1rem;
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .workout-card {
    padding: 1.25rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

/* Apple-style Smooth Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
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

/* Fokus-Indikatoren im Apple Stil */
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}

/* Subtile Hover-Effekte */
@media (hover: hover) {
  .stat-card:hover .stat-icon {
    transform: scale(1.05);
  }
  
  .workout-card:hover .workout-emoji {
    transform: scale(1.1);
  }
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>