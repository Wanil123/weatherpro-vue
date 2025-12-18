<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Nuage arrière -->
    <g :class="{ 'animate-float-slow': animated }">
      <path
        d="M30 50 Q20 50, 20 42 Q20 34, 30 34 Q30 26, 42 26 Q47 20, 58 20 Q75 20, 75 38 Q82 38, 82 45 Q82 52, 75 52 Z"
        class="fill-slate-400 dark:fill-slate-500"
      />
    </g>

    <!-- Nuage avant -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M20 75 Q8 75, 8 63 Q8 51, 20 51 Q20 39, 38 39 Q44 27, 62 27 Q85 27, 85 51 Q97 51, 97 63 Q97 75, 85 75 Z"
        class="fill-slate-300 dark:fill-slate-400"
      />
      <ellipse cx="52" cy="65" rx="28" ry="8" class="fill-slate-400/30 dark:fill-slate-500/30" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  animated: { type: Boolean, default: true }
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 5s ease-in-out infinite;
}
</style>
