<template>
  <div class="goals-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Ziele werden geladen...</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Weekly Goal Settings -->
      <div class="weekly-goal-section">
        <h2 class="section-title">
          <span class="section-icon">🎯</span>
          Wochenziel
          <span v-if="isLiveUpdating" class="live-indicator">🔄</span>
        </h2>
        <div class="weekly-goal-card">
          <div class="goal-current">
            <div class="current-progress">
              <span class="progress-number">{{ currentWeekWorkouts }}</span>
              <span class="progress-separator">/</span>
              <span class="goal-number">{{ weeklyGoal }}</span>
            </div>
            <p class="progress-label">Workouts diese Woche</p>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: weeklyProgress + '%' }"></div>
            </div>
          </div>
          <div class="goal-settings">
            <label class="goal-label">Wöchentliches Ziel:</label>
            <div class="goal-input-group">
              <button class="goal-btn" @click="decreaseWeeklyGoal" :disabled="weeklyGoal <= 1 || isUpdatingWeeklyGoal">-</button>
              <input 
                v-model.number="weeklyGoal" 
                type="number" 
                min="1" 
                max="14" 
                class="goal-input"
                @blur="saveWeeklyGoal"
                :disabled="isUpdatingWeeklyGoal"
              />
              <button class="goal-btn" @click="increaseWeeklyGoal" :disabled="weeklyGoal >= 14 || isUpdatingWeeklyGoal">+</button>
            </div>
            <p class="goal-suggestion">Empfohlen: 3-5 Workouts pro Woche</p>
          </div>
        </div>
      </div>

      <!-- Active Goals -->
      <div class="active-goals-section">
        <h2 class="section-title">
          <span class="section-icon">🏆</span>
          Aktive Ziele
          <span class="goals-count">({{ activeGoalsCount }})</span>
        </h2>
        
        <div v-if="activeGoals.length === 0" class="empty-state">
          <span class="empty-icon">🎯</span>
          <h3>Keine aktiven Ziele</h3>
          <p>Füge dein erstes Ziel hinzu, um motiviert zu bleiben!</p>
        </div>
        
        <div v-else class="goals-grid">
          <div 
            v-for="goal in activeGoals" 
            :key="goal.id" 
            class="goal-card"
            :class="{ 'completed': goal.completed }"
          >
            <div class="goal-header">
              <span class="goal-emoji">{{ goal.emoji }}</span>
              <div class="goal-info">
                <h3>{{ goal.title }}</h3>
                <p>{{ goal.description }}</p>
              </div>
              <button 
                class="goal-toggle"
                @click="toggleGoalActive(goal.id)"
                :class="{ 'active': goal.active }"
                :disabled="isUpdatingGoal"
              >
                {{ goal.active ? '✓' : '○' }}
              </button>
            </div>
            <div class="goal-progress" v-if="goal.active">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: calculateProgress(goal) + '%' }"></div>
              </div>
              <span class="progress-text">{{ getProgressText(goal) }}</span>
              <div class="goal-actions">
                <button 
                  class="goal-action-btn delete-btn" 
                  @click="deleteGoal(goal.id)"
                  :disabled="isUpdatingGoal"
                  title="Ziel löschen"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Goal Templates -->
      <div class="goal-templates-section">
        <h2 class="section-title">
          <span class="section-icon">✨</span>
          Neue Ziele hinzufügen
        </h2>
        <div class="templates-grid">
          <div 
            v-for="template in goalTemplates" 
            :key="template.id"
            class="template-card"
            @click="addGoalFromTemplate(template)"
            :class="{ 'disabled': isUpdatingGoal }"
          >
            <span class="template-emoji">{{ template.emoji }}</span>
            <div class="template-content">
              <h4>{{ template.title }}</h4>
              <p>{{ template.description }}</p>
            </div>
            <button class="add-btn" :disabled="isUpdatingGoal">+</button>
          </div>
        </div>
      </div>

      <!-- Custom Goal Creator -->
      <div class="custom-goal-section">
        <h2 class="section-title">
          <span class="section-icon">🎨</span>
          Eigenes Ziel erstellen
        </h2>
        <div class="custom-goal-form">
          <div class="form-row">
            <label>Titel:</label>
            <input 
              v-model="customGoal.title" 
              type="text" 
              class="form-input" 
              placeholder="z.B. 100km Laufen"
              :disabled="isUpdatingGoal"
            >
          </div>
          <div class="form-row">
            <label>Beschreibung:</label>
            <input 
              v-model="customGoal.description" 
              type="text" 
              class="form-input" 
              placeholder="z.B. In diesem Monat"
              :disabled="isUpdatingGoal"
            >
          </div>
          <div class="form-row">
            <label>Ziel-Wert:</label>
            <input 
              v-model.number="customGoal.targetValue" 
              type="number" 
              class="form-input" 
              placeholder="100"
              :disabled="isUpdatingGoal"
            >
          </div>
          <div class="form-row">
            <label>Typ:</label>
            <select v-model="customGoal.type" class="form-select" :disabled="isUpdatingGoal">
              <option value="duration">Minuten</option>
              <option value="count">Anzahl Workouts</option>
              <option value="distance">Kilometer (falls verfügbar)</option>
            </select>
          </div>
          <div class="form-row">
            <label>Emoji:</label>
            <input 
              v-model="customGoal.emoji" 
              type="text" 
              class="form-input emoji-input" 
              placeholder="🎯"
              :disabled="isUpdatingGoal"
            >
          </div>
          <button 
            @click="createCustomGoal" 
            class="create-goal-btn"
            :disabled="!canCreateCustomGoal || isUpdatingGoal"
          >
            {{ isUpdatingGoal ? 'Wird erstellt...' : 'Ziel erstellen' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button @click="reloadGoals" class="retry-btn">Erneut versuchen</button>
    </div>
  </div>
</template>
      <h2 class="section-title">
        <span class="section-icon">🎨</span>
        Eigenes Ziel erstellen
      </h2>
      <div class="custom-goal-form">
        <div class="form-row">
          <label>Titel:</label>
          <input v-model="customGoal.title" type="text" class="form-input" placeholder="z.B. 100km Laufen">
        </div>
        <div class="form-row">
          <label>Beschreibung:</label>
          <input v-model="customGoal.description" type="text" class="form-input" placeholder="z.B. In diesem Monat">
        </div>
        <div class="form-row">
          <label>Ziel-Wert:</label>
          <input v-model.number="customGoal.targetValue" type="number" class="form-input" placeholder="100">
        </div>
        <div class="form-row">
          <label>Typ:</label>
          <select v-model="customGoal.type" class="form-select">
            <option value="duration">Minuten</option>
            <option value="count">Anzahl Workouts</option>
            <option value="distance">Kilometer (falls verfügbar)</option>
          </select>
        </div>
        <div class="form-row">
          <label>Emoji:</label>
          <input v-model="customGoal.emoji" type="text" class="form-input emoji-input" placeholder="🎯">
        </div>
        <button 
          @click="createCustomGoal" 
          class="create-goal-btn"
          :disabled="!canCreateCustomGoal"
        >
          Ziel erstellen
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  subscribeToGoals, 
  getUserWeeklyGoal, 
  updateUserWeeklyGoal,
  addGoal,
  deleteGoal as deleteGoalFromFirestore,
  toggleGoalActive as toggleGoalActiveInFirestore,
  getGoalTemplates,
  createGoalFromTemplate,
  calculateGoalProgress,
  type Goal,
  type GoalTemplate
} from '../firebase/goalService'
import { subscribeToUserWorkouts } from '../firebase/workoutService'
import { getCurrentUser } from '../firebase/authService'

// Reactive states
const isLoading = ref(true)
const isLiveUpdating = ref(false)
const isUpdatingGoal = ref(false)
const isUpdatingWeeklyGoal = ref(false)
const error = ref<string | null>(null)

// Data
const goals = ref<Goal[]>([])
const workouts = ref<any[]>([])
const weeklyGoal = ref(4)
const goalTemplates = ref<GoalTemplate[]>([])

// Unsubscribe functions
let unsubscribeGoals: (() => void) | null = null
let unsubscribeWorkouts: (() => void) | null = null

// Custom Goal Form
const customGoal = ref({
  title: '',
  description: '',
  emoji: '🎯',
  type: 'duration' as 'duration' | 'count' | 'distance',
  targetValue: 0
})

// Computed Properties
const activeGoals = computed(() => goals.value.filter(goal => goal.active))
const activeGoalsCount = computed(() => activeGoals.value.length)

const currentWeekWorkouts = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  return workouts.value.filter(w => new Date(w.date) >= startOfWeek).length
})

const weeklyProgress = computed(() => {
  return Math.min(100, Math.round((currentWeekWorkouts.value / weeklyGoal.value) * 100))
})

const canCreateCustomGoal = computed(() => {
  return customGoal.value.title.trim() && 
         customGoal.value.description.trim() && 
         customGoal.value.targetValue > 0
})

// Functions
function calculateProgress(goal: Goal): number {
  const { progress } = calculateGoalProgress(goal, workouts.value)
  return progress
}

function getProgressText(goal: Goal): string {
  const { currentValue } = calculateGoalProgress(goal, workouts.value)
  const target = goal.targetValue
  
  if (goal.type === 'duration') {
    return `${currentValue} / ${target} Minuten`
  } else if (goal.type === 'count') {
    return `${currentValue} / ${target} Workouts`
  } else {
    return `${currentValue} / ${target} km`
  }
}

async function increaseWeeklyGoal() {
  if (weeklyGoal.value < 14 && !isUpdatingWeeklyGoal.value) {
    weeklyGoal.value++
    await saveWeeklyGoal()
  }
}

async function decreaseWeeklyGoal() {
  if (weeklyGoal.value > 1 && !isUpdatingWeeklyGoal.value) {
    weeklyGoal.value--
    await saveWeeklyGoal()
  }
}

async function saveWeeklyGoal() {
  if (isUpdatingWeeklyGoal.value) return
  
  try {
    isUpdatingWeeklyGoal.value = true
    await updateUserWeeklyGoal(weeklyGoal.value)
  } catch (err) {
    console.error('Fehler beim Speichern des Wochenziels:', err)
    error.value = 'Wochenziel konnte nicht gespeichert werden'
  } finally {
    isUpdatingWeeklyGoal.value = false
  }
}

async function toggleGoalActive(goalId: string) {
  if (isUpdatingGoal.value) return
  
  try {
    isUpdatingGoal.value = true
    await toggleGoalActiveInFirestore(goalId)
  } catch (err) {
    console.error('Fehler beim Umschalten des Ziel-Status:', err)
    error.value = 'Ziel-Status konnte nicht geändert werden'
  } finally {
    isUpdatingGoal.value = false
  }
}

async function deleteGoal(goalId: string) {
  if (isUpdatingGoal.value) return
  
  if (!confirm('Möchtest du dieses Ziel wirklich löschen?')) {
    return
  }
  
  try {
    isUpdatingGoal.value = true
    await deleteGoalFromFirestore(goalId)
  } catch (err) {
    console.error('Fehler beim Löschen des Ziels:', err)
    error.value = 'Ziel konnte nicht gelöscht werden'
  } finally {
    isUpdatingGoal.value = false
  }
}

async function addGoalFromTemplate(template: GoalTemplate) {
  if (isUpdatingGoal.value) return
  
  try {
    isUpdatingGoal.value = true
    await createGoalFromTemplate(template)
  } catch (err) {
    console.error('Fehler beim Hinzufügen des Ziels:', err)
    error.value = 'Ziel konnte nicht hinzugefügt werden'
  } finally {
    isUpdatingGoal.value = false
  }
}

async function createCustomGoal() {
  if (!canCreateCustomGoal.value || isUpdatingGoal.value) return
  
  try {
    isUpdatingGoal.value = true
    
    const goalData = {
      title: customGoal.value.title,
      description: customGoal.value.description,
      emoji: customGoal.value.emoji,
      type: customGoal.value.type,
      targetValue: customGoal.value.targetValue,
      currentValue: 0,
      active: true,
      completed: false
    }
    
    await addGoal(goalData)
    
    // Reset form
    customGoal.value = {
      title: '',
      description: '',
      emoji: '🎯',
      type: 'duration',
      targetValue: 0
    }
  } catch (err) {
    console.error('Fehler beim Erstellen des Ziels:', err)
    error.value = 'Ziel konnte nicht erstellt werden'
  } finally {
    isUpdatingGoal.value = false
  }
}

async function loadInitialData() {
  try {
    isLoading.value = true
    error.value = null
    
    // Load goal templates
    goalTemplates.value = getGoalTemplates()
    
    // Load weekly goal
    weeklyGoal.value = await getUserWeeklyGoal()
    
  } catch (err) {
    console.error('Fehler beim Laden der Daten:', err)
    error.value = 'Daten konnten nicht geladen werden'
  } finally {
    isLoading.value = false
  }
}

function setupRealtimeListeners() {
  // Goals listener
  unsubscribeGoals = subscribeToGoals((newGoals: Goal[]) => {
    goals.value = newGoals
    isLiveUpdating.value = true
    setTimeout(() => {
      isLiveUpdating.value = false
    }, 1000)
  })
  
  // Workouts listener for progress calculation
  unsubscribeWorkouts = subscribeToUserWorkouts((newWorkouts: any[]) => {
    workouts.value = newWorkouts
  })
}

async function reloadGoals() {
  await loadInitialData()
  setupRealtimeListeners()
}

// Lifecycle
onMounted(async () => {
  await loadInitialData()
  setupRealtimeListeners()
})

onUnmounted(() => {
  if (unsubscribeGoals) {
    unsubscribeGoals()
  }
  if (unsubscribeWorkouts) {
    unsubscribeWorkouts()
  }
})
</script>

<style scoped>
.goals-container {
  display: grid;
  gap: 2rem;
}

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 1.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.section-icon {
  font-size: 1.5rem;
}

/* Weekly Goal Section */
.weekly-goal-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.goal-current {
  text-align: center;
}

.current-progress {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.progress-number {
  font-size: 3rem;
  font-weight: 700;
  color: #007AFF;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.progress-separator {
  font-size: 2rem;
  color: #86868b;
  font-weight: 300;
}

.goal-number {
  font-size: 2rem;
  font-weight: 500;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.progress-label {
  margin: 0 0 1rem 0;
  color: #86868b;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.progress-bar {
  height: 8px;
  background: #e5e5ea;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007AFF, #5856d6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.goal-settings {
  display: grid;
  gap: 1rem;
}

.goal-label {
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.goal-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.goal-btn {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  font-weight: 600;
}

.goal-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: scale(1.05);
}

.goal-btn:disabled {
  background: #e5e5ea;
  color: #86868b;
  cursor: not-allowed;
}

.goal-input {
  background: #f5f5f7;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  width: 80px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.goal-suggestion {
  margin: 0;
  font-size: 0.85rem;
  color: #86868b;
  font-style: italic;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Active Goals */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.goal-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.2s ease;
}

.goal-card.completed {
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.1), rgba(48, 209, 88, 0.1));
  border-color: rgba(52, 199, 89, 0.3);
}

.goal-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.goal-emoji {
  font-size: 2rem;
}

.goal-info {
  flex: 1;
}

.goal-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.goal-info p {
  margin: 0;
  color: #86868b;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.goal-toggle {
  background: transparent;
  border: 2px solid #e5e5ea;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  color: #86868b;
}

.goal-toggle.active {
  background: #34c759;
  border-color: #34c759;
  color: white;
}

.goal-progress {
  margin-top: 1rem;
}

.progress-text {
  font-size: 0.85rem;
  color: #86868b;
  text-align: center;
  display: block;
  margin-top: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Templates */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.template-card {
  background: #f5f5f7;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.template-card:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.template-emoji {
  font-size: 1.5rem;
}

.template-content {
  flex: 1;
}

.template-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.template-content p {
  margin: 0;
  font-size: 0.8rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.add-btn {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  font-weight: 600;
}

.add-btn:hover {
  background: #0056b3;
  transform: scale(1.1);
}

/* Custom Goal Form */
.custom-goal-form {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  display: grid;
  gap: 1rem;
}

.form-row {
  display: grid;
  gap: 0.5rem;
}

.form-row label {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.form-input, .form-select {
  background: #f5f5f7;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  transition: all 0.2s ease;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #007AFF;
  background: white;
}

.emoji-input {
  width: 60px;
  text-align: center;
  font-size: 1.2rem;
}

.create-goal-btn {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.create-goal-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.create-goal-btn:disabled {
  background: #e5e5ea;
  color: #86868b;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .weekly-goal-card {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .goals-grid {
    grid-template-columns: 1fr;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
