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

    <!-- Bruine : gouttes courtes -->
    <g :class="{ 'animate-drizzle': animated }">
      <line x1="28" y1="62" x2="26" y2="70" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" />
      <line x1="42" y1="64" x2="40" y2="72" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" />
      <line x1="56" y1="62" x2="54" y2="70" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" />
      <line x1="70" y1="64" x2="68" y2="72" stroke="#7dd3fc" stroke-width="2" stroke-linecap="round" />
    </g>

    <g :class="{ 'animate-drizzle-delay': animated }">
      <line x1="35" y1="76" x2="33" y2="84" stroke="#bae6fd" stroke-width="1.5" stroke-linecap="round" />
      <line x1="49" y1="78" x2="47" y2="86" stroke="#bae6fd" stroke-width="1.5" stroke-linecap="round" />
      <line x1="63" y1="76" x2="61" y2="84" stroke="#bae6fd" stroke-width="1.5" stroke-linecap="round" />
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
@keyframes drizzle {
  0% { transform: translateY(-3px); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-drizzle { animation: drizzle 1.5s ease-in-out infinite; }
.animate-drizzle-delay { animation: drizzle 1.5s ease-in-out infinite 0.7s; }

@media (prefers-reduced-motion: reduce) {
  .animate-float, .animate-drizzle, .animate-drizzle-delay { animation: none; }
}
</style>
