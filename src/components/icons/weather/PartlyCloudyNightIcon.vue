<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Lune en arrière-plan -->
    <g :class="{ 'animate-glow': animated }">
      <path
        d="M70 15 C60 15, 55 25, 55 35 C55 45, 65 55, 75 55 C80 55, 85 52, 88 48 C85 55, 78 60, 70 60 C58 60, 48 50, 48 38 C48 26, 58 16, 70 15"
        class="fill-slate-200"
      />
    </g>

    <!-- Étoiles -->
    <g :class="{ 'animate-twinkle': animated }">
      <circle cx="30" cy="20" r="1.5" class="fill-yellow-200" />
      <circle cx="45" cy="30" r="1" class="fill-yellow-200" />
    </g>

    <!-- Nuage en avant-plan -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M20 75 Q8 75, 8 63 Q8 51, 20 51 Q20 39, 38 39 Q44 27, 62 27 Q85 27, 85 51 Q97 51, 97 63 Q97 75, 85 75 Z"
        class="fill-slate-400 dark:fill-slate-500"
      />
      <ellipse cx="52" cy="65" rx="28" ry="8" class="fill-slate-500/30 dark:fill-slate-600/30" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  animated: { type: Boolean, default: true }
})
</script>

<style scoped>
@keyframes glow {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
  50% { filter: drop-shadow(0 0 10px rgba(255,255,255,0.4)); }
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-glow {
  animation: glow 4s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
