<script lang="ts" setup>
import { computed, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { mdiCheckboxBlankCircle } from '@quasar/extras/mdi-v7';

import { Lens } from '../shared/constants/lens';
import { type LensDetails } from '../shared/types/lensDetails';
import { useViewport } from '../shared/utils/viewWidth';

import heroClarityMotionPass from 'src/assets/hero-clarity-motion-pass.png?w=300;600;900&format=avif;webp;png&as=picture';
import ctaAttentionConversionBlock from 'src/assets/cta-attention-conversion-block.png?w=300;500;900&format=avif;webp;png&as=picture';
import mobileResponsivenessPolishPass from 'src/assets/mobile-responsiveness-polish-pass.png?w=300;500;900&format=avif;webp;png&as=picture';

const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

const packages = ref<LensDetails[]>([
  {
    name: Lens.HeroClarityMotionPass,
    id: uuidv4(),
    img: heroClarityMotionPass,
    alt: Lens.HeroClarityMotionPass,
    tagline: 'Make the first screen clearer, more premium, and easier to act on.',
    fitLine: 'Best for pages where the value needs to land faster.',
    features: [
      {
        featureIcon: 'movie_filter',
        text: 'Sharper headline, subheadline, and CTA structure',
      },
      { featureIcon: 'phone_iphone', text: 'Premium hero layout tuned for desktop and mobile' },
      { featureIcon: 'speed', text: 'Purposeful GSAP reveal or attention motion' },
      {
        featureIcon: 'schedule',
        text: 'Proof strip, trust badges, or CTA support added where useful',
      },
      {
        featureIcon: 'rocket_launch',
        text: 'Clear before/after direction for implementation',
      },
    ],
  },
  {
    name: Lens.CtaAttentionConversionBlock,
    id: uuidv4(),
    img: ctaAttentionConversionBlock,
    alt: Lens.CtaAttentionConversionBlock,
    tagline: 'Make the next step easier to see, trust, and click.',
    fitLine: 'Best for pages with weak, buried, or unclear calls to action.',
    features: [
      {
        featureIcon: 'animation',
        text: 'Primary CTA placement and hierarchy tightened',
      },
      {
        featureIcon: 'integration_instructions',
        text: 'Button motion, hover, and press states polished',
      },
      { featureIcon: 'brush', text: 'Sticky, inline, or final CTA block added where appropriate' },
      { featureIcon: 'description', text: 'Trust-support copy added near the action' },
      { featureIcon: 'event', text: 'Cleaner path from interest to inquiry, booking, or purchase' },
    ],
  },
  {
    name: Lens.MobileResponsivenessPolishPass,
    id: uuidv4(),
    img: mobileResponsivenessPolishPass,
    alt: Lens.MobileResponsivenessPolishPass,
    tagline: 'Clean up the experience across desktop, tablet, and mobile.',
    fitLine: 'Best for builds that feel good on desktop but rough on smaller screens.',
    features: [
      {
        featureIcon: 'slideshow',
        text: 'Mobile spacing, type scale, and button rhythm refined',
      },
      {
        featureIcon: 'design_services',
        text: 'Images, videos, and sections tuned for responsive layouts',
      },
      { featureIcon: 'priority_high', text: 'Touch targets and CTA placement improved' },
      {
        featureIcon: 'support_agent',
        text: 'Scroll motion adjusted for mobile and reduced-motion support',
      },
      { featureIcon: 'calendar_month', text: 'Final QA pass across key screen sizes' },
    ],
  },
]);
</script>

<template>
  <section
    class="packageSection full-width column"
    :class="isResponsive ? 'responsive-view q-pa-md' : 'desktop-view q-pa-md'"
  >
    <div class="package-shell">
      <div class="package-header">
        <p class="text-caption kicker q-mt-none q-mb-sm">Focused implementation blocks</p>
        <h1 class="text-h1 q-mt-none q-mb-md">Lens</h1>
        <p class="section-lead text-body-1 q-mt-none q-mb-sm">
          Clear scopes for motion, AI interaction, and section-level polish.
        </p>
        <p class="section-copy text-body-2 q-ma-none">
          Choose the smallest useful build. Each package is designed to improve clarity, trust, and
          momentum without forcing a full redesign.
        </p>
      </div>

      <div class="package-proof-grid">
        <div class="package-proof-card">
          <span>Scope</span>
          <strong>Clear work block before build.</strong>
        </div>

        <div class="package-proof-card">
          <span>Motion</span>
          <strong>Purposeful feedback, not decoration.</strong>
        </div>

        <div class="package-proof-card">
          <span>Delivery</span>
          <strong>Polished, responsive implementation.</strong>
        </div>
      </div>

      <div class="package-card-stack">
        <article
          v-for="(p, index) in packages"
          :key="p.id"
          class="package-card"
          :class="{ 'is-recommended': p.name === Package.HeroClarityMotionPass }"
        >
          <div class="package-media-title u-grid">
            <div class="package-media-column">
              <div class="img-container">
                <picture>
                  <source v-for="(s, srcIndex) in p.img.sources" :key="srcIndex" :srcset="s" />
                  <img
                    :src="p?.img.img.src"
                    :width="isResponsive ? p?.img.img.w : undefined"
                    :height="isResponsive ? p?.img.img.h : undefined"
                    :alt="p?.name"
                    :loading="index === 0 ? 'eager' : 'lazy'"
                    :fetchpriority="index === 0 ? 'high' : 'auto'"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>
            <div class="package-title-column">
              <div class="package-title-row q-mb-sm">
                <div>
                  <p class="text-caption kicker q-mt-none q-mb-xs">{{ packageTier(p.name) }}</p>
                  <h2 class="text-h2 q-mt-none q-mb-sm">{{ p.name }}</h2>
                </div>
              </div>
              <p class="package-tagline text-body-2 q-mt-none q-mb-md">
                {{ p.tagline }}
              </p>
            </div>
          </div>

          <div class="package-highlights">
            <q-list class="package-feature-list q-mb-md">
              <q-item
                v-for="(f, featureIndex) in p.features"
                :key="featureIndex"
                class="package-feature-item"
              >
                <q-item-section side>
                  <q-icon :name="mdiCheckboxBlankCircle" size="8px" class="feature-dot" />
                </q-item-section>

                <q-item-section class="package-feature text-body-2">
                  {{ f.text }}
                </q-item-section>
              </q-item>
            </q-list>
            <!-- <q-btn
              @click="toContact(p?.name ?? null)"
              color="accent"
              class="package-cta full-width"
              size="lg"
              glossy
            >
              <span class="text-body-2">{{ packageCta(p.name) }}</span>
            </q-btn> -->
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

.packageSection {
  color: tokens.$text;
}

.package-shell {
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

.package-header {
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

.package-proof-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.package-proof-card,
.package-card {
  border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
  border-radius: 0.85rem;
  background: color-mix(in srgb, tokens.$ink-soft 82%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);
}

.package-proof-card {
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

.package-card-stack {
  display: grid;
  gap: 1rem;

  .package-media-title {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;

    @media (min-width: tokens.$breakpoint-lg) {
      grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
    }
  }

  .package-highlights {
    margin-top: 1rem;
  }
}

.package-card {
  padding: 1.25rem;

  &.is-recommended {
    border-color: color-mix(in srgb, var(--q-accent) 52%, transparent);
  }
}

.package-media-column,
.package-title-column {
  min-width: 0;
}

.package-content-column {
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

.package-title-row {
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

.package-tagline {
  color: tokens.$text-muted;
  line-height: 1.45;
  font-weight: 600;
}

.package-feature-header {
  color: tokens.$text;
  line-height: 1.45;
  font-weight: 700;
}

.package-feature-list {
  display: grid;
  gap: 0.75rem;
}

.package-feature-item {
  min-height: auto;
  padding: 0.85rem 1rem;
  border: 1px solid color-mix(in srgb, var(--q-accent) 22%, transparent);
  border-radius: 0.75rem;
  background: color-mix(in srgb, tokens.$ink 72%, transparent);
}

.feature-dot {
  color: var(--q-accent);
}

.package-feature {
  color: tokens.$text-muted;
  line-height: 1.35;
  font-weight: 600;
}

.package-cta {
  border-radius: 0.75rem;
}

.responsive-view {
  .package-shell {
    padding: 1.25rem;
  }

  h2 {
    margin-bottom: 1.5rem;
  }

  .package-tagline {
    margin-bottom: 0;
    text-align: center;
  }

  .package-feature-header {
    text-align: center;
  }

  .package-proof-grid,
  .package-card {
    grid-template-columns: 1fr;
  }

  .package-card {
    padding: 1rem;
  }

  .package-title-row {
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
  .package-cta {
    transition: none;
  }
}
</style>
