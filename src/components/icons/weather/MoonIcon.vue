<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>

    <defs>
      <!-- Lune via masque cercle - cercle décalé : croissant propre -->
      <mask id="moon-mask">
        <rect width="100" height="100" fill="black" />
        <circle cx="50" cy="50" r="32" fill="white" />
        <circle cx="62" cy="42" r="28" fill="black" />
      </mask>
      <radialGradient id="moon-grad" cx="35%" cy="35%" r="80%">
        <stop offset="0%" stop-color="#fafafa" />
        <stop offset="60%" stop-color="#e2e8f0" />
        <stop offset="100%" stop-color="#94a3b8" />
      </radialGradient>
      <filter id="moon-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>

    <!-- Halo doux -->
    <circle cx="50" cy="50" r="34" fill="#cbd5e1" opacity="0.18" filter="url(#moon-glow)" />

    <!-- Croissant -->
    <rect width="100" height="100" fill="url(#moon-grad)" mask="url(#moon-mask)" />

    <!-- Étoiles -->
    <g :class="{ 'animate-twinkle': animated }">
      <circle cx="18" cy="22" r="1.4" fill="#fcd34d" />
      <circle cx="82" cy="28" r="1.0" fill="#fcd34d" />
      <circle cx="78" cy="78" r="1.4" fill="#fcd34d" />
      <circle cx="22" cy="80" r="1.0" fill="#fcd34d" />
    </g>
    <g :class="{ 'animate-twinkle-2': animated }">
      <circle cx="12" cy="55" r="0.8" fill="#fef3c7" />
      <circle cx="90" cy="58" r="0.8" fill="#fef3c7" />
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
@keyframes twinkle {
  0%, 100% { opacity: 0.9; }
  50%       { opacity: 0.25; }
}
@keyframes twinkle-2 {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.9; }
}

.animate-twinkle   { animation: twinkle 2.4s ease-in-out infinite; }
.animate-twinkle-2 { animation: twinkle-2 3.1s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-twinkle,
  .animate-twinkle-2 { animation: none; }
}
</style>
