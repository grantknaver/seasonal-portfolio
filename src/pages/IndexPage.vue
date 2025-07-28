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
  <q-page class="page-container q-pa-md column">
    <img class="q-pt-sm logo" style="max-width: 200px" src="../assets/logo.png" alt="logo" />
    <div class="content-wrapper col">
      <PortfolioFocus />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.page-container {
  width: 100%;
  min-height: 100%;

  .logo {
    display: none;
    position: absolute;
    top: 3%;
    left: 3%;

    @media (min-width: $breakpoint-sm) {
      display: flex !important;
      z-index: 10;
    }
  }

  .content-wrapper {
    position: relative;
    z-index: 2;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
