<script lang="ts" setup>
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { Theme } from '../shared/constants/theme';
import { setTheme } from '../shared/utils/theme';
import { getCustomCssVar } from '../shared/utils/getCustomCssVar';

const mainStore = useMainStore();
const { activeTheme, activeTopic } = storeToRefs(mainStore);
const windowWidth = ref(window.innerWidth);
const desktopDrawerWidth = ref(window.innerWidth * 0.5);
const showTopicBreakpoint = +`${getCustomCssVar('breakpoint-md')}`.slice(0, -2);
const showTopicPanel = computed(
  () => !!activeTopic.value && windowWidth.value > showTopicBreakpoint,
);

const updateWidths = () => {
  desktopDrawerWidth.value = window.innerWidth * 0.5;
  windowWidth.value = window.innerWidth;
};

onMounted(() => window.addEventListener('resize', updateWidths));

onBeforeUnmount(() => window.removeEventListener('resize', updateWidths));

// const mobileMenu = ref(false);

// const tabs = [
//   { name: 'about', label: 'About', href: '#about' },
//   { name: 'projects', label: 'Projects', href: '#projects' },
//   { name: 'contact', label: 'Contact', href: '#contact' },
// ];

// Background image logic
const currentBg = ref('');
const nextBg = ref('');
const showNext = ref(false);

const backgroundMap: Record<Theme, string> = {
  [Theme.Fall]: new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
  [Theme.Winter]: new URL('../assets/snowy-winter-landscape.jpg', import.meta.url).href,
  [Theme.Spring]: new URL('../assets/beautiful-forest-spring-season.jpg', import.meta.url).href,
  [Theme.Summer]: new URL('../assets/beautiful-shot-forest.jpg', import.meta.url).href,
};

onMounted(() => {
  currentBg.value = backgroundMap[Theme.Fall];
});

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
    }, 800);
  },
);
</script>

<template>
  <div class="bg-container">
    <!-- Background Layers -->
    <div class="background-layer" :style="{ backgroundImage: `url('${currentBg}')` }" />
    <div
      v-show="showNext"
      class="background-layer fade-layer"
      :style="{ backgroundImage: `url('${nextBg}')` }"
    />

    <!-- Main Layout -->
    <q-layout view="lHh Lpr lFf" class="column">
      <!-- HEADER -->
      <!-- <q-header class="text-black">
        <q-toolbar class="bg-dark q-pa-lg">

          <q-toolbar-title>
            <img
              class="q-pt-sm"
              style="max-width: 200px"
              src="../assets/logo.png"
              alt="glkFreelance logo"
            />
          </q-toolbar-title>
          <q-btn
            color="primary"
            class="menu-button"
            flat
            dense
            round
            icon="menu"
            @click="mobileMenu = !mobileMenu"
          />
          <q-drawer v-model="mobileMenu" side="right" overlay behavior="mobile" bordered>
            <q-list>
              <q-item
                v-for="item in tabs"
                :key="item.name"
                class="text-dark"
                clickable
                @click="mobileMenu = false"
              >
                <q-item-section>{{ item.label }}</q-item-section>
              </q-item>
              <hr />
              <q-item key="resume" clickable @click="mobileMenu = false">
                <q-item-section class="text-bold text-secondary">Download Resume</q-item-section>
              </q-item>
            </q-list>
          </q-drawer>
        </q-toolbar>
      </q-header> -->

      <!-- PAGE CONTAINER -->
      <q-page-container>
        <router-view />
      </q-page-container>

      <!-- RIGHT DRAWER (Desktop Panel) -->
      <q-drawer
        :model-value="showTopicPanel"
        side="right"
        behavior="desktop"
        :width="desktopDrawerWidth"
        class="desktop-drawer"
      >
        <q-scroll-area class="fit q-pa-md">
          <div class="text-white"></div>
        </q-scroll-area>
      </q-drawer>

      <!-- FOOTER -->
      <q-footer>
        <q-toolbar class="bg-dark">
          <q-toolbar-title></q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<style lang="scss">
@import '../css/base/variables';

html,
body,
#q-app {
  height: 100%;
}

.bg-container {
  position: relative;
  height: 100%;
  width: 100%;
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

.q-header {
  background-color: rgba($color: black, $alpha: 0.5) !important;
  border-bottom: 2px solid var(--q-primary);

  @media (min-width: $breakpoint-sm) {
    display: none;
  }
}

aside {
  @media (min-width: $breakpoint-sm) {
    background-color: transparent !important;
  }
}

.desktop-drawer {
  background-color: rgba(black, 0.5);
  box-shadow: none !important;
}

.q-footer {
  border-top: 1px solid var(--q-primary);
}
</style>
