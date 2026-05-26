<template>
  <svg viewBox="0 0 100 100" class="w-full h-full" :role="title ? 'img' : 'presentation'" :aria-hidden="title ? null : 'true'" focusable="false">
    <title v-if="title">{{ title }}</title>

    <!-- Nuage flou en arrière-plan pour cohérence avec les autres icônes -->
    <path
      d="M20 38 Q12 38, 12 30 Q12 22, 22 22 Q26 14, 40 14 Q56 14, 60 26 Q72 26, 72 36 Q72 44, 60 44 Z"
      fill="#cbd5e1"
      opacity="0.5"
    />

    <!-- Bandes de brouillard en quinconce -->
    <g :class="{ 'animate-fog-1': animated }">
      <rect x="15" y="50" width="70" height="5" rx="2.5" fill="#e2e8f0" />
    </g>
    <g :class="{ 'animate-fog-2': animated }">
      <rect x="20" y="62" width="60" height="5" rx="2.5" fill="#cbd5e1" />
    </g>
    <g :class="{ 'animate-fog-3': animated }">
      <rect x="10" y="74" width="75" height="5" rx="2.5" fill="#e2e8f0" opacity="0.85" />
    </g>
    <g :class="{ 'animate-fog-2': animated }">
      <rect x="25" y="86" width="55" height="4" rx="2" fill="#cbd5e1" opacity="0.7" />
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
@keyframes fog-a {
  0%, 100% { transform: translateX(-3px); opacity: 0.7; }
  50% { transform: translateX(3px); opacity: 1; }
}
@keyframes fog-b {
  0%, 100% { transform: translateX(3px); opacity: 0.9; }
  50% { transform: translateX(-3px); opacity: 0.6; }
}
@keyframes fog-c {
  0%, 100% { transform: translateX(-2px); opacity: 0.85; }
  50% { transform: translateX(2px); opacity: 0.4; }
}

.animate-fog-1 { animation: fog-a 5s ease-in-out infinite; }
.animate-fog-2 { animation: fog-b 5s ease-in-out infinite 1.5s; }
.animate-fog-3 { animation: fog-c 5s ease-in-out infinite 0.7s; }

@media (prefers-reduced-motion: reduce) {
  .animate-fog-1, .animate-fog-2, .animate-fog-3 { animation: none; }
}
</style>
