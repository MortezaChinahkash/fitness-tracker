<template>
  <div class="dashboard-container">
    <!-- Welcome Message -->
    <div class="welcome-card">
      <div class="welcome-content">
        <h2>{{ welcomeMessage }}</h2>
        <p>{{ welcomeSubtitle }}</p>
      </div>
      <div class="welcome-icon">{{ welcomeIcon }}</div>
    </div>

    <!-- Today's Focus -->
    <div class="today-focus" v-if="!hasWorkoutToday">
      <div class="focus-header">
        <span class="focus-icon">💪</span>
        <div class="focus-content">
          <h3>Bereit für heute?</h3>
          <p>{{ motivationMessage }}</p>
        </div>
      </div>
      <button class="start-workout-btn" @click="$emit('showAddWorkout')">
        <span>🚀</span>
        Workout starten
      </button>
    </div>

    <!-- Today's Achievement (wenn bereits trainiert) -->
    <div class="achievement-card" v-else>
      <div class="achievement-content">
        <span class="achievement-icon">🎉</span>
        <div>
          <h3>Ziel erreicht!</h3>
          <p>Du hast heute bereits {{ todaysWorkouts }} Workout{{ todaysWorkouts > 1 ? 's' : '' }} absolviert</p>
        </div>
      </div>
    </div>

    <!-- Quick Overview (Nur die wichtigsten 2 Zahlen) -->
    <div class="quick-overview">
      <div class="overview-card">
        <div class="overview-icon">🔥</div>
        <div class="overview-content">
          <div class="overview-number">{{ thisWeekWorkouts }}</div>
          <div class="overview-label">Diese Woche</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="overview-icon">🎯</div>
        <div class="overview-content">
          <div class="overview-number">{{ workoutCount }}</div>
          <div class="overview-label">Gesamt</div>
        </div>
      </div>
    </div>

    <!-- Latest Activity (Nur das letzte Workout) -->
    <div v-if="workouts.length > 0" class="latest-activity">
      <h3 class="section-title">
        <span class="section-icon">⚡</span>
        Letztes Training
      </h3>
      <div class="activity-card">
        <span class="activity-emoji">{{ getWorkoutEmoji(latestWorkout.type) }}</span>
        <div class="activity-content">
          <h4>{{ latestWorkout.type }}</h4>
          <p>{{ latestWorkout.duration }} Minuten • {{ getDaysAgo(latestWorkout.date) }}</p>
        </div>
        <button class="view-more-btn" @click="$emit('navigateToWorkouts')">
          Alle anzeigen
        </button>
      </div>
    </div>

    <!-- Weekly Progress (Vereinfacht) -->
    <div class="weekly-progress">
      <div class="progress-header">
        <h3>Wochenziel</h3>
        <span class="progress-percentage">{{ goalProgress }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: goalProgress + '%' }"></div>
      </div>
      <p class="progress-subtitle">
        {{ remainingWorkouts > 0 ? `Noch ${remainingWorkouts} Workout${remainingWorkouts > 1 ? 's' : ''} bis zum Ziel` : 'Wochenziel erreicht! 🎉' }}
      </p>
    </div>

    <!-- Quick Actions (Reduziert auf das Wichtigste) -->
    <div class="dashboard-actions">
      <button class="action-primary" @click="$emit('showAddWorkout')">
        <span>➕</span>
        Neues Workout
      </button>
      <button class="action-secondary" @click="$emit('navigateToStatistics')">
        <span>📊</span>
        Statistiken
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Workout {
  type: string
  duration: number
  date: string
  notes?: string
}

interface Props {
  workoutCount: number
  totalDuration: number
  workouts: Workout[]
}

const props = defineProps<Props>()

// Events
defineEmits<{
  showAddWorkout: []
  navigateToWorkouts: []
  navigateToStatistics: []
  navigateToProfile: []
}>()

// Berechnungen
const thisWeekWorkouts = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  return props.workouts.filter(w => new Date(w.date) >= startOfWeek).length
})

const hasWorkoutToday = computed(() => {
  const today = new Date().toDateString()
  return props.workouts.some(w => new Date(w.date).toDateString() === today)
})

const todaysWorkouts = computed(() => {
  const today = new Date().toDateString()
  return props.workouts.filter(w => new Date(w.date).toDateString() === today).length
})

const latestWorkout = computed(() => {
  return [...props.workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
})

// Welcome Message
const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Guten Morgen!'
  if (hour < 18) return 'Guten Tag!'
  return 'Guten Abend!'
})

const welcomeSubtitle = computed(() => {
  if (hasWorkoutToday.value) return 'Du hast heute bereits trainiert! 🎉'
  if (thisWeekWorkouts.value >= 3) return 'Du bist diese Woche schon richtig aktiv!'
  return 'Zeit für ein Workout!'
})

const welcomeIcon = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '🌅'
  if (hour < 18) return '☀️'
  return '🌙'
})

// Motivation
const motivationMessage = computed(() => {
  if (thisWeekWorkouts.value === 0) return 'Starte deinen ersten Trainingsag dieser Woche!'
  if (thisWeekWorkouts.value === 1) return 'Großartig! Lass uns weitermachen.'
  if (thisWeekWorkouts.value === 2) return 'Du bist auf einem guten Weg!'
  return 'Du machst das fantastisch!'
})

// Wochenziel
const weeklyGoal = 4 // 4 Workouts pro Woche als Ziel
const goalProgress = computed(() => Math.min(100, Math.round((thisWeekWorkouts.value / weeklyGoal) * 100)))
const remainingWorkouts = computed(() => Math.max(0, weeklyGoal - thisWeekWorkouts.value))

// Helper Functions
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

function getDaysAgo(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Heute'
  if (diffDays === 1) return 'Gestern'
  if (diffDays < 7) return `vor ${diffDays} Tagen`
  return `vor ${Math.floor(diffDays / 7)} Woche${Math.floor(diffDays / 7) > 1 ? 'n' : ''}`
}
</script>

<style scoped>
.dashboard-container {
  display: grid;
  gap: 1.5rem;
  max-width: 100%;
}

/* Welcome Card */
.welcome-card {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(88, 86, 214, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(0, 122, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.welcome-content p {
  margin: 0;
  color: #86868b;
  font-size: 1.1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.welcome-icon {
  font-size: 3rem;
  opacity: 0.8;
}

/* Today's Focus */
.today-focus {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.focus-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.focus-icon {
  font-size: 2.5rem;
}

.focus-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.focus-content p {
  margin: 0;
  color: #86868b;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.start-workout-btn {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  width: 100%;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.start-workout-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

/* Achievement Card */
.achievement-card {
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.1), rgba(48, 209, 88, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.achievement-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.achievement-icon {
  font-size: 2.5rem;
}

.achievement-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.achievement-content p {
  margin: 0;
  color: #86868b;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Quick Overview */
.quick-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.overview-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  text-align: center;
  transition: all 0.2s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06);
}

.overview-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.overview-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1;
  margin-bottom: 0.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.overview-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Latest Activity */
.latest-activity {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 1rem 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.section-icon {
  font-size: 1.1rem;
}

.activity-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f7;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.activity-emoji {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.activity-content {
  flex: 1;
}

.activity-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
  text-transform: capitalize;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.activity-content p {
  margin: 0;
  font-size: 0.85rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.view-more-btn {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.view-more-btn:hover {
  background: #0056b3;
}

/* Weekly Progress */
.weekly-progress {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.progress-percentage {
  font-size: 1.25rem;
  font-weight: 700;
  color: #007AFF;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.progress-bar {
  height: 8px;
  background: #e5e5ea;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #34c759, #30d158);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #86868b;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Dashboard Actions */
.dashboard-actions {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.action-primary {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.action-primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.action-secondary {
  background: rgba(255, 255, 255, 0.9);
  color: #007AFF;
  border: 1px solid rgba(0, 122, 255, 0.3);
  border-radius: 16px;
  padding: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.action-secondary:hover {
  background: #007AFF;
  color: white;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    gap: 1.25rem;
  }
  
  .welcome-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .quick-overview {
    grid-template-columns: 1fr;
  }
  
  .dashboard-actions {
    grid-template-columns: 1fr;
  }
  
  .focus-header,
  .achievement-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    gap: 1rem;
  }
  
  .welcome-card,
  .today-focus,
  .achievement-card,
  .latest-activity,
  .weekly-progress {
    padding: 1.25rem;
  }
  
  .overview-card {
    padding: 1.25rem;
  }
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
