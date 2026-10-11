<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useViewport } from 'src/shared/utils/viewWidth';
import { openTeardownBooking } from '../shared/constants/booking';

/* The close of the page: one question ("where are you now?") and the route that answer takes.
   Everyone starts with a free Teardown; what follows depends on what we find. */
const emit = defineEmits<{ message: [] }>();

gsap.registerPlugin(ScrollTrigger);
const { lgBreakpoint } = useViewport();

type Mode = 'unclear' | 'clear' | 'opinion';
type NodeState = 'on' | 'maybe' | 'skip' | 'off';

const modes: { key: Mode; label: string }[] = [
  { key: 'unclear', label: 'Something feels off' },
  { key: 'clear', label: 'I know what’s broken' },
  { key: 'opinion', label: 'I want a second opinion' },
];

const nodes = [
  { key: 'teardown', title: 'Free Teardown', meta: '20 min · one surface' },
  { key: 'diag', title: 'Diagnostic', meta: 'When the problem is unclear' },
  { key: 'build', title: 'Build the fix', meta: 'When the problem is clear' },
] as const;

/* What each answer lights up, and what it means in plain words. */
const routes: Record<Mode, { states: [NodeState, NodeState, NodeState]; caption: string }> = {
  unclear: {
    states: ['on', 'on', 'maybe'],
    caption:
      'We find what’s actually wrong before you spend on a fix. The Diagnostic can stand on its own, or I carry it into the build.',
  },
  clear: {
    states: ['on', 'skip', 'on'],
    caption: 'No Diagnostic needed. We scope the fix on the call, then I build it.',
  },
  opinion: {
    states: ['on', 'off', 'off'],
    caption:
      'You leave with a one-page Decision Snapshot your team can use, whether or not we work together.',
  },
};

const mode = ref<Mode>('unclear');
const route = computed(() => routes[mode.value]);

const rootRef = ref<HTMLElement | null>(null);
const nodesRef = ref<HTMLElement | null>(null);

/* A small bounce on the nodes that light up when the answer changes. */
const choose = async (m: Mode) => {
  if (m === mode.value) return;
  mode.value = m;
  await nextTick();
  /* On the dots, so it never collides with the node's scroll-driven entrance. */
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

/* Desktop: the entrance follows the scroll. The main copy comes first (eyebrow, headline,
   lead, button), then the card slides in from the right and its route draws. While the section
   is on screen, the card, grid and glow drift at different speeds for a little depth. */
const buildScrub = (root: HTMLElement) => {
  const enter = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: root,
      start: 'top 85%',
      end: 'top 15%',
      scrub: 0.8,
      refreshPriority: -3, // measured after every pin above it
    },
  });
  enter
    .fromTo(
      '.closing__copy > *',
      { autoAlpha: 0, y: 44 },
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1 },
      0,
    )
    .fromTo(
      '.closing__panel',
      { autoAlpha: 0, x: 140, rotate: 1.5 },
      { autoAlpha: 1, x: 0, rotate: 0, duration: 0.55 },
      0.45,
    )
    .fromTo(
      '.node',
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.25, stagger: 0.1, ease: 'back.out(2)' },
      0.85,
    )
    .fromTo(
      '.link__fill',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.2, stagger: 0.1, ease: 'power1.inOut' },
      0.95,
    );

  /* Parallax across the section's whole arrival. */
  const drift = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
      refreshPriority: -3,
    },
  });
  drift
    .fromTo('.closing__panel', { yPercent: 14 }, { yPercent: -4 }, 0)
    .fromTo('.closing__grid', { y: 70 }, { y: -30 }, 0)
    .fromTo('.closing__glow', { translate: '0px 120px' }, { translate: '0px -40px' }, 0);
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
        <p class="closing__eyebrow q-ma-none">Where to start</p>
        <h2 id="closing-title" class="closing__title q-ma-none">
          Show me one surface. I’ll show you where people get stuck.
        </h2>
        <p class="closing__lead q-ma-none">
          Every engagement starts the same way: a free Teardown. What happens next depends on what
          we find.
        </p>
        <div class="closing__cta">
          <button type="button" class="closing__book" @click="openTeardownBooking()">
            Book a free Teardown <span aria-hidden="true">&rarr;</span>
          </button>
          <button type="button" class="closing__msg" @click="emit('message')">
            or send me a message
          </button>
        </div>
        <p class="closing__meta q-ma-none">Free · 20 minutes · just send one link</p>
      </div>

      <div class="closing__panel">
        <p id="closing-q" class="closing__q q-ma-none">Where are you now?</p>
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
            {{ m.label }}
          </button>
        </div>

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
              <span v-if="n.key === 'teardown' && mode === 'opinion'" class="node__extra">
                + Decision Snapshot
              </span>
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

  @media (min-width: tokens.$breakpoint-lg) {
    display: flex;
    align-items: center;
    min-height: 92vh;
    min-height: 92svh;
    padding-block: clamp(5rem, 12vh, 8rem);
    padding-inline: var(--logo-x, calc(2vw + 11.5rem));
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

@keyframes drift {
  to {
    transform: translate(-8%, 10%) scale(1.08);
  }
}

.closing__inner {
  position: relative;
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
  gap: 1rem;
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
  max-width: 18ch;
  font-size: clamp(2rem, 3.2vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.08;
  text-wrap: balance;
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
  color: $blue;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.modes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.mode {
  padding: 0.55rem 0.95rem;
  border: 1px solid $line;
  border-radius: 999px;
  background: transparent;
  color: $muted;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    transform 0.35s $bounce;

  &:hover {
    color: $white;
    border-color: rgba(18, 96, 240, 0.5);
    transform: translateY(-1px);
  }

  &.is-active {
    border-color: $blue;
    background: $blue;
    color: #fff;
    box-shadow: 0 6px 16px rgba(18, 96, 240, 0.28);
  }

  &:focus-visible {
    outline: 2px solid $blue;
    outline-offset: 2px;
  }
}

/* ---------- Route ---------- */

.route {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2.5rem minmax(0, 1fr) 2.5rem minmax(0, 1fr);
  align-items: start;
  padding-top: 1.6rem; /* room for the bypass arc */

  @media (max-width: 599px) {
    grid-template-columns: 1fr;
    padding-top: 0;
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
  }

  small {
    color: $muted;
    font-size: 0.74rem;
    line-height: 1.3;
  }

  &.is-off > *,
  &.is-skip > * {
    opacity: 0.38;
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

.node__extra {
  margin-top: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(18, 96, 240, 0.1);
  color: $navy;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}

/* Connectors sit level with the dots. */
.link {
  position: relative;
  height: 2px;
  margin-top: 1.3rem;
  background: rgba(18, 96, 240, 0.14);
  border-radius: 2px;

  @media (max-width: 599px) {
    width: 2px;
    height: 1.4rem;
    margin: 0.5rem auto;
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

/* "I know what's broken": an arc hops over the Diagnostic, Teardown straight to the build. */
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

  @media (max-width: 599px) {
    display: none;
  }
}

.closing__caption {
  min-height: 3em;
  color: $white;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .closing__glow {
    animation: none;
  }

  .mode,
  .closing__book,
  .bypass {
    transition: none;
  }
}
</style>
