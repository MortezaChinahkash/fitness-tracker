<template>
  <div class="stats-container">
    <h2 class="section-title">
      <span class="section-icon">📊</span>
      Deine Statistik
    </h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-number">{{ workoutCount }}</div>
          <div class="stat-label">Workouts</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏰</div>
        <div class="stat-content">
          <div class="stat-number">{{ totalDuration }}</div>
          <div class="stat-label">Minuten</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <div class="stat-number">{{ averageDuration }}</div>
          <div class="stat-label">Ø Dauer</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  workoutCount: number
  totalDuration: number
  averageDuration: number
}

defineProps<Props>()
</script>

<style scoped>
/* Section Titles im Apple Stil */
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

/* Statistik Cards - Apple Card Design */
.stats-container {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #007AFF, #5856D6, #AF52DE);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 2px 6px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
  filter: grayscale(0.3);
}

.stat-content {
  text-align: left;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.03em;
}

.stat-label {
  font-size: 1rem;
  font-weight: 500;
  color: #86868b;
  text-transform: none;
  letter-spacing: -0.01em;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

/* Subtile Hover-Effekte */
@media (hover: hover) {
  .stat-card:hover .stat-icon {
    transform: scale(1.05);
  }
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
