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
import { debounce } from 'quasar';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
// import { getCustomCssVar } from '../shared/utils/getCustomCssVar';

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

const getFooterTop = async (): Promise<number> => {
  await nextTick();

  const footerEl = document.querySelector('footer.q-footer');
  if (!footerEl) {
    console.warn('Footer not found.');
    return window.innerHeight;
  }

  const rect = footerEl.getBoundingClientRect();
  console.log('Footer top:', rect.top);
  return rect.top;
};

const animateArtifacts = async () => {
  gsap.killTweensOf('*');

  // const breakpointMd = +getCustomCssVar('breakpoint-md').slice(0, -2);
  // const isMobile = () => window.innerWidth < breakpointMd;
  const verticalDrop = await getFooterTop();

  for (let index = 0; index < artifactRefs.value.length; index++) {
    const el = artifactRefs.value[index];
    let domEl: HTMLElement | null = null;

    if (el instanceof HTMLElement) {
      domEl = el;
    } else if (el && '$el' in el && el.$el instanceof HTMLElement) {
      domEl = el.$el;
    }

    if (!domEl) continue;

    const artifact = artifacts.value[index];
    if (!artifact) continue;

    const isFall = activeTheme.value === Theme.Fall;
    const startX = Math.random() * window.innerWidth;
    const startY = -window.innerHeight - Math.random() * 400;
    const duration = 6 + (30 - artifact.size) * 0.2;
    const delay = Math.random() * 6;
    const rotation = Math.random() * 360;

    gsap.set(domEl, {
      x: startX,
      y: startY,
      rotation,
      scale: artifact.size / 24,
    });

    gsap.to(domEl, {
      y: verticalDrop,
      rotation: `+=${isFall ? 360 : 90}`,
      duration,
      delay,
      repeat: -1,
      ease: isFall ? 'sine.inOut' : 'none',
    });

    if (isFall) {
      const horizontalDrift = 200 + Math.random() * 200;
      gsap.to(domEl, {
        x: `+=${Math.random() > 0.5 ? horizontalDrift : -horizontalDrift}`,
        y: verticalDrop,
        rotation: `+=360`,
        duration,
        delay,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }
  }
};

const handleResize = debounce(async () => {
  gsap.killTweensOf('*');

  artifacts.value = [];
  artifactRefs.value = [];

  await nextTick();

  if (activeTheme.value === Theme.Winter || activeTheme.value === Theme.Fall) {
    createArtifacts();
    await nextTick();
    artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);
    await animateArtifacts();
  }
}, 1);

onMounted(async () => {
  if (activeTheme.value === Theme.Winter || activeTheme.value === Theme.Fall) {
    createArtifacts();
    await nextTick();
    artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);
    await animateArtifacts();
  }
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  gsap.killTweensOf('*');
});

watch(activeTheme, async () => {
  gsap.killTweensOf('*');

  artifacts.value = [];
  artifactRefs.value = [];

  await nextTick();
  if (activeTheme.value === Theme.Winter || activeTheme.value === Theme.Fall) {
    createArtifacts();
    await nextTick();

    artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);
    await animateArtifacts();
  }
});
</script>

<template>
  <div class="weather-artifact-container">
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
