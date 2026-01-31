import { ref, watch, onBeforeUnmount } from 'vue'

export function useAnimatedNumber(source, { duration = 600, decimals = 0 } = {}) {
  const displayed = ref(typeof source.value === 'number' ? source.value : 0)
  let animId = null

  function animateTo(target) {
    if (typeof target !== 'number' || isNaN(target)) return
    const start = displayed.value
    const diff = target - start
    if (Math.abs(diff) < 0.01) {
      displayed.value = target
      return
    }
    const startTime = performance.now()

    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      displayed.value = parseFloat((start + diff * eased).toFixed(decimals))
      if (progress < 1) {
        animId = requestAnimationFrame(tick)
      } else {
        displayed.value = parseFloat(target.toFixed(decimals))
      }
    }

    if (animId) cancelAnimationFrame(animId)
    animId = requestAnimationFrame(tick)
  }

  watch(source, (val) => {
    if (typeof val === 'number') animateTo(val)
  }, { immediate: true })

  onBeforeUnmount(() => {
    if (animId) cancelAnimationFrame(animId)
  })

  return displayed
}
