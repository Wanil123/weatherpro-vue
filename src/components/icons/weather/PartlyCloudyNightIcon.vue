<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>

    <defs>
      <mask id="pcn-moon-mask">
        <rect width="100" height="100" fill="black" />
        <circle cx="68" cy="32" r="16" fill="white" />
        <circle cx="76" cy="26" r="13" fill="black" />
      </mask>
      <radialGradient id="pcn-moon-grad" cx="40%" cy="40%" r="80%">
        <stop offset="0%" stop-color="#fafafa" />
        <stop offset="100%" stop-color="#94a3b8" />
      </radialGradient>
    </defs>

    <!-- Lune croissant -->
    <g :class="{ 'animate-glow': animated }">
      <rect width="100" height="100" fill="url(#pcn-moon-grad)" mask="url(#pcn-moon-mask)" />
    </g>

    <!-- Étoiles -->
    <g :class="{ 'animate-twinkle': animated }">
      <circle cx="32" cy="20" r="1.4" fill="#fcd34d" />
      <circle cx="48" cy="28" r="1.0" fill="#fcd34d" />
    </g>

    <!-- Nuage avant-plan -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M20 75 Q8 75, 8 63 Q8 51, 20 51 Q20 39, 38 39 Q44 27, 62 27 Q85 27, 85 51 Q97 51, 97 63 Q97 75, 85 75 Z"
        fill="#94a3b8"
      />
      <ellipse cx="52" cy="68" rx="28" ry="6" fill="#334155" opacity="0.3" />
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
@keyframes glow {
  0%, 100% { opacity: 0.9; }
  50%       { opacity: 1; }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.9; }
  50%       { opacity: 0.3; }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-2px); }
}
.animate-glow    { animation: glow 4s ease-in-out infinite; }
.animate-twinkle { animation: twinkle 2.4s ease-in-out infinite; }
.animate-float   { animation: float 3s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-glow, .animate-twinkle, .animate-float { animation: none; }
}
</style>
