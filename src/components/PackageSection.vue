<script lang="ts" setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { themeMap } from '../shared/constants/theme';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
import { Packages } from 'src/shared/constants/packages';
import { type PackageDetails } from '../shared/types/packageDetails';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const packages = ref<PackageDetails[]>([
  {
    name: Packages.StarterPackage,
    id: uuidv4(),
    src: new URL('../assets/starter.png', import.meta.url).href,
    alt: Packages.StarterPackage,
    featuresHeader: 'For new ideas ready to break ground.',
    features: [
      {
        featureIcon: 'movie_filter',
        text: 'One polished GSAP animation or a single AI feature integration',
      },
      { featureIcon: 'phone_iphone', text: 'Mobile-friendly + performance tuned' },
      { featureIcon: 'speed', text: 'Performance tuned' },
      { featureIcon: 'schedule', text: 'Delivered in 1–2 weeks' },
      {
        featureIcon: 'rocket_launch',
        text: 'Ideal for: landing pages, small teams, creators testing a concept',
      },
    ],
    cost: '$2K–$3K',
    tagline: 'Your first step toward a more engaging, modern experience.',
  },
  {
    name: Packages.GrowthPackage,
    id: uuidv4(),
    src: new URL('../assets/grow.png', import.meta.url).href,
    alt: Packages.GrowthPackage,
    featuresHeader: 'For projects ready to scale and stand out.',
    features: [
      {
        featureIcon: 'animation',
        text: '2–3 animations, or 1 animation + 1 AI integration together',
      },
      {
        featureIcon: 'integration_instructions',
        text: 'Integrates into your existing site/app seamlessly',
      },
      { featureIcon: 'brush', text: 'UX + design polish included' },
      { featureIcon: 'description', text: 'Case-study style wrap-up you can share' },
      { featureIcon: 'event', text: 'Delivered in 3–4 weeks' },
    ],
    cost: '$4K–$6K',
    tagline: 'Perfect for startups moving from MVP to a polished product launch.',
  },
  {
    name: Packages.PremiumPackage,
    id: uuidv4(),
    src: new URL('../assets/premium-summer.png', import.meta.url).href,
    alt: Packages.PremiumPackage,
    featuresHeader: 'For full bloom launches that need maximum impact.',
    features: [
      {
        featureIcon: 'slideshow',
        text: 'Hero animation, product demo, and AI integration combined',
      },
      {
        featureIcon: 'design_services',
        text: 'Design + strategy prototypes in Figma before build',
      },
      { featureIcon: 'priority_high', text: 'Priority support throughout development' },
      { featureIcon: 'support_agent', text: 'Optional ongoing support after delivery' },
      { featureIcon: 'calendar_month', text: 'Delivered in 4–6 weeks' },
    ],
    cost: '$7K–$10K',
    tagline:
      'The complete experience — built for high-visibility launches, investors, or agencies needing that extra wow factor.',
  },
]);
</script>

<template>
  <section>
    <!-- Mobile -->
    <div class="mobile-view full-width">
      <q-card class="full-width">
        <q-card-section
          class="section-container q-pa-lg"
          :class="
            setSeasonClasses(
              {
                Fall: 'bg-accent text-primary',
                Winter: 'bg-accent text-primary',
                Spring: 'bg-accent text-primary',
                Summer: 'bg-dark text-primary',
              },
              activeTheme,
            )
          "
        >
          <h1 class="q-mt-none text-primary">Packages</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p>
            “Whether you need one polished animation, a full motion + AI upgrade, or a launch-ready
            experience, I’ve got you covered. These packages make it simple to get started — clear
            scope, fair pricing, and fast turnaround.”
          </p>
        </q-card-section>

        <q-card-section
          class="section-container q-mt-md q-pa-sm"
          :style="{ backgroundColor: themeMap[activeTheme]['--q-primary'] }"
        >
          <div class="package-container column items-center q-pt-lg q-pb-lg">
            <q-card v-for="p in packages" :key="p.id" class="cursor-pointer">
              <img :src="p.src" :alt="p.alt" />
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Desktop -->
    <div class="desktop-view full-width">
      <q-card class="full-width q-pa-sm bg-transparent">
        <q-card-section class="section-container text-primary q-pa-lg">
          <h1 class="q-mt-none q-mb-xl text-secondary text-center bg-dark">Packages</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p class="q-mb-none">
            “Whether you need one polished animation, a full motion + AI upgrade, or a launch-ready
            experience, I’ve got you covered. These packages make it simple to get started — clear
            scope, fair pricing, and fast turnaround.”
          </p>
        </q-card-section>

        <q-card-section class="section-container q-pa-sm">
          <div class="package-container flex col column">
            <div
              v-for="p in packages"
              :key="p.id"
              class="package-tile row justify-center cursor-pointer"
            >
              <q-list
                dense
                bordered
                padding
                class="rounded-borders q-mb-lg"
                :separator="true"
                :class="`${p.name.replace(' ', '')}`"
              >
                <q-item class="packageName">{{ p.name }}</q-item>
                <q-item>
                  <q-item-section>
                    {{ p.tagline }}
                  </q-item-section>
                </q-item>
                <q-item v-for="(f, index) in p.features" :key="index">
                  <q-item-section>
                    {{ f.text }}
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <span>Cost for Package:</span>
                    <span>{{ p.cost }}</span>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.mobile-view {
  @media (min-width: $breakpoint-md) {
    display: none;
  }

  .q-card {
    padding: 1rem;
    background-color: rgba(black, 0.5);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
    }

    .section-container {
      background-color: var(--q-secondary);
      .project-container {
        .project-tile {
          width: 100%;
          max-width: 80%;

          @media (min-width: $breakpoint-sm) {
            max-width: 300px;
          }
          img {
            width: 100%;
            height: auto;
            transition: transform 0.3s ease;
          }
        }
      }
    }

    .section-container:nth-child(1) {
      border: solid 4px var(--q-primary);
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }

    .section-container:nth-child(2) {
      border-radius: 10px;
    }
  }
}

.desktop-view {
  display: none;

  @media (min-width: $breakpoint-md) {
    display: flex;
  }

  .q-card {
    display: flex !important;
    flex-direction: column;
    flex: 1 1 0%;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 10px !important;

    h1 {
      font-size: 3rem;
      border: solid 2px var(--q-primary);
    }

    .section-container:nth-child(2) {
      border-radius: 10px;
    }

    .package-container {
      @media (min-width: $breakpoint-xl) {
        justify-content: center;
      }

      .package-tile {
        position: relative;
        overflow: hidden;
        .packageName {
          font-size: 2rem;
        }
        .q-list {
          flex: 1 1 auto;
          height: 100%;
        }

        &.q-list.StarterPackage {
          position: relative;
          background: transparent; /* don't fight bg-* utilities */
          border-radius: 12px; /* keep your radius if needed */
        }

        &.q-list.StarterPackage::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          border-radius: inherit;

          /* Use a subtle color wash + image; edit the rgba() for strength */
          background:
            linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
            url('../assets/grow.png') center/cover no-repeat;
          /* If you prefer pure image opacity instead of a tint, swap the gradient for: */
          /* opacity: 0.25;  // and set background to only the image */
        }

        &.q-list.StarterPackage > * {
          position: relative;
          z-index: 1;
        }

        .GrowthPackage {
          display: none;
        }

        .PremiumPackage {
          display: none;
        }
      }

      .package-tile .q-list.StarterPackage::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        border-radius: inherit;

        /* Use a subtle color wash + image; edit the rgba() for strength */
        background:
          linear-gradient(rgba(255, 255, 255, 0.7)),
          url('../assets/package-fall.jpg') center no-repeat;
        /* If you prefer pure image opacity instead of a tint, swap the gradient for: */
        /* opacity: 0.25;  // and set background to only the image */
      }

      /* Keep all inner content above the overlay */
      .package-tile .q-list.StarterPackage > * {
        position: relative;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
