<script setup lang="ts">
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
import { useViewport } from '../shared/utils/viewWidth';
import { computed } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import CaseStudy from './CaseStudy.vue';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const isBelowLgBreakpoint = computed(() => useViewport().width.value < useViewport().lgBreakpoint);

const studies = [
  {
    header: {
      text: ' GSAP Weather & Theme System',
      subHeader: 'Dynamic seasonal motion meets engineering precision.',
    },
    expansionTopics: [
      {
        icon: 'dashboard',
        label: 'Overview',
        text: 'A custom GSAP + Vue 3 system that dynamically shifts backgrounds, colors, and animation sequences based on real-time weather or time-of-day conditions.',
      },
      {
        icon: 'sports_mma',
        label: 'Challenge',
        text: 'Most animation libraries break when Vue’s reactivity and lifecycle rebuilds occur (especially on resize or layout shift). Achieving <i>fluid, context-aware motion</i> without memory leaks or stale timelines required deep integration between GSAP context lifecycles and Vue composables.',
      },
    ],
    listTopics: [
      {
        header: 'Solution:',
        list: [
          {
            icon: 'wb_sunny',
            text: 'Engineered a responsive GSAP orchestration system using context() and matchMedia() for adaptive breakpoints.',
          },
          {
            icon: 'animation',
            text: 'Automated animation rebuilds on viewport resize.',
          },
          {
            icon: 'layers',
            text: 'Layered parallax + ambient effects tied to weather and theme data.',
          },
        ],
        hasSeparator: true,
      },
    ],
    defaultTopics: [
      {
        header: 'Result:',
        text: 'Built a dynamic Weather/Theme System with layered parallax and ambient effects, driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness across devices.',
        hasSeparator: false,
      },
    ],
    blockquote:
      'Built a dynamic Weather/Theme System with layered parallax and ambient effects, driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness across devices.',
  },
];
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
    <span v-for="(study, index) in studies" :key="index">
      <CaseStudy
        :header="study.header"
        :expansionTopics="study.expansionTopics"
        :listTopics="study.listTopics"
        :defaultTopics="study.defaultTopics"
        :blockquote="study.blockquote"
      ></CaseStudy
    ></span>
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
        class="primary-font text-body-2 text-center"
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
    <span v-for="(study, index) in studies" :key="index">
      <CaseStudy
        :header="study.header"
        :expansionTopics="study.expansionTopics"
        :listTopics="study.listTopics"
        :defaultTopics="study.defaultTopics"
        :blockquote="study.blockquote"
      ></CaseStudy
    ></span>
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
