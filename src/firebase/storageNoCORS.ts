/**
 * CORS-Free Storage Solution
 * 
 * This service completely bypasses Firebase Storage CORS issues by using
 * alternative storage methods that work reliably in all environments.
 */

import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db, auth } from './config'

/**
 * Uploads profile picture using Firestore as storage backend
 * This completely bypasses Firebase Storage and CORS issues
 */
export async function uploadProfilePictureFirestore(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Benutzer nicht authentifiziert')
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Bitte wählen Sie eine gültige Bilddatei.')
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for Firestore
      throw new Error('Die Datei ist zu groß. Bitte wählen Sie ein Bild unter 2MB.')
    }

    // Simulate progress
    if (onProgress) {
      onProgress(10)
    }

    // Convert to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (onProgress) onProgress(50)
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    if (onProgress) onProgress(75)

    // Save to Firestore
    const userDocRef = doc(db, 'userProfiles', userId)
    await setDoc(userDocRef, {
      avatar: base64,
      avatarUpdatedAt: new Date().toISOString()
    }, { merge: true })

    if (onProgress) onProgress(100)

    console.log('✅ Profile picture saved to Firestore successfully')
    return base64

  } catch (error) {
    console.error('❌ Firestore upload failed:', error)
    throw error
  }
}

/**
 * Ultimate fallback - uses localStorage for development
 */
export async function uploadProfilePictureLocalStorage(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Bitte wählen Sie eine gültige Bilddatei.')
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('Die Datei ist zu groß. Bitte wählen Sie ein Bild unter 5MB.')
    }

    if (onProgress) onProgress(25)

    // Convert to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (onProgress) onProgress(75)
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    // Save to localStorage
    const storageKey = `profile-avatar-${userId}`
    localStorage.setItem(storageKey, base64)
    localStorage.setItem(`${storageKey}-timestamp`, new Date().toISOString())

    if (onProgress) onProgress(100)

    console.log('✅ Profile picture saved to localStorage successfully')
    return base64

  } catch (error) {
    console.error('❌ localStorage upload failed:', error)
    throw error
  }
}

/**
 * Master upload function that tries multiple methods
 */
export async function uploadProfilePictureMaster(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const methods = [
    {
      name: 'Firestore Storage',
      fn: () => uploadProfilePictureFirestore(userId, file, onProgress),
      description: 'Speichert in Firebase Firestore (zuverlässig)'
    },
    {
      name: 'LocalStorage Fallback',
      fn: () => uploadProfilePictureLocalStorage(userId, file, onProgress),
      description: 'Lokaler Speicher (Entwicklungsmodus)'
    }
  ]

  let lastError: any

  for (const method of methods) {
    try {
      console.log(`🔄 Trying ${method.name}...`)
      const result = await method.fn()
      console.log(`✅ ${method.name} successful`)
      
      // Show success message to user
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          alert(`Upload erfolgreich mit ${method.description}`)
        }, 100)
      }
      
      return result
    } catch (error) {
      console.warn(`❌ ${method.name} failed:`, error)
      lastError = error
    }
  }

  throw new Error(`Alle Upload-Methoden fehlgeschlagen. Letzter Fehler: ${lastError?.message || lastError}`)
}

/**
 * Retrieves profile picture from storage
 */
export async function getProfilePicture(userId: string): Promise<string | null> {
  try {
    // Try Firestore first
    const userDocRef = doc(db, 'userProfiles', userId)
    const docSnap = await getDoc(userDocRef)
    
    if (docSnap.exists() && docSnap.data().avatar) {
      return docSnap.data().avatar
    }

    // Try localStorage fallback
    const storageKey = `profile-avatar-${userId}`
    const localAvatar = localStorage.getItem(storageKey)
    if (localAvatar) {
      return localAvatar
    }

    return null
  } catch (error) {
    console.error('Error retrieving profile picture:', error)
    return null
  }
}
