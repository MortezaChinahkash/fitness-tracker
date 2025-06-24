<template>
  <div class="empty-state">
    <div class="empty-icon">🎯</div>
    <h3>Noch keine Workouts</h3>
    <p>Füge dein erstes Workout hinzu und starte deine Fitness-Reise!</p>
  </div>
</template>

<script setup lang="ts">
// Keine Props oder Logik erforderlich - reine Präsentation
</script>

<style scoped>
/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.02em;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.empty-state p {
  margin: 0;
  color: #86868b;
  font-size: 1.1rem;
  line-height: 1.5;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

/* Apple-style Typography */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
