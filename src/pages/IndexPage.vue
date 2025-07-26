<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PortfolioFocus from '../components/PortfolioFocus.vue';
import { Theme } from '../shared/constants/theme';

const currentBg = ref('');
const backgroundMap: Record<Theme, string> = {
  [Theme.Fall]: new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
  [Theme.Winter]: new URL('../assets/snowy-winter-landscape.jpg', import.meta.url).href,
  [Theme.Spring]: new URL('../assets/beautiful-forest-spring-season.jpg', import.meta.url).href,
  [Theme.Summer]: new URL('../assets/beautiful-shot-forest.jpg', import.meta.url).href,
};

onMounted(() => {
  currentBg.value = backgroundMap[Theme.Fall];
});
</script>

<template>
  <q-page class="page-container flex column">
    <div class="logo-bcg full-width"></div>
    <img class="q-pt-sm" style="max-width: 200px" src="../assets/logo.png" alt="" />
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

  img {
    position: absolute;
    top: 3%;
    left: 3%;
    @media (min-width: $breakpoint-xs) {
      display: initial !important;
      z-index: 10;
    }
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

  .logo-bcg {
    @media (min-width: $breakpoint-sm) {
      height: 95px;
      background-color: rgba($color: #000000, $alpha: 0.4);
    }
  }

  .content-wrapper {
    position: relative;
    z-index: 2;
    width: 100%;
    display: flex;
    flex-grow: 1;
    justify-content: start;
  }
}
</style>
