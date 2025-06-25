<template>
  <div class="workout-form-container">
    <div class="form-header">
      <h2 class="form-title">
        Neues Workout hinzufügen
      </h2>
      <p class="form-subtitle">Zeichne dein Training auf und verfolge deine Fortschritte</p>
    </div>
    
    <form @submit.prevent="addWorkout" class="workout-form">
      <div class="input-group">
        <label for="workout-category" class="input-label">
          <span class="label-icon">📂</span>
          Kategorie
        </label>
        <div class="select-wrapper">
          <select 
            id="workout-category"
            v-model="selectedCategory" 
            required 
            class="form-select"
          >
            <option value="">Kategorie wählen...</option>
            <option 
              v-for="(emoji, category) in workoutCategories" 
              :key="category"
              :value="category"
            >
              {{ emoji }} {{ formatCategoryName(category) }}
            </option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <label for="workout-type" class="input-label">
          <span class="label-icon">🏃‍♂️</span>
          Workout-Name
        </label>
        <input 
          id="workout-type"
          type="text" 
          v-model="workoutType" 
          placeholder="z.B. Morgenrun, Krafttraining Oberkörper, Yoga Flow..."
          required 
          class="form-input"
        />
      </div>

      <div class="input-group">
        <label for="workout-duration" class="input-label">
          <span class="label-icon">⏱️</span>
          Training
        </label>
        
        <!-- Typ-Auswahl -->
        <div class="training-type-selector">
          <button 
            type="button"
            @click="trainingType = 'duration'"
            :class="['type-btn', { active: trainingType === 'duration' }]"
          >
            <span>⏱️</span>
            Dauer
          </button>
          <button 
            type="button"
            @click="trainingType = 'sets'"
            :class="['type-btn', { active: trainingType === 'sets' }]"
          >
            <span>🔢</span>
            Sets/Reps
          </button>
        </div>

        <!-- Dauer Input -->
        <div v-if="trainingType === 'duration'" class="input-with-unit">
          <input 
            id="workout-duration"
            type="number" 
            v-model="duration" 
            placeholder="45" 
            required 
            class="form-input duration-input"
            min="1"
            max="480"
          />
          <span class="input-unit">Minuten</span>
        </div>

        <!-- Sets/Reps Input -->
        <div v-else class="sets-input-group">
          <div class="sets-row">
            <div class="input-with-unit">
              <input 
                type="number" 
                v-model="sets" 
                placeholder="3" 
                required 
                class="form-input sets-input"
                min="1"
                max="20"
              />
              <span class="input-unit">Sets</span>
            </div>
            <div class="input-with-unit">
              <input 
                type="number" 
                v-model="reps" 
                placeholder="12" 
                required 
                class="form-input reps-input"
                min="1"
                max="100"
              />
              <span class="input-unit">Reps</span>
            </div>
          </div>
          <p class="sets-example">z.B. 3 Sets à 12 Wiederholungen</p>
        </div>
      </div>

      <div class="input-group">
        <label for="workout-date" class="input-label">
          <span class="label-icon">📅</span>
          Datum
        </label>
        <input 
          id="workout-date"
          type="date" 
          v-model="date" 
          required 
          class="form-input"
        />
      </div>

      <div class="input-group">
        <label for="workout-notes" class="input-label">
          <span class="label-icon">📝</span>
          Notizen
          <span class="optional-badge">Optional</span>
        </label>
        <textarea 
          id="workout-notes"
          v-model="notes" 
          placeholder="Wie hast du dich gefühlt? Besondere Übungen? Ziele erreicht?"
          class="form-textarea"
          rows="4"
        ></textarea>
      </div>

      <button type="submit" class="submit-button">
        <span class="button-icon">✨</span>
        Workout speichern
        <span class="button-arrow">→</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Reaktive Felder
const duration = ref(0)
const date = ref('')
const notes = ref('')
const workoutType = ref('')

// Neue Felder für Sets/Reps
const trainingType = ref('duration') // 'duration' oder 'sets'
const sets = ref(0)
const reps = ref(0)

// Kategorien
const selectedCategory = ref('')

// Workout-Kategorien mit Emojis
const workoutCategories = {
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

// Das Event vorbereiten (damit wir Daten an die App schicken können)
const emit = defineEmits(['add'])

// Aktuelles Datum beim Laden der Komponente setzen
onMounted(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  date.value = `${year}-${month}-${day}`
})

function addWorkout() {
  if (!selectedCategory.value) {
    alert('Bitte wähle eine Workout-Kategorie aus!')
    return
  }

  if (!workoutType.value.trim()) {
    alert('Bitte gib einen Workout-Namen ein!')
    return
  }

  const workoutData = {
    type: workoutType.value.trim(),
    category: selectedCategory.value,
    date: date.value,
    notes: notes.value,
    trainingType: trainingType.value
  }

  // Je nach Trainingstyp verschiedene Daten hinzufügen
  if (trainingType.value === 'duration') {
    workoutData.duration = duration.value
  } else {
    workoutData.sets = sets.value
    workoutData.reps = reps.value
    // Für Kompatibilität: Schätze Dauer basierend auf Sets (ca. 2-3 Min pro Set)
    workoutData.duration = Math.round(sets.value * 2.5)
  }

  emit('add', workoutData);

  // Nach dem Hinzufügen Felder zurücksetzen, aber Datum auf heute lassen
  selectedCategory.value = '';
  workoutType.value = '';
  duration.value = 0;
  sets.value = 0;
  reps.value = 0;
  notes.value = '';
  // Datum wieder auf heute setzen
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  date.value = `${year}-${month}-${day}`
}

// Kategorien-Funktionen
function formatCategoryName(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
</script>

<style scoped>
/* Apple Design für AddWorkout Komponente */
.workout-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  z-index: 10;
  position: relative;
}

.form-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.icon {
  font-size: 2.5rem;
}

.form-subtitle {
  color: #86868b;
  font-size: 1rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: -0.01em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.workout-form {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  max-width: 100%;
  width: 100%;
  position: relative;
  z-index: 10;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #1d1d1f;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.label-icon {
  font-size: 1.1rem;
  width: 1.2rem;
  text-align: center;
  opacity: 0.8;
}

.optional-badge {
  margin-left: auto;
  background: #f5f5f7;
  color: #86868b;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #f5f5f7;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  transition: all 0.2s ease;
  outline: none;
  color: #1d1d1f;
  font-weight: 400;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

.select-wrapper {
  position: relative;
}

.form-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 2.5rem;
  cursor: pointer;
}

.select-wrapper::after {
  content: '▼';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #86868b;
  pointer-events: none;
  font-size: 0.8rem;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: #007AFF;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  transform: none;
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.duration-input {
  padding-right: 5rem !important;
  box-sizing: border-box;
}

.input-unit {
  position: absolute;
  right: 1rem;
  color: #86868b;
  font-weight: 500;
  font-size: 0.9rem;
  pointer-events: none;
}

/* Training Type Selector */
.training-type-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  background: #f5f5f7;
  border-radius: 10px;
  padding: 0.25rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.type-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.type-btn.active {
  background: #007AFF;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 122, 255, 0.2);
}

.type-btn:hover:not(.active) {
  background: rgba(0, 122, 255, 0.1);
  color: #007AFF;
}

/* Sets Input Group */
.sets-input-group {
  display: grid;
  gap: 0.75rem;
}

.sets-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.sets-input,
.reps-input {
  padding-right: 3.5rem !important;
}

.sets-example {
  margin: 0;
  font-size: 0.8rem;
  color: #86868b;
  font-style: italic;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.submit-button {
  width: 100%;
  padding: 1rem 2rem;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: none;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.submit-button:hover {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.submit-button:active {
  transform: translateY(0);
}

.button-icon,
.button-arrow {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.submit-button:hover .button-arrow {
  transform: translateX(2px);
}

.submit-button:hover .button-icon {
  transform: scale(1.05);
}

/* Input-Typ spezifische Styles */
input[type="date"] {
  color: #1d1d1f;
  font-weight: 400;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0.6;
  cursor: pointer;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .workout-form-container {
    padding: 1.5rem;
  }
  
  .form-title {
    font-size: 1.75rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-subtitle {
    font-size: 0.95rem;
  }
  
  .workout-form {
    padding: 1.5rem;
    border-radius: 16px;
  }
  
  .form-input,
  .form-textarea {
    padding: 0.75rem 0.875rem;
    font-size: 16px; /* Verhindert Zoom auf iOS */
  }
  
  .submit-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .workout-form-container {
    padding: 1rem;
  }
  
  .workout-form {
    padding: 1.25rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .input-label {
    font-size: 0.95rem;
  }
}

/* Apple-style Smooth Animations */
.workout-form-container {
  animation: fadeIn 0.5s ease-out;
}

.workout-form {
  animation: slideInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both;
}

.input-group {
  animation: fadeIn 0.3s ease-out calc(0.05s * var(--delay, 0)) both;
}

.input-group:nth-child(1) { --delay: 1; }
.input-group:nth-child(2) { --delay: 2; }
.input-group:nth-child(3) { --delay: 3; }
.input-group:nth-child(4) { --delay: 4; }

.submit-button {
  animation: fadeIn 0.3s ease-out 0.3s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fokus-Indikatoren im Apple Stil */
.form-input:focus-visible,
.form-textarea:focus-visible,
.submit-button:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}

/* Hover-Effekte für Desktop */
@media (hover: hover) {
  .form-input:hover {
    border-color: rgba(0, 122, 255, 0.3);
    background: #ffffff;
  }
  
  .form-textarea:hover {
    border-color: rgba(0, 122, 255, 0.3);
    background: #ffffff;
  }
}

/* Apple Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
