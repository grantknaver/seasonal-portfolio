<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { mdiOpenInNew, mdiPlayCircleOutline, mdiArrowRightThin } from '@quasar/extras/mdi-v7';
import { useViewport } from '../shared/utils/viewWidth';
import { useMainStore } from '../stores/main';
import { TopicName } from 'src/shared/constants/topicName';
import { type PictureData } from '../shared/types/pictureData';

import agentgateA from 'src/assets/examples/agentgate-a.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import agentgateB from 'src/assets/examples/agentgate-b.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import futureframeA from 'src/assets/examples/futureframe-a.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import futureframeB from 'src/assets/examples/futureframe-b.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import fizzcoA from 'src/assets/examples/fizzco-a.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import fizzcoB from 'src/assets/examples/fizzco-b.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import seasonalA from 'src/assets/examples/seasonal-a.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import seasonalB from 'src/assets/examples/seasonal-b.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import whenthenA from 'src/assets/examples/whenthen-a.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import whenthenB from 'src/assets/examples/whenthen-b.jpg?w=720;1200&format=avif;webp;jpg&as=picture';
import robotA from 'src/assets/examples/robot-a.jpg?w=720;1200&format=avif;webp;jpg&as=picture';

const mainStore = useMainStore();
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

/* Works on every layout: MainPage syncs its mobile/tablet accordion to activeTopic. */
const toContact = () => mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);

const ROBOT_URL = 'https://robot-narrator.pages.dev/';

interface ShowcaseItem {
  id: string;
  title: string;
  kind: string;
  tags: string[];
  what: string;
  why: string;
  /** How momentum (motion, pacing, sequence) is used to make the point stick. */
  momentum: string;
  url: string;
  /** Before / after frames. The card resolves from a to b. */
  a: PictureData;
  b?: PictureData;
  stateA: string;
  stateB?: string;
  featured?: boolean;
  live?: boolean;
}

const items: ShowcaseItem[] = [
  {
    id: 'agentgate',
    title: 'AgentGate',
    kind: 'Concept build',
    tags: ['AI legibility', 'Trust'],
    what: 'AI governance for autonomous agents. A $1,200 refund request has to clear identity, authority, and policy before it can execute.',
    why: 'Every team adopting AI agents is asking what the agent is allowed to do, and whether they can see why. This makes the answer readable at a glance.',
    momentum: 'Each scroll resolves one check, so trust builds in the same order the system grants it.',
    url: 'https://agentgate-bpb.pages.dev/',
    a: agentgateA,
    b: agentgateB,
    stateA: 'Checks resolving',
    stateB: 'Authorized',
    featured: true,
  },
  {
    id: 'whenthen',
    title: 'WhenThen',
    kind: 'Concept build',
    tags: ['Clarity', 'Trust'],
    what: 'A launch page for a guide on behaviour verification: proving that software does exactly what its spec says, at massive scale.',
    why: 'As AI writes and runs more of our software, proof becomes the trust signal. This takes a dense technical idea and makes it graspable in one screen.',
    momentum: 'Given, when, then drift in the background, then resolve into one clear next step: get the guide.',
    url: 'https://when-then.pages.dev/',
    a: whenthenA,
    b: whenthenB,
    stateA: 'The idea',
    stateB: 'The next step',
    featured: true,
  },
  {
    id: 'futureframe',
    title: 'Futureframe',
    kind: 'Concept build',
    tags: ['AI legibility', 'Trust'],
    what: 'AI age projection where the signals behind the result stay visible, and uncertainty is disclosed instead of hidden.',
    why: 'AI feels like a black box when people only see the answer. Showing the “why” is what makes it believable.',
    momentum: 'Scrolling moves you through time, so the result never arrives without its reasons.',
    url: 'https://futureframe-8ep.pages.dev/',
    a: futureframeA,
    b: futureframeB,
    stateA: 'Age 8',
    stateB: 'Age 67',
  },
  {
    id: 'robot',
    title: 'Readbot',
    kind: 'Interactive build',
    tags: ['AI legibility'],
    what: 'An AI narrator that visibly reads along. Pick a voice and press play.',
    why: 'AI audio is invisible by default. Visible feedback shows the system is working, and who is speaking.',
    momentum: 'Motion tracks the audio in real time, so you always know where the story is.',
    url: ROBOT_URL,
    a: robotA,
    stateA: 'Try it here',
    live: true,
  },
  {
    id: 'fizzco',
    title: 'Fizzco',
    kind: 'Concept build',
    tags: ['Clarity'],
    what: 'A launch page where the product assembles as you scroll.',
    why: 'When the product is the message, showing beats telling. The offer lands before a word is read.',
    momentum: 'One scroll builds the product, so understanding arrives before the copy does.',
    url: 'https://fizzco.pages.dev/',
    a: fizzcoA,
    b: fizzcoB,
    stateA: 'First frame',
    stateB: 'One scroll later',
  },
  {
    id: 'seasonal',
    title: 'Seasons',
    kind: 'Motion study',
    tags: ['Clarity'],
    what: 'Four seasons, each with its own weather, pace, and palette, switchable in one tap.',
    why: 'Atmosphere only helps if it never competes with the content. This is the restraint behind every animation I ship.',
    momentum: 'Each season sets its own pace, carrying mood without stealing focus.',
    url: 'https://seasonal-example.pages.dev/',
    a: seasonalA,
    b: seasonalB,
    stateA: 'Fall',
    stateB: 'Winter',
  },
];

const featured = items.filter((i) => i.featured);
const rest = items.filter((i) => !i.featured);

/* ---------- Before → after playback ---------- */

const resolved = reactive<Record<string, boolean>>({});
const timers: Record<string, number> = {};

const play = (id: string, delay = 700) => {
  window.clearTimeout(timers[id]);
  resolved[id] = false;
  timers[id] = window.setTimeout(() => (resolved[id] = true), delay);
};

const onHover = (id: string, e: PointerEvent) => {
  if (e.pointerType === 'mouse') play(id, 450);
};

/* The robot iframe only mounts when asked for, so it never loads (or breaks) unseen. */
const robotLive = ref(false);

let io: IntersectionObserver | null = null;
const root = ref<HTMLElement | null>(null);

onMounted(() => {
  const cards = root.value?.querySelectorAll<HTMLElement>('[data-card]') ?? [];
  if (!('IntersectionObserver' in window)) {
    items.forEach((i) => (resolved[i.id] = true));
    return;
  }
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const id = (e.target as HTMLElement).dataset.card!;
        if (e.isIntersecting && resolved[id] === undefined) play(id, 900);
      });
    },
    { threshold: 0.45 },
  );
  cards.forEach((c) => io!.observe(c));
});

onBeforeUnmount(() => {
  io?.disconnect();
  Object.values(timers).forEach((t) => window.clearTimeout(t));
});
</script>

<template>
  <section
    ref="root"
    class="examples-section full-width column"
    :class="isResponsive ? 'responsive-view q-pa-xs' : 'desktop-view q-pa-md'"
  >
    <div class="ex-sheet">
      <header class="ex-intro">
        <p class="kicker q-mt-none q-mb-sm">Examples</p>
        <h1 class="q-mt-none q-mb-md">Don’t take my word for it. Scroll through these.</h1>
        <p class="lead q-ma-none">
          Each build makes something complex clear, trustworthy, or legible as AI, and uses
          momentum to make it stick.
        </p>
      </header>

      <!-- Featured -->
      <template v-for="it in featured" :key="it.id">
        <article
          class="ex-card ex-card--featured"
          :data-card="it.id"
          @pointerenter="onHover(it.id, $event)"
        >
          <a class="ex-media" :href="it.url" target="_blank" rel="noopener noreferrer" :aria-label="`Open ${it.title} live`">
            <picture class="ex-frame">
              <source v-for="(s, k) in it.a.sources" :key="k" :srcset="s" :type="`image/${k}`" sizes="(min-width: 1440px) 900px, 95vw" />
              <img :src="it.a.img.src" :alt="`${it.title}: ${it.stateA}`" loading="lazy" decoding="async" />
            </picture>
            <picture v-if="it.b" class="ex-frame ex-frame--b" :class="{ 'is-on': resolved[it.id] }">
              <source v-for="(s, k) in it.b.sources" :key="k" :srcset="s" :type="`image/${k}`" sizes="(min-width: 1440px) 900px, 95vw" />
              <img :src="it.b.img.src" :alt="`${it.title}: ${it.stateB}`" loading="lazy" decoding="async" />
            </picture>
            <span class="ex-state">
              <i :class="{ 'is-on': resolved[it.id] }"></i>
              {{ resolved[it.id] ? it.stateB : it.stateA }}
            </span>
          </a>
          <div class="ex-body ex-body--split">
            <div class="ex-col">
              <div class="ex-meta">
                <span class="ex-kind">{{ it.kind }}</span>
                <span v-for="t in it.tags" :key="t" class="ex-tag">{{ t }}</span>
              </div>
              <h2 class="q-my-none">{{ it.title }}</h2>
              <p class="ex-what q-ma-none">{{ it.what }}</p>
              <a class="ex-link" :href="it.url" target="_blank" rel="noopener noreferrer">
                Open live <q-icon :name="mdiOpenInNew" size="16px" />
              </a>
            </div>
            <div class="ex-col">
              <p class="ex-why q-ma-none"><b>Why it’s here</b>{{ it.why }}</p>
              <p class="ex-momentum q-ma-none">
                <q-icon :name="mdiArrowRightThin" size="18px" /><span><b>Momentum</b> {{ it.momentum }}</span>
              </p>
            </div>
          </div>
        </article>
      </template>

      <!-- The rest -->
      <div class="ex-grid">
        <article
          v-for="it in rest"
          :key="it.id"
          class="ex-card"
          :class="{ 'ex-card--live': it.live && robotLive }"
          :data-card="it.id"
          @pointerenter="onHover(it.id, $event)"
        >
          <!-- Robot narrator: poster until asked, then the real iframe -->
          <div v-if="it.live" class="ex-media ex-media--live">
            <div v-if="robotLive" class="narrator-container">
              <iframe
                title="Robot narrator waveform visualizer"
                class="narrator"
                :src="ROBOT_URL"
              ></iframe>
            </div>
            <button v-else type="button" class="ex-play" @click="robotLive = true">
              <picture class="ex-frame">
                <source v-for="(s, k) in it.a.sources" :key="k" :srcset="s" :type="`image/${k}`" sizes="(min-width: 1440px) 450px, 95vw" />
                <img :src="it.a.img.src" :alt="it.title" loading="lazy" decoding="async" />
              </picture>
              <span class="ex-play__btn">
                <q-icon :name="mdiPlayCircleOutline" size="22px" /> {{ it.stateA }}
              </span>
            </button>
          </div>

          <a v-else class="ex-media" :href="it.url" target="_blank" rel="noopener noreferrer" :aria-label="`Open ${it.title} live`">
            <picture class="ex-frame">
              <source v-for="(s, k) in it.a.sources" :key="k" :srcset="s" :type="`image/${k}`" sizes="(min-width: 1440px) 450px, 95vw" />
              <img :src="it.a.img.src" :alt="`${it.title}: ${it.stateA}`" loading="lazy" decoding="async" />
            </picture>
            <picture v-if="it.b" class="ex-frame ex-frame--b" :class="{ 'is-on': resolved[it.id] }">
              <source v-for="(s, k) in it.b.sources" :key="k" :srcset="s" :type="`image/${k}`" sizes="(min-width: 1440px) 450px, 95vw" />
              <img :src="it.b.img.src" :alt="`${it.title}: ${it.stateB}`" loading="lazy" decoding="async" />
            </picture>
            <span v-if="it.b" class="ex-state">
              <i :class="{ 'is-on': resolved[it.id] }"></i>
              {{ resolved[it.id] ? it.stateB : it.stateA }}
            </span>
          </a>

          <div class="ex-body">
            <div class="ex-meta">
              <span class="ex-kind">{{ it.kind }}</span>
              <span v-for="t in it.tags" :key="t" class="ex-tag">{{ t }}</span>
            </div>
            <h2 class="q-my-none">{{ it.title }}</h2>
            <p class="ex-what q-ma-none">{{ it.what }}</p>
            <p class="ex-why q-ma-none"><b>Why it’s here</b>{{ it.why }}</p>
            <p class="ex-momentum q-ma-none">
              <q-icon :name="mdiArrowRightThin" size="18px" /><span><b>Momentum</b> {{ it.momentum }}</span>
            </p>
            <a class="ex-link" :href="it.url" target="_blank" rel="noopener noreferrer">
              Open live <q-icon :name="mdiOpenInNew" size="16px" />
            </a>
          </div>
        </article>
      </div>

      <div class="ex-close">
        <p class="q-ma-none"><b>Want this for your product?</b> It starts with a Teardown Review.</p>
        <q-btn class="ex-cta" color="accent" size="lg" glossy @click="toContact">
          <span class="text-body-2">Let’s Talk</span>
        </q-btn>
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

.ex-sheet {
  display: grid;
  gap: 1.25rem;
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

.ex-intro {
  margin-bottom: 0.25rem;

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

/* ---------- Cards ---------- */

.ex-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.ex-card {
  display: grid;
  align-content: start;
  overflow: hidden;
  border: 1px solid $line;
  border-radius: 0.9rem;
  background: #fff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(18, 96, 240, 0.4);
    box-shadow: 0 10px 28px rgba(10, 52, 135, 0.1);
  }
}

.ex-card--featured {
  .ex-media {
    aspect-ratio: 2 / 1;
  }

  .ex-body--split {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 1.25rem;
    padding: 1.2rem 1.35rem 1.35rem;
  }

  .ex-col {
    display: grid;
    align-content: start;
    gap: 0.55rem;
  }

  h2 {
    font-size: 1.6rem;
  }
}

/* When the robot is playing, give it the full row. */
.ex-card--live {
  grid-column: 1 / -1;
}

.ex-media {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 1px solid $line;
  background: #eef2fb;
}

.ex-card--live .ex-media--live {
  aspect-ratio: auto;
}

.ex-frame {
  position: absolute;
  inset: 0;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transition: transform 0.6s ease;
  }
}

.ex-card:hover .ex-frame img {
  transform: scale(1.02);
}

.ex-frame--b {
  opacity: 0;
  transition: opacity 0.9s ease;

  &.is-on {
    opacity: 1;
  }
}

.ex-state {
  position: absolute;
  left: 0.6rem;
  bottom: 0.6rem;
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 4px 12px rgba(6, 17, 31, 0.15);
  color: $navy;
  font-size: 0.72rem;
  font-weight: 700;

  i {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: #c9d6ef;
    transition: background 0.3s ease;

    &.is-on {
      background: #12a15a;
    }
  }
}

/* Robot poster */
.ex-play {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: #f6f5f1;
  cursor: pointer;

  .ex-frame img {
    object-fit: contain;
    object-position: center;
  }
}

.ex-play__btn {
  position: absolute;
  left: 50%;
  bottom: 0.8rem;
  translate: -50% 0;
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: $blue;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(18, 96, 240, 0.3);
}

/* Readbot needs ~860px at this width before its player controls stop overflowing. */
.narrator-container {
  display: flex;
  justify-content: center;
  height: 860px;
  min-height: 860px;
  background: #f6f5f1;

  .narrator {
    width: 100%;
    height: 100%;
    border: 0;
    background: #fff;
  }
}

/* Body */
.ex-body {
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.1rem 1.1rem;

  h2 {
    color: $ink;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }
}

.ex-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.ex-kind,
.ex-tag {
  padding: 0.14rem 0.5rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.3;
}

.ex-kind {
  border: 1px solid rgba(11, 31, 46, 0.14);
  color: $muted;
}

.ex-tag {
  background: $soft;
  color: $navy;
}

.ex-what {
  color: $ink;
  font-size: 0.9rem;
  line-height: 1.45;
}

.ex-why {
  padding: 0.6rem 0.75rem;
  border-left: 3px solid $blue;
  border-radius: 0.4rem;
  background: #f3f7ff;
  color: $muted;
  font-size: 0.84rem;
  line-height: 1.4;

  b {
    display: block;
    margin-bottom: 0.1rem;
    color: $blue;
    font-size: 0.66rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}

.ex-momentum {
  display: flex;
  gap: 0.35rem;
  align-items: flex-start;
  color: $muted;
  font-size: 0.82rem;
  line-height: 1.4;

  .q-icon {
    flex: none;
    margin-top: 0.05rem;
    color: $blue;
  }

  b {
    color: $ink;
    font-weight: 700;
  }
}

.ex-link {
  display: inline-flex;
  gap: 0.3rem;
  align-items: center;
  justify-self: start;
  margin-top: 0.15rem;
  color: $blue;
  font-size: 0.86rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

/* Close */
.ex-close {
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

.ex-cta {
  flex: none;
  border-radius: 0.75rem;
  white-space: nowrap;
}

/* ---------- Layout variants ---------- */

.desktop-view .ex-sheet {
  max-width: 960px;
  margin-inline: auto;
}

.responsive-view {
  .ex-grid,
  .ex-card--featured {
    grid-template-columns: 1fr;
  }

  .ex-card--featured .ex-body--split {
    grid-template-columns: 1fr;
  }

  .narrator-container {
    height: 600px;
    min-height: 600px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ex-frame--b,
  .ex-frame img {
    transition: none;
  }
}
</style>
