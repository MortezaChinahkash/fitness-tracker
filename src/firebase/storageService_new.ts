/**
 * Firebase Storage Service
 * 
 * This service handles file upload operations for profile pictures
 * and other media files using Firebase Storage.
 */

import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  type UploadTaskSnapshot 
} from 'firebase/storage'
import { storage } from './config'

/**
 * Uploads a profile picture for a user
 * @param userId - The ID of the user uploading the picture
 * @param file - The image file to upload
 * @param onProgress - Optional callback to track upload progress
 * @returns Promise with the download URL of the uploaded image
 */
export async function uploadProfilePicture(
  userId: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Create a reference to the file location with a cleaner path
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `profile-pictures/${userId}/${Date.now()}_${sanitizedFileName}`
    const storageRef = ref(storage, fileName)
    
    if (onProgress) {
      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      })
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            onProgress(Math.round(progress))
          },
          (error) => {
            console.error('Error uploading file:', error)
            reject(error)
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              console.log('File uploaded successfully. Download URL:', downloadURL)
              resolve(downloadURL)
            } catch (error) {
              reject(error)
            }
          }
        )
      })
    } else {
      // Simple upload without progress tracking
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: file.type,
      })
      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log('File uploaded successfully. Download URL:', downloadURL)
      return downloadURL
    }
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    throw error
  }
}

/**
 * Deletes a file from Firebase Storage using its URL
 * @param fileUrl - The download URL of the file to delete
 * @returns Promise that resolves when the file is deleted
 */
export async function deleteFileByUrl(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl)
    await deleteObject(fileRef)
    console.log('File deleted successfully')
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

/**
 * Validates if a file is a valid image format and size
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum allowed file size in MB (default: 5MB)
 * @returns Object with validation result and error message if invalid
 */
export function validateImageFile(file: File, maxSizeInMB: number = 5): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Bitte wählen Sie eine gültige Bilddatei.' }
  }
  
  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    return { valid: false, error: `Die Datei ist zu groß. Bitte wählen Sie ein Bild unter ${maxSizeInMB}MB.` }
  }
  
  // Check if it's a supported image format
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: 'Unterstützte Formate: JPEG, PNG, GIF, WebP' }
  }
  
  return { valid: true }
}

/**
 * Converts a file to base64 data URL for preview purposes
 * @param file - The file to convert
 * @returns Promise with the base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * Generates a unique filename for storage
 * @param originalName - The original filename
 * @param userId - The user ID to include in the filename
 * @returns A unique filename
 */
export function generateUniqueFileName(originalName: string, userId: string): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${userId}_${timestamp}_${randomSuffix}_${sanitizedName}`
}
