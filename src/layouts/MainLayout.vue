<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { getCustomCssVar } from '../shared/utils/getCustomCssVar';
import { TopicName } from '../shared/constants/topicName';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import {
  mdiMenu,
  // mdiHeart,
  // mdiGithub,
  // mdiLinkedin
} from '@quasar/extras/mdi-v7';
import { useCacheStore } from 'src/stores/component-cache';
import { CacheBinding } from 'src/shared/constants/cacheBinding';
import SlidePanel from '../components/SlidePanel.vue';

const cacheStore = useCacheStore();
const mainStore = useMainStore();
const { activeTopic } = storeToRefs(mainStore);
const windowWidth = ref(window.innerWidth);
const desktopDrawerWidth = ref(window.innerWidth * 0.5);
const showTopicBreakpoint = +`${getCustomCssVar('breakpoint-lg')}`.slice(0, -2);
// const isResponsive = computed(() => width.value < lgBreakpoint);
const showTopicPanel = computed(
  () => !!activeTopic.value && windowWidth.value > showTopicBreakpoint,
);
const updateWidths = () => {
  desktopDrawerWidth.value = window.innerWidth * 0.5;
  windowWidth.value = window.innerWidth;
};
const mobileMenu = ref(false);
const topics = ref<Topic[]>([
  { id: uuidv4(), name: TopicName.Lens, icon: '', label: TopicName.Lens },
  {
    id: uuidv4(),
    name: TopicName.Examples,
    icon: '',
    label: TopicName.Examples,
  },
  { id: uuidv4(), name: TopicName.About, icon: '', label: TopicName.About },
  { id: uuidv4(), name: TopicName.Contact, icon: '', label: TopicName.Contact },
]);
import { scrollToElement } from 'src/shared/utils/scrollToElement';
const activeEntry = computed(() => {
  if (!activeTopic.value) return null;
  return CacheBinding[activeTopic.value];
});

const activeComponent = computed(() => {
  const entry = activeEntry.value;
  if (!entry) return null;

  if (!cacheStore.catalog[entry]) {
    cacheStore.CACHE_COMPONENT(entry);
  }
  return cacheStore.catalog[entry];
});

function setAppVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--app-vh', `${vh}px`);
}

watch(showTopicPanel, (open) => {
  document.documentElement.style.setProperty(
    '--panel-offset',
    open ? `${desktopDrawerWidth.value}px` : '0px',
  );
});

onMounted(() => {
  setAppVh();
  window.addEventListener('orientationchange', setAppVh);
  window.addEventListener('resize', updateWidths);
  window.addEventListener('DOMContentLoaded', () => {});
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidths);
});
</script>

<template>
  <!-- changed view: no fixed footer token needed; keep header fixed -->
  <q-layout view="hHh Lpr fff">
    <q-header id="mobile-header" class="text-black">
      <q-toolbar class="bg-primary q-pa-lg">
        <q-toolbar-title>
          <div id="logo" class="logo row items-center">
            <span class="logo-text">
              <span class="glk text-accent">glk</span
              ><span class="freelance text-dark">Freelance</span>
            </span>
          </div>
        </q-toolbar-title>
        <q-btn
          color="primary"
          class="menu-button"
          flat
          dense
          round
          :icon="mdiMenu"
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
              :key="topic.id"
              class="menu-item text-dark"
              clickable
              @click="
                () => {
                  if (activeTopic === topic.name) {
                    scrollToElement(topic.name);
                  } else {
                    mainStore.SET_ACTIVE_TOPIC(topic.name);
                  }
                  mobileMenu = false;
                }
              "
              :class="{ activeTopic: topic.name === activeTopic }"
            >
              <q-item-section>{{ topic.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-drawer>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- Your routed pages render here -->
      <router-view />
      <!-- ensure content exceeds viewport so footer starts off-screen -->
      <!-- <div v-if="!isResponsive" class="footer-spacer" /> -->
    </q-page-container>

    <SlidePanel
      :model-value="showTopicPanel"
      :width="`${desktopDrawerWidth}px`"
      @update:model-value="mainStore.SET_ACTIVE_TOPIC(null)"
    >
      <Suspense v-if="activeEntry">
        <template #default>
          <component :is="activeComponent" :key="activeEntry" />
        </template>
        <template #fallback>
          <q-skeleton type="rect" height="400px" />
        </template>
      </Suspense>
    </SlidePanel>
  </q-layout>
  <!-- "Footer" lives in normal flow so we can scroll to it -->
  <!-- <section id="footer" class="bg-dark text-white" aria-label="Site footer">
    <q-toolbar class="justify-between">
      <q-toolbar-title class="text-subtitle2 text-weight-light">
        © {{ new Date().getFullYear() }} <span class="text-secondary">glk</span
        ><span class="text-primary">Freelance</span>
        | Crafted with
        <q-icon :name="mdiHeart" color="accent" size="16px" />
        using
        <a href="https://vuejs.org/" target="_blank" class="text-primary">Vue</a>,
        <a href="https://gsap.com/" target="_blank" class="text-primary">GSAP</a>,
        <a
          href="https://start.elevenlabs.io/cp/for-developers?utm_source=google&utm_medium=cpc&utm_campaign=t2_nonbrandsearch_developers_english&utm_id=23036483182&utm_term=elevenlabs%20api&utm_content=developer_-_other&gad_source=1&gad_campaignid=23036483182&gbraid=0AAAAA_PU6FZ0M3R23svUfxzzlK4tMIVv3&gclid=CjwKCAjwup3HBhAAEiwA7euZupVrpPtMDwT4bTGbiBeuLGRgeJRvvD2WxgM5nLfSbMAo1CMsKbfPtRoCiB0QAvD_BwE"
          target="_blank"
          class="text-primary"
          >Elevenlabs API</a
        >, and
        <a href="https://openai.com/api/" target="_blank" class="text-primary">ChatGPT API</a>.
      </q-toolbar-title>

      <div>
        <a href="https://github.com/grantknaver">
          <q-btn
            flat
            round
            :icon="mdiGithub"
            target="_blank"
            :class="'text-primary'"
            aria-label="GitHub"
          />
        </a>

        <a href="https://www.linkedin.com/in/grant-knaver/" target="_blank">
          <q-btn
            flat
            round
            :icon="mdiLinkedin"
            target="_blank"
            :class="'text-secondary'"
            aria-label="LinkedIn"
          />
        </a>
      </div>
    </q-toolbar>
  </section> -->
</template>

<style lang="scss">
@use '../css/tokens' as tokens;

.q-header {
  background-color: rgba($color: black, $alpha: 0.5) !important;
  border-bottom: 2px solid var(--q-primary);
  background-color: pink;

  @media (min-width: tokens.$breakpoint-lg) {
    display: none;
  }

  .logo-text {
    padding-left: 0.5rem;
    font-size: 1.5rem;
  }

  .glk {
    margin-right: 2px;
    font-weight: 700;
  }

  .freelance {
    font-weight: 500;
  }
}

/* Need this for right-side transparent drawer */
aside {
  @media (min-width: tokens.$breakpoint-sm) {
    background: color-mix(in srgb, $secondary 75%, white 25%);
  }
}

/* Mobile drawer overlays above content */
.drawer-mobile {
  z-index: 2;

  @media (min-width: tokens.$breakpoint-sm) {
    background: color-mix(in srgb, $secondary 75%, white 25%);
  }

  /* removed fixed q-footer; style our flow footer instead */
  #footer {
    position: relative;
    border-top: 1px solid var(--q-primary);
    z-index: 10;

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
    background: var(--q-primary);
  }

  .activeTopic {
    color: var(--q-accent);
    font-weight: bold;
  }
}
</style>
