<template>
  <svg viewBox="0 0 100 100" class="w-full h-full">
    <!-- Lune -->
    <path
      d="M50 15 C30 15, 15 35, 15 50 C15 70, 35 85, 55 85 C75 85, 90 70, 90 50 C90 35, 75 15, 55 15 C60 25, 60 40, 50 50 C40 60, 30 55, 25 45 C30 35, 40 20, 50 15"
      class="fill-slate-200"
      :class="{ 'animate-glow': animated }"
    />
    <!-- Cratères -->
    <circle cx="40" cy="45" r="5" class="fill-slate-300/50" />
    <circle cx="55" cy="60" r="4" class="fill-slate-300/50" />
    <circle cx="35" cy="65" r="3" class="fill-slate-300/50" />
    <!-- Étoiles -->
    <g :class="{ 'animate-twinkle': animated }">
      <circle cx="20" cy="25" r="1.5" class="fill-yellow-200" />
      <circle cx="80" cy="30" r="1" class="fill-yellow-200" />
      <circle cx="75" cy="75" r="1.5" class="fill-yellow-200" />
      <circle cx="25" cy="80" r="1" class="fill-yellow-200" />
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
  0%, 100% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)); }
  50% { filter: drop-shadow(0 0 15px rgba(255,255,255,0.6)); }
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.animate-glow {
  animation: glow 4s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}
</style>
