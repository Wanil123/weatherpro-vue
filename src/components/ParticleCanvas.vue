<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 pointer-events-none"
    style="z-index: -30;"
    aria-hidden="true"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'Clear' },
  mouseX: { type: Number, default: 0 },
  mouseY: { type: Number, default: 0 }
})

const canvas = ref(null)
let ctx = null
let animId = null
let particles = []
let width = 0
let height = 0
let dpr = 1

// Particle class
class Particle {
  constructor(type, w, h) {
    this.type = type
    this.reset(w, h, true)
  }

  reset(w, h, initial = false) {
    const t = this.type
    if (t === 'rain') {
      this.x = Math.random() * w
      this.y = initial ? Math.random() * h : -10
      this.speed = 8 + Math.random() * 8
      this.length = 15 + Math.random() * 20
      this.opacity = 0.15 + Math.random() * 0.3
      this.wind = -1.5
    } else if (t === 'snow') {
      this.x = Math.random() * w
      this.y = initial ? Math.random() * h : -10
      this.speed = 0.5 + Math.random() * 1.5
      this.radius = 1 + Math.random() * 3
      this.opacity = 0.3 + Math.random() * 0.5
      this.wobble = Math.random() * Math.PI * 2
      this.wobbleSpeed = 0.01 + Math.random() * 0.03
    } else if (t === 'star') {
      this.x = Math.random() * w
      this.y = Math.random() * h * 0.7
      this.radius = 0.5 + Math.random() * 1.5
      this.opacity = 0.2 + Math.random() * 0.6
      this.twinkleSpeed = 0.005 + Math.random() * 0.02
      this.twinklePhase = Math.random() * Math.PI * 2
      this.speed = 0
    } else if (t === 'firefly') {
      this.x = Math.random() * w
      this.y = h * 0.3 + Math.random() * h * 0.6
      this.radius = 1.5 + Math.random() * 2
      this.opacity = 0
      this.targetOpacity = 0.3 + Math.random() * 0.5
      this.speed = 0.2 + Math.random() * 0.5
      this.angle = Math.random() * Math.PI * 2
      this.angleSpeed = 0.01 + Math.random() * 0.02
      this.pulsePhase = Math.random() * Math.PI * 2
      this.hue = 40 + Math.random() * 30 // warm yellows
    } else if (t === 'lightning-particle') {
      this.x = Math.random() * w
      this.y = 0
      this.opacity = 0
      this.flash = false
      this.flashTimer = 2000 + Math.random() * 5000
      this.flashDuration = 0
      this.speed = 0
    }
  }

  update(w, h, mx, my) {
    const t = this.type
    if (t === 'rain') {
      this.x += this.wind + (mx - w / 2) * 0.0005
      this.y += this.speed
      if (this.y > h + 10) this.reset(w, h)
    } else if (t === 'snow') {
      this.wobble += this.wobbleSpeed
      this.x += Math.sin(this.wobble) * 0.5 + (mx - w / 2) * 0.0003
      this.y += this.speed
      if (this.y > h + 10) this.reset(w, h)
    } else if (t === 'star') {
      this.twinklePhase += this.twinkleSpeed
      this.opacity = 0.2 + Math.sin(this.twinklePhase) * 0.4
    } else if (t === 'firefly') {
      this.angle += this.angleSpeed
      this.x += Math.cos(this.angle) * this.speed
      this.y += Math.sin(this.angle) * this.speed * 0.5
      this.pulsePhase += 0.03
      this.opacity = this.targetOpacity * (0.5 + Math.sin(this.pulsePhase) * 0.5)
      // Wrap around
      if (this.x < -20) this.x = w + 20
      if (this.x > w + 20) this.x = -20
      if (this.y < h * 0.2) this.y = h * 0.8
      if (this.y > h) this.y = h * 0.3
    } else if (t === 'lightning-particle') {
      this.flashTimer -= 16
      if (this.flash) {
        this.flashDuration -= 16
        this.opacity = this.flashDuration > 0 ? Math.random() * 0.3 + 0.1 : 0
        if (this.flashDuration <= 0) {
          this.flash = false
          this.flashTimer = 3000 + Math.random() * 6000
        }
      } else if (this.flashTimer <= 0) {
        this.flash = true
        this.flashDuration = 100 + Math.random() * 200
      }
    }
  }

  draw(ctx) {
    const t = this.type
    if (t === 'rain') {
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x + this.wind * 2, this.y + this.length)
      ctx.strokeStyle = `rgba(174, 210, 255, ${this.opacity})`
      ctx.lineWidth = 1
      ctx.stroke()
    } else if (t === 'snow') {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
      ctx.fill()
    } else if (t === 'star') {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
      ctx.fill()
      // Glow
      if (this.radius > 1) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.1})`
        ctx.fill()
      }
    } else if (t === 'firefly') {
      if (this.opacity < 0.05) return
      // Glow
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 6)
      gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.opacity})`)
      gradient.addColorStop(0.4, `hsla(${this.hue}, 100%, 60%, ${this.opacity * 0.4})`)
      gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`)
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius * 6, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
      // Core
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${this.hue}, 100%, 85%, ${this.opacity})`
      ctx.fill()
    }
  }
}

function getParticleConfig(theme) {
  switch (theme) {
    case 'Rain':
      return [{ type: 'rain', count: 150 }]
    case 'Snow':
      return [{ type: 'snow', count: 80 }]
    case 'Thunderstorm':
      return [
        { type: 'rain', count: 200 },
        { type: 'lightning-particle', count: 3 }
      ]
    case 'Night':
      return [
        { type: 'star', count: 100 },
        { type: 'firefly', count: 15 }
      ]
    case 'Clear':
      return [{ type: 'firefly', count: 8 }]
    case 'Clouds':
      return []
    default:
      return []
  }
}

function initParticles(theme) {
  particles = []
  const configs = getParticleConfig(theme)
  for (const cfg of configs) {
    for (let i = 0; i < cfg.count; i++) {
      particles.push(new Particle(cfg.type, width, height))
    }
  }
}

function animate() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  for (const p of particles) {
    p.update(width, height, props.mouseX, props.mouseY)
    p.draw(ctx)
  }

  animId = requestAnimationFrame(animate)
}

function resize() {
  if (!canvas.value) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
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
  initParticles(props.theme)
  animate()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
})

watch(() => props.theme, (newTheme) => {
  initParticles(newTheme)
})
</script>
