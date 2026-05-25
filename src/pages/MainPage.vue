<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, computed, onMounted, onUnmounted } from 'vue';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import { TopicName } from '../shared/constants/topicName';
import SimonMenu from '../components/SimonMenu.vue';
import { scroll } from 'quasar';
import gsap from 'gsap';
import { ViewType } from '../shared/constants/viewType';
import { useViewport } from '../shared/utils/viewWidth';
import {
  mdiChevronUp,
  mdiBookOpenPageVariant,
  mdiTruckDelivery,
  mdiInformationOutline,
  mdiEmailBox,
} from '@quasar/extras/mdi-v7';
import { mdiChevronDown } from '@quasar/extras/mdi-v7';
import { CacheEntry } from 'src/shared/constants/cacheEntry';
import { useCacheStore } from 'src/stores/component-cache';
import type { Package } from 'src/shared/constants/packages';
import { scrollToElement } from 'src/shared/utils/scrollToElement';
import { CacheBinding } from 'src/shared/constants/cacheBinding';

const mainStore = useMainStore();
const cacheStore = useCacheStore();
const mobileTopics: Topic[] = [
  {
    id: uuidv4(),
    name: TopicName.CaseStudies,
    icon: mdiBookOpenPageVariant,
    label: TopicName.CaseStudies,
    cachedName: CacheEntry.CaseStudiesSection,
  },
  {
    id: uuidv4(),
    name: TopicName.Packages,
    icon: mdiTruckDelivery,
    label: 'Packages',
    cachedName: CacheEntry.PackageSection,
  },
  {
    id: uuidv4(),
    name: TopicName.About,
    icon: mdiInformationOutline,
    label: TopicName.About,
    cachedName: CacheEntry.AboutSection,
  },

  {
    id: uuidv4(),
    name: TopicName.Contact,
    icon: mdiEmailBox,
    label: TopicName.Contact,
    cachedName: CacheEntry.ContactSection,
  },
];
const expandedPanel = ref<TopicName | null>();
const { getScrollTarget, setVerticalScrollPosition } = scroll;
const { activeTopic } = storeToRefs(mainStore);
const root = ref<HTMLElement | null>(null);
const showFooter = ref<boolean>(false);
const io = ref<IntersectionObserver | null>(null);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const dispose = ref<() => void>(() => {});
const nameRef = ref<HTMLElement | null>(null);
const simonRef = ref<HTMLElement | null>(null);
const headlineRef = ref<HTMLElement | null>(null);
const sepRef = ref<HTMLElement | null>(null);
const servRef = ref<HTMLElement | null>(null);
const ctaBtnRef = ref<HTMLElement | null>(null);
const homeContainerRef = ref<HTMLElement | null>(null);

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

onMounted(async () => {
  if (isResponsive.value) {
    try {
      dispose.value = buildAnimations(ViewType.Responsive);
    } catch (e) {
      console.log('Responsive main page animations error: ', e);
    }
  } else {
    try {
      dispose.value = buildAnimations(ViewType.Desktop);
    } catch (e) {
      console.log('Desktop main page animations error: ', e);
    }
  }

  await mainStore.VERIFY_IS_HUMAN();
});

onUnmounted(() => {
  cacheStore.CLEAR_CACHE();
});

onBeforeUnmount(() => {
  io.value?.disconnect();
  try {
    dispose.value();
  } catch (e) {
    console.log('onBeforeUnmount dispose err', e);
  }
});

watch(
  isResponsive,
  async (viewNow) => {
    try {
      dispose.value();
    } catch (err) {
      console.log('view switch error: ', err);
    }
    await nextTick();
    await waitForLayout(root.value);
    dispose.value = buildAnimations(viewNow ? ViewType.Responsive : ViewType.Desktop);
  },
  { flush: 'post' },
);

watch(
  activeTopic,
  async (newTopic: TopicName | null) => {
    expandedPanel.value = newTopic;
    await nextTick();
    const el = homeContainerRef.value;
    if (!el) return;
    if (!newTopic) {
      gsap.to(el, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      return;
    }
    gsap.to(el, {
      scale: 0.8,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  },
  { immediate: true, deep: true },
);

const waitForLayout = async (el: HTMLElement | null, frames = 8): Promise<boolean> => {
  if (!el) return false;
  for (let i = 0; i < frames; i++) {
    await new Promise(requestAnimationFrame);
    if (el.offsetParent !== null && el.offsetHeight > 0 && el.offsetWidth > 0) {
      mainStore.SET_PAINTED_STATUS(true);
      return true;
    }
  }
  mainStore.SET_PAINTED_STATUS(false);
  return false;
};

const buildAnimations = (mode: ViewType) => {
  const el = root.value;
  if (!el) return () => {};
  // Responsive: all elements with .mobile-content
  const homeContentEls = Array.from(document.querySelectorAll<HTMLElement>('.mobile-content'));

  // Desktop: only non-null refs
  const desktopEls = [
    nameRef.value,
    simonRef.value,
    headlineRef.value,
    sepRef.value,
    servRef.value,
    ctaBtnRef.value,
  ].filter((x): x is HTMLElement => !!x);

  if (mode === ViewType.Responsive) {
    if (!homeContentEls.length) return () => {};
    gsap.killTweensOf(homeContentEls);
    gsap.set(homeContentEls, { clearProps: 'all' });

    gsap.fromTo(
      homeContentEls,
      { x: 150, autoAlpha: 0 },
      {
        keyframes: [{ x: 0, autoAlpha: 1 }],
        ease: 'bounce',
        duration: 1,
        overwrite: 'auto',
        stagger: 1,
      },
    );
    return () => {
      gsap.killTweensOf(homeContentEls);
      gsap.set(homeContentEls, { clearProps: 'all' });
    };
  }
  if (mode === ViewType.Desktop) {
    if (!desktopEls.length) return () => {};

    gsap.killTweensOf(desktopEls);
    gsap.set(desktopEls, { clearProps: 'all' });

    gsap.fromTo(
      nameRef.value,
      { y: -150, autoAlpha: 0, rotation: 0 },
      {
        keyframes: [{ rotation: 15 }, { rotation: -10, y: -10 }, { rotation: 0, y: 0 }],
        autoAlpha: 1,
        ease: 'bounce.out',
        duration: 3.8,
        overwrite: 'auto',
      },
    );

    gsap.fromTo(
      simonRef.value,
      {
        scale: 0,
        autoAlpha: 0,
        rotation: 0,
        transformOrigin: '50% 50%',
      },
      {
        keyframes: [
          { scale: 0.5, rotation: 15, autoAlpha: 1 },
          { scale: 1.1, rotation: -10 },
          { scale: 1, rotation: 0 },
        ],
        ease: 'bounce.out',
        duration: 3.8,
        overwrite: 'auto',
      },
    );

    gsap.fromTo(
      headlineRef.value,
      { y: 150, autoAlpha: 0 },
      {
        keyframes: [{ y: 0, autoAlpha: 1 }],
        ease: 'bounce.out',
        duration: 3,
        overwrite: 'auto',
      },
    );

    gsap.fromTo(
      sepRef.value,
      { y: 150, autoAlpha: 0 },
      {
        keyframes: [{ y: 0, autoAlpha: 1 }],
        ease: 'bounce.out',
        duration: 1,
        overwrite: 'auto',
      },
    );

    gsap.fromTo(
      servRef.value,
      { x: -100, autoAlpha: 0 },
      {
        keyframes: [{ x: 0, autoAlpha: 1 }],
        ease: 'bounce.out',
        duration: 1.5,
        overwrite: 'auto',
        delay: 2,
      },
    );

    gsap.fromTo(
      ctaBtnRef.value,
      { y: 50, autoAlpha: 0 },
      {
        keyframes: [{ y: 0, autoAlpha: 1 }],
        ease: 'power2.out',
        duration: 1,
        overwrite: 'auto',
        delay: 2.5,
      },
    );

    // disposer for desktop mode
    return () => {
      gsap.killTweensOf(desktopEls);
      gsap.set(desktopEls, { clearProps: 'all' });
    };
  }
  return () => {
    gsap.killTweensOf([desktopEls]);
    gsap.set([desktopEls], { clearProps: 'all' });
  };
};

const scrollToFooter = () => {
  if (!showFooter.value) {
    const footerEl = document.getElementById('footer');
    if (!footerEl) return;
    const target = getScrollTarget(footerEl); // auto-detects the correct scrollable container
    const y = footerEl.offsetTop; // position inside that container
    setVerticalScrollPosition(target, y, 500); // smooth scroll (ms)
    showFooter.value = true;
  } else {
    const logoEl = document.getElementById('logo');
    if (!logoEl) return;
    const target = getScrollTarget(logoEl); // auto-detects the correct scrollable container
    const y = logoEl.offsetHeight; // position inside that container
    setVerticalScrollPosition(target, y, 500); // smooth scroll (ms)
    showFooter.value = false;
  }
};

const toPackages = (p: Package | null) => {
  if (p) mainStore.SET_PACKAGE_OF_INTEREST(p);
  mainStore.SET_ACTIVE_TOPIC(TopicName.Packages);
  expandedPanel.value = TopicName.Packages;
};
</script>

<template>
  <q-page class="page-container column items-center">
    <div class="logo">
      <img
        class="q-pt-sm"
        style="max-width: 65px"
        src="../assets/glkfreelance-logo.avif"
        alt="logo"
      />
      <span class="logo-text"
        ><span class="text-secondary">glk</span
        ><span class="text-primary-font text-white">Freelance</span></span
      >
    </div>
    <section v-if="isResponsive" ref="root" key="mobile" class="responsive-view full-width q-pa-md">
      <div
        class="home-container relative-position full-width column items-center text-center text-primary-font q-mb-sm q-pa-lg font-primary"
      >
        <p class="hero-kicker mobile-content">Motion UI for AI systems</p>
        <h1 class="mobile-content text-body-1 q-mb-none black-text-glow">
          Living, breathing interfaces that build trust in AI systems.
        </h1>
        <div ref="sepRef" class="mobile-content column full-width q-mt-md q-mb-md">
          <q-separator class="font-bold" color="primary"></q-separator>
        </div>
        <p
          class="hero-subheadline mobile-content text-white font-bold q-mt-sm q-mb-none text-center"
        >
          Motion and feedback that make complex AI feel clear, reliable, and alive.
        </p>
      </div>
      <div class="full-width">
        <q-btn @click="toPackages(null)" class="full-width" color="accent" size="lg" glossy>
          <span class="text-body-2">Hire Me for Your Next AI UI </span>
        </q-btn>
        <q-btn
          class="q-mt-xs q-mb-md full-width"
          text-color="primary"
          color="dark"
          size="lg"
          glossy
          href="https://www.loom.com/share/c78ed9a194174eeb8bd34989a4fb8ac9"
          target="_blank"
        >
          <span class="text-body-2">Watch the 90-Second Demo </span>
        </q-btn>
      </div>

      <q-list class="full-width font-primary">
        <q-item
          v-for="topic in mobileTopics"
          :key="topic.id"
          :id="topic.name"
          class="full-width bg-transparent q-pa-none q-mb-sm"
        >
          <q-expansion-item
            group="responsive-main-menu"
            :icon="topic.icon"
            :label="topic.label"
            :model-value="expandedPanel === topic.name"
            @after-show="
              () => {
                scrollToElement(topic.name);
                // expandedPanel = topic.name;
                mainStore.SET_ACTIVE_TOPIC(topic.name);
              }
            "
            @hide="
              () => {
                if (expandedPanel === topic.name) {
                  expandedPanel = null;
                  mainStore.SET_ACTIVE_TOPIC(null);
                }
              }
            "
            :header-class="['text-dark', 'bg-secondary']"
            class="expansion-item full-width"
            switch-toggle-side
          >
            <div v-if="expandedPanel === topic.name" class="anchor full-width">
              <div v-if="!activeEntry" class="text-white q-pa-md">
                <p>No active Topic - Error</p>
              </div>
              <Suspense v-else>
                <template #default>
                  <component
                    v-if="topic.name === TopicName.Packages"
                    :is="activeComponent"
                    @requestConsultation="toPackages"
                  />
                  <component
                    v-else-if="
                      topic.name === TopicName.About || topic.name === TopicName.CaseStudies
                    "
                    :is="activeComponent"
                    @toPackages="toPackages"
                  />
                  <component v-else-if="topic.name === TopicName.Contact" :is="activeComponent" />
                </template>

                <template #fallback>
                  <q-skeleton type="rect" height="100dvh" />
                </template>
              </Suspense>
            </div>
          </q-expansion-item>
        </q-item>
      </q-list>
    </section>
    <section
      v-if="!isResponsive"
      ref="root"
      key="desktop"
      class="desktop-view column justify-end items-center full-width"
    >
      <div ref="homeContainerRef" class="home-container q-pa-xl column">
        <div class="row no-wrap">
          <div ref="simonRef" class="simon"><SimonMenu></SimonMenu></div>
          <div
            v-if="!activeTopic"
            class="copy-container column justify-center items-center q-pa-md"
          >
            <div class="clip-container relative-position overflow-hidden">
              <p class="hero-kicker">Motion UI for AI systems</p>
              <h1 ref="headlineRef" class="full-width text-body-2 q-mb-lg q-pl-lg">
                Living, breathing interfaces that build trust in AI systems.
              </h1>
            </div>
            <div ref="sepRef" class="separator full-width">
              <q-separator color="primary"></q-separator>
            </div>
            <div class="u-grid u-grid-cols-2 u-gap-sm" ref="ctaBtnRef">
              <q-btn @click="toPackages(null)" class="q-mt-md" color="accent" size="lg" glossy>
                <span class="text-body-2">Packages</span>
              </q-btn>
              <q-btn
                class="q-mt-md"
                text-color="accent"
                color="secondary"
                size="lg"
                glossy
                target="_blank"
              >
                <span class="text-body-2">Proof</span>
              </q-btn>
            </div>
          </div>
        </div>

        <div
          ref="servRef"
          v-if="!activeTopic"
          class="hero-subheadline row q-mt-md q-pa-md wrap justify-center start-animation text-bold"
        >
          <i>Motion and feedback that make complex AI feel clear, reliable, and alive.</i>
        </div>
      </div>
      <q-btn
        id="showFooterBtn"
        round
        color="accent"
        :icon="!showFooter ? mdiChevronUp : mdiChevronDown"
        class="q-px-sm"
        @click="scrollToFooter"
        aria-label="Scroll to footer"
      />
    </section>
  </q-page>
</template>

<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

.page-container {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh; // safe viewport if supported

  .logo {
    display: none;
    position: absolute;
    top: 3%;
    left: 3%;
    z-index: 2;

    @media (min-width: tokens.$breakpoint-lg) {
      display: flex !important;
      align-items: center;
      z-index: 2;

      .logo-text {
        padding-left: 0.5rem;
        font-size: 1.5rem;
      }
    }
  }

  p:nth-of-type(1) {
    font-weight: bold;
    line-height: 2.2rem;
    text-transform: uppercase;
  }

  .home-container {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, tokens.$ink-soft 90%, tokens.$ivory 10%),
      tokens.$ink
    );

    border: 1px solid var(--q-accent);

    box-shadow:
      0 0 64px color-mix(in srgb, var(--q-accent) 38%, transparent),
      0 28px 80px color-mix(in srgb, tokens.$ink 90%, transparent);

    border-radius: 1rem;

    h1 {
      color: tokens.$text;
    }

    .hero-subheadline {
      color: tokens.$text-muted;
    }

    .hero-kicker {
      color: tokens.$champagne;
    }
  }

  /* ---------- Mobile / NotDesktop ---------- */

  .responsive-view {
    height: 100%;
    max-width: 600px;

    @media (min-width: tokens.$breakpoint-md) {
      max-width: 800px;
    }

    .home-container {
      border-radius: 0.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      padding: 1.5rem;

      h1 {
      }

      .hero-subheadline {
        font-size: 1.3rem;
        line-height: 2rem;
      }
    }
  }

  /* ---------- Desktop ---------- */

  .desktop-view {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100dvh;

    .home-container {
      position: relative;
      z-index: 2;
      margin-top: 4rem;
      max-width: 700px;

      .simon {
        width: 40%;
        min-width: 275px;
        max-width: 275px;
        /* no transform-origin/scale here; GSAP sets them */
      }

      .copy-container {
        width: 60%;

        .separator {
          width: 75%; /* GSAP handles opacity/transform */
        }
      }

      .hero-subheadline {
        position: relative;
        z-index: 1;
        font-size: 1.2rem;
        border-radius: 5px; /* GSAP handles opacity/transform */
      }

      .hero-subheadline::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        margin: -10px;
      }
    }

    #showFooterBtn {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
    }
  }
}

.panel-skeleton {
  /* match the typical height of your section so there's no CLS */
  height: clamp(320px, 60vh, 720px);
}
</style>
