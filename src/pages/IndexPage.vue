<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import PortfolioFocus from '../components/PortfolioFocus.vue';
import { Theme } from '../shared/constants/theme';
import { setTheme } from '../shared/utils/theme';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';

const themeStore = useMainStore();
const { activeTheme } = storeToRefs(themeStore);

const currentBg = ref('');
const nextBg = ref('');
const showNext = ref(false);

// Map each theme to its background image URL
const backgroundMap: Record<Theme, string> = {
  [Theme.Fall]: new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
  [Theme.Winter]: new URL('../assets/snowy-winter-landscape.jpg', import.meta.url).href,
  [Theme.Spring]: new URL('../assets/beautiful-forest-spring-season.jpg', import.meta.url).href,
  [Theme.Summer]: new URL('../assets/beautiful-shot-forest.jpg', import.meta.url).href,
};

// Initialize with Fall background
onMounted(() => {
  currentBg.value = backgroundMap[Theme.Fall];
});

// Watch for theme changes and trigger fade transition
watch(
  () => activeTheme.value,
  (newTheme) => {
    const newImage = backgroundMap[newTheme];
    if (!newImage || newImage === currentBg.value) return;

    nextBg.value = newImage;
    showNext.value = true;
    setTheme(newTheme);

    setTimeout(() => {
      currentBg.value = newImage;
      showNext.value = false;
      nextBg.value = '';
    }, 800); // duration must match animation
  },
);
</script>

<template>
  <q-page class="page-container flex column">
    <!-- Background layers -->
    <div class="background-layer" :style="{ backgroundImage: `url('${currentBg}')` }" />
    <div
      v-show="showNext"
      class="background-layer fade-layer"
      :style="{ backgroundImage: `url('${nextBg}')` }"
    />

    <!-- Foreground content -->
    <div class="content-wrapper">
      <PortfolioFocus />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.page-container {
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100%;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  opacity: 1;
  transition: opacity 0.8s ease-in-out;
}

.fade-layer {
  z-index: 1;
  opacity: 0;
  animation: fadeIn 0.8s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}
</style>
