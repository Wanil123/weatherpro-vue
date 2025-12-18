<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Nuage principal -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M25 65 Q15 65, 15 55 Q15 45, 25 45 Q25 35, 40 35 Q45 25, 60 25 Q80 25, 80 45 Q90 45, 90 55 Q90 65, 80 65 Z"
        class="fill-slate-300 dark:fill-slate-400"
      />
      <!-- Ombres -->
      <ellipse cx="50" cy="55" rx="25" ry="8" class="fill-slate-400/30 dark:fill-slate-500/30" />
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
  50% { transform: translateY(-3px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>
