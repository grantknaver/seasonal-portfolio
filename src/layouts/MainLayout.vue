<script lang="ts" setup>
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { Theme } from '../shared/constants/theme';
import { getCustomCssVar } from '../shared/utils/getCustomCssVar';
import { TopicName } from '../shared/constants/topicName';
import { type Topic } from '../shared/models/topic';
import { v4 as uuidv4 } from 'uuid';
import AboutSection from '../components/AboutSection.vue';
import SkillsSection from '../components/SkillsSection.vue';
import ContactSection from '../components/ContactSection.vue';
import ProjectSection from '../components/ProjectSection.vue';
import WeatherBackground from '../components/WeatherBackground.vue';
import { QCarousel } from 'quasar';

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
const mobileMenu = ref(false);

export interface Slide {
  id: string;
  src: string;
  theme: Theme;
}

const slide = ref<Theme>(Theme.Fall);
const slides = ref<Slide[]>([
  {
    id: uuidv4(),
    src: new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
    theme: Theme.Fall,
  },
  {
    id: uuidv4(),
    src: new URL('../assets/snowy-winter-landscape.jpg', import.meta.url).href,
    theme: Theme.Winter,
  },
  {
    id: uuidv4(),
    src: new URL('../assets/beautiful-forest-spring-season.jpg', import.meta.url).href,
    theme: Theme.Spring,
  },
  {
    id: uuidv4(),
    src: new URL('../assets/beautiful-shot-forest.jpg', import.meta.url).href,
    theme: Theme.Summer,
  },
]);

const topics = ref<Topic[]>([
  {
    id: uuidv4(),
    name: TopicName.About,
    icon: 'info',
    label: TopicName.About,
    theme: Theme.Winter,
  },
  {
    id: uuidv4(),
    name: TopicName.Projects,
    icon: 'folder',
    label: TopicName.Projects,
    theme: Theme.Spring,
  },
  {
    id: uuidv4(),
    name: TopicName.Skills,
    icon: 'mail',
    label: TopicName.Skills,
    theme: Theme.Summer,
  },
]);

onMounted(() => {
  window.addEventListener('resize', updateWidths);
});

onBeforeUnmount(() => window.removeEventListener('resize', updateWidths));

watch(slide, (newVal) => {
  setTimeout(() => {
    mainStore.SET_ACTIVE_THEME(newVal);
  }, 2000);
});
</script>

<template>
  <!-- Main Layout -->
  <q-layout view="Hhh Lpr lff">
    <div class="carousel-background">
      <q-carousel
        v-model="slide"
        transition-prev="fade"
        transition-next="fade"
        animated
        infinite
        :autoplay="15000"
        height="100%"
        class="carousel-absolute bg-dark"
        :transition-duration="2500"
      >
        <q-carousel-slide v-for="s in slides" :key="s.id" :name="s.theme" :img-src="s.src" />
      </q-carousel>
    </div>
    <!-- HEADER -->
    <q-header class="main-header text-black">
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
        <q-drawer
          class="bg-primary"
          v-model="mobileMenu"
          side="right"
          overlay
          behavior="mobile"
          bordered
        >
          <q-list>
            <q-item
              v-for="topic in topics"
              :key="topic.name"
              class="menu-item text-dark"
              clickable
              @click="mainStore.SET_MOBILE_SCROLL_TARGET(topic.name)"
              :class="{ activeTopic: topic.name === activeTopic }"
            >
              <q-item-section>{{ topic.label }}</q-item-section>
            </q-item>
            <q-item
              class="menu-item text-dark"
              clickable
              :class="{ activeTopic: TopicName.Contact === activeTopic }"
              @click="mainStore.SET_MOBILE_SCROLL_TARGET(TopicName.Contact)"
            >
              <q-item-section>{{ TopicName.Contact }}</q-item-section>
            </q-item>
            <hr />
            <q-item key="resume" clickable @click="mobileMenu = false">
              <q-item-section class="text-bold text-secondary">Download Resume</q-item-section>
            </q-item>
          </q-list>
        </q-drawer>
      </q-toolbar>
    </q-header>

    <!-- PAGE CONTAINER -->
    <q-page-container>
      <div class="weather-layer">
        <WeatherBackground />
      </div>
      <router-view />
    </q-page-container>

    <!-- RIGHT DRAWER (Desktop Panel) -->
    <q-drawer
      :model-value="showTopicPanel"
      side="right"
      behavior="desktop"
      :width="desktopDrawerWidth"
      class="desktop-drawer column col"
    >
      <q-scroll-area v-if="activeTopic !== TopicName.Contact" class="scroll-area q-pa-md">
        <AboutSection v-if="activeTopic === TopicName.About" />
        <SkillsSection v-if="activeTopic === TopicName.Skills" />
        <ProjectSection v-if="activeTopic === TopicName.Projects" />
      </q-scroll-area>
      <div v-else class="flex column col justify-center items-center">
        <ContactSection v-if="activeTopic === TopicName.Contact" />
      </div>
    </q-drawer>

    <!-- FOOTER -->
    <q-footer class="bg-dark text-white">
      <q-toolbar class="justify-between">
        <q-toolbar-title class="text-subtitle2 text-weight-light">
          © {{ new Date().getFullYear() }}
          <span class="text-primary text-weight-light"
            >glk<span style="color: #fc9944; font-size: 1em">Freelance</span></span
          >
        </q-toolbar-title>

        <div class="q-gutter-sm">
          <q-btn
            flat
            round
            icon="fab fa-github"
            :href="'https://github.com/your-username'"
            target="_blank"
            :class="activeTheme !== Theme.Spring ? 'text-accent' : 'text-secondary'"
            aria-label="GitHub"
          />
          <q-btn
            flat
            round
            icon="fab fa-linkedin"
            :href="'https://linkedin.com/in/your-linkedin-id'"
            target="_blank"
            :class="[activeTheme !== Theme.Spring ? 'text-accent' : 'text-secondary']"
            aria-label="LinkedIn"
          />
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style lang="scss">
@import '../css/base/variables';

html,
body,
#q-app,
.q-layout,
.q-page-container,
.q-page {
  height: 100%;
  margin: 0;
  padding: 0;
}

.carousel-background {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.weather-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}

.q-header {
  background-color: rgba($color: black, $alpha: 0.5) !important;
  border-bottom: 2px solid var(--q-primary);

  @media (min-width: $breakpoint-md) {
    display: none;
  }
}

aside {
  @media (min-width: $breakpoint-sm) {
    height: 100%;
    background-color: transparent !important;
  }
}

.desktop-drawer {
  height: 100%;
  background-color: rgba(black, 0.5);
  box-shadow: none !important;
  border-left: solid 4px var(--q-primary);

  .scroll-area {
    height: calc(100% - 72px);

    @media (min-width: $breakpoint-md) {
      height: calc(100% - 50px);
    }
  }
}

.q-footer {
  border-top: 1px solid var(--q-primary);

  @media (min-width: $breakpoint-md) {
    background-color: rgba($color: black, $alpha: 0.5) !important;
  }

  .prefix-text {
    font-size: 0.8rem;
  }
  .q-btn:hover {
    color: var(--q-primary) !important;
  }
}

.activeTopic {
  color: var(--q-accent);
  font-weight: bold;
}
</style>
