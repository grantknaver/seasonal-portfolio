<script lang="ts" setup>
import { computed, ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { Theme } from '../shared/constants/theme';
import { setTheme } from '../shared/utils/theme';
import { getCustomCssVar } from '../shared/utils/getCustomCssVar';
import { TopicName } from 'src/shared/constants/topicName';
import { type Topic } from '../shared/models/topic';
import { v4 as uuidv4 } from 'uuid';
import AboutSection from 'src/components/AboutSection.vue';
import ContactSection from 'src/components/ContactSection.vue';

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
const currentBg = ref('');
const nextBg = ref('');
const showNext = ref(false);
const mobileMenu = ref(false);
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
const backgroundMap: Record<Theme, string> = {
  [Theme.Fall]: new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
  [Theme.Winter]: new URL('../assets/snowy-winter-landscape.jpg', import.meta.url).href,
  [Theme.Spring]: new URL('../assets/beautiful-forest-spring-season.jpg', import.meta.url).href,
  [Theme.Summer]: new URL('../assets/beautiful-shot-forest.jpg', import.meta.url).href,
};

onMounted(() => {
  window.addEventListener('resize', updateWidths);
  currentBg.value = backgroundMap[Theme.Fall];
});

onBeforeUnmount(() => window.removeEventListener('resize', updateWidths));

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

const selectTopic = (name: TopicName, theme?: Theme) => {
  mainStore.SET_ACTIVE_TOPIC(name);
  if (theme) {
    mainStore.SET_ACTIVE_THEME(theme);
  }
};

const scrollToContact = async () => {
  mobileMenu.value = false;
  await nextTick();

  setTimeout(() => {
    const el = document.getElementById('contact');
    console.log('el...', el);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn('Contact element not found');
    }
  }, 200);
};
</script>

<template>
  <div class="bg-container">
    <!-- Background Layers -->
    <div class="background-layer" :style="{ backgroundImage: `url('${currentBg}')` }" />
    <div
      v-show="showNext"
      class="background-layer"
      :style="{ backgroundImage: `url('${nextBg}')` }"
    />

    <!-- Main Layout -->
    <q-layout view="Hhh LpR lff" class="column">
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
                @click="selectTopic(topic.name, topic.theme)"
                :class="{ activeTopic: topic.name === activeTopic }"
              >
                <q-item-section>{{ topic.label }}</q-item-section>
              </q-item>
              <q-item
                class="menu-item text-dark"
                clickable
                @click="scrollToContact"
                :class="{ activeTopic: TopicName.Contact === activeTopic }"
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
        <q-scroll-area v-if="activeTopic !== TopicName.Contact" class="fit q-pa-md">
          <AboutSection v-if="activeTopic === TopicName.About" />
        </q-scroll-area>
        <div v-else class="flex column col justify-center items-center">
          <ContactSection v-if="activeTopic === TopicName.Contact" />
        </div>
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
  min-height: 100vh;
  width: 100%;
  overflow: auto;
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

.q-header {
  background-color: rgba($color: black, $alpha: 0.5) !important;
  border-bottom: 2px solid var(--q-primary);

  @media (min-width: $breakpoint-md) {
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
  border-left: solid 4px var(--q-primary);
}

.q-footer {
  border-top: 1px solid var(--q-primary);
}

.activeTopic {
  color: var(--q-accent);
  font-weight: bold;
}
</style>
