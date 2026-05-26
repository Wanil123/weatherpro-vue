<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>

    <defs>
      <radialGradient id="sun-grad" cx="40%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#fef3c7" />
        <stop offset="55%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#f59e0b" />
      </radialGradient>
      <filter id="sun-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>

    <!-- Rayons (8) -->
    <g :class="{ 'animate-spin-slow': animated }" style="transform-origin: 50px 50px; transform-box: fill-box;">
      <line
        v-for="i in 8"
        :key="i"
        x1="50" y1="6" x2="50" y2="18"
        :transform="`rotate(${i * 45} 50 50)`"
        stroke="#facc15"
        stroke-width="3"
        stroke-linecap="round"
      />
    </g>

    <!-- Halo doux -->
    <circle cx="50" cy="50" r="26" fill="#fbbf24" opacity="0.25" filter="url(#sun-glow)" />

    <!-- Disque soleil avec gradient premium -->
    <circle cx="50" cy="50" r="22" fill="url(#sun-grad)" />

    <!-- Reflet spéculaire -->
    <ellipse cx="42" cy="42" rx="7" ry="5" fill="#fff7ed" opacity="0.55" />
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
  to   { transform: rotate(360deg); }
}

.animate-spin-slow { animation: spin-slow 30s linear infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-spin-slow { animation: none; }
}
</style>
