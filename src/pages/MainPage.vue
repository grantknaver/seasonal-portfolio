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
  // mdiTruckDelivery,
  mdiInformationOutline,
  mdiEmailBox,
  mdiMagnify,
} from '@quasar/extras/mdi-v7';
import { mdiChevronDown } from '@quasar/extras/mdi-v7';
import { CacheEntry } from 'src/shared/constants/cacheEntry';
import { useCacheStore } from 'src/stores/component-cache';
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
  // {
  //   id: uuidv4(),
  //   name: TopicName.Packages,
  //   icon: mdiTruckDelivery,
  //   label: 'Packages',
  //   cachedName: CacheEntry.PackageSection,
  // },
  {
    id: uuidv4(),
    name: TopicName.Lens,
    icon: mdiMagnify,
    label: TopicName.Lens,
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

// const root = ref<HTMLElement | null>(null);
const showFooter = ref<boolean>(false);
const io = ref<IntersectionObserver | null>(null);

const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

const dispose = ref<() => void>(() => {});
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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      showFooter.value = entry.isIntersecting;
    });
  },
  { threshold: 0.1 },
);

const applyHomeScale = (animate = true) => {
  const el = currentHomeContainer.value;
  if (!el) return;

  gsap.killTweensOf(el);

  if (isResponsive.value) {
    gsap.set(el, {
      clearProps: 'transform',
    });
    return;
  }

  const shouldScale = !!activeTopic.value;
  const nextScale = shouldScale ? 0.8 : 1;

  if (!animate) {
    gsap.set(el, {
      scale: nextScale,
      transformOrigin: 'center center',
    });
    return;
  }

  gsap.to(el, {
    scale: nextScale,
    transformOrigin: 'center center',
    duration: shouldScale ? 0.8 : 0.6,
    ease: 'power2.out',
    overwrite: true,
  });
};

const handleResize = () => {
  requestAnimationFrame(() => {
    applyHomeScale(false);
  });
};

const mobileRootRef = ref<HTMLElement | null>(null);
const desktopRootRef = ref<HTMLElement | null>(null);

const mobileHomeContainerRef = ref<HTMLElement | null>(null);
const desktopHomeContainerRef = ref<HTMLElement | null>(null);

const currentRoot = computed(() => {
  return isResponsive.value ? mobileRootRef.value : desktopRootRef.value;
});

const currentHomeContainer = computed(() => {
  return isResponsive.value ? mobileHomeContainerRef.value : desktopHomeContainerRef.value;
});

onMounted(async () => {
  const footerElement = document.getElementById('footer');

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

  if (footerElement) {
    observer.observe(footerElement);
  }

  window.addEventListener('resize', handleResize);

  requestAnimationFrame(() => {
    applyHomeScale(false);
  });

  await mainStore.VERIFY_IS_HUMAN();
});

onUnmounted(() => {
  cacheStore.CLEAR_CACHE();
});

onBeforeUnmount(() => {
  io.value?.disconnect();
  observer.disconnect();
  window.removeEventListener('resize', handleResize);

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
    await waitForLayout(currentRoot.value);

    dispose.value = buildAnimations(viewNow ? ViewType.Responsive : ViewType.Desktop, false);

    requestAnimationFrame(() => {
      applyHomeScale(false);
    });
  },
  { flush: 'post' },
);

watch(
  activeTopic,
  async (newTopic: TopicName | null) => {
    expandedPanel.value = newTopic;

    await nextTick();

    applyHomeScale(true);
  },
  { flush: 'post' },
);

const waitForLayout = async (el: HTMLElement | null, frames = 8): Promise<boolean> => {
  if (!el) return false;

  for (let i = 0; i < frames; i++) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    if (el.offsetParent !== null && el.offsetHeight > 0 && el.offsetWidth > 0) {
      mainStore.SET_PAINTED_STATUS(true);
      return true;
    }
  }

  mainStore.SET_PAINTED_STATUS(false);
  return false;
};

const buildAnimations = (mode: ViewType, animate = true) => {
  const el = currentRoot.value;
  if (!el) return () => {};

  const kickerEl = el.querySelector<HTMLElement>('.kicker');
  const simonEl = el.querySelector<HTMLElement>('.simon');
  const headlineEl = el.querySelector<HTMLElement>('.headline');
  const subheadlineEl = el.querySelector<HTMLElement>('.subheadline');
  const ctaEls = Array.from(el.querySelectorAll<HTMLElement>('.cta'));
  const proofEls = Array.from(el.querySelectorAll<HTMLElement>('.proof-card'));

  const els = [kickerEl, simonEl, headlineEl, subheadlineEl, ...ctaEls, ...proofEls].filter(
    (x): x is HTMLElement => !!x,
  );

  if (!els.length) return () => {};

  gsap.killTweensOf(els);
  gsap.set(els, { clearProps: 'all' });

  // Resize / breakpoint swap path:
  // do not replay the entrance timeline, just clear stuck GSAP props
  // and leave the new layout in its natural visible state.
  if (!animate) {
    return () => {
      gsap.killTweensOf(els);
      gsap.set(els, { clearProps: 'all' });
    };
  }

  const tl = gsap.timeline();

  if (mode === ViewType.Responsive) {
    if (kickerEl) {
      tl.fromTo(
        kickerEl,
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.65,
          overwrite: 'auto',
        },
        0,
      );
    }

    if (headlineEl) {
      tl.fromTo(
        headlineEl,
        { y: 75, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 1.25,
          overwrite: 'auto',
        },
        0.15,
      );
    }

    if (subheadlineEl) {
      tl.fromTo(
        subheadlineEl,
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 1.25,
        },
        '-=0.25',
      );
    }

    if (ctaEls.length) {
      tl.fromTo(
        ctaEls,
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 3,
          stagger: 0.25,
        },
        '-=1',
      );
    }

    if (proofEls.length) {
      tl.fromTo(
        proofEls,
        {
          y: 32,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.5,
          stagger: 0.18,
        },
        '-=2.25',
      );
    }
  }

  if (mode === ViewType.Desktop) {
    if (kickerEl) {
      tl.fromTo(
        kickerEl,
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.65,
          overwrite: 'auto',
        },
        0,
      );
    }

    if (headlineEl) {
      tl.fromTo(
        headlineEl,
        { y: 75, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 1.25,
          overwrite: 'auto',
        },
        0.15,
      );
    }

    if (subheadlineEl) {
      tl.fromTo(
        subheadlineEl,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 1.25,
        },
        '-=0.25',
      );
    }

    if (ctaEls.length) {
      tl.fromTo(
        ctaEls,
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 1,
          stagger: 0.25,
        },
        '-=1',
      );
    }

    if (proofEls.length) {
      tl.fromTo(
        proofEls,
        {
          x: -16,
          autoAlpha: 0,
        },
        {
          x: 0,
          autoAlpha: 1,
          ease: 'power2.out',
          duration: 0.45,
          stagger: 0.18,
        },
        '-=0.15',
      );
    }
  }

  return () => {
    tl.kill();
    gsap.killTweensOf(els);
    gsap.set(els, { clearProps: 'all' });
  };
};

const scrollToFooter = () => {
  if (!showFooter.value) {
    const footerEl = document.getElementById('footer');
    if (!footerEl) return;

    const target = getScrollTarget(footerEl);
    const y = footerEl.offsetTop;

    setVerticalScrollPosition(target, y, 500);
    showFooter.value = true;
  } else {
    const logoEl = document.getElementById('logo');
    if (!logoEl) return;

    const target = getScrollTarget(logoEl);
    const y = logoEl.offsetHeight;

    setVerticalScrollPosition(target, y, 500);
    showFooter.value = false;
  }
};

// const toPackages = (p: Package | null) => {
//   if (p) mainStore.SET_PACKAGE_INTEREST_TEXT(p);

//   mainStore.SET_ACTIVE_TOPIC(TopicName.Packages);
//   expandedPanel.value = TopicName.Packages;
// };

const toContact = () => {
  mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);
  expandedPanel.value = TopicName.Contact;
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
    <section v-show="isResponsive" ref="mobileRootRef" class="responsive-view full-width q-pa-md">
      <div
        ref="mobileHomeContainerRef"
        class="home-container relative-position full-width column text-primary-font q-mt-md q-mb-md q-pa-lg font-primary"
      >
        <div class="mobile-hero-copy text-center">
          <p ref="kickerRef" class="text-caption kicker mobile-content q-mt-none q-mb-sm">
            Focused UI Motion + AI Interaction
          </p>

          <h1 class="headline mobile-content text-h1 q-mt-none q-mb-md">
            Build Clarity. Earn Trust. Create Momentum.
          </h1>

          <div class="subheadline mobile-content q-mt-md start-animation">
            <p class="q-ma-none text-body-2">
              Premium motion, AI interaction, and section-level implementation for platforms that
              need sharper user flow.
            </p>
          </div>
        </div>

        <div class="u-grid u-gap-sm full-width q-mt-md mobile-content">
          <q-btn class="cta" @click="toContact()" color="accent" size="lg" glossy>
            <span class="text-body-2">Get a review</span>
          </q-btn>
        </div>

        <div class="proofs mobile-content full-width q-mt-lg">
          <div class="proof-card">
            <span class="proof-label">MORE INQUIRIES</span>
            <strong>Clearer paths from interest to contact.</strong>
          </div>

          <div class="proof-card">
            <span class="proof-label">TRUST</span>
            <strong>Help people understand, trust, and move forward.</strong>
          </div>

          <div class="proof-card">
            <span class="proof-label">LESS FRICTION</span>
            <strong>Smooth the moments where users hesitate, stall, or drop off.</strong>
          </div>
        </div>
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
                    v-if="topic.name === TopicName.Contact"
                    :is="activeComponent"
                    @requestConsultation="toContact"
                  />
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
      v-show="!isResponsive"
      ref="desktopRootRef"
      class="desktop-view column justify-end items-center full-width"
    >
      <div ref="desktopHomeContainerRef" class="home-container q-pa-xl column">
        <div class="simon-copy">
          <div ref="simonRef" class="simon"><SimonMenu></SimonMenu></div>
          <div class="column justify-center">
            <div class="relative-position overflow-hidden">
              <p ref="kickerRef" class="text-caption kicker q-mt-none q-mb-sm">
                Focused UI Motion + AI Interaction
              </p>
              <h1 ref="headlineRef" class="headline text-h1 full-width q-mt-none q-mb-none">
                Build Clarity. Earn Trust. Create Momentum.
              </h1>
              <div ref="servRef" class="text-lead subheadline q-mt-md start-animation">
                <p class="q-ma-none text-body-2">
                  Premium motion, AI interaction, and section-level implementation for platforms
                  that need sharper user flow.
                </p>
              </div>
            </div>
            <div class="u-grid u-grid-cols-2 u-gap-sm">
              <q-btn @click="toContact()" class="cta q-mt-md" color="accent" size="lg" glossy>
                <span class="text-body-2">Get a review</span>
              </q-btn>
            </div>
          </div>
        </div>
        <div class="proofs q-mt-xl">
          <div class="proof-card">
            <span class="proof-label">MORE INQUIRIES</span>
            <strong>Clearer paths from interest to contact.</strong>
          </div>

          <div class="proof-card">
            <span class="proof-label">BETTER DECISIONS</span>
            <strong>Help people understand, trust, and move forward.</strong>
          </div>

          <div class="proof-card">
            <span class="proof-label">LESS FRICTION</span>
            <strong>Smooth the moments where users hesitate, stall, or drop off.</strong>
          </div>
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

    .kicker {
      color: tokens.$champagne;
      text-transform: uppercase;
    }

    h1 {
      color: tokens.$text;
      line-height: 1.16;
      letter-spacing: -0.025em;
      font-weight: 400;
      text-wrap: balance;
    }

    .subheadline {
      color: tokens.$text-muted;
    }

    .proofs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.75rem;

      .proof-card {
        padding: 0.85rem 1rem;
        border: 1px solid color-mix(in srgb, var(--q-accent) 38%, transparent);

        border-radius: 0.75rem;
        background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);
        box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);

        .proof-label {
          display: block;
          margin-bottom: 0.25rem;
          color: tokens.$champagne;
          font-size: 0.72rem;
          line-height: 1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 700;
        }

        strong {
          display: block;
          color: tokens.$text-muted;
          font-size: 0.85rem;
          line-height: 1.25;
          font-weight: 600;
        }
      }
    }

    .proof-card strong {
      display: block;
      color: tokens.$text-muted;
      font-size: 0.85rem;
      line-height: 1.25;
      font-weight: 600;
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
      border-radius: 1rem;
      padding: 1.5rem;

      .mobile-hero-copy {
        max-width: 34rem;
        margin-inline: auto;
      }

      h1 {
        max-width: 26rem;
        margin-inline: auto;
      }

      .subheadline {
        max-width: 32rem;
        margin-inline: auto;
        line-height: 1.5;
      }

      .proofs {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .proof-card {
        text-align: left;
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
      margin-top: 3rem;
      max-width: 760px;

      .simon-copy {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 2rem;

        .simon {
          min-width: 250px;
          max-width: 250px;
        }
      }

      .subheadline {
        position: relative;
        z-index: 1;
        border-radius: 5px;
        line-height: 1rem;
      }

      .subheadline::before {
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
  height: clamp(320px, 60vh, 720px);
}
</style>
