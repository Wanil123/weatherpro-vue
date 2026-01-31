import { ref, computed, watch } from 'vue'
import fr from './fr'
import en from './en'

const messages = { fr, en }
const STORAGE_KEY = 'wp_lang'

function detectBrowserLang() {
  const nav = navigator.language || navigator.userLanguage || ''
  const lang = nav.split('-')[0].toLowerCase()
  return lang === 'fr' ? 'fr' : 'en'
}

function loadLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && messages[stored]) return stored
  } catch {}
  return detectBrowserLang()
}

const currentLang = ref(loadLang())

watch(currentLang, (val) => {
  try {
    localStorage.setItem(STORAGE_KEY, val)
  } catch {}
  document.documentElement.setAttribute('lang', val)
})

// Set initial lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('lang', currentLang.value)
}

export function useI18n() {
  const lang = currentLang

  function t(key, params) {
    let str = messages[lang.value]?.[key] || messages.fr[key] || key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, v)
      }
    }
    return str
  }

  function toggleLang() {
    lang.value = lang.value === 'fr' ? 'en' : 'fr'
  }

  function setLang(l) {
    if (messages[l]) lang.value = l
  }

  const isFr = computed(() => lang.value === 'fr')
  const isEn = computed(() => lang.value === 'en')

  return { t, lang, toggleLang, setLang, isFr, isEn }
}
