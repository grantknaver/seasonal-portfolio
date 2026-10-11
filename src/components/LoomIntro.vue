<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { INTRO_LOOM_ASPECT, INTRO_VIDEO_SRC } from '../shared/constants/loom';
import ClientResultsStrip from './ClientResultsStrip.vue';
import { openTeardownBooking } from '../shared/constants/booking';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useViewport } from 'src/shared/utils/viewWidth';

gsap.registerPlugin(ScrollTrigger);

/* The glue between the hero ("what I do") and the trust section ("why people hesitate"):
   the business cost of friction, in Grant's own voice. */
const hasVideo = !!INTRO_VIDEO_SRC;
/* The next-step line follows the results' reveal. */
const resultsIn = ref(false);

/* Self-hosted video behind a branded cover: only the first frame's details load, nothing plays until someone clicks,
   and that one click starts it with sound. */
const videoRef = ref<HTMLVideoElement | null>(null);
const started = ref(false);
const watched = ref(false);
const play = () => {
  const v = videoRef.value;
  if (!v) return;
  started.value = true;
  if (v.ended) v.currentTime = 0;
  void v.play().catch(() => {
    /* If the browser still refuses, leave the native controls showing so it's one more tap. */
  });
};
const onEnded = () => {
  started.value = false;
  watched.value = true;
};

const costs = [
  'Signups that stall',
  'Demos that need explaining',
  'Support tickets that shouldn’t exist',
];

/* One gentle reveal as the section scrolls in, like the panels. */
const rootRef = ref<HTMLElement | null>(null);
const isIn = ref(false);
let io: IntersectionObserver | null = null;
const gridRef = ref<HTMLElement | null>(null);

/* Desktop: the section holds for about a screen of scrolling, like the hero, and the content
   sequences in with the scroll while a faint network of lines draws itself behind it.
   Phones and reduced motion keep the simple one-time reveal. */
const { lgBreakpoint } = useViewport();
const scrubMode = ref(false);
let mm: gsap.MatchMedia | null = null;

/* Background imagery (viewBox 1600×900): the friction story at low opacity. A funnel that
   thins out, a conversion line that dips below where it was heading, a progress card stuck
   partway, and a few dots drifting off like people leaving. */
const funnelBars = [220, 186, 150, 110, 70, 42].map((h, i) => ({ x: 190 + i * 58, h }));
const leavers = [
  [470, 640],
  [520, 700],
  [560, 610],
  [610, 680],
  [650, 730],
  [700, 650],
  [745, 700],
] as const;

/* Hold length: a little more than one screen of scrolling. */
const holdLength = () => Math.round(window.innerHeight * 1.1);

const buildScrub = (root: HTMLElement) => {
  const q = <T extends Element = HTMLElement>(sel: string) =>
    root.querySelector<T & HTMLElement>(sel);
  const qa = (sel: string) => [...root.querySelectorAll<HTMLElement>(sel)];
  const eyebrow = q('.loom-intro__eyebrow');
  const title = q('.loom-intro__title');
  const lead = q('.loom-intro__lead');
  const costs = q('.loom-intro__costs');
  const media = q('.loom-intro__media');
  const rTitle = q('.results__title');
  const rItems = qa('.results__list li');
  const rNote = q('.results__note');
  const next = q('.loom-intro__next');

  /* refreshPriority -1: measured after the hero's pin above it (the trust section's triggers
     use -2 so they measure after this pin). */
  /* 1. While it rises: the headline arrives, so the section never scrolls in empty. */
  const entry = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: root,
      start: 'top 75%',
      end: 'top 10%',
      scrub: 0.6,
      refreshPriority: -1,
    },
  });
  if (eyebrow)
    entry.fromTo(eyebrow, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0);
  if (title)
    entry.fromTo(title, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.12);

  /* 2. The hold: everything else sequences in with the scroll, then a short rest on the
     finished state before the section moves on. */
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
      refreshPriority: -1,
      invalidateOnRefresh: true,
    },
  });
  if (lead) hold.fromTo(lead, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0);
  if (costs)
    hold.fromTo(costs, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.12);
  if (media)
    hold.fromTo(
      media,
      { autoAlpha: 0, y: 40, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 },
      0.2,
    );
  if (rTitle)
    hold.fromTo(rTitle, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.62);
  if (rItems.length)
    hold.fromTo(
      rItems,
      { autoAlpha: 0, x: 28 },
      { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.12 },
      0.7,
    );
  if (rNote) hold.fromTo(rNote, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 1.16);
  if (next) hold.fromTo(next, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 1.3);
  hold.to({}, { duration: 0.35 }); // rest on the finished state

  /* 3. Background: the grid drifts and the network draws in, across the rise and the hold. */
  const bg = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top 45%',
      end: () => `+=${Math.round(window.innerHeight * 0.45) + holdLength()}`,
      scrub: 1,
      refreshPriority: -1,
      invalidateOnRefresh: true,
    },
  });
  if (gridRef.value) bg.fromTo(gridRef.value, { yPercent: -6 }, { yPercent: 6, duration: 1 }, 0);
  const bars = qa('.bgi__bar');
  const card = q('.bgi__card');
  const fill = q('.bgi__fill');
  const line = q('.bgi__line');
  const area = q('.bgi__area');
  const expect = q('.bgi__expect');
  const dots = qa('.bgi__dot');
  if (bars.length) {
    bg.fromTo(
      bars,
      { scaleY: 0, transformOrigin: '50% 100%' },
      { scaleY: 1, duration: 0.2, stagger: 0.04, ease: 'back.out(1.4)' },
      0.08,
    );
  }
  if (card)
    bg.fromTo(
      card,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 0.18, ease: 'power2.out' },
      0.22,
    );
  if (fill)
    bg.fromTo(
      fill,
      { scaleX: 0, transformOrigin: '0% 50%' },
      { scaleX: 1, duration: 0.2, ease: 'power1.out' },
      0.4,
    );
  if (line) bg.fromTo(line, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42 }, 0.3);
  if (area) bg.fromTo(area, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.45);
  if (expect) bg.fromTo(expect, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.55);
  if (dots.length) {
    gsap.set(dots, { autoAlpha: 0 });
    bg.to(
      dots,
      {
        keyframes: [
          { autoAlpha: 1, duration: 0.1 },
          {
            x: () => gsap.utils.random(90, 200),
            y: () => gsap.utils.random(-140, -60),
            autoAlpha: 0,
            duration: 0.22,
          },
        ],
        stagger: 0.04,
      },
      0.6,
    );
  }
};

/* Desktop: the content starts where the glkFreelance logo ends, with the same space on the
   right. The logo is fixed, so measure its right edge and keep it in sync on resize. */
const logoGutter = ref<string | undefined>(undefined);
const measureLogo = () => {
  const logo = [...document.querySelectorAll<HTMLElement>('.logo-text')].find(
    (el) => el.getBoundingClientRect().width > 0,
  );
  logoGutter.value = logo ? `${Math.round(logo.getBoundingClientRect().right)}px` : undefined;
};

onMounted(() => {
  measureLogo();
  window.addEventListener('resize', measureLogo);
  if ('fonts' in document) void document.fonts.ready.then(measureLogo);
  const root = rootRef.value;
  if (root) {
    mm = gsap.matchMedia();
    mm.add(`(min-width: ${lgBreakpoint}px) and (prefers-reduced-motion: no-preference)`, () => {
      scrubMode.value = true;
      isIn.value = true;
      buildScrub(root);
      return () => {
        scrubMode.value = false;
      };
    });
    if (scrubMode.value) return;
  }
  if (!rootRef.value || !('IntersectionObserver' in window)) {
    isIn.value = true;
    return;
  }
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        isIn.value = true;
        io?.disconnect();
      }
    },
    { threshold: 0.25 },
  );
  io.observe(rootRef.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureLogo);
  io?.disconnect();
  mm?.revert();
});
</script>

<template>
  <section
    ref="rootRef"
    :style="{ '--vid-ratio': INTRO_LOOM_ASPECT, ...(logoGutter ? { '--logo-x': logoGutter } : {}) }"
    class="loom-intro"
    :class="{ 'is-in': isIn, 'is-scrub': scrubMode }"
    aria-labelledby="loom-intro-title"
  >
    <span ref="gridRef" class="loom-intro__grid" aria-hidden="true"></span>
    <svg
      class="loom-intro__net"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bgi-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1260f0" stop-opacity="0.12" />
          <stop offset="1" stop-color="#1260f0" stop-opacity="0" />
        </linearGradient>
      </defs>
      <!-- Funnel that thins out -->
      <g class="bgi__funnel">
        <rect
          v-for="(b, i) in funnelBars"
          :key="i"
          class="bgi__bar"
          :x="b.x"
          :y="880 - b.h"
          width="44"
          :height="b.h"
          rx="6"
        />
      </g>
      <!-- Conversion: where it was heading (dashed) vs where it went -->
      <path
        class="bgi__area"
        d="M420 770 C 620 700, 780 630, 940 640 S 1240 700, 1320 760 S 1500 820, 1580 830 L1580 900 L420 900 Z"
      />
      <path class="bgi__expect" d="M940 640 L1580 540" />
      <path
        class="bgi__line"
        pathLength="1"
        d="M420 770 C 620 700, 780 630, 940 640 S 1240 700, 1320 760 S 1500 820, 1580 830"
      />
      <!-- A progress card stuck partway -->
      <g class="bgi__card">
        <rect x="1250" y="40" width="300" height="104" rx="14" class="bgi__panel" />
        <rect x="1276" y="66" width="150" height="10" rx="5" class="bgi__text" />
        <rect x="1276" y="86" width="96" height="8" rx="4" class="bgi__text bgi__text--soft" />
        <rect x="1276" y="112" width="248" height="10" rx="5" class="bgi__track" />
        <rect x="1276" y="112" width="152" height="10" rx="5" class="bgi__fill" />
        <circle cx="1520" cy="72" r="9" class="bgi__spin" />
      </g>
      <!-- People leaving -->
      <circle
        v-for="([x, y], i) in leavers"
        :key="`d${i}`"
        class="bgi__dot"
        :cx="x"
        :cy="y"
        r="7"
      />
    </svg>
    <div class="loom-intro__inner">
      <div class="loom-intro__copy">
        <p class="loom-intro__eyebrow q-ma-none" style="--i: 0">60 seconds with Grant</p>
        <h2 id="loom-intro-title" class="loom-intro__title q-ma-none" style="--i: 1">
          Friction rarely announces itself. It shows up as people leaving.
        </h2>
        <p class="loom-intro__lead q-ma-none" style="--i: 2">
          What it looks like, what it costs you, and how I find it.
        </p>
        <div class="loom-intro__costs" style="--i: 3">
          <span class="loom-intro__costs-label">Where you notice it</span>
          <ul class="q-ma-none">
            <li v-for="c in costs" :key="c">{{ c }}</li>
          </ul>
        </div>
      </div>

      <div class="loom-intro__media" style="--i: 2">
        <div class="video" :style="{ aspectRatio: INTRO_LOOM_ASPECT }">
          <video
            v-if="hasVideo"
            ref="videoRef"
            class="video__frame"
            :src="INTRO_VIDEO_SRC"
            preload="metadata"
            playsinline
            :controls="started"
            title="60 seconds with Grant"
            @ended="onEnded"
          ></video>

          <!-- Branded cover: just the brand and a play button, no preview of the recording.
               One click starts the video with sound. -->
          <button
            v-show="!started"
            type="button"
            class="video__poster"
            :disabled="!hasVideo"
            :aria-label="
              hasVideo
                ? watched
                  ? 'Watch the video again'
                  : 'Play the 60-second video'
                : 'Video coming soon'
            "
            @click="play"
          >
            <span class="video__grid" aria-hidden="true"></span>
            <span class="video__brand" aria-hidden="true"> <i>glk</i><span>Freelance</span> </span>
            <span class="video__play" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
            </span>
            <span class="video__caption" aria-hidden="true">
              <b>Why friction costs more than it looks</b>
              <small>{{
                hasVideo ? (watched ? 'Watch again' : '1 min') : 'Video coming soon'
              }}</small>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- The payoff: what clients reported once that friction was fixed. -->
    <ClientResultsStrip
      class="loom-intro__results"
      :animate="!scrubMode"
      @shown="resultsIn = true"
    />

    <!-- A next step for anyone convinced by the results. -->
    <p class="loom-intro__next q-ma-none" :class="{ 'is-in': resultsIn || scrubMode }">
      Want to see where your product is losing people?
      <button type="button" class="loom-intro__cta" @click="openTeardownBooking()">
        Book a free Teardown <span aria-hidden="true">&rarr;</span>
      </button>
    </p>
  </section>
</template>

<style scoped lang="scss">
@use '../css/tokens' as tokens;

$ink: #0b1f2e;
$muted: rgba(11, 31, 46, 0.66);
$blue: #1260f0;
$navy: #0a3487;
$line: rgba(18, 96, 240, 0.18);
$ease: cubic-bezier(0.22, 1, 0.36, 1);

/* Its own opaque layer: it scrolls over the hero's fixed background as a calm breather
   before the cinematic trust section. */
.loom-intro {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: clamp(3rem, 8vh, 5rem) 1rem;
  overflow: hidden;
  background: linear-gradient(180deg, #f7f9fe 0%, #eef3fd 100%);
  color: $ink;
  font-family: tokens.$primary-font;

  /* Desktop: exactly one screen tall, content centred with generous room above and below,
     so the section's height is predictable for the pinned hero and trust sections around it. */
  @media (min-width: tokens.$breakpoint-lg) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    height: 100svh;
    padding-block: clamp(3.5rem, 11vh, 7.5rem);

    /* Wide and short: the content spans most of the width, and the video's height is set from
       the screen height, so there's more room above and below than at the sides. */
    /* Content starts where the glkFreelance logo ends (measured in script), with the same
       distance on the right. Fallback: roughly the logo's width plus its 2% offset. */
    padding-inline: var(--logo-x, calc(2vw + 11.5rem));
    --content-w: min(100%, 1000px);
    --vid-h: clamp(16rem, calc(100vh - 29rem), 32rem);
    --vid-h: clamp(16rem, calc(100svh - 29rem), 32rem);
  }
}

.loom-intro__inner {
  display: grid;
  gap: clamp(1.5rem, 3.5vw, 3rem);
  align-items: center;
  width: 100%;
  max-width: 1180px;
  margin-inline: auto;

  @media (min-width: tokens.$breakpoint-md) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }

  @media (min-width: tokens.$breakpoint-lg) {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 3rem;
    max-width: var(--content-w);
  }
}

.loom-intro__results {
  width: 100%;
  max-width: 1180px;

  @media (min-width: tokens.$breakpoint-lg) {
    max-width: var(--content-w);
  }

  margin: clamp(1.25rem, 3.5vh, 2.25rem) auto 0;
}

.loom-intro__next {
  width: 100%;
  max-width: 1180px;

  @media (min-width: tokens.$breakpoint-lg) {
    max-width: var(--content-w);
  }

  margin: clamp(0.9rem, 2vh, 1.25rem) auto 0;
  color: $muted;
  font-size: 0.95rem;
  line-height: 1.4;
}

.loom-intro__cta {
  margin-left: 0.35rem;
  padding: 0;
  border: 0;
  background: none;
  color: $blue;
  font: inherit;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  span {
    display: inline-block;
    transition: transform 0.25s ease;
  }

  &:hover span,
  &:focus-visible span {
    transform: translateX(3px);
  }

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid $blue;
    outline-offset: 3px;
    border-radius: 4px;
  }
}

.loom-intro__copy {
  display: grid;
  gap: 0.75rem;
}

/* Size the player from the screen height so copy, video and results always fit inside the
   one-screen section with breathing room. */
.loom-intro__media {
  @media (min-width: tokens.$breakpoint-md) {
    justify-self: end;
    width: min(100%, calc(48vh * 16 / 9));
  }

  @media (min-width: tokens.$breakpoint-lg) {
    justify-self: end;
    width: calc(var(--vid-h) * var(--vid-ratio, 16 / 9));
  }
}

.loom-intro__eyebrow {
  color: $blue;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.loom-intro__title {
  max-width: 18ch;
  font-size: clamp(1.7rem, 2.3vw, 2.15rem);

  /* Desktop: two wide lines instead of four narrow ones, to keep the section short. */
  @media (min-width: tokens.$breakpoint-lg) {
    max-width: 30ch;
    font-size: clamp(2rem, 2.3vw, 2.5rem);
  }
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.12;
}

.loom-intro__lead {
  max-width: 34ch;

  @media (min-width: tokens.$breakpoint-lg) {
    max-width: 48ch;
  }

  color: $muted;
  font-size: clamp(1rem, 1.2vw, 1.12rem);
  line-height: 1.5;
}

.loom-intro__costs {
  display: grid;
  gap: 0.5rem;
  margin-top: 0.4rem;

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0;
    list-style: none;
  }

  li {
    padding: 0.35rem 0.75rem;
    border: 1px solid $line;
    border-radius: 999px;
    background: #fff;
    color: $navy;
    font-size: 0.82rem;
    font-weight: 600;
  }
}

.loom-intro__costs-label {
  color: $muted;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ---------- Video ---------- */

.video {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border-radius: 1rem;
  background: $ink;
  box-shadow:
    0 24px 60px rgba(6, 17, 31, 0.28),
    0 0 0 1px rgba(18, 96, 240, 0.12);
}

.video__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: cover;
  background: #06111f;
}

.video__poster {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  width: 100%;
  padding: 0;
  border: 0;
  background:
    radial-gradient(120% 90% at 20% 0%, rgba(18, 96, 240, 0.45) 0%, transparent 60%),
    radial-gradient(90% 80% at 100% 100%, rgba(216, 189, 122, 0.18) 0%, transparent 55%),
    linear-gradient(160deg, #0b1f2e 0%, #06111f 100%);
  color: #fff;
  font: inherit;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &:focus-visible {
    outline: 3px solid #9ec0ff;
    outline-offset: -3px;
  }
}

.video__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%);
}

.video__brand {
  position: absolute;
  top: 1rem;
  left: 1.1rem;
  font-size: 0.95rem;

  i {
    color: #9ec0ff;
    font-style: italic;
    font-weight: 700;
  }

  span {
    color: rgba(255, 255, 255, 0.85);
  }
}

.video__play {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(3.5rem, 6vw, 4.75rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: $blue;
  box-shadow: 0 10px 30px rgba(18, 96, 240, 0.45);
  transition: transform 0.4s $ease;

  svg {
    width: 42%;
    margin-left: 6%;
    fill: #fff;
  }

  /* One soft ring, breathing slowly: present, not pushy. */
  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    border: 1px solid rgba(158, 192, 255, 0.5);
    border-radius: 50%;
    animation: ring 2.8s ease-in-out infinite;
  }
}

.video__poster:disabled .video__play {
  background: rgba(255, 255, 255, 0.14);
  box-shadow: none;

  &::after {
    animation: none;
    opacity: 0.3;
  }
}

.video__poster:not(:disabled):hover .video__play,
.video__poster:not(:disabled):focus-visible .video__play {
  transform: scale(1.06);
}

.video__caption {
  position: absolute;
  left: 1.1rem;
  right: 1.1rem;
  bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
  align-items: baseline;
  justify-content: space-between;
  text-align: left;

  b {
    font-size: clamp(0.9rem, 1.2vw, 1.05rem);
    font-weight: 600;
  }

  small {
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.8rem;
    font-weight: 600;
  }
}

@keyframes ring {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.96);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.06);
  }
}

/* ---------- Background grid ---------- */

/* The video cover's grid, carried faintly into the section. Taller than the section so the
   parallax drift never shows an edge. */
.loom-intro__grid {
  position: absolute;
  inset: -12% 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(18, 96, 240, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 96, 240, 0.07) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(70% 60% at 50% 45%, #000 15%, transparent 100%);
}

/* Background imagery: pale blue shapes in the same family as the hero's background. */
.loom-intro__net {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: none;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .is-scrub > & {
    display: block;
  }

  opacity: 0.6;

  .bgi__bar {
    fill: #d3e0fa;
  }

  .bgi__bar:nth-child(n + 5) {
    fill: #e2eafb;
  }

  .bgi__area {
    fill: url(#bgi-area);
  }

  .bgi__line {
    fill: none;
    stroke: rgba(18, 96, 240, 0.3);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
  }

  .bgi__expect {
    fill: none;
    stroke: rgba(18, 96, 240, 0.22);
    stroke-width: 2;
    stroke-dasharray: 8 10;
  }

  .bgi__panel {
    fill: rgba(255, 255, 255, 0.7);
    stroke: rgba(18, 96, 240, 0.16);
  }

  .bgi__text {
    fill: #d3e0fa;

    &--soft {
      fill: #e6edfb;
    }
  }

  .bgi__track {
    fill: #e9effb;
  }

  .bgi__fill {
    fill: rgba(18, 96, 240, 0.3);
  }

  .bgi__spin {
    fill: none;
    stroke: rgba(18, 96, 240, 0.28);
    stroke-width: 3;
    stroke-dasharray: 36 20;
  }

  .bgi__dot {
    fill: rgba(18, 96, 240, 0.28);
  }
}

.loom-intro__inner,
.loom-intro__results,
.loom-intro__next {
  position: relative;
  z-index: 1;
}

/* Scroll-driven mode: GSAP owns opacity and position, so CSS transitions step aside. */
.loom-intro.is-scrub {
  .loom-intro__copy > *,
  .loom-intro__media,
  .loom-intro__next {
    transition: none;
  }
}

/* ---------- Reveal ---------- */

.loom-intro__copy > *,
.loom-intro__media {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.8s $ease,
    transform 0.8s $ease;
  transition-delay: calc(var(--i, 0) * 0.1s);
}

.loom-intro__media {
  transform: translateY(16px) scale(0.98);
}

.loom-intro__next {
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 1.2s,
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 1.2s;
}

.loom-intro__next.is-in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .loom-intro__next {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.loom-intro.is-in {
  .loom-intro__copy > *,
  .loom-intro__media {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loom-intro__copy > *,
  .loom-intro__media {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .video__play::after {
    animation: none;
  }
}
</style>
