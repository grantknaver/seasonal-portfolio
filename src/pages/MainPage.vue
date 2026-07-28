<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, computed, onMounted, onUnmounted } from 'vue';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import { TopicName } from '../shared/constants/topicName';
import SimonMenu from '../components/SimonMenu.vue';
// import { scroll } from 'quasar';
import { ViewType } from '../shared/constants/viewType';
import { useViewport } from '../shared/utils/viewWidth';
import {
  // mdiChevronUp,
  mdiInformationOutline,
  mdiEmailBox,
  mdiMagnify,
  mdiViewGalleryOutline,
} from '@quasar/extras/mdi-v7';
// import { mdiChevronDown } from '@quasar/extras/mdi-v7';
import { CacheEntry } from 'src/shared/constants/cacheEntry';
import { useCacheStore } from 'src/stores/component-cache';
import { scrollToElement } from 'src/shared/utils/scrollToElement';
import { CacheBinding } from 'src/shared/constants/cacheBinding';
import ClarityBackground from 'src/components/ClarityBackground.vue';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
gsap.registerPlugin(ScrollTrigger);
const mainStore = useMainStore();
const cacheStore = useCacheStore();
const mobileTopics: Topic[] = [
  {
    id: uuidv4(),
    name: TopicName.Lens,
    icon: mdiMagnify,
    label: TopicName.Lens,
    cachedName: CacheEntry.PackageSection,
  },
  {
    id: uuidv4(),
    name: TopicName.Examples,
    icon: mdiViewGalleryOutline,
    label: TopicName.Examples,
    cachedName: CacheEntry.ExamplesSection,
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
// const { getScrollTarget, setVerticalScrollPosition } = scroll;
const { activeTopic } = storeToRefs(mainStore);
const showFooter = ref<boolean>(false);
const io = ref<IntersectionObserver | null>(null);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const dispose = ref<() => void>(() => {});
let pinST: ScrollTrigger | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

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
  console.log('animate', animate);
  const el = homeContainerRef.value;
  if (!el) return;

  gsap.killTweensOf(el);
  gsap.set(el, { clearProps: 'transform' });
};

const handleResize = () => {
  requestAnimationFrame(() => {
    applyHomeScale(false);
  });
};

const claritySectionRef = ref<HTMLElement | null>(null);
const homeContainerRef = ref<HTMLElement | null>(null);
// const trustSectionRef = ref<HTMLElement | null>(null);

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
    if (!isResponsive.value) {
      pinST = ScrollTrigger.create({
        trigger: claritySectionRef.value,
        start: 'top top',
        end: '+=600',
        pin: true,
        pinSpacing: true,
      });
    }
  });

  await mainStore.VERIFY_IS_HUMAN();
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
  ScrollTrigger.getAll().forEach((st) => st.kill());

  if (refreshTimer) clearTimeout(refreshTimer);
});

onUnmounted(() => {
  cacheStore.CLEAR_CACHE();
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
    await waitForLayout(homeContainerRef.value);

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

    if (!isResponsive.value) {
      if (newTopic) {
        window.scrollTo(0, 0);
        pinST?.disable(true);
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        refreshTimer = setTimeout(() => {
          pinST?.enable();
          ScrollTrigger.refresh();
        }, 400);
      }
    }

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
  const el = claritySectionRef.value;
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

const toContact = () => {
  mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);
  expandedPanel.value = TopicName.Contact;
};
</script>

<template>
  <q-page class="page-container column items-center">
    <div class="logo">
      <span class="logo-text">
        <i class="glk text-accent">glk</i><span class="freelance text-dark">Freelance</span>
      </span>
    </div>

    <section class="clarity-background" :class="{ 'is-collapsed': !!activeTopic }">
      <ClarityBackground />
    </section>

    <div ref="claritySectionRef" class="clarity-section full-width q-pa-md">
      <div
        ref="homeContainerRef"
        class="home-container column q-pa-lg font-primary"
        :class="{ 'is-collapsed': !!activeTopic }"
      >
        <div class="simon-copy">
          <div class="simon"><SimonMenu /></div>

          <div class="hero-copy column justify-center">
            <p class="text-caption kicker q-mt-none q-mb-sm">Focused UI Motion + AI Interaction</p>

            <h1 class="headline text-h1 q-mt-none q-mb-md">
              Build Clarity. Earn Trust. Create Momentum.
            </h1>

            <div class="subheadline q-mt-md">
              <p class="q-ma-none text-body-2">
                I review websites, product surfaces, and AI interactions to identify where clarity,
                trust, momentum, or AI legibility can be improved through focused implementation.
              </p>
            </div>

            <div class="cta-wrap q-mt-md">
              <q-btn class="cta" @click="toContact()" color="accent" size="lg" glossy>
                <span class="text-body-2">LET’S TALK</span>
              </q-btn>
            </div>
          </div>
        </div>

        <div class="proofs q-mt-lg">
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

      <q-list v-if="isResponsive" class="full-width font-primary">
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
                  <component :is="activeComponent" />
                </template>
                <template #fallback>
                  <q-skeleton type="rect" height="100dvh" />
                </template>
              </Suspense>
            </div>
          </q-expansion-item>
        </q-item>
      </q-list>
    </div>

    <section ref="trustSectionRef" class="trust-section">
      <!-- trust markup, unchanged -->
    </section>
  </q-page>
</template>

<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

.page-container {
  position: relative;
  min-height: 100vh;
  background: color-mix(in srgb, var(--q-accent) 5%, transparent);

  .logo {
    display: none;
    position: fixed;
    top: 2%;
    left: 2%;
    z-index: 2;

    @media (min-width: tokens.$breakpoint-lg) {
      display: flex !important;
      align-items: center;

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
  }

  .clarity-background {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: #f7f9fe;
    overflow: hidden;

    &.is-collapsed {
      filter: blur(4px);
    }
  }

  /* ---------- Section wrapper ---------- */

  .clarity-section {
    width: 100%;
    max-width: 600px;

    @media (min-width: tokens.$breakpoint-md) {
      max-width: 800px;
    }

    @media (min-width: tokens.$breakpoint-lg) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100dvh;
      max-width: none;
    }
  }

  /* ---------- Card ---------- */

  .home-container {
    position: relative;
    z-index: 2;
    margin-inline: auto;
    padding: 1.5rem;
    border: 1px solid var(--q-accent);
    border-radius: 1rem;
    text-align: center;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, tokens.$ink-soft 90%, tokens.$ivory 10%),
      tokens.$ink
    );
    box-shadow:
      0 0 64px color-mix(in srgb, var(--q-accent) 38%, transparent),
      0 28px 80px color-mix(in srgb, var(--q-accent) 38%, transparent);

    .simon {
      display: none;
    }

    .kicker {
      color: tokens.$champagne;
      text-transform: uppercase;
    }

    h1 {
      max-width: 26rem;
      margin-inline: auto;
      color: tokens.$text;
      line-height: 1.16;
      letter-spacing: -0.025em;
      font-weight: 400;
      text-wrap: balance;
    }

    .hero-copy {
      max-width: 34rem;
      margin-inline: auto;
    }

    .subheadline {
      max-width: 32rem;
      margin-inline: auto;
      color: tokens.$text-muted;
      line-height: 1.5;
    }

    .proofs {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .proof-card {
      padding: 0.85rem 1rem;
      border: 1px solid color-mix(in srgb, var(--q-accent) 38%, transparent);
      border-radius: 0.75rem;
      background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);
      box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);
      text-align: left;

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

    /* ---------- Desktop ---------- */

    @media (min-width: tokens.$breakpoint-lg) {
      max-width: 760px;
      margin-top: 3rem;
      padding: 2rem;
      text-align: left;
      transition:
        max-width 0.5s ease,
        padding 0.5s ease;

      .simon {
        display: block;
        min-width: 250px;
        max-width: 250px;
      }

      .simon-copy {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 2rem;
      }

      .hero-copy,
      h1,
      .subheadline {
        max-width: none;
        margin-inline: 0;
      }

      .subheadline {
        line-height: 1.35;
      }

      .proofs {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .cta-wrap {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
      }

      /* ---------- Drawer open ---------- */

      &.is-collapsed {
        max-width: max-content;
        padding: 1rem;

        .simon-copy {
          grid-template-columns: 1fr;
          row-gap: 1rem;
        }

        .kicker,
        h1,
        .subheadline,
        .proofs {
          display: none;
        }

        .cta-wrap {
          grid-template-columns: 1fr;
          margin-top: 0;
        }

        .cta {
          width: 100%;
        }
      }
    }
  }
}

.panel-skeleton {
  height: clamp(320px, 60vh, 720px);
}
</style>
