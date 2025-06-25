/**
 * Firebase Workout Service
 * 
 * This service handles all workout-related Firebase operations including
 * CRUD operations for workouts stored in Firestore.
 */

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp,
  onSnapshot 
} from 'firebase/firestore'
import { db } from './config'

export interface Workout {
  id?: string
  type: string
  category?: string
  duration: number
  date: string
  notes?: string
  trainingType?: string
  sets?: number
  reps?: number
  userId?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

const WORKOUTS_COLLECTION = 'workouts'

/**
 * Adds a new workout to Firestore
 * @param workout - The workout data to add
 * @param userId - The ID of the user adding the workout
 * @returns Promise with the document ID of the created workout
 */
export async function addWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<string> {
  try {
    const workoutData = {
      ...workout,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, WORKOUTS_COLLECTION), workoutData)
    console.log('Workout added with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error adding workout:', error)
    throw error
  }
}

/**
 * Retrieves all workouts for a specific user
 * @param userId - The ID of the user whose workouts to retrieve
 * @returns Promise with array of workout objects
 */
export async function getUserWorkouts(userId: string): Promise<Workout[]> {
  try {
    const q = query(
      collection(db, WORKOUTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const workouts: Workout[] = []
    
    querySnapshot.forEach((doc) => {
      workouts.push({
        id: doc.id,
        ...doc.data()
      } as Workout)
    })
    
    return workouts
  } catch (error) {
    console.error('Error getting workouts:', error)
    throw error
  }
}

/**
 * Updates an existing workout in Firestore
 * @param workoutId - The ID of the workout to update
 * @param updates - The workout data to update
 * @returns Promise that resolves when the update is complete
 */
export async function updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<void> {
  try {
    const workoutRef = doc(db, WORKOUTS_COLLECTION, workoutId)
    await updateDoc(workoutRef, {
      ...updates,
      updatedAt: Timestamp.now()
    })
    console.log('Workout updated successfully')
  } catch (error) {
    console.error('Error updating workout:', error)
    throw error
  }
}

/**
 * Deletes a workout from Firestore
 * @param workoutId - The ID of the workout to delete
 * @returns Promise that resolves when the deletion is complete
 */
export async function deleteWorkout(workoutId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, WORKOUTS_COLLECTION, workoutId))
    console.log('Workout deleted successfully')
  } catch (error) {
    console.error('Error deleting workout:', error)
    throw error
  }
}

/**
 * Sets up a real-time listener for user workouts
 * @param userId - The ID of the user whose workouts to listen to
 * @param callback - Function to call when workouts change
 * @returns Unsubscribe function to stop listening
 */
export function subscribeToUserWorkouts(
  userId: string, 
  callback: (workouts: Workout[]) => void
): () => void {
  const q = query(
    collection(db, WORKOUTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const workouts: Workout[] = []
    querySnapshot.forEach((doc) => {
      workouts.push({
        id: doc.id,
        ...doc.data()
      } as Workout)
    })
    callback(workouts)
  })
}
