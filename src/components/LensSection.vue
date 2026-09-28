<script lang="ts" setup>
import { computed, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { Lens } from '../shared/constants/lens';
import { type LensDetails } from '../shared/types/lensDetails';
import { useViewport } from '../shared/utils/viewWidth';
import { useMainStore } from '../stores/main';
import { TopicName } from '../shared/constants/topicName';

import lensClarity from 'src/assets/lens-clarity.png?w=300;600;900&format=avif;webp;png&as=picture';
import lensTrust from 'src/assets/lens-trust.png?w=300;500;900&format=avif;webp;png&as=picture';
import lensMomentum from 'src/assets/lens-momentum.png?w=300;500;900&format=avif;webp;png&as=picture';
import lensAiLegibility from 'src/assets/lens-ai-legibility.png?w=300;500;900&format=avif;webp;png&as=picture';

const mainStore = useMainStore();
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

const toContact = () => mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);

const steps = [
  {
    label: 'Find the moment',
    text: 'I trace where people stall: the first screen, the key claim, the handoff, the AI response.',
  },
  {
    label: 'Name the cause',
    text: 'Each lens points to a specific cause, so the fix is targeted instead of “improve the UX.”',
  },
  {
    label: 'Ship the fix',
    text: 'I design and build it in your frontend myself. No handoff where the intent gets lost.',
  },
];

const lens = ref<LensDetails[]>([
  {
    name: Lens.Clarity,
    id: uuidv4(),
    img: lensClarity,
    alt: Lens.Clarity,
    question:
      'Can a new visitor tell what this is, who it’s for, and why it matters from the first screen?',
    signals: [
      'Visitors leave the first screen without scrolling or clicking',
      'Sales calls start with “so what exactly does it do?”',
      'Your team explains the product differently than the site does',
    ],
    checks: [
      'The first-screen message against the one thing a buyer needs to believe',
      'Jargon, feature lists, and diagrams that explain “how” before “why”',
      'Visual hierarchy: what the eye lands on first, second, and third',
    ],
    outcome:
      'More visitors understand the value quickly enough to keep going, so the attention you already paid for stops leaking out of the top of the page.',
  },
  {
    name: Lens.Trust,
    id: uuidv4(),
    img: lensTrust,
    alt: Lens.Trust,
    question: 'Once they understand it, do they believe it enough to act?',
    signals: [
      'Healthy time on page, but weak demo, signup, or contact rates',
      'Prospects ask for proof, references, or security details before engaging',
      'Big claims with nothing visible backing them up',
    ],
    checks: [
      'Where each claim sits, and whether proof sits right beside it',
      'Credibility cues your buyer actually weighs: clients, specifics, process, people',
      'Polish gaps that read as risk in technical or regulated markets',
    ],
    outcome:
      'Doubt is answered at the moment it forms, so qualified visitors take the next step instead of leaving to “think about it.”',
  },
  {
    name: Lens.Momentum,
    id: uuidv4(),
    img: lensMomentum,
    alt: Lens.Momentum,
    question: 'When someone is ready, is the next step obvious and easy to take?',
    signals: [
      'People click the CTA, then drop off in the form or onboarding',
      'Visitors reach the end of a page with nowhere clear to go',
      'Mobile converts far worse than desktop',
    ],
    checks: [
      'CTA placement and wording against how ready the visitor is at that point',
      'Every step, field, and wait between intent and completion',
      'Motion and feedback that confirm progress, or quietly slow it down',
    ],
    outcome:
      'Less friction between “I’m interested” and “I’m in,” which is where most conversions are won or lost.',
  },
  {
    name: Lens.AILegibility,
    id: uuidv4(),
    img: lensAiLegibility,
    alt: Lens.AILegibility,
    question: 'Can users tell what the AI is doing, why, and how far to trust it?',
    signals: [
      'Users re-run prompts or ignore output they don’t understand',
      'Support tickets asking what the AI did or where an answer came from',
      'An AI feature that demos well but has low repeat use',
    ],
    checks: [
      'System states: thinking, working, done, unsure, failed',
      'Whether output shows its sources, limits, and confidence',
      'How easily users can correct, steer, or undo what the AI produced',
    ],
    outcome:
      'People rely on the AI feature instead of working around it, which turns an impressive demo into something customers actually use and pay for.',
  },
]);
</script>

<template>
  <section
    class="lensSection full-width column"
    :class="isResponsive ? 'responsive-view q-pa-xs' : 'desktop-view q-pa-md'"
  >
    <div class="lens-shell">
      <div class="lens-header">
        <p class="text-caption kicker q-mt-none q-mb-sm">How I find what’s costing you</p>

        <h1 class="text-h1 q-mt-none q-mb-md">
          Complex products rarely lose people all at once. They lose them at specific moments.
        </h1>

        <p class="section-lead text-body-1 q-mt-none q-mb-sm">
          The moment someone doesn’t get it, doesn’t believe it, doesn’t know what to do next, or
          doesn’t understand what the AI just did.
        </p>

        <p class="section-copy text-body-2 q-ma-none">
          Each lens is built to find one of those moments. Fix the surface where it happens, and
          more of the attention you already have turns into action.
        </p>
      </div>

      <ol class="lens-steps">
        <li v-for="(step, i) in steps" :key="step.label" class="lens-step">
          <span class="lens-step__num">{{ i + 1 }}</span>
          <div>
            <strong>{{ step.label }}</strong>
            <p class="q-ma-none">{{ step.text }}</p>
          </div>
        </li>
      </ol>

      <div class="lens-card-stack">
        <article v-for="(l, index) in lens" :key="l.id" class="lens-card">
          <div class="lens-media-title u-grid">
            <div class="lens-media-column">
              <div class="img-container">
                <picture>
                  <source v-for="(s, srcIndex) in l.img.sources" :key="srcIndex" :srcset="s" />
                  <img
                    :src="l?.img.img.src"
                    :width="isResponsive ? l?.img.img.w : undefined"
                    :height="isResponsive ? l?.img.img.h : undefined"
                    :alt="l?.name"
                    :loading="index === 0 ? 'eager' : 'lazy'"
                    :fetchpriority="index === 0 ? 'high' : 'auto'"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>
            <div class="lens-title-column">
              <p class="text-caption kicker q-mt-none q-mb-xs">Lens {{ index + 1 }}</p>
              <h2 class="text-h2 q-mt-none q-mb-sm">{{ l.name }}</h2>
              <p class="lens-question text-body-1 q-mt-none q-mb-none">{{ l.question }}</p>
            </div>
          </div>

          <div class="lens-columns">
            <div class="lens-column">
              <p class="lens-column__label">Signs this is your problem</p>
              <ul class="lens-list">
                <li v-for="sig in l.signals" :key="sig">{{ sig }}</li>
              </ul>
            </div>
            <div class="lens-column">
              <p class="lens-column__label">What I look at</p>
              <ul class="lens-list lens-list--checks">
                <li v-for="c in l.checks" :key="c">{{ c }}</li>
              </ul>
            </div>
          </div>

          <div class="lens-outcome">
            <span class="lens-outcome__label">What fixing it changes</span>
            <p class="q-ma-none">{{ l.outcome }}</p>
          </div>
        </article>
      </div>

      <div class="lens-close">
        <p class="q-ma-none">
          <strong>Not sure which lens applies?</strong> That’s what a diagnostic is for. I’ll find
          the moment that’s costing you most and show you what fixing it looks like.
        </p>
        <q-btn @click="toContact" color="accent" class="lens-cta" size="lg" glossy>
          <span class="text-body-2">Let’s Talk</span>
        </q-btn>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../css/tokens' as tokens;

.lensSection {
  color: tokens.$text;
}

.lens-shell {
  display: grid;
  gap: 1.25rem;
  padding: clamp(1.5625rem, 2.5vw, 2.5rem);
  border: 1px solid var(--q-accent);
  border-radius: 1rem;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, tokens.$ink-soft 90%, tokens.$ivory 10%),
    tokens.$ink
  );
}

.lens-header {
  h1 {
    font-size: clamp(1.9rem, 2.6vw, 2.6rem);
    color: tokens.$text;
    line-height: 1.08;
    letter-spacing: -0.025em;
    font-weight: 400;
    text-wrap: balance;
  }

  .section-lead {
    color: tokens.$text;
    font-weight: 700;
  }

  .section-copy {
    max-width: 48rem;
    color: tokens.$text-muted;
    line-height: 1.55;
  }
}

.kicker {
  color: tokens.$champagne;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.lens-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lens-step,
.lens-card {
  border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
  border-radius: 0.85rem;
  background: color-mix(in srgb, tokens.$ink-soft 82%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);
}

.lens-step {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.9rem 1rem;

  strong {
    display: block;
    margin-bottom: 0.25rem;
    color: tokens.$text;
    font-size: 0.95rem;
  }

  p {
    color: tokens.$text-muted;
    font-size: 0.88rem;
    line-height: 1.4;
  }
}

.lens-step__num {
  flex: none;
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid tokens.$champagne;
  border-radius: 50%;
  color: tokens.$champagne;
  font-size: 0.8rem;
  font-weight: 700;
}

.lens-card-stack {
  display: grid;
  gap: 1rem;

  .lens-media-title {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;

    @media (min-width: tokens.$breakpoint-lg) {
      grid-template-columns: 150px minmax(0, 1fr);
      align-items: center;
    }
  }

  .lens-highlights {
    margin-top: 1rem;
  }
}

.lens-card {
  padding: 1.25rem;
}

.lens-media-column,
.lens-title-column {
  min-width: 0;
}

.lens-content-column {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.img-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
  border-radius: 0.85rem;
  background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  picture {
    background-color: red;
  }
}

.lens-title-column h2 {
  color: tokens.$text;
  line-height: 1.12;
  letter-spacing: -0.02em;
  font-weight: 400;
  text-wrap: balance;
}

.lens-question {
  color: tokens.$text;
  line-height: 1.4;
  font-weight: 700;
  text-wrap: pretty;
}

.lens-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.lens-column {
  padding: 1rem;
  border: 1px solid color-mix(in srgb, var(--q-accent) 22%, transparent);
  border-radius: 0.75rem;
  background: color-mix(in srgb, tokens.$ink 72%, transparent);
}

.lens-column__label,
.lens-outcome__label {
  display: block;
  margin: 0 0 0.6rem;
  color: tokens.$champagne;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;
}

.lens-list {
  display: grid;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 1.1rem;
    color: tokens.$text-muted;
    font-size: 0.9rem;
    line-height: 1.4;

    &::before {
      content: '';
      position: absolute;
      top: 0.5em;
      left: 0;
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 50%;
      border: 1.5px solid color-mix(in srgb, var(--q-accent) 90%, white 10%);
    }
  }

  &--checks li::before {
    border-radius: 2px;
    background: color-mix(in srgb, var(--q-accent) 90%, white 10%);
  }
}

.lens-outcome {
  margin-top: 0.75rem;
  padding: 1rem 1.1rem;
  border-left: 3px solid tokens.$champagne;
  border-radius: 0.5rem;
  background: color-mix(in srgb, tokens.$champagne 9%, transparent);

  p {
    color: tokens.$text;
    font-size: 0.95rem;
    line-height: 1.45;
    font-weight: 600;
  }
}

.lens-close {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
  border: 1px solid color-mix(in srgb, var(--q-accent) 36%, transparent);
  border-radius: 0.85rem;
  background: color-mix(in srgb, var(--q-accent) 10%, transparent);

  p {
    color: tokens.$text-muted;
    line-height: 1.45;
  }

  strong {
    color: tokens.$text;
  }
}

.lens-cta {
  flex: none;
  border-radius: 0.75rem;
  white-space: nowrap;
}

.responsive-view {
  .lens-shell {
    padding: 1.25rem;
  }

  h2 {
    margin-bottom: 1.5rem;
  }

  .lens-steps,
  .lens-columns {
    grid-template-columns: 1fr;
  }

  .lens-card {
    padding: 1rem;
  }

  .lens-title-column {
    text-align: center;
  }

  .lens-close {
    flex-direction: column;
    align-items: stretch;
  }
}

.desktop-view {
  overflow: visible;
}

.fade-picture {
  opacity: 1;
  transition: opacity 0.4s ease;
}

.fade-picture.fading {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .lens-cta {
    transition: none;
  }
}
</style>
