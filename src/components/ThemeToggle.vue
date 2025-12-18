<template>
  <button
    @click="toggle"
    class="theme-toggle group"
    role="switch"
    :aria-checked="modelValue"
    aria-label="Basculer entre mode clair et sombre"
  >
    <!-- Fond du toggle -->
    <span class="toggle-track">
      <!-- Étoiles/soleil en arrière-plan -->
      <span class="toggle-bg-icons">
        <span class="star star-1">*</span>
        <span class="star star-2">*</span>
        <span class="star star-3">*</span>
      </span>

      <!-- Cercle du toggle -->
      <span
        :class="[
          'toggle-thumb',
          modelValue ? 'translate-x-6' : 'translate-x-0'
        ]"
      >
        <!-- Icône soleil/lune -->
        <svg
          v-if="!modelValue"
          class="w-4 h-4 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
        <svg
          v-else
          class="w-4 h-4 text-slate-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
        </svg>
      </span>
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.theme-toggle {
  @apply relative inline-flex items-center p-1 rounded-full
         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
         transition-all duration-300;
}

.toggle-track {
  @apply relative w-14 h-8 rounded-full overflow-hidden
         bg-gradient-to-r from-blue-900 to-indigo-900
         transition-all duration-500;
}

.theme-toggle[aria-checked="false"] .toggle-track {
  @apply from-sky-400 to-blue-500;
}

.toggle-bg-icons {
  @apply absolute inset-0 flex items-center justify-center;
}

.star {
  @apply absolute text-white/60 text-xs transition-all duration-500;
}

.star-1 { @apply top-1 left-2; }
.star-2 { @apply top-3 left-4; }
.star-3 { @apply bottom-1 left-3; }

.theme-toggle[aria-checked="false"] .star {
  @apply opacity-0 scale-0;
}

.theme-toggle[aria-checked="true"] .star {
  @apply opacity-100 scale-100;
  animation: twinkle 2s ease-in-out infinite;
}

.star-2 { animation-delay: 0.5s; }
.star-3 { animation-delay: 1s; }

.toggle-thumb {
  @apply absolute top-1 left-1 w-6 h-6 rounded-full
         bg-white shadow-lg
         flex items-center justify-center
         transition-transform duration-300 ease-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}
</style>
