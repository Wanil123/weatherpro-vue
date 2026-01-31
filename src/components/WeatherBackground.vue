<template>
  <div class="weather-bg fixed inset-0 overflow-hidden" aria-hidden="true">
    <!-- Base gradient -->
    <div class="absolute inset-0 transition-all duration-1000" :class="bgClass" />

    <!-- Mesh gradient overlay -->
    <div class="mesh-gradient absolute inset-0 opacity-40" />

    <!-- Noise texture -->
    <div class="noise absolute inset-0 opacity-[0.015]" />

    <!-- Floating orbs -->
    <div class="orb orb-1 transition-all duration-1000" :class="orbColor" />
    <div class="orb orb-2 transition-all duration-1000" :class="orbColor2" />

    <!-- Vignette -->
    <div class="absolute inset-0 bg-gradient-to-t from-[#050510]/60 via-transparent to-[#050510]/30" />

    <!-- Weather CSS effects -->
    <div class="effects absolute inset-0 pointer-events-none overflow-hidden">
      <div v-if="theme === 'Clear'" class="sun" />
      <template v-if="theme === 'Clouds'">
        <div class="cloud cloud-1" />
        <div class="cloud cloud-2" />
        <div class="cloud cloud-3" />
      </template>
      <div v-if="theme === 'Rain'" class="rain-effect" />
      <div v-if="theme === 'Snow'" class="snow-effect" />
      <template v-if="theme === 'Thunderstorm'">
        <div class="lightning-effect" />
        <div class="rain-effect rain-heavy" />
      </template>
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
  const map = {
    Clear: 'bg-gradient-to-br from-[#0c1445] via-[#1a0a3e] to-[#0d1117]',
    Clouds: 'bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]',
    Rain: 'bg-gradient-to-br from-[#030712] via-[#0c1a3a] to-[#0d1117]',
    Snow: 'bg-gradient-to-br from-[#0d1525] via-[#121d33] to-[#0a1020]',
    Thunderstorm: 'bg-gradient-to-br from-[#0a0010] via-[#150020] to-[#050510]',
    Night: 'bg-gradient-to-br from-[#050510] via-[#0a0a2e] to-[#030308]'
  }
  return map[props.theme] || map.Clear
})

const orbColor = computed(() => {
  const map = {
    Clear: 'orb-amber', Clouds: 'orb-slate', Rain: 'orb-blue',
    Snow: 'orb-cyan', Thunderstorm: 'orb-purple', Night: 'orb-indigo'
  }
  return map[props.theme] || 'orb-amber'
})

const orbColor2 = computed(() => {
  const map = {
    Clear: 'orb-rose', Clouds: 'orb-blue-dim', Rain: 'orb-indigo',
    Snow: 'orb-blue', Thunderstorm: 'orb-rose', Night: 'orb-purple'
  }
  return map[props.theme] || 'orb-rose'
})
</script>

<style scoped>
.weather-bg { z-index: -50; isolation: isolate; }

.mesh-gradient {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(14, 165, 233, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(244, 114, 182, 0.04) 0%, transparent 50%);
}

.noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 128px 128px;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: float-orb 15s ease-in-out infinite;
}
.orb-1 { width: 500px; height: 500px; top: -150px; right: -100px; }
.orb-2 { width: 400px; height: 400px; bottom: -100px; left: -100px; animation-delay: -7s; animation-direction: reverse; }

.orb-amber { background: rgba(245, 158, 11, 0.12); }
.orb-rose { background: rgba(244, 114, 182, 0.08); }
.orb-blue { background: rgba(59, 130, 246, 0.1); }
.orb-blue-dim { background: rgba(59, 130, 246, 0.05); }
.orb-cyan { background: rgba(6, 182, 212, 0.1); }
.orb-purple { background: rgba(139, 92, 246, 0.12); }
.orb-indigo { background: rgba(99, 102, 241, 0.1); }
.orb-slate { background: rgba(148, 163, 184, 0.06); }

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.sun {
  position: absolute; top: -100px; right: -100px;
  width: 250px; height: 250px; border-radius: 50%;
  background: radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(245,158,11,0.1) 40%, transparent 70%);
  filter: blur(20px);
  animation: pulse-sun 6s ease-in-out infinite;
}
@keyframes pulse-sun {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.15); opacity: 1; }
}

.cloud {
  position: absolute; width: 250px; height: 60px;
  background: rgba(255,255,255,0.03); border-radius: 100px; filter: blur(30px);
  animation: float-cloud linear infinite;
}
.cloud-1 { top: 10%; animation-duration: 45s; }
.cloud-2 { top: 35%; width: 300px; animation-duration: 55s; animation-delay: -20s; }
.cloud-3 { top: 55%; width: 200px; animation-duration: 38s; animation-delay: -30s; }
@keyframes float-cloud {
  from { transform: translateX(-300px); }
  to { transform: translateX(calc(100vw + 300px)); }
}

.rain-effect {
  position: absolute; inset: 0;
  background-image: linear-gradient(transparent 0%, rgba(100,160,255,0.15) 50%, transparent 100%);
  background-size: 1px 25px; background-repeat: repeat;
  animation: rain-fall 0.7s linear infinite; opacity: 0.4;
}
.rain-heavy { animation-duration: 0.4s; opacity: 0.6; }
@keyframes rain-fall { from { background-position: 0 -25px; } to { background-position: 0 25px; } }

.snow-effect {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px);
  background-size: 60px 60px, 90px 90px, 120px 120px;
  animation: snow-fall 10s linear infinite; opacity: 0.5;
}
@keyframes snow-fall {
  from { background-position: 0 0, 25px 25px, 50px 10px; }
  to { background-position: 60px 120px, 85px 145px, 110px 130px; }
}

.lightning-effect { position: absolute; inset: 0; animation: lightning 6s ease-in-out infinite; }
@keyframes lightning {
  0%, 89%, 91%, 93%, 95%, 100% { background: transparent; }
  90% { background: rgba(167,139,250,0.15); }
  92% { background: rgba(167,139,250,0.08); }
  94% { background: rgba(167,139,250,0.12); }
}

.stars-effect {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px);
  background-size: 120px 120px, 170px 170px, 230px 230px;
  animation: twinkle 5s ease-in-out infinite alternate;
}
@keyframes twinkle { from { opacity: 0.3; } to { opacity: 0.7; } }

.moon {
  position: absolute; top: 50px; right: 80px; width: 70px; height: 70px; border-radius: 50%;
  background: linear-gradient(135deg, #e8e8e8, #b8b8b8);
  box-shadow: inset -8px -8px 16px rgba(0,0,0,0.15), 0 0 50px rgba(255,255,255,0.1), 0 0 100px rgba(167,139,250,0.05);
}
</style>
