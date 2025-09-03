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
import { type Slide } from 'src/shared/models/slide';
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
  { id: uuidv4(), name: TopicName.About, icon: 'info', label: TopicName.About },
  { id: uuidv4(), name: TopicName.Projects, icon: 'folder', label: TopicName.Projects },
  { id: uuidv4(), name: TopicName.Skills, icon: 'mail', label: TopicName.Skills },
]);

onMounted(() => {
  window.addEventListener('resize', updateWidths);
});

onBeforeUnmount(() => window.removeEventListener('resize', updateWidths));

watch(slide, (newVal) => {
  mainStore.SET_ACTIVE_THEME(newVal);
});
</script>

<template>
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

    <!-- HEADER (mobile) -->
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

        <!-- MOBILE DRAWER (overlay, always above footer) -->
        <q-drawer
          class="bg-primary drawer-mobile"
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
              @click="
                {
                  mainStore.SET_ACTIVE_TOPIC(topic.name);
                  mobileMenu = false;
                }
              "
              :class="{ activeTopic: topic.name === activeTopic }"
            >
              <q-item-section>{{ topic.label }}</q-item-section>
            </q-item>

            <q-item
              class="menu-item text-dark"
              clickable
              :class="{ activeTopic: TopicName.Contact === activeTopic }"
              @click="
                {
                  mainStore.SET_MOBILE_SCROLL_TARGET(TopicName.Contact);
                  mobileMenu = false;
                }
              "
            >
              <q-item-section>{{ TopicName.Contact }}</q-item-section>
            </q-item>

            <hr />

            <q-item key="resume" clickable @click="mobileMenu = false">
              <q-item-section class="text-bold text-secondary"
                ><a
                  class="resume"
                  href="https://firebasestorage.googleapis.com/v0/b/portfolio-4-seasons.firebasestorage.app/o/Resume.pdf?alt=media&token=2dbf1bfa-6d3f-44e4-a9b9-d6c6a53ea178"
                  >Download Resume</a
                ></q-item-section
              >
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

    <!-- RIGHT DRAWER (Desktop Panel) - non-overlay/push -->
    <q-drawer
      :model-value="showTopicPanel"
      side="right"
      behavior="desktop"
      :width="desktopDrawerWidth"
      class="desktop-drawer"
      content-class="column no-wrap"
    >
      <q-scroll-area v-if="activeTopic !== TopicName.Contact" class="fit q-pa-md">
        <AboutSection v-if="activeTopic === TopicName.About" />
        <SkillsSection v-else-if="activeTopic === TopicName.Skills" />
        <ProjectSection v-else-if="activeTopic === TopicName.Projects" />
      </q-scroll-area>

      <div v-else class="fit flex column justify-center items-center q-pa-md">
        <ContactSection />
      </div>
    </q-drawer>

    <!-- FOOTER (always below drawers in stacking) -->
    <q-footer class="bg-dark text-white">
      <q-toolbar class="justify-between">
        <q-toolbar-title class="text-subtitle2 text-weight-light">
          © {{ new Date().getFullYear() }}
          <span class="text-primary text-weight-light"
            >glk<span style="color: #fc9944; font-size: 1em">Freelance</span></span
          >
        </q-toolbar-title>

        <div class="q-gutter-sm">
          <a href="https://github.com/grantknaver">
            <q-btn
              flat
              round
              icon="fab fa-github"
              :href="'https://github.com/your-username'"
              target="_blank"
              :class="activeTheme !== Theme.Spring ? 'text-accent' : 'text-secondary'"
              aria-label="GitHub"
          /></a>

          <a href="https://www.linkedin.com/in/grant-knaver/">
            <q-btn
              flat
              round
              icon="fab fa-linkedin"
              target="_blank"
              :class="[activeTheme !== Theme.Spring ? 'text-accent' : 'text-secondary']"
              aria-label="LinkedIn"
          /></a>
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

/* Quasar renders <aside> for drawers */
aside {
  @media (min-width: $breakpoint-sm) {
    height: 100%;
    background-color: transparent !important;
  }
}

/* Desktop drawer (push mode) */
.desktop-drawer {
  height: 100%;
  background-color: rgba(black, 0.5);
  box-shadow: none !important;
  border-left: solid 4px var(--q-primary);
  z-index: 2000; /* ensure above footer if any stacking context appears */

  /* Make internal scroll area own full height to prevent content overflow */
  .q-scrollarea,
  .scroll-area {
    height: 100%;
  }
}

/* Mobile drawer should always overlay above footer */
.drawer-mobile {
  z-index: 2000;
}

/* Footer must never sit on top of drawers */
.q-footer {
  position: relative;
  z-index: 1000; /* lower than drawers, higher than backgrounds */
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

.resume {
  text-decoration: none;
  color: var(--q-accent);
}
</style>
