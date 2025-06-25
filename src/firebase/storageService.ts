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
    // Create a reference to the file location
    const fileName = `profile-pictures/${userId}/${Date.now()}_${file.name}`
    const storageRef = ref(storage, fileName)
    
    if (onProgress) {
      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file)
      
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            onProgress(progress)
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
      const snapshot = await uploadBytes(storageRef, file)
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
  
  return { valid: true }
}

/**
 * Converts a File to a base64 data URL for preview purposes
 * @param file - The file to convert
 * @returns Promise with the base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
    reader.readAsDataURL(file)
  })
}
