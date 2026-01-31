<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 pointer-events-none"
    style="z-index: -35; opacity: 0.6; mix-blend-mode: screen;"
    aria-hidden="true"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref(null)
let ctx = null
let animId = null
let time = 0
let width = 0
let height = 0

const BANDS = [
  { hue: 140, speed: 0.3, amplitude: 80, yOffset: 0.2, width: 120 },
  { hue: 170, speed: 0.4, amplitude: 60, yOffset: 0.25, width: 100 },
  { hue: 280, speed: 0.25, amplitude: 90, yOffset: 0.15, width: 80 },
  { hue: 200, speed: 0.35, amplitude: 70, yOffset: 0.22, width: 90 }
]

function drawAurora() {
  ctx.clearRect(0, 0, width, height)
  time += 0.008

  for (const band of BANDS) {
    ctx.beginPath()
    const baseY = height * band.yOffset
    const segments = 60

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width
      const noise1 = Math.sin(i * 0.08 + time * band.speed) * band.amplitude
      const noise2 = Math.sin(i * 0.05 + time * band.speed * 1.3 + 1.5) * band.amplitude * 0.5
      const noise3 = Math.sin(i * 0.12 + time * band.speed * 0.7 + 3) * band.amplitude * 0.3
      const y = baseY + noise1 + noise2 + noise3

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        const prevX = ((i - 1) / segments) * width
        const cpx = (prevX + x) / 2
        ctx.quadraticCurveTo(cpx, y, x, y)
      }
    }

    // Create gradient for the aurora band
    const gradient = ctx.createLinearGradient(0, baseY - band.width, 0, baseY + band.width)
    gradient.addColorStop(0, `hsla(${band.hue}, 80%, 60%, 0)`)
    gradient.addColorStop(0.3, `hsla(${band.hue}, 80%, 60%, 0.15)`)
    gradient.addColorStop(0.5, `hsla(${band.hue}, 90%, 65%, 0.25)`)
    gradient.addColorStop(0.7, `hsla(${band.hue}, 80%, 60%, 0.15)`)
    gradient.addColorStop(1, `hsla(${band.hue}, 80%, 60%, 0)`)

    ctx.strokeStyle = `hsla(${band.hue}, 85%, 65%, 0.3)`
    ctx.lineWidth = band.width
    ctx.lineCap = 'round'
    ctx.stroke()

    // Draw glow
    ctx.save()
    ctx.filter = 'blur(30px)'
    ctx.strokeStyle = `hsla(${band.hue}, 90%, 70%, 0.15)`
    ctx.lineWidth = band.width * 1.5
    ctx.stroke()
    ctx.restore()
  }

  animId = requestAnimationFrame(drawAurora)
}

function resize() {
  if (!canvas.value) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = width * dpr
  canvas.value.height = height * dpr
  canvas.value.style.width = width + 'px'
  canvas.value.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

onMounted(() => {
  ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  resize()
  drawAurora()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
})
</script>
