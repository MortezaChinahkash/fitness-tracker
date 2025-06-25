<template>
  <div class="goals-container">
    <!-- Weekly Goal Settings -->
    <div class="weekly-goal-section">
      <h2 class="section-title">
        <span class="section-icon">🎯</span>
        Wochenziel
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
            <button class="goal-btn" @click="decreaseWeeklyGoal" :disabled="weeklyGoal <= 1">-</button>
            <input 
              v-model.number="weeklyGoal" 
              type="number" 
              min="1" 
              max="14" 
              class="goal-input"
            />
            <button class="goal-btn" @click="increaseWeeklyGoal" :disabled="weeklyGoal >= 14">+</button>
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
      </h2>
      <div class="goals-grid">
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
              @click="toggleGoal(goal.id)"
              :class="{ 'active': goal.active }"
            >
              {{ goal.active ? '✓' : '○' }}
            </button>
          </div>
          <div class="goal-progress" v-if="goal.active">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: calculateProgress(goal) + '%' }"></div>
            </div>
            <span class="progress-text">{{ getProgressText(goal) }}</span>
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
        >
          <span class="template-emoji">{{ template.emoji }}</span>
          <div class="template-content">
            <h4>{{ template.title }}</h4>
            <p>{{ template.description }}</p>
          </div>
          <button class="add-btn">+</button>
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
import { ref, computed, watch } from 'vue'

interface Workout {
  type: string
  duration: number
  date: string
  notes?: string
}

interface Goal {
  id: string
  title: string
  description: string
  emoji: string
  type: 'duration' | 'count' | 'distance'
  targetValue: number
  currentValue?: number
  active: boolean
  completed: boolean
  createdAt: string
  deadline?: string
}

interface Props {
  workouts: Workout[]
  initialWeeklyGoal?: number
}

const props = defineProps<Props>()

// Events
const emit = defineEmits<{
  updateWeeklyGoal: [number]
}>()

// Weekly Goal
const weeklyGoal = ref(props.initialWeeklyGoal || 4)

// Watch for changes and emit to parent
watch(weeklyGoal, (newGoal) => {
  emit('updateWeeklyGoal', newGoal)
})

const currentWeekWorkouts = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  return props.workouts.filter(w => new Date(w.date) >= startOfWeek).length
})

const weeklyProgress = computed(() => {
  return Math.min(100, Math.round((currentWeekWorkouts.value / weeklyGoal.value) * 100))
})

function increaseWeeklyGoal() {
  if (weeklyGoal.value < 14) weeklyGoal.value++
}

function decreaseWeeklyGoal() {
  if (weeklyGoal.value > 1) weeklyGoal.value--
}

// Goals Management
const activeGoals = ref<Goal[]>([
  {
    id: '1',
    title: '150 Minuten Training',
    description: 'Diese Woche',
    emoji: '⏰',
    type: 'duration',
    targetValue: 150,
    active: true,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '10 Workouts',
    description: 'Diesen Monat',
    emoji: '💪',
    type: 'count',
    targetValue: 10,
    active: true,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: '30-Tage-Challenge',
    description: 'Jeden Tag aktiv sein',
    emoji: '🔥',
    type: 'count',
    targetValue: 30,
    active: false,
    completed: false,
    createdAt: new Date().toISOString()
  }
])

// Goal Templates
const goalTemplates = ref([
  {
    id: 't1',
    title: '5km Lauf-Challenge',
    description: '5 Läufe á 5km',
    emoji: '🏃‍♂️',
    type: 'count' as const,
    targetValue: 5
  },
  {
    id: 't2',
    title: '300 Minuten Cardio',
    description: 'In 2 Wochen',
    emoji: '❤️',
    type: 'duration' as const,
    targetValue: 300
  },
  {
    id: 't3',
    title: 'Kraft-Woche',
    description: '5 Krafttraining-Sessions',
    emoji: '🏋️‍♀️',
    type: 'count' as const,
    targetValue: 5
  },
  {
    id: 't4',
    title: 'Yoga-Monat',
    description: '15 Yoga-Sessions',
    emoji: '🧘‍♀️',
    type: 'count' as const,
    targetValue: 15
  },
  {
    id: 't5',
    title: '500 Minuten Sport',
    description: 'Diesen Monat',
    emoji: '🎯',
    type: 'duration' as const,
    targetValue: 500
  },
  {
    id: 't6',
    title: 'Streak Master',
    description: '7 Tage in Folge',
    emoji: '🔥',
    type: 'count' as const,
    targetValue: 7
  }
])

// Custom Goal
const customGoal = ref({
  title: '',
  description: '',
  emoji: '🎯',
  type: 'duration' as 'duration' | 'count' | 'distance',
  targetValue: 0
})

const canCreateCustomGoal = computed(() => {
  return customGoal.value.title.trim() && 
         customGoal.value.description.trim() && 
         customGoal.value.targetValue > 0
})

// Functions
function toggleGoal(goalId: string) {
  const goal = activeGoals.value.find(g => g.id === goalId)
  if (goal) {
    goal.active = !goal.active
  }
}

function calculateProgress(goal: Goal): number {
  let currentValue = 0
  
  if (goal.type === 'duration') {
    // Calculate total minutes based on timeframe
    const now = new Date()
    let startDate: Date
    
    if (goal.description.includes('Woche')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    } else if (goal.description.includes('Monat')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Default: last 7 days
    }
    
    currentValue = props.workouts
      .filter(w => new Date(w.date) >= startDate)
      .reduce((sum, w) => sum + w.duration, 0)
  } else if (goal.type === 'count') {
    // Calculate workout count based on timeframe
    const now = new Date()
    let startDate: Date
    
    if (goal.description.includes('Woche')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    } else if (goal.description.includes('Monat')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (goal.description.includes('30')) {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Default: last 7 days
    }
    
    currentValue = props.workouts.filter(w => new Date(w.date) >= startDate).length
  }
  
  goal.currentValue = currentValue
  goal.completed = currentValue >= goal.targetValue
  
  return Math.min(100, Math.round((currentValue / goal.targetValue) * 100))
}

function getProgressText(goal: Goal): string {
  const current = goal.currentValue || 0
  const target = goal.targetValue
  
  if (goal.type === 'duration') {
    return `${current} / ${target} Minuten`
  } else if (goal.type === 'count') {
    return `${current} / ${target} Workouts`
  } else {
    return `${current} / ${target} km`
  }
}

function addGoalFromTemplate(template: any) {
  const newGoal: Goal = {
    id: 'goal_' + Date.now(),
    title: template.title,
    description: template.description,
    emoji: template.emoji,
    type: template.type,
    targetValue: template.targetValue,
    active: true,
    completed: false,
    createdAt: new Date().toISOString()
  }
  
  activeGoals.value.push(newGoal)
}

function createCustomGoal() {
  if (!canCreateCustomGoal.value) return
  
  const newGoal: Goal = {
    id: 'custom_' + Date.now(),
    title: customGoal.value.title,
    description: customGoal.value.description,
    emoji: customGoal.value.emoji,
    type: customGoal.value.type,
    targetValue: customGoal.value.targetValue,
    active: true,
    completed: false,
    createdAt: new Date().toISOString()
  }
  
  activeGoals.value.push(newGoal)
  
  // Reset form
  customGoal.value = {
    title: '',
    description: '',
    emoji: '🎯',
    type: 'duration',
    targetValue: 0
  }
}
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
