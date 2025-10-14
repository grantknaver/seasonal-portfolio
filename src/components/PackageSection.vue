<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
import { Packages } from '../shared/constants/packages';
import { type PackageDetails } from '../shared/types/packageDetails';
import { useViewport } from '../shared/utils/viewWidth';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const packages = ref<PackageDetails[]>([
  {
    name: Packages.StarterPackage,
    id: uuidv4(),
    src: new URL('../assets/starter-fall.png', import.meta.url).href,
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
    tagline: 'Your first step toward a more engaging, modern experience.',
  },
  {
    name: Packages.GrowthPackage,
    id: uuidv4(),
    src: new URL('../assets/growth-fall.png', import.meta.url).href,
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
    tagline: 'Perfect for startups moving from MVP to a polished product launch.',
  },
  {
    name: Packages.PremiumPackage,
    id: uuidv4(),
    src: new URL('../assets/premium-fall.png', import.meta.url).href,
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
    tagline:
      'The complete experience — built for high-visibility launches, investors, or agencies needing that extra wow factor.',
  },
]);
const isBelowLgBreakpoint = computed(() => useViewport().width.value < useViewport().lgBreakpoint);
watch(activeTheme, (newTheme) => {
  const theme = newTheme.toLowerCase();
  const updatedPackages = packages.value.map((p) => {
    const name = p.name.toLowerCase().replace(' ', '').replace('package', '');
    return {
      ...p,
      src: new URL(`../assets/${name}-${theme}.png`, import.meta.url).href,
    };
  });
  packages.value = updatedPackages;
});
</script>

<template>
  <section>
    <!-- Mobile -->
    <div class="responsive-view full-width column items-center q-gutter-y-md">
      <q-card class="first-card full-width column items-center bg-secondary">
        <q-card-section
          class="package-header-section full-width q-pa-lg text-primary"
          :class="
            setSeasonClasses(
              {
                Fall: 'bg-accent ',
                Winter: 'bg-accent',
                Spring: 'bg-accent ',
                Summer: 'bg-accent ',
              },
              activeTheme,
            )
          "
        >
          <h1
            class="text-h1-alt q-mt-none q-mb-md bg-dark text-center"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-secondary',
                  Winter: 'text-secondary',
                  Spring: 'text-secondary',
                  Summer: 'text-secondary',
                },
                activeTheme,
              )
            "
          >
            Packages
          </h1>
          <q-separator
            :color="
              setSeasonClasses(
                {
                  Fall: 'primary',
                  Winter: 'primary',
                  Spring: 'primary',
                  Summer: 'primary',
                },
                activeTheme,
              )
            "
            class="q-mb-md"
          />
          <p
            class="text-body-1 text-center"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-primary',
                  Winter: 'text-primary',
                  Spring: 'text-primary',
                  Summer: 'text-white',
                },
                activeTheme,
              )
            "
          >
            Whether you need one polished animation, a full motion + AI upgrade, or a launch-ready
            experience, I’ve got you covered. These packages make it simple to get started — clear
            scope, fair pricing, and fast turnaround.
          </p>
        </q-card-section>

        <q-card-section class="section-container column">
          <div
            bordered
            padding
            :separator="true"
            class="package-tile full-width q-pa-md bg-white col-6 q-mb-none no-border"
          >
            <div class="h2-container row justify-center q-mb-lg text-center bg-accent text-white">
              <h2 class="text-h2">{{ packages[0]?.name }}</h2>
            </div>

            <div class="tagline-container bg-dark q-pa-lg">
              <p class="text-body-2 text-center text-primary q-ma-none">
                {{ packages[0]?.tagline }}
              </p>
            </div>
            <div class="cta-container column">
              <div class="img-container column full-width items-center bg-primary">
                <img class="full-width q-pa-lg" :src="packages[0]?.src" />
              </div>
              <br />
              <q-btn size="lg" color="accent" class="q-mb-md">Consultation</q-btn>
            </div>
            <q-item v-for="(f, index) in packages[0]?.features" :key="index">
              <span class="row full-width q-pa-none">
                <q-item-section side>
                  <q-icon name="circle" size=".5rem" class="text-dark" />
                </q-item-section>
                <q-item-section class="package-feature text-body-2 text-black">
                  {{ f.text }}
                </q-item-section>
              </span>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
      <q-intersection
        v-for="p in packages.slice(1)"
        :key="p.id"
        transition="slide-up"
        transition-duration="1500"
        :once="true"
        class="q-card-container"
      >
        <q-card class="full-width column items-center bg-secondary">
          <q-card-section class="section-container column">
            <div
              class="package-tile full-width q-pa-md bg-white col-6 q-mb-none no-border rounded-borders"
            >
              <div class="h2-container row justify-center q-mb-lg text-center bg-accent text-white">
                <h2 class="text-h2">{{ p.name }}</h2>
              </div>

              <div class="tagline-container bg-dark q-pa-lg">
                <p class="text-body-2 text-center text-primary q-ma-none">
                  {{ p.tagline }}
                </p>
              </div>

              <div class="cta-container column">
                <div class="img-container column full-width items-center bg-primary">
                  <img class="full-width q-pa-lg" :src="p.src" />
                </div>
                <br />
                <q-btn size="lg" color="accent" class="q-mb-md">Consultation</q-btn>
              </div>
              <q-list>
                <q-item v-for="(f, index) in p.features" :key="index">
                  <span class="row full-width q-pa-none">
                    <q-item-section side>
                      <q-icon name="circle" size=".5rem" class="text-dark" />
                    </q-item-section>
                    <q-item-section class="package-feature text-body-2 text-black">
                      {{ f.text }}
                    </q-item-section>
                  </span>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </q-card></q-intersection
      >
    </div>

    <!-- Desktop -->
    <div class="desktop-view full-width column">
      <div
        class="intro-container full-width q-pa-md"
        :class="
          setSeasonClasses(
            {
              Fall: isBelowLgBreakpoint ? 'bg-primary ' : 'bg-transparent',
              Winter: isBelowLgBreakpoint ? 'bg-primary ' : 'bg-transparent',
              Spring: isBelowLgBreakpoint ? 'bg-primary ' : 'bg-transparent',
              Summer: isBelowLgBreakpoint ? 'bg-white ' : 'bg-transparent',
            },
            activeTheme,
          )
        "
      >
        <h1
          class="text-h1 q-mt-none text-center"
          :class="
            setSeasonClasses(
              {
                Fall: isBelowLgBreakpoint
                  ? 'bg-dark text-secondary'
                  : 'bg-dark text-secondary border-black',
                Winter: isBelowLgBreakpoint
                  ? 'bg-dark text-secondary'
                  : 'bg-dark text-secondary border-black',
                Spring: isBelowLgBreakpoint
                  ? 'bg-dark text-secondary'
                  : 'bg-accent text-secondary border-black',
                Summer: isBelowLgBreakpoint
                  ? 'bg-dark text-secondary'
                  : 'bg-dark text-secondary border-black',
              },
              activeTheme,
            )
          "
        >
          Packages
        </h1>
        <q-separator
          :color="
            setSeasonClasses(
              {
                Fall: isBelowLgBreakpoint ? 'accent' : 'secondary',
                Winter: isBelowLgBreakpoint ? 'accent' : 'primary',
                Spring: isBelowLgBreakpoint ? 'accent ' : 'primary',
                Summer: isBelowLgBreakpoint ? 'accent ' : 'secondary',
              },
              activeTheme,
            )
          "
          class="q-mb-md"
        />
        <p
          :class="
            setSeasonClasses(
              {
                Fall: isBelowLgBreakpoint ? 'text-center text-dark' : 'text-primary',
                Winter: isBelowLgBreakpoint ? 'text-center text-dark' : 'text-primary',
                Spring: isBelowLgBreakpoint ? 'text-center text-dark' : 'text-primary',
                Summer: isBelowLgBreakpoint ? 'text-center text-dark' : 'text-white',
              },
              activeTheme,
            )
          "
        >
          Whether you need one polished animation, a full motion + AI upgrade, or a launch-ready
          experience, I’ve got you covered. These packages make it simple to get started — clear
          scope, fair pricing, and fast turnaround.
        </p>
      </div>
      <div class="cards-container column justify-end full-width q-pa-md">
        <q-intersection
          v-for="(p, index) in packages"
          :key="p.id"
          transition="slide-up"
          transition-duration="1500"
          :once="true"
          class="q-card-container full-width"
        >
          <q-card
            class="bg-secondary"
            :class="{
              'q-mb-md': index !== packages.length - 1,
            }"
          >
            <q-card-section class="section-container">
              <div class="package-tile row bg-white">
                <div class="col-6">
                  <q-expansion-item
                    header-class="expandable-header"
                    class="full-width q-mb-md"
                    :label="p.name"
                  >
                    <q-card class="header-content full-width bg-dark">
                      <q-card-section class="text-primary">
                        {{ p.tagline }} - {{ packages.length }}
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <div class="column no-wrap items-center q-mb-none q-pa-md border rounded-borders">
                    <div class="img-container column justify-center items-center bg-primary">
                      <img class="full-width q-pa-lg" :src="p.src" />
                    </div>
                    <q-btn color="accent" class="q-mt-md full-width">Consultation</q-btn>
                  </div>
                </div>
                <q-list
                  bordered
                  padding
                  :separator="true"
                  class="col-6 q-mb-none no-border rounded-borders bg-primary"
                >
                  <q-item v-for="(f, index) in p.features" :key="index">
                    <span class="row full-width q-pa-none">
                      <q-item-section side>
                        <q-icon name="circle" size=".5rem" class="text-dark" />
                      </q-item-section>
                      <q-item-section class="text-body-2 text-dark">
                        {{ f.text }}
                      </q-item-section>
                    </span>
                  </q-item>
                </q-list>
              </div>
            </q-card-section>
          </q-card>
        </q-intersection>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.responsive-view {
  @media (min-width: $breakpoint-md) {
    display: none;
  }

  .first-card {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .package-header-section {
    padding: 1rem;
    background-color: rgba(black, 0.5);
    border-radius: 0;
  }

  .h2-container {
    border: solid 2px var(--q-dark);
  }

  .tagline-container {
    border-bottom: 4px solid white;
    font-weight: 400;
  }

  .package-feature {
    line-height: 1.6rem;
  }

  .img-container {
    width: min(100%, 300px);
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
    }
  }
}

.desktop-view {
  display: none;

  @media (min-width: $breakpoint-md) {
    display: flex;
  }

  .intro-container {
    @media (max-width: $breakpoint-lg) {
      background-color: var(--q-accent);
      border-bottom: solid 4px var(--q-secondary);
    }
    @media (min-width: $breakpoint-lg) {
      background-color: transparent;
    }

    p {
      font-weight: normal;
      font-size: 1rem;
      @media (max-width: $breakpoint-md) {
        font-size: 1.2rem;
      }
    }
  }

  .cards-container {
    @media (max-width: $breakpoint-lg) {
      background-color: rgba(0, 0, 0, 0.5);
      border: solid 4px var(--q-white);
      border-top: none;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    @media (min-width: $breakpoint-lg) {
      background-color: transparent;
    }

    .q-card-container {
      box-shadow: 1rem 1rem 1rem dark;

      .q-card {
        box-sizing: border-box;
        border-radius: 10px !important;

        .section-container:nth-child(2) {
          border-radius: 10px;
        }

        .package-tile {
          border-radius: 10px;

          .header-content,
          .header-content.q-card-section {
            border-radius: 0 !important;
            border-top: 1px solid lightgray;
          }

          .expandable-header {
            border: solid 1px lightgray;
          }

          hr {
            width: 90%;
          }

          .q-item {
            padding-top: 0.5rem;
            padding-bottom: 8px;
          }

          .tagline {
            font-weight: 400; /* only one weight is available for some scripts */
          }

          .img-container {
            width: 100%;
            aspect-ratio: 1 / 1; /* keeps it square */
            overflow: hidden; /* hides any accidental overflow */
            border: solid 2px var(--q-dark);

            img {
              max-width: 100%;
              max-height: 100%;
              width: auto; /* don’t force 100% width */
              height: auto; /* preserve aspect ratio */
              object-fit: contain; /* fit entirely within the box */
              border: 2px solid var(--q-accent);
            }

            .q-btn {
              border-top: 5px solid white;
            }
          }
        }
      }
    }
  }
}
</style>
