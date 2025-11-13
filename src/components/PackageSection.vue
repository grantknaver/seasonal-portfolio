<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
import { Package } from '../shared/constants/packages';
import { type PackageDetails } from '../shared/types/packageDetails';
import { useViewport } from '../shared/utils/viewWidth';
import { Theme } from 'src/shared/constants/theme';
import { type ThemePackageImages } from 'src/shared/types/themePackageImages';
import type { PackageType } from 'src/shared/types/packageType';

import starterFall from 'src/assets/starter-fall.png?w=300;600;900&format=avif;webp;png&as=picture';
import growthFall from 'src/assets/growth-fall.png?w=300;500;900&format=avif;webp;png&as=picture';
import premiumFall from 'src/assets/premium-fall.png?w=300;500;900&format=avif;webp;png&as=picture';

import starterWinter from 'src/assets/starter-winter.png?w=300;500;900&format=avif;webp;png&as=picture';
import growthWinter from 'src/assets/growth-winter.png?w=300;500;900&format=avif;webp;png&as=picture';
import premiumWinter from 'src/assets/premium-winter.png?w=300;500;900&format=avif;webp;png&as=picture';

import starterSpring from 'src/assets/starter-spring.png?w=300;500;900&format=avif;webp;png&as=picture';
import growthSpring from 'src/assets/growth-spring.png?w=300;500;900&format=avif;webp;png&as=picture';
import premiumSpring from 'src/assets/premium-spring.png?w=300;500;900&format=avif;webp;png&as=picture';

import starterSummer from 'src/assets/starter-summer.png?w=300;500;900&format=avif;webp;png&as=picture';
import growthSummer from 'src/assets/growth-summer.png?w=300;500;900&format=avif;webp;png&as=picture';
import premiumSummer from 'src/assets/premium-summer.png?w=300;500;900&format=avif;webp;png&as=picture';

import { mdiCheckboxBlankCircle } from '@quasar/extras/mdi-v7';
import { debounce } from 'quasar';
import { TopicName } from 'src/shared/constants/topicName';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const emit = defineEmits(['requestConsultation']);
const getPackageImages = (theme: Theme): ThemePackageImages => {
  switch (theme) {
    case Theme.Fall:
      return {
        starter: starterFall,
        growth: growthFall,
        premium: premiumFall,
      };
    case Theme.Winter:
      return {
        starter: starterWinter,
        growth: growthWinter,
        premium: premiumWinter,
      };
    case Theme.Spring:
      return {
        starter: starterSpring,
        growth: growthSpring,
        premium: premiumSpring,
      };
    case Theme.Summer:
      return {
        starter: starterSummer,
        growth: growthSummer,
        premium: premiumSummer,
      };

    default:
      return {
        starter: starterFall,
        growth: growthFall,
        premium: premiumFall,
      };
  }
};
const packages = ref<PackageDetails[]>([
  {
    name: Package.StarterPackage,
    id: uuidv4(),
    img: starterFall,
    alt: Package.StarterPackage,
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
    name: Package.GrowthPackage,
    id: uuidv4(),
    img: growthFall,
    alt: Package.GrowthPackage,
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
    name: Package.PremiumPackage,
    id: uuidv4(),
    img: premiumFall,
    alt: Package.PremiumPackage,
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
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

onMounted(() => {
  setActiveAssets(activeTheme.value);
  window.addEventListener('resize', onResize);
});

watch(
  activeTheme,
  (newTheme) => {
    setActiveAssets(newTheme);
  },
  {},
);

const onResize = debounce(() => {
  setActiveAssets(activeTheme.value);
}, 500);

const toContact = (p: Package | null) => {
  emit('requestConsultation', p);
  mainStore.SET_PACKAGE_OF_INTEREST(p);
  mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);
};
const setActiveAssets = (newTheme: Theme) => {
  const activeThemePackageImages = getPackageImages(newTheme);
  const theme = newTheme.toLowerCase();
  const updatedPackages = packages.value.map((p) => {
    const name = p.name.toLowerCase().replace(' ', '').replace('package', '') as PackageType;
    const img = activeThemePackageImages[name];
    return {
      ...p,
      src: new URL(`../assets/${name}-${theme}.png`, import.meta.url).href,
      img,
    };
  });
  packages.value = updatedPackages;
};
</script>

<template>
  <!-- Mobile -->
  <section v-if="isResponsive" class="responsive-view full-width column items-center q-gutter-y-md">
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
          class="text-h1 q-mt-none q-mb-md q-mb-md q-pt-md q-pb-md bg-dark text-center"
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
          Each project below demonstrates how design, animation, and intelligence combine to make
          interfaces <i>feel alive</i>. From motion systems to AI-integrated tools, these builds
          show how creative engineering turns complexity into clarity.
        </p>
      </q-card-section>

      <q-card-section class="section-container full-width column">
        <div
          bordered
          padding
          :separator="true"
          class="package-tile full-width q-pa-md bg-white q-mb-none no-border"
        >
          <div class="h2-container row justify-center q-mb-md text-center bg-accent text-white">
            <h2 class="text-h2">{{ packages[0]?.name }}</h2>
          </div>

          <div class="tagline-container bg-dark q-pa-lg">
            <p class="text-body-2 text-center text-primary q-ma-none">
              {{ packages[0]?.tagline }}
            </p>
          </div>
          <div class="cta-container column">
            <div class="img-container column full-width items-center bg-primary">
              <picture
                :class="{
                  'responsive-fall-img': activeTheme === Theme.Fall,
                  'responsive-winter-img': activeTheme === Theme.Winter,
                  'responsive-spring-img': activeTheme === Theme.Spring,
                  'responsive-summer-img': activeTheme === Theme.Summer,
                }"
              >
                <source v-for="(src, k) in packages[0]?.img.sources" :key="k" :srcset="src" />
                <img
                  :src="packages[0]?.img.img.src"
                  :width="packages[0]?.img.img.w"
                  :height="packages[0]?.img.img.h"
                  :alt="packages[0]?.name"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                />
              </picture>
            </div>
            <br />
            <q-btn
              size="lg"
              color="accent"
              class="q-mb-md"
              @click="toContact(packages[0]?.name ?? null)"
              >Consultation</q-btn
            >
          </div>
          <q-item v-for="(f, index) in packages[0]?.features" :key="index">
            <span class="row full-width q-pa-none">
              <q-item-section side>
                <q-icon :name="mdiCheckboxBlankCircle" size=".5rem" class="text-dark" />
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
      v-for="(p, index) in packages.slice(1)"
      :key="p.id"
      transition="slide-up"
      transition-duration="1500"
      :once="true"
      class="q-card-container full-width"
    >
      <q-card class="full-width column items-center bg-secondary">
        <q-card-section class="section-container full-width column">
          <div class="package-tile full-width q-pa-md bg-white q-mb-none no-border rounded-borders">
            <div class="h2-container row justify-center q-mb-md text-center bg-accent text-white">
              <h2 class="text-h2">{{ p.name }}</h2>
            </div>

            <div class="tagline-container bg-dark q-pa-lg">
              <p class="text-body-2 text-center text-primary q-ma-none">
                {{ p.tagline }}
              </p>
            </div>

            <div class="cta-container column">
              <div class="img-container column full-width items-center bg-primary">
                <picture
                  :class="{
                    'responsive-fall-img': activeTheme === Theme.Fall,
                    'responsive-winter-img': activeTheme === Theme.Winter,
                    'responsive-spring-img': activeTheme === Theme.Spring,
                    'responsive-summer-img': activeTheme === Theme.Summer,
                  }"
                >
                  <source v-for="(s, srcIndex) in p.img.sources" :key="srcIndex" :srcset="s" />
                  <img
                    :src="p?.img.img.src"
                    :width="p?.img.img.w"
                    :height="p?.img.img.h"
                    :alt="p?.name"
                    :loading="index === 0 ? 'eager' : 'lazy'"
                    :fetchpriority="index === 0 ? 'high' : 'auto'"
                    decoding="async"
                  />
                </picture>
              </div>
              <br />
              <q-btn size="lg" color="accent" class="q-mb-md" @click="toContact(p?.name ?? null)"
                >Consultation</q-btn
              >
            </div>
            <q-list>
              <q-item v-for="(f, index) in p.features" :key="index">
                <span class="row full-width q-pa-none">
                  <q-item-section side>
                    <q-icon :name="mdiCheckboxBlankCircle" size=".5rem" class="text-dark" />
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
  </section>

  <!-- Desktop -->
  <section v-if="!isResponsive" class="desktop-view full-width column">
    <div
      class="intro-container full-width q-pt-md q-pr-md q-pb-none q-pl-md"
      :class="
        setSeasonClasses(
          {
            Fall: isResponsive ? 'bg-primary ' : 'bg-transparent',
            Winter: isResponsive ? 'bg-primary ' : 'bg-transparent',
            Spring: isResponsive ? 'bg-primary ' : 'bg-transparent',
            Summer: isResponsive ? 'bg-white ' : 'bg-transparent',
          },
          activeTheme,
        )
      "
    >
      <h1
        class="text-h1 q-mt-none q-pt-md q-pb-md text-center"
        :class="
          setSeasonClasses(
            {
              Fall: isResponsive ? 'bg-dark text-secondary' : 'bg-dark text-secondary border-black',
              Winter: isResponsive
                ? 'bg-dark text-secondary'
                : 'bg-dark text-secondary border-black',
              Spring: isResponsive
                ? 'bg-dark text-secondary'
                : 'bg-accent text-secondary border-black',
              Summer: isResponsive
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
              Fall: isResponsive ? 'accent' : 'secondary',
              Winter: isResponsive ? 'accent' : 'primary',
              Spring: isResponsive ? 'accent ' : 'primary',
              Summer: isResponsive ? 'accent ' : 'secondary',
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
              Fall: isResponsive ? 'text-center text-dark' : 'text-primary',
              Winter: isResponsive ? 'text-center text-dark' : 'text-primary',
              Spring: isResponsive ? 'text-center text-dark' : 'text-primary',
              Summer: isResponsive ? 'text-center text-dark' : 'text-white',
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
                      {{ p.tagline }}
                    </q-card-section>
                  </q-card>
                </q-expansion-item>

                <div class="column no-wrap items-center q-mb-none q-pa-md border rounded-borders">
                  <div class="img-container column justify-center items-center bg-primary">
                    <picture
                      :class="{
                        'desktop-fall-img': activeTheme === Theme.Fall,
                        'desktop-winter-img': activeTheme === Theme.Winter,
                        'desktop-spring-img': activeTheme === Theme.Spring,
                        'desktop-summer-img': activeTheme === Theme.Summer,
                      }"
                    >
                      <source v-for="(s, srcIndex) in p.img.sources" :key="srcIndex" :srcset="s" />
                      <img
                        :src="p?.img.img.src"
                        :alt="p?.name"
                        :loading="index === 0 ? 'eager' : 'lazy'"
                        :fetchpriority="index === 0 ? 'high' : 'auto'"
                        decoding="async"
                      />
                    </picture>
                  </div>
                  <q-btn
                    @click="toContact(p?.name ?? null)"
                    color="accent"
                    class="q-mt-md full-width"
                    >Consultation</q-btn
                  >
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
                      <q-icon :name="mdiCheckboxBlankCircle" size="8px" class="text-dark" />
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
  </section>
</template>

<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

.packageSection {
  content-visibility: auto;
  contain-intrinsic-size: 800px 1000px;
}

.responsive-view {
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
  display: flex;

  .intro-container {
    @media (max-width: tokens.$breakpoint-lg) {
      background-color: var(--q-accent);
      border-bottom: solid 4px var(--q-secondary);
    }
    @media (min-width: $breakpoint-lg) {
      background-color: transparent;
    }

    p {
      font-weight: normal;
      font-size: 1rem;
      @media (max-width: tokens.$breakpoint-md) {
        font-size: 1.2rem;
      }
    }
  }

  .cards-container {
    @media (max-width: tokens.$breakpoint-lg) {
      background-color: rgba(0, 0, 0, 0.5);
      border: solid 4px var(--q-white);
      border-top: none;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    @media (min-width: tokens.$breakpoint-lg) {
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
            }
          }
        }
      }
    }
  }
}

.responsive-fall-img {
  width: 90%;
  max-width: 350px;
  @media (min-width: tokens.$breakpoint-md) {
    max-width: 600px;
  }
}

.responsive-winter-img {
  width: 90%;
  max-width: 250px;
  @media (min-width: tokens.$breakpoint-md) {
    max-width: 425px;
  }
}

.responsive-spring-img {
  width: 90%;
  max-width: 250px;
  @media (min-width: tokens.$breakpoint-md) {
    max-width: 400px;
  }
}

.responsive-summer-img {
  width: 90%;
  max-width: 400px;
  @media (min-width: tokens.$breakpoint-md) {
    max-width: 550px;
  }
}
// ------------------------------
.desktop-fall-img {
  max-width: 200px;
  @media (min-width: tokens.$breakpoint-xl) {
    max-width: 250px;
  }
}

.desktop-winter-img {
  max-width: 150px;
  @media (min-width: tokens.$breakpoint-xl) {
    background-color: transparent;
  }
}

.desktop-spring-img {
  max-width: 150px;
  @media (min-width: tokens.$breakpoint-xl) {
    background-color: transparent;
  }
}

.desktop-summer-img {
  max-width: 200px;
  @media (min-width: tokens.$breakpoint-xl) {
    background-color: transparent;
  }
}

.fade-picture {
  opacity: 1;
  transition: opacity 0.4s ease;
}

.fade-picture.fading {
  opacity: 0;
}
</style>
