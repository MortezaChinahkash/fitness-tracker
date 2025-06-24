<template>
  <div class="profile-container">
    <h2 class="section-title">
      <span class="section-icon">👤</span>
      Dein Profil
    </h2>
    
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">
          <span class="avatar-large">👤</span>
        </div>
        <div class="profile-info">
          <h3>John Doe</h3>
          <p>Fitness-Enthusiast seit 2023</p>
        </div>
        <button class="edit-profile-btn">
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
  </div>
</template>

<script setup lang="ts">
// Statische Profil-Daten für Demo-Zwecke
// In einer echten App würden diese aus einer Datenbank oder API kommen
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
