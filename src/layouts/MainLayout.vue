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
const showTopicBreakpoint = +`${getCustomCssVar('breakpoint-lg')}`.slice(0, -2);
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
  <!-- changed view: no fixed footer token needed; keep header fixed -->
  <q-layout view="hHh Lpr fff">
    <q-header id="mobile-header" class="text-black">
      <q-toolbar class="bg-dark q-pa-lg">
        <q-toolbar-title>
          <div id="logo" class="logo row items-center">
            <img
              class="q-pt-sm"
              style="max-width: 65px"
              src="../assets/glkfreelance-logo.png"
              alt="logo"
            />
            <span class="logo-text">
              <span class="text-secondary">glk</span><span class="text-primary">Freelance</span>
            </span>
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
          aria-label="Open menu"
        />

        <!-- MOBILE DRAWER (overlay, always above) -->
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
              <q-item-section class="text-bold text-secondary">
                <a
                  class="resume"
                  href="https://firebasestorage.googleapis.com/v0/b/portfolio-4-seasons.firebasestorage.app/o/Resume.pdf?alt=media&token=2dbf1bfa-6d3f-44e4-a9b9-d6c6a53ea178"
                  >Download Resume</a
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-drawer>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- Your routed pages render here -->
      <router-view />

      <!-- ensure content exceeds viewport so footer starts off-screen -->
      <div class="footer-spacer" />

      <!-- "Footer" lives in normal flow so we can scroll to it -->
      <section id="footer" class="my-footer q-pa-md bg-dark text-white" aria-label="Site footer">
        <q-toolbar class="justify-between">
          <q-toolbar-title class="text-subtitle2 text-weight-light">
            © {{ new Date().getFullYear() }} <span class="text-secondary">glk</span
            ><span class="text-primary">Freelance</span>
            | Crafted with
            <q-icon name="favorite" color="accent" size="16px" />
            using
            <a href="https://vuejs.org/" target="_blank" class="text-primary">Vue</a>,
            <a href="https://gsap.com/" target="_blank" class="text-primary">GSAP</a>, and AI tools.
          </q-toolbar-title>

          <div>
            <a href="https://github.com/grantknaver">
              <q-btn
                flat
                round
                icon="fab fa-github"
                target="_blank"
                :class="activeTheme !== Theme.Spring ? 'text-accent' : 'text-secondary'"
                aria-label="GitHub"
              />
            </a>

            <a href="https://www.linkedin.com/in/grant-knaver/">
              <q-btn
                flat
                round
                icon="fab fa-linkedin"
                target="_blank"
                :class="[activeTheme !== Theme.Spring ? 'text-accent' : 'text-secondary']"
                aria-label="LinkedIn"
              />
            </a>
          </div>
        </q-toolbar>
      </section>
    </q-page-container>

    <!-- Right desktop drawer stays the same -->
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
        <CaseStudiesSection v-else-if="activeTopic === TopicName.CaseStudies.replace(' ', '')" />
        <PackageSection v-else-if="activeTopic === TopicName.Packages" />
      </q-scroll-area>

      <div v-else class="fit flex column justify-center items-center q-pa-md">
        <ContactSection />
      </div>
    </q-drawer>
  </q-layout>
</template>

<style lang="scss">
@import '../css/base/variables';

.q-header {
  background-color: rgba($color: black, $alpha: 0.5) !important;
  border-bottom: 2px solid var(--q-primary);
  background-color: pink;

  @media (min-width: $breakpoint-lg) {
    display: none;
  }

  .logo-text {
    padding-left: 0.5rem;
    font-size: 1.5rem;
  }
}

/* Need this for right-side transparent drawer */
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
  z-index: 2000;

  .q-scrollarea,
  .scroll-area {
    flex: 1 1 0%;
  }
}

/* Mobile drawer overlays above content */
.drawer-mobile {
  z-index: 2000;
}

.footer-btn {
  z-index: 1000;
}

/* removed fixed q-footer; style our flow footer instead */
.my-footer {
  border-top: 1px solid var(--q-primary);
  .prefix-text {
    font-size: 0.8rem;
  }
  .q-btn:hover {
    color: var(--q-primary) !important;
  }

  /* optional: entrance animation hook if you want */
  will-change: transform, opacity;
}

/* spacer to guarantee the footer starts off-screen */
.footer-spacer {
  min-height: 1rem; /* tune this so the footer is initially below the viewport */
}

.activeTopic {
  color: var(--q-accent);
  font-weight: bold;
}
</style>
