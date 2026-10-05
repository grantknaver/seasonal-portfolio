<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    width?: string;
  }>(),
  { width: '50vw' },
);

const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const panelRef = ref<HTMLElement | null>(null);
const SCROLL_KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'];

const inPanel = (t: EventTarget | null) => t instanceof Node && !!panelRef.value?.contains(t);

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('update:modelValue', false);
    return;
  }
  /* While open, the page behind stays put: keys only scroll the panel. */
  if (SCROLL_KEYS.includes(e.code) && !inPanel(document.activeElement)) e.preventDefault();
};

/* Wheel / touch outside the panel must not move the page underneath. */
const blockOutside = (e: Event) => {
  if (!inPanel(e.target)) e.preventDefault();
};

const lock = () => {
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('wheel', blockOutside, { passive: false });
  window.addEventListener('touchmove', blockOutside, { passive: false });
};

const unlock = () => {
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener('wheel', blockOutside);
  window.removeEventListener('touchmove', blockOutside);
};

watch(
  () => props.modelValue,
  (open) => (open ? lock() : unlock()),
  { immediate: true },
);

onBeforeUnmount(unlock);
</script>

<template>
  <Teleport to="body">
    <aside
      ref="panelRef"
      class="slide-panel"
      :class="{ 'is-open': modelValue }"
      :style="{ width }"
      role="dialog"
      :aria-hidden="!modelValue"
    >
      <div class="slide-panel__scroll">
        <slot />
      </div>
    </aside>
  </Teleport>
</template>

<style scoped lang="scss">
@use '../css/tokens' as tokens;

.slide-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  background: color-mix(in srgb, var(--q-dark) 75%, white 25%);
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;

  &.is-open {
    transform: translateX(0);
  }
}

.slide-panel__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1rem 1rem 1rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
}
</style>
