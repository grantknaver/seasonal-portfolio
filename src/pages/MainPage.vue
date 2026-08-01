<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, computed, onMounted, onUnmounted } from 'vue';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import { TopicName } from '../shared/constants/topicName';
import SimonMenu from '../components/SimonMenu.vue';
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
import ScrollCue from '../components/ScrollCue.vue';

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
const { activeTopic } = storeToRefs(mainStore);
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

const lockScroll = () => {
  const stop = (e: Event) => e.preventDefault();
  const stopKeys = (e: KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'].includes(e.code)) {
      e.preventDefault();
    }
  };
  window.addEventListener('wheel', stop, { passive: false });
  window.addEventListener('touchmove', stop, { passive: false });
  window.addEventListener('keydown', stopKeys);

  return () => {
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchmove', stop);
    window.removeEventListener('keydown', stopKeys);
  };
};

const claritySectionRef = ref<HTMLElement | null>(null);
const homeContainerRef = ref<HTMLElement | null>(null);
const trustSectionRef = ref<HTMLElement | null>(null);
const trustGlowRef = ref<HTMLElement | null>(null);
const trustImageA = ref<HTMLElement | null>(null);
const trustImageB = ref<HTMLElement | null>(null);
const trustCopyA = ref<HTMLElement | null>(null);
const trustCopyB = ref<HTMLElement | null>(null);
const clarityCueRef = ref<HTMLElement | null>(null);
const trustCueRef = ref<HTMLElement | null>(null);

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

    if (isResponsive.value) return;

    if (claritySectionRef.value) {
      ScrollTrigger.create({
        trigger: claritySectionRef.value,
        start: 'top top',
        end: '+=3000',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });
    }

    if (clarityCueRef.value) {
      gsap.to(clarityCueRef.value, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { start: 0, end: 3000, scrub: true },
      });
    }

    const section = trustSectionRef.value;
    const imgA = trustImageA.value;
    const imgB = trustImageB.value;
    const copyA = trustCopyA.value;
    const copyB = trustCopyB.value;
    const glow = trustGlowRef.value;

    if (section && imgA && imgB && copyA && copyB && glow) {
      gsap.set(imgB, { opacity: 0 });
      gsap.set(glow, { opacity: 0, scale: 1.18 });
      gsap.set([copyA, copyB], { opacity: 0 });

      const cue = trustCueRef.value;
      gsap.set(cue, { opacity: 0 });

      const introTl = gsap
        .timeline({ paused: true })
        .to(glow, { opacity: 1, scale: 1, duration: 1.25, ease: 'power2.out' }, 0)
        .to(copyA, { opacity: 1, duration: 1.4, ease: 'power1.out' }, 1.4)
        .to(cue, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 2.6);

      let introPlayed = false;

      const trustTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=2800',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          onEnter: () => {
            if (introPlayed) return;
            introPlayed = true;
            const unlock = lockScroll();
            introTl.eventCallback('onComplete', unlock);
            introTl.play();
          },
        },
      });

      trustTl
        .to(cue, { opacity: 0, ease: 'none', duration: 0.4 }, 1.4)
        .to(copyA, { opacity: 0, ease: 'none', duration: 0.9 }, 1.5)
        .to(imgA, { opacity: 0, ease: 'none', duration: 0.8 }, 2.2)
        .to(imgB, { opacity: 1, ease: 'none', duration: 0.8 }, 2.2)
        .to(copyB, { opacity: 1, ease: 'none', duration: 1.1 }, 2.5)
        .to(glow, { opacity: 0, scale: 1.25, ease: 'none', duration: 0.9 }, 3.6);
    }

    ScrollTrigger.refresh();
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
    await nextTick();
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
  <q-page class="page-container">
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

          <div class="hero-copy column justify-center q-pa-lg">
            <p class="text-caption kicker q-mt-none q-mb-sm">Focused UI Motion + AI Interaction</p>

            <h1 class="headline text-h1 q-mt-none q-mb-md">BRING YOUR STORY INTO FOCUS.</h1>

            <div class="subheadline q-mt-md">
              <p class="q-ma-none">
                Make it clear. What sets you apart. What value you bring. Why you deserve trust.
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
            <span class="proof-label text-caption">VALUE UNDERSTOOD</span>
          </div>
          <div class="proof-card">
            <span class="proof-label text-caption"> DIFFERENCE SEEN</span>
          </div>
          <div class="proof-card">
            <span class="proof-label text-caption">NEXT STEP CLEAR</span>
          </div>
        </div>
      </div>
      <div ref="clarityCueRef" class="clarity-cue"><ScrollCue color="accent" /></div>
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
    <div class="section-transition"></div>
    <section ref="trustSectionRef" class="trust-section">
      <div class="trust-viewport">
        <div ref="trustImageA" class="trust-image-wrap">
          <img src="../assets/trust-breathing-in.avif" alt="" class="trust-image" />
        </div>

        <div ref="trustImageB" class="trust-image-wrap">
          <img src="../assets/trust-breathing-out.avif" alt="" class="trust-image" />
        </div>

        <div ref="trustCopyA" class="trust-copy">
          <p>Clarity helps people decide.</p>
        </div>

        <div ref="trustCopyB" class="trust-copy">
          <p>Trust helps them breathe.</p>
        </div>
        <div ref="trustGlowRef" class="trust-glow" aria-hidden="true"></div>
        <div ref="trustCueRef" class="trust-cue"><ScrollCue color="primary" /></div>
        <div class="trust-frame" aria-hidden="true">
          <span class="trust-corner trust-corner--tl"></span>
          <span class="trust-corner trust-corner--tr"></span>
          <span class="trust-corner trust-corner--bl"></span>
          <span class="trust-corner trust-corner--br"></span>
          <span class="trust-signal"></span>
        </div>
      </div>
      <div v-if="!isResponsive" class="trust-nav">
        <SimonMenu :layout="'row'" />
      </div>
    </section>
  </q-page>
</template>

<style scoped lang="scss">
@use '../css/tokens' as tokens;

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

  /* ---------- Clarity ---------- */

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

    .clarity-cue {
      display: none;
      color: tokens.$text-muted;

      @media (min-width: tokens.$breakpoint-lg) {
        display: block;
        position: relative;
        z-index: 2;
      }
    }
  }

  /* ---------- Card ---------- */

  .home-container {
    position: relative;
    z-index: 2;
    margin-inline: auto;
    margin-bottom: 1rem;
    padding: 1.5rem;

    text-align: center;
    background-color: transparent;
    box-shadow: none;

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
      background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);
      box-shadow:
        0 0 64px color-mix(in srgb, var(--q-accent) 38%, transparent),
        0 28px 80px color-mix(in srgb, var(--q-accent) 38%, transparent);
      border: 1px solid var(--q-accent);
      border-radius: 1rem;
    }

    .subheadline {
      max-width: 32rem;
      margin-inline: auto;
      color: tokens.$text-muted;
      line-height: 1.5;
    }

    .cta-wrap {
      display: grid;
      grid-template-columns: 1fr;
    }

    .proofs {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .proof-card {
      padding: 1.5rem;
      border: 1px solid color-mix(in srgb, var(--q-accent) 38%, transparent);
      background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);
      box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);
      text-align: left;

      .proof-label {
        display: block;
        text-align: center;
        color: tokens.$champagne;
        line-height: 1;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 300;
      }

      strong {
        display: block;
        color: tokens.$text-muted;
        font-size: 0.85rem;
        line-height: 1.25;
        font-weight: 600;
      }

      @media (min-width: tokens.$breakpoint-lg) {
        border-radius: 5px;
      }
    }

    /* ---------- Desktop ---------- */

    @media (min-width: tokens.$breakpoint-lg) {
      max-width: 760px;
      margin-top: 3rem;
      margin-bottom: 0;
      padding: 2rem;
      text-align: left;

      transition:
        max-width 0.5s ease,
        padding 0.5s ease,
        transform 0.5s ease;

      .simon {
        display: flex;
        align-items: center;
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
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
      }

      /* ---------- Drawer open ---------- */

      &.is-collapsed {
        max-width: max-content;
        padding: 1rem;
        transform: translateX(calc(var(--panel-offset, 0px) / -2));

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

  .section-transition {
    position: relative;
    z-index: 1;
    height: 80px;
    width: 100%;
    background: radial-gradient(
      120% 260% at 50% 100%,
      var(--q-accent) 0%,
      color-mix(in srgb, var(--q-dark) 88%, var(--q-accent) 12%) 38%
    );
    filter: drop-shadow(0px 3px 3px var(--q-accent));
  }

  /* ---------- Trust ---------- */

  .trust-section {
    position: relative;
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: url('../assets/trust-section-background.avif');

    .trust-viewport {
      position: absolute;
      top: clamp(5.4rem, 10.8vh, 8.4rem);
      right: clamp(8.2rem, 13.8vw, 13.2rem);
      bottom: clamp(4.2rem, 8.4vh, 7.2rem);
      left: clamp(8rem, 13.8vw, 16.2rem);
      overflow: hidden;
      border-radius: 1.25rem;
      background-color: black;
    }

    .trust-image-wrap {
      position: absolute;
      inset: 0;
      will-change: opacity;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
        backdrop-filter: blur(7px) saturate(0.88);
        -webkit-backdrop-filter: blur(7px) saturate(0.88);
        mask-image: radial-gradient(110% 82% at 58% 48%, transparent 26%, #000 76%);
        -webkit-mask-image: radial-gradient(110% 82% at 58% 48%, transparent 26%, #000 76%);
        pointer-events: none;
      }

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        background:
          radial-gradient(
            118% 90% at 60% 46%,
            rgba(13, 71, 161, 0) 50%,
            rgba(13, 71, 161, 0.035) 70%,
            rgba(11, 31, 59, 0.07) 88%,
            rgba(11, 31, 59, 0.11) 100%
          ),
          linear-gradient(
            to bottom,
            rgba(11, 31, 59, 0.12) 0%,
            rgba(13, 71, 161, 0.07) 6%,
            rgba(187, 222, 251, 0.04) 13%,
            transparent 22%,
            transparent 78%,
            rgba(187, 222, 251, 0.04) 87%,
            rgba(13, 71, 161, 0.07) 94%,
            rgba(11, 31, 59, 0.12) 100%
          ),
          linear-gradient(
            to right,
            rgba(11, 31, 59, 0.12) 0%,
            rgba(13, 71, 161, 0.07) 5%,
            rgba(187, 222, 251, 0.035) 11%,
            transparent 18%,
            transparent 82%,
            rgba(187, 222, 251, 0.035) 89%,
            rgba(13, 71, 161, 0.07) 95%,
            rgba(11, 31, 59, 0.12) 100%
          );
      }
    }

    .trust-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(0.84) contrast(0.94) brightness(1.01) hue-rotate(3deg);
    }

    .trust-copy {
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-inline: 2rem;
      text-align: center;
      color: tokens.$ivory;
      font-size: clamp(1.75rem, 4vw, 3.25rem);
      line-height: 1.2;
      will-change: transform, opacity;
      text-shadow: 2px 2px 10px var(--q-dark);

      p {
        margin: 0;
        max-width: 24rem;
      }
    }

    .trust-glow {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      opacity: 0;
      border-radius: 1.25rem;
      will-change: opacity, transform;
      background: none;
      box-shadow:
        inset 0 0 70px 10px rgba($dark, 0.8),
        inset 0 0 160px 110px rgba($accent-deep, 0.4);
    }

    .trust-frame {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
      border: 5px solid var(--q-accent);
      border-radius: 1.25rem;
    }

    .trust-corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 0 solid rgba(255, 255, 255, 0.32);

      &--tl {
        top: -1px;
        left: -1px;
        border-top-width: 1.5px;
        border-left-width: 1.5px;
        border-top-left-radius: 1.25rem;
      }
      &--tr {
        top: -1px;
        right: -1px;
        border-top-width: 5vw;
        border-right-width: 5vw;
        border-top-right-radius: 1.25rem;
      }
      &--bl {
        bottom: -1px;
        left: -1px;
        border-bottom-width: 1.5px;
        border-left-width: 1.5px;
        border-bottom-left-radius: 1.25rem;
      }
      &--br {
        bottom: -1px;
        right: -1px;
        border-bottom-width: 5vw;
        border-left-width: 5vw;
        // border-bottom-left-radius: 1.25rem;
      }
    }

    .trust-signal {
      position: absolute;
      top: 5%;
      left: 2%;
      display: block;
      width: 92px;
      height: 6px;

      &::before {
        // Circle
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--q-accent);
      }

      &::after {
        content: '';
        position: absolute;
        top: 2.5px;
        left: 11px;
        width: 150px;
        height: 1px;
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.15) 55%,
          rgba(255, 255, 255, 0) 100%
        );
      }
    }

    .trust-nav {
      position: absolute;
      bottom: clamp(0.75rem, 2vh, 1.75rem);
      left: calc(50% - var(--panel-offset, 0px) / 2);
      transform: translateX(-50%);
      z-index: 4;
      width: max-content;
      transition: left 0.32s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .trust-cue {
      position: absolute;
      bottom: 30%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      opacity: 0;
      color: tokens.$ivory;
    }
  }
}

.panel-skeleton {
  height: clamp(320px, 60vh, 720px);
}
</style>
