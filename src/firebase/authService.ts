/**
 * Firebase Authentication Service
 * 
 * This service handles all authentication-related Firebase operations including
 * user registration, login, logout, and profile management.
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  updatePassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User
} from 'firebase/auth'
import { auth } from './config'

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

/**
 * Registers a new user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @param displayName - User's display name
 * @returns Promise with the created user
 */
export async function registerUser(email: string, password: string, displayName: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Update the user's display name
    await updateProfile(user, {
      displayName: displayName
    })
    
    console.log('User registered successfully:', user.uid)
    return user
  } catch (error) {
    console.error('Error registering user:', error)
    throw error
  }
}

/**
 * Signs in a user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with the signed-in user
 */
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log('User signed in successfully:', userCredential.user.uid)
    return userCredential.user
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

/**
 * Signs out the current user
 * @returns Promise that resolves when sign out is complete
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth)
    console.log('User signed out successfully')
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

/**
 * Updates the current user's profile information
 * @param updates - Object containing profile updates (displayName, photoURL)
 * @returns Promise that resolves when the update is complete
 */
export async function updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error('No authenticated user found')
    }
    
    // Filter out base64 photoURLs as they're too long for Firebase Auth
    const filteredUpdates: { displayName?: string; photoURL?: string } = {}
    
    if (updates.displayName) {
      filteredUpdates.displayName = updates.displayName
    }
    
    if (updates.photoURL && !updates.photoURL.startsWith('data:')) {
      // Only update photoURL if it's not a base64 string
      filteredUpdates.photoURL = updates.photoURL
    }
    
    // Only update if there are valid updates
    if (Object.keys(filteredUpdates).length > 0) {
      await updateProfile(user, filteredUpdates)
      console.log('User profile updated successfully')
    } else {
      console.log('Skipped Auth profile update (base64 photoURL detected)')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

/**
 * Updates the current user's password
 * @param currentPassword - User's current password for reauthentication
 * @param newPassword - The new password
 * @returns Promise that resolves when the password is updated
 */
export async function updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    const user = auth.currentUser
    if (!user || !user.email) {
      throw new Error('No authenticated user found')
    }
    
    // Reauthenticate the user before updating password
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)
    
    // Update the password
    await updatePassword(user, newPassword)
    console.log('Password updated successfully')
  } catch (error) {
    console.error('Error updating password:', error)
    throw error
  }
}

/**
 * Sends a password reset email to the specified email address
 * @param email - Email address to send reset link to
 * @returns Promise that resolves when the email is sent
 */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email)
    console.log('Password reset email sent successfully')
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

/**
 * Sets up an authentication state listener
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function to stop listening
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

/**
 * Gets the current authenticated user
 * @returns The current user or null if not authenticated
 */
export function getCurrentUser(): User | null {
  return auth.currentUser
}

/**
 * Converts a Firebase User to a UserProfile interface
 * @param user - Firebase User object
 * @returns UserProfile object
 */
export function userToProfile(user: User): UserProfile {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  }
}
