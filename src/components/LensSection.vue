<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { Lens } from '../shared/constants/lens';
import { type LensDetails } from '../shared/types/lensDetails';
import { useViewport } from '../shared/utils/viewWidth';
import { useMainStore } from '../stores/main';
import { TopicName } from '../shared/constants/topicName';
import ProcessPaths from './ProcessPaths.vue';
import TeardownExample from './TeardownExample.vue';
import SampleDiagnostic from './SampleDiagnostic.vue';
import PatternIndexLink from './PatternIndexLink.vue';
import { PATTERN_INDEX_LENS } from '../shared/constants/patternIndex';

const mainStore = useMainStore();
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

/* Works on every layout: MainPage syncs its mobile/tablet accordion to activeTopic. */
const toContact = () => mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);
const toExamples = () => mainStore.SET_ACTIVE_TOPIC(TopicName.Examples);

/* One section open at a time keeps the panel short. "How it starts" is open by default. */
const chapters = [
  {
    id: 'lens-paths',
    title: 'How it starts',
    sub: 'Everyone starts the same way. What happens next depends on what you already know.',
  },
  {
    id: 'lens-teardown',
    title: 'What a Teardown Review looks like',
    sub: 'I look at one screen before we talk and bring 2–3 things I noticed. A conversation, not a pitch.',
  },
  {
    id: 'lens-lenses',
    title: 'The four lenses I look through',
    sub: 'Each one catches a different way people get stuck.',
  },
  {
    id: 'lens-diagnostic',
    title: 'A sample Diagnostic',
    sub: 'How “something feels off” turns into a clear list of what to fix.',
  },
] as const;
const sheetRef = ref<HTMLElement | null>(null);

/* After a section opens, bring its header to the top so the reader starts at the beginning. */
const onShown = (id: string) => {
  sheetRef.value
    ?.querySelector<HTMLElement>(`#${id}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const lens = ref<LensDetails[]>([
  {
    name: Lens.Clarity,
    id: uuidv4(),
    question: 'Can the user understand what the product is, what matters, and what’s being asked of them?',
    signals: [
      'Visitors leave the first screen without scrolling or clicking',
      'Sales calls start with “so what exactly does it do?”',
      'Your team explains the product differently than the site does',
    ],
    checks: [
      'The first-screen message against the one thing a buyer needs to believe',
      'Jargon and diagrams that explain “how” before “why”',
      'What the eye lands on first, second, and third',
    ],
    outcome:
      'More visitors understand the value fast enough to keep going, so attention stops leaking out of the top of the page.',
  },
  {
    name: Lens.Trust,
    id: uuidv4(),
    question: 'Is there enough evidence, feedback, control, and consistency to feel confident moving forward?',
    signals: [
      'Healthy time on page, but weak demo, signup, or contact rates',
      'Prospects ask for proof or security details before engaging',
      'Big claims with nothing visible backing them up',
    ],
    checks: [
      'Whether proof sits right beside each claim',
      'Credibility cues your buyer actually weighs',
      'Polish gaps and small errors that read as risk',
    ],
    outcome:
      'Doubt is answered the moment it forms, so qualified visitors take the next step instead of leaving to “think about it.”',
  },
  {
    name: Lens.Momentum,
    id: uuidv4(),
    question: 'Does the experience help people progress, or create hesitation, dead ends, and doubt about the next step?',
    signals: [
      'People click the CTA, then drop off in the form or onboarding',
      'Visitors reach the end of a page with nowhere clear to go',
      'Mobile converts far worse than desktop',
    ],
    checks: [
      'CTA placement and wording against how ready the visitor is',
      'Every step, field, and wait between intent and completion',
      'Feedback and motion that confirm progress, or slow it down',
    ],
    outcome:
      'Less friction between “I’m interested” and “I’m in,” which is where most conversions are won or lost.',
    note: 'It’s also how I make the other three stick: the right motion and pacing help clarity land, build confidence step by step, and make AI state visible.',
  },
  {
    name: Lens.AILegibility,
    id: uuidv4(),
    question: 'Can the user see what the AI is doing, what informed its output, its limits, and what they can do next?',
    signals: [
      'Users re-run prompts or ignore output they don’t understand',
      'Support tickets asking what the AI did or where an answer came from',
      'An AI feature that demos well but has low repeat use',
    ],
    checks: [
      'System states: thinking, working, done, unsure, failed',
      'Whether output shows its sources, limits, and confidence',
      'How easily users can correct, steer, or undo the AI',
    ],
    outcome:
      'People rely on the AI feature instead of working around it, so an impressive demo becomes something customers use and pay for.',
  },
]);

/* ---------- Selection + demo playback ---------- */

const activeId = ref(lens.value[0]!.id);
const active = computed(() => lens.value.find((l) => l.id === activeId.value) ?? lens.value[0]!);

/* Restart a tile's CSS demo in place. Remounting the DOM instead would swallow
   taps on touch devices (the node under the finger disappears mid-click). */
const replay = (tile: EventTarget | null) => {
  if (!(tile instanceof HTMLElement)) return;
  tile
    .querySelector('.demo')
    ?.getAnimations({ subtree: true })
    .forEach((a) => {
      a.cancel();
      a.play();
    });
};

const select = (id: string, e: Event) => {
  if (id === activeId.value) return;
  activeId.value = id;
  replay(e.currentTarget);
};

const onHover = (e: PointerEvent) => {
  if (e.pointerType === 'mouse') replay(e.currentTarget);
};

const gridRef = ref<HTMLElement | null>(null);
const gridIn = ref(false);
let io: IntersectionObserver | null = null;

onMounted(() => {
  if (!gridRef.value || !('IntersectionObserver' in window)) {
    gridIn.value = true;
    return;
  }
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        gridIn.value = true;
        io?.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  io.observe(gridRef.value);
});

onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <section
    class="lens-section full-width column"
    :class="isResponsive ? 'responsive-view q-pa-xs' : 'desktop-view q-pa-md'"
  >
    <div ref="sheetRef" class="lens-sheet">
      <header class="lens-intro">
        <p class="kicker q-mt-none q-mb-sm">Lens</p>
        <h1 class="q-mt-none q-mb-md">
          Complex products don’t lose people all at once. They lose them at specific moments.
        </h1>
        <p class="lead q-ma-none">
          Usually it’s where people are left guessing. Here’s how I find those spots, and what that
          looks like.
        </p>
      </header>

      <!-- 1. Decision tree -->
      <q-expansion-item
        :id="chapters[0].id"
        class="chapter"
        group="lens-chapters"
        default-opened
        expand-icon-class="chapter__icon"
        @after-show="onShown(chapters[0].id)"
      >
        <template #header>
          <div class="chapter__head">
            <span class="chapter__n">1</span>
            <div>
              <h2 class="q-my-none">{{ chapters[0].title }}</h2>
              <p class="q-ma-none">{{ chapters[0].sub }}</p>
            </div>
          </div>
        </template>
        <div class="chapter__body">
          <ProcessPaths />
        </div>
      </q-expansion-item>

      <!-- 2. Teardown (with what 150 of them taught me) -->
      <q-expansion-item
        :id="chapters[1].id"
        class="chapter"
        group="lens-chapters"
        expand-icon-class="chapter__icon"
        @after-show="onShown(chapters[1].id)"
      >
        <template #header>
          <div class="chapter__head">
            <span class="chapter__n">2</span>
            <div>
              <h2 class="q-my-none">{{ chapters[1].title }}</h2>
              <p class="q-ma-none">{{ chapters[1].sub }}</p>
            </div>
          </div>
        </template>
        <div class="chapter__body">
          <TeardownExample />

      <!-- What 150 Teardowns taught me -->
      <aside class="lesson">
        <p class="lesson__label q-ma-none">What 150 Teardowns taught me</p>
        <p class="lesson__big q-ma-none">Most products tell too much and show too little.</p>
        <p class="lesson__body q-ma-none">
          The most common problem I find is leaning on copy to explain things the product could just
          show. Words alone make people stop and work it out. Show it and tell it, and people get it
          faster, and more completely, with less to think about.
        </p>
        <div class="lesson__vs" aria-hidden="true">
          <div class="lesson__col">
            <em>Just telling</em>
            <span class="lesson__text">“Your order is being processed and will ship soon.”</span>
          </div>
          <div class="lesson__col lesson__col--show">
            <em>Showing and telling</em>
            <span class="lesson__track">
              <i class="on">Paid</i><b></b><i class="on">Packed</i><b class="dim"></b><i>Shipped</i>
            </span>
            <span class="lesson__note">Ships Thursday</span>
          </div>
        </div>
        <PatternIndexLink
          class="lesson__more"
          tone="dark"
          kicker="Pattern Index"
          text="More ways to show instead of tell"
        />
      </aside>
        </div>
      </q-expansion-item>

      <!-- 3. Lenses -->
      <q-expansion-item
        :id="chapters[2].id"
        class="chapter"
        group="lens-chapters"
        expand-icon-class="chapter__icon"
        @after-show="onShown(chapters[2].id)"
      >
        <template #header>
          <div class="chapter__head">
            <span class="chapter__n">3</span>
            <div>
              <h2 class="q-my-none">{{ chapters[2].title }}</h2>
              <p class="q-ma-none">{{ chapters[2].sub }}</p>
            </div>
          </div>
        </template>
        <div class="chapter__body">

      <!-- Four lenses, each with a tiny demo of what it fixes -->
      <div ref="gridRef" class="lens-grid" :class="{ 'is-in': gridIn }" role="tablist">
        <button
          v-for="(l, i) in lens"
          :key="l.id"
          type="button"
          role="tab"
          class="lens-tile"
          :class="{ 'is-active': l.id === activeId }"
          :aria-selected="l.id === activeId"
          :style="{ '--d': i }"
          @click="select(l.id, $event)"
          @pointerenter="onHover"
        >
          <div class="demo" :class="`demo--${i}`" aria-hidden="true">
            <!-- Clarity: noise resolves into headline + CTA -->
            <template v-if="l.name === Lens.Clarity">
              <i class="cl cl--1"></i>
              <i class="cl cl--2"></i>
              <i class="cl cl--3"></i>
            </template>

            <!-- Trust: each claim gets its proof -->
            <template v-else-if="l.name === Lens.Trust">
              <span class="tr-row"><i class="tr-claim"></i><b class="tr-proof">&#10003;</b></span>
              <span class="tr-row"><i class="tr-claim tr-claim--short"></i><b class="tr-proof">&#10003;</b></span>
            </template>

            <!-- Momentum: a clear path to the next step -->
            <template v-else-if="l.name === Lens.Momentum">
              <span class="mo-track">
                <i class="mo-dot"></i><i class="mo-dot"></i><i class="mo-dot"></i>
                <i class="mo-runner"></i>
              </span>
              <b class="mo-cta">Next</b>
            </template>

            <!-- AI legibility: the black box opens up -->
            <template v-else>
              <b class="ai-box">?</b>
              <span class="ai-steps">
                <i><s>&#10003;</s></i>
                <i><s>&#10003;</s></i>
                <i><s class="ai-conf"></s></i>
              </span>
            </template>
          </div>

          <span class="lens-tile__name">{{ l.name }}</span>
          <span class="lens-tile__q">{{ l.question }}</span>
        </button>
      </div>

      <!-- Detail for the selected lens -->
      <Transition name="lens-detail" mode="out-in">
        <article :key="active.id" class="lens-detail" role="tabpanel">
          <p class="lens-detail__q q-ma-none">
            <b>{{ active.name }}</b>
            <span v-if="isResponsive" class="lens-detail__qtext">{{ active.question }}</span>
          </p>
          <div class="lens-detail__cols">
            <div>
              <p class="col-label">Signs this is your problem</p>
              <ul class="lens-list">
                <li v-for="sig in active.signals" :key="sig">{{ sig }}</li>
              </ul>
            </div>
            <div>
              <p class="col-label">What I look at</p>
              <ul class="lens-list lens-list--checks">
                <li v-for="c in active.checks" :key="c">{{ c }}</li>
              </ul>
            </div>
          </div>
          <div class="lens-outcome">
            <span class="col-label">What fixing it changes</span>
            <p class="q-ma-none">{{ active.outcome }}</p>
          </div>
          <p v-if="active.note" class="lens-note q-ma-none">
            <b>Also a tool</b>{{ active.note }}
          </p>
          <!-- Going deeper: the chosen lens opens onto its page in the Pattern Index. -->
          <div class="lens-deeper">
            <PatternIndexLink
              kicker="Pattern Index"
              :path="PATTERN_INDEX_LENS[active.name].path"
              :text="PATTERN_INDEX_LENS[active.name].text"
            />
          </div>
        </article>
      </Transition>
        </div>
      </q-expansion-item>

      <!-- 4. Sample diagnostic -->
      <q-expansion-item
        :id="chapters[3].id"
        class="chapter"
        group="lens-chapters"
        expand-icon-class="chapter__icon"
        @after-show="onShown(chapters[3].id)"
      >
        <template #header>
          <div class="chapter__head">
            <span class="chapter__n">4</span>
            <div>
              <h2 class="q-my-none">{{ chapters[3].title }}</h2>
              <p class="q-ma-none">{{ chapters[3].sub }}</p>
            </div>
          </div>
        </template>
        <div class="chapter__body">
          <SampleDiagnostic />
        </div>
      </q-expansion-item>

      <div class="lens-close">
        <p class="q-ma-none">
          <b>Find the problem. Plan the fix. Build it.</b> See the builds, or start with a free
          Teardown Review.
        </p>
        <div class="lens-close__btns">
          <q-btn class="lens-cta lens-cta--ghost" flat size="lg" @click="toExamples">
            <span class="text-body-2">See the fixes</span>
          </q-btn>
          <q-btn class="lens-cta" color="accent" size="lg" glossy @click="toContact">
            <span class="text-body-2">Start with a Teardown</span>
          </q-btn>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
$ink: #0b1f2e;
$muted: rgba(11, 31, 46, 0.66);
$blue: #1260f0;
$navy: #0a3487;
$soft: #e5ecfd;
$line: rgba(18, 96, 240, 0.18);
$ease: cubic-bezier(0.22, 1, 0.36, 1);

.lens-sheet {
  display: grid;
  gap: 1.5rem;
  width: 100%;
  padding: clamp(1.25rem, 2.6vw, 2.5rem);
  border-radius: 1rem;
  background: #f7f9fe;
  box-shadow: 0 18px 50px rgba(6, 17, 31, 0.28);
  color: $ink;
}

.kicker {
  color: $blue;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.lens-intro {
  h1 {
    color: $ink;
    font-size: clamp(1.75rem, 2.4vw, 2.4rem);
    font-weight: 400;
    line-height: 1.12;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .lead {
    color: $muted;
    font-size: 1.02rem;
    font-weight: 600;
    line-height: 1.45;
  }
}

/* ---------- Tiles ---------- */

.lens-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.lens-tile {
  display: grid;
  align-content: start;
  gap: 0.35rem;
  padding: 0.9rem;
  border: 1px solid $line;
  border-radius: 0.85rem;
  background: #fff;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.45s ease,
    transform 0.45s $ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  transition-delay: calc(var(--d) * 0.08s), calc(var(--d) * 0.08s), 0s, 0s;

  &:hover {
    border-color: rgba(18, 96, 240, 0.4);
  }

  &:focus-visible {
    outline: 2px solid $blue;
    outline-offset: 2px;
  }

  &.is-active {
    border-color: $blue;
    box-shadow: 0 0 0 3px rgba(18, 96, 240, 0.12);
  }
}

.lens-grid.is-in .lens-tile {
  opacity: 1;
  transform: none;
}

.lens-tile__name {
  margin-top: 0.3rem;
  color: $ink;
  font-size: 1.02rem;
  font-weight: 700;
}

.lens-tile__q {
  color: $muted;
  font-size: 0.84rem;
  line-height: 1.35;
}

/* ---------- Demos ---------- */

.demo {
  position: relative;
  display: grid;
  align-content: center;
  gap: 6px;
  height: 64px;
  padding: 10px 12px;
  border-radius: 0.55rem;
  background: #f0f4fd;
  overflow: hidden;
}

/* Demos only run once the grid is on screen (and replay on hover/select). */
.lens-grid:not(.is-in) .demo * {
  animation-play-state: paused !important;
}

/* Clarity */
.cl {
  display: block;
  height: 8px;
  border-radius: 4px;
  background: #c9d6ef;
  animation: 1.4s $ease both;
}
.cl--1 {
  width: 78%;
  animation-name: cl-1;
}
.cl--2 {
  width: 56%;
  animation-name: cl-2;
}
.cl--3 {
  width: 30%;
  height: 12px;
  animation-name: cl-3;
}

@keyframes cl-1 {
  0%,
  25% {
    transform: translateX(18%) rotate(3deg);
    filter: blur(2px);
  }
  100% {
    height: 11px;
    background: $navy;
    transform: none;
    filter: none;
  }
}
@keyframes cl-2 {
  0%,
  25% {
    transform: translateX(-12%) rotate(-4deg);
    filter: blur(2px);
  }
  100% {
    transform: none;
    filter: none;
  }
}
@keyframes cl-3 {
  0%,
  25% {
    transform: translateX(40%) rotate(5deg);
    filter: blur(2px);
  }
  100% {
    background: $blue;
    transform: none;
    filter: none;
  }
}

/* Trust */
.tr-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.tr-claim {
  display: block;
  width: 62%;
  height: 8px;
  border-radius: 4px;
  background: #c9d6ef;

  &--short {
    width: 46%;
  }
}
.tr-proof {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #12a15a;
  color: #fff;
  font-size: 0.62rem;
  animation: tr-proof 0.6s $ease both;
}
.tr-row:nth-child(1) .tr-proof {
  animation-delay: 0.35s;
}
.tr-row:nth-child(2) .tr-proof {
  animation-delay: 0.75s;
}

@keyframes tr-proof {
  from {
    opacity: 0;
    transform: translateX(14px) scale(0.6);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Momentum */
.demo--2 {
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
}
.mo-track {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2px;
  background: #c9d6ef;
}
.mo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c9d6ef;
}
.mo-runner {
  position: absolute;
  top: 50%;
  left: 0;
  width: 12px;
  height: 12px;
  margin-top: -6px;
  border-radius: 50%;
  background: $blue;
  box-shadow: 0 0 0 4px rgba(18, 96, 240, 0.18);
  animation: mo-run 1.2s $ease 0.2s both;
}
.mo-cta {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid $line;
  color: $navy;
  font-size: 0.72rem;
  animation: mo-cta 0.4s ease 1.25s both;
}

@keyframes mo-run {
  from {
    left: 0;
  }
  to {
    left: calc(100% - 12px);
  }
}
@keyframes mo-cta {
  to {
    background: $blue;
    border-color: $blue;
    color: #fff;
    transform: scale(1.06);
  }
}

/* AI legibility */
.ai-box {
  position: absolute;
  inset: 10px 12px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: $ink;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  animation: ai-box 0.5s ease 0.35s both;
}
.ai-steps {
  display: grid;
  gap: 5px;

  i {
    display: flex;
    gap: 6px;
    align-items: center;
    height: 10px;
    opacity: 0;
    animation: ai-step 0.35s ease both;

    &::after {
      content: '';
      height: 6px;
      width: 58%;
      border-radius: 3px;
      background: #c9d6ef;
    }

    &:nth-child(1) {
      animation-delay: 0.75s;
    }
    &:nth-child(2) {
      animation-delay: 0.95s;
      &::after {
        width: 44%;
      }
    }
    &:nth-child(3) {
      animation-delay: 1.15s;
      &::after {
        width: 34%;
      }
    }
  }

  s {
    display: grid;
    place-items: center;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $blue;
    color: #fff;
    font-size: 0.5rem;
    text-decoration: none;
  }

  .ai-conf {
    background: radial-gradient(circle, $blue 0 32%, #cfe0ff 36% 100%);
  }
}

@keyframes ai-box {
  to {
    opacity: 0;
    transform: scale(0.92);
  }
}
@keyframes ai-step {
  to {
    opacity: 1;
  }
}

/* ---------- Detail ---------- */

.lens-detail {
  display: grid;
  gap: 0.75rem;
}

.lens-detail__q {
  color: $ink;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;

  b {
    display: inline-flex;
    gap: 0.4rem;
    align-items: center;
    color: $blue;

    &::before {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: $blue;
    }
  }
}

.lens-detail__qtext {
  display: block;
  margin-top: 0.2rem;
}

.lens-detail__cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  > div {
    padding: 1rem;
    border: 1px solid $line;
    border-radius: 0.8rem;
    background: #fff;
  }
}

.col-label {
  display: block;
  margin: 0 0 0.55rem;
  color: $blue;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lens-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 1rem;
    color: $muted;
    font-size: 0.88rem;
    line-height: 1.4;

    &::before {
      content: '';
      position: absolute;
      top: 0.5em;
      left: 0;
      width: 0.42rem;
      height: 0.42rem;
      border: 1.5px solid $blue;
      border-radius: 50%;
    }
  }

  &--checks li::before {
    border-radius: 2px;
    background: $blue;
  }
}

.lens-outcome {
  padding: 0.9rem 1rem;
  border-radius: 0.8rem;
  background: $blue;
  color: #fff;

  .col-label {
    color: rgba(255, 255, 255, 0.78);
  }

  p {
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.45;
  }
}

.lens-note {
  padding: 0.8rem 1rem;
  border: 1px dashed rgba(18, 96, 240, 0.45);
  border-radius: 0.8rem;
  background: #fff;
  color: $ink;
  font-size: 0.9rem;
  line-height: 1.45;

  b {
    display: block;
    margin-bottom: 0.2rem;
    color: $blue;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}

.lens-deeper {
  padding-top: 0.8rem;
  border-top: 1px solid $line;
}

.lens-detail-enter-active,
.lens-detail-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}
.lens-detail-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.lens-detail-leave-to {
  opacity: 0;
}

/* ---------- Close ---------- */

.lesson {
  display: grid;
  gap: 0.6rem;
  padding: 1.2rem 1.25rem;
  border-radius: 0.9rem;
  background: $ink;
  color: #fff;
}

.lesson__label {
  color: #9ec0ff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.lesson__big {
  font-size: clamp(1.25rem, 1.8vw, 1.6rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.lesson__more {
  margin-top: 0.35rem;
}

.lesson__body {
  max-width: 44rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.92rem;
  line-height: 1.5;
}

.lesson__vs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
  margin-top: 0.3rem;
}

.lesson__col {
  display: grid;
  gap: 0.45rem;
  align-content: start;
  padding: 0.8rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.7rem;
  background: rgba(255, 255, 255, 0.05);

  em {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.66rem;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &--show {
    border-color: rgba(158, 192, 255, 0.5);
    background: rgba(18, 96, 240, 0.18);
  }
}

.lesson__text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.88rem;
  font-style: italic;
  line-height: 1.4;
}

.lesson__track {
  display: flex;
  gap: 0.35rem;
  align-items: center;

  i {
    padding: 0.15rem 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.72rem;
    font-style: normal;
    font-weight: 700;

    &.on {
      border-color: #5fd39a;
      background: rgba(95, 211, 154, 0.15);
      color: #8ff0bf;
    }
  }

  b {
    flex: 1;
    min-width: 0.6rem;
    height: 2px;
    background: #5fd39a;

    &.dim {
      background: rgba(255, 255, 255, 0.25);
    }
  }
}

.lesson__note {
  color: #fff;
  font-size: 0.86rem;
  font-weight: 700;
}

.chapter {
  border: 1px solid $line;
  border-radius: 0.9rem;
  background: #fff;
  scroll-margin-top: 0.75rem;
  overflow: hidden;

  :deep(.q-item) {
    align-items: center;
    padding: 0.9rem 1rem;
  }

  :deep(.q-expansion-item__content) {
    padding: 0 1rem 1rem;
  }
}

/* Phones: clear the sticky site header and the open Lens bar when scrolling to a section. */
.responsive-view .chapter {
  scroll-margin-top: 7rem;
}

.chapter__body {
  display: grid;
  gap: 1.25rem;
}

:deep(.chapter__icon) {
  color: $blue;
}

.chapter__head {
  flex: 1;
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;

  h2 {
    color: $ink;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.25;
  }

  p {
    margin-top: 0.2rem !important;
    color: $muted;
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

.chapter__n {
  flex: none;
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  margin-top: 0.05rem;
  border-radius: 50%;
  background: $ink;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
}

.lens-close__btns {
  display: flex;
  flex: none;
  gap: 0.5rem;
}

.lens-cta--ghost {
  border: 1px solid $line;
  color: $navy;
}

.lens-close {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem;
  border: 1px solid $line;
  border-radius: 0.8rem;
  background: #fff;

  p {
    color: $muted;
    line-height: 1.4;
  }

  b {
    color: $ink;
  }
}

.lens-cta {
  flex: none;
  border-radius: 0.75rem;
  white-space: nowrap;
}

/* ---------- Layout variants ---------- */

.desktop-view .lens-sheet {
  max-width: 960px;
  margin-inline: auto;
}

.responsive-view {
  .lens-grid {
    gap: 0.5rem;
  }

  .lens-tile {
    padding: 0.7rem;
  }

  .lens-tile__q {
    display: none;
  }

  .lens-tile.is-active .lens-tile__name {
    color: $blue;
  }


  .lens-detail__cols {
    grid-template-columns: 1fr;
  }

  .lens-close {
    flex-direction: column;
    align-items: stretch;
  }

  .lens-close__btns {
    flex-direction: column;
  }

  .lesson__vs {
    grid-template-columns: 1fr;
  }

  .chapter :deep(.q-expansion-item__content) {
    padding: 0 0.6rem 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lens-tile {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .demo *,
  .demo *::after {
    animation-duration: 0.01s !important;
    animation-delay: 0s !important;
  }
}
</style>
