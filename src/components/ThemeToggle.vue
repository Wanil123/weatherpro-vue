<template>
  <button
    @click="toggle"
    class="theme-toggle group"
    role="switch"
    :aria-checked="modelValue"
    aria-label="Basculer entre mode clair et sombre"
  >
    <span class="toggle-track" :class="modelValue ? 'track-dark' : 'track-light'">
      <!-- Stars background for dark mode -->
      <span class="toggle-stars" :class="modelValue ? 'opacity-100' : 'opacity-0'">
        <span class="star" style="top: 4px; left: 8px; animation-delay: 0s;" />
        <span class="star" style="top: 14px; left: 16px; animation-delay: 0.5s;" />
        <span class="star" style="bottom: 4px; left: 12px; animation-delay: 1s;" />
      </span>

      <!-- Thumb -->
      <span
        class="toggle-thumb"
        :class="modelValue ? 'translate-x-6' : 'translate-x-0'"
      >
        <svg
          v-if="!modelValue"
          class="w-3.5 h-3.5 text-amber-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
        <svg
          v-else
          class="w-3.5 h-3.5 text-slate-300"
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
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: 9999px;
  outline: none;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  cursor: pointer;
}

.theme-toggle:focus-visible {
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.4);
}

.toggle-track {
  position: relative;
  width: 3.25rem;
  height: 1.75rem;
  border-radius: 9999px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.track-dark {
  background: linear-gradient(135deg, #0c1445, #1a0a3e);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.track-light {
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  border: 1px solid rgba(14, 165, 233, 0.3);
}

.toggle-stars {
  position: absolute;
  inset: 0;
  transition: opacity 0.5s ease;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  animation: twinkle 2s ease-in-out infinite;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}
</style>
