<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useViewport } from 'src/shared/utils/viewWidth';
import { SAMPLE_SNAPSHOT_URL } from 'src/shared/constants/sampleSnapshot';
import { openTeardownBooking } from '../shared/constants/booking';

/* The close of the page. Left: what the free Decision Snapshot is, in four steps, and the one
   button to get it. Right: what can happen after it (diagnose or build), as a small interactive
   route. */
const emit = defineEmits<{ message: [] }>();

gsap.registerPlugin(ScrollTrigger);
const { lgBreakpoint } = useViewport();

type Mode = 'unclear' | 'clear';
type NodeState = 'on' | 'maybe' | 'skip' | 'off';

const modes: { key: Mode; label: string }[] = [
  { key: 'unclear', label: 'It’s not clear what’s wrong' },
  { key: 'clear', label: 'We know what needs fixing' },
];

/* What a Decision Snapshot is, start to finish. */
/* What's in the Snapshot, spelled out. */
const gets = [
  '2–3 highest-leverage issues',
  'One annotated screenshot',
  '1–3 pattern directions',
  'The next decision',
];

const steps = [
  'You send one screen, flow, or AI feature.',
  'I review it before we meet.',
  'We walk through what matters most, live.',
];

const nodes = [
  { key: 'teardown', title: 'Decision Snapshot', meta: 'Free' },
  { key: 'diag', title: 'Diagnostic', meta: 'If it’s unclear' },
  { key: 'build', title: 'Build the fix', meta: 'If it’s clear' },
] as const;

/* What each answer lights up, and what it means in plain words. */
const routes: Record<Mode, { states: [NodeState, NodeState, NodeState]; caption: string }> = {
  unclear: {
    states: ['on', 'on', 'maybe'],
    caption:
      'The Diagnostic pins down what’s wrong and what to change first. It can stand on its own, or I carry it into the build.',
  },
  clear: {
    states: ['on', 'skip', 'on'],
    caption:
      'No Diagnostic needed. I build the fix: UI and interaction work, frontend, motion, workflow, and trust and AI-legibility improvements.',
  },
};

const mode = ref<Mode>('unclear');
/* Signal that the card is interactive: option rows that look like choices, a "your turn" hint,
   and a one-time pointer demo when the card first lands. */
const interacted = ref(false);
const hinting = ref(false);
const panelRef = ref<HTMLElement | null>(null);
const cursorRef = ref<HTMLElement | null>(null);
let demoTl: gsap.core.Timeline | null = null;
let demoPlayed = false;

/* Show, don't tell: when the card first lands, a pointer picks two answers so people see the
   route react, then hands over. Stops the moment someone interacts. */
const setMode = (m: Mode) => {
  mode.value = m;
  void nextTick(() => bounceLit());
};
const startHint = () => {
  hinting.value = true;
  if (demoPlayed || interacted.value) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const panel = panelRef.value;
  const cursor = cursorRef.value;
  const opts = panel?.querySelectorAll<HTMLElement>('.mode');
  if (!panel || !cursor || !opts || opts.length < 2) return;
  demoPlayed = true;
  const at = (i: number) => {
    const p = panel.getBoundingClientRect();
    const r = opts[i]!.getBoundingClientRect();
    return { x: r.left - p.left + r.width * 0.72, y: r.top - p.top + r.height * 0.55 };
  };
  const press = (i: number) =>
    gsap
      .timeline()
      .to(cursor, { scale: 0.82, duration: 0.12, ease: 'power2.in' })
      .call(() => {
        opts[i]!.classList.add('is-pressed');
        setMode(modes[i]!.key);
      })
      .to(cursor, { scale: 1, duration: 0.25, ease: 'back.out(3)' })
      .call(() => opts[i]!.classList.remove('is-pressed'), undefined, '+=0.1');
  const start = at(1);
  demoTl = gsap
    .timeline({ delay: 0.5 })
    .set(cursor, { x: start.x + 60, y: start.y + 70, autoAlpha: 0, scale: 1 })
    .to(cursor, { autoAlpha: 1, duration: 0.3 })
    .to(cursor, { x: start.x, y: start.y, duration: 0.7, ease: 'power3.inOut' }, '<')
    .add(press(1))
    .to(cursor, { x: at(0).x, y: at(0).y, duration: 0.7, ease: 'power3.inOut' }, '+=1.3')
    .add(press(0))
    .to(cursor, { autoAlpha: 0, y: '+=20', duration: 0.4 }, '+=0.6');
};
const stopDemo = () => {
  if (!demoTl) return;
  demoTl.kill();
  demoTl = null;
  if (cursorRef.value) gsap.to(cursorRef.value, { autoAlpha: 0, duration: 0.2 });
};
const route = computed(() => routes[mode.value]);

const rootRef = ref<HTMLElement | null>(null);
const nodesRef = ref<HTMLElement | null>(null);

/* A small bounce on the steps that light up when the answer changes. On the dots, so it never
   collides with the node's scroll-driven entrance. */
const bounceLit = () => {
  const lit = nodesRef.value?.querySelectorAll<HTMLElement>(
    '.node.is-on .node__dot, .node.is-maybe .node__dot',
  );
  if (!lit?.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.fromTo(
    lit,
    { scale: 0.8 },
    { scale: 1, duration: 0.6, ease: 'back.out(2.6)', stagger: 0.08, overwrite: 'auto' },
  );
};
const choose = async (m: Mode) => {
  interacted.value = true;
  stopDemo();
  if (m === mode.value) return;
  mode.value = m;
  await nextTick();
  bounceLit();
};

/* Line up with the glkFreelance logo on desktop, like the Loom section. */
const logoGutter = ref<string | undefined>(undefined);
const measureLogo = () => {
  const logo = [...document.querySelectorAll<HTMLElement>('.logo-text')].find(
    (el) => el.getBoundingClientRect().width > 0,
  );
  logoGutter.value = logo ? `${Math.round(logo.getBoundingClientRect().right)}px` : undefined;
};

let ctx: gsap.Context | null = null;
let mm: gsap.MatchMedia | null = null;
let enterIo: IntersectionObserver | null = null;

/* Desktop: like the Loom section, everything is tied to the scroll and reverses when you scroll
   back up. As the section rises, the eyebrow and headline arrive. Then it holds for about a
   screen while the lead and button come in, and only after that the card slides in from the
   right and its route draws. The grid and glow drift in behind it. */
const holdLength = () => Math.round(window.innerHeight * 1.1);

const buildScrub = (root: HTMLElement) => {
  const q = (sel: string) => root.querySelector<HTMLElement>(sel);
  const eyebrow = q('.closing__eyebrow');
  const title = q('.closing__title');
  const rest = [
    ...root.querySelectorAll<HTMLElement>('.closing__steps > li'),
    q('.closing__cta'),
    q('.closing__meta'),
  ].filter((el): el is HTMLElement => !!el);

  /* 1. Rising: the headline arrives, so the section never scrolls in empty. */
  const rise = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: root,
      start: 'top 80%',
      end: 'top 10%',
      scrub: 0.6,
      refreshPriority: -3, // measured after every pin above it
    },
  });
  if (eyebrow)
    rise.fromTo(eyebrow, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
  if (title)
    rise.fromTo(title, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.15);

  /* 2. The hold: the rest of the copy, a beat, then the card and its route. */
  const hold = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${holdLength()}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.6,
      refreshPriority: -3,
      invalidateOnRefresh: true,
    },
  });
  if (rest.length) {
    hold.fromTo(
      rest,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.14 },
      0,
    );
  }
  hold
    .fromTo(
      '.closing__panel',
      { autoAlpha: 0, x: 180, rotate: 2 },
      { autoAlpha: 1, x: 0, rotate: 0, duration: 0.5 },
      0.75,
    )
    .fromTo(
      '.node',
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.22, stagger: 0.1, ease: 'back.out(2)' },
      1.1,
    )
    .fromTo('.link__fill', { scaleX: 0 }, { scaleX: 1, duration: 0.18, stagger: 0.1 }, 1.2)
    .fromTo(
      '.try-note__text',
      { autoAlpha: 0, x: -8 },
      { autoAlpha: 1, x: 0, duration: 0.15 },
      1.28,
    )
    .fromTo(
      '.try-note__line, .try-note__head',
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.15, stagger: 0.08 },
      1.3,
    )
    .call(startHint, undefined, 1.4)
    .to({}, { duration: 0.35 }); // rest on the finished state

  /* 3. Depth: the grid and one soft glow drift in across the rise and the hold. */
  const drift = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top bottom',
      end: () => `+=${window.innerHeight + holdLength()}`,
      scrub: true,
      refreshPriority: -3,
      invalidateOnRefresh: true,
    },
  });
  drift
    .fromTo('.closing__grid', { y: 120 }, { y: 0 }, 0)
    .fromTo('.closing__glow', { translate: '0px 240px' }, { translate: '0px 0px' }, 0);
};

/* Phones (and if the scroll trigger can't run): a one-time entrance when it's on screen, in
   the same order. */
const buildOnce = (root: HTMLElement) => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  tl.fromTo(
    '.closing__copy > *',
    { autoAlpha: 0, y: 26 },
    { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, clearProps: 'transform' },
  )
    .fromTo(
      '.closing__panel',
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.8, clearProps: 'transform' },
      0.45,
    )
    .fromTo(
      '.node',
      { autoAlpha: 0, scale: 0.8 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(2)',
        stagger: 0.14,
        clearProps: 'opacity,visibility,transform',
      },
      0.8,
    )
    .fromTo(
      '.link__fill',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: 'power2.inOut', stagger: 0.14 },
      1,
    );

  enterIo = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        enterIo?.disconnect();
        tl.eventCallback('onComplete', startHint);
        tl.play();
      }
    },
    { threshold: 0.2 },
  );
  enterIo.observe(root);
};

onMounted(() => {
  measureLogo();
  window.addEventListener('resize', measureLogo);
  if ('fonts' in document) void document.fonts.ready.then(measureLogo);

  const root = rootRef.value;
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  ctx = gsap.context(() => {
    mm = gsap.matchMedia();
    mm.add(`(min-width: ${lgBreakpoint}px)`, () => buildScrub(root));
    mm.add(`(max-width: ${lgBreakpoint - 0.02}px)`, () => {
      if ('IntersectionObserver' in window) buildOnce(root);
    });
  }, root);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureLogo);
  enterIo?.disconnect();
  demoTl?.kill();
  mm?.revert();
  ctx?.revert();
});
</script>

<template>
  <section
    ref="rootRef"
    class="closing"
    :style="logoGutter ? { '--logo-x': logoGutter } : undefined"
    aria-labelledby="closing-title"
  >
    <span class="closing__grid" aria-hidden="true"></span>
    <span class="closing__glow" aria-hidden="true"></span>
    <div class="closing__inner">
      <div class="closing__copy">
        <p class="closing__eyebrow q-ma-none">The free Decision Snapshot</p>
        <h2 id="closing-title" class="closing__title q-ma-none">
          Show me one surface. I’ll show you where people get stuck.
        </h2>
        <ol class="closing__steps q-ma-none">
          <li v-for="st in steps" :key="st">{{ st }}</li>
          <li class="closing__steps-last">
            Within 24 hours, you get a short Snapshot with:
            <ul class="gets q-ma-none">
              <li v-for="g in gets" :key="g">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
                <span
                  ><b>{{ g }}</b></span
                >
              </li>
            </ul>
            <a class="closing__sample" :href="SAMPLE_SNAPSHOT_URL" target="_blank" rel="noopener"
              >See a sample first <span aria-hidden="true">&rarr;</span></a
            >
          </li>
        </ol>
        <div class="closing__cta">
          <button type="button" class="closing__book" @click="openTeardownBooking()">
            Get my free Decision Snapshot <span aria-hidden="true">&rarr;</span>
          </button>
          <button type="button" class="closing__msg" @click="emit('message')">
            or send me a message
          </button>
        </div>
        <p class="closing__meta q-ma-none">
          Free · 20 minutes. If I don’t see anything meaningful enough to pursue, I’ll tell you.
        </p>
      </div>

      <div ref="panelRef" class="closing__panel" @pointerdown="stopDemo">
        <!-- Outside the card: a quiet hand-drawn note pointing into the answers. -->
        <div class="try-note" aria-hidden="true">
          <span class="try-note__text">Try it: pick your situation</span>
          <svg class="try-note__arrow" viewBox="0 0 60 50">
            <path class="try-note__line" pathLength="1" d="M52 6 C 34 4, 14 12, 12 40" />
            <path class="try-note__head" pathLength="1" d="M4 32 L12 42 L20 33" />
          </svg>
        </div>
        <p class="closing__after q-ma-none">After your Decision Snapshot</p>
        <h3 id="closing-q" class="closing__q q-ma-none">
          If the problem is unclear, we diagnose it. If it’s already clear, we build the fix.
        </h3>
        <div class="modes" role="radiogroup" aria-labelledby="closing-q">
          <button
            v-for="m in modes"
            :key="m.key"
            type="button"
            role="radio"
            class="mode"
            :class="{ 'is-active': mode === m.key }"
            :aria-checked="mode === m.key"
            @click="choose(m.key)"
          >
            <span class="mode__dot" aria-hidden="true"></span>
            {{ m.label }}
          </button>
        </div>
        <!-- Demo pointer (decorative). -->
        <span ref="cursorRef" class="demo-cursor" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 3l14 8-6.2 1.6L10 19z" /></svg>
        </span>

        <!-- The route: three steps, joined. A skipped Diagnostic gets a bypass arc. -->
        <div
          ref="nodesRef"
          class="route"
          :class="`route--${mode}`"
          aria-live="polite"
          :aria-label="`Your route: ${route.caption}`"
        >
          <template v-for="(n, i) in nodes" :key="n.key">
            <div class="node" :class="`is-${route.states[i]}`">
              <span class="node__dot" aria-hidden="true">
                <svg v-if="route.states[i] === 'on'" viewBox="0 0 24 24">
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
              </span>
              <b>{{ n.title }}</b>
              <small>{{ route.states[i] === 'skip' ? 'Skipped' : n.meta }}</small>
            </div>
            <span
              v-if="i < nodes.length - 1"
              class="link"
              :class="`is-${route.states[i + 1] === 'skip' ? 'skip' : route.states[i + 1]}`"
              aria-hidden="true"
            >
              <span class="link__fill"></span>
            </span>
          </template>
          <span class="bypass" aria-hidden="true"></span>
        </div>

        <p class="closing__caption q-ma-none">{{ route.caption }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../css/tokens' as tokens;

$ink: #0b1f2e;
$navy: #0a3487;
$blue: #1260f0;
$sky: #5b93ff;
$white: #0b1f2e; /* main text */
$muted: rgba(11, 31, 46, 0.66);
$line: rgba(18, 96, 240, 0.18);
$ease: cubic-bezier(0.22, 1, 0.36, 1);
$bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* The close, in the same light family as the Loom section: pale blue, a faint grid, one soft glow. */
.closing {
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: clamp(4rem, 10vh, 6rem) 1rem;
  background: linear-gradient(180deg, #f2f6fe 0%, #e6eefc 100%);
  color: $white;
  font-family: tokens.$primary-font;

  /* Phones and tablets: a white band with a hairline on top, clearly separate from the pale
     trust band above it. */
  @media (max-width: tokens.$breakpoint-lg - 0.02px) {
    border-top: 1px solid rgb(18 96 240 / 0.12);
    background: #fff;
  }

  @media (min-width: tokens.$breakpoint-lg) {
    display: flex;
    align-items: center;
    height: 100vh;
    height: 100svh;
    padding-block: clamp(3rem, 7vh, 5rem);
    /* A little more room from the side rail than the logo edge alone gives. */
    padding-left: calc(var(--logo-x, calc(2vw + 11.5rem)) + 3rem);
    padding-right: var(--logo-x, calc(2vw + 11.5rem));
  }
}

.closing__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(18, 96, 240, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 96, 240, 0.06) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(80% 70% at 60% 50%, #000 20%, transparent 100%);
  pointer-events: none;
}

.closing__glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(18, 96, 240, 0.14), transparent);
  filter: blur(10px);
  pointer-events: none;
  animation: drift 14s ease-in-out infinite alternate;
}

@keyframes sweep {
  0%,
  70% {
    left: -60%;
  }
  100% {
    left: 130%;
  }
}

@keyframes drift {
  to {
    transform: translate(-8%, 10%) scale(1.08);
  }
}

.closing__inner {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
  width: 100%;
  max-width: 1180px;
  margin-inline: auto;

  @media (min-width: tokens.$breakpoint-md) {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  }

  @media (min-width: tokens.$breakpoint-lg) {
    max-width: min(100%, 1240px);
  }
}

/* ---------- Copy ---------- */

.closing__copy {
  display: grid;
  gap: 0.85rem;
  justify-items: start;
}

.closing__eyebrow {
  color: $blue;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.closing__title {
  max-width: 20ch;
  font-size: clamp(1.7rem, 2.25vw, 2.2rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.08;
  text-wrap: balance;
}

.closing__steps {
  display: grid;
  gap: 0.4rem;
  max-width: 46ch;
  padding: 0;
  list-style: none;
  counter-reset: step;

  li {
    position: relative;
    padding-left: 2.1rem;
    color: $muted;
    font-size: 1rem;
    line-height: 1.45;
    counter-increment: step;

    &::before {
      content: counter(step);
      position: absolute;
      top: 0.05rem;
      left: 0;
      display: grid;
      place-items: center;
      width: 1.45rem;
      height: 1.45rem;
      border: 1.5px solid rgba(18, 96, 240, 0.35);
      border-radius: 50%;
      background: #fff;
      color: $blue;
      font-size: 0.75rem;
      font-weight: 700;
    }
  }

  .closing__steps-last {
    color: $ink;
    font-weight: 600;

    &::before {
      border-color: $blue;
      background: $blue;
      color: #fff;
    }
  }
}

/* "See a sample first": a quiet text link under the checklist, for people not ready to book. */
.closing__sample {
  display: inline-block;
  margin-top: 0.6rem;
  color: $blue;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
}

/* The four things in the Snapshot: a compact two-by-two checklist. */
.gets {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem 1rem;
  margin-top: 0.55rem !important;
  padding: 0.8rem 0.9rem;
  border: 1px solid rgba(18, 96, 240, 0.16);
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.75);
  list-style: none;

  @media (max-width: 599px) {
    grid-template-columns: 1fr;
  }

  li {
    display: flex;
    gap: 0.45rem;
    align-items: flex-start;
    padding: 0 !important;
    font-weight: 400;

    &::before {
      content: none !important;
    }
  }

  svg {
    flex: none;
    width: 1rem;
    height: 1rem;
    margin-top: 0.15rem;
    fill: none;
    stroke: $blue;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  span {
    display: grid;
    line-height: 1.3;
  }

  b {
    color: $ink;
    font-size: 0.88rem;
    font-weight: 700;
  }

  small {
    color: $muted;
    font-size: 0.76rem;
  }
}

.closing__after {
  color: $blue;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.closing__lead {
  max-width: 40ch;
  color: $muted;
  font-size: clamp(1rem, 1.2vw, 1.15rem);
  line-height: 1.55;
}

.closing__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  align-items: center;
  margin-top: 0.5rem;
}

.closing__book {
  position: relative;
  overflow: hidden;
  padding: 0.95rem 1.4rem;
  border: 0;
  border-radius: 0.6rem;
  background: $blue;
  color: #fff;
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow:
    0 10px 26px rgba(18, 96, 240, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition:
    transform 0.35s $bounce,
    box-shadow 0.3s ease;

  span {
    display: inline-block;
    transition: transform 0.3s $bounce;
  }

  /* A soft light sweep every few seconds keeps the eye coming back to the main action. */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -60%;
    width: 45%;
    background: linear-gradient(
      100deg,
      transparent 0%,
      rgba(255, 255, 255, 0.35) 50%,
      transparent 100%
    );
    transform: skewX(-18deg);
    animation: sweep 5.5s ease-in-out 2s infinite;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow:
      0 14px 32px rgba(18, 96, 240, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);

    span {
      transform: translateX(4px);
    }
  }

  &:focus-visible {
    outline: 2px solid $blue;
    outline-offset: 3px;
  }
}

.closing__msg {
  padding: 0;
  border: 0;
  background: none;
  color: $muted;
  font: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: rgba(11, 31, 46, 0.3);
  text-underline-offset: 3px;

  &:hover {
    color: $white;
  }

  &:focus-visible {
    outline: 2px solid $blue;
    outline-offset: 3px;
    border-radius: 3px;
  }
}

.closing__meta {
  color: rgba(11, 31, 46, 0.5);
  font-size: 0.82rem;
}

/* ---------- Panel ---------- */

.closing__panel {
  position: relative;
  display: grid;
  gap: 1.1rem;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  border: 1px solid $line;
  border-radius: 1.1rem;
  background: #fff;
  box-shadow:
    0 24px 60px rgba(10, 52, 135, 0.12),
    0 2px 6px rgba(10, 52, 135, 0.05);
}

.closing__q {
  color: $ink;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.modes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

/* Compact pills with a radio dot, so each answer reads as a choice. */
.mode {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.55rem 0.95rem 0.55rem 0.75rem;
  border: 1.5px solid rgba(18, 96, 240, 0.22);
  border-radius: 999px;
  background: #fff;
  color: $ink;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.3s $bounce;

  &:hover {
    border-color: rgba(18, 96, 240, 0.6);
    background: #f5f8ff;
    box-shadow: 0 6px 14px rgba(18, 96, 240, 0.14);
    transform: translateY(-2px);
  }

  &.is-active {
    border-color: $blue;
    background: #eef4ff;
    box-shadow: 0 0 0 3px rgba(18, 96, 240, 0.12);
  }

  &.is-pressed {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid $blue;
    outline-offset: 2px;
  }
}

/* The note outside the card's top-left: text, then a hand-drawn arrow curving into the answers. */
.try-note {
  position: absolute;
  top: -2.4rem;
  left: -0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.2rem;
  pointer-events: none;

  @media (max-width: 599px) {
    top: -2rem;
    left: 0.25rem;
  }
}

.try-note__text {
  order: 2;
  margin-top: -0.2rem;
  color: $blue;
  font-size: 0.86rem;
  font-style: italic;
  font-weight: 600;
  white-space: nowrap;
}

.try-note__arrow {
  order: 1;
  width: 44px;
  height: 38px;
  margin-top: 0.2rem;
  transform: scaleX(-1); /* curves from the text down into the card */

  path {
    fill: none;
    stroke: $blue;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
  }
}

/* Demo pointer. */
.demo-cursor {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 26px;
  height: 26px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  filter: drop-shadow(0 3px 5px rgba(10, 30, 60, 0.3));

  svg {
    width: 100%;
    height: 100%;
    fill: $ink;
    stroke: #fff;
    stroke-width: 1.5;
    stroke-linejoin: round;
  }
}

/* A radio dot, so each answer reads as a choice. */
.mode__dot {
  position: relative;
  flex: none;
  width: 0.95rem;
  height: 0.95rem;
  border: 2px solid rgba(18, 96, 240, 0.45);
  border-radius: 50%;
  background: #fff;
  transition: border-color 0.25s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 50%;
    background: $blue;
    transform: scale(0);
    transition: transform 0.3s $bounce;
  }

  .mode.is-active & {
    border-color: $blue;

    &::after {
      transform: scale(1);
    }
  }
}

/* ---------- Route ---------- */

.route {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2.5rem minmax(0, 1fr) 2.5rem minmax(0, 1fr);
  align-items: start;
  padding-top: 1.6rem; /* room for the bypass arc */

  /* Phones: still one row (Snapshot → Diagnostic → Build), just tighter. */
  @media (max-width: 599px) {
    grid-template-columns: minmax(0, 1fr) 1.25rem minmax(0, 1fr) 1.25rem minmax(0, 1fr);
  }
}

.node {
  display: grid;
  justify-items: center;
  gap: 0.3rem;
  text-align: center;

  /* Dimming lives on the contents, so it never fights the entrance tween on the node. */
  > * {
    transition: opacity 0.35s ease;
  }

  b {
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.2;

    @media (max-width: 599px) {
      font-size: 0.8rem;
    }
  }

  small {
    color: $muted;
    font-size: 0.74rem;
    line-height: 1.3;
    white-space: nowrap;

    @media (max-width: 599px) {
      font-size: 0.68rem;
    }
  }

  /* Skipped / off steps: the dot fades, the words stay readable (just quieter). */
  &.is-off .node__dot,
  &.is-skip .node__dot {
    opacity: 0.38;
  }

  &.is-off b,
  &.is-skip b {
    color: $muted;
  }
}

.node__dot {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  margin-bottom: 0.2rem;
  border: 2px solid rgba(18, 96, 240, 0.28);
  border-radius: 50%;
  background: #fff;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  @media (max-width: 599px) {
    width: 2.1rem;
    height: 2.1rem;
  }

  svg {
    width: 55%;
    fill: none;
    stroke: #fff;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .is-on & {
    border-color: $blue;
    background: $blue;
    box-shadow:
      0 0 0 6px rgba(18, 96, 240, 0.12),
      0 8px 18px rgba(18, 96, 240, 0.32);
  }

  .is-maybe & {
    border-style: dashed;
    border-color: $blue;
  }

  .is-skip & {
    border-style: dashed;
  }
}

/* Connectors sit level with the dots. */
.link {
  position: relative;
  height: 2px;
  margin-top: 1.3rem;
  background: rgba(18, 96, 240, 0.14);
  border-radius: 2px;

  @media (max-width: 599px) {
    margin-top: 1.05rem;
  }
}

.link__fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, $blue, $sky);
  transform-origin: left center;
  transition: opacity 0.35s ease;
  opacity: 0;

  .link.is-on & {
    opacity: 1;
  }

  .link.is-maybe & {
    opacity: 0.55;
    background: repeating-linear-gradient(90deg, $blue 0 6px, transparent 6px 11px);
  }
}

/* "I know what's broken": an arc hops over the Diagnostic, straight from the Snapshot to the build. */
.bypass {
  position: absolute;
  top: 0.35rem;
  /* From the first node's centre to the last's: each node column is (100% - 5rem) / 3 wide. */
  left: calc((100% - 5rem) / 6);
  right: calc((100% - 5rem) / 6);
  height: 2.4rem;
  border: 2px solid $blue;
  border-bottom: 0;
  border-radius: 1.4rem 1.4rem 0 0;
  opacity: 0;
  transform: scaleY(0.4);
  transform-origin: bottom center;
  transition:
    opacity 0.3s ease,
    transform 0.5s $bounce;
  pointer-events: none;

  .route--clear & {
    opacity: 1;
    transform: none;
  }

  /* Phones: the link columns are 1.25rem, not 2.5rem. */
  @media (max-width: 599px) {
    left: calc((100% - 2.5rem) / 6);
    right: calc((100% - 2.5rem) / 6);
  }
}

.closing__caption {
  min-height: 3em;
  color: $white;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .closing__glow,
  .closing__book::after {
    animation: none;
  }

  .mode,
  .closing__book,
  .bypass {
    transition: none;
  }
}
</style>
