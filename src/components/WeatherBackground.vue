<script setup lang="ts">
import {
  ref,
  onMounted,
  nextTick,
  type ComponentPublicInstance,
  watch,
  onBeforeUnmount,
} from 'vue';
import { gsap } from 'gsap';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { Theme } from 'src/shared/constants/theme';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);

interface Artifact {
  id: string;
  left: number;
  size: number;
  emoji: string;
}

const NUM_ARTIFACTS = 50;
const artifacts = ref<Artifact[]>([]);
const artifactRefs = ref<(Element | ComponentPublicInstance | null)[]>([]);

const fallEmojis = ['🍂', '🍁'];
const winterEmoji = '❄';

function createArtifacts() {
  artifacts.value = [];
  for (let i = 0; i < NUM_ARTIFACTS; i++) {
    const size = 8 + Math.random() * 22;
    const emoji =
      activeTheme.value === Theme.Fall
        ? (fallEmojis[Math.floor(Math.random() * fallEmojis.length)] ?? '🍁')
        : winterEmoji;

    artifacts.value.push({
      id: `${i}-${Math.random()}`,
      left: Math.random() * 100,
      size,
      emoji,
    });
  }
}

function animateArtifacts() {
  artifactRefs.value.forEach((el) => {
    if (el) gsap.killTweensOf(el);
  });

  artifactRefs.value.forEach((el, index) => {
    let domEl: HTMLElement | null = null;

    if (el instanceof HTMLElement) {
      domEl = el;
    } else if (el && '$el' in el && el.$el instanceof HTMLElement) {
      domEl = el.$el;
    }

    if (!domEl) return;

    const artifact = artifacts.value[index];
    if (!artifact) return;

    const isFall = activeTheme.value === Theme.Fall;

    const startX = Math.random() * window.innerWidth;
    const startY = -window.innerHeight - Math.random() * 400;
    const horizontalDrift = 100 + Math.random() * 200;
    const verticalDrop = window.innerHeight + 300;
    const duration = 6 + (30 - artifact.size) * 0.2;
    const delay = Math.random() * 5;
    const rotation = Math.random() * 360;

    // Initial position
    gsap.set(domEl, {
      x: startX,
      y: startY,
      rotation,
      scale: artifact.size / 24,
    });

    // Main falling animation
    gsap.to(domEl, {
      x: isFall ? startX + (Math.random() > 0.5 ? horizontalDrift : -horizontalDrift) : startX,
      y: verticalDrop,
      rotation: `+=${isFall ? 180 : 90}`,
      duration,
      delay,
      repeat: -1,
      ease: isFall ? 'sine.inOut' : 'none',
    });

    // Fluttering side-to-side if Fall
    if (isFall) {
      gsap.to(domEl, {
        x: `+=${Math.random() * 30 + 20}`,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay,
      });
    }
  });
}

onMounted(async () => {
  createArtifacts();
  await nextTick();
  artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);
  animateArtifacts();
});

onBeforeUnmount(() => {
  gsap.killTweensOf('*');
});

watch(activeTheme, async () => {
  artifactRefs.value.forEach((el) => {
    if (el) gsap.killTweensOf(el);
  });

  artifacts.value = [];
  artifactRefs.value = [];

  await nextTick();
  createArtifacts();
  await nextTick();

  artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);
  animateArtifacts();
});
</script>

<template>
  <div class="weather-artifact-container">
    <h1>{{ activeTheme }}</h1>
    <div
      v-for="(artifact, index) in artifacts"
      :key="artifact.id"
      class="weather-artifact"
      :style="{ fontSize: artifact.size + 'px' }"
      :ref="(el) => (artifactRefs[index] = el)"
    >
      <span>{{ artifact.emoji }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-artifact-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.weather-artifact {
  position: absolute;
  color: white;
  opacity: 0.9;
  user-select: none;
  will-change: transform;
}
</style>
