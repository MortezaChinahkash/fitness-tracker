<template>
  <header class="app-header">
    <div class="header-container">
      <div class="header-left">
        <div class="logo">
          <span class="logo-icon">🏋️‍♂️</span>
          <h1 class="logo-text">FitnessTracker</h1>
        </div>
      </div>
      
      <nav class="header-nav">
        <button @click="$emit('navigate', 'dashboard')" :class="['nav-link', { active: currentView === 'dashboard' }]">
          <span class="nav-icon">📊</span>
          Dashboard
        </button>
        <button @click="$emit('navigate', 'workouts')" :class="['nav-link', { active: currentView === 'workouts' }]">
          <span class="nav-icon">💪</span>
          Workouts
        </button>
        <button @click="$emit('navigate', 'goals')" :class="['nav-link', { active: currentView === 'goals' }]">
          <span class="nav-icon">🎯</span>
          Ziele
        </button>
        <button @click="$emit('navigate', 'statistics')" :class="['nav-link', { active: currentView === 'statistics' }]">
          <span class="nav-icon">📈</span>
          Statistiken
        </button>
        <button @click="$emit('navigate', 'profile')" :class="['nav-link', { active: currentView === 'profile' }]">
          <span class="nav-icon">👤</span>
          Profil
        </button>
      </nav>
      
      <div class="header-right">
        <button class="notification-btn" @click="toggleReminders" :class="{ active: showReminders }">
          <span class="notification-icon">🔔</span>
          <span v-if="activeRemindersCount > 0" class="notification-badge">{{ activeRemindersCount }}</span>
        </button>
        
        <!-- User Avatar with Dropdown -->
        <div class="user-menu" ref="userMenuRef">
          <button class="user-avatar" @click="toggleUserMenu" :class="{ active: showUserMenu }">
            <img v-if="userAvatar" :src="userAvatar" :alt="userName" class="avatar-image" />
            <span v-else class="avatar-text">{{ userInitials }}</span>
          </button>
          
          <!-- User Dropdown Menu -->
          <div v-if="showUserMenu" class="user-dropdown">
            <div class="dropdown-header">
              <div class="user-info">
                <div class="user-name">{{ userName }}</div>
                <div class="user-email">{{ userEmail }}</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-actions">
              <button @click="goToProfile" class="dropdown-item">
                <span class="item-icon">👤</span>
                Profil bearbeiten
              </button>
              <button @click="handleLogout" class="dropdown-item logout-item">
                <span class="item-icon">🚪</span>
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { logoutUser } from '../firebase/authService'
import { useFirebase } from '../composables/useFirebase'

// Props für den aktuellen View-Status
interface Props {
  currentView?: string
}

defineProps<Props>()

// Events für Navigation
const emit = defineEmits<{
  navigate: [view: string]
  toggleReminders: []
}>()

// Firebase integration
const { user, userProfileData } = useFirebase()

// Reminder State
const showReminders = ref(false)
const savedReminders = ref<any[]>([])

// User Menu State
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

// Computed Properties
const activeRemindersCount = computed(() => {
  return savedReminders.value.filter(reminder => reminder.enabled).length
})

const userName = computed(() => {
  return userProfileData.value?.name || user.value?.displayName || 'Benutzer'
})

const userEmail = computed(() => {
  return userProfileData.value?.email || user.value?.email || ''
})

const userAvatar = computed(() => {
  return userProfileData.value?.avatar || user.value?.photoURL || null
})

const userInitials = computed(() => {
  const name = userName.value
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
})

// Methods
/**
 * Toggles the reminders modal
 */
function toggleReminders() {
  showReminders.value = !showReminders.value
  emit('toggleReminders')
}

/**
 * Toggles the user menu dropdown
 */
function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

/**
 * Navigates to the profile page and closes the user menu
 */
function goToProfile() {
  emit('navigate', 'profile')
  showUserMenu.value = false
}

/**
 * Handles user logout
 */
async function handleLogout() {
  try {
    await logoutUser()
    showUserMenu.value = false
    // User will be automatically redirected by the auth state change
  } catch (error) {
    console.error('Error logging out:', error)
    alert('Fehler beim Abmelden. Bitte versuchen Sie es erneut.')
  }
}

/**
 * Closes user menu when clicking outside
 */
function handleClickOutside(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

/**
 * Loads reminders from localStorage
 */
function loadReminders() {
  const saved = localStorage.getItem('workout-reminders')
  if (saved) {
    savedReminders.value = JSON.parse(saved)
  }
}

// Lifecycle
onMounted(() => {
  loadReminders()
  
  // Listen for reminder updates
  window.addEventListener('storage', (e) => {
    if (e.key === 'workout-reminders') {
      loadReminders()
    }
  })
  
  // Listen for clicks outside user menu
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Cleanup event listener
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Logo Section */
.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-icon {
  font-size: 2rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0;
  letter-spacing: -0.02em;
}

/* Navigation */
.header-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #86868b;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.nav-link:hover {
  background: #f5f5f7;
  color: #1d1d1f;
}

.nav-link.active {
  background: #007AFF;
  color: white;
}

.nav-link.active:hover {
  background: #0056b3;
}

.nav-icon {
  font-size: 1rem;
  opacity: 0.8;
}

/* Header Right */
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notification-btn {
  position: relative;
  background: #f5f5f7;
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-btn:hover {
  background: #e8e8ed;
  transform: scale(1.05);
}

.notification-btn.active {
  background: #007AFF;
  color: white;
}

.notification-btn.active:hover {
  background: #0056b3;
}

.notification-icon {
  font-size: 1.2rem;
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ff3b30;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
    height: 60px;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
  
  .header-nav {
    display: none;
  }
  
  .nav-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 1rem;
  }
  
  .logo {
    gap: 0.5rem;
  }
  
  .logo-icon {
    font-size: 1.8rem;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .header-right {
    gap: 0.75rem;
  }
  
  .notification-btn,
  .user-avatar {
    width: 36px;
    height: 36px;
  }
}

/* Animationen */
.app-header {
  animation: slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fokus-Indikatoren */
.nav-link:focus-visible,
.notification-btn:focus-visible,
.user-avatar:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}

/* User Menu Styles */
.user-menu {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  position: relative;
  overflow: hidden;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.user-avatar.active {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.04);
  min-width: 240px;
  overflow: hidden;
  z-index: 1000;
  animation: dropdownSlide 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-header {
  padding: 1.25rem 1.5rem 1rem;
}

.user-info .user-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 0.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.user-info .user-email {
  font-size: 0.9rem;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.dropdown-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 0 1rem;
}

.dropdown-actions {
  padding: 0.75rem 0;
}

.dropdown-item {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.dropdown-item:hover {
  background: #f5f5f7;
}

.dropdown-item.logout-item {
  color: #ff3b30;
}

.dropdown-item.logout-item:hover {
  background: rgba(255, 59, 48, 0.05);
}

.item-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}
</style>
