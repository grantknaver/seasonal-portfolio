<script lang="ts" setup>
import { computed, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { mdiCheckboxBlankCircle } from '@quasar/extras/mdi-v7';

import { Lens } from '../shared/constants/lens';
import { type LensDetails } from '../shared/types/lensDetails';
import { useViewport } from '../shared/utils/viewWidth';

import lensClarity from 'src/assets/lens-clarity.png?w=300;600;900&format=avif;webp;png&as=picture';
import lensTrust from 'src/assets/lens-trust.png?w=300;500;900&format=avif;webp;png&as=picture';
import lensMomentum from 'src/assets/lens-momentum.png?w=300;500;900&format=avif;webp;png&as=picture';
import lensAiLegibility from 'src/assets/lens-ai-legibility.png?w=300;500;900&format=avif;webp;png&as=picture';

const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

const lens = ref<LensDetails[]>([
  {
    name: Lens.Clarity,
    id: uuidv4(),
    img: lensClarity,
    alt: Lens.Clarity,
    tagline: 'Make the main message easier to understand and act on.',
    fitLine:
      'Best for surfaces where visitors may not quickly understand the offer, value, or next step.',
    features: [
      {
        featureIcon: 'visibility',
        text: 'Main message, headline, and first impression reviewed',
      },
      {
        featureIcon: 'format_size',
        text: 'Content hierarchy checked for faster understanding',
      },
      {
        featureIcon: 'touch_app',
        text: 'Primary action path made easier to recognize',
      },
      {
        featureIcon: 'view_quilt',
        text: 'Section flow reviewed for clearer user progression',
      },
      {
        featureIcon: 'lightbulb',
        text: 'Highest-leverage clarity improvement identified',
      },
    ],
  },
  {
    name: Lens.Trust,
    id: uuidv4(),
    img: lensTrust,
    alt: Lens.Trust,
    tagline: 'Help people feel more confident before they take the next step.',
    fitLine:
      'Best for pages or product moments where hesitation, uncertainty, or lack of proof may slow action.',
    features: [
      {
        featureIcon: 'verified_user',
        text: 'Trust signals, proof, and credibility cues reviewed',
      },
      {
        featureIcon: 'workspace_premium',
        text: 'Visual polish checked for confidence and professionalism',
      },
      {
        featureIcon: 'fact_check',
        text: 'Claims reviewed for support, specificity, and believability',
      },
      {
        featureIcon: 'groups',
        text: 'Human details, process cues, or reassurance points identified',
      },
      {
        featureIcon: 'security',
        text: 'Friction points that create doubt or uncertainty surfaced',
      },
    ],
  },
  {
    name: Lens.Momentum,
    id: uuidv4(),
    img: lensMomentum,
    alt: Lens.Momentum,
    tagline: 'Smooth the path from attention to action.',
    fitLine: 'Best for surfaces where users may hesitate, stall, miss the next step, or drop off.',
    features: [
      {
        featureIcon: 'trending_up',
        text: 'User flow reviewed from first impression to next action',
      },
      {
        featureIcon: 'speed',
        text: 'Motion, timing, and interaction rhythm checked for drag',
      },
      {
        featureIcon: 'near_me',
        text: 'CTA placement, hierarchy, and supporting context reviewed',
      },
      {
        featureIcon: 'mobile_friendly',
        text: 'Desktop and mobile momentum checked across key moments',
      },
      {
        featureIcon: 'rocket_launch',
        text: 'Highest-friction moment identified for focused improvement',
      },
    ],
  },
  {
    name: Lens.AILegibility,
    id: uuidv4(),
    img: lensAiLegibility,
    alt: Lens.AILegibility,
    tagline: 'Make AI interactions feel understandable, useful, and trustworthy.',
    fitLine:
      'Best for chatbots, assistants, generated content, AI feedback, or workflows where users need to understand what the system is doing.',
    features: [
      {
        featureIcon: 'smart_toy',
        text: 'AI interaction flow reviewed for usefulness and clarity',
      },
      {
        featureIcon: 'psychology',
        text: 'Generated output checked for legibility and user confidence',
      },
      {
        featureIcon: 'graphic_eq',
        text: 'Motion or feedback opportunities identified where AI needs to feel active',
      },
      {
        featureIcon: 'rule',
        text: 'System states, responses, and user expectations reviewed',
      },
      {
        featureIcon: 'auto_awesome',
        text: 'Opportunities for practical AI integration surfaced',
      },
    ],
  },
]);
</script>

<template>
  <section
    class="lensSection full-width column"
    :class="isResponsive ? 'responsive-view q-pa-md' : 'desktop-view q-pa-md'"
  >
    <div class="lens-shell">
      <div class="lens-header">
        <p class="text-caption kicker q-mt-none q-mb-sm">Surface review lens</p>

        <h1 class="text-h1 q-mt-none q-mb-md">Lens</h1>

        <p class="section-lead text-body-1 q-mt-none q-mb-sm">
          I review websites, product surfaces, and AI interactions through clarity, trust, momentum,
          and AI legibility.
        </p>

        <p class="section-copy text-body-2 q-ma-none">
          I look for where the experience is unclear, where trust needs support, where momentum
          slows down, and where AI needs to feel more legible, grounded, and useful.
        </p>
      </div>

      <div class="lens-proof-grid">
        <div class="lens-proof-card">
          <span>Scope</span>
          <strong>Clear work block before build.</strong>
        </div>

        <div class="lens-proof-card">
          <span>Motion</span>
          <strong>Purposeful feedback, not decoration.</strong>
        </div>

        <div class="lens-proof-card">
          <span>Delivery</span>
          <strong>Polished, responsive implementation.</strong>
        </div>
      </div>

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
              <div class="lens-title-row q-mb-sm">
                <div>
                  <p class="text-caption kicker q-mt-none q-mb-xs">{{ l.name }}</p>
                  <h2 class="text-h2 q-mt-none q-mb-sm">{{ l.name }}</h2>
                </div>
              </div>
              <p class="lens-tagline text-body-2 q-mt-none q-mb-md">
                {{ l.tagline }}
              </p>
            </div>
          </div>

          <div class="lens-highlights">
            <q-list class="lens-feature-list q-mb-md">
              <q-item
                v-for="(f, featureIndex) in l.features"
                :key="featureIndex"
                class="lens-feature-item"
              >
                <q-item-section side>
                  <q-icon :name="mdiCheckboxBlankCircle" size="8px" class="feature-dot" />
                </q-item-section>

                <q-item-section class="lens-feature text-body-2">
                  {{ f.text }}
                </q-item-section>
              </q-item>
            </q-list>
            <!-- <q-btn
              @click="toContact(l?.name ?? null)"
              color="accent"
              class="lens-cta full-width"
              size="lg"
              glossy
            >
              <span class="text-body-2">{{ packageCta(l.name) }}</span>
            </q-btn> -->
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

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
  box-shadow:
    0 0 56px color-mix(in srgb, var(--q-accent) 30%, transparent),
    0 24px 72px color-mix(in srgb, tokens.$ink 88%, transparent);
}

.lens-header {
  h1 {
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
    margin-inline: auto;
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

.lens-proof-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.lens-proof-card,
.lens-card {
  border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
  border-radius: 0.85rem;
  background: color-mix(in srgb, tokens.$ink-soft 82%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);
}

.lens-proof-card {
  padding: 0.85rem 1rem;

  span {
    display: block;
    margin-bottom: 0.25rem;
    color: tokens.$champagne;
    font-size: 0.72rem;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
  }

  strong {
    display: block;
    color: tokens.$text-muted;
    font-size: 0.9rem;
    line-height: 1.3;
    font-weight: 600;
  }
}

.lens-card-stack {
  display: grid;
  gap: 1rem;

  .lens-media-title {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;

    @media (min-width: tokens.$breakpoint-lg) {
      grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
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

.lens-title-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  h2 {
    color: tokens.$text;
    line-height: 1.12;
    letter-spacing: -0.02em;
    font-weight: 400;
    text-wrap: balance;
  }
}

.lens-tagline {
  color: tokens.$text-muted;
  line-height: 1.45;
  font-weight: 600;
}

.lens-feature-header {
  color: tokens.$text;
  line-height: 1.45;
  font-weight: 700;
}

.lens-feature-list {
  display: grid;
  gap: 0.75rem;
}

.lens-feature-item {
  min-height: auto;
  padding: 0.85rem 1rem;
  border: 1px solid color-mix(in srgb, var(--q-accent) 22%, transparent);
  border-radius: 0.75rem;
  background: color-mix(in srgb, tokens.$ink 72%, transparent);
}

.feature-dot {
  color: var(--q-accent);
}

.lens-feature {
  color: tokens.$text-muted;
  line-height: 1.35;
  font-weight: 600;
}

.lens-cta {
  border-radius: 0.75rem;
}

.responsive-view {
  .lens-shell {
    padding: 1.25rem;
  }

  h2 {
    margin-bottom: 1.5rem;
  }

  .lens-tagline {
    margin-bottom: 0;
    text-align: center;
  }

  .lens-feature-header {
    text-align: center;
  }

  .lens-proof-grid,
  .lens-card {
    grid-template-columns: 1fr;
  }

  .lens-card {
    padding: 1rem;
  }

  .lens-title-row {
    display: block;
    text-align: center;
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
