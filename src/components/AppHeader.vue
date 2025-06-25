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
        <button class="notification-btn">
          <span class="notification-icon">🔔</span>
          <span class="notification-badge">3</span>
        </button>
        <div class="user-avatar">
          <span class="avatar-text">JD</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Props für den aktuellen View-Status
interface Props {
  currentView?: string
}

defineProps<Props>()

// Events für Navigation
defineEmits<{
  navigate: [view: string]
}>()
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

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.avatar-text {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
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
</style>
