<script setup lang="ts">
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
import { useViewport } from '../shared/utils/viewWidth';
import { computed } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { Theme } from 'src/shared/constants/theme';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const isBelowLgBreakpoint = computed(() => useViewport().width.value < useViewport().lgBreakpoint);

const cardBackgrounds = {
  [Theme.Fall]: new URL('../assets/case-study-fall-bcg.png', import.meta.url).href,
  [Theme.Winter]: new URL('../assets/case-study-winter-bcg.png', import.meta.url).href,
  [Theme.Spring]: new URL('../assets/case-study-spring-bcg.png', import.meta.url).href,
  [Theme.Summer]: new URL('../assets/case-study-summer-bcg.png', import.meta.url).href,
};
</script>
<template>
  <!-- Mobile -->
  <div v-if="isResponsive" class="responsive-view full-width column">
    <q-card
      class="first-card full-width q-mb-md q-pa-md bg-accent"
      :class="
        setSeasonClasses(
          {
            Fall: isBelowLgBreakpoint ? 'bg-primary ' : 'bg-transparent',
            Winter: isBelowLgBreakpoint ? 'bg-primary ' : 'bg-transparent',
            Spring: isBelowLgBreakpoint ? 'bg-primary ' : 'bg-transparent',
            Summer: isBelowLgBreakpoint ? 'bg-accent ' : 'bg-transparent',
          },
          activeTheme,
        )
      "
    >
      <h1
        class="text-h1 q-mt-none q-mb-md text-center secondary-font"
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
        Case Studies
      </h1>
      <q-separator color="dark" class="q-mb-md" />
      <p
        class="case-studies-description text-bold text-body-1 text-center primary-font"
        :class="
          setSeasonClasses(
            {
              Fall: isBelowLgBreakpoint
                ? 'text-white bg-dark q-pa-md'
                : 'text-secondary black-text-outline',
              Winter: isBelowLgBreakpoint
                ? 'text-white bg-dark q-pa-md'
                : 'text-secondary black-text-outline',
              Spring: isBelowLgBreakpoint
                ? 'text-white bg-dark q-pa-md'
                : 'text-secondary black-text-outline',
              Summer: isBelowLgBreakpoint
                ? 'text-white bg-dark q-pa-md'
                : 'text-secondary black-text-outline',
            },
            activeTheme,
          )
        "
      >
        Interactive, AI-driven, and beautifully engineered.
      </p>
      <p
        class="text-body-2 primary-font"
        :class="
          setSeasonClasses(
            {
              Fall: isBelowLgBreakpoint ? 'text-center text-primary' : 'text-primary',
              Winter: isBelowLgBreakpoint ? 'text-center text-primary' : 'text-primary',
              Spring: isBelowLgBreakpoint ? 'text-center text-primary' : 'text-primary',
              Summer: isBelowLgBreakpoint ? 'text-center text-primary' : 'text-white',
            },
            activeTheme,
          )
        "
      >
        Whether you need one polished animation, a full motion + AI upgrade, or a launch-ready
        experience, I’ve got you covered. These packages make it simple to get started — clear
        scope, fair pricing, and fast turnaround.
      </p>
    </q-card>
    <q-card
      class="weather-theme weather-theme-border"
      :style="{ backgroundImage: `url(${cardBackgrounds[activeTheme]})` }"
    >
      <q-card-section class="weather-theme-header-section">
        <div class="full-width bg-white q-mb-none no-border rounded-borders">
          <h2
            class="text-h2 q-mt-sm full-width q-mb-none font-bold secondary-font"
            :class="
              setSeasonClasses(
                {
                  Fall: isBelowLgBreakpoint
                    ? 'text-secondary black-text-outline'
                    : 'text-secondary black-text-outline',
                  Winter: isBelowLgBreakpoint
                    ? 'text-secondary black-text-outline'
                    : 'text-secondary black-text-outline',
                  Spring: isBelowLgBreakpoint
                    ? 'text-secondary black-text-outline'
                    : 'text-secondary black-text-outline',
                  Summer: isBelowLgBreakpoint
                    ? 'text-secondary black-text-outline'
                    : 'text-secondary black-text-outline',
                },
                activeTheme,
              )
            "
          >
            GSAP Weather & Theme System
          </h2>
          <p class="q-mb-lg text-body-1 text-accent primary-font bg-transparent">
            Dynamic seasonal motion meets engineering precision.
          </p>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-intersection transition="slide-up" transition-duration="500" once>
        <q-card-section class="row q-pt-none items-center">
          <div class="full-width">
            <q-expansion-item
              class="shadow-1 overflow-hidden q-mt-md q-mb-md"
              style="border-radius: 5px"
              icon="explore"
              label="Overview"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card class="bg-white">
                <q-card-section>
                  <p class="text-body-1 text-dark primary-font q-mb-none">
                    A custom GSAP + Vue 3 system that dynamically shifts backgrounds, colors, and
                    animation sequences based on real-time weather or time-of-day conditions.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-expansion-item
              class="shadow-1 overflow-hidden"
              style="border-radius: 5px"
              icon="explore"
              label="Challenge"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card class="bg-white">
                <q-card-section>
                  <p class="text-body-1 text-dark q-mb-sm primary-font">
                    Most animation libraries break when Vue’s reactivity and lifecycle rebuilds
                    occur (especially on resize or layout shift). Achieving
                    <i>fluid, context-aware motion</i> without memory leaks or stale timelines
                    required deep integration between GSAP context lifecycles and Vue composables.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-card-section>
      </q-intersection>

      <q-separator></q-separator>
      <q-intersection transition="slide-up" transition-duration="500" once>
        <q-card-section>
          <h3 class="text-h3 q-mt-none q-mb-md secondary-font">Solution:</h3>
          <q-list class="q-mb-sm bg-primary" bordered separator>
            <q-item v-ripple>
              <q-item-section avatar>
                <q-icon
                  :color="
                    setSeasonClasses(
                      {
                        Fall: isBelowLgBreakpoint ? 'accent' : 'accent',
                        Winter: isBelowLgBreakpoint ? 'accent' : 'accent',
                        Spring: isBelowLgBreakpoint ? 'accent' : 'accent',
                        Summer: isBelowLgBreakpoint ? 'accent' : 'accent',
                      },
                      activeTheme,
                    )
                  "
                  name="wb_sunny"
                />
              </q-item-section>
              <q-item-section class="text-body-2 primary-font"
                >Engineered a responsive GSAP orchestration system using context() and matchMedia()
                for adaptive breakpoints.</q-item-section
              >
            </q-item>

            <q-item v-ripple>
              <q-item-section avatar>
                <q-icon
                  :color="
                    setSeasonClasses(
                      {
                        Fall: isBelowLgBreakpoint ? 'accent' : 'accent',
                        Winter: isBelowLgBreakpoint ? 'accent' : 'accent',
                        Spring: isBelowLgBreakpoint ? 'accent' : 'accent',
                        Summer: isBelowLgBreakpoint ? 'accent' : 'accent',
                      },
                      activeTheme,
                    )
                  "
                  name="animation"
                />
              </q-item-section>
              <q-item-section class="text-body-2 primary-font">
                Automated animation rebuilds on viewport resize.
              </q-item-section>
            </q-item>

            <q-item v-ripple>
              <q-item-section avatar>
                <q-icon
                  :color="
                    setSeasonClasses(
                      {
                        Fall: isBelowLgBreakpoint ? 'accent' : 'accent',
                        Winter: isBelowLgBreakpoint ? 'accent' : 'accent',
                        Spring: isBelowLgBreakpoint ? 'accent' : 'accent',
                        Summer: isBelowLgBreakpoint ? 'accent' : 'accent',
                      },
                      activeTheme,
                    )
                  "
                  name="layers"
                />
              </q-item-section>
              <q-item-section class="text-body-2 primary-font">
                Layered parallax + ambient effects tied to weather and theme data.
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-intersection>

      <q-separator></q-separator>
      <q-card-section>
        <h3 class="text-h3 q-mt-none q-mb-md secondary-font">Result:</h3>
        <p class="text-body-2 q-mb-sm primary-font">
          A smooth, immersive background system that transitions seamlessly between day/night or
          sunny/rainy states — now forming the core visual DNA of the portfolio.
        </p>
      </q-card-section>
      <q-intersection transition="scale" transition-duration="500" once>
        <q-card-section class="weather-theme-blockquote-section bg-primary q-pa-md">
          <div class="row items-start">
            <blockquote class="primary-font row text-dark q-pl-md">
              <q-intersection transition="scale" transition-duration="1250" once>
                <p class="text-body-1 q-mb-md">
                  "Built a dynamic Weather/Theme System with layered parallax and ambient effects,
                  driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness
                  across devices."
                </p>
              </q-intersection>
            </blockquote>
          </div>
        </q-card-section>
      </q-intersection>
    </q-card>
  </div>

  <!-- Desktop -->
  <div v-if="!isResponsive" class="desktop-view full-width column">
    <div
      class="full-width q-pa-md"
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
        class="text-h1 q-mt-none q-mb-md text-center secondary-font"
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
        Case Studies
      </h1>
      <p
        class="case-studies-description text-body-1 text-bold text-center primary-font"
        :class="
          setSeasonClasses(
            {
              Fall: isBelowLgBreakpoint
                ? 'bg-dark text-secondary'
                : 'text-secondary black-text-outline',
              Winter: isBelowLgBreakpoint
                ? 'bg-dark text-secondary'
                : 'text-secondary black-text-outline',
              Spring: isBelowLgBreakpoint
                ? 'bg-dark text-secondary'
                : 'text-secondary black-text-outline',
              Summer: isBelowLgBreakpoint
                ? 'bg-dark text-secondary'
                : 'text-secondary black-text-outline',
            },
            activeTheme,
          )
        "
      >
        Interactive, AI-driven, and beautifully engineered.
      </p>

      <p
        class="primary-font text-body-1 text-center"
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
    <q-card
      class="weather-theme weather-theme-border q-pa-lg"
      :style="{ backgroundImage: `url(${cardBackgrounds[activeTheme]})` }"
    >
      <q-card-section class="weather-theme-header-section">
        <h2
          class="text-h2 q-mt-none q-mb-none font-bold secondary-font"
          :class="
            setSeasonClasses(
              {
                Fall: isBelowLgBreakpoint
                  ? 'bg-accent text-secondary'
                  : 'text-secondary black-text-outline',
                Winter: isBelowLgBreakpoint ? 'bg-primary ' : 'text-secondary black-text-outline',
                Spring: isBelowLgBreakpoint ? 'bg-primary ' : 'text-secondary black-text-outline',
                Summer: isBelowLgBreakpoint ? 'bg-white ' : 'text-secondary black-text-outline',
              },
              activeTheme,
            )
          "
        >
          GSAP Weather & Theme System
        </h2>
        <p class="text-body-1 q-mb-lg text-dark primary-font">
          Dynamic seasonal motion meets engineering precision.
        </p>
      </q-card-section>
      <q-separator></q-separator>
      <q-intersection transition="slide-up" transition-duration="500" :once="true">
        <q-card-section class="row q-pt-none items-center">
          <div class="full-width">
            <q-expansion-item
              class="shadow-1 overflow-hidden q-mt-md q-mb-md indent-expansion-item"
              style="border-radius: 5px"
              icon="dashboard"
              label="Overview"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card class="bg-white">
                <q-card-section>
                  <p class="text-body-2 text-dark primary-font q-mb-none">
                    A custom GSAP + Vue 3 system that dynamically shifts backgrounds, colors, and
                    animation sequences based on real-time weather or time-of-day conditions.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-expansion-item
              class="shadow-1 overflow-hidden indent-expansion-item"
              style="border-radius: 5px"
              icon="sports_mma"
              label="Challenge"
              header-class="bg-primary text-white"
              expand-icon-class="text-white"
            >
              <q-card class="bg-white">
                <q-card-section>
                  <p class="text-body-2 text-dark q-mb-sm primary-font">
                    Most animation libraries break when Vue’s reactivity and lifecycle rebuilds
                    occur (especially on resize or layout shift). Achieving
                    <i>fluid, context-aware motion</i> without memory leaks or stale timelines
                    required deep integration between GSAP context lifecycles and Vue composables.
                  </p>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-card-section></q-intersection
      >
      <q-separator></q-separator>
      <q-card-section>
        <h3 class="text-h3 q-mt-none q-mb-md secondary-font">Solution:</h3>
        <q-intersection transition="slide-up" transition-duration="1000" once>
          <q-list class="q-mb-sm bg-primary" bordered separator>
            <q-item v-ripple>
              <q-item-section avatar>
                <q-icon
                  :color="
                    setSeasonClasses(
                      {
                        Fall: isBelowLgBreakpoint ? 'secondary' : 'accent',
                        Winter: isBelowLgBreakpoint ? 'secondary' : 'accent',
                        Spring: isBelowLgBreakpoint ? 'secondary' : 'accent',
                        Summer: isBelowLgBreakpoint ? 'secondary' : 'accent',
                      },
                      activeTheme,
                    )
                  "
                  name="wb_sunny"
                />
              </q-item-section>
              <q-item-section class="text-body-2 primary-font"
                >Engineered a responsive GSAP orchestration system using context() and matchMedia()
                for adaptive breakpoints.</q-item-section
              >
            </q-item>

            <q-item v-ripple>
              <q-item-section avatar>
                <q-icon
                  :color="
                    setSeasonClasses(
                      {
                        Fall: isBelowLgBreakpoint ? 'secondary' : 'accent',
                        Winter: isBelowLgBreakpoint ? 'secondary' : 'accent',
                        Spring: isBelowLgBreakpoint ? 'secondary' : 'accent',
                        Summer: isBelowLgBreakpoint ? 'secondary' : 'accent',
                      },
                      activeTheme,
                    )
                  "
                  name="animation"
                />
              </q-item-section>
              <q-item-section class="text-body-2 primary-font">
                Automated animation rebuilds on viewport resize.
              </q-item-section>
            </q-item>

            <q-item v-ripple>
              <q-item-section avatar>
                <q-icon
                  :color="
                    setSeasonClasses(
                      {
                        Fall: isBelowLgBreakpoint ? 'secondary' : 'accent',
                        Winter: isBelowLgBreakpoint ? 'secondary' : 'accent',
                        Spring: isBelowLgBreakpoint ? 'secondary' : 'accent',
                        Summer: isBelowLgBreakpoint ? 'secondary' : 'accent',
                      },
                      activeTheme,
                    )
                  "
                  name="layers"
                />
              </q-item-section>
              <q-item-section class="text-body-2 primary-font">
                Layered parallax + ambient effects tied to weather and theme data.
              </q-item-section>
            </q-item>
          </q-list></q-intersection
        >
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <h3 class="text-h3 q-mt-none q-mb-md secondary-font">Result:</h3>
        <p class="text-body-2 q-mb-sm primary-font">
          A smooth, immersive background system that transitions seamlessly between day/night or
          sunny/rainy states — now forming the core visual DNA of the portfolio.
        </p>
      </q-card-section>

      <q-card-section class="weather-theme-blockquote-section q-pa-md">
        <q-intersection transition="scale" transition-duration="1250">
          <div class="row items-start">
            <blockquote class="text-body-1 primary-font row text-dark q-pl-md">
              <p class="q-mb-md">
                "Built a dynamic Weather/Theme System with layered parallax and ambient effects,
                driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness
                across devices."
              </p>
            </blockquote>
          </div></q-intersection
        >
      </q-card-section>
    </q-card>
  </div>
</template>
<style scoped lang="scss">
@import '../css/main.scss';
.responsive-view {
  .first-card {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .weather-theme {
    .weather-theme-blockquote-section {
      background: var(--q-primary);
      border-radius: 6px;
      transition: transform 0.2s ease;

      blockquote {
        position: relative;
        border-left: 3px solid var(--q-dark);
        cursor: pointer;

        p {
          line-height: 1.5;
        }
      }
    }
  }

  .weather-theme-border {
    border: solid 1rem var(--q-secondary);
  }
}

.desktop-view {
  .weather-theme-border {
    border: solid 1rem var(--q-secondary);
  }

  .weather-theme {
    .weather-theme-header-section {
      p {
        line-height: 1.5;
        font-family: $cursive-stack;
        background-color: transparent;
      }
    }

    .weather-theme-blockquote-section {
      background: var(--q-primary);
      border-radius: 6px;
      transition: transform 0.2s ease;
      box-shadow: 5px 5px 10px var(--q-dark);

      blockquote {
        position: relative;
        cursor: pointer;

        p {
          line-height: 1.5;
          font-family: $cursive-stack;
        }
      }
    }
  }
}

.q-item {
  border-bottom: solid 1px var(--q-secondary);
}

/* Smooth slide-right on hover/focus; returns on blur */
.indent-expansion-item {
  transform: translateX(0);
  transition: transform 160ms ease; /* tweak speed here */
  will-change: transform;
}

/* Mouse + keyboard */
.indent-expansion-item:hover,
.indent-expansion-item:focus-visible {
  transform: translateX(0.5rem); /* tweak distance here */
}

/* Optional: tiny nudge while pressed/clicked */
.indent-expansion-item:active {
  transform: translateX(0.65rem);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .indent-expansion-item {
    transition: none;
    transform: none;
  }
}
</style>
