<script setup lang="ts">
import {
  ref,
  onMounted,
  nextTick,
  type ComponentPublicInstance,
  watch,
  onBeforeUnmount,
} from 'vue';
import { gsap } from 'gsap';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { debounce } from 'quasar';
// import { getCustomCssVar } from '../shared/utils/getCustomCssVar';
import { type Artifact } from '../shared/types/artifact';
import { Theme } from '../shared/constants/theme';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const artifacts = ref<Artifact[]>([]);
const artifactRefs = ref<(Element | ComponentPublicInstance | null)[]>([]);
const fallEmojis = ['🍂', '🍁'];
const winterEmoji = '❄';
const springEmoji = '🌸';
const summerEmoji = '🏐';

// Helper
const randRange = (min: number, max: number) => min + Math.random() * (max - min);

// viewport helpers
const vw = () => Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = () => Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

// gsap.utils.random(min, max, snapIncrement?, returnFunction?)
const rand = (min: number, max: number): number => gsap.utils.random(min, max, 0, false); // float
const randInt = (min: number, max: number): number => gsap.utils.random(min, max, 1, false); // integer
const clamp = gsap.utils.clamp;
// const fallDurationFromSize = (size: number, fallFactor: number) =>
//   clamp(4, 18)(assignFallDuration(size, fallFactor));

// ---- Wind helpers
const now = () => performance.now() / 1000; // seconds
const n1 = (t: number, f = 0.07) => Math.sin(t * 2 * Math.PI * f);
const n2 = (t: number, f = 0.11) => Math.sin((t + 13.37) * 2 * Math.PI * f);
const n3 = (t: number, f = 0.041) => Math.sin((t + 7.5) * 2 * Math.PI * f);

// gust envelope (0..1)
function gust(t: number) {
  const g = Math.max(0, Math.sin(t * 2 * Math.PI * 0.02));
  return g * g;
}

// wind components (px/sec, deg/sec)
function windX(t: number) {
  const base = vw() * 0.1;
  const wobble = (n1(t) * 0.6 + n2(t) * 0.3 + n3(t) * 0.1) * vw() * 0.03;
  const gustAmp = gust(t) * vw() * 0.1;
  return (n1(t, 0.03) >= 0 ? 1 : -1) * base + wobble + gustAmp;
}
function windY(t: number) {
  return (n1(t, 0.09) * 0.5 + n2(t, 0.05) * 0.5) * 22;
}
function windSpin(t: number) {
  return (n1(t, 0.06) * 0.7 + n2(t, 0.04) * 0.3) * 90 + gust(t) * 120;
}

// Types

// Per-season visual size (font-size) ranges, in px
const SIZE_RANGE: Record<Theme, { min: number; max: number }> = {
  [Theme.Fall]: { min: 20, max: 36 }, // leaves a bit larger on average
  [Theme.Winter]: { min: 8, max: 22 }, // snowflakes smaller
  [Theme.Spring]: { min: 10, max: 26 }, // petals medium/small
  [Theme.Summer]: { min: 18, max: 36 }, // volleyball bigger
};

const ARTIFACT_QUANITY: Record<Theme, number> = {
  [Theme.Fall]: 50, // leaves a bit larger on average
  [Theme.Winter]: 50, // snowflakes smaller
  [Theme.Spring]: 50, // petals medium/small
  [Theme.Summer]: 1, // volleyball bigger
};

// Optional: per-season transform scale clamp (affects GSAP `scale`, not font-size)
// This lets you tune physics feel per season independent of font-size.
const SCALE_CLAMP: Record<Theme, { min: number; max: number; base: number }> = {
  [Theme.Fall]: { min: 0.9, max: 1.5, base: 24 },
  [Theme.Winter]: { min: 0.5, max: 0.9, base: 24 },
  [Theme.Spring]: { min: 0.5, max: 1.0, base: 24 },
  [Theme.Summer]: { min: 0.9, max: 1.1, base: 28 }, // feel a bit heavier
};

// ---------------------------------------------
// Utilities
// ---------------------------------------------
const getAbsoluteOffsetTop = (el: HTMLElement): number => {
  let top = el.offsetTop;
  let parent = el.offsetParent as HTMLElement | null;
  while (parent) {
    top += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement | null;
  }
  return top;
};

// const assignFallDuration = (artifactSize: number, fallFactor: number) => {
//   let duration = 6 + (30 - artifactSize) * fallFactor;
//   const smallBreakpoint = +getCustomCssVar('breakpoint-sm').slice(0, -2);
//   const isMobile = smallBreakpoint < 600;
//   if (isMobile && activeTheme.value === Theme.Fall) {
//     duration = 6 + (30 - artifactSize) * 0.15;
//   }
//   return duration;
// };

// ---------------------------------------------
// GSAP study helpers (typed & numbers-only)
// ---------------------------------------------
type NumStr = number | string;

interface KeyframeStep {
  x?: NumStr;
  y?: NumStr;
  rotation?: NumStr;
  scale?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
  delay?: number;
}

type Keyframes = KeyframeStep[] | Record<string, KeyframeStep>;

type Motion = {
  keyframes?: Keyframes; // array OR percentage map
  ease?: string;
  yoyo?: boolean;
};

type Spawn = { x: number; y: number; scale: number; rot: number; opacity?: number };

type SeasonCfg = {
  spawn: (el: HTMLElement, artifactSize: number) => Spawn;
  targetY: (footerTop: number) => number | null; // null => y handled inside keyframes
  motion: (el: HTMLElement, artifactSize: number, phase: number) => Motion;
  duration: number;
  rotPerCycle: (artifactSize: number) => number;
  endOpacity?: number;
};

// ---------------------------------------------
// Seasonal behavior definitions
// ---------------------------------------------
const SEASONS: Record<Theme, SeasonCfg> = {
  [Theme.Fall]: {
    // spawn from the TOP only, random x
    spawn: (el, size) => {
      const { min, max, base } = SCALE_CLAMP[Theme.Fall];
      const scaleClamp = gsap.utils.clamp(min, max);
      return {
        x: rand(el.offsetWidth / 2, vw() - el.offsetWidth / 2),
        y: -rand(100, 150),
        scale: scaleClamp(size / base),
        rot: randInt(0, 360),
        opacity: 1,
      };
    },
    targetY: (footerTop) => Math.min(footerTop, vh() + 140),
    motion: () => {
      const t0 = now();
      const steps = 6 + randInt(0, 2); // 6–8 steps
      const kfs: KeyframeStep[] = [];
      const idealSecs = clamp(6, 18)(10); // keep consistent; you already clamp via duration()
      const wiggle = Math.min(vw() * gsap.utils.random(0.01, 0.03), 28);
      const tiltAmp = gsap.utils.random(8, 15); // degrees peak
      const tiltHz = gsap.utils.random(0.18, 0.3);
      let prevAngle = 0;

      for (let i = 1; i <= steps; i++) {
        const u = i / steps;
        const ti = t0 + u * idealSecs;
        const angle = Math.sin(ti * 2 * Math.PI * tiltHz) * tiltAmp;
        const drot = angle - prevAngle; // incremental tilt change
        prevAngle = angle;
        const dx = gsap.utils.random(-wiggle, wiggle);
        kfs.push({ x: `+=${dx}`, rotation: `+=${drot}`, ease: 'none' });
      }
      return { keyframes: kfs, ease: 'none' };
    },
    duration: rand(6, 10),
    rotPerCycle: () => randInt(0, 360),
  },

  [Theme.Winter]: {
    spawn: (_el, size) => {
      const { min, max, base } = SCALE_CLAMP[Theme.Winter];
      const scaleClamp = gsap.utils.clamp(min, max);
      return {
        x: rand(0, vw()),
        y: -rand(40, 200),
        scale: scaleClamp(size / base),
        rot: 0,
        opacity: 0.65,
      };
    },
    targetY: (footerTop) => footerTop,
    motion: () => {
      const drift = rand(0.12, 0.22) * vw();
      return {
        keyframes: [
          { x: `+=${drift}`, ease: 'sine.inOut' },
          { x: `-=${drift}`, ease: 'sine.inOut' },
        ],
        ease: 'sine.inOut',
      };
    },
    // **
    duration: rand(10, 13),
    rotPerCycle: () => 0,
    endOpacity: 1,
  },
  [Theme.Spring]: {
    spawn: (el, size) => {
      const { min, max, base } = SCALE_CLAMP[Theme.Fall];
      const scaleClamp = gsap.utils.clamp(min, max);
      // spawn from top/left/right
      const side = gsap.utils.random(['top', 'left', 'right'], true)();
      if (side === 'top') {
        return {
          x: rand(el.offsetWidth / 2, vw() - el.offsetWidth / 2),
          y: -rand(60, 180),
          scale: scaleClamp(size / base),
          rot: randInt(0, 360),
          opacity: 0.85,
        };
      } else if (side === 'left') {
        return {
          x: -rand(40, 140),
          y: rand(-40, vh() * 0.6),
          scale: scaleClamp(size / base),
          rot: randInt(0, 360),
          opacity: 0.85,
        };
      } else {
        return {
          x: vw() + rand(40, 140),
          y: rand(-40, vh() * 0.6),
          scale: scaleClamp(size / base),
          rot: randInt(0, 360),
          opacity: 0.85,
        };
      }
    },
    targetY: (footerTop) => Math.min(footerTop, vh() + 140),
    motion: (_el, size) => {
      const t0 = now();
      const steps = 6 + randInt(0, 2); // 6 to 9 segments
      const kfs: KeyframeStep[] = [];
      const idealSecs = clamp(6, 18)(10 + (24 - size) * 0.25);
      for (let i = 1; i <= steps; i++) {
        const u = i / steps;
        const ti = t0 + u * idealSecs;
        const vx = windX(ti);
        const vy = windY(ti);
        const segT = idealSecs / steps;
        const dx = vx * segT * gsap.utils.random(0.8, 1.25);
        const dy = Math.max(28, 60 + vy * segT); // ensure net downward
        const drot = windSpin(ti) * segT * gsap.utils.random(0.6, 1.2);
        kfs.push({ x: `+=${dx}`, y: `+=${dy}`, rotation: `+=${drot}`, ease: 'none' });
      }
      if (Math.random() < 0.35) {
        kfs.push(
          {
            x: `+=${rand(-20, 20)}`,
            y: `-=${rand(6, 14)}`,
            rotation: `+=${rand(-30, 30)}`,
            ease: 'none',
          },
          {
            x: `+=${rand(-20, 20)}`,
            y: `+=${rand(12, 24)}`,
            rotation: `+=${rand(-20, 20)}`,
            ease: 'none',
          },
        );
      }
      return { keyframes: kfs, ease: 'none' };
    },
    duration: rand(10, 13),
    rotPerCycle: () => 0, // rotation handled in keyframes
  },
  [Theme.Summer]: {
    spawn: (_el, size) => {
      const { min, max, base } = SCALE_CLAMP[Theme.Summer];
      const scaleClamp = gsap.utils.clamp(min, max);
      const margin = 48;
      return {
        x: margin,
        y: Math.max(0, vh() - 180),
        scale: scaleClamp(size / base),
        rot: 0,
      };
    },
    targetY: () => null, // timeline fully drives y
    motion: (el) => {
      const left = 48;
      const right = vw() - 48;
      const baseY = Math.max(0, vh() - 180);
      const apexY = Math.max(0, baseY - rand(140, 220));

      const tl = gsap.timeline({ repeat: -1, yoyo: true });

      // tl.fromTo(
      //   el,
      //   { x: (left + right) / 2, y: apexY, duration: 1.2, ease: 'none' },
      //   {
      //     x: right,
      //     y: baseY,
      //     duration: 1.2,
      //     ease: 'sine.in',
      //   },
      // );

      tl.to(el, { x: (left + right) / 2, y: apexY, duration: 1.2, ease: 'none' }).to(el, {
        x: right,
        y: baseY,
        duration: 1.2,
        ease: 'sine.in',
      });

      return { keyframes: [], ease: 'none' }; // not used here
    },
    duration: rand(5, 10),
    rotPerCycle: () => 0,
  },
};

// ---------------------------------------------
// Artifact creation
// ---------------------------------------------

function createArtifacts() {
  artifacts.value = [];
  const range = SIZE_RANGE[activeTheme.value];
  const min = range.min;
  const max = range.max;
  const artifactQuanity = ARTIFACT_QUANITY[activeTheme.value];

  for (let i = 0; i < artifactQuanity; i++) {
    const size = randRange(min, max);

    let emoji: string | null = null;
    switch (activeTheme.value) {
      case Theme.Fall:
        emoji = fallEmojis[Math.floor(Math.random() * fallEmojis.length)] ?? '🍁';
        break;
      case Theme.Winter:
        emoji = winterEmoji;
        break;
      case Theme.Spring:
        emoji = springEmoji;
        break;
      case Theme.Summer:
        emoji = summerEmoji;
        break;
    }

    artifacts.value.push({
      id: `${i}-${Math.random()}`,
      left: Math.random() * 100,
      size,
      emoji,
    });
  }
}

// ---------------------------------------------
// Animation runner
// ---------------------------------------------

const DRIZZLE_DELAY = 1.5; // global gate
const DRIZZLE_RATE = 0.5; // seconds between new leaves starting
const DRIZZLE_JITTER = 0.2; // small random +/- jitter per leaf

const animateArtifacts = () => {
  const nodes = artifactRefs.value
    .map((el) =>
      el instanceof HTMLElement ? el : el && '$el' in el ? (el.$el as HTMLElement) : null,
    )
    .filter(Boolean) as HTMLElement[];

  const distX = gsap.utils.distribute({ base: 24, amount: vw() - 48, ease: 'none', from: 0 });
  const distY = gsap.utils.distribute({ base: -160, amount: 40, ease: 'none', from: 0 }); // -160..-120

  const xVals = nodes.map((el, i) => distX(i, el, nodes));
  const yVals = nodes.map((el, i) => distY(i, el, nodes));

  gsap.utils.shuffle(xVals);
  gsap.utils.shuffle(yVals);

  for (let i = 0; i < nodes.length; i++) {
    const domEl = nodes[i] as HTMLElement;
    const artifact = artifacts.value[i];
    if (!artifact) continue;

    const cfg = SEASONS[activeTheme.value];
    const spawn = cfg.spawn(domEl, artifact.size);

    const spawnX = (xVals[i] ?? rand(24, vw() - 24)) + rand(-12, 12);
    const spawnY = (yVals[i] ?? rand(-160, -120)) + rand(-8, 8);

    const duration = cfg.duration;
    const phase = rand(100, 1000);
    const motion = cfg.motion(domEl, artifact.size, phase);
    const footerEl = document.querySelector('footer.q-footer') as HTMLElement;
    const footerTop = footerEl ? getAbsoluteOffsetTop(footerEl) : vh();
    const targetY = cfg.targetY(footerTop);

    const delay =
      DRIZZLE_DELAY + i * DRIZZLE_RATE + gsap.utils.random(-DRIZZLE_JITTER, DRIZZLE_JITTER);

    gsap.set(domEl, {
      x: 0,
      y: -50,
    });

    gsap.fromTo(
      domEl,
      {
        x: spawnX,
        y: spawnY,
        scale: spawn.scale,
        rotation: spawn.rot,
        opacity: spawn.opacity ?? 1,
      },
      {
        ...(targetY !== null ? { y: targetY } : {}),
        ease: motion.ease ?? 'none',
        ...(motion.keyframes ? { keyframes: motion.keyframes } : {}),
        ...(cfg.endOpacity ? { opacity: cfg.endOpacity } : {}),
        duration,
        delay,
        repeat: -1,
        repeatRefresh: true,
        repeatDelay: rand(1.0, 3.0),
        immediateRender: false, // ✅ prevents “from” state from flashing before delay with top
      },
    );
  }

  // universal layer reveal delay still works the same:
  // gsap.to(container, { autoAlpha: 1, delay, duration: 0.3, ease: 'power2.out' });
};

const handleResize = debounce(async () => {
  gsap.killTweensOf('*');
  artifacts.value = [];
  artifactRefs.value = [];
  await nextTick();
  createArtifacts(); // run for all themes
  await nextTick();
  artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);
  animateArtifacts();
}, 1);

onMounted(async () => {
  createArtifacts();
  await nextTick();
  artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);
  animateArtifacts();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  gsap.killTweensOf('*');
});

watch(activeTheme, async () => {
  // 2) Clear + rebuild new artifacts.
  artifacts.value = [];
  artifactRefs.value = [];
  await nextTick();
  createArtifacts(); // build for the NEW season
  await nextTick();

  artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);

  // set new nodes to an invisible, slightly soft state
  const newNodes: HTMLElement[] = [];
  for (const el of artifactRefs.value) {
    const node =
      el instanceof HTMLElement ? el : el && '$el' in el ? (el.$el as HTMLElement) : null;
    if (node) {
      node.style.opacity = '0';
      node.style.filter = 'blur(2px)';
      node.style.transform += ' scale(1.02)'; // tiny scale up before anim starts
      newNodes.push(node);
    }
  }

  // 3) Start motion NOW so they’re already moving as they appear.
  animateArtifacts();

  // 4) Fade new season IN smoothly and sharpen it.
  if (newNodes.length) {
    gsap.to(newNodes, {
      opacity: 0.9, // matches your CSS default
      filter: 'blur(0px)',
      scale: 1,
      duration: 1,
      stagger: { each: 0.006, from: 'random' },
      ease: 'power2.out',
    });
  }
});
</script>

<template>
  <div class="weather-artifact-container" ref="containerRef">
    <div
      v-for="(artifact, index) in artifacts"
      :key="artifact.id"
      class="weather-artifact"
      :style="{ fontSize: artifact.size + 'px' }"
      :ref="(el) => (artifactRefs[index] = el)"
    >
      <span class="artifact">{{ artifact.emoji }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-artifact-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.weather-artifact {
  position: absolute;
  color: white;
  opacity: 0.9;
  user-select: none;
  will-change: transform;
}
</style>
