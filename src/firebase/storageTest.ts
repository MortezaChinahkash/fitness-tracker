/**
 * Firebase Storage Test Utility
 * 
 * This file contains utility functions to test Firebase Storage connectivity
 * and configuration without going through the full UI.
 */

import { ref, getDownloadURL, listAll } from 'firebase/storage'
import { storage } from './config'

/**
 * Tests basic Firebase Storage connectivity
 * @returns Promise that resolves if storage is accessible
 */
export async function testStorageConnectivity(): Promise<boolean> {
  try {
    const storageRef = ref(storage, 'test')
    // Try to list contents (this will work even if the folder is empty)
    await listAll(storageRef)
    console.log('✅ Firebase Storage connectivity test passed')
    return true
  } catch (error) {
    console.error('❌ Firebase Storage connectivity test failed:', error)
    return false
  }
}

/**
 * Tests if we can create references and check permissions
 * @param userId - User ID to test with
 * @returns Promise that resolves if basic operations work
 */
export async function testStoragePermissions(userId: string): Promise<boolean> {
  try {
    const profilePictureRef = ref(storage, `profile-pictures/${userId}/test.jpg`)
    
    // This should work even if the file doesn't exist
    // It will throw an error only if there are permission issues
    try {
      await getDownloadURL(profilePictureRef)
    } catch (error: any) {
      // If the error is "object doesn't exist", that's actually good - means permissions are OK
      if (error.code === 'storage/object-not-found') {
        console.log('✅ Firebase Storage permissions test passed (file not found is expected)')
        return true
      } else {
        throw error
      }
    }
    
    console.log('✅ Firebase Storage permissions test passed')
    return true
  } catch (error) {
    console.error('❌ Firebase Storage permissions test failed:', error)
    return false
  }
}

/**
 * Runs all storage tests
 * @param userId - Optional user ID for permission tests
 */
export async function runStorageTests(userId?: string): Promise<void> {
  console.log('🧪 Running Firebase Storage tests...')
  
  const connectivityOk = await testStorageConnectivity()
  
  if (userId) {
    const permissionsOk = await testStoragePermissions(userId)
    
    if (connectivityOk && permissionsOk) {
      console.log('🎉 All Firebase Storage tests passed!')
    } else {
      console.log('⚠️ Some Firebase Storage tests failed. Check the logs above.')
    }
  } else {
    if (connectivityOk) {
      console.log('🎉 Firebase Storage connectivity test passed!')
    } else {
      console.log('⚠️ Firebase Storage connectivity test failed.')
    }
  }
}
