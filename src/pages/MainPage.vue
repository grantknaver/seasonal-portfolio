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

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/* Flip to true to log the exact timeline position of every dropped frame. */
const DEBUG_JANK = false;
if (DEBUG_JANK) gsap.ticker.lagSmoothing(0);

/* ---------- Trust intro choreography (desktop) ----------
   Tune these four numbers to retime the whole pinned entrance. */
const VIEWPORT_DROP = 40; // px the framed viewport rests below its final position
const NAV_AT = 0.85; // when the menu buttons start popping in
const COPY_AT = 1.2; // when the first line of copy starts
const COPY_STAGGER = 0.2; // gap between each line, top to bottom

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
const trustGlowRef = ref<HTMLElement | null>(null);
const trustImageA = ref<HTMLElement | null>(null);
const trustImageB = ref<HTMLElement | null>(null);
const trustCopyA = ref<HTMLElement | null>(null);
const trustCopyB = ref<HTMLElement | null>(null);
const clarityCueRef = ref<HTMLElement | null>(null);
const trustCueRef = ref<HTMLElement | null>(null);
const trustBeamRef = ref<HTMLElement | null>(null);

/* ---------- Lifecycle-scoped GSAP state ---------- */

let heroCtx: gsap.Context | null = null;
let sceneCtx: gsap.Context | null = null;
let disposed = false;
let verified = false;

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

  let released = false;
  return () => {
    if (released) return;
    released = true;
    window.removeEventListener('wheel', stop);
    window.removeEventListener('touchmove', stop);
    window.removeEventListener('keydown', stopKeys);
  };
};

const setBeamRunning = (running: boolean) => {
  const span = trustBeamRef.value?.querySelector<HTMLElement>('span');
  if (span) span.style.animationPlayState = running ? 'running' : 'paused';
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
  const proofEls = Array.from(el.querySelectorAll<HTMLElement>('.proof-card'));

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
    return;
  }

  const { heroCopyEl, kickerEl, simonEl, headlineEl, subheadlineEl, ctaEls, proofEls, els } = t;

  heroCtx?.revert();
  heroCtx = gsap.context(() => {
    /* Resize / breakpoint swap: no replay, just a clean visible layout. */
    if (!animate || prefersReducedMotion) {
      gsap.set(els, { clearProps: 'all' });
      if (heroCopyEl) gsap.set(heroCopyEl, { clearProps: 'all' });
      release();
      verifyOnce();
      return;
    }

    /* Promote once, up front — not element-by-element as each tween starts. */
    gsap.set(els, { willChange: 'transform, opacity', force3D: true });

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        gsap.set(els, { willChange: 'auto' });
        if (heroCopyEl) gsap.set(heroCopyEl, { willChange: 'auto', clearProps: 'transform' });
        verifyOnce();
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

      if (simonEl) {
        tl.fromTo(simonEl, { autoAlpha: 0, x: -32 }, { autoAlpha: 1, x: 0, duration: 0.9 }, 1.05);
      }

      if (proofEls.length) {
        tl.fromTo(
          proofEls,
          { x: -16, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.45, stagger: 0.18 },
          1.3,
        );
      }
    }

    release(); // ← curtain up, frame zero is already written
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
    const beam = trustBeamRef.value;

    if (!(section && imgA && imgB && copyA && copyB && glow)) return;

    /* Don't burn cycles spinning the conic gradient before it's visible. */
    setBeamRunning(false);
    gsap.set(imgB, { opacity: 0 });
    gsap.set(glow, { opacity: 0, scale: 1.18 });
    if (cue) gsap.set(cue, { opacity: 0 });

    if (isResponsive.value) {
      /* ---------- Mobile: autoplay on entry ---------- */
      gsap.set([copyA, copyB], { opacity: 0 });

      const mobileTl = gsap
        .timeline({
          paused: true,
          onComplete: () => {
            gsap.set([copyA, copyB], { willChange: 'auto' });
          },
        })
        .to(glow, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0)
        .to(beam, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.5)
        .to(copyA, { opacity: 1, duration: 1.1, ease: 'power1.out' }, 1.2)
        .to(copyA, { opacity: 0, duration: 0.8, ease: 'power1.in' }, 4.2)
        .to(imgA, { opacity: 0, duration: 0.9, ease: 'none' }, 4.6)
        .to(imgB, { opacity: 1, duration: 0.9, ease: 'none' }, 4.6)
        .to(copyB, { opacity: 1, duration: 1.1, ease: 'power1.out' }, 5.2);

      const trustIo = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          trustIo.disconnect();

          /* Decode both frames before playing — the A→B crossfade is where it used to hitch. */
          void decodeImagesIn(section).then(() => {
            if (disposed) return;
            setBeamRunning(true);
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

    let introPlayed = false;
    let scrubBuilt = false;

    const trustTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1500',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        onEnter: () => {
          if (introPlayed) return;
          introPlayed = true;

          const unlock = lockScroll();

          const introTl = gsap.timeline({
            paused: true,
            onComplete: () => {
              unlock();
              clearIntroHints();
              if (scrubBuilt) return;
              scrubBuilt = true;

              trustTl
                .fromTo(
                  section,
                  { backgroundPositionY: '46%' },
                  {
                    backgroundPositionY: '56%',
                    ease: 'none',
                    duration: 2.4,
                    immediateRender: false,
                  },
                  0,
                )
                .fromTo(
                  cue,
                  { opacity: 1 },
                  { opacity: 0, ease: 'none', duration: 0.4, immediateRender: false },
                  0.1,
                )
                .fromTo(
                  copyA,
                  { opacity: 1 },
                  { opacity: 0, ease: 'none', duration: 0.9, immediateRender: false },
                  0.2,
                )
                .fromTo(
                  imgB,
                  { opacity: 0 },
                  { opacity: 1, ease: 'none', duration: 0.8, immediateRender: false },
                  0.7,
                )
                .fromTo(
                  copyB,
                  { opacity: 0 },
                  { opacity: 1, ease: 'none', duration: 1.1, immediateRender: false },
                  1.0,
                )
                .fromTo(
                  glow,
                  { opacity: 1, scale: 1 },
                  {
                    opacity: 0,
                    scale: 1.25,
                    ease: 'none',
                    duration: 0.9,
                    immediateRender: false,
                  },
                  1.5,
                );
            },
          });

          /* 1. The framed viewport rises into its resting position. */
          if (viewport) {
            introTl.to(viewport, { y: 0, duration: 1.15, ease: 'power3.out', force3D: true }, 0);
          }

          /* Ambience rides along with the lift. */
          introTl
            .fromTo(
              glow,
              { opacity: 0, scale: 1.18 },
              { opacity: 1, scale: 1, duration: 1.25, ease: 'power2.out' },
              0,
            )
            .fromTo(beam, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0.55);

          /* 2. Menu buttons pop in. */
          if (navTargets.length) {
            introTl.to(
              navTargets,
              usesNavItems
                ? {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.55,
                    ease: 'back.out(1.8)',
                    stagger: 0.08,
                  }
                : { autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
              NAV_AT,
            );
          }

          /* 3. Copy comes in line by line, top to bottom. */
          if (copyALines.length) {
            introTl.to(
              copyALines,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
                ease: 'power2.out',
                stagger: COPY_STAGGER,
              },
              COPY_AT,
            );
          } else {
            introTl.to(copyA, { opacity: 1, duration: 1, ease: 'power1.out' }, COPY_AT);
          }

          /* 4. Scroll cue last, once the frame has settled. */
          const cueAt = COPY_AT + COPY_STAGGER * Math.max(copyALines.length - 1, 0) + 0.55;
          if (cue) {
            introTl.fromTo(
              cue,
              { opacity: 0 },
              { opacity: 1, duration: 0.6, ease: 'power1.out' },
              cueAt,
            );
          }

          /* Decode both trust frames + settle one frame before the intro plays. */
          void decodeImagesIn(section)
            .then(twoFrames)
            .then(() => {
              if (disposed) {
                unlock();
                if (viewport) gsap.set(viewport, { y: 0, willChange: 'auto' });
                return;
              }
              setBeamRunning(true);
              watchJank(introTl, 'trust-desktop');
              introTl.play();
            });
        },
      },
    });
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
  }

  /* 4. One late refresh once every image/font has settled. Never mid-tween. */
  if (document.readyState === 'complete') {
    ScrollTrigger.refresh();
  } else {
    window.addEventListener('load', () => !disposed && ScrollTrigger.refresh(), { once: true });
  }
});

onBeforeUnmount(() => {
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
            <span class="proof-label">VALUE UNDERSTOOD</span>
          </div>
          <div class="proof-card">
            <span class="proof-label"> DIFFERENCE SEEN</span>
          </div>
          <div class="proof-card">
            <span class="proof-label">NEXT STEP CLEAR</span>
          </div>
        </div>
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
      <div ref="clarityCueRef" class="clarity-cue"><ScrollCue /></div>
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
    <div class="section-transition"></div>
    <section ref="trustSectionRef" class="trust-section">
      <div ref="trustViewportRef" class="trust-viewport">
        <div ref="trustImageA" class="trust-image-wrap">
          <img src="../assets/trust-breathing-in.avif" alt="" class="trust-image" />
        </div>

        <div ref="trustImageB" class="trust-image-wrap trust-image-wrap--b">
          <img src="../assets/trust-breathing-out.avif" alt="" class="trust-image" />
        </div>

        <div ref="trustCopyA" class="trust-copy">
          <span class="eyebrow">CLEAR PLATFORMS. LEGIBLE AI.</span>
          <p>WHAT PEOPLE UNDERSTAND, THEY CAN TRUST.</p>
          <p class="trust-support">
            Make the value and behavior of any platform clear-especially AI products, where trust
            depends on making the system’s reasoning, limits, and behavior easier to understand.
          </p>
        </div>

        <div ref="trustCopyB" class="trust-copy">
          <p>TRUST GIVES PEOPLE ROOM TO MOVE <span class="forward">FORWARD</span></p>
        </div>
        <div ref="trustGlowRef" class="trust-glow" aria-hidden="true"></div>
        <div ref="trustCueRef" class="trust-cue">
          <ScrollCue :is-dark="false" :has-text="false" />
        </div>
        <div class="trust-frame" aria-hidden="true">
          <span class="trust-corner trust-corner--tl"></span>
          <span class="trust-corner trust-corner--tr"></span>
          <span class="trust-corner trust-corner--bl"></span>
          <span class="trust-corner trust-corner--br"></span>
          <span class="trust-signal"></span>
        </div>
        <div ref="trustBeamRef" class="trust-beam" aria-hidden="true"><span></span></div>
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
    min-height: calc(100dvh - 88px);
    padding-block: 2rem;
    max-width: none;
  }

  @media (min-width: tokens.$breakpoint-lg) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100dvh;
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
  min-height: calc(100dvh - 88px - 3rem);
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

          .cta {
            width: 100%;
          }
        }
      }

      .proofs {
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
    flex: 1 1 auto;
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
      flex: 1 1 auto;
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

      .subheadline {
        max-width: 100%;
        margin-top: clamp(0.5rem, 1.4vh, 1rem);
        color: var(--q-secondary);
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
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          margin-top: 1rem;
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
      display: grid;
      align-items: center;
      padding: clamp(0.55rem, 1.7vh, 1.5rem);
      border: 1px solid color-mix(in srgb, var(--q-accent) 38%, transparent);
      background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);
      box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);

      @media #{tokens.$tablet-only} {
        padding: 0.85rem 0.5rem;
        border-radius: 5px;
      }

      @media (min-width: tokens.$breakpoint-lg) {
        display: block;
        border-radius: 5px;
      }

      .proof-label {
        display: block;
        text-align: center;
        color: tokens.$champagne;
        line-height: 1;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 300;
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

/* ---------- Section Transition ---------- */

.section-transition {
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

.trust-section {
  position: relative;
  width: 100%;
  height: calc(100dvh - 88px);
  overflow: hidden;
  background: url('../assets/trust-section-background.avif') center 46% / cover no-repeat;

  @media (min-width: tokens.$breakpoint-lg) {
    height: 100dvh;
  }

  .trust-viewport {
    position: absolute;
    top: 1.25rem;
    right: 1rem;
    bottom: 1.25rem;
    left: 1rem;
    overflow: hidden;
    border-radius: 1.25rem;
    background-color: black;

    @media #{tokens.$tablet-only} {
      top: 2.25rem;
      right: 2rem;
      bottom: 2.25rem;
      left: 2rem;
    }

    @media (min-width: tokens.$breakpoint-lg) {
      top: clamp(5.4rem, 10.8vh, 8.4rem);
      right: clamp(8.2rem, 13.8vw, 13.2rem);
      bottom: clamp(4.2rem, 8.4vh, 7.2rem);
      left: clamp(8rem, 13.8vw, 16.2rem);
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

  .trust-image-wrap--b {
    opacity: 0;
  }

  .trust-copy {
    opacity: 0;
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: 2rem;
    text-align: center;
    color: tokens.$ivory;
    font-size: clamp(1.4rem, 4.6vw, 1.9rem);
    line-height: 1.2;
    will-change: transform, opacity;
    text-shadow: 2px 2px 10px var(--q-dark);

    @media (min-width: tokens.$breakpoint-lg) {
      font-size: clamp(1.9rem, 2.8vw, 2.5rem);
    }

    .forward {
      color: tokens.$ivory;
    }

    .eyebrow {
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      line-height: 1.4;
      margin-bottom: 1.1rem;
      color: tokens.$champagne;
      text-shadow: 1px 1px 1px var(--q-dark);
      @media (min-width: tokens.$breakpoint-lg) {
        font-size: 0.85rem;
      }
    }

    p {
      margin: 0;
      max-width: 24ch;
    }

    .trust-support {
      font-size: clamp(0.9rem, 1.1vw, 1.05rem);
      line-height: 1.65;
      max-width: 56ch;
      margin-top: 1.5rem;
      color: rgb(from tokens.$ivory r g b / 0.78);
      text-shadow: 1px 1px 6px var(--q-dark);
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
      inset 0 0 70px 20px rgba($dark, 0.8),
      inset 0 0 160px 90px rgba($accent-deep, 0.4);
  }

  .trust-frame {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    border: 5px solid var(--q-accent);
    border-radius: 1.25rem;
  }

  .trust-beam {
    position: absolute;
    inset: 0;
    z-index: 3;
    padding: 5px;
    border-radius: 1.25rem;
    overflow: hidden;
    pointer-events: none;
    opacity: 0;
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 170%;
      aspect-ratio: 1;
      translate: -50% -50%;
      animation: beam-spin 9s linear infinite;
      background: conic-gradient(
        from 0deg,
        rgb(from $primary r g b / 0) 0deg,
        rgb(from $primary r g b / 0) 296deg,
        rgb(from $primary r g b / 0.55) 338deg,
        rgb(from $primary r g b / 0.95) 352deg,
        rgb(from $primary r g b / 0) 360deg
      );
    }
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
      @media (min-width: tokens.$breakpoint-lg) {
        border-top-width: 2.5vw;
        border-right-width: 2.5vw;
      }
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
      @media (min-width: tokens.$breakpoint-lg) {
        border-bottom-width: 2.5vw;
        border-left-width: 2.5vw;
      }
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
      animation: signal-blink 3.4s ease-in-out infinite;
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

@keyframes signal-blink {
  0%,
  100% {
    opacity: 1;
  }
  46% {
    opacity: 1;
  }
  52% {
    opacity: 0.25;
  }
  58% {
    opacity: 1;
  }
}

@keyframes beam-spin {
  to {
    rotate: 360deg;
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
