<script lang="ts" setup>
import { ref } from 'vue';

defineProps<{
  text: string;
}>();

const show = ref(false);
</script>

<template>
  <div class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <transition name="fade">
      <div v-if="show" class="tooltip" role="tooltip">
        {{ text }}
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.tooltip-wrapper {
  position: relative;
  display: inline-block;

  .tooltip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--q-dark);
    color: var(--q-primary);
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    font-size: 0.85rem;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
