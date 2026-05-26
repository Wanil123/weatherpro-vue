<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>
    <g :class="{ 'animate-float': animated }">
      <path
        d="M25 65 Q15 65, 15 55 Q15 45, 25 45 Q25 35, 40 35 Q45 25, 60 25 Q80 25, 80 45 Q90 45, 90 55 Q90 65, 80 65 Z"
        fill="#cbd5e1"
      />
      <ellipse cx="50" cy="60" rx="22" ry="5" fill="#94a3b8" opacity="0.35" />
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
  50% { transform: translateY(-3px); }
}
.animate-float { animation: float 3s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-float { animation: none; }
}
</style>
