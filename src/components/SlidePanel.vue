<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    width?: string;
  }>(),
  { width: '50vw' },
);

const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('update:modelValue', false);
};

watch(
  () => props.modelValue,
  (open) => {
    if (open) window.addEventListener('keydown', onKeydown);
    else window.removeEventListener('keydown', onKeydown);
  },
);

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <aside
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
