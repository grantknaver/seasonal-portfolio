<script setup lang="ts">
import { mdiChevronDoubleDown, mdiChevronDown } from '@quasar/extras/mdi-v7';
const props = withDefaults(
  defineProps<{
    icon?: string;
    size?: string;
    isDark?: boolean;
    hasText?: boolean;
    /* Quiet variant: a small "Scroll" label over one slow-drifting chevron. */
    minimal?: boolean;
  }>(),
  {
    icon: mdiChevronDoubleDown,
    size: '48px',
    isDark: true,
    hasText: true,
    minimal: false,
  },
);
</script>

<template>
  <div
    v-if="props.minimal"
    class="scroll-cue scroll-cue--minimal"
    :class="{ 'scroll-cue--light': !props.isDark }"
    aria-hidden="true"
  >
    <span class="scroll-cue__label">Scroll</span>
    <q-icon :name="mdiChevronDown" size="18px" class="scroll-cue__drift" />
  </div>
  <div v-else class="scroll-cue" aria-hidden="true">
    <span v-if="hasText" :style="{ color: isDark ? 'var(--q-dark)' : 'var(--q-primary)' }"
      >CLARITY BUILDS TRUST</span
    >
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

.scroll-cue--minimal {
  gap: 0.1rem;
  color: rgb(11 31 46 / 0.5);

  .scroll-cue__label {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    animation: none;
  }

  .scroll-cue__drift {
    animation: cue-drift 2.6s ease-in-out infinite;
  }
}

/* On a dark photo: light text with a soft shadow so it stays readable. */
.scroll-cue--light {
  color: rgb(255 255 255 / 0.82);
  text-shadow: 0 1px 6px rgb(0 0 0 / 0.6);

  .scroll-cue__drift {
    filter: drop-shadow(0 1px 4px rgb(0 0 0 / 0.6));
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

@keyframes cue-drift {
  0%,
  100% {
    opacity: 0.45;
    transform: translateY(0);
  }
  50% {
    opacity: 0.9;
    transform: translateY(3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-cue__icon,
  .scroll-cue span,
  .scroll-cue__drift {
    animation: none;
  }
}
</style>
