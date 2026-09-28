<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useMainStore } from '../stores/main';
import { hasScrollbar } from 'src/shared/utils/hasScrollbar';
import { useViewport } from 'src/shared/utils/viewWidth';
import { TopicName } from 'src/shared/constants/topicName';

const mainStore = useMainStore();

const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

/* Works on every layout: MainPage syncs its mobile/tablet accordion to activeTopic. */
const toContact = () => mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);

const toExamples = () => mainStore.SET_ACTIVE_TOPIC(TopicName.Examples);

/* The four disciplines, with the one thing each contributes. */
const disciplines = [
  { label: 'Product thinking', role: 'What to say' },
  { label: 'Interaction design', role: 'How it flows' },
  { label: 'Motion', role: 'Where eyes go' },
  { label: 'Frontend engineering', role: 'Ships exact' },
];

const team = ['Strategist', 'Designer', 'Motion designer', 'Developer'];

const fits = [
  'AI products',
  'Technical & scientific platforms',
  'Enterprise & regulated',
  'Products that outgrew their UI',
];

const steps = [
  {
    label: 'Teardown Review',
    text: 'I walk you through what I found, then we dig into the friction you already know about.',
  },
  {
    label: 'Diagnostic, if needed',
    text: 'Know something’s off but not what? A Diagnostic pinpoints it. Already know? Skip ahead.',
  },
  { label: 'Implementation', text: 'A clear scope and price, reviewed together, then I build it.' },
];

/* Play the diagram once it scrolls into view. */
const diagramRef = ref<HTMLElement | null>(null);
const diagramIn = ref(false);
let io: IntersectionObserver | null = null;

const updateScrollbarState = () => {
  mainStore.HAS_SCROLLBAR(hasScrollbar());
};

onMounted(() => {
  updateScrollbarState();
  window.addEventListener('resize', updateScrollbarState);

  if (!diagramRef.value || !('IntersectionObserver' in window)) {
    diagramIn.value = true;
    return;
  }
  io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        diagramIn.value = true;
        io?.disconnect();
      }
    },
    { threshold: 0.35 },
  );
  io.observe(diagramRef.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollbarState);
  io?.disconnect();
});
</script>

<template>
  <section
    class="about-section full-width column"
    :class="isResponsive ? 'responsive-view q-pa-xs' : 'desktop-view q-pa-md'"
  >
    <div class="about-sheet">
      <!-- Intro -->
      <header class="about-intro">
        <p class="kicker q-mt-none q-mb-sm">About</p>
        <h1 class="q-mt-none q-mb-md">
          I make complex technical products easy to understand, trust, and act on.
        </h1>
        <p class="lead q-ma-none">
          Product clarity, trust, and AI legibility, designed and built by one person.
        </p>
      </header>

      <!-- Handoff diagram -->
      <div ref="diagramRef" class="handoff" :class="{ 'is-in': diagramIn }">
        <div class="handoff__row handoff__row--team">
          <span class="handoff__tag">Typical team</span>
          <div class="handoff__chain">
            <template v-for="(person, i) in team" :key="person">
              <span class="node node--team" :style="{ '--d': i }">{{ person }}</span>
              <span v-if="i < team.length - 1" class="link link--lossy" :style="{ '--d': i }">
                <i></i>
              </span>
            </template>
          </div>
          <span class="outcome outcome--diluted">Intent diluted</span>
        </div>

        <div class="handoff__row handoff__row--me">
          <span class="handoff__tag handoff__tag--me">With me</span>
          <div class="handoff__merge">
            <div class="merge-inputs">
              <span
                v-for="(d, i) in disciplines"
                :key="d.label"
                class="node node--me"
                :style="{ '--d': i }"
              >
                {{ d.label }}
                <small>{{ d.role }}</small>
              </span>
            </div>
            <svg class="merge-lines" viewBox="0 0 60 160" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 20 C 35 20, 30 80, 60 80" />
              <path d="M0 60 C 30 60, 35 80, 60 80" />
              <path d="M0 100 C 30 100, 35 80, 60 80" />
              <path d="M0 140 C 35 140, 30 80, 60 80" />
            </svg>
          </div>
          <span class="outcome outcome--clear">
            <b>Ships as designed</b>
            <small>Understood &middot; Trusted &middot; Acted on</small>
          </span>
        </div>
      </div>

      <!-- Fit + steps -->
      <div class="about-grid">
        <div class="block">
          <p class="kicker q-mt-none q-mb-sm">Best fit</p>
          <p class="block__lead q-mt-none q-mb-md">The harder it is to explain, the more clarity is worth.</p>
          <ul class="fit-tags q-ma-none">
            <li v-for="f in fits" :key="f">{{ f }}</li>
          </ul>
        </div>

        <div class="block">
          <p class="kicker q-mt-none q-mb-sm">How it starts</p>
          <ol class="steps q-ma-none">
            <li v-for="(s, i) in steps" :key="s.label">
              <span class="steps__num">{{ i + 1 }}</span>
              <div>
                <b>{{ s.label }}</b>
                <span>{{ s.text }}</span>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <!-- CTAs -->
      <div class="about-ctas">
        <q-btn class="about-cta" color="accent" size="lg" glossy @click="toContact">
          <span class="text-body-2">Let’s Talk</span>
        </q-btn>
        <q-btn class="about-cta about-cta--ghost" flat size="lg" @click="toExamples">
          <span class="text-body-2">See it in action &rarr;</span>
        </q-btn>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
@use '../css/tokens' as tokens;

.about-section {
  $ink: #0b1f2e;
  $muted: rgba(11, 31, 46, 0.66);
  $blue: #1260f0;
  $navy: #0a3487;
  $soft: #e5ecfd;
  $line: rgba(18, 96, 240, 0.18);

  .about-sheet {
    display: grid;
    gap: 1.75rem;
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

  /* ---------- Intro ---------- */

  .about-intro {
    h1 {
      color: $ink;
      font-size: clamp(1.9rem, 2.6vw, 2.6rem);
      font-weight: 400;
      line-height: 1.1;
      letter-spacing: -0.025em;
      text-wrap: balance;
    }

    .lead {
      color: $muted;
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.45;
    }
  }

  /* ---------- Handoff diagram ---------- */

  .handoff {
    display: grid;
    gap: 0.9rem;
  }

  .handoff__row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 9.5rem;
    gap: 0.6rem 1rem;
    align-items: center;
    padding: 1rem;
    border: 1px solid $line;
    border-radius: 0.85rem;
    background: #fff;
  }

  .handoff__row--team {
    background: #fbfcff;
  }

  .handoff__tag {
    grid-column: 1 / -1;
    color: $muted;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    &--me {
      color: $blue;
    }
  }

  .node {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.4rem 0.6rem;
    border-radius: 0.5rem;
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1.2;
    opacity: 0;
    transform: translateY(6px);
    transition:
      opacity 0.45s ease,
      transform 0.45s ease;
    transition-delay: calc(var(--d) * 0.12s);

    small {
      margin-top: 0.1rem;
      color: $muted;
      font-size: 0.68rem;
      font-weight: 600;
    }
  }

  .node--team {
    flex: none;
    border: 1px dashed rgba(11, 31, 46, 0.22);
    background: #fff;
    color: rgba(11, 31, 46, 0.72);
    text-align: center;
  }

  .node--me {
    border: 1px solid $line;
    background: $soft;
    color: $navy;
    transition-delay: calc(0.9s + var(--d) * 0.1s);
  }

  /* Team: a chain where each handoff leaks a little */
  .handoff__chain {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    min-width: 0;
  }

  .link {
    flex: 1;
    min-width: 0.9rem;
    height: 2px;

    i {
      display: block;
      height: 100%;
      background: repeating-linear-gradient(
        90deg,
        rgba(11, 31, 46, 0.35) 0 4px,
        transparent 4px 8px
      );
      transform: scaleX(0);
      transform-origin: 0 50%;
      transition: transform 0.35s ease;
      transition-delay: calc(0.15s + var(--d) * 0.12s);
    }
  }

  .outcome {
    display: grid;
    gap: 0.1rem;
    padding: 0.55rem 0.7rem;
    border-radius: 0.55rem;
    font-size: 0.82rem;
    font-weight: 700;
    line-height: 1.2;
    text-align: center;
    opacity: 0;
    transition: opacity 0.5s ease;

    small {
      font-size: 0.66rem;
      font-weight: 600;
      opacity: 0.85;
    }
  }

  .outcome--diluted {
    border: 1px dashed rgba(11, 31, 46, 0.2);
    color: rgba(11, 31, 46, 0.45);
    filter: blur(0.6px);
    transition-delay: 0.7s;
  }

  .outcome--clear {
    background: $blue;
    color: #fff;
    box-shadow: 0 8px 20px rgba(18, 96, 240, 0.3);
    transition-delay: 1.5s;
  }

  /* Me: four inputs merging into one */
  .handoff__merge {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 2.5rem;
    align-items: stretch;
    min-width: 0;
  }

  .merge-inputs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.4rem;
  }

  .merge-lines {
    width: 100%;
    height: 100%;
    overflow: visible;

    path {
      fill: none;
      stroke: $blue;
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
      stroke-dasharray: 120;
      stroke-dashoffset: 120;
      transition: stroke-dashoffset 0.5s ease 1.25s;
    }
  }

  .handoff.is-in {
    .node,
    .outcome {
      opacity: 1;
      transform: none;
    }

    .link i {
      transform: scaleX(1);
    }

    .merge-lines path {
      stroke-dashoffset: 0;
    }
  }

  /* ---------- Fit + steps ---------- */

  .about-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .block {
    padding: 1.1rem 1.2rem;
    border: 1px solid $line;
    border-radius: 0.85rem;
    background: #fff;
  }

  .block__lead {
    color: $ink;
    font-weight: 600;
    line-height: 1.4;
  }

  .fit-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0;
    list-style: none;

    li {
      padding: 0.3rem 0.65rem;
      border-radius: 999px;
      background: $soft;
      color: $navy;
      font-size: 0.8rem;
      font-weight: 700;
    }
  }

  .steps {
    display: grid;
    gap: 0.75rem;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      gap: 0.7rem;
      align-items: flex-start;
    }

    b {
      display: block;
      color: $ink;
      font-size: 0.92rem;
    }

    span:not(.steps__num) {
      display: block;
      color: $muted;
      font-size: 0.85rem;
      line-height: 1.35;
    }
  }

  .steps__num {
    flex: none;
    display: grid;
    place-items: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: $blue;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 700;
  }

  /* ---------- CTAs ---------- */

  .about-ctas {
    display: flex;
    gap: 0.75rem;
  }

  .about-cta {
    flex: 1;
    border-radius: 0.75rem;

    &--ghost {
      border: 1px solid $line;
      color: $navy;
    }
  }

  /* ---------- Layout variants ---------- */

  &.desktop-view .about-sheet {
    max-width: 960px;
    margin-inline: auto;
  }

  &.responsive-view {
    .handoff__row {
      grid-template-columns: 1fr;
    }

    /* Mobile: both rows become a 2x2 grid feeding down into the outcome.
       Dashed connector = lossy handoffs, solid = one direct pass. */
    .handoff__chain {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.4rem;
    }

    .link,
    .merge-lines {
      display: none;
    }

    .handoff__merge {
      grid-template-columns: 1fr;
    }

    .outcome {
      position: relative;
      margin-top: 1.1rem;

      &::before {
        content: '';
        position: absolute;
        bottom: calc(100% + 0.2rem);
        left: 50%;
        height: 0.9rem;
        border-left: 2px dashed rgba(11, 31, 46, 0.3);
      }
    }

    .outcome--clear::before {
      border-left: 2px solid #1260f0;
    }

    .about-grid,
    .about-ctas {
      grid-template-columns: 1fr;
      flex-direction: column;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-section {
    .node,
    .outcome,
    .link i,
    .merge-lines path {
      transition: none !important;
    }
  }
}
</style>
