<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { Theme } from '../shared/constants/theme';
import { getCustomCssVar } from '../shared/utils/getCustomCssVar';
import { TopicName } from '../shared/constants/topicName';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import AboutSection from '../components/AboutSection.vue';
import ContactSection from '../components/ContactSection.vue';
import PackageSection from 'src/components/PackageSection.vue';

import CaseStudiesSection from '../components/CaseStudiesSection.vue';

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

const topics = ref<Topic[]>([
  { id: uuidv4(), name: TopicName.Packages, icon: 'local_shipping', label: TopicName.Packages },
  { id: uuidv4(), name: TopicName.About, icon: 'info', label: TopicName.About },
  { id: uuidv4(), name: TopicName.Contact, icon: 'contact_mail', label: TopicName.Contact },
  {
    id: uuidv4(),
    name: TopicName.CaseStudies.replace(' ', '') as TopicName,
    icon: 'menu_book',
    label: TopicName.CaseStudies,
  },
]);

onMounted(() => {
  window.addEventListener('resize', updateWidths);
});

onBeforeUnmount(() => window.removeEventListener('resize', updateWidths));
</script>

<template>
  <q-layout view="hHh Lpr FFF">
    <q-header id="mobile-header" class="text-black">
      <q-toolbar class="bg-dark q-pa-lg">
        <q-toolbar-title>
          <div class="logo row items-center">
            <img
              class="q-pt-sm"
              style="max-width: 65px"
              src="../assets/glkfreelance-logo.png"
              alt="logo"
            />
            <span class="logo-text"
              ><span class="text-secondary">glk</span
              ><span class="text-primary">Freelance</span></span
            >
          </div>
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

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer
      :model-value="showTopicPanel"
      side="right"
      behavior="desktop"
      :width="desktopDrawerWidth"
      class="desktop-drawer"
      content-class="column no-wrap"
    >
      <q-scroll-area
        v-if="activeTopic !== TopicName.Contact"
        visible
        class="q-pa-md"
        :bar-style="{ backgroundColor: 'white', opacity: '1' }"
      >
        <AboutSection v-if="activeTopic === TopicName.About" />
        <CaseStudiesSection v-else-if="activeTopic === TopicName.CaseStudies" />
        <PackageSection v-else-if="activeTopic === TopicName.Packages" />
      </q-scroll-area>

      <div v-else class="fit flex column justify-center items-center q-pa-md">
        <ContactSection />
      </div>
    </q-drawer>

    <q-footer class="bg-dark text-white">
      <q-toolbar class="justify-between">
        <q-toolbar-title class="text-subtitle2 text-weight-light">
          © {{ new Date().getFullYear() }} <span class="text-secondary">glk</span
          ><span class="text-primary">Freelance</span>
        </q-toolbar-title>

        <div class="">
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

.q-header {
  background-color: rgba($color: black, $alpha: 0.5) !important;
  border-bottom: 2px solid var(--q-primary);

  @media (min-width: $breakpoint-md) {
    display: none;
  }

  .logo-text {
    padding-left: 0.5rem;
    font-size: 1.5rem;
  }
}

// Need this for right-side transparent drawer
aside {
  @media (min-width: $breakpoint-sm) {
    background-color: transparent !important;
  }
}

.desktop-drawer {
  display: flex;
  flex-direction: column;
  background-color: rgba(black, 0.5);
  border-left: solid 4px var(--q-primary);
  z-index: 2000; /* ensure above footer if any stacking context appears */

  /* Make internal scroll area own full height to prevent content overflow */
  .q-scrollarea,
  .scroll-area {
    flex: 1 1 0%;
  }
}

/* Mobile drawer should always overlay above footer */
.drawer-mobile {
  z-index: 2000;
}

.q-footer {
  border-top: 1px solid var(--q-primary);

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
