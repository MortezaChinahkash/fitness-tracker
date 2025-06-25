<template>
  <div class="profile-container">
    <h2 class="section-title">
      <span class="section-icon">👤</span>
      Dein Profil
    </h2>
    
    <div class="profile-card">
      <!-- Ansichtsmodus -->
      <div v-if="!isEditing" class="profile-view">
        <div class="profile-header">
          <div class="profile-avatar">
            <img v-if="profileData.avatar" :src="profileData.avatar" :alt="profileData.name" class="avatar-image" />
            <span v-else class="avatar-large">{{ getInitials(profileData.name) }}</span>
          </div>
          <div class="profile-info">
            <h3>{{ profileData.name }}</h3>
            <p>{{ profileData.email }}</p>
            <p class="member-since">Fitness-Enthusiast seit {{ memberSince }}</p>
          </div>
          <button class="edit-profile-btn" @click="startEditing">
            <span>✏️</span>
            Bearbeiten
          </button>
        </div>
        
        <div class="profile-stats">
          <div class="profile-stat">
            <span class="stat-icon">🎯</span>
            <div class="stat-content">
              <div class="stat-number">{{ actualWorkoutStats.workoutsCompleted }}</div>
              <div class="stat-label">Workouts absolviert</div>
            </div>
          </div>
          <div class="profile-stat">
            <span class="stat-icon">🔥</span>
            <div class="stat-content">
              <div class="stat-number">{{ actualWorkoutStats.minutesTrained }}</div>
              <div class="stat-label">Minuten trainiert</div>
            </div>
          </div>
          <div class="profile-stat">
            <span class="stat-icon">📅</span>
            <div class="stat-content">
              <div class="stat-number">{{ actualWorkoutStats.daysActive }}</div>
              <div class="stat-label">Tage aktiv</div>
            </div>
          </div>
        </div>
        
        <div class="profile-achievements">
          <h4>Erfolge</h4>
          <div class="achievements-grid">
            <div class="achievement" :class="{ locked: actualWorkoutStats.workoutsCompleted < 1 }">
              <span class="achievement-icon">🏆</span>
              <span class="achievement-text">Erstes Workout</span>
            </div>
            <div class="achievement" :class="{ locked: actualWorkoutStats.workoutsCompleted < 10 }">
              <span class="achievement-icon">💪</span>
              <span class="achievement-text">10 Workouts</span>
            </div>
            <div class="achievement" :class="{ locked: actualWorkoutStats.workoutsCompleted < 50 }">
              <span class="achievement-icon">🌟</span>
              <span class="achievement-text">50 Workouts</span>
            </div>
            <div class="achievement" :class="{ locked: actualWorkoutStats.daysActive < 365 }">
              <span class="achievement-icon">🎯</span>
              <span class="achievement-text">365 Tage Streak</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bearbeitungsmodus -->
      <div v-else class="profile-edit">
        <div class="edit-header">
          <h3>Profil bearbeiten</h3>
          <div class="edit-actions">
            <button class="cancel-btn" @click="cancelEditing">Abbrechen</button>
            <button class="save-btn" @click="saveProfile" :disabled="!isFormValid || isUploading">
              {{ isUploading ? 'Speichert...' : 'Speichern' }}
            </button>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="edit-form">
          <!-- Profilbild -->
          <div class="form-group avatar-group">
            <label class="form-label">Profilbild</label>
            <div class="avatar-upload">
              <div class="current-avatar">
                <img v-if="editData.avatar" :src="editData.avatar" alt="Profilbild" class="avatar-preview" />
                <div v-else class="avatar-placeholder">
                  <span>{{ getInitials(editData.name) }}</span>
                </div>
              </div>
              <div class="upload-controls">
                <input 
                  type="file" 
                  ref="fileInput"
                  @change="handleFileUpload" 
                  accept="image/*"
                  class="file-input"
                  id="avatar-upload"
                />
                <label for="avatar-upload" class="upload-btn">
                  <span>📷</span>
                  Bild auswählen
                </label>
                <button v-if="editData.avatar" type="button" @click="removeAvatar" class="remove-btn">
                  <span>🗑️</span>
                  Entfernen
                </button>
              </div>
            </div>
            
            <!-- Upload-Fortschritt -->
            <div v-if="isUploading" class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
              </div>
              <span class="progress-text">{{ uploadProgress }}% hochgeladen...</span>
            </div>
          </div>

          <!-- Name -->
          <div class="form-group">
            <label for="name" class="form-label">
              <span class="label-icon">👤</span>
              Name
            </label>
            <input 
              type="text" 
              id="name"
              v-model="editData.name" 
              placeholder="Dein vollständiger Name"
              required 
              class="form-input"
            />
          </div>

          <!-- E-Mail -->
          <div class="form-group">
            <label for="email" class="form-label">
              <span class="label-icon">📧</span>
              E-Mail-Adresse
            </label>
            <input 
              type="email" 
              id="email"
              v-model="editData.email" 
              placeholder="deine@email.com"
              required 
              class="form-input"
            />
          </div>

          <!-- Passwort ändern -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">🔒</span>
              Passwort ändern
            </label>
            
            <!-- Aktuelles Passwort -->
            <div class="password-field">
              <input 
                :type="showPasswords.current ? 'text' : 'password'"
                v-model="editData.currentPassword" 
                placeholder="Aktuelles Passwort"
                class="form-input"
              />
              <button type="button" @click="togglePasswordVisibility('current')" class="password-toggle">
                <span>{{ showPasswords.current ? '👁️' : '👁️‍🗨️' }}</span>
              </button>
            </div>

            <!-- Neues Passwort -->
            <div class="password-field">
              <input 
                :type="showPasswords.new ? 'text' : 'password'"
                v-model="editData.newPassword" 
                placeholder="Neues Passwort (leer lassen wenn unverändert)"
                class="form-input"
              />
              <button type="button" @click="togglePasswordVisibility('new')" class="password-toggle">
                <span>{{ showPasswords.new ? '👁️' : '👁️‍🗨️' }}</span>
              </button>
            </div>

            <!-- Passwort bestätigen -->
            <div v-if="editData.newPassword" class="password-field">
              <input 
                :type="showPasswords.confirm ? 'text' : 'password'"
                v-model="editData.confirmPassword" 
                placeholder="Neues Passwort bestätigen"
                class="form-input"
                :class="{ 'error': editData.newPassword && editData.confirmPassword && editData.newPassword !== editData.confirmPassword }"
              />
              <button type="button" @click="togglePasswordVisibility('confirm')" class="password-toggle">
                <span>{{ showPasswords.confirm ? '👁️' : '👁️‍🗨️' }}</span>
              </button>
            </div>

            <!-- Passwort-Hinweise -->
            <div v-if="editData.newPassword" class="password-hints">
              <div class="hint" :class="{ valid: passwordValidation.length }">
                {{ passwordValidation.length ? '✓' : '○' }} Mindestens 8 Zeichen
              </div>
              <div class="hint" :class="{ valid: passwordValidation.uppercase }">
                {{ passwordValidation.uppercase ? '✓' : '○' }} Großbuchstabe
              </div>
              <div class="hint" :class="{ valid: passwordValidation.lowercase }">
                {{ passwordValidation.lowercase ? '✓' : '○' }} Kleinbuchstabe
              </div>
              <div class="hint" :class="{ valid: passwordValidation.number }">
                {{ passwordValidation.number ? '✓' : '○' }} Zahl
              </div>
              <div v-if="editData.confirmPassword" class="hint" :class="{ valid: editData.newPassword === editData.confirmPassword }">
                {{ editData.newPassword === editData.confirmPassword ? '✓' : '○' }} Passwörter stimmen überein
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFirebase } from '../composables/useFirebase'
import { updateUserProfile, updateUserPassword } from '../firebase/authService'
import { updateUserProfile as updateFirestoreProfile } from '../firebase/userProfileService'
import { validateImageFile, fileToBase64 } from '../firebase/storageService'
import { uploadProfilePictureMaster } from '../firebase/storageNoCORS'

// Firebase integration
const { user, userProfileData, workoutStats, refreshUserProfile } = useFirebase()

interface ProfileData {
  name: string
  email: string
  avatar?: string
  memberSince: string
}

// Reactive Data
const isEditing = ref(false)
const fileInput = ref<HTMLInputElement>()
const isUploading = ref(false)
const uploadProgress = ref(0)

// Use Firebase data as source of truth
const profileData = computed<ProfileData>(() => ({
  name: userProfileData.value?.name || user.value?.displayName || 'Fitness Enthusiast',
  email: userProfileData.value?.email || user.value?.email || '',
  avatar: userProfileData.value?.avatar || user.value?.photoURL || '',
  memberSince: userProfileData.value?.memberSince || new Date().getFullYear().toString()
}))

const editData = ref<ProfileData & {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}>({
  name: '',
  email: '',
  avatar: '',
  memberSince: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showPasswords = ref({
  current: false,
  new: false,
  confirm: false
})

// Computed
const memberSince = computed(() => {
  return profileData.value.memberSince
})

// Get actual workout statistics from Firebase
const actualWorkoutStats = computed(() => ({
  workoutsCompleted: workoutStats.value.count,
  minutesTrained: workoutStats.value.totalDuration,
  daysActive: calculateActiveDays()
}))

const passwordValidation = computed(() => {
  const password = editData.value.newPassword
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password)
  }
})

const isPasswordValid = computed(() => {
  if (!editData.value.newPassword) return true // Optional field
  
  const validation = passwordValidation.value
  return validation.length && 
         validation.uppercase && 
         validation.lowercase && 
         validation.number &&
         (!editData.value.confirmPassword || editData.value.newPassword === editData.value.confirmPassword)
})

const isFormValid = computed(() => {
  return editData.value.name.trim() && 
         editData.value.email.trim() && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.value.email) &&
         isPasswordValid.value
})

// Methods
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

function calculateActiveDays(): number {
  const count = workoutStats.value.count
  return Math.min(count, Math.floor(count * 0.7))
}

function startEditing() {
  isEditing.value = true
  editData.value = {
    ...profileData.value,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

function cancelEditing() {
  isEditing.value = false
  editData.value = {
    name: '',
    email: '',
    avatar: '',
    memberSince: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

function togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
  showPasswords.value[field] = !showPasswords.value[field]
}

async function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !user.value) return

  const validation = validateImageFile(file)
  if (!validation.valid) {
    alert(validation.error)
    return
  }

  try {
    isUploading.value = true
    uploadProgress.value = 0

    // Convert to base64 for immediate preview
    const base64 = await fileToBase64(file)
    editData.value.avatar = base64

    // Use CORS-free upload method
    console.log('🔄 Using CORS-free upload method...')
    const downloadURL = await uploadProfilePictureMaster(
      user.value.uid, 
      file,
      (progress: number) => {
        uploadProgress.value = progress
      }
    )
    
    editData.value.avatar = downloadURL
    console.log('✅ Upload successful')
    
  } catch (error: any) {
    console.error('Error uploading file:', error)
    
    // More specific error messages
    let errorMessage = 'Fehler beim Hochladen des Bildes.'
    if (error instanceof Error) {
      if (error.message.includes('CORS')) {
        errorMessage = 'CORS-Fehler: Bitte überprüfen Sie die Firebase Storage-Konfiguration.'
      } else if (error.message.includes('permission') || error.message.includes('auth')) {
        errorMessage = 'Berechtigung verweigert: Bitte melden Sie sich erneut an.'
      } else if (error.message.includes('network')) {
        errorMessage = 'Netzwerkfehler: Bitte überprüfen Sie Ihre Internetverbindung.'
      }
    }
    
    alert(`${errorMessage} Details: ${error.message || error}`)
    editData.value.avatar = ''
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

function removeAvatar() {
  editData.value.avatar = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function saveProfile() {
  if (!isFormValid.value || !user.value) return

  try {
    isUploading.value = true

    if (editData.value.newPassword && editData.value.currentPassword) {
      await updateUserPassword(editData.value.currentPassword, editData.value.newPassword)
    }

    await updateUserProfile({
      displayName: editData.value.name,
      photoURL: editData.value.avatar
    })

    if (user.value) {
      await updateFirestoreProfile(user.value.uid, {
        name: editData.value.name,
        email: editData.value.email,
        avatar: editData.value.avatar
      })
    }

    await refreshUserProfile()

    alert('Profil erfolgreich aktualisiert!')
    isEditing.value = false

  } catch (error: any) {
    console.error('Error saving profile:', error)
    
    let errorMessage = 'Fehler beim Speichern des Profils.'
    
    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Das aktuelle Passwort ist nicht korrekt.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Das neue Passwort ist zu schwach.'
    } else if (error.code === 'auth/requires-recent-login') {
      errorMessage = 'Bitte melden Sie sich erneut an, um das Passwort zu ändern.'
    }
    
    alert(errorMessage + ' Bitte versuchen Sie es erneut.')
  } finally {
    isUploading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Profile data is automatically loaded through Firebase composable
})
</script>

<style scoped>
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

.profile-container {
  margin-top: 2rem;
}

.profile-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
}

.avatar-large {
  font-size: 2.5rem;
}

.profile-info {
  flex: 1;
}

.profile-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.profile-info p {
  margin: 0;
  color: #86868b;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.edit-profile-btn {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.edit-profile-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.profile-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f5f5f7;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.profile-stat .stat-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.profile-stat .stat-content {
  flex: 1;
}

.profile-stat .stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1;
  margin-bottom: 0.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.profile-stat .stat-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.profile-achievements {
  margin-top: 2rem;
}

.profile-achievements h4 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.achievement {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem;
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.achievement:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.achievement.locked {
  opacity: 0.4;
  background: #f5f5f7;
}

.achievement-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.achievement-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Bearbeitungsmodus */
.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.edit-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.edit-actions {
  display: flex;
  gap: 1rem;
}

.cancel-btn,
.save-btn {
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.cancel-btn {
  background: #f0f0f0;
  color: #86868b;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  background: #007AFF;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.save-btn:disabled {
  background: #86868b;
  cursor: not-allowed;
  transform: none;
}

/* Formular */
.edit-form {
  display: grid;
  gap: 2rem;
}

.form-group {
  display: grid;
  gap: 0.75rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1d1d1f;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.label-icon {
  font-size: 1.1rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background: #f5f5f7;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #007AFF;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.form-input.error {
  border-color: #ff3b30;
  background: rgba(255, 59, 48, 0.05);
}

/* Avatar Upload */
.avatar-group {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.02);
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.current-avatar {
  position: relative;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.upload-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.file-input {
  display: none;
}

.upload-btn,
.remove-btn {
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  text-align: center;
  justify-content: center;
}

.upload-btn {
  background: #007AFF;
  color: white;
}

.upload-btn:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.remove-btn {
  background: #ff3b30;
  color: white;
}

.remove-btn:hover {
  background: #d70015;
  transform: translateY(-1px);
}

/* Upload Progress */
.upload-progress {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007AFF, #5856D6);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Passwort Felder */
.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #86868b;
  transition: all 0.2s ease;
  padding: 0.25rem;
}

.password-toggle:hover {
  color: #007AFF;
}

.password-hints {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.hint.valid {
  color: #34c759;
}

/* Avatar Image Update */
.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.member-since {
  font-style: italic;
  font-size: 0.9rem !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.75rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-stats {
    grid-template-columns: 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.5rem;
  }
  
  .profile-card {
    padding: 1.5rem;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
