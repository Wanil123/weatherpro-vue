<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>

    <defs>
      <radialGradient id="pc-sun-grad" cx="40%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#fef3c7" />
        <stop offset="55%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#f59e0b" />
      </radialGradient>
    </defs>

    <!-- Soleil en arrière-plan -->
    <g :class="{ 'animate-spin-slow': animated }" style="transform-origin: 70px 30px; transform-box: fill-box;">
      <line
        v-for="i in 8"
        :key="i"
        x1="70" y1="8" x2="70" y2="14"
        :transform="`rotate(${i * 45} 70 30)`"
        stroke="#facc15"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <circle cx="70" cy="30" r="13" fill="url(#pc-sun-grad)" />
    </g>

    <!-- Nuage en avant-plan -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M20 75 Q8 75, 8 63 Q8 51, 20 51 Q20 39, 38 39 Q44 27, 62 27 Q85 27, 85 51 Q97 51, 97 63 Q97 75, 85 75 Z"
        fill="#e2e8f0"
      />
      <ellipse cx="52" cy="68" rx="28" ry="6" fill="#94a3b8" opacity="0.25" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  animated: { type: Boolean, default: true },
  title: { type: String, default: '' }
})
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
.animate-spin-slow { animation: spin-slow 30s linear infinite; }
.animate-float { animation: float 3s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-spin-slow, .animate-float { animation: none; }
}
</style>
