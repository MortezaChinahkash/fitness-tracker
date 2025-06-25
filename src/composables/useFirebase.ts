/**
 * Firebase Composable
 * 
 * A Vue 3 composable that provides reactive Firebase integration
 * for authentication, workouts, and user profiles.
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { User } from 'firebase/auth'
import { 
  subscribeToAuthChanges, 
  userToProfile, 
  type UserProfile 
} from '../firebase/authService'
import { 
  subscribeToUserWorkouts, 
  type Workout 
} from '../firebase/workoutService'
import { 
  getUserProfile, 
  type UserProfileData 
} from '../firebase/userProfileService'

export function useFirebase() {
  // Authentication state
  const user = ref<User | null>(null)
  const userProfile = ref<UserProfile | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(true)

  // User profile data from Firestore
  const userProfileData = ref<UserProfileData | null>(null)

  // Workouts state
  const workouts = ref<Workout[]>([])
  const workoutStats = computed(() => ({
    count: workouts.value.length,
    totalDuration: workouts.value.reduce((sum, workout) => sum + Number(workout.duration), 0),
    averageDuration: workouts.value.length > 0 
      ? Math.round(workouts.value.reduce((sum, workout) => sum + Number(workout.duration), 0) / workouts.value.length)
      : 0
  }))

  // Error handling
  const error = ref<string | null>(null)

  // Unsubscribe functions
  let unsubscribeAuth: (() => void) | null = null
  let unsubscribeWorkouts: (() => void) | null = null

  /**
   * Clears any existing error message
   */
  function clearError() {
    error.value = null
  }

  /**
   * Sets an error message
   * @param message - The error message to set
   */
  function setError(message: string) {
    error.value = message
    console.error('Firebase Error:', message)
  }

  /**
   * Loads user profile data from Firestore
   */
  async function loadUserProfileData() {
    if (!user.value) return

    try {
      const profileData = await getUserProfile(user.value.uid)
      userProfileData.value = profileData
    } catch (err) {
      console.error('Error loading user profile data:', err)
      setError('Fehler beim Laden der Profildaten')
    }
  }

  /**
   * Sets up authentication state listener
   */
  function setupAuthListener() {
    unsubscribeAuth = subscribeToAuthChanges(async (firebaseUser) => {
      user.value = firebaseUser
      userProfile.value = firebaseUser ? userToProfile(firebaseUser) : null
      
      if (firebaseUser) {
        // User is signed in
        clearError()
        await loadUserProfileData()
        setupWorkoutsListener(firebaseUser.uid)
      } else {
        // User is signed out
        userProfileData.value = null
        workouts.value = []
        if (unsubscribeWorkouts) {
          unsubscribeWorkouts()
          unsubscribeWorkouts = null
        }
      }
      
      isLoading.value = false
    })
  }

  /**
   * Sets up workouts listener for the current user
   * @param userId - The user ID to listen for workouts
   */
  function setupWorkoutsListener(userId: string) {
    unsubscribeWorkouts = subscribeToUserWorkouts(userId, (userWorkouts) => {
      workouts.value = userWorkouts
    })
  }

  /**
   * Refreshes user profile data
   */
  async function refreshUserProfile() {
    if (user.value) {
      await loadUserProfileData()
    }
  }

  /**
   * Updates local workouts array (for optimistic updates)
   * @param newWorkouts - Array of workouts to set
   */
  function updateWorkouts(newWorkouts: Workout[]) {
    workouts.value = newWorkouts
  }

  /**
   * Adds a workout to the local array (for optimistic updates)
   * @param workout - The workout to add
   */
  function addWorkoutToLocal(workout: Workout) {
    workouts.value.unshift(workout)
  }

  /**
   * Removes a workout from the local array (for optimistic updates)
   * @param workoutId - The ID of the workout to remove
   */
  function removeWorkoutFromLocal(workoutId: string) {
    const index = workouts.value.findIndex(w => w.id === workoutId)
    if (index !== -1) {
      workouts.value.splice(index, 1)
    }
  }

  /**
   * Updates a workout in the local array (for optimistic updates)
   * @param workoutId - The ID of the workout to update
   * @param updates - The updates to apply
   */
  function updateWorkoutInLocal(workoutId: string, updates: Partial<Workout>) {
    const index = workouts.value.findIndex(w => w.id === workoutId)
    if (index !== -1) {
      workouts.value[index] = { ...workouts.value[index], ...updates }
    }
  }

  // Setup listeners on mount
  onMounted(() => {
    setupAuthListener()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (unsubscribeAuth) {
      unsubscribeAuth()
    }
    if (unsubscribeWorkouts) {
      unsubscribeWorkouts()
    }
  })

  return {
    // Authentication state
    user: readonly(user),
    userProfile: readonly(userProfile),
    isAuthenticated,
    isLoading: readonly(isLoading),
    
    // User profile data
    userProfileData: readonly(userProfileData),
    refreshUserProfile,
    
    // Workouts state
    workouts: readonly(workouts),
    workoutStats,
    updateWorkouts,
    addWorkoutToLocal,
    removeWorkoutFromLocal,
    updateWorkoutInLocal,
    
    // Error handling
    error: readonly(error),
    clearError,
    setError
  }
}

// For backwards compatibility, we'll also export a readonly version
function readonly<T>(ref: import('vue').Ref<T>) {
  return computed(() => ref.value)
}
