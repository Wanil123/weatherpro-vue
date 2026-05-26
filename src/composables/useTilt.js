import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

/**
 * Tilt 3D au mouvement souris.
 * - Respect prefers-reduced-motion (désactive)
 * - Pas de tilt sur appareils tactiles (hover: none)
 * - Throttle via requestAnimationFrame
 * - Cleanup correct même si l'élément est démonté avant onBeforeUnmount
 */
export function useTilt(elRef, { maxTilt = 8, scale = 1.02, speed = 400 } = {}) {
  const style = ref({})
  let attachedEl = null
  let rafId = null
  let lastEvent = null
  let rect = null
  let disabled = false

  function recomputeRect() {
    if (attachedEl) rect = attachedEl.getBoundingClientRect()
  }

  function tick() {
    rafId = null
    if (!lastEvent || !rect) return
    const x = (lastEvent.clientX - rect.left) / rect.width
    const y = (lastEvent.clientY - rect.top) / rect.height
    const rotateX = (0.5 - y) * maxTilt
    const rotateY = (x - 0.5) * maxTilt
    style.value = {
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
      willChange: 'transform'
    }
  }

  function handleEnter() {
    if (disabled) return
    recomputeRect()
  }

  function handleMove(e) {
    if (disabled || !rect) return
    lastEvent = e
    if (rafId == null) rafId = requestAnimationFrame(tick)
  }

  function handleLeave() {
    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    lastEvent = null
    style.value = {
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
    }
  }

  function attach(el) {
    if (!el || attachedEl === el) return
    detach()
    attachedEl = el

    // Désactive sur tactile et reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const noHover = window.matchMedia('(hover: none)').matches
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      disabled = noHover || reduce
    }

    if (disabled) return

    el.addEventListener('mouseenter', handleEnter, { passive: true })
    el.addEventListener('mousemove', handleMove, { passive: true })
    el.addEventListener('mouseleave', handleLeave, { passive: true })
    window.addEventListener('scroll', recomputeRect, { passive: true })
    window.addEventListener('resize', recomputeRect, { passive: true })
  }

  function detach() {
    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (!attachedEl) return
    attachedEl.removeEventListener('mouseenter', handleEnter)
    attachedEl.removeEventListener('mousemove', handleMove)
    attachedEl.removeEventListener('mouseleave', handleLeave)
    window.removeEventListener('scroll', recomputeRect)
    window.removeEventListener('resize', recomputeRect)
    attachedEl = null
  }

  onMounted(() => {
    if (elRef.value) attach(elRef.value)
  })

  // Si l'élément est créé conditionnellement (v-if), attache à la première résolution
  watch(elRef, (val) => {
    if (val) attach(val)
    else detach()
  })

  onBeforeUnmount(() => {
    detach()
  })

  return { tiltStyle: style }
}
