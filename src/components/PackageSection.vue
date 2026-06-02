<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { debounce } from 'quasar';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import { mdiCheckboxBlankCircle } from '@quasar/extras/mdi-v7';

import { useMainStore } from '../stores/main';
import { Package } from '../shared/constants/packages';
import { Theme } from 'src/shared/constants/theme';
import { TopicName } from 'src/shared/constants/topicName';
import { type PackageDetails } from '../shared/types/packageDetails';
import { type ThemePackageImages } from 'src/shared/types/themePackageImages';
import type { PackageType } from 'src/shared/types/packageType';
import { useViewport } from '../shared/utils/viewWidth';

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

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const emit = defineEmits(['requestConsultation']);

const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

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

const setActiveAssets = (newTheme: Theme) => {
  const activeThemePackageImages = getPackageImages(newTheme);
  const theme = newTheme.toLowerCase();

  packages.value = packages.value.map((p) => {
    const name = p.name.toLowerCase().replace(' ', '').replace('package', '') as PackageType;
    const img = activeThemePackageImages[name];

    return {
      ...p,
      src: new URL(`../assets/${name}-${theme}.png`, import.meta.url).href,
      img,
    };
  });
};

const onResize = debounce(() => {
  setActiveAssets(activeTheme.value);
}, 500);

const toContact = (p: Package | null) => {
  emit('requestConsultation', p);
  mainStore.SET_PACKAGE_OF_INTEREST(p);
  mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);
};

const packageTier = (name: Package) => String(name).replace(' Package', '').toUpperCase();

const packageCta = (name: Package) => `Start with ${String(name).replace(' Package', '')}`;

onMounted(() => {
  setActiveAssets(activeTheme.value);
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

watch(activeTheme, (newTheme) => {
  setActiveAssets(newTheme);
});
</script>

<template>
  <section
    class="packageSection full-width column"
    :class="isResponsive ? 'responsive-view q-pa-md' : 'desktop-view q-pa-md'"
  >
    <div class="package-shell">
      <div class="package-header">
        <p class="text-caption kicker q-mt-none q-mb-sm">Focused implementation blocks</p>
        <h1 class="text-h1 q-mt-none q-mb-md">Packages</h1>
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
          :class="{ 'is-recommended': p.name === Package.GrowthPackage }"
        >
          <div class="package-media-title">
            <div class="package-media-column">
              <div class="img-container column justify-center items-center">
                <picture
                  :class="{
                    'responsive-fall-img': isResponsive && activeTheme === Theme.Fall,
                    'responsive-winter-img': isResponsive && activeTheme === Theme.Winter,
                    'responsive-spring-img': isResponsive && activeTheme === Theme.Spring,
                    'responsive-summer-img': isResponsive && activeTheme === Theme.Summer,
                    'desktop-fall-img': !isResponsive && activeTheme === Theme.Fall,
                    'desktop-winter-img': !isResponsive && activeTheme === Theme.Winter,
                    'desktop-spring-img': !isResponsive && activeTheme === Theme.Spring,
                    'desktop-summer-img': !isResponsive && activeTheme === Theme.Summer,
                  }"
                >
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

                <span v-if="p.name === Package.GrowthPackage" class="recommended-pill">
                  Recommended
                </span>
              </div>

              <p class="package-tagline text-body-2 q-mt-none q-mb-md">
                {{ p.tagline }}
              </p>
            </div>
          </div>

          <div class="package-highlights">
            <p class="package-feature-header text-body-2 q-mt-none q-mb-md">
              {{ p.featuresHeader }}
            </p>

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
            <q-btn
              @click="toContact(p?.name ?? null)"
              color="accent"
              class="package-cta full-width"
              size="lg"
              glossy
            >
              <span class="text-body-2">{{ packageCta(p.name) }}</span>
            </q-btn>
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
    display: grid;
    grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
    gap: 1.5rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
  border-radius: 0.85rem;
  background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);

  picture {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
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

.recommended-pill {
  align-self: flex-start;
  padding: 0.35rem 0.6rem;
  border: 1px solid color-mix(in srgb, var(--q-accent) 40%, transparent);
  border-radius: 999px;
  color: tokens.$champagne;
  font-size: 0.72rem;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  white-space: nowrap;
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

  .package-proof-grid,
  .package-card {
    grid-template-columns: 1fr;
  }

  .package-header {
    text-align: center;
  }

  .package-card {
    padding: 1rem;
  }

  .package-title-row {
    display: block;
    text-align: center;
  }

  .recommended-pill {
    display: inline-block;
    margin-top: 0.25rem;
  }
}

.desktop-view {
  overflow: visible;
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

.desktop-fall-img {
  width: 90%;
  max-width: 200px;

  @media (min-width: tokens.$breakpoint-xl) {
    max-width: 250px;
  }
}

.desktop-winter-img {
  width: 90%;
  max-width: 150px;
}

.desktop-spring-img {
  width: 90%;
  max-width: 150px;
}

.desktop-summer-img {
  width: 90%;
  max-width: 200px;
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
