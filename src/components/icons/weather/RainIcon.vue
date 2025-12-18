<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Nuage -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M20 55 Q10 55, 10 45 Q10 35, 20 35 Q20 25, 35 25 Q40 17, 55 17 Q75 17, 75 37 Q85 37, 85 47 Q85 57, 75 57 Z"
        class="fill-slate-400 dark:fill-slate-500"
      />
    </g>

    <!-- Gouttes de pluie -->
    <g :class="{ 'animate-rain': animated }">
      <line x1="30" y1="62" x2="25" y2="78" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="text-blue-400" />
      <line x1="45" y1="65" x2="40" y2="85" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="text-blue-400" />
      <line x1="60" y1="62" x2="55" y2="80" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="text-blue-400" />
      <line x1="75" y1="60" x2="70" y2="75" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="text-blue-400" />
    </g>

    <!-- Deuxième série de gouttes (décalée) -->
    <g :class="{ 'animate-rain-delay': animated }">
      <line x1="37" y1="60" x2="32" y2="75" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-blue-300" />
      <line x1="52" y1="63" x2="47" y2="82" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-blue-300" />
      <line x1="67" y1="58" x2="62" y2="72" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-blue-300" />
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

@keyframes rain {
  0% { transform: translateY(-5px); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(15px); opacity: 0; }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-rain {
  animation: rain 1s linear infinite;
}

.animate-rain-delay {
  animation: rain 1s linear infinite 0.5s;
}
</style>
