<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Lignes de brouillard -->
    <g :class="{ 'animate-fog': animated }">
      <rect x="15" y="30" width="70" height="6" rx="3" class="fill-slate-300/80 dark:fill-slate-400/80" />
    </g>

    <g :class="{ 'animate-fog-delay': animated }">
      <rect x="20" y="45" width="60" height="5" rx="2.5" class="fill-slate-300/60 dark:fill-slate-400/60" />
    </g>

    <g :class="{ 'animate-fog': animated }">
      <rect x="10" y="58" width="75" height="6" rx="3" class="fill-slate-300/70 dark:fill-slate-400/70" />
    </g>

    <g :class="{ 'animate-fog-delay': animated }">
      <rect x="25" y="72" width="55" height="5" rx="2.5" class="fill-slate-300/50 dark:fill-slate-400/50" />
    </g>

    <g :class="{ 'animate-fog': animated }">
      <rect x="18" y="85" width="65" height="4" rx="2" class="fill-slate-300/40 dark:fill-slate-400/40" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  animated: { type: Boolean, default: true }
})
</script>

<style scoped>
@keyframes fog {
  0%, 100% { transform: translateX(0); opacity: 0.7; }
  50% { transform: translateX(5px); opacity: 1; }
}

.animate-fog {
  animation: fog 4s ease-in-out infinite;
}

.animate-fog-delay {
  animation: fog 4s ease-in-out infinite 2s;
}
</style>
