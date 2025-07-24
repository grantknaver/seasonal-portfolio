<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PortfolioFocus from '../components/PortfolioFocus.vue';
// import ContentOutlet from '../components/ContentOutlet.vue';
import { Theme } from '../shared/constants/themes';

// Refs for background state
const currentBg = ref<string>('');
const nextBg = ref<string>('');
const fading = ref(false);

// Mapping of seasons to image URLs (resolved at build time)
const backgroundMap: Record<Theme, string> = {
  [Theme.Fall]: new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
  [Theme.Winter]: new URL('../assets/snowy-winter-landscape.jpg', import.meta.url).href,
  [Theme.Spring]: new URL('../assets/beautiful-forest-spring-season.jpg', import.meta.url).href,
  [Theme.Summer]: new URL('../assets/beautiful-shot-forest.jpg', import.meta.url).href,
};

// Set default background on page load
onMounted(() => {
  currentBg.value = backgroundMap[Theme.Fall];
});

// Handle background switching with smooth transition
const updateActiveSeason = (season: Theme) => {
  const newImage = backgroundMap[season];
  if (!newImage || newImage === currentBg.value) return;

  nextBg.value = newImage;
  fading.value = true;

  setTimeout(() => {
    currentBg.value = newImage;
    nextBg.value = '';
    fading.value = false;
  }, 700); // matches CSS animation duration
};
</script>

<template>
  <q-page class="page-container flex column">
    <!-- Background layers -->
    <div class="background-layer" :style="{ backgroundImage: `url('${currentBg}')` }" />
    <div
      v-if="fading"
      class="background-layer fade"
      :style="{ backgroundImage: `url('${nextBg}')` }"
    />

    <!-- Foreground content -->
    <div class="content-wrapper">
      <PortfolioFocus @change-season="updateActiveSeason" />
      <!-- <ContentOutlet /> -->
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.page-container {
  position: relative;
  overflow: hidden;
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
  transition: opacity 0.7s ease-in-out;
  z-index: 0;
  opacity: 1;
}

.background-layer.fade {
  z-index: 1;
  opacity: 1;
  animation: fadeIn 0.7s forwards;
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
}
</style>
