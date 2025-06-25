<script setup lang="ts">
import { ref } from 'vue'
import AddWorkout from './components/AddWorkout.vue'
import AppHeader from './components/AppHeader.vue'
import Statistics from './components/Statistics.vue'
import WorkoutList from './components/WorkoutList.vue'
import EmptyState from './components/EmptyState.vue'
import ProfileView from './components/ProfileView.vue'
import DashboardView from './components/DashboardView.vue'
import GoalsView from './components/GoalsView.vue'
import WorkoutReminder from './components/WorkoutReminder.vue'
import AuthModal from './components/AuthModal.vue'
import { useFirebase } from './composables/useFirebase'
import { 
  addWorkout as addWorkoutToFirebase, 
  updateWorkout as updateWorkoutInFirebase, 
  deleteWorkout as deleteWorkoutFromFirebase,
  type Workout 
} from './firebase/workoutService'

// Firebase integration
const { 
  isAuthenticated, 
  isLoading: firebaseLoading, 
  user, 
  workouts, 
  workoutStats,
  error: firebaseError,
  clearError,
  addWorkoutToLocal,
  removeWorkoutFromLocal,
  updateWorkoutInLocal
} = useFirebase()

// Navigation State
const currentView = ref('dashboard')

// Modal State
const showAddWorkout = ref(false)
const showReminders = ref(false)

// Goals State
const weeklyGoal = ref(4) // Default: 4 Workouts pro Woche

/**
 * Navigates to a specific view in the app
 * @param view - The view name to navigate to
 */
function navigateToView(view: string) {
  currentView.value = view
}

/**
 * Toggles the reminders modal visibility
 */
function toggleReminders() {
  showReminders.value = !showReminders.value
}

/**
 * Updates the weekly workout goal
 * @param newGoal - The new weekly goal number
 */
function updateWeeklyGoal(newGoal: number) {
  weeklyGoal.value = newGoal
}

/**
 * Adds a new workout to Firebase and updates local state optimistically
 * @param workout - The workout data to add
 */
async function addWorkout(workout: Omit<Workout, 'id'>) {
  if (!user.value) return

  try {
    // Add to local state immediately for better UX
    const tempWorkout = { ...workout, id: 'temp-' + Date.now() }
    addWorkoutToLocal(tempWorkout)

    // Add to Firebase
    const workoutId = await addWorkoutToFirebase(workout, user.value.uid)
    
    // Update local state with real ID
    removeWorkoutFromLocal(tempWorkout.id!)
    addWorkoutToLocal({ ...workout, id: workoutId })
    
  } catch (error) {
    console.error('Error adding workout:', error)
    // Remove from local state if Firebase add failed
    removeWorkoutFromLocal('temp-' + (Date.now() - 1000))
    alert('Fehler beim Hinzufügen des Workouts. Bitte versuchen Sie es erneut.')
  }
}

/**
 * Adds a workout and closes the modal
 * @param workout - The workout data to add
 */
async function addWorkoutAndClose(workout: Omit<Workout, 'id'>) {
  await addWorkout(workout)
  showAddWorkout.value = false
}

/**
 * Deletes a workout from Firebase and local state
 * @param index - The index of the workout in the local array (for backward compatibility)
 */
async function deleteWorkout(index: number) {
  const workout = workouts.value[index]
  if (!workout?.id) return

  try {
    // Remove from local state immediately
    removeWorkoutFromLocal(workout.id)
    
    // Remove from Firebase
    await deleteWorkoutFromFirebase(workout.id)
    
  } catch (error) {
    console.error('Error deleting workout:', error)
    // Re-add to local state if Firebase delete failed
    addWorkoutToLocal(workout)
    alert('Fehler beim Löschen des Workouts. Bitte versuchen Sie es erneut.')
  }
}

/**
 * Updates a workout in Firebase and local state
 * @param index - The index of the workout in the local array (for backward compatibility)
 * @param updatedWorkout - The updated workout data
 */
async function updateWorkout(index: number, updatedWorkout: Workout) {
  const workout = workouts.value[index]
  if (!workout?.id) return

  try {
    // Update local state immediately
    updateWorkoutInLocal(workout.id, updatedWorkout)
    
    // Update in Firebase
    await updateWorkoutInFirebase(workout.id, updatedWorkout)
    
  } catch (error) {
    console.error('Error updating workout:', error)
    // Revert local state if Firebase update failed
    updateWorkoutInLocal(workout.id, workout)
    alert('Fehler beim Aktualisieren des Workouts. Bitte versuchen Sie es erneut.')
  }
}

/**
 * Handles when a new reminder is added
 * @param reminder - The reminder data
 */
function handleReminderAdded(reminder: any) {
  console.log('Neue Erinnerung hinzugefügt:', reminder)
  // Additional actions can be performed here when a reminder is added
}
</script>

<template>
  <div class="app-container">
    <!-- Show authentication modal if user is not authenticated -->
    <AuthModal v-if="!isAuthenticated && !firebaseLoading" />
    
    <!-- Show loading spinner while Firebase is initializing -->
    <div v-else-if="firebaseLoading" class="loading-container">
      <div class="loading-spinner">
        <span class="spinner-icon">⏳</span>
        <p>Lade Fitness-Tracker...</p>
      </div>
    </div>
    
    <!-- Main app content (only show when authenticated) -->
    <div v-else class="main-app">
      <AppHeader :currentView="currentView" @navigate="navigateToView" @toggleReminders="toggleReminders" />
      
      <main class="app-main">
        <div class="hero-section">
          <h1 class="app-title">
            <span class="app-icon">🏋️‍♂️</span>
            Fitness-Tracker
            <span class="app-subtitle">Deine persönliche Trainings-App</span>
          </h1>
        </div>

        <!-- Firebase Error Display -->
        <div v-if="firebaseError" class="error-banner">
          <span class="error-icon">⚠️</span>
          {{ firebaseError }}
          <button @click="clearError" class="close-error">×</button>
        </div>

        <!-- Dashboard View -->
        <div v-if="currentView === 'dashboard'" class="content-section">
          <DashboardView 
            :workoutCount="workoutStats.count"
            :totalDuration="workoutStats.totalDuration"
            :workouts="workouts"
            :weeklyGoal="weeklyGoal"
            @showAddWorkout="showAddWorkout = true"
            @navigateToWorkouts="navigateToView('workouts')"
            @navigateToStatistics="navigateToView('statistics')"
            @navigateToProfile="navigateToView('profile')"
          />
          
          <!-- Add Workout Modal/Dialog -->
          <div v-if="showAddWorkout" class="modal-overlay" @click="showAddWorkout = false">
            <div class="modal-content" @click.stop>
              <AddWorkout @add="addWorkoutAndClose" />
              <button class="modal-close" @click="showAddWorkout = false">×</button>
            </div>
          </div>
        </div>

        <!-- Workouts View -->
        <div v-else-if="currentView === 'workouts'" class="content-section">
          <AddWorkout @add="addWorkout" />

          <WorkoutList 
            v-if="workouts.length > 0"
            :workouts="workouts"
            @delete="deleteWorkout"
            @update="updateWorkout"
          />

          <EmptyState v-else />
        </div>

        <!-- Goals View -->
        <div v-else-if="currentView === 'goals'" class="content-section">
          <GoalsView 
            :workouts="workouts"
            :initialWeeklyGoal="weeklyGoal"
            @updateWeeklyGoal="updateWeeklyGoal"
          />
        </div>

        <!-- Statistics View -->
        <div v-else-if="currentView === 'statistics'" class="content-section">
          <Statistics 
            :workoutCount="workoutStats.count"
            :totalDuration="workoutStats.totalDuration"
            :averageDuration="workoutStats.averageDuration"
            :workouts="workouts"
          />
        </div>

        <!-- Profile View -->
        <div v-else-if="currentView === 'profile'" class="content-section">
          <ProfileView />
        </div>
      </main>

      <!-- Workout Reminder Modal -->
      <WorkoutReminder 
        :isOpen="showReminders" 
        @close="showReminders = false"
        @reminderAdded="handleReminderAdded"
      />
    </div>
  </div>
</template>

<style scoped>
/* Loading Container */
.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.spinner-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Error Banner */
.error-banner {
  max-width: 1000px;
  margin: 0 auto 2rem;
  padding: 1rem 2rem;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
  border-radius: 12px;
  color: #ff3b30;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.error-icon {
  font-size: 1.5rem;
}

.close-error {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ff3b30;
  cursor: pointer;
  margin-left: auto;
  padding: 0.25rem;
  line-height: 1;
}

.close-error:hover {
  opacity: 0.7;
}

/* Apple Design System - Minimalistische Eleganz */
.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  color: #1d1d1f;
  position: relative;
  padding-bottom: 2rem; /* Extra Padding am Ende statt Footer */
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 3rem 2rem 1rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
}

.app-title {
  font-size: 3rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.app-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.app-subtitle {
  font-size: 1.25rem;
  font-weight: 400;
  color: #86868b;
  letter-spacing: -0.01em;
  margin-top: 0.5rem;
}

/* Main Content */
.app-main {
  position: relative;
  z-index: 10;
}

.content-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem; /* Extra Padding unten für besseren Abschluss */
  display: grid;
  gap: 3rem;
}

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 2rem 0;
  letter-spacing: -0.02em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.section-icon {
  font-size: 2rem;
}

/* Recent Workouts - Dashboard */
.recent-workouts {
  margin-top: 2rem;
}

.recent-list {
  display: grid;
  gap: 1rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.2s ease;
}

.recent-item:hover {
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06);
}

.recent-emoji {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.recent-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
  text-transform: capitalize;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.recent-content p {
  margin: 0;
  font-size: 0.85rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app-title {
    font-size: 2.5rem;
  }
  
  .app-subtitle {
    font-size: 1.1rem;
  }
  
  .content-section {
    padding: 1.5rem;
    gap: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .recent-item {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
  
  .content-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.2),
    0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: #86868b;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #1d1d1f;
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>