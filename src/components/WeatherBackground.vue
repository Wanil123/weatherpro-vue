<template>
  <div
    class="weather-bg fixed inset-0 overflow-hidden transition-all duration-700"
    :class="bgClass"
    aria-hidden="true"
  >
    <!-- Overlay gradient -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

    <!-- Effets selon le thème - SIMPLIFIÉS pour performance -->
    <div class="effects-container absolute inset-0 pointer-events-none overflow-hidden">

      <!-- Soleil (jour clair) -->
      <div v-if="theme === 'Clear'" class="sun" />

      <!-- Nuages -->
      <template v-if="theme === 'Clouds'">
        <div class="cloud cloud-1" />
        <div class="cloud cloud-2" />
        <div class="cloud cloud-3" />
      </template>

      <!-- Pluie - CSS only -->
      <div v-if="theme === 'Rain'" class="rain-effect" />

      <!-- Neige - CSS only -->
      <div v-if="theme === 'Snow'" class="snow-effect" />

      <!-- Orage -->
      <template v-if="theme === 'Thunderstorm'">
        <div class="lightning-effect" />
        <div class="rain-effect rain-heavy" />
      </template>

      <!-- Nuit -->
      <template v-if="theme === 'Night'">
        <div class="stars-effect" />
        <div class="moon" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'Clear' }
})

const bgClass = computed(() => {
  const gradients = {
    Clear: 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500',
    Clouds: 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600',
    Rain: 'bg-gradient-to-br from-slate-600 via-blue-700 to-slate-800',
    Snow: 'bg-gradient-to-br from-slate-300 via-blue-200 to-slate-400',
    Thunderstorm: 'bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900',
    Night: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-black'
  }
  return gradients[props.theme] || gradients.Clear
})
</script>

<style scoped>
/* ===== CONTENEUR PRINCIPAL ===== */
.weather-bg {
  z-index: -50;
  isolation: isolate;
}

.effects-container {
  z-index: -40;
}

/* ===== SOLEIL ===== */
.sun {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,220,100,0.8) 0%, rgba(255,180,50,0.4) 50%, transparent 70%);
  filter: blur(10px);
  animation: pulse-sun 4s ease-in-out infinite;
}

@keyframes pulse-sun {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

/* ===== NUAGES ===== */
.cloud {
  position: absolute;
  width: 200px;
  height: 60px;
  background: rgba(255,255,255,0.15);
  border-radius: 100px;
  filter: blur(20px);
  animation: float-cloud linear infinite;
}

.cloud-1 {
  top: 10%;
  animation-duration: 40s;
}

.cloud-2 {
  top: 30%;
  width: 250px;
  animation-duration: 50s;
  animation-delay: -15s;
}

.cloud-3 {
  top: 50%;
  width: 180px;
  animation-duration: 35s;
  animation-delay: -25s;
}

@keyframes float-cloud {
  from { transform: translateX(-250px); }
  to { transform: translateX(calc(100vw + 250px)); }
}

/* ===== PLUIE (CSS Pure) ===== */
.rain-effect {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(transparent 0%, rgba(150,200,255,0.3) 50%, transparent 100%);
  background-size: 2px 20px;
  background-repeat: repeat;
  animation: rain-fall 0.8s linear infinite;
  opacity: 0.5;
}

.rain-heavy {
  animation-duration: 0.5s;
  opacity: 0.7;
}

@keyframes rain-fall {
  from { background-position: 0 -20px; }
  to { background-position: 0 20px; }
}

/* ===== NEIGE (CSS Pure) ===== */
.snow-effect {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, white 1px, transparent 1px),
    radial-gradient(circle, white 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px);
  background-size: 50px 50px, 80px 80px, 100px 100px;
  background-position: 0 0, 25px 25px, 50px 10px;
  animation: snow-fall 8s linear infinite;
  opacity: 0.6;
}

@keyframes snow-fall {
  from { background-position: 0 0, 25px 25px, 50px 10px; }
  to { background-position: 50px 100px, 75px 125px, 100px 110px; }
}

/* ===== ÉCLAIR ===== */
.lightning-effect {
  position: absolute;
  inset: 0;
  background: transparent;
  animation: lightning 5s ease-in-out infinite;
}

@keyframes lightning {
  0%, 89%, 91%, 93%, 95%, 100% { background: transparent; }
  90% { background: rgba(255,255,255,0.6); }
  92% { background: rgba(255,255,255,0.3); }
  94% { background: rgba(255,255,255,0.5); }
}

/* ===== ÉTOILES (CSS Pure) ===== */
.stars-effect {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, white 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px);
  background-size: 100px 100px, 150px 150px, 200px 200px;
  background-position: 0 0, 50px 50px, 25px 75px;
  animation: twinkle-stars 4s ease-in-out infinite alternate;
}

@keyframes twinkle-stars {
  from { opacity: 0.4; }
  to { opacity: 0.8; }
}

/* ===== LUNE ===== */
.moon {
  position: absolute;
  top: 40px;
  right: 60px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8f8f8 0%, #ddd 100%);
  box-shadow:
    inset -10px -10px 20px rgba(0,0,0,0.1),
    0 0 40px rgba(255,255,255,0.3);
}
</style>
