<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>

    <!-- Nuage arrière (plus clair pour la perspective : ciel derrière) -->
    <g :class="{ 'animate-drift': animated }">
      <path
        d="M30 50 Q20 50, 20 42 Q20 34, 30 34 Q30 26, 42 26 Q47 20, 58 20 Q75 20, 75 38 Q82 38, 82 45 Q82 52, 75 52 Z"
        fill="#cbd5e1"
        opacity="0.75"
      />
    </g>

    <!-- Nuage avant (plus sombre, plus proche du sol) -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M20 75 Q8 75, 8 63 Q8 51, 20 51 Q20 39, 38 39 Q44 27, 62 27 Q85 27, 85 51 Q97 51, 97 63 Q97 75, 85 75 Z"
        fill="#94a3b8"
      />
      <ellipse cx="52" cy="68" rx="28" ry="6" fill="#475569" opacity="0.25" />
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
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
@keyframes drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-drift { animation: drift 6s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-float, .animate-drift { animation: none; }
}
</style>
