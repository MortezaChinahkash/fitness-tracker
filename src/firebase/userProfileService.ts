/**
 * Firebase User Profile Service
 * 
 * This service handles user profile data storage in Firestore,
 * separate from Firebase Auth user data.
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp,
  type Timestamp 
} from 'firebase/firestore'
import { db } from './config'

export interface UserProfileData {
  uid: string
  name: string
  email: string
  avatar?: string
  memberSince: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
  // Additional profile data can be added here
  preferences?: {
    weeklyGoal?: number
    notifications?: boolean
    theme?: 'light' | 'dark'
  }
}

const USER_PROFILES_COLLECTION = 'userProfiles'

/**
 * Creates or updates a user profile in Firestore
 * @param userId - The user's UID from Firebase Auth
 * @param profileData - The profile data to save
 * @returns Promise that resolves when the profile is saved
 */
export async function saveUserProfile(userId: string, profileData: Omit<UserProfileData, 'uid' | 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const userRef = doc(db, USER_PROFILES_COLLECTION, userId)
    const existingDoc = await getDoc(userRef)
    
    if (existingDoc.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      })
      console.log('User profile updated successfully')
    } else {
      // Create new profile
      await setDoc(userRef, {
        ...profileData,
        uid: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      console.log('User profile created successfully')
    }
  } catch (error) {
    console.error('Error saving user profile:', error)
    throw error
  }
}

/**
 * Retrieves a user profile from Firestore
 * @param userId - The user's UID from Firebase Auth
 * @returns Promise with the user profile data or null if not found
 */
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const userRef = doc(db, USER_PROFILES_COLLECTION, userId)
    const docSnap = await getDoc(userRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData
    } else {
      console.log('No user profile found')
      return null
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

/**
 * Updates specific fields in a user profile
 * @param userId - The user's UID from Firebase Auth
 * @param updates - Partial profile data to update
 * @returns Promise that resolves when the update is complete
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfileData>): Promise<void> {
  try {
    const userRef = doc(db, USER_PROFILES_COLLECTION, userId)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    console.log('User profile updated successfully')
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

/**
 * Creates a default user profile when a user first registers
 * @param userId - The user's UID from Firebase Auth
 * @param email - The user's email address
 * @param displayName - The user's display name
 * @returns Promise that resolves when the profile is created
 */
export async function createDefaultUserProfile(userId: string, email: string, displayName: string): Promise<void> {
  try {
    const defaultProfile: Omit<UserProfileData, 'uid' | 'createdAt' | 'updatedAt'> = {
      name: displayName || 'Fitness Enthusiast',
      email: email,
      memberSince: new Date().getFullYear().toString(),
      preferences: {
        weeklyGoal: 4,
        notifications: true,
        theme: 'light'
      }
    }
    
    await saveUserProfile(userId, defaultProfile)
  } catch (error) {
    console.error('Error creating default user profile:', error)
    throw error
  }
}
