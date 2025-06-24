<template>
  <div class="workout-form-container">
    <div class="form-header">
      <h2 class="form-title">
        <span class="icon">💪</span>
        Neues Workout hinzufügen
      </h2>
      <p class="form-subtitle">Zeichne dein Training auf und verfolge deine Fortschritte</p>
    </div>
    
    <form @submit.prevent="addWorkout" class="workout-form">
      <div class="input-group">
        <label for="workout-type" class="input-label">
          <span class="label-icon">🏃‍♂️</span>
          Art des Workouts
        </label>
        <input 
          id="workout-type"
          v-model="type" 
          placeholder="z.B. Laufen, Krafttraining, Yoga..." 
          required 
          class="form-input"
        />
      </div>

      <div class="input-group">
        <label for="workout-duration" class="input-label">
          <span class="label-icon">⏱️</span>
          Dauer
        </label>
        <div class="input-with-unit">
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
import { ref } from 'vue'

// Reaktive Felder
const type = ref('')
const duration = ref(0)
const date = ref('')
const notes = ref('')

// Das Event vorbereiten (damit wir Daten an die App schicken können)
const emit = defineEmits(['add'])

function addWorkout() {
  emit('add', {
    type: type.value,
    duration: duration.value,
    date: date.value,
    notes: notes.value
  });

  type.value = '';
  duration.value = 0;
  date.value = '';
  notes.value = '';
}
</script>

<style scoped>
.workout-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
}

/* Entferne die Hintergrund-Overlays */

.form-header {
  text-align: center;
  margin-bottom: 2rem;
  z-index: 10;
  position: relative;
}

.form-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.icon {
  font-size: 3rem;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2));
}

.form-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 300;
  margin: 0;
  letter-spacing: 0.5px;
}

.workout-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  max-width: 550px;
  width: 100%;
  position: relative;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.input-group {
  margin-bottom: 2rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  letter-spacing: 0.3px;
}

.label-icon {
  font-size: 1.2rem;
  width: 1.5rem;
  text-align: center;
}

.optional-badge {
  margin-left: auto;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1.25rem 1.5rem;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  background: #ffffff;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  color: #2d3748;
  font-weight: 500;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #667eea;
  box-shadow: 
    0 0 0 4px rgba(102, 126, 234, 0.1),
    0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  background: #ffffff;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #a0aec0;
  font-weight: 400;
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.duration-input {
  padding-right: 6rem !important;
  box-sizing: border-box;
}

.input-unit {
  position: absolute;
  right: 1.5rem;
  color: #718096;
  font-weight: 500;
  font-size: 0.9rem;
  pointer-events: none;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
}

.submit-button {
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: none;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 24px rgba(102, 126, 234, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-button:hover::before {
  left: 100%;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 12px 32px rgba(102, 126, 234, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
}

.submit-button:active {
  transform: translateY(-1px);
}

.button-icon,
.button-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.submit-button:hover .button-arrow {
  transform: translateX(4px);
}

.submit-button:hover .button-icon {
  transform: scale(1.1) rotate(10deg);
}

/* Input-Typ spezifische Styles */
input[type="date"] {
  color: #2d3748;
  font-weight: 500;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: opacity(0.6);
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
    min-height: 100vh;
  }
  
  .form-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-subtitle {
    font-size: 1rem;
  }
  
  .workout-form {
    padding: 2rem;
    border-radius: 20px;
  }
  
  .form-input,
  .form-textarea {
    padding: 1rem 1.25rem;
    font-size: 16px; /* Verhindert Zoom auf iOS */
  }
  
  .submit-button {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .workout-form-container {
    padding: 1rem;
  }
  
  .workout-form {
    padding: 1.5rem;
  }
  
  .form-title {
    font-size: 1.75rem;
  }
  
  .input-label {
    font-size: 0.9rem;
  }
}

/* Animationen */
.workout-form-container {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.workout-form {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.input-group {
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) calc(0.1s * var(--delay, 0)) both;
}

.input-group:nth-child(1) { --delay: 1; }
.input-group:nth-child(2) { --delay: 2; }
.input-group:nth-child(3) { --delay: 3; }
.input-group:nth-child(4) { --delay: 4; }

.submit-button {
  animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Fokus-Indikatoren für Barrierefreiheit */
.form-input:focus-visible,
.form-textarea:focus-visible,
.submit-button:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Hover-Effekte für Desktop */
@media (hover: hover) {
  .form-input:hover {
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .form-textarea:hover {
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}
</style>


