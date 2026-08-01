<script setup lang="ts">
import { mdiChevronDoubleDown } from '@quasar/extras/mdi-v7';
withDefaults(defineProps<{ icon?: string; size?: string; color?: string }>(), {
  icon: mdiChevronDoubleDown,
  size: '32px',
  color: 'dark',
});
</script>

<template>
  <div class="scroll-cue" aria-hidden="true">
    <q-icon :name="icon" :size="size" class="scroll-cue__icon" :color="color" />
  </div>
</template>

<style scoped lang="scss">
.scroll-cue {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  &__icon {
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
