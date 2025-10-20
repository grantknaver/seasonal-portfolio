<script setup lang="ts">
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
import { useViewport } from '../shared/utils/viewWidth';
import { computed } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const isBelowLgBreakpoint = computed(() => useViewport().width.value < useViewport().lgBreakpoint);
</script>
<template>
  <!-- Mobile -->
  <div v-if="isResponsive" class="responsive-view full-width column"></div>

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
        class="case-studies-description text-bold text-center primary-font"
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
        class="primary-font"
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
    <q-card class="weather-theme q-pa-lg">
      <q-card-section class="weather-theme-header-section q-pt-lg q-pb-xl">
        <div class="q-mb-md font-primary">
          <q-chip color="accent" text-color="white" icon="palette"> Adaptive Theme </q-chip>
          <q-chip color="dark" text-color="white" icon="palette"> Synced Weather </q-chip>
        </div>
        <h2
          class="text-h2 q-mt-none q-mb-none font-bold secondary-font"
          :class="
            setSeasonClasses(
              {
                Fall: isBelowLgBreakpoint ? 'text-secondary' : 'text-secondary black-text-outline',
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
        <p class="q-mb-sm text-dark primary-font">
          Dynamic seasonal motion meets engineering precision.
        </p>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="row q-pt-none items-center">
        <div class="col-8">
          <h3 class="text-h3 q-mt-none q-mb-md secondary-font">Overview:</h3>
          <p class="primary-font q-mb-none">
            A custom GSAP + Vue 3 system that dynamically shifts backgrounds, colors, and animation
            sequences based on real-time weather or time-of-day conditions.
          </p>
        </div>

        <q-img
          class="weather-theme-img col-4"
          style="height: auto; max-width: 200px"
          src="../assets/weather-theme-system.png"
        ></q-img>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <h3 class="text-h3 q-mt-none q-mb-md secondary-font">Challenge:</h3>
        <p class="q-mb-sm primary-font">
          Most animation libraries break when Vue’s reactivity and lifecycle rebuilds occur
          (especially on resize or layout shift). Achieving
          <i>fluid, context-aware motion</i> without memory leaks or stale timelines required deep
          integration between GSAP context lifecycles and Vue composables.
        </p>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <h3 class="text-h3 q-mt-none q-mb-md secondary-font">Solution:</h3>
        <q-list class="q-mb-sm" bordered separator>
          <q-item clickable v-ripple>
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

          <q-item clickable v-ripple>
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

          <q-item clickable v-ripple>
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
        </q-list>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <h3 class="text-h3 q-mt-none q-mb-md secondary-font">Result:</h3>
        <p class="q-mb-sm primary-font">
          A smooth, immersive background system that transitions seamlessly between day/night or
          sunny/rainy states — now forming the core visual DNA of the portfolio.
        </p>
      </q-card-section>
      <q-card-section class="weather-theme-blockquote-section q-pa-md">
        <div class="row items-start">
          <blockquote class="weather-quote primary-font row text-dark q-pl-md">
            <p class="q-mb-md">
              "Built a dynamic Weather/Theme System with layered parallax and ambient effects,
              driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness
              across devices."
            </p>
          </blockquote>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<style scoped lang="scss">
@import '../css/main.scss';
.responsive-view {
}

.desktop-view {
  .case-studies-description {
    font-size: 1.2rem;
  }

  .weather-theme {
    .weather-theme-header-section {
      h2 {
        font-size: 2.5rem;
      }

      p {
        font-size: 1.2rem;
        line-height: 1.5;
        font-family: $cursive-stack;
      }
    }

    .weather-theme-blockquote-section {
      background: var(--q-primary);
      border-radius: 6px;
      transition: transform 0.2s ease;
      font-size: 1.5rem;

      &:hover {
        transform: translateY(-0.5rem);
      }

      blockquote {
        position: relative;
        border-left: 3px solid var(--q-dark);
        font-size: 1.2rem;
        cursor: pointer;
        p {
          line-height: 1.5;
          font-family: $cursive-stack;
        }
      }
    }
  }
}
</style>
