<template>
  <canvas
    v-show="visible"
    ref="canvas"
    class="fixed inset-0 pointer-events-none"
    style="z-index: -35; opacity: 0.6; mix-blend-mode: screen;"
    aria-hidden="true"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'Night' }
})

// L'aurore n'a de sens que la nuit / sur ciel dégagé sombre
const visible = computed(() => props.theme === 'Night')

const canvas = ref(null)
let ctx = null
let animId = null
let time = 0
let width = 0
let height = 0
let resizeTimer = null
let reduceMotion = false
let motionMQL = null
function onMotionChange(e) {
  reduceMotion = e.matches
  if (reduceMotion) stopLoop()
  else if (visible.value) startLoop()
}

const BANDS = [
  { hue: 140, speed: 0.3,  amplitude: 80, yOffset: 0.2,  width: 120 },
  { hue: 170, speed: 0.4,  amplitude: 60, yOffset: 0.25, width: 100 },
  { hue: 280, speed: 0.25, amplitude: 90, yOffset: 0.15, width: 80 },
  { hue: 200, speed: 0.35, amplitude: 70, yOffset: 0.22, width: 90 }
]

function drawAurora() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  time += 0.008

  for (const band of BANDS) {
    const baseY = height * band.yOffset
    const segments = 50

    // Trace de la bande
    ctx.beginPath()
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width
      const noise1 = Math.sin(i * 0.08 + time * band.speed) * band.amplitude
      const noise2 = Math.sin(i * 0.05 + time * band.speed * 1.3 + 1.5) * band.amplitude * 0.5
      const noise3 = Math.sin(i * 0.12 + time * band.speed * 0.7 + 3) * band.amplitude * 0.3
      const y = baseY + noise1 + noise2 + noise3
      if (i === 0) ctx.moveTo(x, y)
      else {
        const prevX = ((i - 1) / segments) * width
        const cpx = (prevX + x) / 2
        ctx.quadraticCurveTo(cpx, y, x, y)
      }
    }

    // Glow via shadowBlur natif (GPU-accéléré, infiniment plus rapide que ctx.filter='blur')
    ctx.save()
    ctx.shadowBlur = 35
    ctx.shadowColor = `hsla(${band.hue}, 90%, 65%, 0.5)`
    ctx.strokeStyle = `hsla(${band.hue}, 85%, 65%, 0.32)`
    ctx.lineWidth = band.width
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.restore()
  }

  if (visible.value && !reduceMotion) {
    animId = requestAnimationFrame(drawAurora)
  } else {
    animId = null
  }
}

function resize() {
  if (!canvas.value || !ctx) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = width * dpr
  canvas.value.height = height * dpr
  canvas.value.style.width = width + 'px'
  canvas.value.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function onResize() {
  // Debounce 120ms — évite de reconfigurer le canvas 60×/s pendant un drag
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(resize, 120)
}

function onVisibilityChange() {
  if (document.hidden) {
    if (animId) {
      cancelAnimationFrame(animId)
      animId = null
    }
  } else if (visible.value && !reduceMotion) {
    startLoop()
  }
}

function startLoop() {
  if (animId == null) drawAurora()
}

function stopLoop() {
  if (animId != null) {
    cancelAnimationFrame(animId)
    animId = null
  }
}

watch(visible, (v) => {
  if (v && !reduceMotion) startLoop()
  else stopLoop()
})

onMounted(() => {
  ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  // Respect prefers-reduced-motion (avec écoute des changements runtime)
  if (typeof window !== 'undefined' && window.matchMedia) {
    motionMQL = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotion = motionMQL.matches
    if (motionMQL.addEventListener) motionMQL.addEventListener('change', onMotionChange)
    else if (motionMQL.addListener) motionMQL.addListener(onMotionChange)
  }

  resize()
  if (visible.value && !reduceMotion) startLoop()
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  stopLoop()
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (motionMQL) {
    if (motionMQL.removeEventListener) motionMQL.removeEventListener('change', onMotionChange)
    else if (motionMQL.removeListener) motionMQL.removeListener(onMotionChange)
  }
  ctx = null
})
</script>
