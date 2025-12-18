<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Rayons -->
    <g :class="{ 'animate-spin-slow': animated }" style="transform-origin: center">
      <line
        v-for="i in 8"
        :key="i"
        x1="50" y1="10" x2="50" y2="20"
        :transform="`rotate(${i * 45} 50 50)`"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        class="text-yellow-400"
      />
    </g>
    <!-- Cercle principal -->
    <circle
      cx="50" cy="50" r="22"
      class="fill-yellow-400"
      :class="{ 'animate-pulse-subtle': animated }"
    />
    <!-- Reflet -->
    <ellipse
      cx="44" cy="44" rx="8" ry="6"
      class="fill-yellow-200/60"
    />
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

@keyframes pulse-subtle {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}
</style>
