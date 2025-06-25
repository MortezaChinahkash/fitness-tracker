<template>
  <div class="reminder-modal" v-if="isOpen" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>🔔 Workout-Erinnerungen</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <!-- Bestehende Reminder -->
        <div v-if="reminders.length > 0" class="reminders-list">
          <h3>Aktive Erinnerungen</h3>
          <div v-for="(reminder, index) in reminders" :key="index" class="reminder-item">
            <div class="reminder-info">
              <span class="reminder-icon">⏰</span>
              <div class="reminder-details">
                <div class="reminder-time">{{ reminder.time }}</div>
                <div class="reminder-message">{{ reminder.message }}</div>
                <div class="reminder-days">{{ formatDays(reminder.days) }}</div>
              </div>
            </div>
            <div class="reminder-actions">
              <button class="toggle-btn" @click="toggleReminder(index)" :class="{ active: reminder.enabled }">
                {{ reminder.enabled ? '✓' : '○' }}
              </button>
              <button class="delete-btn" @click="deleteReminder(index)">🗑️</button>
            </div>
          </div>
        </div>

        <!-- Neue Erinnerung hinzufügen -->
        <div class="add-reminder-section">
          <h3>Neue Erinnerung hinzufügen</h3>
          
          <div class="form-group">
            <label>Uhrzeit</label>
            <input 
              type="time" 
              v-model="newReminder.time" 
              class="time-input"
            />
          </div>

          <div class="form-group">
            <label>Nachricht</label>
            <input 
              type="text" 
              v-model="newReminder.message" 
              placeholder="z.B. Zeit für dein Workout!"
              class="message-input"
            />
          </div>

          <div class="form-group">
            <label>Wochentage</label>
            <div class="days-selector">
              <button 
                v-for="(day, index) in weekDays" 
                :key="index"
                @click="toggleDay(index)"
                :class="['day-btn', { active: newReminder.days[index] }]"
              >
                {{ day }}
              </button>
            </div>
          </div>

          <button @click="addReminder" class="add-btn" :disabled="!canAddReminder">
            <span>➕</span>
            Erinnerung hinzufügen
          </button>
        </div>

        <!-- Benachrichtigungsberechtigung -->
        <div v-if="!notificationPermission" class="permission-section">
          <div class="permission-info">
            <span class="warning-icon">⚠️</span>
            <div>
              <h4>Benachrichtigungen aktivieren</h4>
              <p>Um Workout-Erinnerungen zu erhalten, musst du Benachrichtigungen erlauben.</p>
            </div>
          </div>
          <button @click="requestNotificationPermission" class="permission-btn">
            Benachrichtigungen aktivieren
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Reminder {
  time: string
  message: string
  days: boolean[]
  enabled: boolean
  id: string
}

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  reminderAdded: [reminder: Reminder]
}>()

// Reactive Data
const reminders = ref<Reminder[]>([])
const notificationPermission = ref(false)
const activeTimeouts = ref<Map<string, number>>(new Map())

const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

const newReminder = ref({
  time: '18:00',
  message: 'Zeit für dein Workout! 💪',
  days: [true, true, true, true, true, false, false] // Mo-Fr als Standard
})

// Computed
const canAddReminder = computed(() => {
  return newReminder.value.time && 
         newReminder.value.message.trim() && 
         newReminder.value.days.some(day => day)
})

// Methods
function closeModal() {
  emit('close')
}

function toggleDay(index: number) {
  newReminder.value.days[index] = !newReminder.value.days[index]
}

function formatDays(days: boolean[]): string {
  const selectedDays = days.map((selected, index) => selected ? weekDays[index] : null)
    .filter(day => day !== null)
  
  if (selectedDays.length === 7) return 'Täglich'
  if (selectedDays.length === 5 && !days[5] && !days[6]) return 'Werktags'
  if (selectedDays.length === 2 && days[5] && days[6]) return 'Wochenende'
  
  return selectedDays.join(', ')
}

function addReminder() {
  if (!canAddReminder.value) return

  const reminder: Reminder = {
    id: Date.now().toString(),
    time: newReminder.value.time,
    message: newReminder.value.message.trim(),
    days: [...newReminder.value.days],
    enabled: true
  }

  reminders.value.push(reminder)
  scheduleReminder(reminder)
  saveReminders()
  
  // Form zurücksetzen
  newReminder.value = {
    time: '18:00',
    message: 'Zeit für dein Workout! 💪',
    days: [true, true, true, true, true, false, false]
  }

  emit('reminderAdded', reminder)
}

function toggleReminder(index: number) {
  const reminder = reminders.value[index]
  reminder.enabled = !reminder.enabled
  
  if (reminder.enabled) {
    scheduleReminder(reminder)
  } else {
    clearReminder(reminder.id)
  }
  
  saveReminders()
}

function deleteReminder(index: number) {
  const reminder = reminders.value[index]
  clearReminder(reminder.id)
  reminders.value.splice(index, 1)
  saveReminders()
}

function scheduleReminder(reminder: Reminder) {
  if (!reminder.enabled || !notificationPermission.value) return

  clearReminder(reminder.id)

  // Nächste Ausführungszeit berechnen
  const now = new Date()
  const [hours, minutes] = reminder.time.split(':').map(Number)
  
  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(now)
    targetDate.setDate(now.getDate() + i)
    targetDate.setHours(hours, minutes, 0, 0)
    
    // Prüfen ob der Tag aktiviert ist (Mo=1, So=0 -> Mo=0, So=6 in unserem Array)
    const dayOfWeek = targetDate.getDay()
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Sonntag (0) -> Index 6, Montag (1) -> Index 0
    
    if (reminder.days[dayIndex] && targetDate > now) {
      const timeUntilReminder = targetDate.getTime() - now.getTime()
      
      const timeoutId = window.setTimeout(() => {
        showNotification(reminder)
        // Nach der Benachrichtigung für die nächste Woche planen
        scheduleReminder(reminder)
      }, timeUntilReminder)
      
      activeTimeouts.value.set(reminder.id, timeoutId)
      break
    }
  }
}

function clearReminder(reminderId: string) {
  const timeoutId = activeTimeouts.value.get(reminderId)
  if (timeoutId) {
    clearTimeout(timeoutId)
    activeTimeouts.value.delete(reminderId)
  }
}

function showNotification(reminder: Reminder) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('Fitness-Tracker Erinnerung', {
      body: reminder.message,
      icon: '🏋️‍♂️',
      tag: `workout-reminder-${reminder.id}`,
      requireInteraction: true
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // Notification nach 10 Sekunden automatisch schließen
    setTimeout(() => notification.close(), 10000)
  }
}

async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    notificationPermission.value = permission === 'granted'
    
    if (notificationPermission.value) {
      // Alle aktiven Reminder neu planen
      reminders.value.forEach(reminder => {
        if (reminder.enabled) {
          scheduleReminder(reminder)
        }
      })
    }
  }
}

function checkNotificationPermission() {
  if ('Notification' in window) {
    notificationPermission.value = Notification.permission === 'granted'
  }
}

function saveReminders() {
  localStorage.setItem('workout-reminders', JSON.stringify(reminders.value))
}

function loadReminders() {
  const saved = localStorage.getItem('workout-reminders')
  if (saved) {
    reminders.value = JSON.parse(saved)
    
    // Alle aktiven Reminder planen
    reminders.value.forEach(reminder => {
      if (reminder.enabled && notificationPermission.value) {
        scheduleReminder(reminder)
      }
    })
  }
}

// Lifecycle
onMounted(() => {
  checkNotificationPermission()
  loadReminders()
})

// Cleanup beim Schließen
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    // Timeouts bleiben aktiv, da Erinnerungen weiter funktionieren sollen
  }
})
</script>

<style scoped>
.reminder-modal {
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
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.2),
    0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.close-btn {
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

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.modal-body {
  padding: 1rem 2rem 2rem;
}

.reminders-list {
  margin-bottom: 2rem;
}

.reminders-list h3,
.add-reminder-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.reminder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f5f5f7;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.reminder-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.reminder-icon {
  font-size: 1.5rem;
}

.reminder-details {
  flex: 1;
}

.reminder-time {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1d1d1f;
  margin-bottom: 0.25rem;
}

.reminder-message {
  color: #86868b;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.reminder-days {
  color: #007AFF;
  font-size: 0.8rem;
  font-weight: 500;
}

.reminder-actions {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn,
.delete-btn {
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.toggle-btn {
  background: #e5e5ea;
  color: #86868b;
}

.toggle-btn.active {
  background: #34c759;
  color: white;
}

.delete-btn {
  background: #ff3b30;
  color: white;
}

.delete-btn:hover {
  background: #d70015;
}

.add-reminder-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.time-input,
.message-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #f5f5f7;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  transition: all 0.2s ease;
  outline: none;
}

.time-input:focus,
.message-input:focus {
  border-color: #007AFF;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.days-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.day-btn {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #f5f5f7;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #86868b;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.day-btn.active {
  background: #007AFF;
  border-color: #007AFF;
  color: white;
}

.day-btn:hover {
  transform: translateY(-1px);
}

.add-btn {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  width: 100%;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.add-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.add-btn:disabled {
  background: #86868b;
  cursor: not-allowed;
  transform: none;
}

.permission-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 2rem;
  margin-top: 2rem;
}

.permission-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #fff3cd;
  border-radius: 12px;
  border: 1px solid #ffeaa7;
}

.warning-icon {
  font-size: 1.5rem;
}

.permission-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #856404;
}

.permission-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #856404;
  line-height: 1.4;
}

.permission-btn {
  background: #ffc107;
  color: #856404;
  border: none;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
}

.permission-btn:hover {
  background: #e0a800;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 480px) {
  .modal-content {
    margin: 0.5rem;
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body {
    padding: 1.5rem 1rem;
  }
  
  .reminder-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .reminder-actions {
    align-self: flex-end;
  }
  
  .days-selector {
    justify-content: space-between;
  }
  
  .day-btn {
    flex: 1;
    text-align: center;
    min-width: 40px;
  }
}
</style>
