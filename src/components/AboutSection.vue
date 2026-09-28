<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useMainStore } from '../stores/main';
import { type AboutBulletPoints } from 'src/shared/types/aboutBulletPoints';
import { hasScrollbar } from 'src/shared/utils/hasScrollbar';
import { type PastClient } from 'src/shared/types/pastClient';
import { useViewport } from 'src/shared/utils/viewWidth';
import { TopicName } from 'src/shared/constants/topicName';

import labcorp from 'src/assets/labcorp.png?w=800;1280;1600&format=avif;jpg&as=picture';
import ornl from 'src/assets/ornl.png?w=800;1280;1600&format=avif;jpg&as=picture';
import amtrak from 'src/assets/amtrak.png?w=800;1280;1600&format=avif;jpg&as=picture';
import lockheedMartin from 'src/assets/lockheed-martin.png?w=800;1280;1600&format=avif;png&as=picture';

const mainStore = useMainStore();

const emit = defineEmits<{
  (event: 'toContact'): void;
}>();

const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

const getImg = (file: string) => new URL(`../assets/${file}`, import.meta.url).href;

const toContact = () => {
  if (isResponsive.value) {
    emit('toContact');
    return;
  }

  mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);
};

const disciplines = ref<AboutBulletPoints[]>([
  {
    src: getImg('future-proof-thinking.avif'),
    label: 'Product thinking',
    id: uuidv4(),
    text: 'Work out what the user has to understand, and what the business needs them to do next.',
  },
  {
    src: getImg('interactive-data-visualization.avif'),
    label: 'Interaction design',
    id: uuidv4(),
    text: 'Shape each step so it answers the question the user has at that moment.',
  },
  {
    src: getImg('gsap-animation.avif'),
    label: 'Motion',
    id: uuidv4(),
    text: 'Use movement to direct attention, show cause and effect, and make system state visible. Never decoration.',
  },
  {
    src: getImg('creative-engineering.avif'),
    label: 'Frontend engineering',
    id: uuidv4(),
    text: 'Build it for real: responsive, performant, production code that ships the way it was designed.',
  },
]);

const bestFits = [
  'AI products where users need to see what the system is doing, and why',
  'Technical, scientific, and data-heavy platforms that are hard to explain in one sentence',
  'Enterprise and regulated products where trust has to be earned before anyone commits',
  'Teams whose product has improved faster than their interface or site has',
];

const steps = [
  {
    label: 'Diagnose',
    text: 'If the priority isn’t clear yet, I review the product through the four lenses and show you where it’s costing you attention and conversions.',
  },
  {
    label: 'Scope one focused block',
    text: 'We pick the smallest build that fixes the most expensive moment. No full redesign or rebuild required.',
  },
  {
    label: 'Build and ship',
    text: 'I implement it in your codebase, so what we agreed on is exactly what your users see.',
  },
];

const pastClients = ref<PastClient[]>([
  {
    id: uuidv4(),
    img: labcorp,
    name: 'Labcorp',
    url: 'https://www.labcorp.com/',
  },
  {
    id: uuidv4(),
    img: amtrak,
    name: 'Amtrak',
    url: 'https://www.amtrak.com/home.html',
  },
  {
    id: uuidv4(),
    img: ornl,
    name: 'ORNL',
    url: 'https://www.ornl.gov/',
  },
  {
    id: uuidv4(),
    img: lockheedMartin,
    name: 'Lockheed Martin',
    url: 'https://www.lockheedmartin.com/en-us/index.html',
  },
]);

const updateScrollbarState = () => {
  mainStore.HAS_SCROLLBAR(hasScrollbar());
};

onMounted(() => {
  updateScrollbarState();
  window.addEventListener('resize', updateScrollbarState);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollbarState);
});
</script>

<template>
  <section
    class="about-section full-width column"
    :class="isResponsive ? 'responsive-view q-pa-xs' : 'desktop-view q-pa-md'"
  >
    <q-card class="about-card q-pa-none">
      <q-card-section class="about-section-block about-intro q-pa-lg">
        <p class="text-caption kicker q-mt-none q-mb-sm">About</p>

        <h1 class="text-h1 q-mt-none q-mb-md">
          I make complex technical products easy to understand, trust, and act on.
        </h1>

        <p class="section-lead text-body-1 q-mt-none q-mb-sm">
          I specialize in product clarity, trust, and AI legibility for complex technical products.
        </p>

        <p class="section-copy text-body-2 q-mt-none q-mb-md">
          Most teams split this work across a strategist, a designer, a motion specialist, and a
          developer, and the meaning gets diluted at every handoff. I do all four. The idea we
          agree on is the thing that ships.
        </p>

        <div class="discipline-grid q-mt-lg">
          <div v-for="d in disciplines" :key="d.id" class="discipline">
            <q-avatar class="about-avatar" size="44px">
              <img :src="d.src" :alt="d.label" />
            </q-avatar>
            <div>
              <span class="discipline__label">{{ d.label }}</span>
              <p class="q-ma-none text-body-2">{{ d.text }}</p>
            </div>
          </div>
        </div>

        <p class="discipline-sum q-mt-lg q-mb-none">
          Together, they turn difficult concepts and workflows into experiences people can
          understand, trust, and act on.
        </p>

        <q-btn
          @click="toContact"
          class="about-cta q-mt-lg full-width"
          color="accent"
          size="lg"
          glossy
        >
          <span class="text-body-2">Let’s Talk</span>
        </q-btn>
      </q-card-section>
    </q-card>

    <q-intersection transition="slide-up" transition-duration="600" :once="true">
      <q-card class="about-card q-mt-md q-pa-none">
        <q-card-section class="about-section-block q-pa-lg">
          <p class="text-caption kicker q-mt-none q-mb-sm">Best fit</p>

          <h2 class="text-h2 q-mt-none q-mb-md">Where I’m most useful</h2>

          <p class="section-copy text-body-2 q-mt-none q-mb-md">
            The harder your product is to explain, the more clarity is worth. I do my best work
            with:
          </p>

          <ul class="fit-list q-ma-none">
            <li v-for="fit in bestFits" :key="fit">{{ fit }}</li>
          </ul>
        </q-card-section>
      </q-card>
    </q-intersection>

    <q-intersection transition="slide-up" transition-duration="700" :once="true">
      <q-card class="about-card q-mt-md q-pa-none">
        <q-card-section class="about-section-block q-pa-lg">
          <p class="text-caption kicker q-mt-none q-mb-sm">How it starts</p>

          <h2 class="text-h2 q-mt-none q-mb-md">How we’d work together</h2>

          <ol class="step-list q-ma-none">
            <li v-for="(step, i) in steps" :key="step.label" class="step">
              <span class="step__num">{{ i + 1 }}</span>
              <div>
                <span class="step__label">{{ step.label }}</span>
                <p class="q-ma-none text-body-2">{{ step.text }}</p>
              </div>
            </li>
          </ol>
        </q-card-section>
      </q-card>
    </q-intersection>

    <q-intersection transition="slide-up" transition-duration="800" :once="true">
      <q-card class="about-card q-mt-md q-pa-none">
        <q-card-section class="about-section-block q-pa-lg">
          <p class="text-caption kicker q-mt-none q-mb-sm">Experience</p>

          <h2 class="text-h2 q-mt-none q-mb-md">Complex environments I’ve worked in</h2>

          <p class="section-copy text-body-2 q-mt-none q-mb-lg">
            Frontend, product, and interface work for organizations where the subject matter is
            hard and the stakes are high.
          </p>

          <div class="client-grid">
            <a
              v-for="(client, index) in pastClients"
              :key="client.id"
              class="client-card"
              :href="client.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Open ${client.name}`"
            >
              <picture class="full-width">
                <source
                  v-for="(src, k) in client.img.sources"
                  :key="k"
                  :srcset="src"
                  :type="`image/${k}`"
                  sizes="(min-width: 1450px) 100%"
                />
                <img
                  :src="client.img.img.src"
                  sizes="(min-width: 1024px) 25vw, 90vw"
                  :fetchpriority="index === 0 ? 'high' : 'auto'"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  decoding="async"
                  :alt="client.name"
                />
              </picture>
            </a>
          </div>
        </q-card-section>
      </q-card>
    </q-intersection>
  </section>
</template>

<style lang="scss">
@use '../css/tokens' as tokens;

.about-section {
  color: tokens.$text;

  &.desktop-view {
    overflow-y: hidden;
  }

  &.responsive-view {
    gap: 1rem;
  }

  .about-card {
    width: 100%;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, tokens.$ink-soft 90%, tokens.$ivory 10%),
      tokens.$ink
    );
    border: 1px solid var(--q-accent);
    border-radius: 1rem;
    overflow: hidden;
  }

  .about-section-block {
    position: relative;
  }

  .kicker {
    color: tokens.$champagne;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
  }

  h1 {
    font-size: clamp(1.9rem, 2.6vw, 2.6rem);
  }

  h1,
  h2 {
    color: tokens.$text;
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .section-lead {
    color: tokens.$text;
    font-weight: 700;
    line-height: 1.45;
  }

  .section-copy {
    color: tokens.$text-muted;
    line-height: 1.55;
  }

  .about-avatar {
    flex: none;
    border: 1px solid color-mix(in srgb, var(--q-accent) 36%, transparent);
    background: color-mix(in srgb, tokens.$ink 50%, transparent);
  }

  .discipline-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .discipline {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
    padding: 1rem;
    border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
    border-radius: 0.75rem;
    background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);

    p {
      color: tokens.$text-muted;
      line-height: 1.45;
    }
  }

  .discipline__label,
  .step__label {
    display: block;
    margin-bottom: 0.2rem;
    color: tokens.$text;
    font-weight: 700;
  }

  .discipline-sum {
    color: tokens.$text;
    font-weight: 600;
    line-height: 1.45;
  }

  .fit-list {
    display: grid;
    gap: 0.6rem;
    padding: 0;
    list-style: none;

    li {
      position: relative;
      padding: 0.8rem 1rem 0.8rem 2.4rem;
      border: 1px solid color-mix(in srgb, var(--q-accent) 22%, transparent);
      border-radius: 0.75rem;
      background: color-mix(in srgb, tokens.$ink 72%, transparent);
      color: tokens.$text-muted;
      line-height: 1.4;

      &::before {
        content: '';
        position: absolute;
        top: 1.2rem;
        left: 1rem;
        width: 0.55rem;
        height: 0.55rem;
        border-radius: 2px;
        background: tokens.$champagne;
        transform: rotate(45deg);
      }
    }
  }

  .step-list {
    display: grid;
    gap: 0.75rem;
    padding: 0;
    list-style: none;
  }

  .step {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;

    p {
      color: tokens.$text-muted;
      line-height: 1.5;
    }
  }

  .step__num {
    flex: none;
    display: grid;
    place-items: center;
    width: 1.9rem;
    height: 1.9rem;
    border: 1px solid tokens.$champagne;
    border-radius: 50%;
    color: tokens.$champagne;
    font-size: 0.85rem;
    font-weight: 700;
  }

  .about-cta {
    border-radius: 0.75rem;
  }

  .client-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .client-card {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 7rem;
    padding: 1.25rem;
    border: 1px solid color-mix(in srgb, var(--q-accent) 26%, transparent);
    border-radius: 0.85rem;
    background: color-mix(in srgb, tokens.$ivory 92%, white 8%);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, white 72%, transparent),
      0 12px 32px color-mix(in srgb, tokens.$ink 42%, transparent);
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease;
  }

  .client-card:hover,
  .client-card:focus-visible {
    transform: translateY(-0.2rem);
    border-color: color-mix(in srgb, var(--q-accent) 52%, transparent);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, white 72%, transparent),
      0 16px 42px color-mix(in srgb, tokens.$ink 54%, transparent);
  }

  .client-card picture {
    display: block;
  }

  .client-card img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 4.5rem;
    object-fit: contain;
  }

  &.desktop-view {
    .about-card {
      max-width: 960px;
      margin-inline: auto;
    }

    .about-section-block {
      padding: 2rem;
    }

    .section-copy,
    .section-lead {
      max-width: 48rem;
    }

    .client-grid,
    .discipline-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &.responsive-view {
    .about-section-block {
      padding: 1.25rem;
    }

    .client-card {
      min-height: 6rem;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-section {
    .client-card {
      transition: none;
    }

    .client-card:hover,
    .client-card:focus-visible {
      transform: none;
    }
  }
}
</style>
