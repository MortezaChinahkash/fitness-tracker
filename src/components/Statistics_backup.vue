<template>
  <div class="stats-container">
    <!-- Loading State -->
    <div v-if="user && isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Statistiken werden geladen...</p>
    </div>
    
    <!-- Statistics Content -->
    <div v-else>
      <h2 class="section-title">
        <span class="section-icon">📊</span>
        Deine Statistik
        <span v-if="user && liveWorkouts.length > 0" class="live-indicator">🔴 Live</span>
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
    </div> <!-- Ende v-else -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useFirebase } from '../composables/useFirebase'
import type { Workout } from '../firebase/workoutService'

interface Props {
  workoutCount?: number
  totalDuration?: number
  averageDuration?: number
  workouts?: Workout[]
}

const props = withDefaults(defineProps<Props>(), {
  workouts: () => []
})

// Firebase Integration für Live-Updates
const { user } = useFirebase()
const liveWorkouts = ref<Workout[]>([])
const isLoading = ref(true)
let unsubscribe: (() => void) | null = null

// Live-Daten von Firebase abrufen
onMounted(() => {
  if (user.value) {
    setupRealtimeListener()
  } else {
    // Kein User eingeloggt, lade keine Daten
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

// Watch für User-Änderungen
watch(user, (newUser) => {
  if (unsubscribe) {
    unsubscribe()
  }
  
  if (newUser) {
    setupRealtimeListener()
  } else {
    liveWorkouts.value = []
    isLoading.value = false
  }
})

function setupRealtimeListener() {
  if (!user.value) return
  
  try {
    const workoutsRef = collection(db, 'workouts')
    const q = query(
      workoutsRef, 
      where('userId', '==', user.value.uid),
      orderBy('createdAt', 'desc')
    )
    
    unsubscribe = onSnapshot(q, (snapshot) => {
      const workouts: Workout[] = []
      snapshot.forEach((doc) => {
        workouts.push({ id: doc.id, ...doc.data() } as Workout)
      })
      liveWorkouts.value = workouts
      isLoading.value = false
      console.log('🔄 Statistics updated with', workouts.length, 'workouts')
    }, (error) => {
      console.error('Error listening to workouts:', error)
      isLoading.value = false
    })
  } catch (error) {
    console.error('Error setting up realtime listener:', error)
    isLoading.value = false
  }
}

// Kombinierte Workout-Daten (Props deaktivieren wenn Live-Daten verfügbar)
const workouts = computed(() => {
  // Nur Live-Daten verwenden wenn eingeloggt, ansonsten Props
  return user.value ? liveWorkouts.value : (props.workouts || [])
})

// Live-berechnete Statistiken
const liveWorkoutCount = computed(() => workouts.value.length)
const liveTotalDuration = computed(() => 
  workouts.value.reduce((sum, w) => sum + Number(w.duration || 0), 0)
)
const liveAverageDuration = computed(() => 
  liveWorkoutCount.value > 0 ? Math.round(liveTotalDuration.value / liveWorkoutCount.value) : 0
)

// Verwende Live-Daten falls verfügbar, ansonsten Props
const workoutCount = computed(() => 
  user.value ? liveWorkoutCount.value : (props.workoutCount || 0)
)
const totalDuration = computed(() => 
  user.value ? liveTotalDuration.value : (props.totalDuration || 0)
)
const averageDuration = computed(() => 
  user.value ? liveAverageDuration.value : (props.averageDuration || 0)
)

// Helper Funktionen
function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// Erweiterte Firebase-basierte Berechnungen
const totalWeeks = computed(() => {
  if (workouts.value.length === 0) return 0
  
  // Alle Workout-Daten zu Date-Objekten konvertieren
  const dates = workouts.value.map(w => {
    // Firebase Timestamp zu Date konvertieren falls nötig
    if (w.createdAt && typeof w.createdAt.toDate === 'function') {
      return w.createdAt.toDate()
    }
    return new Date(w.date)
  }).filter(d => !isNaN(d.getTime()))
  
  if (dates.length === 0) return 0
  
  const earliest = new Date(Math.min(...dates.map(d => d.getTime())))
  const latest = new Date(Math.max(...dates.map(d => d.getTime())))
  const weeksDiff = Math.ceil((latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 7))
  return Math.max(1, weeksDiff)
})

// Trainingsintensität basierend auf echten Firebase-Daten
const shortWorkouts = computed(() => workouts.value.filter(w => Number(w.duration) < 30).length)
const mediumWorkouts = computed(() => workouts.value.filter(w => Number(w.duration) >= 30 && Number(w.duration) <= 60).length)
const longWorkouts = computed(() => workouts.value.filter(w => Number(w.duration) > 60).length)

const shortWorkoutsPercentage = computed(() => workoutCount.value > 0 ? (shortWorkouts.value / workoutCount.value) * 100 : 0)
const mediumWorkoutsPercentage = computed(() => workoutCount.value > 0 ? (mediumWorkouts.value / workoutCount.value) * 100 : 0)
const longWorkoutsPercentage = computed(() => workoutCount.value > 0 ? (longWorkouts.value / workoutCount.value) * 100 : 0)

// Wochenstatistik mit korrekter Datumsbehandlung
const thisWeekWorkouts = computed(() => {
  const now = new Date()
  const startOfWeek = getStartOfWeek(now)
  
  return workouts.value.filter(w => {
    const workoutDate = w.createdAt && typeof w.createdAt.toDate === 'function' 
      ? w.createdAt.toDate() 
      : new Date(w.date)
    return workoutDate >= startOfWeek
  }).length
})

const thisWeekDuration = computed(() => {
  const now = new Date()
  const startOfWeek = getStartOfWeek(now)
  
  return workouts.value
    .filter(w => {
      const workoutDate = w.createdAt && typeof w.createdAt.toDate === 'function' 
        ? w.createdAt.toDate() 
        : new Date(w.date)
      return workoutDate >= startOfWeek
    })
    .reduce((sum, w) => sum + Number(w.duration), 0)
})

const lastWeekWorkouts = computed(() => {
  const now = new Date()
  const startOfThisWeek = getStartOfWeek(now)
  const startOfLastWeek = new Date(startOfThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  return workouts.value.filter(w => {
    const workoutDate = w.createdAt && typeof w.createdAt.toDate === 'function' 
      ? w.createdAt.toDate() 
      : new Date(w.date)
    return workoutDate >= startOfLastWeek && workoutDate < startOfThisWeek
  }).length
})

const lastWeekDuration = computed(() => {
  const now = new Date()
  const startOfThisWeek = getStartOfWeek(now)
  const startOfLastWeek = new Date(startOfThisWeek.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  return workouts.value
    .filter(w => {
      const workoutDate = w.createdAt && typeof w.createdAt.toDate === 'function' 
        ? w.createdAt.toDate() 
        : new Date(w.date)
      return workoutDate >= startOfLastWeek && workoutDate < startOfThisWeek
    })
    .reduce((sum, w) => sum + Number(w.duration), 0)
})

const weeklyTrend = computed(() => {
  if (lastWeekWorkouts.value === 0) return thisWeekWorkouts.value > 0 ? 100 : 0
  return Math.round(((thisWeekWorkouts.value - lastWeekWorkouts.value) / lastWeekWorkouts.value) * 100)
})

// Bestleistungen basierend auf echten Daten
const longestWorkout = computed(() => {
  return workouts.value.length > 0 ? Math.max(...workouts.value.map(w => Number(w.duration))) : 0
})

const bestWeek = computed(() => {
  if (workouts.value.length === 0) return 0
  
  // Workouts nach Wochen gruppieren
  const weeklyWorkouts: { [key: string]: number } = {}
  
  workouts.value.forEach(w => {
    const workoutDate = w.createdAt && typeof w.createdAt.toDate === 'function' 
      ? w.createdAt.toDate() 
      : new Date(w.date)
    
    const weekKey = `${workoutDate.getFullYear()}-W${getWeekNumber(workoutDate)}`
    weeklyWorkouts[weekKey] = (weeklyWorkouts[weekKey] || 0) + 1
  })
  
  return Object.values(weeklyWorkouts).length > 0 ? Math.max(...Object.values(weeklyWorkouts)) : 0
})

const longestStreak = computed(() => {
  if (workouts.value.length === 0) return 0
  
  // Workouts nach Datum sortieren
  const sortedWorkouts = [...workouts.value].sort((a, b) => {
    const dateA = a.createdAt && typeof a.createdAt.toDate === 'function' 
      ? a.createdAt.toDate() 
      : new Date(a.date)
    const dateB = b.createdAt && typeof b.createdAt.toDate === 'function' 
      ? b.createdAt.toDate() 
      : new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })
  
  // Einzigartige Tage extrahieren
  const workoutDays = [...new Set(sortedWorkouts.map(w => {
    const workoutDate = w.createdAt && typeof w.createdAt.toDate === 'function' 
      ? w.createdAt.toDate() 
      : new Date(w.date)
    return workoutDate.toDateString()
  }))].map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime())
  
  let maxStreak = 0
  let currentStreak = 1
  
  for (let i = 1; i < workoutDays.length; i++) {
    const daysDiff = Math.floor((workoutDays[i].getTime() - workoutDays[i-1].getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 1) {
      currentStreak++
    } else {
      maxStreak = Math.max(maxStreak, currentStreak)
      currentStreak = 1
    }
  }
  
  return Math.max(maxStreak, currentStreak)
})

// Workout-Arten Analyse mit verbesserter Kategorisierung
const topWorkoutTypes = computed(() => {
  const typeCount: { [key: string]: number } = {}
  
  workouts.value.forEach(w => {
    // Kategorie verwenden falls vorhanden, ansonsten Type
    const type = (w.category || w.type).toLowerCase()
    typeCount[type] = (typeCount[type] || 0) + 1
  })

  const emojiMap: { [key: string]: string } = {
    'cardio': '🏃‍♂️',
    'laufen': '🏃‍♂️',
    'joggen': '🏃‍♂️',
    'krafttraining': '💪',
    'kraft': '💪',
    'gewichte': '🏋️‍♀️',
    'yoga': '🧘‍♀️',
    'pilates': '🤸‍♀️',
    'radfahren': '🚴‍♂️',
    'cycling': '🚴‍♂️',
    'schwimmen': '🏊‍♂️',
    'swimming': '🏊‍♀️',
    'wandern': '🥾',
    'hiking': '🥾',
    'fußball': '⚽',
    'football': '⚽',
    'basketball': '🏀',
    'tennis': '🎾',
    'boxen': '🥊',
    'boxing': '�',
    'crossfit': '🏋️‍♀️',
    'hiit': '🔥',
    'stretching': '🤸‍♀️',
    'dehnen': '🤸‍♀️',
    'functional': '⚡',
    'bodyweight': '🏃‍♂️'
  }

  return Object.entries(typeCount)
    .map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      emoji: emojiMap[type] || '🏃‍♂️',
      percentage: workoutCount.value > 0 ? (count / workoutCount.value) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

// Monatliche Daten basierend auf echten Firebase-Daten
const monthlyData = computed(() => {
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]
  
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  
  // Letzten 6 Monate berechnen
  const months = []
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear
    months.push({ monthIndex, year, name: monthNames[monthIndex] })
  }
  
  return months.map(({ monthIndex, year, name }) => {
    // Workouts für diesen Monat filtern
    const monthWorkouts = workouts.value.filter(w => {
      const workoutDate = w.createdAt && typeof w.createdAt.toDate === 'function' 
        ? w.createdAt.toDate() 
        : new Date(w.date)
      return workoutDate.getFullYear() === year && workoutDate.getMonth() === monthIndex
    })
    
    const workoutCount = monthWorkouts.length
    const duration = monthWorkouts.reduce((sum, w) => sum + Number(w.duration), 0)
    
    // Fortschritt basierend auf einem Ziel von 20 Workouts pro Monat
    const monthlyGoal = 20
    const progress = Math.min(100, (workoutCount / monthlyGoal) * 100)
    
    return {
      name,
      year,
      workouts: workoutCount,
      duration,
      progress: Math.round(progress)
    }
  })
})
</script>

<style scoped>
/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f5f5f7;
  border-top: 4px solid #007AFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #86868b;
  font-size: 1rem;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Live Indicator */
.live-indicator {
  font-size: 0.8rem;
  color: #ff3b30;
  margin-left: 1rem;
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 59, 48, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 59, 48, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

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
