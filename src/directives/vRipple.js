// Directive v-ripple : effet Material visuel au clic, sans fuite mémoire.
// Garde une référence au handler pour pouvoir le retirer dans unmounted.
const HANDLERS = new WeakMap()
const RIPPLE_DURATION = 600
const RIPPLE_STYLE_ID = 'wp-ripple-style'

export const vRipple = {
  mounted(el, binding) {
    // Préserve la position existante si déjà absolute/fixed
    const cs = window.getComputedStyle(el)
    if (cs.position === 'static') el.style.position = 'relative'
    el.style.overflow = 'hidden'

    const color = binding.value || 'rgba(255, 255, 255, 0.25)'

    function onPointerDown(e) {
      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const ripple = document.createElement('span')
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: wp-ripple-effect ${RIPPLE_DURATION}ms ease-out forwards;
        pointer-events: none;
        z-index: 0;
      `
      el.appendChild(ripple)
      setTimeout(() => {
        if (ripple.parentNode) ripple.remove()
      }, RIPPLE_DURATION + 50)
    }

    el.addEventListener('pointerdown', onPointerDown, { passive: true })
    HANDLERS.set(el, onPointerDown)
  },

  unmounted(el) {
    const handler = HANDLERS.get(el)
    if (handler) {
      el.removeEventListener('pointerdown', handler)
      HANDLERS.delete(el)
    }
  }
}

// Injection unique du keyframe (idempotent)
if (typeof document !== 'undefined' && !document.getElementById(RIPPLE_STYLE_ID)) {
  const style = document.createElement('style')
  style.id = RIPPLE_STYLE_ID
  style.textContent = `
    @keyframes wp-ripple-effect {
      0%   { transform: scale(0); opacity: 1; }
      100% { transform: scale(1); opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      @keyframes wp-ripple-effect {
        0%, 100% { transform: scale(1); opacity: 0; }
      }
    }
  `
  document.head.appendChild(style)
}
