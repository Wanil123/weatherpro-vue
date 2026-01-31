<template>
  <div v-if="greeting" class="greeting-container mb-4 sm:mb-6">
    <div class="flex items-center gap-2 sm:gap-3">
      <span class="text-xl sm:text-2xl">{{ emoji }}</span>
      <div>
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
          <span class="greeting-text">{{ displayedText }}</span>
          <span class="typing-cursor" :class="{ 'cursor-blink': typingDone }">|</span>
        </h2>
        <p v-if="subtitle && typingDone" class="text-xs sm:text-sm text-white/60 mt-1 animate-[fade-up_0.5s_ease-out]">
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
let timeout = null

const hour = new Date().getHours()

const greeting = computed(() => {
  if (!props.city) return ''
  if (hour >= 5 && hour < 12) return t('greetingMorning', { city: props.city })
  if (hour >= 12 && hour < 18) return t('greetingAfternoon', { city: props.city })
  if (hour >= 18 && hour < 22) return t('greetingEvening', { city: props.city })
  return t('greetingNight', { city: props.city })
})

const emoji = computed(() => {
  if (hour >= 5 && hour < 12) return '\u2600\uFE0F'
  if (hour >= 12 && hour < 18) return '\uD83C\uDF24\uFE0F'
  if (hour >= 18 && hour < 22) return '\uD83C\uDF06'
  return '\uD83C\uDF19'
})

const subtitle = computed(() => {
  if (props.temperature === null) return ''
  if (props.temperature < 0) return t('subtitleFreezing')
  if (props.temperature < 10) return t('subtitleCold')
  if (props.temperature < 20) return t('subtitleMild')
  if (props.temperature < 30) return t('subtitleWarm')
  return t('subtitleHot')
})

function typeText(text) {
  displayedText.value = ''
  typingDone.value = false
  let i = 0

  function type() {
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
  if (greeting.value) {
    typeText(greeting.value)
  }
})

watch(greeting, (newVal) => {
  if (newVal) {
    if (timeout) clearTimeout(timeout)
    typeText(newVal)
  }
})

onBeforeUnmount(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.typing-cursor {
  font-weight: 100;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 1px;
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
