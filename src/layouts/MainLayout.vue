<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { Theme } from '../shared/constants/theme';
import { getCustomCssVar } from '../shared/utils/getCustomCssVar';
import { TopicName } from '../shared/constants/topicName';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import { useViewport } from '../shared/utils/viewWidth';
import { mdiMenu, mdiHeart, mdiGithub, mdiLinkedin } from '@quasar/extras/mdi-v7';
import { useCacheStore } from 'src/stores/component-cache';
import { CacheBinding } from 'src/shared/constants/cacheBinding';

const cacheStore = useCacheStore();

const mainStore = useMainStore();
const { activeTheme, activeTopic } = storeToRefs(mainStore);
const { height, width, lgBreakpoint } = useViewport();
const windowWidth = ref(window.innerWidth);
const desktopDrawerWidth = ref(window.innerWidth * 0.5);
const showTopicBreakpoint = +`${getCustomCssVar('breakpoint-lg')}`.slice(0, -2);
const isResponsive = computed(() => width.value < lgBreakpoint);
const showTopicPanel = computed(
  () => !!activeTopic.value && windowWidth.value > showTopicBreakpoint,
);
const updateWidths = () => {
  desktopDrawerWidth.value = window.innerWidth * 0.5;
  windowWidth.value = window.innerWidth;
};
const mobileMenu = ref(false);
const topics = ref<Topic[]>([
  {
    id: uuidv4(),
    name: TopicName.CaseStudies,
    icon: 'menu_book',
    label: TopicName.CaseStudies,
  },
  { id: uuidv4(), name: TopicName.Packages, icon: 'local_shipping', label: TopicName.Packages },
  { id: uuidv4(), name: TopicName.About, icon: 'info', label: TopicName.About },
  { id: uuidv4(), name: TopicName.Contact, icon: 'contact_mail', label: TopicName.Contact },
]);
import autumn from 'src/assets/autumn-forestry.jpg?w=768;1280;1600&format=avif;webp;jpeg&quality=40&withoutEnlargement=true&as=picture';
import winter from 'src/assets/snowy-winter-landscape.jpg?w=768;1280;1600&format=avif;webp;jpeg&quality=40&withoutEnlargement=true&as=picture';
import spring from 'src/assets/beautiful-forest-spring-season.jpg?w=768;1280;1600&format=avif;webp;jpeg&quality=40&withoutEnlargement=true&as=picture';
import summer from 'src/assets/beach.jpg?w=768;1280;1600&format=avif;webp;jpeg&quality=40&withoutEnlargement=true&as=picture';
import { type Slide } from 'src/shared/types/slide';
const slides = ref<Slide[]>([
  {
    id: uuidv4(),
    picture: autumn,
    theme: Theme.Fall,
    name: 'Fall Background',
  },
  {
    id: uuidv4(),
    picture: winter,
    theme: Theme.Winter,
    name: 'Winter Background',
  },
  {
    id: uuidv4(),
    picture: spring,
    theme: Theme.Spring,
    name: 'Spring Background',
  },
  {
    id: uuidv4(),
    picture: summer,
    theme: Theme.Summer,
    name: 'Summer Background',
  },
]);
const slide = ref<Theme>(Theme.Fall);
const showCarousel = ref<boolean>(false);
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

onMounted(() => {
  showCarousel.value = true;
  window.addEventListener('resize', updateWidths);
});
onBeforeUnmount(() => window.removeEventListener('resize', updateWidths));

watch(slide, (newVal) => mainStore.SET_ACTIVE_THEME(newVal));
</script>

<template>
  <!-- changed view: no fixed footer token needed; keep header fixed -->
  <q-layout view="hHh Lpr fff">
    <div
      class="carousel-background"
      :class="{
        'responsive-carousel-background': isResponsive,
      }"
      v-if="showCarousel"
    >
      <q-carousel
        v-model="slide"
        transition-prev="fade"
        transition-next="fade"
        animated
        infinite
        :autoplay="15000"
        class="bg-dark"
        :transition-duration="2500"
      >
        <q-carousel-slide
          v-for="(slide, index) in slides"
          :key="slide.id"
          :name="slide.theme"
          class="relative-position"
        >
          <div class="slide-bg">
            <picture>
              <source
                v-for="(src, k) in slide.picture.sources"
                :key="k"
                :srcset="src"
                :type="`image/${k}`"
              />
              <img
                :src="slide.picture.img.src"
                :width="slide.picture.img.w"
                :height="slide.picture.img.h"
                sizes="(min-width: 1440px) 1600px,
        (min-width: 1024px) 1280px,
        (min-width: 600px)  768px,
        100vw"
                :fetchpriority="index === 0 ? 'high' : 'low'"
                :loading="index === 0 ? 'eager' : 'lazy'"
                decoding="async"
                :alt="slide.name"
              />
            </picture>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
    <q-header id="mobile-header" class="text-black">
      <q-toolbar class="bg-dark q-pa-lg">
        <q-toolbar-title>
          <div id="logo" class="logo row items-center">
            <img
              class="q-pt-sm"
              width="130"
              height="130"
              style="max-width: 65px; height: auto"
              src="../assets/glkfreelance-logo.avif"
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
                  mainStore.SET_ACTIVE_TOPIC(topic.name);
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
      <div v-if="!isResponsive" class="footer-spacer bg-red" />

      <!-- "Footer" lives in normal flow so we can scroll to it -->
      <section id="footer" class="bg-dark text-white" aria-label="Site footer">
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
                :class="activeTheme !== Theme.Summer ? 'text-primary' : 'text-secondary'"
                aria-label="GitHub"
              />
            </a>

            <a href="www.linkedin.com/in/grant-knaver" target="_blank">
              <q-btn
                flat
                round
                :icon="mdiLinkedin"
                target="_blank"
                :class="activeTheme !== Theme.Summer ? 'text-primary' : 'text-secondary'"
                aria-label="LinkedIn"
              />
            </a>
          </div>
        </q-toolbar>
      </section>
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
        visible
        class="q-pa-md"
        :bar-style="{ backgroundColor: 'white', opacity: '1' }"
      >
        <div v-if="!activeEntry" class="text-white q-pa-md">
          <p>No active topic yet.</p>
          <p>activeTopic: {{ activeTopic }}</p>
        </div>

        <!-- 2 & 3. We have an entry → let Suspense handle loading vs loaded -->
        <Suspense v-else>
          <template #default>
            <!-- 3. Loaded: async component has resolved -->
            <component :is="activeComponent" :key="activeEntry" />
          </template>

          <!-- 2. Loading: while defineAsyncComponent is resolving -->
          <template #fallback>
            <q-skeleton type="rect" :width="desktopDrawerWidth + 'px'" :height="height + 'px'" />
          </template>
        </Suspense>
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>

<style lang="scss">
@use '/src/css/_tokens.scss' as tokens;

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
}

/* Need this for right-side transparent drawer */
aside {
  @media (min-width: tokens.$breakpoint-sm) {
    background-color: transparent !important;
  }
}

.carousel-background {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background-color: #000; // important: base layer

  .q-carousel {
    height: 100%;
  }

  .q-carousel__slides-container,
  .q-carousel__slide {
    height: 100%;
  }

  .slide-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-color: #000; // if image isn't ready, still black
    pointer-events: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}

.desktop-drawer {
  display: flex;
  flex-direction: column;
  background-color: rgba(black, 0.5);
  border-left: solid 4px var(--q-primary);
  z-index: 2;

  .q-scrollarea,
  .scroll-area {
    flex: 1 1 0%;
  }
}

/* Mobile drawer overlays above content */
.drawer-mobile {
  z-index: 2;
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
}

.activeTopic {
  color: var(--q-accent);
  font-weight: bold;
}
</style>
