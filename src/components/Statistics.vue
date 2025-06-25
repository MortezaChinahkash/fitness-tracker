<template>
  <div class="stats-container">
    <h2 class="section-title">
      <span class="section-icon">📊</span>
      Deine Statistik
    </h2>
    
    <!-- Haupt-Statistiken -->
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
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalWeeks }}</div>
          <div class="stat-label">Aktive Wochen</div>
        </div>
      </div>
    </div>

    <!-- Erweiterte Statistiken -->
    <div class="extended-stats">
      <h3 class="subsection-title">
        <span class="subsection-icon">📈</span>
        Detaillierte Analyse
      </h3>
      
      <div class="extended-grid">
        <div class="extended-card">
          <div class="extended-header">
            <span class="extended-icon">💪</span>
            <h4>Trainingsintensität</h4>
          </div>
          <div class="intensity-stats">
            <div class="intensity-item">
              <span class="intensity-label">Kurz (< 30 Min)</span>
              <div class="intensity-bar">
                <div class="intensity-fill short" :style="{ width: shortWorkoutsPercentage + '%' }"></div>
              </div>
              <span class="intensity-value">{{ shortWorkouts }}</span>
            </div>
            <div class="intensity-item">
              <span class="intensity-label">Mittel (30-60 Min)</span>
              <div class="intensity-bar">
                <div class="intensity-fill medium" :style="{ width: mediumWorkoutsPercentage + '%' }"></div>
              </div>
              <span class="intensity-value">{{ mediumWorkouts }}</span>
            </div>
            <div class="intensity-item">
              <span class="intensity-label">Lang (> 60 Min)</span>
              <div class="intensity-bar">
                <div class="intensity-fill long" :style="{ width: longWorkoutsPercentage + '%' }"></div>
              </div>
              <span class="intensity-value">{{ longWorkouts }}</span>
            </div>
          </div>
        </div>

        <div class="extended-card">
          <div class="extended-header">
            <span class="extended-icon">📊</span>
            <h4>Wochenstatistik</h4>
          </div>
          <div class="weekly-stats">
            <div class="weekly-item">
              <span class="weekly-label">Diese Woche</span>
              <span class="weekly-value">{{ thisWeekWorkouts }} Workouts</span>
              <span class="weekly-duration">{{ thisWeekDuration }} Min</span>
            </div>
            <div class="weekly-item">
              <span class="weekly-label">Letzte Woche</span>
              <span class="weekly-value">{{ lastWeekWorkouts }} Workouts</span>
              <span class="weekly-duration">{{ lastWeekDuration }} Min</span>
            </div>
            <div class="weekly-comparison">
              <span class="comparison-label">Entwicklung</span>
              <span :class="['comparison-value', weeklyTrend >= 0 ? 'positive' : 'negative']">
                {{ weeklyTrend >= 0 ? '+' : '' }}{{ weeklyTrend }}%
                {{ weeklyTrend >= 0 ? '📈' : '📉' }}
              </span>
            </div>
          </div>
        </div>

        <div class="extended-card">
          <div class="extended-header">
            <span class="extended-icon">🏆</span>
            <h4>Bestleistungen</h4>
          </div>
          <div class="records-stats">
            <div class="record-item">
              <span class="record-icon">⏱️</span>
              <div class="record-content">
                <span class="record-label">Längstes Workout</span>
                <span class="record-value">{{ longestWorkout }} Min</span>
              </div>
            </div>
            <div class="record-item">
              <span class="record-icon">🔥</span>
              <div class="record-content">
                <span class="record-label">Beste Woche</span>
                <span class="record-value">{{ bestWeek }} Workouts</span>
              </div>
            </div>
            <div class="record-item">
              <span class="record-icon">📅</span>
              <div class="record-content">
                <span class="record-label">Längste Serie</span>
                <span class="record-value">{{ longestStreak }} Tage</span>
              </div>
            </div>
          </div>
        </div>

        <div class="extended-card">
          <div class="extended-header">
            <span class="extended-icon">🎯</span>
            <h4>Workout-Arten</h4>
          </div>
          <div class="workout-types-stats">
            <div v-for="type in topWorkoutTypes" :key="type.name" class="type-item">
              <span class="type-emoji">{{ type.emoji }}</span>
              <div class="type-content">
                <span class="type-name">{{ type.name }}</span>
                <div class="type-bar">
                  <div class="type-fill" :style="{ width: type.percentage + '%' }"></div>
                </div>
                <span class="type-count">{{ type.count }}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monatliche Übersicht -->
    <div class="monthly-overview">
      <h3 class="subsection-title">
        <span class="subsection-icon">📅</span>
        Monatliche Übersicht
      </h3>
      <div class="monthly-grid">
        <div v-for="month in monthlyData" :key="month.name" class="monthly-card">
          <div class="monthly-header">
            <h4>{{ month.name }}</h4>
            <span class="monthly-year">{{ month.year }}</span>
          </div>
          <div class="monthly-stats">
            <div class="monthly-stat">
              <span class="monthly-icon">💪</span>
              <span class="monthly-value">{{ month.workouts }}</span>
              <span class="monthly-label">Workouts</span>
            </div>
            <div class="monthly-stat">
              <span class="monthly-icon">⏰</span>
              <span class="monthly-value">{{ month.duration }}</span>
              <span class="monthly-label">Minuten</span>
            </div>
          </div>
          <div class="monthly-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: month.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ month.progress }}% vom Ziel</span>
          </div>
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
  trainingType?: string
  sets?: number
  reps?: number
}

interface Props {
  workoutCount: number
  totalDuration: number
  averageDuration: number
  workouts?: Workout[]
}

const props = withDefaults(defineProps<Props>(), {
  workouts: () => []
})

// Erweiterte Berechnungen
const totalWeeks = computed(() => {
  if (props.workouts.length === 0) return 0
  const dates = props.workouts.map(w => new Date(w.date))
  const earliest = new Date(Math.min(...dates.map(d => d.getTime())))
  const latest = new Date(Math.max(...dates.map(d => d.getTime())))
  const weeksDiff = Math.ceil((latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 7))
  return Math.max(1, weeksDiff)
})

// Trainingsintensität
const shortWorkouts = computed(() => props.workouts.filter(w => w.duration < 30).length)
const mediumWorkouts = computed(() => props.workouts.filter(w => w.duration >= 30 && w.duration <= 60).length)
const longWorkouts = computed(() => props.workouts.filter(w => w.duration > 60).length)

const shortWorkoutsPercentage = computed(() => props.workoutCount > 0 ? (shortWorkouts.value / props.workoutCount) * 100 : 0)
const mediumWorkoutsPercentage = computed(() => props.workoutCount > 0 ? (mediumWorkouts.value / props.workoutCount) * 100 : 0)
const longWorkoutsPercentage = computed(() => props.workoutCount > 0 ? (longWorkouts.value / props.workoutCount) * 100 : 0)

// Wochenstatistik
const thisWeekWorkouts = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  return props.workouts.filter(w => new Date(w.date) >= startOfWeek).length
})

const thisWeekDuration = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  return props.workouts
    .filter(w => new Date(w.date) >= startOfWeek)
    .reduce((sum, w) => sum + w.duration, 0)
})

const lastWeekWorkouts = computed(() => {
  const now = new Date()
  const startOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay() - 7))
  const endOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  return props.workouts.filter(w => {
    const date = new Date(w.date)
    return date >= startOfLastWeek && date < endOfLastWeek
  }).length
})

const lastWeekDuration = computed(() => {
  const now = new Date()
  const startOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay() - 7))
  const endOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  return props.workouts
    .filter(w => {
      const date = new Date(w.date)
      return date >= startOfLastWeek && date < endOfLastWeek
    })
    .reduce((sum, w) => sum + w.duration, 0)
})

const weeklyTrend = computed(() => {
  if (lastWeekWorkouts.value === 0) return thisWeekWorkouts.value > 0 ? 100 : 0
  return Math.round(((thisWeekWorkouts.value - lastWeekWorkouts.value) / lastWeekWorkouts.value) * 100)
})

// Bestleistungen
const longestWorkout = computed(() => {
  return props.workouts.length > 0 ? Math.max(...props.workouts.map(w => w.duration)) : 0
})

const bestWeek = computed(() => {
  // Simuliert die beste Woche (in einer echten App würde das aus historischen Daten berechnet)
  return Math.max(7, Math.ceil(props.workoutCount / totalWeeks.value * 1.5))
})

const longestStreak = computed(() => {
  // Simuliert die längste Serie (vereinfachte Berechnung)
  return Math.min(14, Math.ceil(props.workoutCount / 3))
})

// Workout-Arten Analyse
const topWorkoutTypes = computed(() => {
  const typeCount: { [key: string]: number } = {}
  props.workouts.forEach(w => {
    const type = w.type.toLowerCase()
    typeCount[type] = (typeCount[type] || 0) + 1
  })

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

  return Object.entries(typeCount)
    .map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      emoji: emojiMap[type] || '🏃‍♂️',
      percentage: props.workoutCount > 0 ? (count / props.workoutCount) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

// Monatliche Daten
const monthlyData = computed(() => {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni']
  const currentYear = new Date().getFullYear()
  
  return months.map((month, index) => {
    // Simulierte Daten - in einer echten App würden diese aus der Datenbank kommen
    const workouts = Math.floor(Math.random() * 20) + 5
    const duration = workouts * (45 + Math.floor(Math.random() * 30))
    const progress = Math.min(100, (workouts / 20) * 100)
    
    return {
      name: month,
      year: currentYear,
      workouts,
      duration,
      progress: Math.round(progress)
    }
  })
})
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

.subsection-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.01em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.section-icon {
  font-size: 2rem;
}

.subsection-icon {
  font-size: 1.5rem;
}

/* Haupt-Statistiken */
.stats-container {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
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

/* Erweiterte Statistiken */
.extended-stats {
  margin-bottom: 3rem;
}

.extended-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.extended-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s ease;
}

.extended-card:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06);
}

.extended-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.extended-icon {
  font-size: 1.5rem;
}

.extended-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Trainingsintensität */
.intensity-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.intensity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.intensity-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d1d1f;
  min-width: 120px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.intensity-bar {
  flex: 1;
  height: 8px;
  background: #f5f5f7;
  border-radius: 4px;
  overflow: hidden;
}

.intensity-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.intensity-fill.short {
  background: linear-gradient(90deg, #34c759, #30d158);
}

.intensity-fill.medium {
  background: linear-gradient(90deg, #ff9500, #ffb340);
}

.intensity-fill.long {
  background: linear-gradient(90deg, #ff3b30, #ff6961);
}

.intensity-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #86868b;
  min-width: 30px;
  text-align: right;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Wochenstatistik */
.weekly-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.weekly-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f5f5f7;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.weekly-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.weekly-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #007AFF;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.weekly-duration {
  font-size: 0.8rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.weekly-comparison {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(0, 122, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(0, 122, 255, 0.1);
}

.comparison-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.comparison-value {
  font-size: 0.9rem;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.comparison-value.positive {
  color: #34c759;
}

.comparison-value.negative {
  color: #ff3b30;
}

/* Bestleistungen */
.records-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f5f5f7;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.record-icon {
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

.record-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.record-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #007AFF;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Workout-Arten */
.workout-types-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.type-emoji {
  font-size: 1.25rem;
  width: 35px;
  text-align: center;
}

.type-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.type-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d1d1f;
  min-width: 80px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.type-bar {
  flex: 1;
  height: 6px;
  background: #f5f5f7;
  border-radius: 3px;
  overflow: hidden;
}

.type-fill {
  height: 100%;
  background: linear-gradient(90deg, #007AFF, #5856D6);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.type-count {
  font-size: 0.8rem;
  font-weight: 600;
  color: #86868b;
  min-width: 25px;
  text-align: right;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Monatliche Übersicht */
.monthly-overview {
  margin-top: 3rem;
}

.monthly-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.monthly-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s ease;
}

.monthly-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06);
}

.monthly-header {
  margin-bottom: 1rem;
  text-align: center;
}

.monthly-header h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.monthly-year {
  font-size: 0.8rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.monthly-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.monthly-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.monthly-icon {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.monthly-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1;
  margin-bottom: 0.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.monthly-label {
  font-size: 0.75rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.monthly-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 6px;
  background: #f5f5f7;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #34c759, #30d158);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #86868b;
  text-align: center;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .subsection-title {
    font-size: 1.25rem;
  }
  
  .extended-grid {
    grid-template-columns: 1fr;
  }
  
  .monthly-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .intensity-item,
  .type-item {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .intensity-label,
  .type-name {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .subsection-title {
    font-size: 1.1rem;
  }
  
  .extended-card {
    padding: 1.25rem;
  }
  
  .monthly-grid {
    grid-template-columns: 1fr;
  }
}

/* Hover-Effekte */
@media (hover: hover) {
  .stat-card:hover .stat-icon {
    transform: scale(1.05);
  }
  
  .monthly-card:hover .monthly-icon {
    transform: scale(1.1);
  }
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
