<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- Footer Links Section -->
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">FitnessTracker</h3>
          <p class="footer-description">
            Deine persönliche Fitness-App für ein gesünderes Leben. 
            Verfolge deine Fortschritte und erreiche deine Ziele.
          </p>
        </div>
        
        <div class="footer-section">
          <h4 class="section-title">Features</h4>
          <ul class="footer-links">
            <li><a href="#workouts" class="footer-link">Workout-Tracking</a></li>
            <li><a href="#statistics" class="footer-link">Statistiken</a></li>
            <li><a href="#goals" class="footer-link">Ziele setzen</a></li>
            <li><a href="#progress" class="footer-link">Fortschritt</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="section-title">Support</h4>
          <ul class="footer-links">
            <li><a href="#help" class="footer-link">Hilfe Center</a></li>
            <li><a href="#contact" class="footer-link">Kontakt</a></li>
            <li><a href="#faq" class="footer-link">FAQ</a></li>
            <li><a href="#feedback" class="footer-link">Feedback</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="section-title">Verbinden</h4>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Instagram">
              <span class="social-icon">📷</span>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <span class="social-icon">🐦</span>
            </a>
            <a href="#" class="social-link" aria-label="Facebook">
              <span class="social-icon">📘</span>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <span class="social-icon">📺</span>
            </a>
          </div>
          <div class="newsletter">
            <p class="newsletter-text">Newsletter abonnieren</p>
            <div class="newsletter-form">
              <input 
                type="email" 
                placeholder="Deine E-Mail" 
                class="newsletter-input"
              />
              <button class="newsletter-btn">📧</button>
            </div>
          </div>
        </div>
      </div>
      
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="footer-info">
            <p class="copyright">
              © {{ currentYear }} FitnessTracker. Alle Rechte vorbehalten.
            </p>
            <div class="legal-links">
              <a href="#privacy" class="legal-link">Datenschutz</a>
              <span class="separator">•</span>
              <a href="#terms" class="legal-link">AGB</a>
              <span class="separator">•</span>
              <a href="#imprint" class="legal-link">Impressum</a>
            </div>
          </div>
          <div class="footer-stats">
            <div class="stat-item">
              <span class="stat-icon">💪</span>
              <span class="stat-text">{{ workoutCount }}+ Workouts</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">⭐</span>
              <span class="stat-text">4.9 Bewertung</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props für dynamische Inhalte
interface Props {
  workoutCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  workoutCount: 1000
})

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background: #1d1d1f;
  color: #f5f5f7;
  margin-top: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Footer Content */
.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  padding: 3rem 2rem 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f5f5f7;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.footer-description {
  color: #86868b;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #f5f5f7;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.01em;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: #86868b;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  line-height: 1.5;
}

.footer-link:hover {
  color: #007AFF;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #2d2d30;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: #007AFF;
  transform: translateY(-2px);
}

.social-icon {
  font-size: 1.2rem;
  filter: grayscale(1);
  transition: filter 0.2s ease;
}

.social-link:hover .social-icon {
  filter: none;
}

/* Newsletter */
.newsletter-text {
  color: #86868b;
  font-size: 0.9rem;
  margin: 0 0 0.75rem 0;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #48484a;
  border-radius: 8px;
  background: #2d2d30;
  color: #f5f5f7;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

.newsletter-input:focus {
  border-color: #007AFF;
  background: #1d1d1f;
}

.newsletter-input::placeholder {
  color: #86868b;
}

.newsletter-btn {
  background: #007AFF;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.newsletter-btn:hover {
  background: #0056b3;
  transform: scale(1.05);
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid #48484a;
  padding: 1.5rem 2rem;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.copyright {
  color: #86868b;
  font-size: 0.85rem;
  margin: 0;
}

.legal-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legal-link {
  color: #86868b;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: #007AFF;
}

.separator {
  color: #48484a;
  font-size: 0.85rem;
}

/* Footer Stats */
.footer-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-text {
  color: #86868b;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1rem 1.5rem;
  }
  
  .footer-bottom {
    padding: 1.5rem 1rem;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .footer-stats {
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 1.5rem 1rem 1rem;
  }
  
  .social-links {
    justify-content: flex-start;
  }
  
  .social-link {
    width: 36px;
    height: 36px;
  }
  
  .newsletter-form {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .legal-links {
    flex-wrap: wrap;
  }
  
  .footer-stats {
    flex-direction: column;
    gap: 0.75rem;
    align-self: stretch;
  }
}

/* Animation */
.app-footer {
  animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fokus-Indikatoren */
.footer-link:focus-visible,
.social-link:focus-visible,
.legal-link:focus-visible,
.newsletter-input:focus-visible,
.newsletter-btn:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}
</style>
