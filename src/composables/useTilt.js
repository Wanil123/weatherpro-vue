import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useTilt(elRef, { maxTilt = 8, scale = 1.02, speed = 400 } = {}) {
  const style = ref({})

  function handleMove(e) {
    const el = elRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - y) * maxTilt
    const rotateY = (x - 0.5) * maxTilt

    style.value = {
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
    }
  }

  function handleLeave() {
    style.value = {
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
    }
  }

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
  })

  onBeforeUnmount(() => {
    const el = elRef.value
    if (!el) return
    el.removeEventListener('mousemove', handleMove)
    el.removeEventListener('mouseleave', handleLeave)
  })

  return { tiltStyle: style }
}
