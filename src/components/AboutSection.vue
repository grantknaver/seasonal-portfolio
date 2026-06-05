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

const generalBullets = ref<AboutBulletPoints[]>([
  {
    src: getImg('gsap-animation.avif'),
    label: 'Motion systems',
    id: uuidv4(),
    text: 'Purposeful GSAP motion that guides attention, creates feedback, and makes complex interfaces feel clear and alive.',
  },
  {
    src: getImg('ai-integration.avif'),
    label: 'AI interaction',
    id: uuidv4(),
    text: 'AI-supported interfaces with stronger pacing, clearer states, and interaction patterns that help users understand what is happening.',
  },
  {
    src: getImg('interactive-data-visualization.avif'),
    label: 'Interface clarity',
    id: uuidv4(),
    text: 'Product sections, demos, dashboards, and flows shaped around comprehension, trust, and the next useful action.',
  },
]);

const myApproachBullets = ref<AboutBulletPoints[]>([
  {
    src: getImg('creative-engineering.avif'),
    label: 'Strategy before build',
    id: uuidv4(),
    text: 'I start by understanding the surface, the user moment, and the friction before deciding what should move, change, or be rebuilt.',
  },
  {
    src: getImg('future-proof-thinking.avif'),
    label: 'Reusable implementation',
    id: uuidv4(),
    text: 'I build with clean structure, responsive behavior, and reusable pieces so the first version can keep improving instead of becoming throwaway work.',
  },
  {
    src: getImg('collaborative-mindset.avif'),
    label: 'Clear collaboration',
    id: uuidv4(),
    text: 'I keep the work scoped, practical, and understandable so decisions are easier and progress does not get buried in complexity.',
  },
]);

const whyClientsBullets = ref<AboutBulletPoints[]>([
  {
    src: getImg('fast-results.avif'),
    label: 'Fast usable progress',
    id: uuidv4(),
    text: 'Focused implementation blocks make it easier to move from idea to usable experience without dragging the work into a long redesign cycle.',
  },
  {
    src: getImg('scalable-systems.avif'),
    label: 'Scalable systems',
    id: uuidv4(),
    text: 'The work is structured to adapt across breakpoints, content changes, and future product needs instead of only solving the current screen.',
  },
  {
    src: getImg('memorable-experiences.avif'),
    label: 'Memorable experience',
    id: uuidv4(),
    text: 'Motion, feedback, and polish help the product feel more considered, more trustworthy, and easier to remember.',
  },
]);

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
    :class="isResponsive ? 'responsive-view q-pa-md' : 'desktop-view q-pa-md'"
  >
    <q-card class="about-card q-pa-none">
      <q-card-section class="about-section-block about-intro q-pa-lg">
        <p class="text-caption kicker q-mt-none q-mb-sm">Motion UI + AI Interaction</p>

        <h1 class="text-h1 q-mt-none q-mb-md">About the Work</h1>

        <p class="section-lead text-body-1 q-mt-none q-mb-sm">
          Focused implementation for interfaces that need to feel clearer, more responsive, and
          easier to trust.
        </p>

        <p class="section-copy text-body-2 q-mt-none q-mb-md">
          I work across motion, AI interaction, product clarity, and frontend implementation. The
          goal is not decoration. The goal is helping complex digital experiences feel more
          understandable, reliable, and alive.
        </p>

        <q-list class="about-list q-mt-lg">
          <div v-for="bullet in generalBullets" :key="bullet.id" class="about-bullet">
            <q-expansion-item group="about-work" header-class="about-expansion-header">
              <template #header>
                <q-item-section avatar>
                  <q-avatar class="about-avatar">
                    <img :src="bullet.src" :alt="bullet.label" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <span class="about-expansion-label">{{ bullet.label }}</span>
                </q-item-section>
              </template>

              <q-card class="about-expansion-body">
                <q-card-section>
                  <p class="q-ma-none text-body-2">{{ bullet.text }}</p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-list>

        <q-btn
          @click="toContact"
          class="about-cta q-mt-lg full-width"
          color="accent"
          size="lg"
          glossy
        >
          <span class="text-body-2">Let’s Connect</span>
        </q-btn>
      </q-card-section>
    </q-card>

    <q-intersection transition="slide-up" transition-duration="600" :once="true">
      <q-card class="about-card q-mt-md q-pa-none">
        <q-card-section class="about-section-block q-pa-lg">
          <p class="text-caption kicker q-mt-none q-mb-sm">Process</p>

          <h2 class="text-h2 q-mt-none q-mb-md">My Approach</h2>

          <p class="section-copy text-body-2 q-mt-none q-mb-md">
            Before I dive into code, I focus on the product moment, what the user needs to
            understand, and where motion or AI support can reduce friction.
          </p>

          <q-list class="about-list q-mt-lg">
            <div v-for="bullet in myApproachBullets" :key="bullet.id" class="about-bullet">
              <q-expansion-item group="about-approach" header-class="about-expansion-header">
                <template #header>
                  <q-item-section avatar>
                    <q-avatar class="about-avatar">
                      <img :src="bullet.src" :alt="bullet.label" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <span class="about-expansion-label">{{ bullet.label }}</span>
                  </q-item-section>
                </template>

                <q-card class="about-expansion-body">
                  <q-card-section>
                    <p class="q-ma-none text-body-2">{{ bullet.text }}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-intersection>

    <q-intersection transition="slide-up" transition-duration="700" :once="true">
      <q-card class="about-card q-mt-md q-pa-none">
        <q-card-section class="about-section-block q-pa-lg">
          <p class="text-caption kicker q-mt-none q-mb-sm">Why it works</p>

          <h2 class="text-h2 q-mt-none q-mb-md">Why Clients Work With Me</h2>

          <p class="section-copy text-body-2 q-mt-none q-mb-md">
            Clients usually need more than a functioning screen. They need a clearer experience, a
            sharper flow, and implementation that can move quickly without feeling rushed.
          </p>

          <q-list class="about-list q-mt-lg">
            <div v-for="bullet in whyClientsBullets" :key="bullet.id" class="about-bullet">
              <q-expansion-item group="about-why" header-class="about-expansion-header">
                <template #header>
                  <q-item-section avatar>
                    <q-avatar class="about-avatar">
                      <img :src="bullet.src" :alt="bullet.label" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <span class="about-expansion-label">{{ bullet.label }}</span>
                  </q-item-section>
                </template>

                <q-card class="about-expansion-body">
                  <q-card-section>
                    <p class="q-ma-none text-body-2">{{ bullet.text }}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-intersection>

    <q-intersection transition="slide-up" transition-duration="800" :once="true">
      <q-card class="about-card q-mt-md q-pa-none">
        <q-card-section class="about-section-block q-pa-lg">
          <p class="text-caption kicker q-mt-none q-mb-sm">Selected experience</p>

          <h2 class="text-h2 q-mt-none q-mb-md">Past Clients</h2>

          <p class="section-copy text-body-2 q-mt-none q-mb-lg">
            Selected organizations I’ve supported through product, frontend, interface, or
            implementation work.
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
@use '/src/css/_tokens.scss' as tokens;

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
    box-shadow:
      0 0 48px color-mix(in srgb, var(--q-accent) 28%, transparent),
      0 20px 64px color-mix(in srgb, tokens.$ink 88%, transparent);
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

  .about-list {
    display: grid;
    gap: 0.75rem;
    background: transparent;
  }

  .about-bullet {
    border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
    border-radius: 0.75rem;
    background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, tokens.$ivory 10%, transparent),
      0 8px 24px color-mix(in srgb, tokens.$ink 32%, transparent);
    overflow: hidden;
  }

  .about-expansion-header {
    color: tokens.$text;
    background: transparent;
    min-height: 4.25rem;
  }

  .about-expansion-header .q-item__section--avatar {
    min-width: 3.25rem;
  }

  .about-avatar {
    border: 1px solid color-mix(in srgb, var(--q-accent) 36%, transparent);
    background: color-mix(in srgb, tokens.$ink 50%, transparent);
  }

  .about-expansion-label {
    color: tokens.$text;
    font-weight: 700;
  }

  .about-expansion-body {
    color: tokens.$text-muted;
    background: color-mix(in srgb, tokens.$ink 82%, tokens.$ivory 5%);
    border-top: 1px solid color-mix(in srgb, var(--q-accent) 24%, transparent);
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

    .client-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &.responsive-view {
    .about-card:first-child {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

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
