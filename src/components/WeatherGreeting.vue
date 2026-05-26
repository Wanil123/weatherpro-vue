<template>
  <div v-if="greeting" class="greeting-container mb-4 sm:mb-6">
    <div class="flex items-center gap-2 sm:gap-3">
      <span class="text-xl sm:text-2xl" role="img" :aria-label="emojiLabel">{{ emoji }}</span>
      <div>
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
          <!-- Texte complet, lu par le lecteur d'écran -->
          <span class="sr-only">{{ greeting }}</span>
          <!-- Effet machine à écrire (purement visuel) -->
          <span aria-hidden="true">
            <span class="greeting-text">{{ displayedText }}</span>
            <span v-if="!reduceMotion" class="typing-cursor" :class="{ 'cursor-blink': typingDone }">|</span>
          </span>
        </h2>
        <p v-if="subtitle && typingDone" class="text-xs sm:text-sm text-white/60 mt-1 greeting-subtitle">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useI18n } from '../i18n/useI18n'

const props = defineProps({
  city: { type: String, default: '' },
  isNight: { type: Boolean, default: false },
  temperature: { type: Number, default: null }
})

const { t } = useI18n()
const displayedText = ref('')
const typingDone = ref(false)

// Token d'invalidation pour éviter les race conditions du typing effect
let typingToken = 0
let timeout = null

// Heure réactive — mise à jour chaque minute pour refléter les transitions de greeting
const now = ref(new Date())
let clockInterval = null
const hour = computed(() => now.value.getHours())

// Respect des préférences utilisateur (reduce motion)
const reduceMotion = ref(false)
let mql = null
function syncReduceMotion(e) { reduceMotion.value = e.matches }

const greeting = computed(() => {
  if (!props.city) return ''
  const h = hour.value
  if (h >= 5 && h < 12) return t('greetingMorning', { city: props.city })
  if (h >= 12 && h < 18) return t('greetingAfternoon', { city: props.city })
  if (h >= 18 && h < 22) return t('greetingEvening', { city: props.city })
  return t('greetingNight', { city: props.city })
})

const emoji = computed(() => {
  const h = hour.value
  if (h >= 5 && h < 12) return '☀️'
  if (h >= 12 && h < 18) return '🌤️'
  if (h >= 18 && h < 22) return '🌆'
  return '🌙'
})

const emojiLabel = computed(() => {
  const h = hour.value
  if (h >= 5 && h < 12) return t('emojiSun') || 'sun'
  if (h >= 12 && h < 18) return t('emojiPartlySun') || 'partly cloudy'
  if (h >= 18 && h < 22) return t('emojiSunset') || 'sunset'
  return t('emojiMoon') || 'moon'
})

const subtitle = computed(() => {
  if (props.temperature === null || props.temperature === undefined) return ''
  if (props.temperature < 0) return t('subtitleFreezing')
  if (props.temperature < 10) return t('subtitleCold')
  if (props.temperature < 20) return t('subtitleMild')
  if (props.temperature < 30) return t('subtitleWarm')
  return t('subtitleHot')
})

function typeText(text) {
  // Invalide tout typing en cours et démarre une nouvelle séquence
  typingToken += 1
  const myToken = typingToken
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }

  // Si l'utilisateur préfère reduced motion, affiche directement
  if (reduceMotion.value) {
    displayedText.value = text
    typingDone.value = true
    return
  }

  displayedText.value = ''
  typingDone.value = false
  let i = 0

  function type() {
    // Garde-fou : si une autre séquence a démarré, on abandonne celle-ci
    if (myToken !== typingToken) return
    if (i < text.length) {
      displayedText.value += text[i]
      i++
      timeout = setTimeout(type, 40 + Math.random() * 30)
    } else {
      typingDone.value = true
    }
  }
  type()
}

onMounted(() => {
  // Respect prefers-reduced-motion
  if (typeof window !== 'undefined' && window.matchMedia) {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotion.value = mql.matches
    if (mql.addEventListener) mql.addEventListener('change', syncReduceMotion)
    else if (mql.addListener) mql.addListener(syncReduceMotion)
  }

  // Met à jour l'heure chaque minute pour les transitions de greeting
  clockInterval = setInterval(() => { now.value = new Date() }, 60_000)

  if (greeting.value) typeText(greeting.value)
})

watch(greeting, (newVal) => {
  if (newVal) typeText(newVal)
})

onBeforeUnmount(() => {
  typingToken += 1 // invalide tout pending
  if (timeout) clearTimeout(timeout)
  if (clockInterval) clearInterval(clockInterval)
  if (mql) {
    if (mql.removeEventListener) mql.removeEventListener('change', syncReduceMotion)
    else if (mql.removeListener) mql.removeListener(syncReduceMotion)
  }
})
</script>

<style scoped>
.typing-cursor {
  font-weight: 100;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 1px;
}

.cursor-blink {
  animation: blink 1.05s steps(2) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* Animation d'apparition du subtitle (déclarée en non-scoped style global pour éviter le hash) */
.greeting-subtitle {
  animation: greeting-fade-up 0.5s ease-out;
}

@keyframes greeting-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .cursor-blink { animation: none; opacity: 0.7; }
  .greeting-subtitle { animation: none; }
}
</style>
