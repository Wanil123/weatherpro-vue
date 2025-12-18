<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Nuage -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M20 50 Q10 50, 10 40 Q10 30, 20 30 Q20 20, 35 20 Q40 12, 55 12 Q75 12, 75 32 Q85 32, 85 42 Q85 52, 75 52 Z"
        class="fill-slate-300 dark:fill-slate-400"
      />
    </g>

    <!-- Flocons de neige -->
    <g :class="{ 'animate-snow': animated }">
      <text x="25" y="70" font-size="12" class="fill-white">❄</text>
      <text x="45" y="78" font-size="10" class="fill-blue-100">❄</text>
      <text x="65" y="68" font-size="12" class="fill-white">❄</text>
    </g>

    <g :class="{ 'animate-snow-delay': animated }">
      <text x="35" y="85" font-size="8" class="fill-blue-100">❄</text>
      <text x="55" y="90" font-size="10" class="fill-white">❄</text>
      <text x="75" y="82" font-size="8" class="fill-blue-100">❄</text>
    </g>

    <g :class="{ 'animate-snow-delay-2': animated }">
      <text x="30" y="95" font-size="6" class="fill-blue-50">❄</text>
      <text x="50" y="98" font-size="8" class="fill-white">❄</text>
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

@keyframes snow {
  0% { transform: translateY(-5px) rotate(0deg); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(20px) rotate(180deg); opacity: 0; }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-snow {
  animation: snow 3s ease-in-out infinite;
}

.animate-snow-delay {
  animation: snow 3s ease-in-out infinite 1s;
}

.animate-snow-delay-2 {
  animation: snow 3s ease-in-out infinite 2s;
}
</style>
