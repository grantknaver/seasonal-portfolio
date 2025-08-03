<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { gsap } from 'gsap';

interface Flake {
  id: string;
  left: number;
  size: number;
}

const NUM_FLAKES = 50;
const flakes = ref<Flake[]>([]);
const flakeRefs = ref<(HTMLElement | null)[]>([]);

function createFlakes() {
  for (let i = 0; i < NUM_FLAKES; i++) {
    flakes.value.push({
      id: `${i}-${Math.random()}`,
      left: Math.random() * 100,
      size: 10 + Math.random() * 14, // size between 10–24px
    });
  }
}

function animateFlakes() {
  flakeRefs.value.forEach((el) => {
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

onMounted(async () => {
  createFlakes();
  await nextTick(() => {
    flakeRefs.value = flakeRefs.value.slice(0, flakes.value.length);
    animateFlakes();
  })
    .then(() => console.log('snow is falling'))
    .catch((e) => console.log('snow is not falling', e));
});
</script>

<template>
  <div class="snowfall-container">
    <div
      v-for="flake in flakes"
      :key="flake.id"
      class="snowflake"
      :style="{ left: flake.left + '%', fontSize: flake.size + 'px' }"
      ref="flakeRefs"
    >
      ❄
    </div>
  </div>
</template>

<style scoped lang="scss">
.snowfall-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.snowflake {
  position: absolute;
  color: white;
  opacity: 0.9;
  user-select: none;
  will-change: transform;
}
</style>
