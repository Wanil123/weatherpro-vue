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
let resizeTimer = null
let lastTime = 0
let fireflySprite = null // sprite pré-rendu (gradient firefly mis en cache)
let snowflakeSprite = null
let reduceMotion = false
let motionMQL = null
function onMotionChange(e) {
  reduceMotion = e.matches
  if (reduceMotion && animId) {
    cancelAnimationFrame(animId)
    animId = null
  } else if (!reduceMotion && animId == null) {
    lastTime = 0
    animId = requestAnimationFrame(animate)
  }
}

// Adaptatif : moins de particules sur mobile / appareils faibles
function getQuality() {
  if (typeof navigator === 'undefined') return 1
  const cores = navigator.hardwareConcurrency || 4
  if (reduceMotion) return 0.25
  if (cores <= 2) return 0.5
  if (cores <= 4) return 0.75
  return 1
}

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
      this.z = 0.5 + Math.random() * 0.5
    } else if (t === 'snow') {
      this.x = Math.random() * w
      this.y = initial ? Math.random() * h : -10
      this.speed = 0.5 + Math.random() * 1.5
      this.radius = 1 + Math.random() * 3
      this.opacity = 0.3 + Math.random() * 0.5
      this.wobble = Math.random() * Math.PI * 2
      this.wobbleSpeed = 0.01 + Math.random() * 0.03
      this.z = 0.5 + Math.random() * 0.5
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
      this.hue = 40 + Math.random() * 30
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

  update(w, h, mx, my, dt) {
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
      if (this.x < -20) this.x = w + 20
      if (this.x > w + 20) this.x = -20
      if (this.y < h * 0.2) this.y = h * 0.8
      if (this.y > h) this.y = h * 0.3
    } else if (t === 'lightning-particle') {
      this.flashTimer -= dt
      if (this.flash) {
        this.flashDuration -= dt
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

  draw(c) {
    const t = this.type
    if (t === 'rain') {
      c.beginPath()
      c.moveTo(this.x, this.y)
      c.lineTo(this.x + this.wind * 2, this.y + this.length)
      c.strokeStyle = `rgba(174, 210, 255, ${this.opacity})`
      c.lineWidth = 1
      c.stroke()
    } else if (t === 'snow') {
      // Utilise sprite pré-rendu (plus rapide qu'un arc + fill)
      if (snowflakeSprite) {
        const size = this.radius * 4
        c.globalAlpha = this.opacity
        c.drawImage(snowflakeSprite, this.x - size / 2, this.y - size / 2, size, size)
        c.globalAlpha = 1
      } else {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        c.fill()
      }
    } else if (t === 'star') {
      c.beginPath()
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
      c.fill()
      if (this.radius > 1) {
        c.beginPath()
        c.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2)
        c.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.1})`
        c.fill()
      }
    } else if (t === 'firefly') {
      if (this.opacity < 0.05) return
      // Utilise le sprite pré-rendu plutôt que de re-créer un radial gradient à chaque frame
      if (fireflySprite) {
        const size = this.radius * 12
        c.globalAlpha = this.opacity
        c.drawImage(fireflySprite, this.x - size / 2, this.y - size / 2, size, size)
        c.globalAlpha = 1
      }
      // Core
      c.beginPath()
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      c.fillStyle = `hsla(${this.hue}, 100%, 85%, ${this.opacity})`
      c.fill()
    } else if (t === 'lightning-particle') {
      // Flash écran (subtle) — couvre tout le canvas en blanc/violet
      if (this.opacity > 0) {
        c.fillStyle = `rgba(220, 200, 255, ${this.opacity * 0.2})`
        c.fillRect(0, 0, width, height)
      }
    }
  }
}

// --- Sprites pré-rendus (créés une fois après resize) ---
function buildFireflySprite() {
  const size = 64
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const cx = c.getContext('2d')
  const grad = cx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'hsla(55, 100%, 70%, 1)')
  grad.addColorStop(0.4, 'hsla(50, 100%, 60%, 0.4)')
  grad.addColorStop(1, 'hsla(45, 100%, 50%, 0)')
  cx.fillStyle = grad
  cx.fillRect(0, 0, size, size)
  fireflySprite = c
}

function buildSnowflakeSprite() {
  const size = 24
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const cx = c.getContext('2d')
  const grad = cx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)')
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
  cx.fillStyle = grad
  cx.fillRect(0, 0, size, size)
  snowflakeSprite = c
}

function getParticleConfig(theme) {
  const q = getQuality()
  const cap = (n) => Math.max(1, Math.round(n * q))
  switch (theme) {
    case 'Rain':         return [{ type: 'rain', count: cap(150) }]
    case 'Snow':         return [{ type: 'snow', count: cap(80) }]
    case 'Thunderstorm': return [
      { type: 'rain', count: cap(200) },
      { type: 'lightning-particle', count: 2 }
    ]
    case 'Night':        return [
      { type: 'star', count: cap(100) },
      { type: 'firefly', count: cap(15) }
    ]
    case 'Clear':        return [{ type: 'firefly', count: cap(8) }]
    case 'Clouds':
    case 'Fog':
    default:             return []
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

function animate(now) {
  if (!ctx) return
  const dt = lastTime ? (now - lastTime) : 16
  lastTime = now
  ctx.clearRect(0, 0, width, height)

  for (const p of particles) {
    p.update(width, height, props.mouseX, props.mouseY, dt)
    p.draw(ctx)
  }

  animId = requestAnimationFrame(animate)
}

function resize() {
  if (!canvas.value || !ctx) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.value.width = width * dpr
  canvas.value.height = height * dpr
  canvas.value.style.width = width + 'px'
  canvas.value.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  // Reset positions hors-écran (stars/fireflies n'ont pas de gravité naturelle)
  for (const p of particles) {
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.reset(width, height, true)
    }
  }
}

function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(resize, 120)
}

function onVisibilityChange() {
  if (document.hidden) {
    if (animId) {
      cancelAnimationFrame(animId)
      animId = null
    }
  } else if (animId == null && !reduceMotion) {
    lastTime = 0
    animId = requestAnimationFrame(animate)
  }
}

onMounted(() => {
  ctx = canvas.value?.getContext('2d')
  if (!ctx) return

  if (typeof window !== 'undefined' && window.matchMedia) {
    motionMQL = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotion = motionMQL.matches
    if (motionMQL.addEventListener) motionMQL.addEventListener('change', onMotionChange)
    else if (motionMQL.addListener) motionMQL.addListener(onMotionChange)
  }

  resize()
  buildFireflySprite()
  buildSnowflakeSprite()
  initParticles(props.theme)
  if (!reduceMotion) animId = requestAnimationFrame(animate)
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (motionMQL) {
    if (motionMQL.removeEventListener) motionMQL.removeEventListener('change', onMotionChange)
    else if (motionMQL.removeListener) motionMQL.removeListener(onMotionChange)
  }
  particles = []
  fireflySprite = null
  snowflakeSprite = null
  ctx = null
})

watch(() => props.theme, (newTheme) => {
  initParticles(newTheme)
})
</script>
