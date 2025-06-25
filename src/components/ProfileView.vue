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
              <div class="stat-number">156</div>
              <div class="stat-label">Workouts absolviert</div>
            </div>
          </div>
          <div class="profile-stat">
            <span class="stat-icon">🔥</span>
            <div class="stat-content">
              <div class="stat-number">2.340</div>
              <div class="stat-label">Minuten trainiert</div>
            </div>
          </div>
          <div class="profile-stat">
            <span class="stat-icon">📅</span>
            <div class="stat-content">
              <div class="stat-number">89</div>
              <div class="stat-label">Tage aktiv</div>
            </div>
          </div>
        </div>
        
        <div class="profile-achievements">
          <h4>Erfolge</h4>
          <div class="achievements-grid">
            <div class="achievement">
              <span class="achievement-icon">🏆</span>
              <span class="achievement-text">Erstes Workout</span>
            </div>
            <div class="achievement">
              <span class="achievement-icon">💪</span>
              <span class="achievement-text">10 Workouts</span>
            </div>
            <div class="achievement">
              <span class="achievement-icon">🌟</span>
              <span class="achievement-text">100 Workouts</span>
            </div>
            <div class="achievement locked">
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
            <button class="save-btn" @click="saveProfile" :disabled="!isFormValid">Speichern</button>
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
                type="password" 
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

interface ProfileData {
  name: string
  email: string
  avatar?: string
  memberSince: string
}

// Reactive Data
const isEditing = ref(false)
const fileInput = ref<HTMLInputElement>()

const profileData = ref<ProfileData>({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '',
  memberSince: '2023'
})

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

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Dateigröße prüfen (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Die Datei ist zu groß. Bitte wählen Sie ein Bild unter 5MB.')
      return
    }

    // Dateityp prüfen
    if (!file.type.startsWith('image/')) {
      alert('Bitte wählen Sie eine gültige Bilddatei.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      editData.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function removeAvatar() {
  editData.value.avatar = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function saveProfile() {
  if (!isFormValid.value) return

  try {
    // Hier würden Sie normalerweise eine API aufrufen
    // Für Demo-Zwecke speichern wir nur lokal
    
    // Passwort-Validierung (würde normalerweise serverseitig passieren)
    if (editData.value.newPassword && !editData.value.currentPassword) {
      alert('Bitte geben Sie Ihr aktuelles Passwort ein, um es zu ändern.')
      return
    }

    // Profildaten aktualisieren
    profileData.value = {
      name: editData.value.name,
      email: editData.value.email,
      avatar: editData.value.avatar,
      memberSince: profileData.value.memberSince
    }

    // In localStorage speichern für Persistenz
    localStorage.setItem('fitness-profile', JSON.stringify(profileData.value))

    // Erfolgreiche Speicherung
    alert('Profil erfolgreich aktualisiert!')
    isEditing.value = false

  } catch (error) {
    console.error('Fehler beim Speichern des Profils:', error)
    alert('Fehler beim Speichern des Profils. Bitte versuchen Sie es erneut.')
  }
}

function loadProfile() {
  const saved = localStorage.getItem('fitness-profile')
  if (saved) {
    try {
      profileData.value = { ...profileData.value, ...JSON.parse(saved) }
    } catch (error) {
      console.error('Fehler beim Laden des Profils:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
/* Section Title */
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
