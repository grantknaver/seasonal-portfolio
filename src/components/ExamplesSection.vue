<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { mdiOpenInNew, mdiPlayCircleOutline } from '@quasar/extras/mdi-v7';
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
    what: 'An AI governance platform for autonomous agents. Scroll, and a $1,200 refund request is checked for identity, authority, and policy before it’s allowed to execute.',
    why: 'Every team adopting AI agents is asking the same thing: what is it allowed to do, and can we see why? This makes the answer readable at a glance.',
    url: 'https://agentgate-bpb.pages.dev/',
    a: agentgateA,
    b: agentgateB,
    stateA: 'Checks resolving',
    stateB: 'Authorized',
    featured: true,
  },
  {
    id: 'futureframe',
    title: 'Futureframe',
    kind: 'Concept build',
    tags: ['AI legibility', 'Trust'],
    what: 'AI age projection you scroll through. The face changes alongside the signals driving it, with uncertainty disclosed instead of hidden.',
    why: 'AI feels like a black box when people only see the result. Showing the “why” is what makes it believable.',
    url: 'https://futureframe-8ep.pages.dev/',
    a: futureframeA,
    b: futureframeB,
    stateA: 'Age 8',
    stateB: 'Age 67',
  },
  {
    id: 'robot',
    title: 'Robot Narrator',
    kind: 'Built for StorytAIm',
    tags: ['AI legibility', 'Motion'],
    what: 'Pick a voice and press play. The narrator’s waveform moves with the AI-generated speech.',
    why: 'AI audio is invisible by default. Visible feedback shows the system is working, and who is speaking.',
    url: ROBOT_URL,
    a: robotA,
    stateA: 'Try it here',
    live: true,
  },
  {
    id: 'fizzco',
    title: 'Fizzco',
    kind: 'Concept build',
    tags: ['Clarity', 'Motion'],
    what: 'A launch page where the product assembles as you scroll, so the offer lands before the copy.',
    why: 'When the product is the message, motion can show it faster than words can.',
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
    tags: ['Motion'],
    what: 'Four seasons, each with its own weather, pace, and palette, switchable in one tap.',
    why: 'Atmosphere without noise: motion that adds presence but never competes with the content.',
    url: 'https://seasonal-example.pages.dev/',
    a: seasonalA,
    b: seasonalB,
    stateA: 'Fall',
    stateB: 'Winter',
  },
];

const featured = items.find((i) => i.featured)!;
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
          Working builds that turn complex, AI-driven ideas into something people can understand,
          trust, and act on.
        </p>
      </header>

      <!-- Featured -->
      <template v-for="it in [featured]" :key="it.id">
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
          <div class="ex-body">
            <div class="ex-meta">
              <span class="ex-kind">{{ it.kind }}</span>
              <span v-for="t in it.tags" :key="t" class="ex-tag">{{ t }}</span>
            </div>
            <h2 class="q-my-none">{{ it.title }}</h2>
            <p class="ex-what q-ma-none">{{ it.what }}</p>
            <p class="ex-why q-ma-none"><b>Why it’s here</b>{{ it.why }}</p>
            <a class="ex-link" :href="it.url" target="_blank" rel="noopener noreferrer">
              Open live <q-icon :name="mdiOpenInNew" size="16px" />
            </a>
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

  .ex-body {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    column-gap: 1.25rem;
    padding: 1.2rem 1.35rem 1.35rem;

    > .ex-meta,
    > h2,
    > .ex-what {
      grid-column: 1;
    }

    > .ex-why {
      grid-column: 2;
      grid-row: 1 / span 3;
      align-self: start;
    }

    > .ex-link {
      grid-column: 2;
    }
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
  background: #fff;
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

/* Same sizing the narrator iframe has always used. */
.narrator-container {
  display: flex;
  justify-content: center;
  height: 500px;
  min-height: 500px;
  padding: 1rem;
  background: #fff;

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

  .ex-card--featured .ex-body {
    grid-template-columns: 1fr;

    > * {
      grid-column: 1 !important;
      grid-row: auto !important;
    }
  }

  .ex-close {
    flex-direction: column;
    align-items: stretch;
  }

  .narrator-container {
    padding: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ex-frame--b,
  .ex-frame img {
    transition: none;
  }
}
</style>
