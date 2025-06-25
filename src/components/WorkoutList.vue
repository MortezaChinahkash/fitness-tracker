<template>
  <div class="workouts-container">
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
              <span class="workout-emoji">{{ getWorkoutEmoji(editWorkout!.category || editWorkout!.type) }}</span>
              <input v-model="editWorkout!.type" placeholder="Art des Workouts" required class="edit-input-title" />
            </div>
          </div>
          <div class="workout-details">
            <div class="workout-info">
              <span class="info-icon">⏱️</span>
              <input type="number" v-model="editWorkout!.duration" placeholder="Dauer (Minuten)" required class="edit-input-duration" />
              <span>Minuten</span>
            </div>
            <div class="workout-info">
              <span class="info-icon">📅</span>
              <input type="date" v-model="editWorkout!.date" required class="edit-input-date" />
            </div>
          </div>
          <div class="workout-notes">
            <span class="notes-icon">📝</span>
            <textarea v-model="editWorkout!.notes" placeholder="Notizen (optional)" rows="2" class="edit-textarea"></textarea>
          </div>
          <div class="edit-actions">
            <button @click="saveEdit(index)" class="save-button">Speichern</button>
            <button @click="cancelEdit" class="cancel-button">Abbrechen</button>
          </div>
        </template>
        <template v-else>
          <div class="workout-header">
            <div class="workout-type">
              <span class="workout-emoji">{{ getWorkoutEmoji(workout.category || workout.type) }}</span>
              <h3>{{ workout.type }}</h3>
            </div>
            <div class="action-buttons">
              <button @click="startEdit(index)" class="edit-button">
                <span>✏️</span>
              </button>
              <button @click="deleteWorkout(index)" class="delete-button">
                <span>🗑️</span>
              </button>
            </div>
          </div>
          <div class="workout-details">
            <div class="workout-info">
              <span class="info-icon">⏱️</span>
              <span v-if="workout.trainingType === 'sets'">
                {{ workout.sets }} Sets × {{ workout.reps }} Reps
              </span>
              <span v-else>{{ workout.duration }} Minuten</span>
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Workout Interface
interface Workout {
  type: string
  duration: number
  date: string
  notes?: string
  trainingType?: string
  sets?: number
  reps?: number
}

// Props
interface Props {
  workouts: Workout[]
}

const props = defineProps<Props>()

// Events
const emit = defineEmits<{
  delete: [index: number]
  update: [index: number, workout: Workout]
}>()

// Edit State
const editIndex = ref(-1)
const editWorkout = ref<Workout | null>(null)

// Functions
function deleteWorkout(index: number) {
  emit('delete', index)
}

function startEdit(index: number) {
  editIndex.value = index
  editWorkout.value = { ...props.workouts[index] }
}

function saveEdit(index: number) {
  if (editWorkout.value) {
    emit('update', index, { ...editWorkout.value })
    editIndex.value = -1
    editWorkout.value = null
  }
}

function cancelEdit() {
  editIndex.value = -1
  editWorkout.value = null
}

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

<style scoped>
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
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
}

.edit-button {
  background: #34c759;
}

.edit-button:hover {
  background: #28a745;
  transform: scale(1.05);
}

.delete-button {
  background: #ff3b30;
}

.delete-button:hover {
  background: #d70015;
  transform: scale(1.05);
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
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
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
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Edit Form Styles */
.edit-input-title {
  background: #f5f5f7;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  outline: none;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  flex: 1;
}

.edit-input-duration,
.edit-input-date {
  background: #f5f5f7;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.edit-input-duration {
  width: 70px;
}

.edit-input-title:focus,
.edit-input-duration:focus,
.edit-input-date:focus {
  border-color: #007AFF;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.edit-textarea {
  background: transparent;
  border: none;
  width: 100%;
  resize: vertical;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  color: #1d1d1f;
  line-height: 1.5;
}

.edit-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.save-button,
.cancel-button {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.save-button:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.cancel-button {
  background: #8e8e93;
}

.cancel-button:hover {
  background: #6d6d70;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
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
  
  .action-buttons {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .workout-card {
    padding: 1.25rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

/* Subtile Hover-Effekte */
@media (hover: hover) {
  .workout-card:hover .workout-emoji {
    transform: scale(1.1);
  }
}

/* Fokus-Indikatoren */
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
