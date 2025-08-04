<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
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
}

const NUM_ARTIFACTS = 50;
const artifacts = ref<Artifact[]>([]);
const artifactRefs = ref<(HTMLElement | null)[]>([]);

function createArtifacts() {
  for (let i = 0; i < NUM_ARTIFACTS; i++) {
    artifacts.value.push({
      id: `${i}-${Math.random()}`,
      left: Math.random() * 100,
      size: 10 + Math.random() * 14,
    });
  }
}

function animateArtifacts() {
  artifactRefs.value.forEach((el) => {
    if (!el) return;

    gsap.set(el, {
      y: -50 - Math.random() * 100,
      x: `+=${Math.random() * 100 - 50}`,
    });

    gsap.to(el, {
      y: window.innerHeight + 50,
      x: `+=${Math.random() * 100 - 50}`,
      duration: 6 + Math.random() * 5,
      repeat: -1,
      delay: Math.random() * 4,
      ease: 'none',
    });
  });
}

onMounted(() => {
  createArtifacts();
  nextTick(() => {
    artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);
    animateArtifacts();
  })
    .then(() => console.log('weather works'))
    .catch((e) => console.log('weather does not work', e));
});
</script>

<template>
  <div class="weather-artifact-container">
    <div
      v-for="artifact in artifacts"
      :key="artifact.id"
      class="weather-artifact"
      :style="{ left: artifact.left + '%', fontSize: artifact.size + 'px' }"
      ref="artifactRefs"
    >
      <span v-if="activeTheme === Theme.Winter">❄</span>
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
