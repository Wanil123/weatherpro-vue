<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Soleil en arrière-plan -->
    <g :class="{ 'animate-spin-slow': animated }" style="transform-origin: 70px 30px">
      <circle cx="70" cy="30" r="15" class="fill-yellow-400" />
      <line
        v-for="i in 8"
        :key="i"
        x1="70" y1="8" x2="70" y2="14"
        :transform="`rotate(${i * 45} 70 30)`"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        class="text-yellow-400"
      />
    </g>

    <!-- Nuage en avant-plan -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M20 75 Q8 75, 8 63 Q8 51, 20 51 Q20 39, 38 39 Q44 27, 62 27 Q85 27, 85 51 Q97 51, 97 63 Q97 75, 85 75 Z"
        class="fill-white dark:fill-slate-300"
      />
      <ellipse cx="52" cy="65" rx="28" ry="8" class="fill-slate-200/50 dark:fill-slate-400/30" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  animated: { type: Boolean, default: true }
})
</script>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
