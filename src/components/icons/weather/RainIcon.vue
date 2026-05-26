<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>

    <!-- Nuage -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M22 55 Q12 55, 12 45 Q12 35, 22 35 Q22 25, 36 25 Q42 17, 56 17 Q74 17, 74 37 Q84 37, 84 47 Q84 57, 74 57 Z"
        fill="#94a3b8"
      />
    </g>

    <!-- Gouttes -->
    <g :class="{ 'animate-rain': animated }">
      <line x1="30" y1="62" x2="25" y2="78" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" />
      <line x1="45" y1="65" x2="40" y2="85" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" />
      <line x1="60" y1="62" x2="55" y2="80" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" />
      <line x1="75" y1="60" x2="70" y2="75" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" />
    </g>

    <g :class="{ 'animate-rain-delay': animated }">
      <line x1="37" y1="60" x2="32" y2="75" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" />
      <line x1="52" y1="63" x2="47" y2="82" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" />
      <line x1="67" y1="58" x2="62" y2="72" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" />
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
@keyframes rain {
  0% { transform: translateY(-5px); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(15px); opacity: 0; }
}
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-rain { animation: rain 1.1s linear infinite; }
.animate-rain-delay { animation: rain 1.1s linear infinite 0.55s; }

@media (prefers-reduced-motion: reduce) {
  .animate-float, .animate-rain, .animate-rain-delay { animation: none; }
}
</style>
