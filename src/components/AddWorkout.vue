<script setup lang="ts">
import { ref } from 'vue'

// Reaktive Felder
const type = ref('')
const duration = ref(0)
const date = ref('')

// Das Event vorbereiten (damit wir Daten an die App schicken können)
const emit = defineEmits(['add'])

function addWorkout() {
  // An die Haupt-App schicken:
  emit('add', {
    type: type.value,
    duration: duration.value,
    date: date.value
  })

  // Felder zurücksetzen
  type.value = ''
  duration.value = 0
  date.value = ''
}
</script>
