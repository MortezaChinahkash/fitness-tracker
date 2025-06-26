import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  QuerySnapshot
} from 'firebase/firestore'
import type { DocumentData, Unsubscribe } from 'firebase/firestore'
import { db } from './config'
import { getCurrentUser } from './authService'

export interface Goal {
  id: string
  title: string
  description: string
  emoji: string
  type: 'duration' | 'count' | 'distance'
  targetValue: number
  currentValue: number
  active: boolean
  completed: boolean
  createdAt: string
  updatedAt: string
  userId: string
  deadline?: string
  category?: string
}

export interface UserGoalSettings {
  id: string
  userId: string
  weeklyGoal: number
  updatedAt: string
}

export interface GoalTemplate {
  id: string
  title: string
  description: string
  emoji: string
  type: 'duration' | 'count' | 'distance'
  targetValue: number
  category?: string
}

// Vordefinierte Ziel-Templates
export const defaultGoalTemplates: Omit<GoalTemplate, 'id'>[] = [
  {
    title: '5km Lauf-Challenge',
    description: '5 Läufe á 5km',
    emoji: '🏃‍♂️',
    type: 'count',
    targetValue: 5,
    category: 'cardio'
  },
  {
    title: '300 Minuten Cardio',
    description: 'In 2 Wochen',
    emoji: '❤️',
    type: 'duration',
    targetValue: 300,
    category: 'cardio'
  },
  {
    title: 'Kraft-Woche',
    description: '5 Krafttraining-Sessions',
    emoji: '🏋️‍♀️',
    type: 'count',
    targetValue: 5,
    category: 'strength'
  },
  {
    title: 'Yoga-Monat',
    description: '15 Yoga-Sessions',
    emoji: '🧘‍♀️',
    type: 'count',
    targetValue: 15,
    category: 'flexibility'
  },
  {
    title: '500 Minuten Sport',
    description: 'Diesen Monat',
    emoji: '🎯',
    type: 'duration',
    targetValue: 500,
    category: 'general'
  },
  {
    title: 'Streak Master',
    description: '7 Tage in Folge',
    emoji: '🔥',
    type: 'count',
    targetValue: 7,
    category: 'consistency'
  },
  {
    title: 'Ausdauer-Boost',
    description: '1000 Minuten Cardio',
    emoji: '💨',
    type: 'duration',
    targetValue: 1000,
    category: 'cardio'
  },
  {
    title: 'Flexibilität Plus',
    description: '20 Stretching-Sessions',
    emoji: '🤸‍♀️',
    type: 'count',
    targetValue: 20,
    category: 'flexibility'
  }
]

// Hilfsfunktionen
function validateGoal(goal: Partial<Goal>): boolean {
  return !!(goal.title && goal.description && goal.emoji && goal.type && goal.targetValue && goal.targetValue > 0)
}

function convertFirestoreGoal(doc: DocumentData): Goal {
  const data = doc.data()
  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    emoji: data.emoji || '🎯',
    type: data.type || 'count',
    targetValue: data.targetValue || 0,
    currentValue: data.currentValue || 0,
    active: data.active || false,
    completed: data.completed || false,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
    userId: data.userId || '',
    deadline: data.deadline?.toDate?.()?.toISOString() || data.deadline,
    category: data.category
  }
}

// Benutzer-Ziele verwalten
export async function getUserGoals(): Promise<Goal[]> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Benutzer nicht angemeldet')
  }

  try {
    const goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    
    const snapshot = await getDocs(goalsQuery)
    return snapshot.docs.map(doc => convertFirestoreGoal(doc))
  } catch (error) {
    console.error('Fehler beim Laden der Ziele:', error)
    throw new Error('Ziele konnten nicht geladen werden')
  }
}

export function subscribeToGoals(callback: (goals: Goal[]) => void): Unsubscribe {
  let unsubscribe: (() => void) | null = null
  
  const setupSubscription = async () => {
    const user = await getCurrentUser()
    if (!user) {
      callback([])
      return
    }

    const goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    unsubscribe = onSnapshot(goalsQuery, (snapshot: QuerySnapshot) => {
      const goals = snapshot.docs.map(doc => convertFirestoreGoal(doc))
      callback(goals)
    }, (error) => {
      console.error('Fehler beim Überwachen der Ziele:', error)
      callback([])
    })
  }

  setupSubscription()

  return () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }
}

export async function addGoal(goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Benutzer nicht angemeldet')
  }

  if (!validateGoal(goalData)) {
    throw new Error('Ungültige Ziel-Daten')
  }

  try {
    const now = new Date()
    const newGoal = {
      ...goalData,
      userId: user.uid,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now)
    }

    const docRef = await addDoc(collection(db, 'goals'), newGoal)
    
    return {
      ...goalData,
      id: docRef.id,
      userId: user.uid,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Ziels:', error)
    throw new Error('Ziel konnte nicht hinzugefügt werden')
  }
}

export async function updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Benutzer nicht angemeldet')
  }

  try {
    const goalRef = doc(db, 'goals', goalId)
    const updateData = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date())
    }
    
    // Entferne id und userId aus den Updates
    delete updateData.id
    delete updateData.userId
    delete updateData.createdAt

    await updateDoc(goalRef, updateData)
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Ziels:', error)
    throw new Error('Ziel konnte nicht aktualisiert werden')
  }
}

export async function deleteGoal(goalId: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Benutzer nicht angemeldet')
  }

  try {
    await deleteDoc(doc(db, 'goals', goalId))
  } catch (error) {
    console.error('Fehler beim Löschen des Ziels:', error)
    throw new Error('Ziel konnte nicht gelöscht werden')
  }
}

export async function toggleGoalActive(goalId: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Benutzer nicht angemeldet')
  }

  try {
    // Zuerst das aktuelle Ziel laden
    const goals = await getUserGoals()
    const goal = goals.find(g => g.id === goalId)
    
    if (!goal) {
      throw new Error('Ziel nicht gefunden')
    }

    await updateGoal(goalId, { active: !goal.active })
  } catch (error) {
    console.error('Fehler beim Umschalten des Ziel-Status:', error)
    throw new Error('Ziel-Status konnte nicht geändert werden')
  }
}

// Wochenziel-Einstellungen
export async function getUserWeeklyGoal(): Promise<number> {
  const user = await getCurrentUser()
  if (!user) {
    return 4 // Standard-Wochenziel
  }

  try {
    const settingsQuery = query(
      collection(db, 'userSettings'),
      where('userId', '==', user.uid)
    )
    
    const snapshot = await getDocs(settingsQuery)
    if (!snapshot.empty) {
      const settings = snapshot.docs[0].data()
      return settings.weeklyGoal || 4
    }
    
    return 4 // Standard-Wochenziel
  } catch (error) {
    console.error('Fehler beim Laden des Wochenziels:', error)
    return 4
  }
}

export async function updateUserWeeklyGoal(weeklyGoal: number): Promise<void> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Benutzer nicht angemeldet')
  }

  if (weeklyGoal < 1 || weeklyGoal > 14) {
    throw new Error('Wochenziel muss zwischen 1 und 14 liegen')
  }

  try {
    // Prüfen, ob bereits Einstellungen existieren
    const settingsQuery = query(
      collection(db, 'userSettings'),
      where('userId', '==', user.uid)
    )
    
    const snapshot = await getDocs(settingsQuery)
    const now = new Date()
    
    if (!snapshot.empty) {
      // Einstellungen aktualisieren
      const settingsDoc = snapshot.docs[0]
      await updateDoc(doc(db, 'userSettings', settingsDoc.id), {
        weeklyGoal,
        updatedAt: Timestamp.fromDate(now)
      })
    } else {
      // Neue Einstellungen erstellen
      await addDoc(collection(db, 'userSettings'), {
        userId: user.uid,
        weeklyGoal,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      })
    }
  } catch (error) {
    console.error('Fehler beim Speichern des Wochenziels:', error)
    throw new Error('Wochenziel konnte nicht gespeichert werden')
  }
}

// Ziel-Fortschritt berechnen
export function calculateGoalProgress(goal: Goal, workouts: any[]): { currentValue: number, progress: number } {
  let currentValue = 0
  
  if (goal.type === 'duration') {
    // Zeitraum basierend auf Beschreibung bestimmen
    const now = new Date()
    let startDate: Date
    
    if (goal.description.toLowerCase().includes('woche')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    } else if (goal.description.toLowerCase().includes('monat')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (goal.description.toLowerCase().includes('30')) {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Standard: letzte 7 Tage
    }
    
    currentValue = workouts
      .filter(w => new Date(w.date) >= startDate)
      .reduce((sum, w) => sum + w.duration, 0)
      
  } else if (goal.type === 'count') {
    // Anzahl basierend auf Zeitraum bestimmen
    const now = new Date()
    let startDate: Date
    
    if (goal.description.toLowerCase().includes('woche')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    } else if (goal.description.toLowerCase().includes('monat')) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (goal.description.toLowerCase().includes('30')) {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Standard: letzte 7 Tage
    }
    
    currentValue = workouts.filter(w => new Date(w.date) >= startDate).length
  }
  
  const progress = Math.min(100, Math.round((currentValue / goal.targetValue) * 100))
  
  return { currentValue, progress }
}

// Ziel-Templates laden
export function getGoalTemplates(): GoalTemplate[] {
  return defaultGoalTemplates.map((template, index) => ({
    ...template,
    id: `template_${index}`
  }))
}

// Ziel aus Template erstellen
export async function createGoalFromTemplate(template: GoalTemplate): Promise<Goal> {
  const goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
    title: template.title,
    description: template.description,
    emoji: template.emoji,
    type: template.type,
    targetValue: template.targetValue,
    currentValue: 0,
    active: true,
    completed: false,
    category: template.category
  }
  
  return await addGoal(goalData)
}

// Ziel-Status automatisch aktualisieren
export async function updateGoalProgress(goalId: string, currentValue: number): Promise<void> {
  const goals = await getUserGoals()
  const goal = goals.find(g => g.id === goalId)
  
  if (!goal) {
    throw new Error('Ziel nicht gefunden')
  }
  
  const completed = currentValue >= goal.targetValue
  
  await updateGoal(goalId, {
    currentValue,
    completed
  })
}

// Alle Ziele mit aktuellem Fortschritt aktualisieren
export async function updateAllGoalsProgress(workouts: any[]): Promise<void> {
  try {
    const goals = await getUserGoals()
    
    for (const goal of goals) {
      if (goal.active && !goal.completed) {
        const { currentValue } = calculateGoalProgress(goal, workouts)
        await updateGoalProgress(goal.id, currentValue)
      }
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Ziel-Fortschritte:', error)
  }
}
