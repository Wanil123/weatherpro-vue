<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>

    <!-- Nuage -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M22 52 Q12 52, 12 42 Q12 32, 22 32 Q22 22, 36 22 Q42 14, 56 14 Q74 14, 74 34 Q84 34, 84 44 Q84 54, 74 54 Z"
        fill="#cbd5e1"
      />
    </g>

    <!-- Flocons SVG vectoriels (6 branches) -->
    <g :class="{ 'animate-snow-1': animated }">
      <g transform="translate(28, 70)">
        <use href="#snowflake-a" />
      </g>
    </g>
    <g :class="{ 'animate-snow-2': animated }">
      <g transform="translate(50, 78)">
        <use href="#snowflake-b" />
      </g>
    </g>
    <g :class="{ 'animate-snow-3': animated }">
      <g transform="translate(72, 70)">
        <use href="#snowflake-a" />
      </g>
    </g>

    <!-- Defs : flocon réutilisable -->
    <defs>
      <g id="snowflake-a">
        <g stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" fill="none">
          <line x1="0" y1="-6" x2="0" y2="6" />
          <line x1="-5.2" y1="-3" x2="5.2" y2="3" />
          <line x1="-5.2" y1="3" x2="5.2" y2="-3" />
          <!-- petites barbules -->
          <line x1="0" y1="-6" x2="-1.5" y2="-4.5" />
          <line x1="0" y1="-6" x2="1.5" y2="-4.5" />
          <line x1="0" y1="6" x2="-1.5" y2="4.5" />
          <line x1="0" y1="6" x2="1.5" y2="4.5" />
        </g>
      </g>
      <g id="snowflake-b">
        <g stroke="#e0e7ff" stroke-width="1" stroke-linecap="round" fill="none">
          <line x1="0" y1="-4" x2="0" y2="4" />
          <line x1="-3.5" y1="-2" x2="3.5" y2="2" />
          <line x1="-3.5" y1="2" x2="3.5" y2="-2" />
        </g>
      </g>
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
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes snowfall {
  0%   { transform: translateY(-4px) rotate(0deg); opacity: 0; }
  20%  { opacity: 1; }
  100% { transform: translateY(18px) rotate(180deg); opacity: 0; }
}

.animate-float    { animation: float 3s ease-in-out infinite; }
.animate-snow-1   { animation: snowfall 2.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
.animate-snow-2   { animation: snowfall 2.6s ease-in-out infinite 0.8s; transform-origin: center; transform-box: fill-box; }
.animate-snow-3   { animation: snowfall 2.6s ease-in-out infinite 1.5s; transform-origin: center; transform-box: fill-box; }

@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-snow-1,
  .animate-snow-2,
  .animate-snow-3 { animation: none; }
}
</style>
