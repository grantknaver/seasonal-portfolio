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
import { getCustomCssVar } from '../shared/utils/getCustomCssVar';
import { type Artifact } from '../shared/types/artifact';
import { Theme } from '../shared/constants/theme';
import { type Motion } from '../shared/types/motion';
import { type KeyframeStep } from '../shared/types/keyframeStep';
import { type Spawn } from '../shared/types/spawn';
import { rand } from '../shared/utils/rand';
import { vw } from '../shared/utils/viewWidth';
import { vh } from '../shared/utils/viewHeight';
import { randRange } from '../shared/utils/randRange';
import { clamp } from '../shared/utils/clamp';
import { randInt } from '../shared/utils/randInt';
import windDynamics from '../shared/utils/windDynamics';

// -----------------------------------------------------
// Store / reactive state
// -----------------------------------------------------
const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);

const artifacts = ref<Artifact[]>([]);
const artifactRefs = ref<(Element | ComponentPublicInstance | null)[]>([]);

// -----------------------------------------------------
// Theme glyphs (visuals)
// -----------------------------------------------------
const FALL_EMOJIS = ['🍂', '🍁'];
const WINTER_EMOJI = '❄';
const SPRING_EMOJI = '🌸';
const SUMMER_EMOJI = '🏐';

// -----------------------------------------------------
// Size ranges (font-size, in px) by season
// Controls visual size (CSS font-size), not GSAP scale
// -----------------------------------------------------
const FONT_SIZE_RANGE_PX: Record<Theme, { min: number; max: number }> = {
  [Theme.Fall]: { min: 20, max: 36 }, // leaves a bit larger on average
  [Theme.Winter]: { min: 8, max: 22 }, // snowflakes smaller
  [Theme.Spring]: { min: 10, max: 26 }, // petals medium/small
  [Theme.Summer]: { min: 18, max: 36 }, // volleyball bigger
};

// -----------------------------------------------------
// Artifact counts by season
// -----------------------------------------------------
const ARTIFACT_QUANTITY: Record<Theme, number> = {
  [Theme.Fall]: 50,
  [Theme.Winter]: 100,
  [Theme.Spring]: 50,
  [Theme.Summer]: 1,
};

// -----------------------------------------------------
// Per-season GSAP scale clamps (affects transform scale)
// Lets physics feel differ from font-size
// -----------------------------------------------------
const SCALE_CLAMP: Record<Theme, { min: number; max: number; base: number }> = {
  [Theme.Fall]: { min: 0.9, max: 1.5, base: 24 },
  [Theme.Winter]: { min: 0.5, max: 1.0, base: 24 },
  [Theme.Spring]: { min: 0.5, max: 1.0, base: 24 },
  [Theme.Summer]: { min: 0.9, max: 1.1, base: 28 }, // feel a bit heavier
};

// -----------------------------------------------------
// Seasonal timing & spin tuning
// -----------------------------------------------------
const FALL_DRIZZLE_DELAY = 1.5; // global gate before Fall starts
const FALL_DRIZZLE_RATE = 0.5; // seconds between new leaves starting
const FALL_DRIZZLE_JITTER = 0.2; // per-leaf random +/- jitter

const WINTER_DRIZZLE_DELAY = 1.5; // global gate before Winter starts
const WINTER_DRIZZLE_RATE = 0.1; // seconds between new flakes starting
const WINTER_DRIZZLE_JITTER = 0.2; // per-flake random +/- jitter

const FALL_SPIN_PROB = 0.6; // 60% of leaves can rotate this cycle

// -----------------------------------------------------
// DOM / layout utilities
// -----------------------------------------------------
const getAbsoluteOffsetTop = (el: HTMLElement): number => {
  let top = el.offsetTop;
  let parent = el.offsetParent as HTMLElement | null;
  while (parent) {
    top += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement | null;
  }
  return top;
};

// Fall duration scales w/ size (adjusted for small/mobile view)
const assignFallDuration = (artifactSizePx: number) => {
  let durationSec = 8 + (30 - artifactSizePx) * 0.25;
  const smallBreakpointPx = +getCustomCssVar('breakpoint-sm').slice(0, -2);
  const isMobile = smallBreakpointPx < 600;

  if (isMobile && activeTheme.value === Theme.Fall) {
    durationSec = 6 + (30 - artifactSizePx) * 0.15;
  }

  return durationSec;
};

// -----------------------------------------------------
// Seasonal behavior definitions
// -----------------------------------------------------

// Types for the per-season configuration object
type SeasonCfg = {
  // Where/How the element first appears
  spawn: (element: HTMLElement, artifactSizePx: number) => Spawn;

  // Target Y position for "falling" animations (null => y is driven in keyframes)
  targetY: (footerTopPx: number) => number | null;

  // Keyframed motion pattern for the season
  motion: (element: HTMLElement, artifactSizePx: number) => Motion;

  // Total animation duration for one cycle
  duration: (artifactSizePx: number) => number;

  // Start delay (used for drizzle/flurry staggering); return null to skip
  delay: (nodeIndex: number) => number | null;

  // Initial rotation angle
  rot: () => number;
};

// Season configs (renamed consistently and commented for context)
const SEASONS: Record<Theme, SeasonCfg> = {
  [Theme.Fall]: {
    /**
     * Spawn from the TOP only at a random x across the viewport.
     * Scale is clamped using Fall's scale clamp.
     */
    spawn: (element, artifactSize) => {
      const { min: minScale, max: maxScale, base: baseScale } = SCALE_CLAMP[Theme.Fall];
      const clampScale = clamp(minScale, maxScale);

      return {
        x: rand(element.offsetWidth / 2, vw() - element.offsetWidth / 2),
        // Slight vertical jitter so rows don't look grid-aligned
        y: rand(-160, -120) + rand(-8, 8),
        scale: clampScale(artifactSize / baseScale),
        rot: randInt(0, 360),
        opacity: 1,
      };
    },
    /** Limit fall distance to just above the footer (or a padded bottom-of-viewport). */
    targetY: (footerTopPx) => Math.min(footerTopPx, vh() + 140),
    /**
     * Gentle drift with optional spinning “tumbles”.
     * Uses smoothed wind for lateral drift and a spin envelope for bursts of rotation.
     */
    motion: (_element, artifactSize) => {
      const startTime = windDynamics.now() + rand(0, 1) * 1000; // de-sync each leaf a bit
      const totalSteps = 12; // modest for perf
      const idealDurationSeconds = clamp(6, 18)(10 + (36 - artifactSize) * 0.1);
      const segmentDuration = idealDurationSeconds / totalSteps;

      // --- lateral drift (smoothed)
      const lateralSmoothing = 0.9;
      const windInfluenceX = 0.5;
      const lateralBias = rand(-vw() * 0.01, vw() * 0.01); // small per-leaf bias

      // --- rotation (decide ONCE per leaf)
      const enableSpin = Math.random() < FALL_SPIN_PROB;
      // base tumble so spin is always visible when enabled
      const baseAngularVelDegPerSec = enableSpin
        ? (Math.random() < 0.5 ? -1 : 1) * rand(18, 35)
        : 0;

      const spinEnvelopeFn = windDynamics.makeSpinEnvelope(); // smooth bursts 0..1 over time
      const windSpinScale = 0.6; // how strongly wind affects spin
      const angularSmoothing = 0.75; // lower = less damping

      let velX = 0; // px/s (smoothed)
      let angularVelDegPerSec = baseAngularVelDegPerSec; // deg/s (smoothed)

      const keyframes: KeyframeStep[] = [];
      for (let step = 0; step < totalSteps; step++) {
        const t = startTime + (step / totalSteps) * idealDurationSeconds;

        // Lateral drift: ease toward wind + bias
        const targetVelX = lateralBias + windDynamics.windX(t) * windInfluenceX;
        velX = lateralSmoothing * velX + (1 - lateralSmoothing) * targetVelX;
        const dx = velX * segmentDuration;

        const frame: KeyframeStep = { x: `+=${dx}`, ease: 'none' };

        // Optional spinning: wind-boosted, smoothed envelopes
        if (enableSpin) {
          const targetOmega =
            baseAngularVelDegPerSec + windDynamics.windSpin(t) * windSpinScale * spinEnvelopeFn(t);
          angularVelDegPerSec =
            angularSmoothing * angularVelDegPerSec + (1 - angularSmoothing) * targetOmega;

          const dRot = angularVelDegPerSec * segmentDuration; // deg this segment

          // Skip tiny rotations that cost work but aren’t visible
          if (Math.abs(dRot) > 0.75) frame.rotation = `+=${dRot}`;
        }

        keyframes.push(frame);
      }

      return { keyframes, ease: 'none' };
    },
    /** Longer for larger sprites (feels heavier). */
    duration: (artifactSize) => assignFallDuration(artifactSize),
    /**
     * Stagger: slow drizzle effect with per-node jitter.
     * Keeps the scene feeling organic rather than bursty.
     */
    delay: (nodeIndex: number) =>
      FALL_DRIZZLE_DELAY +
      nodeIndex * FALL_DRIZZLE_RATE +
      rand(-FALL_DRIZZLE_JITTER, FALL_DRIZZLE_JITTER),
    /** Start without initial rotation; tumble happens in motion() if enabled. */
    rot: () => 0,
  },
  [Theme.Winter]: {
    /**
     * Spawn from the TOP at a random x like Fall,
     * but with no initial rotation (flakes start upright).
     */
    spawn: (element, artifactSize) => {
      const { min: minScale, max: maxScale, base: baseScale } = SCALE_CLAMP[Theme.Fall];
      const clampScale = clamp(minScale, maxScale);

      return {
        x: rand(element.offsetWidth / 2, vw() - element.offsetWidth / 2),
        y: rand(-160, -120) + rand(-8, 8),
        scale: clampScale(artifactSize / baseScale),
        rot: 0,
      };
    },

    /** Same vertical target behavior as Fall. */
    targetY: (footerTopPx) => Math.min(footerTopPx, vh() + 140),

    /**
     * Snow-like drift: slow, smoothed lateral wander driven by wind.
     * No spin here; Winter’s look is calmer and simpler.
     */
    motion: (_element, artifactSize) => {
      const startTime = windDynamics.now() + rand(0, 1) * 1000; // de-sync each flake
      const totalSteps = 14; // slightly more steps for a smoother drift
      const idealDurationSeconds = clamp(6, 18)(10 + (36 - artifactSize) * 0.1);
      const segmentDuration = idealDurationSeconds / totalSteps;

      const lateralSmoothing = 0.9;
      const windInfluenceX = 0.22;

      let velX = 0;

      const keyframes: KeyframeStep[] = [];
      for (let step = 0; step < totalSteps; step++) {
        const t = startTime + (step / totalSteps) * idealDurationSeconds;

        // Lateral drift only, smoothed toward wind target
        const targetVelX = windDynamics.windX(t) * windInfluenceX;
        velX = lateralSmoothing * velX + (1 - lateralSmoothing) * targetVelX;
        const dx = velX * segmentDuration;

        keyframes.push({
          x: `+=${dx}`,
          ease: 'none',
        });
      }

      return { keyframes, ease: 'none' };
    },

    /**
     * Stagger: winter “flurry” cadence.
     * Rate/jitter tuned independently from Fall to change the vibe.
     */
    delay: (nodeIndex: number) =>
      WINTER_DRIZZLE_DELAY +
      nodeIndex * WINTER_DRIZZLE_RATE +
      gsap.utils.random(-WINTER_DRIZZLE_JITTER, WINTER_DRIZZLE_JITTER),

    /** Flakes don’t linger as long. */
    duration: () => rand(4, 8),

    /** Occasional random spin to break uniformity. */
    rot: () => (rand(0, 1) > 0.08 ? randRange(0, 360) : 0),
  },
  [Theme.Spring]: {
    /**
     * Spawn from top/left/right edges.
     * Scale is clamped using Fall’s scale band (for consistency across themes).
     */
    spawn: (element, artifactSize) => {
      const { min: minScale, max: maxScale, base: baseScale } = SCALE_CLAMP[Theme.Fall];
      const clampScale = clamp(minScale, maxScale);

      // Choose side: top / left / right
      const spawnSide = gsap.utils.random(['top', 'left', 'right'], true)();
      if (spawnSide === 'top') {
        return {
          x: rand(element.offsetWidth / 2, vw() - element.offsetWidth / 2),
          y: -rand(100, 150),
          scale: clampScale(artifactSize / baseScale),
          rot: randInt(0, 360),
        };
      } else if (spawnSide === 'left') {
        return {
          x: -rand(40, 140),
          y: rand(-40, vh() * 0.6),
          scale: clampScale(artifactSize / baseScale),
          rot: randInt(0, 360),
        };
      } else {
        return {
          x: vw() + rand(40, 140),
          y: rand(-40, vh() * 0.6),
          scale: clampScale(artifactSize / baseScale),
          rot: 0,
        };
      }
    },

    /** Stop above footer or bottom-padding, whichever is higher. */
    targetY: (footerTopPx) => Math.min(footerTopPx, vh() + 140),

    /**
     * Breezy arc across the screen: forward progress toward an exit point,
     * wind added along/against the path, and a sinusoidal side sway.
     */
    motion: (_, artifactSize) => {
      const totalSteps = 14;
      const idealDurationSeconds = clamp(6, 18)(10 + (24 - artifactSize) * 0.25);
      const segmentDuration = idealDurationSeconds / totalSteps;

      const keyframes: KeyframeStep[] = [];
      const startTime = windDynamics.now();

      // GSAP keyframe value factory helper
      const asNumberOrString = (fn: (i: number, target: HTMLElement) => number) =>
        fn as unknown as number | string;

      const swayWaves = 1 + randInt(0, 1);
      const sinePhase = rand(0, Math.PI * 2);
      const EXIT_PADDING = 140;

      let exitX: number | null = null;
      let exitY: number | null = null;
      let velX = 0;
      let velY = 0;

      const dotProduct = (ax: number, ay: number, bx: number, by: number) => ax * bx + ay * by;

      for (let step = 1; step <= totalSteps; step++) {
        const progress = step / totalSteps;
        const t = startTime + progress * idealDurationSeconds;

        keyframes.push({
          x: asNumberOrString((_i, target) => {
            const currentX = Number(gsap.getProperty(target, 'x')) || 0;
            const currentY = Number(gsap.getProperty(target, 'y')) || 0;

            if (exitX == null) {
              // Decide horizontal exit: if we spawned from the left (x<0) → exit right, else → left
              exitX = currentX < 0 ? vw() + EXIT_PADDING : -EXIT_PADDING;
              exitY = vh() + EXIT_PADDING;
            }

            // Vector toward exit
            const dx = exitX - currentX;
            const dy = exitY! - currentY;
            const dist = Math.max(1, Math.hypot(dx, dy));
            const unitToExitX = dx / dist;
            const unitToExitY = dy / dist;

            // Perpendicular for lateral sway
            const perpX = -unitToExitY;
            const perpY = unitToExitX;

            // Base forward speed slowly increases with progress
            const baseForward =
              0.85 * vw() * (0.02 + 0.016 * Math.pow(progress, 1.3)) * segmentDuration;

            // Wind contributions
            const windVX = windDynamics.windX(t) * 0.1 * segmentDuration;
            const windVY = windDynamics.windY(t) * 0.06 * segmentDuration;

            // Wind projected along forward direction, clamped so it doesn’t dominate
            const windAlong = Math.max(
              -baseForward * 0.4,
              Math.min(baseForward * 0.4, windVX * unitToExitX + windVY * unitToExitY),
            );

            // Side-to-side sine sway
            const oscillationMagnitude =
              baseForward * 0.4 * Math.sin(sinePhase + progress * swayWaves * Math.PI * 2);

            // Proposed velocity
            let targetVelX = unitToExitX * (baseForward + windAlong) + perpX * oscillationMagnitude;
            let targetVelY = unitToExitY * (baseForward + windAlong) + perpY * oscillationMagnitude;

            // Ensure minimum forward progress so elements don’t stall or backtrack
            const minForwardSpeed = vw() * 0.006;
            const forwardComponent = dotProduct(targetVelX, targetVelY, unitToExitX, unitToExitY);
            if (forwardComponent < minForwardSpeed) {
              const add = minForwardSpeed - forwardComponent;
              targetVelX += unitToExitX * add;
              targetVelY += unitToExitY * add;
            }

            // Blend toward the “needed” velocity so we actually reach the exit in time
            const stepsRemaining = totalSteps - step + 1;
            const remainingDist = Math.hypot(exitX - currentX, exitY! - currentY);
            const neededSpeed = remainingDist / stepsRemaining;
            const blendTowardNeeded = Math.max(0.35, Math.min(0.75, Math.pow(progress, 1.8)));
            const neededVelX = unitToExitX * neededSpeed;
            const neededVelY = unitToExitY * neededSpeed;
            targetVelX = targetVelX * (1 - blendTowardNeeded) + neededVelX * blendTowardNeeded;
            targetVelY = targetVelY * (1 - blendTowardNeeded) + neededVelY * blendTowardNeeded;

            // Smooth velocity to avoid jitter
            const smoothing = 0.25;
            let newVelX = velX * smoothing + targetVelX * (1 - smoothing);
            let newVelY = velY * smoothing + targetVelY * (1 - smoothing);

            // Re-assert min forward motion after smoothing
            const newForwardComponent = dotProduct(newVelX, newVelY, unitToExitX, unitToExitY);
            if (newForwardComponent < minForwardSpeed) {
              const scaleUp = (minForwardSpeed + 1e-6) / Math.max(1e-6, newForwardComponent);
              newVelX *= scaleUp;
              newVelY *= scaleUp;
            }

            velX = newVelX;
            velY = newVelY;

            return currentX + velX;
          }),

          y: asNumberOrString((_i, target) => {
            const currentY = Number(gsap.getProperty(target, 'y')) || 0;
            return currentY + velY;
          }),

          // Add a bit of wind-driven spin so Spring feels lively
          rotation: `+=${windDynamics.windSpin(t) * segmentDuration * rand(3, 20)}`,
          ease: 'none',
        } as KeyframeStep);
      }

      return { keyframes, ease: 'none' };
    },
    duration: () => rand(10, 13),
    delay: () => 1,
    rot: () => (rand(0, 1) > 0.06 ? randRange(0, 360) : 0),
  },
  [Theme.Summer]: {
    /**
     * Spawn near bottom-left with a margin.
     * Summer is typically UI-driven (timeline controls y), not wind-driven.
     */
    spawn: (_, artifactSize) => {
      const { min: minScale, max: maxScale, base: baseScale } = SCALE_CLAMP[Theme.Summer];
      const clampScale = clamp(minScale, maxScale);
      const marginPx = 48;

      return {
        x: marginPx,
        y: Math.max(0, vh() - 180),
        scale: clampScale(artifactSize / baseScale),
        rot: 0,
      };
    },

    /** Summer animation is timeline-driven; no natural “fall” target. */
    targetY: () => null, // timeline fully drives y

    /** Not used; Summer’s movement comes from external timeline tweens. */
    motion: () => ({ keyframes: [], ease: 'none' }),

    /** Shorter presence; feels snappier / sunnier. */
    duration: () => rand(5, 10),

    /** Tiny delay to avoid everything appearing on the same frame. */
    delay: () => 1,

    /** No initial rotation. */
    rot: () => 0,
  },
};

// -----------------------------------------------------
// Artifact creation
// -----------------------------------------------------
function createArtifacts() {
  artifacts.value = [];

  const { min, max } = FONT_SIZE_RANGE_PX[activeTheme.value];
  const artifactCount = ARTIFACT_QUANTITY[activeTheme.value];

  for (let i = 0; i < artifactCount; i++) {
    const sizePx = randRange(min, max);

    // pick an emoji for this artifact based on theme
    let emoji: string | null = null;
    switch (activeTheme.value) {
      case Theme.Fall:
        emoji = FALL_EMOJIS[Math.floor(Math.random() * FALL_EMOJIS.length)] ?? '🍁';
        break;
      case Theme.Winter:
        emoji = WINTER_EMOJI;
        break;
      case Theme.Spring:
        emoji = SPRING_EMOJI;
        break;
      case Theme.Summer:
        emoji = SUMMER_EMOJI;
        break;
    }

    artifacts.value.push({
      id: `${i}-${Math.random()}`,
      left: Math.random() * 100, // initial CSS left% (not used for GSAP x)
      size: sizePx,
      emoji,
    });
  }
}

// -----------------------------------------------------
// Animation runner
// -----------------------------------------------------
const animateArtifacts = () => {
  // Normalize refs: accept raw HTMLElements and Vue component instances
  const nodes = artifactRefs.value
    .map((el) =>
      el instanceof HTMLElement ? el : el && '$el' in el ? (el.$el as HTMLElement) : null,
    )
    .filter(Boolean) as HTMLElement[];

  // Distribute initial x/y values across the batch to avoid overlap
  const spreadX = gsap.utils.distribute({ base: 24, amount: vw() - 48, ease: 'none', from: 0 });
  const spreadY = gsap.utils.distribute({ base: -160, amount: 40, ease: 'none', from: 0 }); // -160..-120

  const xSeed = nodes.map((el, i) => spreadX(i, el, nodes));
  const ySeed = nodes.map((el, i) => spreadY(i, el, nodes));
  gsap.utils.shuffle(xSeed);
  gsap.utils.shuffle(ySeed);

  for (let i = 0; i < nodes.length; i++) {
    const nodeEl = nodes[i] as HTMLElement;
    const artifact = artifacts.value[i];
    if (!artifact) continue;

    const seasonCfg = SEASONS[activeTheme.value];

    // initial spawn state (position, scale, rotation)
    const spawnState = seasonCfg.spawn(nodeEl, artifact.size);

    // determine vertical target (footer or padded bottom)
    const footerEl = document.querySelector('footer.q-footer') as HTMLElement;
    const footerTopPx = footerEl ? getAbsoluteOffsetTop(footerEl) : vh();
    const targetYPx = seasonCfg.targetY(footerTopPx);

    // motion keyframes/ease for this season
    const motionCfg = seasonCfg.motion(nodeEl, artifact.size);

    // drizzle / flurry stagger delay
    const startDelaySec = seasonCfg.delay(i) as number;

    // one cycle duration
    const runDurationSec = seasonCfg.duration(artifact.size);

    // reset node (prevents “from” flash in some cases)
    gsap.set(nodeEl, { x: 0, y: -50 });

    gsap.fromTo(
      nodeEl,
      {
        x: spawnState.x,
        y: spawnState.y,
        scale: spawnState.scale,
        rotation: spawnState.rot,
      },
      {
        ...(targetYPx !== null ? { y: targetYPx } : {}),
        ease: motionCfg.ease ?? 'none',
        ...(motionCfg.keyframes ? { keyframes: motionCfg.keyframes } : {}),
        duration: runDurationSec,
        delay: startDelaySec,
        repeat: -1,
        repeatRefresh: true, // recompute functions each repeat
        repeatDelay: rand(1.0, 3.0),
        immediateRender: false, // ✅ prevents “from” state from flashing before delay with top
      },
    );
  }
};

// -----------------------------------------------------
// Resize handling
// -----------------------------------------------------
const handleResize = debounce(async () => {
  gsap.killTweensOf('*');

  // reset lists to force fresh refs & animation
  artifacts.value = [];
  artifactRefs.value = [];
  await nextTick();

  createArtifacts();
  await nextTick();

  // keep refs array in sync with artifacts
  artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);

  animateArtifacts();
}, 1);

// -----------------------------------------------------
// Lifecycle
// -----------------------------------------------------
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

// Theme switch: cross-fade + blur soften-in, while motion starts immediately
watch(activeTheme, async () => {
  // reset lists so new season builds clean
  artifacts.value = [];
  artifactRefs.value = [];
  await nextTick();

  createArtifacts();
  await nextTick();

  artifactRefs.value = artifactRefs.value.slice(0, artifacts.value.length);

  // Prep nodes for a soft fade/blur-in
  const newNodes: HTMLElement[] = [];
  for (const el of artifactRefs.value) {
    const node =
      el instanceof HTMLElement ? el : el && '$el' in el ? (el.$el as HTMLElement) : null;
    if (node) {
      node.style.opacity = '0';
      node.style.filter = 'blur(2px)';
      node.style.transform += ' scale(1.02)';
      newNodes.push(node);
    }
  }

  // Start motion now so they’re moving as they appear
  animateArtifacts();

  // Fade/blur-in the new season
  if (newNodes.length) {
    gsap.to(newNodes, {
      opacity: 0.9, // matches CSS default
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
