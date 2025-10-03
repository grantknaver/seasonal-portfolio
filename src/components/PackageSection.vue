<script lang="ts" setup>
import { ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
// import { themeMap } from '../shared/constants/theme';
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
    cost: '$2K–$3K',
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
    cost: '$4K–$6K',
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
    cost: '$7K–$10K',
    tagline:
      'The complete experience — built for high-visibility launches, investors, or agencies needing that extra wow factor.',
  },
]);

watch(activeTheme, (newTheme) => {
  const theme = newTheme.toLowerCase();
  const updatedPackages = packages.value.map((p) => {
    const name = p.name.toLowerCase().replace(' ', '').replace('package', '');
    return {
      ...p,
      src: new URL(`../assets/${name}-${theme}.png`, import.meta.url).href,
    };
  });
  console.log('URL should work', updatedPackages);
  packages.value = updatedPackages;
});
</script>

<template>
  <section>
    <!-- Mobile -->
    <div class="mobile-view full-width q-ma-md">
      <q-card class="package-container full-width column items-center q-mt-md q-pt-lg q-pb-lg">
        <q-card-section
          class="package-header-section q-pa-lg"
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
          <h1 class="text-h1 q-mt-none q-mb-md bg-primary text-accent text-center">Packages</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p class="text-body1 text-center text-primary">
            Whether you need one polished animation, a full motion + AI upgrade, or a launch-ready
            experience, I’ve got you covered. These packages make it simple to get started — clear
            scope, fair pricing, and fast turnaround.
          </p>
        </q-card-section>
        <q-intersection transition="slide-up" transition-duration="1000" :once="true">
          <q-card-section
            v-for="p in packages"
            :key="p.id"
            class="section-container q-pa-sm q-mb-md"
          >
            <q-list
              bordered
              padding
              :separator="true"
              class="package-tile full-width q-pa-md bg-white col-6 q-mb-none no-border rounded-borders"
            >
              <q-item class="row justify-center q-mb-lg text-center text-accent">
                <h2 class="text-h2">{{ p.name }}</h2>
              </q-item>

              <q-item>
                <q-item-section
                  class="tagline text-body1 text-center q-pt-md q-pb-md"
                  :class="
                    setSeasonClasses(
                      {
                        Fall: 'text-green-6',
                        Winter: 'earth-orange',
                        Spring: 'text-red-9',
                        Summer: 'dusty-plum',
                      },
                      activeTheme,
                    )
                  "
                >
                  {{ p.tagline }}
                </q-item-section>
              </q-item>
              <div class="cta-container column">
                <div class="img-container column full-width items-center bg-primary">
                  <img class="full-width q-pa-lg" :src="p.src" />
                </div>
                <br />
                <q-btn size="lg" color="accent" class="q-mb-md">Consultation</q-btn>
              </div>
              <q-item v-for="(f, index) in p.features" :key="index">
                <span class="row full-width q-pa-none">
                  <q-item-section side>
                    <q-icon name="circle" size=".5rem" class="text-dark" />
                  </q-item-section>
                  <q-item-section class="package-feature text-body2 text-black">
                    {{ f.text }}
                  </q-item-section>
                </span>
              </q-item>
              <q-item>
                <q-item-section class="q-pt-md text-black">
                  <span class="text-body2">Cost for Package:</span>
                  <span class="cost text-green-6">{{ p.cost }}</span>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-intersection>
      </q-card>
    </div>

    <!-- Desktop -->
    <div class="desktop-view full-width">
      <q-card class="full-width q-pa-sm bg-transparent">
        <q-card-section class="section-container text-primary q-pa-lg">
          <h1 class="q-mt-none q-mb-xl text-secondary text-center bg-dark">Packages</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p class="q-mb-none">
            Whether you need one polished animation, a full motion + AI upgrade, or a launch-ready
            experience, I’ve got you covered. These packages make it simple to get started — clear
            scope, fair pricing, and fast turnaround.
          </p>
        </q-card-section>

        <q-card-section class="section-container q-pa-sm">
          <div class="package-container col column">
            <q-intersection
              v-for="p in packages"
              :key="p.id"
              transition="slide-up"
              transition-duration="1000"
              :once="true"
            >
              <div class="package-tile row q-pa-md bg-white justify-around">
                <q-list
                  dense
                  bordered
                  padding
                  :separator="true"
                  class="col-6 q-mb-none no-border rounded-borders"
                >
                  <q-item
                    ><h2 class="text-accent package-header">{{ p.name }}</h2></q-item
                  >
                  <q-item>
                    <q-item-section
                      class="tagline q-pt-md q-pb-md"
                      :class="
                        setSeasonClasses(
                          {
                            Fall: 'text-green-6',
                            Winter: 'earth-orange',
                            Spring: 'text-red-9',
                            Summer: 'dusty-plum',
                          },
                          activeTheme,
                        )
                      "
                    >
                      {{ p.tagline }}
                    </q-item-section>
                  </q-item>
                  <q-item v-for="(f, index) in p.features" :key="index">
                    <span class="row full-width q-pa-none">
                      <q-item-section side>
                        <q-icon name="circle" size=".5rem" class="text-dark" />
                      </q-item-section>
                      <q-item-section class="text-black">
                        {{ f.text }}
                      </q-item-section>
                    </span>
                  </q-item>

                  <q-item>
                    <q-item-section class="q-pt-md text-black">
                      <span>Cost for Package:</span>
                      <span class="cost text-green-6">{{ p.cost }}</span>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div class="cta-container col-4 column">
                  <div class="img-container column full-width bg-primary">
                    <img class="full-width q-pa-lg" :src="p.src" />
                  </div>
                  <br />
                  <q-btn size="lg" color="accent">Consultation</q-btn>
                </div>
              </div>
            </q-intersection>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.mobile-view {
  @media (min-width: $breakpoint-sm) {
    display: none;
  }

  .package-container {
    padding: 1rem;
    background-color: rgba(black, 0.5);

    .package-header-section {
      padding: 1rem;
      background-color: rgba(black, 0.5);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-left: solid 8px var(--q-secondary);
      border-right: solid 8px var(--q-secondary);
      border-top: solid 8px var(--q-secondary);
    }

    .section-container {
      background-color: var(--q-secondary);

      .package-tile {
        .tagline {
          font-family: 'Prata';
          font-weight: 400; /* only one weight is available for some scripts */
        }

        .package-feature {
          line-height: 1.6rem;
        }

        .cta-container {
          .img-container {
            width: min(100%, 300px);
            aspect-ratio: 1 / 1; /* keeps it square */
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden; /* hides any accidental overflow */

            img {
              max-width: 100%;
              max-height: 100%;
              width: auto; /* don’t force 100% width */
              height: auto; /* preserve aspect ratio */
              object-fit: contain; /* fit entirely within the box */
              /* remove padding from the image if you want absolute max size: */
              /* padding: 0 !important; */
            }
          }
        }

        .cost {
          font-size: 1.4rem;
        }
      }
    }
  }
}

.desktop-view {
  display: none;

  @media (min-width: $breakpoint-sm) {
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
      border: solid 2px var(--q-primary);
    }

    .section-container:nth-child(2) {
      border-radius: 10px;
    }

    .package-container {
      row-gap: 1.5rem;

      @media (min-width: $breakpoint-xl) {
        justify-content: center;
      }

      .package-tile {
        border-radius: 10px;
        gap: 1rem;
        align-items: center;

        .package-header {
          text-shadow: 1px 1px 2px black;
          padding-bottom: 2rem !important;
        }

        .q-list {
          .q-item {
            padding-top: 0.5rem;
            padding-bottom: 8px;
          }

          .tagline {
            font-family: 'Prata';
            font-weight: 400; /* only one weight is available for some scripts */
          }

          .cost {
            color: #8bc34a;
          }
        }

        .cta-container {
          .img-container {
            width: min(100%, 300px);
            aspect-ratio: 1 / 1; /* keeps it square */
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden; /* hides any accidental overflow */
            border: solid 2px var(--q-dark);

            img {
              max-width: 100%;
              max-height: 100%;
              width: auto; /* don’t force 100% width */
              height: auto; /* preserve aspect ratio */
              object-fit: contain; /* fit entirely within the box */
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

.earth-orange {
  color: #d78c3b;
}

.dusty-plum {
  color: #964d94;
}
</style>
