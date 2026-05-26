<template>
  <div
    class="skeleton-wrapper animate-pulse"
    role="status"
    aria-busy="true"
    :aria-label="ariaLabel || 'Loading'"
  >
    <!-- Current Weather Skeleton -->
    <div v-if="type === 'current'" class="skeleton-card flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <div class="h-6 w-32 skeleton-block rounded-lg"></div>
          <div class="h-4 w-48 skeleton-block rounded-lg"></div>
        </div>
        <div class="w-16 h-16 skeleton-block rounded-full"></div>
      </div>
      <div class="flex items-end gap-6">
        <div class="h-14 w-28 skeleton-block rounded-xl"></div>
        <div class="h-5 w-24 skeleton-block rounded-lg"></div>
      </div>
      <div class="h-6 w-40 skeleton-block rounded-lg"></div>
    </div>

    <!-- Details Skeleton -->
    <div v-else-if="type === 'details'" class="skeleton-card grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div v-for="i in 7" :key="i" class="p-3 rounded-xl skeleton-block">
        <div class="h-4 w-16 skeleton-inner rounded mb-2"></div>
        <div class="h-6 w-20 skeleton-inner rounded"></div>
      </div>
    </div>

    <!-- Forecast Skeleton -->
    <div v-else-if="type === 'forecast'" class="skeleton-card">
      <div class="h-6 w-40 skeleton-block rounded-lg mb-4"></div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <div v-for="i in 5" :key="i" class="p-4 rounded-2xl skeleton-block">
          <div class="h-4 w-16 skeleton-inner rounded mb-2"></div>
          <div class="h-5 w-12 skeleton-inner rounded mb-3"></div>
          <div class="h-10 w-10 skeleton-inner rounded-full mx-auto mb-3"></div>
          <div class="h-5 w-full skeleton-inner rounded"></div>
        </div>
      </div>
    </div>

    <!-- Card Skeleton -->
    <div v-else class="skeleton-card">
      <div class="h-6 w-32 skeleton-block rounded-lg mb-4"></div>
      <div class="space-y-3">
        <div class="h-4 w-full skeleton-block rounded"></div>
        <div class="h-4 w-3/4 skeleton-block rounded"></div>
      </div>
    </div>

    <span class="sr-only">Loading…</span>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'card',
    validator: (v) => ['current', 'details', 'forecast', 'card'].includes(v)
  },
  ariaLabel: { type: String, default: '' }
})
</script>

<style scoped>
.skeleton-card {
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.skeleton-block {
  background: linear-gradient(110deg, rgba(255, 255, 255, 0.04) 30%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.04) 70%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-inner {
  background: rgba(255, 255, 255, 0.05);
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-wrapper { animation: none; }
  .skeleton-block   { animation: none; background: rgba(255, 255, 255, 0.05); }
}
</style>
