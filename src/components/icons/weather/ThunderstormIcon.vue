<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Nuage sombre -->
    <g :class="{ 'animate-shake': animated }">
      <path
        d="M18 50 Q8 50, 8 40 Q8 30, 18 30 Q18 20, 33 20 Q38 12, 53 12 Q73 12, 73 32 Q83 32, 83 42 Q83 52, 73 52 Z"
        class="fill-slate-600 dark:fill-slate-700"
      />
    </g>

    <!-- Éclair -->
    <g :class="{ 'animate-lightning': animated }">
      <polygon
        points="50,55 42,72 48,72 40,90 60,68 52,68 58,55"
        class="fill-yellow-400"
      />
      <!-- Glow effect -->
      <polygon
        points="50,55 42,72 48,72 40,90 60,68 52,68 58,55"
        class="fill-yellow-300 blur-sm"
        style="filter: blur(2px)"
      />
    </g>

    <!-- Gouttes -->
    <g :class="{ 'animate-rain': animated }">
      <line x1="25" y1="55" x2="22" y2="65" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-blue-400" />
      <line x1="75" y1="55" x2="72" y2="68" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-blue-400" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  animated: { type: Boolean, default: true }
})
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px); }
  75% { transform: translateX(1px); }
}

@keyframes lightning {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
  52% { opacity: 1; }
  54% { opacity: 0.5; }
  56% { opacity: 1; }
}

@keyframes rain {
  0% { transform: translateY(-3px); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(12px); opacity: 0; }
}

.animate-shake {
  animation: shake 0.5s ease-in-out infinite;
}

.animate-lightning {
  animation: lightning 2s ease-in-out infinite;
}

.animate-rain {
  animation: rain 0.8s linear infinite;
}
</style>
