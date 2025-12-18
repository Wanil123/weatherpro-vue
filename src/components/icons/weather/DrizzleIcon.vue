<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Nuage -->
    <g :class="{ 'animate-float': animated }">
      <path
        d="M20 55 Q10 55, 10 45 Q10 35, 20 35 Q20 25, 35 25 Q40 17, 55 17 Q75 17, 75 37 Q85 37, 85 47 Q85 57, 75 57 Z"
        class="fill-slate-400 dark:fill-slate-500"
      />
    </g>

    <!-- Petites gouttes de bruine -->
    <g :class="{ 'animate-drizzle': animated }">
      <circle cx="28" cy="68" r="2" class="fill-blue-300" />
      <circle cx="42" cy="72" r="2" class="fill-blue-300" />
      <circle cx="56" cy="66" r="2" class="fill-blue-300" />
      <circle cx="70" cy="70" r="2" class="fill-blue-300" />
    </g>

    <g :class="{ 'animate-drizzle-delay': animated }">
      <circle cx="35" cy="78" r="1.5" class="fill-blue-200" />
      <circle cx="49" cy="82" r="1.5" class="fill-blue-200" />
      <circle cx="63" cy="76" r="1.5" class="fill-blue-200" />
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

@keyframes drizzle {
  0% { transform: translateY(-3px); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-drizzle {
  animation: drizzle 1.5s ease-in-out infinite;
}

.animate-drizzle-delay {
  animation: drizzle 1.5s ease-in-out infinite 0.7s;
}
</style>
