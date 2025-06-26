/**
 * Firebase Statistics Service
 * 
 * This service provides advanced analytics and statistics calculations
 * for workout data stored in Firebase Firestore.
 */

import type { Workout } from './workoutService'

export interface WorkoutStats {
  totalWorkouts: number
  totalDuration: number
  averageDuration: number
  totalActiveWeeks: number
  longestWorkout: number
  shortestWorkout: number
  mostFrequentType: string
  currentStreak: number
  longestStreak: number
  bestWeek: number
}

export interface WeeklyStats {
  weekNumber: number
  year: number
  workouts: number
  duration: number
  startDate: Date
  endDate: Date
}

export interface MonthlyStats {
  month: number
  year: number
  workouts: number
  duration: number
  averageDuration: number
  uniqueDays: number
  topWorkoutType: string
}

export interface WorkoutTypeStats {
  type: string
  count: number
  totalDuration: number
  averageDuration: number
  percentage: number
  lastWorkout: Date
}

/**
 * Helper function to get the start of a week (Monday)
 */
function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday as first day
  return new Date(d.setDate(diff))
}

/**
 * Helper function to get week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * Calculates comprehensive workout statistics for a user
 */
export function calculateWorkoutStats(workouts: Workout[]): WorkoutStats {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      averageDuration: 0,
      totalActiveWeeks: 0,
      longestWorkout: 0,
      shortestWorkout: 0,
      mostFrequentType: '',
      currentStreak: 0,
      longestStreak: 0,
      bestWeek: 0
    }
  }

  const durations = workouts.map(w => Number(w.duration))
  const totalDuration = durations.reduce((sum, duration) => sum + duration, 0)
  
  // Calculate weeks
  const dates = workouts.map(w => {
    if (w.createdAt && typeof w.createdAt.toDate === 'function') {
      return w.createdAt.toDate()
    }
    return new Date(w.date)
  }).filter(d => !isNaN(d.getTime()))

  const uniqueWeeks = new Set(dates.map(d => `${d.getFullYear()}-W${getWeekNumber(d)}`))
  
  // Calculate most frequent type
  const typeCount: { [key: string]: number } = {}
  workouts.forEach(w => {
    const type = w.category || w.type
    typeCount[type] = (typeCount[type] || 0) + 1
  })
  
  const mostFrequentType = Object.entries(typeCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || ''

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(workouts)
  
  // Calculate best week
  const bestWeek = calculateBestWeek(workouts)

  return {
    totalWorkouts: workouts.length,
    totalDuration,
    averageDuration: Math.round(totalDuration / workouts.length),
    totalActiveWeeks: uniqueWeeks.size,
    longestWorkout: Math.max(...durations),
    shortestWorkout: Math.min(...durations),
    mostFrequentType,
    currentStreak,
    longestStreak,
    bestWeek
  }
}

/**
 * Calculates current and longest workout streaks
 */
export function calculateStreaks(workouts: Workout[]): { currentStreak: number, longestStreak: number } {
  if (workouts.length === 0) return { currentStreak: 0, longestStreak: 0 }

  // Get unique workout days, sorted
  const workoutDays = [...new Set(workouts.map(w => {
    const date = w.createdAt && typeof w.createdAt.toDate === 'function' 
      ? w.createdAt.toDate() 
      : new Date(w.date)
    return date.toDateString()
  }))].map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime())

  let longestStreak = 0
  let currentStreak = 1

  // Calculate longest streak
  for (let i = 1; i < workoutDays.length; i++) {
    const daysDiff = Math.floor((workoutDays[i].getTime() - workoutDays[i-1].getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 1) {
      currentStreak++
    } else {
      longestStreak = Math.max(longestStreak, currentStreak)
      currentStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak)

  // Calculate current streak (from today backwards)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let currentStreakFromToday = 0
  const lastWorkoutDay = workoutDays[workoutDays.length - 1]
  
  if (lastWorkoutDay) {
    const daysSinceLastWorkout = Math.floor((today.getTime() - lastWorkoutDay.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLastWorkout <= 1) {
      // Count backwards from the last workout day
      for (let i = workoutDays.length - 1; i >= 0; i--) {
        const currentDay = workoutDays[i]
        const expectedDay = new Date(today.getTime() - currentStreakFromToday * 24 * 60 * 60 * 1000)
        expectedDay.setHours(0, 0, 0, 0)
        
        const diff = Math.abs(currentDay.getTime() - expectedDay.getTime()) / (1000 * 60 * 60 * 24)
        
        if (diff <= 1) {
          currentStreakFromToday++
        } else {
          break
        }
      }
    }
  }

  return { currentStreak: currentStreakFromToday, longestStreak }
}

/**
 * Calculates the best week (most workouts in a single week)
 */
export function calculateBestWeek(workouts: Workout[]): number {
  if (workouts.length === 0) return 0

  const weeklyCount: { [key: string]: number } = {}
  
  workouts.forEach(w => {
    const date = w.createdAt && typeof w.createdAt.toDate === 'function' 
      ? w.createdAt.toDate() 
      : new Date(w.date)
    
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`
    weeklyCount[weekKey] = (weeklyCount[weekKey] || 0) + 1
  })

  return Object.values(weeklyCount).length > 0 ? Math.max(...Object.values(weeklyCount)) : 0
}

/**
 * Gets workout statistics grouped by week
 */
export function getWeeklyStats(workouts: Workout[], weeksBack: number = 12): WeeklyStats[] {
  const weeks: WeeklyStats[] = []
  const today = new Date()
  
  for (let i = 0; i < weeksBack; i++) {
    const weekStart = getStartOfWeek(new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000))
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
    
    const weekWorkouts = workouts.filter(w => {
      const date = w.createdAt && typeof w.createdAt.toDate === 'function' 
        ? w.createdAt.toDate() 
        : new Date(w.date)
      return date >= weekStart && date <= weekEnd
    })
    
    weeks.unshift({
      weekNumber: getWeekNumber(weekStart),
      year: weekStart.getFullYear(),
      workouts: weekWorkouts.length,
      duration: weekWorkouts.reduce((sum, w) => sum + Number(w.duration), 0),
      startDate: weekStart,
      endDate: weekEnd
    })
  }
  
  return weeks
}

/**
 * Gets workout statistics grouped by month
 */
export function getMonthlyStats(workouts: Workout[], monthsBack: number = 12): MonthlyStats[] {
  const months: MonthlyStats[] = []
  const today = new Date()
  
  for (let i = 0; i < monthsBack; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1)
    
    const monthWorkouts = workouts.filter(w => {
      const date = w.createdAt && typeof w.createdAt.toDate === 'function' 
        ? w.createdAt.toDate() 
        : new Date(w.date)
      return date >= month && date < nextMonth
    })
    
    // Calculate unique days
    const uniqueDays = new Set(monthWorkouts.map(w => {
      const date = w.createdAt && typeof w.createdAt.toDate === 'function' 
        ? w.createdAt.toDate() 
        : new Date(w.date)
      return date.toDateString()
    })).size
    
    // Calculate top workout type
    const typeCount: { [key: string]: number } = {}
    monthWorkouts.forEach(w => {
      const type = w.category || w.type
      typeCount[type] = (typeCount[type] || 0) + 1
    })
    
    const topWorkoutType = Object.entries(typeCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || ''
    
    const totalDuration = monthWorkouts.reduce((sum, w) => sum + Number(w.duration), 0)
    
    months.unshift({
      month: month.getMonth(),
      year: month.getFullYear(),
      workouts: monthWorkouts.length,
      duration: totalDuration,
      averageDuration: monthWorkouts.length > 0 ? Math.round(totalDuration / monthWorkouts.length) : 0,
      uniqueDays,
      topWorkoutType
    })
  }
  
  return months
}

/**
 * Gets detailed statistics for each workout type
 */
export function getWorkoutTypeStats(workouts: Workout[]): WorkoutTypeStats[] {
  const typeStats: { [key: string]: {
    count: number
    totalDuration: number
    lastWorkout: Date
  } } = {}
  
  workouts.forEach(w => {
    const type = w.category || w.type
    const duration = Number(w.duration)
    const date = w.createdAt && typeof w.createdAt.toDate === 'function' 
      ? w.createdAt.toDate() 
      : new Date(w.date)
    
    if (!typeStats[type]) {
      typeStats[type] = {
        count: 0,
        totalDuration: 0,
        lastWorkout: date
      }
    }
    
    typeStats[type].count++
    typeStats[type].totalDuration += duration
    
    if (date > typeStats[type].lastWorkout) {
      typeStats[type].lastWorkout = date
    }
  })
  
  const totalWorkouts = workouts.length
  
  return Object.entries(typeStats).map(([type, stats]) => ({
    type,
    count: stats.count,
    totalDuration: stats.totalDuration,
    averageDuration: Math.round(stats.totalDuration / stats.count),
    percentage: Math.round((stats.count / totalWorkouts) * 100),
    lastWorkout: stats.lastWorkout
  })).sort((a, b) => b.count - a.count)
}

/**
 * Gets workout frequency by day of week
 */
export function getWorkoutFrequencyByDay(workouts: Workout[]): { [key: string]: number } {
  const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  const frequency: { [key: string]: number } = {}
  
  // Initialize all days
  dayNames.forEach(day => frequency[day] = 0)
  
  workouts.forEach(w => {
    const date = w.createdAt && typeof w.createdAt.toDate === 'function' 
      ? w.createdAt.toDate() 
      : new Date(w.date)
    
    const dayName = dayNames[date.getDay()]
    frequency[dayName]++
  })
  
  return frequency
}

/**
 * Gets workout time distribution (hour of day)
 */
export function getWorkoutTimeDistribution(workouts: Workout[]): { [key: string]: number } {
  const timeSlots = {
    'Früh (5-9)': 0,
    'Vormittag (9-12)': 0,
    'Mittag (12-15)': 0,
    'Nachmittag (15-18)': 0,
    'Abend (18-21)': 0,
    'Nacht (21-5)': 0
  }
  
  workouts.forEach(w => {
    const date = w.createdAt && typeof w.createdAt.toDate === 'function' 
      ? w.createdAt.toDate() 
      : new Date(w.date)
    
    const hour = date.getHours()
    
    if (hour >= 5 && hour < 9) timeSlots['Früh (5-9)']++
    else if (hour >= 9 && hour < 12) timeSlots['Vormittag (9-12)']++
    else if (hour >= 12 && hour < 15) timeSlots['Mittag (12-15)']++
    else if (hour >= 15 && hour < 18) timeSlots['Nachmittag (15-18)']++
    else if (hour >= 18 && hour < 21) timeSlots['Abend (18-21)']++
    else timeSlots['Nacht (21-5)']++
  })
  
  return timeSlots
}
