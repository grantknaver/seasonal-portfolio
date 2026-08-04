<script setup lang="ts">
import { mdiChevronDoubleDown } from '@quasar/extras/mdi-v7';
withDefaults(defineProps<{ icon?: string; size?: string; isDark?: boolean }>(), {
  icon: mdiChevronDoubleDown,
  size: '48px',
  isDark: true,
});
</script>

<template>
  <div class="scroll-cue" aria-hidden="true">
    <span :style="{ color: isDark ? 'var(--q-dark)' : 'var(--q-primary)' }">Scroll Now</span>
    <q-icon
      :name="icon"
      :size="size"
      class="scroll-cue__icon"
      :color="isDark ? 'dark' : 'primary'"
    />
  </div>
</template>

<style scoped lang="scss">
.scroll-cue {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  &__icon {
    animation: cue-pulse 2.2s ease-in-out infinite;
  }
  span {
    animation: cue-pulse 2.2s ease-in-out infinite;
  }
}

@keyframes cue-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(0) scale(0.94);
  }
  50% {
    opacity: 1;
    transform: translateY(5px) scale(1);
  }
}
</style>
