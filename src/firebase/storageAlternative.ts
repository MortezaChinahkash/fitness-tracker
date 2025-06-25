/**
 * Alternative Storage Service using REST API
 * 
 * This service uses Firebase's REST API to bypass CORS issues
 * that sometimes occur with the Firebase SDK.
 */

import { auth } from './config'

const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID
const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET

/**
 * Uploads a file using Firebase REST API
 */
export async function uploadViaRestAPI(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Benutzer nicht authentifiziert')
    }

    // Get auth token
    const token = await currentUser.getIdToken()
    
    // Create file path
    const fileName = `profile-pictures/${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // Upload using REST API
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o?uploadType=media&name=${encodeURIComponent(fileName)}`
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type,
      },
      body: file
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    
    // Get download URL
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(fileName)}?alt=media&token=${result.downloadTokens}`
    
    return downloadUrl
  } catch (error) {
    console.error('REST API upload failed:', error)
    throw error
  }
}

/**
 * Alternative upload method that tries multiple strategies
 */
export async function uploadWithMultipleStrategies(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const strategies = [
    { name: 'REST API', fn: () => uploadViaRestAPI(userId, file, onProgress) },
    { name: 'Base64 Fallback', fn: async () => {
      // Convert to base64 as absolute fallback
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }}
  ]

  let lastError: any

  for (const strategy of strategies) {
    try {
      console.log(`🔄 Trying ${strategy.name}...`)
      const result = await strategy.fn()
      console.log(`✅ ${strategy.name} successful`)
      return result
    } catch (error) {
      console.warn(`❌ ${strategy.name} failed:`, error)
      lastError = error
    }
  }

  throw lastError
}
