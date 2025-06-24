<template>
  <div class="dashboard-container">
    <!-- Quick Stats (Nur die wichtigsten 3) -->
    <div class="quick-stats">
      <div class="quick-stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-number">{{ workoutCount }}</div>
          <div class="stat-label">Workouts</div>
        </div>
      </div>
      <div class="quick-stat-card">
        <div class="stat-icon">⏰</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalDuration }}</div>
          <div class="stat-label">Minuten</div>
        </div>
      </div>
      <div class="quick-stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-number">{{ thisWeekWorkouts }}</div>
          <div class="stat-label">Diese Woche</div>
        </div>
      </div>
    </div>

    <!-- Heutige Motivation / Status -->
    <div class="motivation-card">
      <div class="motivation-header">
        <span class="motivation-icon">{{ motivationIcon }}</span>
        <div class="motivation-content">
          <h3>{{ motivationTitle }}</h3>
          <p>{{ motivationMessage }}</p>
        </div>
      </div>
      <div class="motivation-action" v-if="!hasWorkoutToday">
        <button class="motivation-btn" @click="$emit('showAddWorkout')">
          <span>💪</span>
          Jetzt trainieren
        </button>
      </div>
    </div>

    <!-- Letzte Aktivitäten (Kompakt) -->
    <div v-if="workouts.length > 0" class="recent-activities">
      <h3 class="section-title">
        <span class="section-icon">⚡</span>
        Letzte Aktivitäten
      </h3>
      <div class="recent-list">
        <div v-for="(workout, index) in recentWorkouts" :key="index" class="recent-item">
          <span class="recent-emoji">{{ getWorkoutEmoji(workout.type) }}</span>
          <div class="recent-content">
            <h4>{{ workout.type }}</h4>
            <p>{{ workout.duration }} Min • {{ formatDate(workout.date) }}</p>
          </div>
          <div class="recent-badge">{{ getDaysAgo(workout.date) }}</div>
        </div>
      </div>
      <button class="view-all-btn" @click="$emit('navigateToWorkouts')">
        Alle Workouts anzeigen →
      </button>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3 class="section-title">
        <span class="section-icon">🚀</span>
        Schnellaktionen
      </h3>
      <div class="actions-grid">
        <button class="action-card" @click="$emit('showAddWorkout')">
          <span class="action-icon">➕</span>
          <div class="action-content">
            <h4>Workout hinzufügen</h4>
            <p>Neues Training erfassen</p>
          </div>
        </button>
        <button class="action-card" @click="$emit('navigateToStatistics')">
          <span class="action-icon">📊</span>
          <div class="action-content">
            <h4>Statistiken</h4>
            <p>Fortschritte anzeigen</p>
          </div>
        </button>
        <button class="action-card" @click="$emit('navigateToProfile')">
          <span class="action-icon">👤</span>
          <div class="action-content">
            <h4>Profil</h4>
            <p>Erfolge & Einstellungen</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Wöchentliches Ziel (Simpel) -->
    <div class="weekly-goal">
      <h3 class="section-title">
        <span class="section-icon">🏆</span>
        Wochenziel
      </h3>
      <div class="goal-card">
        <div class="goal-header">
          <span class="goal-icon">🎯</span>
          <div class="goal-info">
            <h4>{{ thisWeekWorkouts }} / {{ weeklyGoal }} Workouts</h4>
            <p>{{ goalProgress }}% erreicht</p>
          </div>
        </div>
        <div class="goal-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: goalProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ remainingWorkouts > 0 ? remainingWorkouts + ' noch zu gehen' : 'Ziel erreicht! 🎉' }}</span>
        </div>
      </div>
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

const recentWorkouts = computed(() => {
  return [...props.workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
})

// Motivation
const motivationIcon = computed(() => {
  if (hasWorkoutToday.value) return '🎉'
  if (thisWeekWorkouts.value >= 3) return '🔥'
  if (thisWeekWorkouts.value >= 1) return '💪'
  return '🚀'
})

const motivationTitle = computed(() => {
  if (hasWorkoutToday.value) return 'Großartig gemacht!'
  if (thisWeekWorkouts.value >= 3) return 'Du bist in Fahrt!'
  if (thisWeekWorkouts.value >= 1) return 'Weiter so!'
  return 'Zeit für Bewegung!'
})

const motivationMessage = computed(() => {
  if (hasWorkoutToday.value) return 'Du hast heute bereits trainiert. Morgen geht es weiter!'
  if (thisWeekWorkouts.value >= 3) return 'Du hast diese Woche schon toll trainiert!'
  if (thisWeekWorkouts.value >= 1) return 'Du hast einen guten Start hingelegt.'
  return 'Starte dein erstes Workout der Woche!'
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('de-DE', { 
    day: '2-digit', 
    month: '2-digit'
  })
}

function getDaysAgo(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Heute'
  if (diffDays === 1) return 'Gestern'
  if (diffDays < 7) return `${diffDays}d`
  return `${Math.floor(diffDays / 7)}w`
}
</script>

<style scoped>
.dashboard-container {
  display: grid;
  gap: 2rem;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.quick-stat-card {
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

.quick-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1;
  margin-bottom: 0.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Motivation Card */
.motivation-card {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(88, 86, 214, 0.1));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(0, 122, 255, 0.2);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.motivation-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.motivation-icon {
  font-size: 3rem;
}

.motivation-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.motivation-content p {
  margin: 0;
  color: #86868b;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.motivation-btn {
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
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.motivation-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 1rem 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.section-icon {
  font-size: 1.25rem;
}

/* Recent Activities */
.recent-activities {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f5f5f7;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.recent-emoji {
  font-size: 1.25rem;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.recent-content {
  flex: 1;
}

.recent-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1d1d1f;
  text-transform: capitalize;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.recent-content p {
  margin: 0;
  font-size: 0.8rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.recent-badge {
  background: #007AFF;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.view-all-btn {
  background: transparent;
  border: 1px solid #007AFF;
  color: #007AFF;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.view-all-btn:hover {
  background: #007AFF;
  color: white;
}

/* Quick Actions */
.quick-actions {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.action-card {
  background: #f5f5f7;
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.action-card:hover {
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
  font-size: 1.5rem;
}

.action-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.action-content p {
  margin: 0;
  font-size: 0.75rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Weekly Goal */
.weekly-goal {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.goal-card {
  padding: 1rem;
  background: #f5f5f7;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.goal-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.goal-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.goal-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.goal-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 8px;
  background: #e5e5ea;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #34c759, #30d158);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #86868b;
  text-align: center;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Responsive Design */
@media (max-width: 768px) {
  .quick-stats {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .motivation-header {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    gap: 1.5rem;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .motivation-card,
  .recent-activities,
  .quick-actions,
  .weekly-goal {
    padding: 1.25rem;
  }
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
