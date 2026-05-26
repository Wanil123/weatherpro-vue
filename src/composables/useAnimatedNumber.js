import { ref, watch, onBeforeUnmount } from 'vue'

/**
 * Anime un nombre vers sa cible (ease-out cubic).
 * - Respect prefers-reduced-motion : set direct sans animation.
 * - Pas d'animation parasite quand la cible n'a pas changé.
 */
export function useAnimatedNumber(source, { duration = 600, decimals = 0 } = {}) {
  const initial = typeof source.value === 'number' ? source.value : 0
  const displayed = ref(initial)
  let animId = null

  let reduceMotion = false
  if (typeof window !== 'undefined' && window.matchMedia) {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const factor = Math.pow(10, decimals)
  const round = decimals === 0 ? Math.round : (n) => Math.round(n * factor) / factor

  function animateTo(target) {
    if (typeof target !== 'number' || isNaN(target)) return
    if (reduceMotion) {
      displayed.value = round(target)
      return
    }
    const start = displayed.value
    const diff = target - start
    if (Math.abs(diff) < 0.01) {
      displayed.value = round(target)
      return
    }
    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      displayed.value = round(start + diff * eased)
      if (progress < 1) {
        animId = requestAnimationFrame(tick)
      } else {
        displayed.value = round(target)
        animId = null
      }
    }

    if (animId) cancelAnimationFrame(animId)
    animId = requestAnimationFrame(tick)
  }

  // Premier set : pas d'animation parasite, juste sync à la valeur initiale
  watch(source, (val, oldVal) => {
    if (typeof val !== 'number') return
    if (oldVal === undefined || displayed.value === val) {
      displayed.value = round(val)
      return
    }
    animateTo(val)
  }, { immediate: false })

  onBeforeUnmount(() => {
    if (animId) cancelAnimationFrame(animId)
  })

  return displayed
}
