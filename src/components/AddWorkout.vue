<template>
  <form @submit.prevent="addWorkout">
    <input v-model="type" placeholder="Art des Workouts" required />
    <input type="number" v-model="duration" placeholder="Dauer (Minuten)" required />
    <input type="date" v-model="date" required />
    <textarea v-model="notes" placeholder="Notizen (optional)"></textarea>
    <button type="submit">Hinzufügen</button>
  </form>
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
form {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 2rem auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

form input,
form textarea {
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  outline: none;
}

form input:focus,
form textarea:focus {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

form input::placeholder,
form textarea::placeholder {
  color: #666;
  font-weight: 500;
}

form textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
}

form button {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

form button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(238, 90, 36, 0.6);
  background: linear-gradient(135deg, #ee5a24, #ff6b6b);
}

form button:active {
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 600px) {
  form {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 15px;
  }
  
  form input,
  form textarea {
    padding: 0.8rem 1.2rem;
    margin-bottom: 1.2rem;
  }
  
  form button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}

/* Animationen für das Formular */
form {
  animation: slideInUp 0.6s ease-out;
}

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

/* Input-Typ spezifische Styles */
input[type="date"] {
  color: #333;
  font-weight: 500;
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
</style>


