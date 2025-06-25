<template>
  <div class="auth-overlay">
    <div class="auth-container">
      <div class="auth-header">
        <h2 class="auth-title">
          <span class="auth-icon">🏋️‍♂️</span>
          {{ isLogin ? 'Anmelden' : 'Registrieren' }}
        </h2>
        <p class="auth-subtitle">
          {{ isLogin ? 'Willkommen zurück!' : 'Erstellen Sie Ihr Fitness-Konto' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Name field (only for registration) -->
        <div v-if="!isLogin" class="form-group">
          <label for="name" class="form-label">
            <span class="label-icon">👤</span>
            Name
          </label>
          <input 
            type="text" 
            id="name"
            v-model="formData.name" 
            placeholder="Ihr vollständiger Name"
            required 
            class="form-input"
          />
        </div>

        <!-- Email field -->
        <div class="form-group">
          <label for="email" class="form-label">
            <span class="label-icon">📧</span>
            E-Mail-Adresse
          </label>
          <input 
            type="email" 
            id="email"
            v-model="formData.email" 
            placeholder="ihre@email.com"
            required 
            class="form-input"
          />
        </div>

        <!-- Password field -->
        <div class="form-group">
          <label for="password" class="form-label">
            <span class="label-icon">🔒</span>
            Passwort
          </label>
          <div class="password-field">
            <input 
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="formData.password" 
              :placeholder="isLogin ? 'Ihr Passwort' : 'Mindestens 8 Zeichen'"
              required 
              class="form-input"
            />
            <button type="button" @click="showPassword = !showPassword" class="password-toggle">
              <span>{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
          </div>
        </div>

        <!-- Password confirmation (only for registration) -->
        <div v-if="!isLogin" class="form-group">
          <label for="confirmPassword" class="form-label">
            <span class="label-icon">🔒</span>
            Passwort bestätigen
          </label>
          <div class="password-field">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="formData.confirmPassword" 
              placeholder="Passwort wiederholen"
              required 
              class="form-input"
              :class="{ 'error': formData.confirmPassword && formData.password !== formData.confirmPassword }"
            />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="password-toggle">
              <span>{{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
          </div>
          <div v-if="formData.confirmPassword && formData.password !== formData.confirmPassword" class="error-message">
            Passwörter stimmen nicht überein
          </div>
        </div>

        <!-- Password requirements (only for registration) -->
        <div v-if="!isLogin && formData.password" class="password-hints">
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
        </div>

        <!-- Error message -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Submit button -->
        <button 
          type="submit" 
          class="auth-submit"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="isLoading" class="loading-spinner">⏳</span>
          {{ isLoading ? 'Wird verarbeitet...' : (isLogin ? 'Anmelden' : 'Registrieren') }}
        </button>

        <!-- Switch between login and register -->
        <div class="auth-switch">
          <span v-if="isLogin">Noch kein Konto?</span>
          <span v-else>Bereits ein Konto?</span>
          <button type="button" @click="toggleMode" class="switch-btn">
            {{ isLogin ? 'Jetzt registrieren' : 'Hier anmelden' }}
          </button>
        </div>

        <!-- Password reset link (only for login) -->
        <div v-if="isLogin" class="forgot-password">
          <button type="button" @click="showPasswordReset = true" class="forgot-btn">
            Passwort vergessen?
          </button>
        </div>
      </form>

      <!-- Password reset modal -->
      <div v-if="showPasswordReset" class="password-reset-modal">
        <div class="reset-content">
          <h3>Passwort zurücksetzen</h3>
          <p>Geben Sie Ihre E-Mail-Adresse ein, um einen Reset-Link zu erhalten.</p>
          <input 
            type="email" 
            v-model="resetEmail" 
            placeholder="ihre@email.com"
            class="form-input"
          />
          <div class="reset-actions">
            <button @click="showPasswordReset = false" class="cancel-btn">Abbrechen</button>
            <button @click="handlePasswordReset" class="reset-btn" :disabled="!resetEmail">
              Link senden
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { registerUser, loginUser, sendPasswordReset } from '../firebase/authService'
import { createDefaultUserProfile } from '../firebase/userProfileService'

// Form state
const isLogin = ref(true)
const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showPasswordReset = ref(false)
const resetEmail = ref('')

// Form data
const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Password validation for registration
const passwordValidation = computed(() => {
  const password = formData.value.password
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password)
  }
})

// Form validation
const isFormValid = computed(() => {
  if (isLogin.value) {
    return formData.value.email && formData.value.password
  } else {
    return (
      formData.value.name &&
      formData.value.email &&
      formData.value.password &&
      formData.value.confirmPassword &&
      formData.value.password === formData.value.confirmPassword &&
      passwordValidation.value.length &&
      passwordValidation.value.uppercase &&
      passwordValidation.value.lowercase &&
      passwordValidation.value.number
    )
  }
})

/**
 * Toggles between login and registration modes
 */
function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
  resetForm()
}

/**
 * Resets the form data
 */
function resetForm() {
  formData.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  showPassword.value = false
  showConfirmPassword.value = false
}

/**
 * Handles form submission for both login and registration
 */
async function handleSubmit() {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = ''

  try {
    if (isLogin.value) {
      await loginUser(formData.value.email, formData.value.password)
    } else {
      const user = await registerUser(
        formData.value.email, 
        formData.value.password, 
        formData.value.name
      )
      
      // Create default user profile in Firestore
      await createDefaultUserProfile(
        user.uid,
        formData.value.email,
        formData.value.name
      )
    }
    
    // User will be automatically redirected by the auth state change
  } catch (err: any) {
    console.error('Authentication error:', err)
    
    // Handle common Firebase auth errors
    switch (err.code) {
      case 'auth/email-already-in-use':
        error.value = 'Diese E-Mail-Adresse ist bereits registriert.'
        break
      case 'auth/weak-password':
        error.value = 'Das Passwort ist zu schwach.'
        break
      case 'auth/invalid-email':
        error.value = 'Ungültige E-Mail-Adresse.'
        break
      case 'auth/user-not-found':
        error.value = 'Kein Benutzer mit dieser E-Mail-Adresse gefunden.'
        break
      case 'auth/wrong-password':
        error.value = 'Falsches Passwort.'
        break
      case 'auth/too-many-requests':
        error.value = 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.'
        break
      default:
        error.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
        break
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Handles password reset
 */
async function handlePasswordReset() {
  if (!resetEmail.value) return

  try {
    await sendPasswordReset(resetEmail.value)
    alert('Password-Reset-Link wurde an Ihre E-Mail-Adresse gesendet.')
    showPasswordReset.value = false
    resetEmail.value = ''
  } catch (err: any) {
    console.error('Password reset error:', err)
    
    switch (err.code) {
      case 'auth/user-not-found':
        alert('Kein Benutzer mit dieser E-Mail-Adresse gefunden.')
        break
      case 'auth/invalid-email':
        alert('Ungültige E-Mail-Adresse.')
        break
      default:
        alert('Fehler beim Senden des Reset-Links.')
        break
    }
  }
}
</script>

<style scoped>
.auth-overlay {
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

.auth-container {
  background: white;
  border-radius: 20px;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.2),
    0 4px 20px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.auth-icon {
  font-size: 2.5rem;
}

.auth-subtitle {
  margin: 0.5rem 0 0 0;
  color: #86868b;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.auth-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1d1d1f;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.label-icon {
  font-size: 1rem;
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
  font-size: 1.1rem;
  color: #86868b;
  transition: all 0.2s ease;
  padding: 0.25rem;
}

.password-toggle:hover {
  color: #007AFF;
}

.password-hints {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.hint {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.hint.valid {
  color: #34c759;
}

.error-message {
  color: #ff3b30;
  font-size: 0.85rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 59, 48, 0.05);
  border-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.auth-submit {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-submit:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.auth-submit:disabled {
  background: #86868b;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  font-size: 1.2rem;
}

.auth-switch {
  text-align: center;
  color: #86868b;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.switch-btn {
  background: none;
  border: none;
  color: #007AFF;
  cursor: pointer;
  font-weight: 600;
  margin-left: 0.5rem;
  text-decoration: underline;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.switch-btn:hover {
  color: #0056b3;
}

.forgot-password {
  text-align: center;
}

.forgot-btn {
  background: none;
  border: none;
  color: #007AFF;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.forgot-btn:hover {
  color: #0056b3;
}

.password-reset-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.reset-content {
  text-align: center;
  padding: 2rem;
}

.reset-content h3 {
  margin: 0 0 1rem 0;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.reset-content p {
  margin: 0 0 1.5rem 0;
  color: #86868b;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.reset-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn,
.reset-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.cancel-btn {
  background: #f0f0f0;
  color: #86868b;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.reset-btn {
  background: #007AFF;
  color: white;
}

.reset-btn:hover:not(:disabled) {
  background: #0056b3;
}

.reset-btn:disabled {
  background: #86868b;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .auth-container {
    padding: 1.5rem;
  }
  
  .password-hints {
    grid-template-columns: 1fr;
  }
}
</style>
