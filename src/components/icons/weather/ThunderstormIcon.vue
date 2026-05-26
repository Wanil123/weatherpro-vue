<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>

    <!-- Nuage sombre -->
    <g :class="{ 'animate-shake': animated }">
      <path
        d="M18 50 Q8 50, 8 40 Q8 30, 18 30 Q18 20, 33 20 Q38 12, 53 12 Q73 12, 73 32 Q83 32, 83 42 Q83 52, 73 52 Z"
        fill="#475569"
      />
    </g>

    <!-- Éclair (forme franche en Z, vrai look "lightning bolt") -->
    <g :class="{ 'animate-lightning': animated }">
      <!-- Halo doux (filtre SVG natif, GPU friendly) -->
      <polygon
        points="48,52 38,72 50,72 42,90 64,66 50,66 60,52"
        fill="#fde047"
        filter="url(#bolt-glow)"
        opacity="0.5"
      />
      <polygon
        points="48,52 38,72 50,72 42,90 64,66 50,66 60,52"
        fill="#facc15"
      />
    </g>

    <!-- Gouttes -->
    <g :class="{ 'animate-rain': animated }">
      <line x1="25" y1="55" x2="22" y2="65" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" />
      <line x1="75" y1="55" x2="72" y2="68" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" />
    </g>

    <defs>
      <filter id="bolt-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
  </svg>
</template>

<script setup>
defineProps({
  animated: { type: Boolean, default: true },
  title: { type: String, default: '' }
})
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-0.5px); }
}

/* Lightning : 1 flash net puis longue pause (WCAG 2.3 : <3 flashs/sec) */
@keyframes lightning {
  0%, 88%, 100% { opacity: 1; }
  90% { opacity: 0.25; }
  92% { opacity: 1; }
}

@keyframes rain {
  0%   { transform: translateY(-3px); opacity: 0; }
  20%  { opacity: 1; }
  100% { transform: translateY(12px); opacity: 0; }
}

.animate-shake     { animation: shake 0.8s ease-in-out infinite; }
.animate-lightning { animation: lightning 4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
.animate-rain      { animation: rain 1s linear infinite; transform-origin: center; transform-box: fill-box; }

@media (prefers-reduced-motion: reduce) {
  .animate-shake,
  .animate-lightning,
  .animate-rain { animation: none; }
}
</style>
