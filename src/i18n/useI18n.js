import { ref, computed, watch } from 'vue'
import fr from './fr'
import en from './en'

const messages = { fr, en }
const SUPPORTED = ['fr', 'en']
const FALLBACK = 'en'
const STORAGE_KEY = 'wp_lang'

function detectBrowserLang() {
  if (typeof navigator === 'undefined') return FALLBACK
  // Utilise nav.languages[] (tableau ordonné par préférence) puis nav.language
  const candidates = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language || '']
  for (const c of candidates) {
    const code = (c || '').split('-')[0].toLowerCase()
    if (SUPPORTED.includes(code)) return code
  }
  return FALLBACK
}

function loadLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && messages[stored]) return stored
  } catch {
    // localStorage non disponible
  }
  return detectBrowserLang()
}

const currentLang = ref(loadLang())

function applyToDocument(val) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('lang', val)
  // Prépare le terrain pour un futur support RTL (ar, he, fa…)
  const rtlLangs = ['ar', 'he', 'fa', 'ur']
  document.documentElement.setAttribute('dir', rtlLangs.includes(val) ? 'rtl' : 'ltr')
}

watch(currentLang, (val) => {
  try {
    localStorage.setItem(STORAGE_KEY, val)
  } catch {
    // ignore
  }
  applyToDocument(val)
})

// Sync initial
applyToDocument(currentLang.value)

/**
 * Interpolation globale : remplace toutes les occurrences de {key} dans la chaîne.
 */
function interpolate(str, params) {
  if (!params) return str
  let out = str
  for (const [k, v] of Object.entries(params)) {
    // Échappe les caractères regex spéciaux dans la clé pour éviter une injection
    const safeKey = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(`\\{${safeKey}\\}`, 'g'), v)
  }
  return out
}

export function useI18n() {
  const lang = currentLang

  function t(key, params) {
    const str =
      messages[lang.value]?.[key] ??
      messages[FALLBACK]?.[key] ??
      key
    return interpolate(str, params)
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
