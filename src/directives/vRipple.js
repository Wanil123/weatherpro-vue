export const vRipple = {
  mounted(el) {
    el.style.position = 'relative'
    el.style.overflow = 'hidden'

    el.addEventListener('pointerdown', (e) => {
      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const ripple = document.createElement('span')
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple-effect 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 50;
      `
      el.appendChild(ripple)
      setTimeout(() => ripple.remove(), 650)
    })
  }
}

// Inject ripple keyframes globally (once)
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes ripple-effect {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(1); opacity: 0; }
    }
  `
  document.head.appendChild(style)
}
