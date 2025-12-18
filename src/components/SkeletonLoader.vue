<template>
  <div class="animate-pulse">
    <!-- Current Weather Skeleton -->
    <div v-if="type === 'current'" class="card glass flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <div class="h-6 w-32 bg-white/20 dark:bg-white/10 rounded-lg"></div>
          <div class="h-4 w-48 bg-white/20 dark:bg-white/10 rounded-lg"></div>
        </div>
        <div class="w-16 h-16 bg-white/20 dark:bg-white/10 rounded-full"></div>
      </div>
      <div class="flex items-end gap-6">
        <div class="h-14 w-28 bg-white/20 dark:bg-white/10 rounded-xl"></div>
        <div class="h-5 w-24 bg-white/20 dark:bg-white/10 rounded-lg"></div>
      </div>
      <div class="h-6 w-40 bg-white/20 dark:bg-white/10 rounded-lg"></div>
    </div>

    <!-- Details Skeleton -->
    <div v-else-if="type === 'details'" class="card glass grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="i in 7" :key="i" class="p-3 rounded-xl bg-white/20 dark:bg-white/10">
        <div class="h-4 w-16 bg-white/20 dark:bg-white/10 rounded mb-2"></div>
        <div class="h-6 w-20 bg-white/20 dark:bg-white/10 rounded"></div>
      </div>
    </div>

    <!-- Forecast Skeleton -->
    <div v-else-if="type === 'forecast'" class="card glass">
      <div class="h-6 w-40 bg-white/20 dark:bg-white/10 rounded-lg mb-4"></div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div v-for="i in 5" :key="i" class="p-4 rounded-2xl bg-white/20 dark:bg-white/10">
          <div class="h-4 w-16 bg-white/20 dark:bg-white/10 rounded mb-2"></div>
          <div class="h-5 w-12 bg-white/20 dark:bg-white/10 rounded mb-3"></div>
          <div class="h-10 w-10 bg-white/20 dark:bg-white/10 rounded-full mx-auto mb-3"></div>
          <div class="h-5 w-full bg-white/20 dark:bg-white/10 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Card Skeleton -->
    <div v-else class="card glass">
      <div class="h-6 w-32 bg-white/20 dark:bg-white/10 rounded-lg mb-4"></div>
      <div class="space-y-3">
        <div class="h-4 w-full bg-white/20 dark:bg-white/10 rounded"></div>
        <div class="h-4 w-3/4 bg-white/20 dark:bg-white/10 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'card', // 'current', 'details', 'forecast', 'card'
    validator: (v) => ['current', 'details', 'forecast', 'card'].includes(v)
  }
})
</script>
