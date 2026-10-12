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
  mdiInformationOutline,
  mdiEmailBox,
  mdiMagnify,
  mdiViewGalleryOutline,
} from '@quasar/extras/mdi-v7';
import { CacheEntry } from 'src/shared/constants/cacheEntry';
import { useCacheStore } from 'src/stores/component-cache';
import { scrollToElement } from 'src/shared/utils/scrollToElement';
import { CacheBinding } from 'src/shared/constants/cacheBinding';
import ClarityBackground from 'src/components/ClarityBackground.vue';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import ScrollCue from '../components/ScrollCue.vue';
import LoomIntro from '../components/LoomIntro.vue';
import ClosingSection from '../components/ClosingSection.vue';
import { INTRO_LOOM_URL } from '../shared/constants/loom';
import { openTeardownBooking } from 'src/shared/constants/booking';

gsap.registerPlugin(ScrollTrigger);
/* No auto-refresh on window 'load'. On a cold (uncached) visit 'load' fires
   while the hero is still animating, and a refresh reverts + rebuilds the
   hero's pin-spacer mid-tween — that's the first-visit-only stutter. We
   refresh ourselves once the hero has finished instead (see onMounted). */
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,resize',
});

/* Flip to true to log the exact timeline position of every dropped frame. */
const DEBUG_JANK = false;
if (DEBUG_JANK) {
  gsap.ticker.lagSmoothing(0);
  const t0 = performance.now();
  const at = () => `${((performance.now() - t0) / 1000).toFixed(2)}s`;
  (window as Window & { __jankAt?: () => string }).__jankAt = at;
  /* Anything that blocks the main thread for 50ms+ — this is what stutters an animation. */
  try {
    new PerformanceObserver((list) => {
      list
        .getEntries()
        .forEach((e) => console.warn(`[longtask] ${e.duration.toFixed(0)}ms @ ${at()}`));
    }).observe({ type: 'longtask', buffered: true });
  } catch {
    /* unsupported */
  }
  window.addEventListener('load', () => console.warn(`[page] load event @ ${at()}`));
}

/* ---------- Trust intro choreography (desktop) ----------
   Tune these four numbers to retime the whole pinned entrance. */
const VIEWPORT_DROP = 40; // px the framed viewport rests below its final position
const NAV_AT = 0.85; // when the menu buttons start popping in
const COPY_AT = 1.2; // when the first line of copy starts
const COPY_STAGGER = 0.2; // gap between each line, top to bottom
const INTRO_START = 'top 75%'; // trust intro starts when the section is a quarter of the way into view
const INTRO_SPEED = 1.25; // trust intro playback speed while the section rises
const INTRO_CATCH_UP = 2.6; // ...and if the pin engages before it's finished
const PIN_HOLD = 0.6; // opening hold of the trust pin, in timeline units (~300px of scroll)

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
const isMobileView = computed(() => width.value < 600);
const isTabletView = computed(() => width.value >= 600 && width.value < lgBreakpoint);

/* ---------- Refs ---------- */

const claritySectionRef = ref<HTMLElement | null>(null);
const homeContainerRef = ref<HTMLElement | null>(null);
const trustSectionRef = ref<HTMLElement | null>(null);
const trustViewportRef = ref<HTMLElement | null>(null);
const trustNavRef = ref<HTMLElement | null>(null);
const railRef = ref<HTMLElement | null>(null);
/* The rail lines up with the left edge of the glkFreelance logo. */
const railLeft = ref<string | undefined>(undefined);
const measureRail = () => {
  const logo = [...document.querySelectorAll<HTMLElement>('.logo-text')].find(
    (el) => el.getBoundingClientRect().width > 0,
  );
  railLeft.value = logo ? `${Math.round(logo.getBoundingClientRect().left)}px` : undefined;
};
const trustGlowRef = ref<HTMLElement | null>(null);
const trustImageA = ref<HTMLElement | null>(null);
const trustImageB = ref<HTMLElement | null>(null);
const trustCopyA = ref<HTMLElement | null>(null);
const trustCopyB = ref<HTMLElement | null>(null);
const clarityCueRef = ref<HTMLElement | null>(null);
/* The intro Loom shows once its link is set; until then only in dev, so the live site never shows an empty video. */
const showLoomIntro = !!INTRO_LOOM_URL || import.meta.env.DEV;
/* Tells the background artwork the hero copy is in. A plain DOM event, not reactive state:
   flipping a prop mid-animation re-renders the ~1000-line SVG and drops frames. */
const signalHeroCopyIn = () => {
  (window as Window & { __heroCopyIn?: boolean }).__heroCopyIn = true;
  window.dispatchEvent(new Event('hero:copy-in'));
};
const trustCueRef = ref<HTMLElement | null>(null);
/* ---------- The breath ----------
   First message ("people hesitate"): breath held. The photo sits a touch close and still, and
   the breath line beside it is short and choppy. Second message ("trust is established"): the
   photo eases back and starts to breathe (drifting in and out, the window light brightening on
   each out-breath), and the line smooths into long, slow waves. */
const PHOTO_HELD = 1.06; // photo scale on the first message
const trustLightRef = ref<HTMLElement | null>(null);
const trustLineRef = ref<HTMLElement | null>(null);
let breathTl: gsap.core.Timeline | null = null;
let breathCalm = false;
let breathOnScreen = false;
let breathIo: IntersectionObserver | null = null;

const trustPhotos = () =>
  [trustImageA.value, trustImageB.value]
    .map((w) => w?.querySelector<HTMLImageElement>('img'))
    .filter((el): el is HTMLImageElement => !!el);

/* Breathe only once calm, and only while the section is on screen. Holding the breath settles
   the photo and the light back to rest. */
const updateBreath = () => {
  trustLineRef.value?.classList.toggle('is-calm', breathCalm);
  if (!breathTl) return;
  if (breathCalm && breathOnScreen) {
    breathTl.play();
    return;
  }
  breathTl.pause();
  const wraps = [trustImageA.value, trustImageB.value].filter((el): el is HTMLElement => !!el);
  gsap.to(wraps, { scale: 1, duration: 1.2, ease: 'sine.out', overwrite: 'auto' });
  if (trustLightRef.value) {
    gsap.to(trustLightRef.value, { opacity: 0.2, duration: 1.2, ease: 'sine.out' });
  }
};

const setBreathCalm = (calm: boolean) => {
  if (calm === breathCalm) return;
  breathCalm = calm;
  if (calm && breathTl) breathTl.restart(true).pause(); // start a fresh breath, from the top
  updateBreath();
};
/* Phones: after the trust section autoplays, two small arrows let people go back to the first
   message ("why people hesitate") and forward again. 0 = still autoplaying. */
const trustStep = ref<0 | 1 | 2>(0);
const goTrust = (step: 1 | 2) => {
  if (trustStep.value === 0 || trustStep.value === step) return;
  trustStep.value = step;
  const first = step === 1;
  const fade = { duration: 0.6, ease: 'power1.inOut', overwrite: 'auto' as const };
  const on = (el: HTMLElement | null, visible: boolean) => {
    if (el) gsap.to(el, { ...fade, opacity: visible ? 1 : 0 });
  };
  on(trustCopyA.value, first);
  on(trustCopyB.value, !first);
  on(trustImageA.value, first);
  on(trustImageB.value, !first);
  gsap.to(trustPhotos(), {
    scale: first ? PHOTO_HELD : 1,
    duration: 1.8,
    ease: 'sine.inOut',
    overwrite: 'auto',
  });
  setBreathCalm(!first);
};

/* ---------- Lifecycle-scoped GSAP state ---------- */

let heroCtx: gsap.Context | null = null;
let sceneCtx: gsap.Context | null = null;
let disposed = false;
let verified = false;

/* Resolves when the hero entrance is finished (or skipped). */
let markHeroDone: () => void = () => {};
const heroDone = new Promise<void>((r) => (markHeroDone = r));

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const activeEntry = computed(() => {
  if (!activeTopic.value) return null;
  return CacheBinding[activeTopic.value];
});

const activeComponent = computed(() => {
  const entry = activeEntry.value;
  if (!entry) return null;
  if (!cacheStore.catalog[entry]) cacheStore.CACHE_COMPONENT(entry);
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

/* ---------- Readiness helpers ---------- */

const twoFrames = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

const withTimeout = (p: Promise<unknown>, ms: number) =>
  Promise.race([p, new Promise<void>((r) => setTimeout(r, ms))]);

/** Decode every <img> under `root` so decode never lands mid-tween. */
const decodeImagesIn = async (root: ParentNode | null) => {
  if (!root) return;
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
  await Promise.all(
    imgs.map((img) =>
      typeof img.decode === 'function' ? img.decode().catch(() => {}) : Promise.resolve(),
    ),
  );
};

/** Decode a CSS background-image (mobile hero uses monitor.avif as a background). */
const decodeBackgroundOf = async (el: HTMLElement | null) => {
  if (!el) return;
  const raw = getComputedStyle(el).backgroundImage;
  const match = /url\(["']?(.*?)["']?\)/.exec(raw);
  if (!match?.[1]) return;
  const img = new Image();
  img.src = match[1];
  try {
    await img.decode();
  } catch {
    /* noop */
  }
};

/**
 * Gate the entrance on: fonts settled, hero background decoded, two clean frames.
 * Hard-capped so a stalled font request can never leave the hero hidden.
 */
const heroReady = async () => {
  const bg = document.querySelector<HTMLElement>('.clarity-background');
  await withTimeout(
    Promise.all([
      document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve(),
      decodeBackgroundOf(bg),
    ]),
    1500,
  );
  await twoFrames();
};

/* ---------- Debug: report the timeline position of dropped frames ---------- */

const watchJank = (tl: gsap.core.Timeline, label: string) => {
  if (!DEBUG_JANK) return;
  let last = performance.now();
  const tick = () => {
    const now = performance.now();
    const dt = now - last;
    last = now;
    if (dt > 24) console.warn(`[${label}] jank ${dt.toFixed(0)}ms @ tl ${tl.time().toFixed(2)}s`);
    if (tl.isActive()) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

/* ---------- Misc ---------- */

const applyHomeScale = () => {
  const el = homeContainerRef.value;
  if (!el) return;
  gsap.killTweensOf(el);
  gsap.set(el, { clearProps: 'transform' });
};

const handleResize = () => {
  requestAnimationFrame(applyHomeScale);
  measureRail();
};

const verifyOnce = () => {
  if (verified || disposed) return;
  verified = true;
  const run = () => {
    void mainStore.VERIFY_IS_HUMAN();
  };
  if ('requestIdleCallback' in window) {
    (
      window as Window & { requestIdleCallback: (cb: () => void, o?: object) => number }
    ).requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 0);
  }
};

/* ---------- Hero entrance ---------- */

const heroTargets = () => {
  const el = claritySectionRef.value;
  if (!el) return null;

  const heroCopyEl = el.querySelector<HTMLElement>('.hero-copy');
  const kickerEl = el.querySelector<HTMLElement>('.kicker');
  const simonEl = el.querySelector<HTMLElement>('.simon');
  const headlineEl = el.querySelector<HTMLElement>('.headline');
  const subheadlineEl = el.querySelector<HTMLElement>('.subheadline');
  const ctaEls = Array.from(el.querySelectorAll<HTMLElement>('.cta'));
  const proofEls = Array.from(el.querySelectorAll<HTMLElement>('.proof-card, .proofs-caption'));

  const els = [kickerEl, simonEl, headlineEl, subheadlineEl, ...ctaEls, ...proofEls].filter(
    (x): x is HTMLElement => !!x,
  );

  if (!els.length) return null;
  return { heroCopyEl, kickerEl, simonEl, headlineEl, subheadlineEl, ctaEls, proofEls, els };
};

const release = () => claritySectionRef.value?.removeAttribute('data-hero');

const buildHero = (mode: ViewType, animate = true) => {
  const t = heroTargets();
  if (!t) {
    release();
    markHeroDone();
    return;
  }

  const { heroCopyEl, kickerEl, simonEl, headlineEl, subheadlineEl, ctaEls, proofEls } = t;
  /* Desktop: the caption is revealed by the first scroll (see buildScene), not on load. */
  const els = mode === ViewType.Desktop ? t.els.filter((e) => !proofEls.includes(e)) : t.els;

  heroCtx?.revert();
  heroCtx = gsap.context(() => {
    /* Resize / breakpoint swap: no replay, just a clean visible layout. */
    if (!animate || prefersReducedMotion) {
      signalHeroCopyIn();
      gsap.set(els, { clearProps: 'all' });
      if (heroCopyEl) gsap.set(heroCopyEl, { clearProps: 'all' });
      release();
      verifyOnce();
      markHeroDone();
      return;
    }

    /* Promote once, up front — not element-by-element as each tween starts. */
    gsap.set(els, { willChange: 'transform, opacity', force3D: true });

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        /* Dropping the layers forces a re-paint (the 32ms hitch on the last frame).
           Do it once the browser is idle instead of on the final frame. */
        const cleanup = () => {
          gsap.set(els, { willChange: 'auto' });
          if (heroCopyEl) gsap.set(heroCopyEl, { willChange: 'auto', clearProps: 'transform' });
        };
        if ('requestIdleCallback' in window) {
          (
            window as Window & { requestIdleCallback: (cb: () => void, o?: object) => number }
          ).requestIdleCallback(cleanup, { timeout: 1500 });
        } else {
          setTimeout(cleanup, 500);
        }
        verifyOnce();
        markHeroDone();
      },
    });

    if (mode === ViewType.Responsive) {
      if (kickerEl) {
        tl.fromTo(
          kickerEl,
          { y: 35, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.65, overwrite: 'auto' },
          0,
        );
      }

      if (headlineEl) {
        tl.fromTo(
          headlineEl,
          { y: 75, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 1.25, overwrite: 'auto' },
          0.15,
        );
      }

      if (subheadlineEl) {
        tl.fromTo(
          subheadlineEl,
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 1.25 },
          '-=0.25',
        );
      }

      if (ctaEls.length) {
        tl.fromTo(
          ctaEls,
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 3, stagger: 0.25 },
          '-=1',
        );
      }

      if (proofEls.length) {
        tl.fromTo(
          proofEls,
          { y: 32, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.5, stagger: 0.18 },
          '-=2.25',
        );
      }
      tl.call(signalHeroCopyIn);
      if (clarityCueRef.value) {
        tl.fromTo(clarityCueRef.value, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '>');
      }
    }

    if (mode === ViewType.Desktop) {
      const simonWidth = simonEl?.offsetWidth ?? 250;
      const columnGap = 32; // 2rem from .simon-copy
      const shift = (simonWidth + columnGap) / 2;

      if (heroCopyEl) {
        tl.fromTo(
          heroCopyEl,
          { x: -shift, scale: 1.2 },
          { x: 0, scale: 1, duration: 2.2, ease: 'power2.inOut', force3D: true },
          0,
        );
      }

      if (kickerEl) {
        tl.fromTo(
          kickerEl,
          { y: 35, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.6, overwrite: 'auto' },
          0,
        );
      }

      if (headlineEl) {
        tl.fromTo(
          headlineEl,
          { y: 75, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.9, overwrite: 'auto' },
          0.25,
        );
      }

      if (subheadlineEl) {
        tl.fromTo(
          subheadlineEl,
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: 'power2.out', duration: 0.9 },
          0.55,
        );
      }

      if (ctaEls.length) {
        tl.fromTo(
          ctaEls,
          { autoAlpha: 0, x: 35 },
          { autoAlpha: 1, x: 0, ease: 'power2.out', duration: 0.8, stagger: 0.25 },
          0.85,
        );
      }

      /* Sequence: card copy → menu tiles → background → scroll cue.
         The caption and the background's cards follow on the first scroll. */
      if (simonEl) {
        tl.fromTo(simonEl, { autoAlpha: 0, x: -32 }, { autoAlpha: 1, x: 0, duration: 0.9 }, 1.6);
      }

      /* After the card has finished settling (its move/scale ends at 2.2s). */
      tl.call(signalHeroCopyIn, undefined, 2.2);

      if (clarityCueRef.value) {
        tl.fromTo(clarityCueRef.value, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.9);
      }
    }

    release(); // ← curtain up, frame zero is already written
    if (DEBUG_JANK)
      console.warn(
        `[hero] start @ ${(window as Window & { __jankAt?: () => string }).__jankAt?.()}`,
      );
    tl.play();
    watchJank(tl, 'hero');
  }, claritySectionRef.value ?? undefined);
};

/* ---------- Scroll scenes (pins + trust section) ---------- */

const buildScene = () => {
  sceneCtx?.revert();
  sceneCtx = gsap.context(() => {
    if (!isResponsive.value) {
      if (claritySectionRef.value) {
        ScrollTrigger.create({
          trigger: claritySectionRef.value,
          start: 'top top',
          end: '+=1800',
          pin: true,
          pinSpacing: true,
        });
      }

      /* First thing the scroll reveals; the background cards follow (ClarityBackground). */
      const caption = claritySectionRef.value?.querySelector<HTMLElement>('.proofs-caption');
      if (caption) {
        gsap.fromTo(
          caption,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { start: 0, end: 260, scrub: 0.6 },
          },
        );
      }

      if (clarityCueRef.value) {
        gsap.to(clarityCueRef.value, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: { start: 0, end: 3000, scrub: true },
        });
      }

      /* Side rail: once the hero has handed off and the next section has settled into its
         pin, the menu tiles bounce in from off the left edge, top first. Scrolling back up
         sends them out the same way, bottom first. Uses the CSS translate property so it never
         fights the tiles' own hover transform. */
      const rail = railRef.value;
      const tiles = rail ? [...rail.querySelectorAll<HTMLElement>('.simon-quadrant')] : [];
      const afterHero =
        document.querySelector<HTMLElement>('.loom-intro') ?? trustSectionRef.value ?? null;
      if (rail && tiles.length && afterHero) {
        measureRail();
        const OFF = '-180px 0px';
        gsap.set(tiles, { autoAlpha: 0, translate: OFF });
        const showRail = () =>
          gsap.to(tiles, {
            autoAlpha: 1,
            translate: '0px 0px',
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.09,
            overwrite: true,
          });
        const hideRail = () =>
          gsap.to(tiles, {
            autoAlpha: 0,
            translate: OFF,
            duration: 0.45,
            ease: 'back.in(1.7)',
            stagger: { each: 0.07, from: 'end' },
            overwrite: true,
          });
        ScrollTrigger.create({
          trigger: afterHero,
          start: 'top top',
          refreshPriority: -1,
          onEnter: showRail,
          onLeaveBack: hideRail,
        });
      }
    }

    const section = trustSectionRef.value;
    const viewport = trustViewportRef.value;
    const nav = trustNavRef.value;
    const imgA = trustImageA.value;
    const imgB = trustImageB.value;
    const copyA = trustCopyA.value;
    const copyB = trustCopyB.value;
    const glow = trustGlowRef.value;
    const cue = trustCueRef.value;
    const photos = trustPhotos();

    if (!(section && imgA && imgB && copyA && copyB && glow)) return;

    /* The breath loop: in for 4s, out for 6s (a longer out-breath is the calming one). The
       photo drifts in a touch and back, and the window light brightens through the out-breath,
       then settles. Scale goes on the image wrappers, so it never fights the
       scroll-tied scale on the images themselves. */
    breathCalm = false;
    breathOnScreen = false;
    trustLineRef.value?.classList.remove('is-calm');
    gsap.set(photos, { scale: PHOTO_HELD, transformOrigin: '50% 45%' });
    const light = trustLightRef.value;
    if (light) gsap.set(light, { opacity: 0.2 });
    if (!prefersReducedMotion) {
      const wraps = [imgA, imgB];
      gsap.set(wraps, { scale: 1, transformOrigin: '50% 50%' });
      breathTl = gsap
        .timeline({ repeat: -1, paused: true })
        .fromTo(wraps, { scale: 1 }, { scale: 1.03, duration: 4, ease: 'sine.inOut' }, 0)
        .fromTo(wraps, { scale: 1.03 }, { scale: 1, duration: 6, ease: 'sine.inOut' }, 4);
      if (light) {
        breathTl
          .fromTo(light, { opacity: 0.2 }, { opacity: 0.85, duration: 3, ease: 'sine.inOut' }, 4)
          .fromTo(light, { opacity: 0.85 }, { opacity: 0.2, duration: 3, ease: 'sine.inOut' }, 7);
      }
      breathIo?.disconnect();
      breathIo = new IntersectionObserver(([entry]) => {
        breathOnScreen = !!entry?.isIntersecting;
        updateBreath();
      });
      breathIo.observe(section);
    }

    gsap.set(imgB, { opacity: 0 });
    gsap.set(glow, { opacity: 0, scale: 1.18 });
    if (cue) gsap.set(cue, { opacity: 0 });

    if (isResponsive.value) {
      /* ---------- Mobile: autoplay on entry ---------- */
      gsap.set([copyA, copyB], { opacity: 0 });

      trustStep.value = 0;
      const mobileTl = gsap
        .timeline({
          paused: true,
          onComplete: () => {
            gsap.set([copyA, copyB], { willChange: 'auto' });
            trustStep.value = 2; // autoplay done: show the back/forward arrows
          },
        })
        .to(glow, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0)
        .to(copyA, { opacity: 1, duration: 1.1, ease: 'power1.out' }, 1.2)
        .to(copyA, { opacity: 0, duration: 0.8, ease: 'power1.in' }, 4.2)
        .to(imgA, { opacity: 0, duration: 0.9, ease: 'none' }, 4.6)
        .to(imgB, { opacity: 1, duration: 0.9, ease: 'none' }, 4.6)
        .to(copyB, { opacity: 1, duration: 1.1, ease: 'power1.out' }, 5.2)
        .to(photos, { scale: 1, duration: 2.2, ease: 'sine.inOut' }, 4.4)
        .call(() => setBreathCalm(true), undefined, 4.6);

      const trustIo = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          trustIo.disconnect();

          /* Decode both frames before playing — the A→B crossfade is where it used to hitch. */
          void decodeImagesIn(section).then(() => {
            if (disposed) return;
            watchJank(mobileTl, 'trust-mobile');
            mobileTl.play();
          });
        },
        { threshold: 0.55 },
      );

      trustIo.observe(section);
      io.value = trustIo;
      return;
    }

    /* ---------- Desktop: pinned + scrubbed ---------- */

    /* Copy A animates line by line, top to bottom — eyebrow, headline, support.
       The container stays at opacity 1 so the scrub can still fade the group out. */
    const copyALines = Array.from(copyA.children).filter(
      (n): n is HTMLElement => n instanceof HTMLElement,
    );

    /* Menu buttons. Fall back to fading the whole nav if the inner markup
       doesn't expose individual controls — never transform .trust-nav itself,
       its CSS translateX(-50%) centring depends on staying untouched. */
    const navItems = nav
      ? Array.from(nav.querySelectorAll<HTMLElement>('.q-btn, button, a, [role="button"]'))
      : [];
    const usesNavItems = navItems.length > 0;
    const navTargets: HTMLElement[] = usesNavItems ? navItems : nav ? [nav] : [];

    gsap.set(copyA, { opacity: 1 });
    gsap.set(copyB, { opacity: 0 });

    if (copyALines.length) {
      gsap.set(copyALines, { autoAlpha: 0, y: 22, willChange: 'transform, opacity' });
    } else {
      gsap.set(copyA, { opacity: 0 });
    }

    if (viewport) {
      gsap.set(viewport, { y: VIEWPORT_DROP, willChange: 'transform', force3D: true });
    }

    if (navTargets.length) {
      gsap.set(
        navTargets,
        usesNavItems
          ? { autoAlpha: 0, y: 14, scale: 0.94, willChange: 'transform, opacity' }
          : { autoAlpha: 0 },
      );
    }

    const clearIntroHints = () => {
      if (viewport) gsap.set(viewport, { willChange: 'auto' });
      if (copyALines.length) gsap.set(copyALines, { willChange: 'auto', clearProps: 'transform' });
      if (usesNavItems) gsap.set(navItems, { willChange: 'auto', clearProps: 'transform,scale' });
    };

    /* Decode the two trust photos a screen before the pin, not at it: decoding large images
       right as the pin engages was part of the hitch on a fast scroll. */
    const preIo = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        preIo.disconnect();
        void decodeImagesIn(section);
      },
      { rootMargin: '0px 0px 100% 0px' },
    );
    preIo.observe(section);

    /* The intro plays on time (not on scroll) as the section rises into view, so it's done or
       nearly done by the time the pin engages. Scrolling is never locked. If someone arrives fast
       enough to catch the intro still running, it simply finishes quicker. */
    const introTl = gsap.timeline({
      paused: true,
      onComplete: () => {
        clearIntroHints();
      },
    });

    /* 1. The framed viewport rises into its resting position. */
    if (viewport) {
      introTl.to(viewport, { y: 0, duration: 1.15, ease: 'power3.out', force3D: true }, 0);
    }

    /* Ambience rides along with the lift. */
    introTl.fromTo(
      glow,
      { opacity: 0, scale: 1.18 },
      { opacity: 1, scale: 1, duration: 1.25, ease: 'power2.out' },
      0,
    );

    /* 2. Menu buttons pop in. */
    if (navTargets.length) {
      introTl.to(
        navTargets,
        usesNavItems
          ? { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.08 }
          : { autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
        NAV_AT,
      );
    }

    /* 3. Copy comes in line by line, top to bottom. */
    if (copyALines.length) {
      introTl.to(
        copyALines,
        { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out', stagger: COPY_STAGGER },
        COPY_AT,
      );
    } else {
      introTl.to(copyA, { opacity: 1, duration: 1, ease: 'power1.out' }, COPY_AT);
    }

    /* 4. The scroll cue, once the frame has settled. */
    const cueAt = COPY_AT + COPY_STAGGER * Math.max(copyALines.length - 1, 0) + 0.55;
    if (cue) {
      introTl.fromTo(cue, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, cueAt);
    }

    /* A touch quicker than before, since it now plays while the section is still moving. */
    introTl.timeScale(INTRO_SPEED);

    let introStarted = false;
    let pinned = false;
    const startIntro = () => {
      if (introStarted) return;
      introStarted = true;
      /* Decode both trust frames + settle one frame before the intro plays. */
      void decodeImagesIn(section)
        .then(twoFrames)
        .then(() => {
          if (disposed) {
            if (viewport) gsap.set(viewport, { y: 0, willChange: 'auto' });
            return;
          }
          watchJank(introTl, 'trust-desktop');
          if (pinned) introTl.timeScale(INTRO_CATCH_UP);
          introTl.play();
        });
    };

    /* Start the intro while the section is still rising into view. */
    ScrollTrigger.create({
      trigger: section,
      start: INTRO_START,
      once: true,
      refreshPriority: -2, // measured after the Loom section's pin above it
      onEnter: startIntro,
    });

    /* The pinned crossfade, built up front so it can never be skipped. It opens with a short
       hold (nothing changes) so the first state settles before anything fades. */
    const trustTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1500',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.6,
        refreshPriority: -2, // measured after the Loom section's pin above it
        /* Past the switch to the second message, the breath slows; back above it, it quickens. */
        onUpdate: (self) => {
          const dur = trustTl.duration();
          if (dur) setBreathCalm(self.progress * dur > PIN_HOLD + 0.9);
        },
        onEnter: () => {
          pinned = true;
          startIntro();
          /* Arrived while the intro is still playing: let it finish quickly instead of
             holding the page. */
          if (introTl.isActive()) introTl.timeScale(INTRO_CATCH_UP);
        },
      },
    });

    const D = PIN_HOLD; // every crossfade step starts after the opening hold
    trustTl
      .to({}, { duration: D }, 0)
      .fromTo(
        section,
        { backgroundPositionY: '46%' },
        { backgroundPositionY: '56%', ease: 'none', duration: 2.4, immediateRender: false },
        D,
      );
    if (cue) {
      trustTl.fromTo(
        cue,
        { opacity: 1 },
        { opacity: 0, ease: 'none', duration: 0.4, immediateRender: false },
        D + 0.1,
      );
    }
    trustTl
      .fromTo(
        copyA,
        { opacity: 1 },
        { opacity: 0, ease: 'none', duration: 0.9, immediateRender: false },
        D + 0.2,
      )
      .fromTo(
        imgB,
        { opacity: 0 },
        { opacity: 1, ease: 'none', duration: 0.8, immediateRender: false },
        D + 0.7,
      )
      /* The exhale: the photo eases back from slightly close. */
      .fromTo(
        photos,
        { scale: PHOTO_HELD },
        { scale: 1, ease: 'sine.inOut', duration: 1.6, immediateRender: false },
        D + 0.3,
      )
      .fromTo(
        copyB,
        { opacity: 0 },
        { opacity: 1, ease: 'none', duration: 1.1, immediateRender: false },
        D + 1.0,
      );
    trustTl.fromTo(
      glow,
      { opacity: 1, scale: 1 },
      { opacity: 0, scale: 1.25, ease: 'none', duration: 0.9, immediateRender: false },
      D + 1.5,
    );
  });
};

/* ---------- Lifecycle ---------- */

onMounted(async () => {
  const footerElement = document.getElementById('footer');
  if (footerElement) observer.observe(footerElement);
  window.addEventListener('resize', handleResize);

  /* 2. Create every pin and ScrollTrigger and measure FIRST.
        Pin-spacers reflow the hero's own container — doing this while the
        entrance was already running was the mid-timeline hitch. */
  await nextTick();
  await twoFrames();
  if (disposed) return;

  applyHomeScale();
  buildScene();
  ScrollTrigger.refresh();

  /* 3. Only now wait for fonts + hero background, then play on clean layout. */
  await heroReady();
  if (disposed) return;

  try {
    buildHero(isResponsive.value ? ViewType.Responsive : ViewType.Desktop);
  } catch (e) {
    console.log('Main page animation error: ', e);
    heroCtx?.revert();
    const t = heroTargets();
    if (t) gsap.set(t.els, { clearProps: 'all' });
    verifyOnce();
    markHeroDone();
  }

  /* 4. One late refresh once every image/font has settled AND the hero has
        finished. Never mid-tween — on a cold load 'load' lands during the hero. */
  const pageLoaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((r) => window.addEventListener('load', () => r(), { once: true }));
  await Promise.all([heroDone, pageLoaded]);
  /* Desktop: the background pieces animate after the hero copy. Refreshing while they move
     is a ~50ms hitch, so wait until they've settled (capped, so it always happens). */
  if (!isResponsive.value) {
    const w = window as Window & { __heroBgDone?: boolean };
    if (!w.__heroBgDone) {
      await withTimeout(
        new Promise<void>((r) =>
          window.addEventListener('hero:bg-done', () => r(), { once: true }),
        ),
        4000,
      );
    }
  }
  if (!disposed) ScrollTrigger.refresh();
});

onBeforeUnmount(() => {
  breathIo?.disconnect();
  breathIo = null;
  breathTl = null;
  disposed = true;
  io.value?.disconnect();
  observer.disconnect();
  window.removeEventListener('resize', handleResize);

  try {
    heroCtx?.revert();
    sceneCtx?.revert();
  } catch (e) {
    console.log('onBeforeUnmount dispose err', e);
  }

  heroCtx = null;
  sceneCtx = null;
  ScrollTrigger.getAll().forEach((st) => st.kill());
});

onUnmounted(() => {
  cacheStore.CLEAR_CACHE();
});

watch(
  isResponsive,
  async (viewNow) => {
    heroCtx?.revert();
    sceneCtx?.revert();
    io.value?.disconnect();
    io.value = null;

    await nextTick();
    await waitForLayout(homeContainerRef.value);
    if (disposed) return;

    buildScene();
    ScrollTrigger.refresh();
    buildHero(viewNow ? ViewType.Responsive : ViewType.Desktop, false);

    requestAnimationFrame(applyHomeScale);
    /* Quasar updates the header offset a beat after a breakpoint switch; re-measure then. */
    window.setTimeout(() => {
      if (!disposed) ScrollTrigger.refresh();
    }, 350);
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

/* Open a section from a link on the page. If it's already open (say, opened from the menu
   earlier), setting the same state changes nothing, so on phones and tablets scroll to it
   directly; otherwise the link looks dead. */
const openTopic = (name: TopicName) => {
  if (activeTopic.value === name && expandedPanel.value === name) {
    if (isResponsive.value) void scrollToElement(name);
    return;
  }
  mainStore.SET_ACTIVE_TOPIC(name);
  expandedPanel.value = name;
};

const toContact = () => openTopic(TopicName.Contact);

const toExamples = () => openTopic(TopicName.Examples);
</script>

<template>
  <q-page class="page-container">
    <div class="logo">
      <span class="logo-text">
        <i class="glk text-accent">glk</i><span class="freelance text-dark">Freelance</span>
      </span>
    </div>

    <section class="clarity-background" :class="{ 'is-collapsed': !!activeTopic }">
      <ClarityBackground v-if="!isResponsive" />
    </section>

    <div ref="claritySectionRef" class="clarity-section full-width q-pa-md" data-hero="priming">
      <div
        ref="homeContainerRef"
        class="home-container column justify-start q-pa-lg font-primary"
        :class="{ 'is-collapsed': !!activeTopic }"
      >
        <div class="simon-copy">
          <div class="simon"><SimonMenu /></div>

          <div class="hero-copy column justify-center q-pa-lg">
            <p class="text-caption kicker q-mt-none q-mb-sm">
              150 product reviews for technical founders
            </p>

            <h1 class="headline text-h1 q-mt-none q-mb-md">LESS TO FIGURE OUT. MORE TO ACT ON.</h1>

            <div class="subheadline q-mt-md">
              <p class="q-ma-none">
                I find where people get stuck in your product,
                <b class="fix-it">and fix it.</b>
              </p>
            </div>

            <div class="cta-wrap q-mt-md">
              <q-btn class="cta" @click="openTeardownBooking()" color="accent" size="lg" glossy>
                <span class="text-body-2">GET MY FREE DECISION SNAPSHOT</span>
              </q-btn>
              <button type="button" class="cta cta--message" @click="toContact()">
                or send me a message &rarr;
              </button>
            </div>
          </div>
        </div>

        <p class="proofs-caption q-mb-none">
          <!-- What the free offer actually gives you, right under the button that books it. -->
          <span class="gets-row">
            <b>Your free Decision Snapshot:</b>
            <span>2–3 key issues</span>
            <span>An annotated screenshot</span>
            <span>Patterns that point the way</span>
            <span>The next decision to make</span>
          </span>
          <button type="button" class="see-work" @click="toExamples()">See the work &rarr;</button>
        </p>
        <q-list v-if="isTabletView" class="tablet-expandable-menu full-width font-primary">
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
      <div ref="clarityCueRef" class="clarity-cue" :class="{ 'is-hidden': !!activeTopic }">
        <ScrollCue :has-text="false" minimal />
      </div>
      <q-list v-if="isMobileView" class="full-width font-primary">
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
    <!-- Glue between "what I do" and "why people hesitate": the cost of friction, in my voice. -->
    <!-- Soft edge: the hero's fixed artwork dissolves into the Loom section's colour instead of
         being cut off where the section slides up over it. -->
    <div class="hero-fade" aria-hidden="true"></div>
    <LoomIntro v-if="showLoomIntro" />
    <div class="section-transition"></div>
    <section ref="trustSectionRef" class="trust-section">
      <div ref="trustViewportRef" class="trust-viewport">
        <div ref="trustImageA" class="trust-image-wrap">
          <img src="../assets/trust-breathing-in.avif" alt="" class="trust-image" />
        </div>

        <div ref="trustImageB" class="trust-image-wrap trust-image-wrap--b">
          <img src="../assets/trust-breathing-out.avif" alt="" class="trust-image" />
        </div>

        <!-- Window light: brightens on each out-breath. -->
        <div ref="trustLightRef" class="trust-light" aria-hidden="true"></div>
        <div ref="trustGlowRef" class="trust-glow" aria-hidden="true"></div>
        <!-- Phones: step back to the first message and forward again once autoplay is done. -->
        <div
          v-if="isResponsive"
          class="trust-steps"
          :class="{ 'is-on': trustStep > 0 }"
          role="group"
          aria-label="Trust section messages"
        >
          <button
            type="button"
            class="trust-steps__btn"
            :disabled="trustStep !== 2"
            aria-label="Show the first message: why people hesitate"
            @click="goTrust(1)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
          </button>
          <span class="trust-steps__dots" aria-hidden="true">
            <i :class="{ on: trustStep === 1 }"></i><i :class="{ on: trustStep === 2 }"></i>
          </span>
          <button
            type="button"
            class="trust-steps__btn"
            :disabled="trustStep !== 1"
            aria-label="Show the second message: where trust comes from"
            @click="goTrust(2)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>
        <div ref="trustCueRef" class="trust-cue">
          <ScrollCue :is-dark="false" :has-text="false" minimal />
        </div>
        <div class="trust-frame" aria-hidden="true"></div>
      </div>
      <!-- The words sit on the page itself, beside the photo (above it on phones), in the
           site's own type. -->
      <div class="trust-text">
        <!-- Breath line: choppy while the breath is held, long slow waves once it's let go.
             Large screens only. -->
        <div ref="trustLineRef" class="trust-line" aria-hidden="true">
          <svg
            class="trust-line__wave trust-line__wave--held"
            viewBox="0 0 2400 64"
            preserveAspectRatio="none"
          >
            <path
              d="M0,29.5 L4,26.1 L8,24.4 L12,24.3 L16,25.6 L20,27.5 L24,29.4 L28,30.8 L32,31.6 L36,31.9 L40,32.2 L44,32.6 L48,33.1 L52,33.6 L56,33.7 L60,33.1 L64,31.4 L68,29.1 L72,26.7 L76,25.0 L80,24.8 L84,26.4 L88,29.7 L92,34.1 L96,38.5 L100,41.9 L104,43.3 L108,42.5 L112,39.7 L116,35.8 L120,31.9 L124,28.8 L128,27.2 L132,27.2 L136,28.5 L140,30.3 L144,32.1 L148,33.3 L152,33.8 L156,33.8 L160,33.7 L164,33.6 L168,33.7 L172,33.7 L176,33.3 L180,32.1 L184,30.1 L188,27.4 L192,24.6 L196,22.6 L200,22.1 L204,23.6 L208,26.8 L212,31.2 L216,35.7 L220,39.2 L224,40.9 L228,40.3 L232,37.9 L236,34.5 L240,30.9 L244,28.4 L248,27.3 L252,27.8 L256,29.5 L260,31.8 L264,34.0 L268,35.5 L272,36.3 L276,36.5 L280,36.5 L284,36.5 L288,36.6 L292,36.5 L296,35.9 L300,34.5 L304,32.1 L308,29.0 L312,25.9 L316,23.4 L320,22.4 L324,23.4 L328,26.1 L332,30.1 L336,34.1 L340,37.2 L344,38.6 L348,37.8 L352,35.2 L356,31.6 L360,28.0 L364,25.5 L368,24.5 L372,25.2 L376,27.2 L380,29.8 L384,32.4 L388,34.4 L392,35.6 L396,36.4 L400,36.8 L404,37.3 L408,37.8 L412,38.2 L416,38.0 L420,36.9 L424,34.8 L428,31.9 L432,28.8 L436,26.3 L440,25.3 L444,26.1 L448,28.6 L452,32.3 L456,36.0 L460,38.7 L464,39.6 L468,38.3 L472,35.2 L476,31.1 L480,27.1 L484,24.1 L488,22.7 L492,23.1 L496,24.8 L500,27.2 L504,29.5 L508,31.4 L512,32.7 L516,33.5 L520,34.2 L524,34.9 L528,35.7 L532,36.4 L536,36.6 L540,36.0 L544,34.3 L548,31.9 L552,29.3 L556,27.4 L560,26.8 L564,28.0 L568,30.9 L572,34.8 L576,38.7 L580,41.6 L584,42.5 L588,41.2 L592,38.0 L596,33.8 L600,29.5 L604,26.1 L608,24.4 L612,24.3 L616,25.6 L620,27.5 L624,29.4 L628,30.8 L632,31.6 L636,31.9 L640,32.2 L644,32.6 L648,33.1 L652,33.6 L656,33.7 L660,33.1 L664,31.4 L668,29.1 L672,26.7 L676,25.0 L680,24.8 L684,26.4 L688,29.7 L692,34.1 L696,38.5 L700,41.9 L704,43.3 L708,42.5 L712,39.7 L716,35.8 L720,31.9 L724,28.8 L728,27.2 L732,27.2 L736,28.5 L740,30.3 L744,32.1 L748,33.3 L752,33.8 L756,33.8 L760,33.7 L764,33.6 L768,33.7 L772,33.7 L776,33.3 L780,32.1 L784,30.1 L788,27.4 L792,24.6 L796,22.6 L800,22.1 L804,23.6 L808,26.8 L812,31.2 L816,35.7 L820,39.2 L824,40.9 L828,40.3 L832,37.9 L836,34.5 L840,30.9 L844,28.4 L848,27.3 L852,27.8 L856,29.5 L860,31.8 L864,34.0 L868,35.5 L872,36.3 L876,36.5 L880,36.5 L884,36.5 L888,36.6 L892,36.5 L896,35.9 L900,34.5 L904,32.1 L908,29.0 L912,25.9 L916,23.4 L920,22.4 L924,23.4 L928,26.1 L932,30.1 L936,34.1 L940,37.2 L944,38.6 L948,37.8 L952,35.2 L956,31.6 L960,28.0 L964,25.5 L968,24.5 L972,25.2 L976,27.2 L980,29.8 L984,32.4 L988,34.4 L992,35.6 L996,36.4 L1000,36.8 L1004,37.3 L1008,37.8 L1012,38.2 L1016,38.0 L1020,36.9 L1024,34.8 L1028,31.9 L1032,28.8 L1036,26.3 L1040,25.3 L1044,26.1 L1048,28.6 L1052,32.3 L1056,36.0 L1060,38.7 L1064,39.6 L1068,38.3 L1072,35.2 L1076,31.1 L1080,27.1 L1084,24.1 L1088,22.7 L1092,23.1 L1096,24.8 L1100,27.2 L1104,29.5 L1108,31.4 L1112,32.7 L1116,33.5 L1120,34.2 L1124,34.9 L1128,35.7 L1132,36.4 L1136,36.6 L1140,36.0 L1144,34.3 L1148,31.9 L1152,29.3 L1156,27.4 L1160,26.8 L1164,28.0 L1168,30.9 L1172,34.8 L1176,38.7 L1180,41.6 L1184,42.5 L1188,41.2 L1192,38.0 L1196,33.8 L1200,29.5 L1204,26.1 L1208,24.4 L1212,24.3 L1216,25.6 L1220,27.5 L1224,29.4 L1228,30.8 L1232,31.6 L1236,31.9 L1240,32.2 L1244,32.6 L1248,33.1 L1252,33.6 L1256,33.7 L1260,33.1 L1264,31.4 L1268,29.1 L1272,26.7 L1276,25.0 L1280,24.8 L1284,26.4 L1288,29.7 L1292,34.1 L1296,38.5 L1300,41.9 L1304,43.3 L1308,42.5 L1312,39.7 L1316,35.8 L1320,31.9 L1324,28.8 L1328,27.2 L1332,27.2 L1336,28.5 L1340,30.3 L1344,32.1 L1348,33.3 L1352,33.8 L1356,33.8 L1360,33.7 L1364,33.6 L1368,33.7 L1372,33.7 L1376,33.3 L1380,32.1 L1384,30.1 L1388,27.4 L1392,24.6 L1396,22.6 L1400,22.1 L1404,23.6 L1408,26.8 L1412,31.2 L1416,35.7 L1420,39.2 L1424,40.9 L1428,40.3 L1432,37.9 L1436,34.5 L1440,30.9 L1444,28.4 L1448,27.3 L1452,27.8 L1456,29.5 L1460,31.8 L1464,34.0 L1468,35.5 L1472,36.3 L1476,36.5 L1480,36.5 L1484,36.5 L1488,36.6 L1492,36.5 L1496,35.9 L1500,34.5 L1504,32.1 L1508,29.0 L1512,25.9 L1516,23.4 L1520,22.4 L1524,23.4 L1528,26.1 L1532,30.1 L1536,34.1 L1540,37.2 L1544,38.6 L1548,37.8 L1552,35.2 L1556,31.6 L1560,28.0 L1564,25.5 L1568,24.5 L1572,25.2 L1576,27.2 L1580,29.8 L1584,32.4 L1588,34.4 L1592,35.6 L1596,36.4 L1600,36.8 L1604,37.3 L1608,37.8 L1612,38.2 L1616,38.0 L1620,36.9 L1624,34.8 L1628,31.9 L1632,28.8 L1636,26.3 L1640,25.3 L1644,26.1 L1648,28.6 L1652,32.3 L1656,36.0 L1660,38.7 L1664,39.6 L1668,38.3 L1672,35.2 L1676,31.1 L1680,27.1 L1684,24.1 L1688,22.7 L1692,23.1 L1696,24.8 L1700,27.2 L1704,29.5 L1708,31.4 L1712,32.7 L1716,33.5 L1720,34.2 L1724,34.9 L1728,35.7 L1732,36.4 L1736,36.6 L1740,36.0 L1744,34.3 L1748,31.9 L1752,29.3 L1756,27.4 L1760,26.8 L1764,28.0 L1768,30.9 L1772,34.8 L1776,38.7 L1780,41.6 L1784,42.5 L1788,41.2 L1792,38.0 L1796,33.8 L1800,29.5 L1804,26.1 L1808,24.4 L1812,24.3 L1816,25.6 L1820,27.5 L1824,29.4 L1828,30.8 L1832,31.6 L1836,31.9 L1840,32.2 L1844,32.6 L1848,33.1 L1852,33.6 L1856,33.7 L1860,33.1 L1864,31.4 L1868,29.1 L1872,26.7 L1876,25.0 L1880,24.8 L1884,26.4 L1888,29.7 L1892,34.1 L1896,38.5 L1900,41.9 L1904,43.3 L1908,42.5 L1912,39.7 L1916,35.8 L1920,31.9 L1924,28.8 L1928,27.2 L1932,27.2 L1936,28.5 L1940,30.3 L1944,32.1 L1948,33.3 L1952,33.8 L1956,33.8 L1960,33.7 L1964,33.6 L1968,33.7 L1972,33.7 L1976,33.3 L1980,32.1 L1984,30.1 L1988,27.4 L1992,24.6 L1996,22.6 L2000,22.1 L2004,23.6 L2008,26.8 L2012,31.2 L2016,35.7 L2020,39.2 L2024,40.9 L2028,40.3 L2032,37.9 L2036,34.5 L2040,30.9 L2044,28.4 L2048,27.3 L2052,27.8 L2056,29.5 L2060,31.8 L2064,34.0 L2068,35.5 L2072,36.3 L2076,36.5 L2080,36.5 L2084,36.5 L2088,36.6 L2092,36.5 L2096,35.9 L2100,34.5 L2104,32.1 L2108,29.0 L2112,25.9 L2116,23.4 L2120,22.4 L2124,23.4 L2128,26.1 L2132,30.1 L2136,34.1 L2140,37.2 L2144,38.6 L2148,37.8 L2152,35.2 L2156,31.6 L2160,28.0 L2164,25.5 L2168,24.5 L2172,25.2 L2176,27.2 L2180,29.8 L2184,32.4 L2188,34.4 L2192,35.6 L2196,36.4 L2200,36.8 L2204,37.3 L2208,37.8 L2212,38.2 L2216,38.0 L2220,36.9 L2224,34.8 L2228,31.9 L2232,28.8 L2236,26.3 L2240,25.3 L2244,26.1 L2248,28.6 L2252,32.3 L2256,36.0 L2260,38.7 L2264,39.6 L2268,38.3 L2272,35.2 L2276,31.1 L2280,27.1 L2284,24.1 L2288,22.7 L2292,23.1 L2296,24.8 L2300,27.2 L2304,29.5 L2308,31.4 L2312,32.7 L2316,33.5 L2320,34.2 L2324,34.9 L2328,35.7 L2332,36.4 L2336,36.6 L2340,36.0 L2344,34.3 L2348,31.9 L2352,29.3 L2356,27.4 L2360,26.8 L2364,28.0 L2368,30.9 L2372,34.8 L2376,38.7 L2380,41.6 L2384,42.5 L2388,41.2 L2392,38.0 L2396,33.8 L2400,29.5"
            />
          </svg>
          <svg
            class="trust-line__wave trust-line__wave--calm"
            viewBox="0 0 2400 64"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32.0 L8,29.3 L16,26.7 L24,24.3 L32,22.1 L40,20.1 L48,18.5 L56,17.3 L64,16.4 L72,16.0 L80,16.1 L88,16.6 L96,17.5 L104,18.9 L112,20.6 L120,22.6 L128,24.9 L136,27.4 L144,30.0 L152,32.7 L160,35.3 L168,37.9 L176,40.3 L184,42.5 L192,44.3 L200,45.9 L208,47.0 L216,47.7 L224,48.0 L232,47.8 L240,47.2 L248,46.2 L256,44.7 L264,43.0 L272,40.9 L280,38.5 L288,36.0 L296,33.3 L304,30.7 L312,28.0 L320,25.5 L328,23.1 L336,21.0 L344,19.3 L352,17.8 L360,16.8 L368,16.2 L376,16.0 L384,16.3 L392,17.0 L400,18.1 L408,19.7 L416,21.5 L424,23.7 L432,26.1 L440,28.7 L448,31.3 L456,34.0 L464,36.6 L472,39.1 L480,41.4 L488,43.4 L496,45.1 L504,46.5 L512,47.4 L520,47.9 L528,48.0 L536,47.6 L544,46.7 L552,45.5 L560,43.9 L568,41.9 L576,39.7 L584,37.3 L592,34.7 L600,32.0 L608,29.3 L616,26.7 L624,24.3 L632,22.1 L640,20.1 L648,18.5 L656,17.3 L664,16.4 L672,16.0 L680,16.1 L688,16.6 L696,17.5 L704,18.9 L712,20.6 L720,22.6 L728,24.9 L736,27.4 L744,30.0 L752,32.7 L760,35.3 L768,37.9 L776,40.3 L784,42.5 L792,44.3 L800,45.9 L808,47.0 L816,47.7 L824,48.0 L832,47.8 L840,47.2 L848,46.2 L856,44.7 L864,43.0 L872,40.9 L880,38.5 L888,36.0 L896,33.3 L904,30.7 L912,28.0 L920,25.5 L928,23.1 L936,21.0 L944,19.3 L952,17.8 L960,16.8 L968,16.2 L976,16.0 L984,16.3 L992,17.0 L1000,18.1 L1008,19.7 L1016,21.5 L1024,23.7 L1032,26.1 L1040,28.7 L1048,31.3 L1056,34.0 L1064,36.6 L1072,39.1 L1080,41.4 L1088,43.4 L1096,45.1 L1104,46.5 L1112,47.4 L1120,47.9 L1128,48.0 L1136,47.6 L1144,46.7 L1152,45.5 L1160,43.9 L1168,41.9 L1176,39.7 L1184,37.3 L1192,34.7 L1200,32.0 L1208,29.3 L1216,26.7 L1224,24.3 L1232,22.1 L1240,20.1 L1248,18.5 L1256,17.3 L1264,16.4 L1272,16.0 L1280,16.1 L1288,16.6 L1296,17.5 L1304,18.9 L1312,20.6 L1320,22.6 L1328,24.9 L1336,27.4 L1344,30.0 L1352,32.7 L1360,35.3 L1368,37.9 L1376,40.3 L1384,42.5 L1392,44.3 L1400,45.9 L1408,47.0 L1416,47.7 L1424,48.0 L1432,47.8 L1440,47.2 L1448,46.2 L1456,44.7 L1464,43.0 L1472,40.9 L1480,38.5 L1488,36.0 L1496,33.3 L1504,30.7 L1512,28.0 L1520,25.5 L1528,23.1 L1536,21.0 L1544,19.3 L1552,17.8 L1560,16.8 L1568,16.2 L1576,16.0 L1584,16.3 L1592,17.0 L1600,18.1 L1608,19.7 L1616,21.5 L1624,23.7 L1632,26.1 L1640,28.7 L1648,31.3 L1656,34.0 L1664,36.6 L1672,39.1 L1680,41.4 L1688,43.4 L1696,45.1 L1704,46.5 L1712,47.4 L1720,47.9 L1728,48.0 L1736,47.6 L1744,46.7 L1752,45.5 L1760,43.9 L1768,41.9 L1776,39.7 L1784,37.3 L1792,34.7 L1800,32.0 L1808,29.3 L1816,26.7 L1824,24.3 L1832,22.1 L1840,20.1 L1848,18.5 L1856,17.3 L1864,16.4 L1872,16.0 L1880,16.1 L1888,16.6 L1896,17.5 L1904,18.9 L1912,20.6 L1920,22.6 L1928,24.9 L1936,27.4 L1944,30.0 L1952,32.7 L1960,35.3 L1968,37.9 L1976,40.3 L1984,42.5 L1992,44.3 L2000,45.9 L2008,47.0 L2016,47.7 L2024,48.0 L2032,47.8 L2040,47.2 L2048,46.2 L2056,44.7 L2064,43.0 L2072,40.9 L2080,38.5 L2088,36.0 L2096,33.3 L2104,30.7 L2112,28.0 L2120,25.5 L2128,23.1 L2136,21.0 L2144,19.3 L2152,17.8 L2160,16.8 L2168,16.2 L2176,16.0 L2184,16.3 L2192,17.0 L2200,18.1 L2208,19.7 L2216,21.5 L2224,23.7 L2232,26.1 L2240,28.7 L2248,31.3 L2256,34.0 L2264,36.6 L2272,39.1 L2280,41.4 L2288,43.4 L2296,45.1 L2304,46.5 L2312,47.4 L2320,47.9 L2328,48.0 L2336,47.6 L2344,46.7 L2352,45.5 L2360,43.9 L2368,41.9 L2376,39.7 L2384,37.3 L2392,34.7 L2400,32.0"
            />
          </svg>
        </div>
        <div ref="trustCopyA" class="trust-copy">
          <span class="eyebrow">Why people hesitate</span>
          <p>People hesitate when they have to guess.</p>
          <p class="trust-support">
            Every visitor is trusting you with their time and attention. Each question your product
            leaves open (what is this, what is it doing, what happens next) spends some of it.
          </p>
        </div>

        <div ref="trustCopyB" class="trust-copy">
          <span class="eyebrow">Where trust comes from</span>
          <p>Trust isn’t claimed.</p>
          <p><span class="trust-fill">It’s established.</span></p>
          <p class="trust-support">
            Say clearly who you are and what you do. Then show it. When what you say and what the
            product does line up, there’s nothing left to guess and nothing in the way.
          </p>
        </div>
      </div>
    </section>

    <!-- The close: where to start, and the route your answer takes. -->
    <ClosingSection @message="toContact()" />

    <!-- Desktop: after the hero, the menu moves to a rail under the logo and stays there. -->
    <nav
      v-if="!isResponsive"
      ref="railRef"
      class="side-rail"
      :style="railLeft ? { left: railLeft } : undefined"
      aria-label="Sections"
    >
      <SimonMenu layout="column" />
    </nav>
  </q-page>
</template>

<style scoped lang="scss">
@use '../css/tokens' as tokens;

.page-container {
  position: relative;
  min-height: 100vh;
  background: color-mix(in srgb, var(--q-accent) 5%, transparent);

  @media #{tokens.$tablet-only} {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
}

.logo {
  display: none;
  position: fixed;
  top: 2%;
  left: 2%;
  z-index: 2;

  @media (min-width: tokens.$breakpoint-lg) {
    display: flex !important;
    align-items: center;
  }

  .logo-text {
    @media (min-width: tokens.$breakpoint-lg) {
      padding-left: 0.5rem;
      font-size: 1.5rem;
    }
  }

  .glk {
    @media (min-width: tokens.$breakpoint-lg) {
      margin-right: 2px;
      font-weight: 700;
    }
  }

  .freelance {
    @media (min-width: tokens.$breakpoint-lg) {
      font-weight: 500;
    }
  }
}

/* ---------- Clarity ---------- */

/* Phones: center the hero in the space instead of leaving a gap below it. */
@media (max-width: 599.98px) {
  .home-container {
    justify-content: center !important;
  }
}

.clarity-cue.is-hidden {
  visibility: hidden;
}

.see-work {
  margin-left: 0.35rem;
  padding: 0;
  border: 0;
  background: none;
  color: var(--q-accent);
  font: inherit;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.cta--message {
  padding: 0.4rem 0;
  border: 0;
  background: none;
  color: var(--q-primary);
  font: inherit;
  font-size: 0.92rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  opacity: 0.85;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }

  @media (max-width: calc(#{tokens.$breakpoint-lg} - 0.02px)) {
    text-align: center;
  }
}

.gets-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.9rem;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 0.35rem;
  text-wrap: wrap;

  b {
    color: var(--q-dark);
    font-weight: 700;
  }

  span {
    white-space: nowrap;

    &::before {
      content: '✓';
      margin-right: 0.3rem;
      color: var(--q-accent);
      font-weight: 800;
    }
  }
}

.proofs-caption {
  margin-top: 1.5rem;
  color: var(--q-dark);
  font-size: clamp(0.9rem, 1vw, 1.02rem);
  font-weight: 500;
  line-height: 1.45;
  text-align: center;
  text-wrap: balance;

  i {
    color: var(--q-accent);
    font-style: normal;
    font-weight: 700;
  }
}

.clarity-background {
  position: fixed;
  inset: 0;
  justify-content: center;
  align-items: center;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: url('../assets/monitor.avif') center / cover no-repeat;
  animation: bg-fade 2500ms ease-out both;

  @media (min-width: tokens.$breakpoint-lg) {
    background: #f7f9fe;
    animation: none;
  }

  &.is-collapsed {
    filter: blur(4px);
  }
}

.clarity-section {
  width: 100%;
  max-width: 600px;

  @media #{tokens.$tablet-only} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 56px);
    min-height: calc(100svh - 56px);
    padding-block: 2rem;
    max-width: none;
  }

  @media (min-width: tokens.$breakpoint-lg) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    height: 100svh;
    max-width: none;
    background: none;
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

.clarity-section[data-hero='priming'] {
  visibility: hidden;
}

.q-item__section--side {
  display: none !important;
}

/* ---------- Home Container ---------- */

.home-container {
  position: relative;
  z-index: 2;
  margin-inline: auto;
  margin-bottom: 1rem;
  padding: 1.5rem;
  min-height: calc(100vh - 56px - 3rem);
  min-height: calc(100svh - 56px - 3rem);
  background-color: var(--q-secondary);
  text-align: center;
  box-shadow: none;
  flex-wrap: nowrap;

  @media #{tokens.$tablet-only} {
    max-width: 640px;
    min-height: 0;
    justify-content: flex-start;
    padding: 1.5rem;
    background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);
    border: 1px solid var(--q-accent);
    box-shadow:
      0 0 64px color-mix(in srgb, var(--q-accent) 38%, transparent),
      0 28px 80px color-mix(in srgb, var(--q-accent) 38%, transparent);
  }

  @media (min-width: tokens.$breakpoint-lg) {
    max-width: 760px;
    min-height: 0;
    margin-top: 3rem;
    margin-bottom: 0;
    padding: 2rem;
    justify-content: center;
    text-align: left;
    background-color: transparent;
    transition:
      max-width 0.5s ease,
      padding 0.5s ease,
      transform 0.5s ease;

    .hero-copy,
    h1,
    .subheadline {
      max-width: none;
      margin-inline: 0;
    }

    /* ---------- Drawer open ---------- */

    &.is-collapsed {
      max-width: max-content;
      padding: 1rem;

      /* Card matches the 250px tile grid exactly: no stray gap on the right. */
      .hero-copy {
        width: 250px;
        padding: 0.75rem !important; /* beats Quasar's q-pa-lg */
      }
      transform: translateX(calc(var(--panel-offset, 0px) / -2));

      .simon-copy {
        grid-template-columns: 1fr;
        row-gap: 1rem;

        .hero-copy {
          .kicker,
          h1,
          .subheadline {
            display: none;
          }

          .cta-wrap {
            grid-template-columns: 1fr;
            margin-top: 0;
          }

          /* The card is only 250px wide here, so the label wraps onto two lines instead of
             spilling out of the card. */
          .cta-wrap .cta {
            width: 100%;
            min-width: 0;
            white-space: normal;

            .text-body-2 {
              display: block;
              font-size: 0.82rem;
              line-height: 1.3;
              white-space: normal;
              text-wrap: balance;
            }
          }

          /* Keep the collapsed hero compact: just the menu and the booking button. */
          .cta--message {
            display: none;
          }
        }
      }

      .proofs,
      .proofs-caption {
        display: none;
      }
    }
  }

  .simon {
    display: none;

    @media (min-width: tokens.$breakpoint-lg) {
      display: flex;
      align-items: center;
      min-width: 250px;
      max-width: 250px;
    }
  }

  .simon-copy {
    display: flex;
    flex-direction: column;
    flex: 0 1 auto; /* don't stretch the card to fill the screen */
    min-height: 0;

    @media #{tokens.$tablet-only} {
      flex: 0 1 auto;
    }

    @media (min-width: tokens.$breakpoint-lg) {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 2rem;
      flex: 0 1 auto;
    }

    .hero-copy {
      flex: 0 1 auto;
      min-height: 0;
      max-width: 34rem;
      padding: clamp(0.85rem, 2.4vh, 1.5rem);
      background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);
      box-shadow:
        0 0 64px color-mix(in srgb, var(--q-accent) 38%, transparent),
        0 28px 80px color-mix(in srgb, var(--q-accent) 38%, transparent);
      border: 1px solid var(--q-accent);
      border-radius: 1rem;

      @media #{tokens.$tablet-only} {
        flex: 0 1 auto;
        max-width: none;
        padding: 0;
        background: none;
        border: none;
        border-radius: 0;
        box-shadow: none;
      }

      @media (min-width: tokens.$breakpoint-lg) {
        flex: 0 1 auto;
        padding: 1.5rem;
      }

      .kicker {
        color: tokens.$champagne;
        text-transform: uppercase;
        margin-bottom: clamp(0.25rem, 0.9vh, 0.5rem);

        @media (min-width: tokens.$breakpoint-lg) {
          margin-bottom: 0.5rem;
        }
      }

      h1 {
        max-width: 26rem;
        margin-inline: auto;
        margin-bottom: clamp(0.5rem, 1.6vh, 1rem);
        color: tokens.$text;
        line-height: 1.16;
        letter-spacing: -0.025em;
        font-weight: 400;
        text-wrap: balance;

        @media (min-width: tokens.$breakpoint-lg) {
          margin-bottom: 1rem;
        }
      }

      /* Intentional break: the promise lands on its own line. */
      .fix-it {
        font-weight: 700;

        @media (min-width: tokens.$breakpoint-lg) {
          display: block;
        }
      }

      .subheadline {
        max-width: 100%;
        margin-top: clamp(0.5rem, 1.4vh, 1rem);
        color: var(--q-primary);
        line-height: 1.5;

        @media (min-width: tokens.$breakpoint-lg) {
          line-height: 1.35;
          margin-top: 1rem;
        }
      }

      .cta-wrap {
        display: grid;
        grid-template-columns: 1fr;
        margin-top: clamp(0.6rem, 1.6vh, 1rem);

        @media (min-width: tokens.$breakpoint-lg) {
          grid-template-columns: auto;
          justify-content: start;
          justify-items: start;
          gap: 0.35rem;
          margin-top: 1rem;

          .cta {
            white-space: nowrap;
          }
        }
      }
    }
  }

  .proofs {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: 1fr;
    flex: 1 1 auto;
    min-height: 0;
    gap: clamp(0.4rem, 1.1vh, 0.75rem);
    margin-top: clamp(0.6rem, 1.8vh, 1.25rem);
    font-size: 1rem;

    @media #{tokens.$tablet-only} {
      flex: 0 1 auto;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-auto-rows: auto;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }

    @media (min-width: tokens.$breakpoint-lg) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-auto-rows: auto;
      flex: 0 1 auto;
      gap: 0.75rem;
      margin-top: 1.5rem;
      font-size: 1rem;
    }

    .proof-card {
      display: flex;
      align-items: center;
      justify-content: center;
      /* Open layout: no box, so the main card stays the focal point. */
      padding: clamp(0.35rem, 1vh, 0.75rem) 0.5rem;
      border: 0;
      background: transparent;
      box-shadow: none;

      @media #{tokens.$tablet-only} {
        padding: 0.85rem 0.5rem;
        border-radius: 5px;
      }

      @media (min-width: tokens.$breakpoint-lg) {
        display: grid;
        justify-items: center;
        gap: 0.4rem;
        padding: 0.85rem 0.6rem 0.8rem;
        border-radius: 5px;
      }

      /* Small icon so the message lands before the words are read. */
      .proof-icon {
        color: var(--q-accent);
        font-size: 1.5rem;

        @media (max-width: calc(#{tokens.$breakpoint-lg} - 0.02px)) {
          margin-right: 0.6rem;
        }
      }

      .proof-label {
        display: block;
        text-align: center;
        color: var(--q-dark);
        line-height: 1.35;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        font-weight: 600;

        @media (max-width: calc(#{tokens.$breakpoint-lg} - 0.02px)) {
          font-size: 0.9rem;
          letter-spacing: 0.04em;
        }

        @media (min-width: tokens.$breakpoint-lg) {
          font-size: 0.74rem;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
      }
    }
  }
}

.tablet-expandable-menu {
  @media #{tokens.$tablet-only} {
    margin-top: 1rem;

    :deep(.q-item__section--side) {
      min-width: 0;
      padding-right: 0;
    }
  }
}

/* ---------- Hero → Loom soft edge ---------- */

.hero-fade {
  position: relative;
  z-index: 1;
  display: none; /* desktop only: phones have no fixed hero artwork to dissolve */
  height: 0;
  pointer-events: none;

  @media (min-width: tokens.$breakpoint-lg) {
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: clamp(120px, 20vh, 200px);
    background: linear-gradient(
      180deg,
      rgba(247, 249, 254, 0) 0%,
      rgba(247, 249, 254, 0.75) 55%,
      #f7f9fe 100%
    );
  }
}

/* ---------- Side rail (desktop, after the hero) ---------- */

.side-rail {
  position: fixed;
  top: 50%;
  left: 2vw;
  z-index: 6;
  transform: translateY(-50%);
}

/* ---------- Section Transition ---------- */

.section-transition {
  /* Retired: the Loom section now melds straight into the trust section (see the fades on
     .trust-section). Kept in the markup in case a divider is wanted again. */
  display: none;

  position: relative;
  z-index: 1;
  height: 28px;
  width: 100%;
  background: radial-gradient(
    120% 260% at 50% 100%,
    var(--q-accent) 0%,
    color-mix(in srgb, var(--q-dark) 88%, var(--q-accent) 12%) 38%
  );
  filter: drop-shadow(0px 3px 3px var(--q-accent));
}

/* ---------- Trust ---------- */

/* Stable viewport units, not dvh: dvh changes as a phone's address bar hides mid-scroll, which
   resized the hero and this section and shifted everything.
   On phones and tablets this is the last section (not pinned), so it fits exactly between the
   fixed header and the footer: you never land with its top hidden under the header. */
/* The photo's box. Phones and tablets: the
   top part, with the words below. Large screens: the right half, with the words on the left. */
@mixin trust-photo-box {
  position: absolute;
  top: 1.25rem;
  right: 1rem;
  bottom: auto;
  left: 1rem;
  height: 44%;

  @media #{tokens.$tablet-only} {
    top: 2.25rem;
    right: 2rem;
    left: 2rem;
  }

  @media (min-width: tokens.$breakpoint-lg) {
    top: clamp(7rem, 15vh, 10.5rem);
    right: clamp(4rem, 7vw, 9rem);
    bottom: clamp(6rem, 13vh, 9.5rem);
    left: 52%;
    height: auto;
  }
}

.trust-section {
  position: relative;
  isolation: isolate; /* so the edge fades below sit above the background, under the content */
  width: 100%;
  height: calc(100vh - 56px - 50px);
  height: calc(100svh - 56px - 50px);
  overflow: hidden;
  /* The background artwork stays, but a pale wash keeps it quiet behind the words: below the
     photo on phones, on the left half on large screens. */
  background:
    linear-gradient(
      180deg,
      rgb(242 246 254 / 0) 30%,
      rgb(242 246 254 / 0.9) 52%,
      rgb(242 246 254 / 0.96) 100%
    ),
    url('../assets/trust-section-background.avif') center 46% / cover no-repeat;

  @media (min-width: tokens.$breakpoint-lg) {
    background:
      linear-gradient(
        90deg,
        rgb(242 246 254 / 0.96) 0%,
        rgb(242 246 254 / 0.9) 42%,
        rgb(242 246 254 / 0.35) 58%,
        rgb(242 246 254 / 0) 72%
      ),
      url('../assets/trust-section-background.avif') center 46% / cover no-repeat;
  }

  @media (min-width: tokens.$breakpoint-lg) {
    height: 100vh;
    height: 100svh;
  }

  /* Soft edges: the background fades in from the Loom section's colour at the top and out to
     the closing section's colour at the bottom, so the three read as one surface. */
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    z-index: -1;
    pointer-events: none;
  }

  &::before {
    top: 0;
    height: 24%;
    background: linear-gradient(
      180deg,
      #eef3fd 0%,
      rgba(238, 243, 253, 0.7) 40%,
      rgba(238, 243, 253, 0) 100%
    );
  }

  &::after {
    bottom: 0;
    height: 26%;
    background: linear-gradient(
      0deg,
      #f2f6fe 0%,
      rgba(242, 246, 254, 0.75) 40%,
      rgba(242, 246, 254, 0) 100%
    );
  }

  .trust-viewport {
    z-index: 1;
    overflow: hidden;
    border-radius: 1.25rem;
    background-color: #e8eefb;
    /* A thin outline and a soft drop shadow, like the other cards on the site. */
    box-shadow:
      0 0 0 1px rgb(18 60 140 / 0.1),
      0 6px 18px -8px rgb(10 30 60 / 0.12),
      0 30px 64px -30px rgb(10 30 60 / 0.32);

    @include trust-photo-box;
  }

  .trust-text {
    position: absolute;
    top: calc(44% + 1.25rem);
    right: 1.5rem;
    bottom: 1.25rem;
    left: 1.5rem;
    z-index: 2;

    @media #{tokens.$tablet-only} {
      top: calc(44% + 4.5rem);
      right: 3rem;
      bottom: 2.25rem;
      left: 3rem;
    }

    @media (min-width: tokens.$breakpoint-lg) {
      /* The free space between the menu rail and the photo; the copy block is centred in it. */
      top: clamp(7rem, 15vh, 10.5rem);
      right: calc(48% + 2rem);
      bottom: clamp(6rem, 13vh, 9.5rem);
      left: clamp(10rem, 13vw, 16rem);
    }
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

    /* A pale, cool wash: soft morning light rather than a dark vignette. */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: linear-gradient(
        180deg,
        rgb(238 243 253 / 0.22) 0%,
        rgb(238 243 253 / 0.08) 45%,
        rgb(238 243 253 / 0.14) 100%
      );
    }
  }

  .trust-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 42% 40%;
    filter: saturate(0.82) contrast(0.9) brightness(1.12);
  }

  .trust-image-wrap--b {
    opacity: 0;
  }

  .trust-copy {
    opacity: 0;
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    color: #0b1f2e;
    font-size: clamp(1.45rem, 5.4vw, 1.8rem);
    font-weight: 600;
    line-height: 1.12;
    letter-spacing: -0.025em;
    will-change: transform, opacity;

    @media (min-width: tokens.$breakpoint-lg) {
      right: 0;
      left: 0;
      width: min(100%, 31rem);
      margin-inline: auto;
      font-size: clamp(1.9rem, 2.6vw, 2.6rem);
    }

    .trust-fill {
      color: #1260f0;
    }

    .eyebrow {
      margin-bottom: 0.9rem;
      color: #1260f0;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      line-height: 1.4;
      text-transform: uppercase;

      @media (min-width: tokens.$breakpoint-lg) {
        margin-bottom: 1.2rem;
        font-size: 0.78rem;
      }
    }

    p {
      margin: 0;
      max-width: 20ch;
      text-wrap: balance;
    }

    .trust-support {
      max-width: 44ch;
      margin-top: 1rem;
      color: rgb(11 31 46 / 0.68);
      font-size: 0.98rem;
      font-weight: 400;
      letter-spacing: 0;
      line-height: 1.6;
      text-wrap: pretty;

      @media (min-width: tokens.$breakpoint-lg) {
        margin-top: 1.5rem;
        font-size: clamp(1rem, 1.1vw, 1.12rem);
      }
    }

    /* Short phones: a more compact block. */
    @media (max-height: 760px) and (max-width: tokens.$breakpoint-lg) {
      font-size: clamp(1.25rem, 4.8vw, 1.5rem);

      .eyebrow {
        margin-bottom: 0.5rem;
        font-size: 0.68rem;
      }

      .trust-support {
        margin-top: 0.6rem;
        font-size: 0.86rem;
        line-height: 1.5;
      }
    }
  }

  /* Warm light from the window (upper right of the photo). Its opacity rises and falls with
     the breath once the second message shows. */
  .trust-light {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.2;
    background: radial-gradient(
      48% 58% at 74% 30%,
      rgb(255 228 186 / 0.7) 0%,
      rgb(255 228 186 / 0.25) 50%,
      rgb(255 228 186 / 0) 100%
    );
    mix-blend-mode: screen;
    will-change: opacity;
  }

  /* The breath line: runs from under the words to the photo's edge. Two waves crossfade: short
     and choppy while the breath is held, long and slow once it's let go. Each drifts left on a
     loop (2400px of wave, repeating every 1200px). */
  .trust-line {
    display: none;

    @media (min-width: tokens.$breakpoint-lg) {
      position: absolute;
      right: -2rem;
      bottom: 6%;
      left: calc(50% - min(50%, 15.5rem));
      display: block;
      height: 64px;
      overflow: hidden;
      pointer-events: none;
      mask-image: linear-gradient(90deg, transparent 0%, #000 18%);
      -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 18%);
    }
  }

  .trust-line__wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 2400px;
    height: 64px;
    transition: opacity 1.4s ease;
    will-change: transform;

    path {
      fill: none;
      stroke: #1260f0;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }

    &--held {
      opacity: 0.5;
      animation: breath-drift 44s linear infinite;
    }

    &--calm {
      opacity: 0;
      animation: breath-drift 40s linear infinite;

      path {
        stroke-width: 2.25;
      }
    }
  }

  .trust-line.is-calm {
    .trust-line__wave--held {
      opacity: 0;
    }

    .trust-line__wave--calm {
      opacity: 0.75;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trust-line__wave {
      animation: none;
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
    /* Barely there now: a soft inner edge, not a dark vignette. */
    box-shadow: inset 0 0 90px 10px rgba($dark, 0.14);
  }

  .trust-frame {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    border: 1px solid rgb(255 255 255 / 0.4);
    border-radius: 1.25rem;
  }

  /* Frosted pill on the right edge; fades in once the autoplay finishes. */
  .trust-steps {
    position: absolute;
    top: 50%;
    right: 0.5rem;
    z-index: 4;
    display: grid;
    justify-items: center;
    gap: 0.35rem;
    padding: 0.35rem;
    border: 1px solid rgb(255 255 255 / 0.4);
    border-radius: 999px;
    background: rgb(255 255 255 / 0.18);
    backdrop-filter: blur(8px);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-50%) translateX(6px);
    transition:
      opacity 0.5s ease,
      transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

    &.is-on {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(-50%);
    }
  }

  .trust-steps__btn {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: rgb(255 255 255 / 0.14);
    color: tokens.$ivory;
    cursor: pointer;
    transition:
      background 0.2s ease,
      opacity 0.2s ease;

    svg {
      width: 1.1rem;
      height: 1.1rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }

    &:not(:disabled):active {
      background: rgb(255 255 255 / 0.28);
    }

    &:focus-visible {
      outline: 2px solid tokens.$champagne;
      outline-offset: 2px;
    }
  }

  .trust-steps__dots {
    display: grid;
    gap: 0.3rem;

    i {
      width: 0.35rem;
      height: 0.35rem;
      border-radius: 50%;
      background: rgb(255 255 255 / 0.35);
      transition: background 0.3s ease;

      &.on {
        background: tokens.$champagne;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trust-steps {
      transition: none;
    }
  }

  .trust-cue {
    position: absolute;
    bottom: 16%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    opacity: 0;
    color: tokens.$ivory;
    margin-top: 1rem;
  }
}

.panel-skeleton {
  height: clamp(320px, 60vh, 720px);
}

/* ---------- Keyframes ---------- */

@keyframes breath-drift {
  to {
    transform: translateX(-1200px);
  }
}

@keyframes bg-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
