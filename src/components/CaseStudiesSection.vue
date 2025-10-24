<script setup lang="ts">
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
import { useViewport } from '../shared/utils/viewWidth';
import { computed, ref } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import CaseStudy from './CaseStudy.vue';
import { type CaseStudy as CS } from '../shared/types/caseStudy';
import { v4 as uuidv4 } from 'uuid';
import AIAssitant from './AIAssitant.vue';
import { Theme } from '../shared/constants/theme';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const isBelowLgBreakpoint = computed(() => useViewport().width.value < useViewport().lgBreakpoint);
const caseStudies = ref<CS[]>([
  {
    id: uuidv4(),
    name: 'weather-and-theme',
    label: 'Weather',
    header: {
      text: 'GSAP Weather & Theme System',
      subHeader: 'Dynamic seasonal motion meets engineering precision.',
      icon: 'motion_photos_on',
    },
    expansionTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'weather-and-theme-overview',
          icon: 'dashboard',
          label: 'Overview',
          text: 'A custom GSAP + Vue 3 system that dynamically shifts backgrounds, colors, and animation sequences based on real-time weather or time-of-day conditions.',
          hasSeparator: false,
        },
        {
          id: uuidv4(),
          name: 'weather-and-theme-challenge',
          icon: 'sports_mma',
          label: 'Challenge',
          text: 'Most animation libraries break when Vue’s reactivity and lifecycle rebuilds occur (especially on resize or layout shift). Ac',
          hasSeparator: false,
        },
      ],
      hasSeparator: true,
    },
    listTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'weather-and-theme-solution',
          header: 'Solution:',
          list: [
            {
              id: uuidv4(),
              icon: 'wb_sunny',
              text: 'Engineered a responsive GSAP orchestration system using context() and matchMedia() for adaptive breakpoints.',
            },
            {
              id: uuidv4(),
              icon: 'animation',
              text: 'Automated animation rebuilds on viewport resize.',
            },
            {
              id: uuidv4(),
              icon: 'layers',
              text: 'Layered parallax + ambient effects tied to weather and theme data.',
            },
          ],
          hasSeparator: true,
        },
      ],
      hasSeparator: true,
    },
    defaultTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'weather-and-theme-solution',
          header: 'Result:',
          text: 'Built a dynamic Weather/Theme System with layered parallax and ambient effects, driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness across devices.',
          hasSeparator: false,
          // Loom video
        },
      ],
      hasSeparator: false,
    },
    blockquote:
      'Built a dynamic Weather/Theme System with layered parallax and ambient effects, driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness across devices.',
  },
  {
    id: uuidv4(),
    name: 'ai-chat',
    label: 'AI Chat',
    header: {
      text: 'AI Chat Interface',
      subHeader: 'Conversational intelligence with motion clarity.',
      icon: 'psychology_alt',
    },
    expansionTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'ai-chat-overview',
          icon: 'dashboard',
          label: 'Overview:',
          text: 'AI interfaces often feel sterile — fast responses but no sense of pacing, emotion, or engagement. The goal was to build a frontend that feels human through subtle motion cues.',
          hasSeparator: false,
        },
        {
          id: uuidv4(),
          name: 'ai-chat-challenge',
          icon: 'sports_mma',
          label: 'Challenge:',
          text: 'Most animation libraries break when Vue’s reactivity and lifecycle rebuilds occur (especially on resize or layout shift). Achieving <i>fluid, context-aware motion</i> without memory leaks or stale timelines required deep integration between GSAP context lifecycles and Vue composables.',
          hasSeparator: false,
        },
      ],
      hasSeparator: true,
    },
    listTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'ai-chat-solution',
          header: 'Solution:',
          list: [
            {
              id: uuidv4(),
              icon: 'light_mode',
              text: 'Designed a GSAP timeline for message reveal, typing, and bounce effects.',
            },
            {
              id: uuidv4(),
              icon: 'smart_toy',
              text: 'Integrated securely with an AI backend (OpenAI API + server proxy).',
            },
            {
              id: uuidv4(),
              icon: 'layers',
              text: 'Responsive and keyboard-optimized layout with light/dark modes.',
            },
          ],
          hasSeparator: true,
        },
      ],
      hasSeparator: true,
    },
    defaultTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'ai-chat-result',
          header: 'Result:',
          text: 'This AI chat interface evolves with time and mood. Its visual theme follows a timed seasonal cycle — shifting color palette to mirror nature’s rhythm. Each transition brings a subtle change in background hues, accent tones.',
          hasSeparator: false,
        },
      ],
      hasSeparator: false,
    },
    blockquote: '',
  },
  {
    id: uuidv4(),
    name: 'waveform',
    label: 'Waveform',
    header: {
      text: 'StorytAIm Waveform Visualizer',
      subHeader: 'Turning AI narration into living motion.',
      icon: 'timeline',
    },
    expansionTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'waveform-overview',
          icon: 'dashboard',
          label: 'Overview:',
          text: 'A waveform visualizer built for the StorytAIm project — animating live audio output from AI narration.',
          hasSeparator: false,
        },
        {
          id: uuidv4(),
          name: 'waveform-challenge',
          icon: 'sports_mma',
          label: 'Challenge:',
          text: 'Voice synthesis creates continuous audio streams, but standard waveform tools are static or laggy. The task was to create a real-time visualization that reacts perfectly in sync with generated speech.',
          hasSeparator: false,
        },
      ],
      hasSeparator: true,
    },
    listTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'waveform-solution',
          header: 'Solution:',
          list: [
            {
              id: uuidv4(),
              icon: 'graphic_eq',
              text: 'Implemented GSAP-driven bar animations synced to audio amplitude data.',
            },
            {
              id: uuidv4(),
              icon: 'animation',
              text: 'Designed scalable SVG components for smooth motion on all breakpoints.',
            },
            {
              id: uuidv4(),
              icon: 'palette',
              text: 'Added color theming per character or emotion tag (for StorytAIm use case).',
            },
          ],
          hasSeparator: true,
        },
      ],
      hasSeparator: true,
    },
    defaultTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'waveform-result',
          header: 'Result:',
          text: 'A dynamic, emotionally resonant audio interface — bridging the technical and the artistic. Demonstrates mastery of timing, motion, and audio-driven state updates.',
          hasSeparator: true,
        },
      ],
      hasSeparator: false,
    },
    blockquote: '',
  },
  {
    id: uuidv4(),
    name: 'proof',
    label: 'Proof',
    header: {
      text: 'What These Projects Prove',
      subHeader:
        'Each of these builds highlights one core idea: interactivity as emotion. They aren’t just technically solid — they’re experiences that invite curiosity and delight.',
      icon: 'emoji_events',
    },
    listTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'proof-evidence',
          header: 'Together, they show:',
          list: [
            {
              icon: 'sync_problem',
              text: 'Advanced GSAP–Vue lifecycle mastery',
              id: uuidv4(),
            },
            {
              icon: 'smart_toy',
              text: 'Real AI integrations in production-ready UIs',
              id: uuidv4(),
            },
            {
              icon: 'timeline',
              text: 'Responsive, data-driven motion systems',
              id: uuidv4(),
            },
            {
              icon: 'auto_awesome',
              text: 'Design and engineering unified through storytelling',
              id: uuidv4(),
            },
          ],
          hasSeparator: true,
        },
      ],
      hasSeparator: true,
    },
    defaultTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'proof-result',
          header: 'Result:',
          text: 'A dynamic, emotionally resonant audio interface — bridging the technical and the artistic. Demonstrates mastery of timing, motion, and audio-driven state updates.',
          hasSeparator: true,
        },
      ],
      hasSeparator: false,
    },
    blockquote: '',
  },
]);
const tab = ref('weather-and-theme');

const backgroundUrl = computed(() => {
  if (activeTheme.value === Theme.Fall) {
    return new URL('../assets/ai-bcg-fall.png', import.meta.url).href;
  } else if (activeTheme.value === Theme.Winter) {
    return new URL('../assets/ai-bcg-winter.png', import.meta.url).href;
  } else if (activeTheme.value === Theme.Spring) {
    return new URL('../assets/ai-bcg-spring.png', import.meta.url).href;
  } else if (activeTheme.value === Theme.Summer) {
    return new URL('../assets/ai-bcg-summer.png', import.meta.url).href;
  } else {
    // fallback image
    return new URL('../assets/ai-bcg-winter.png', import.meta.url).href;
  }
});
</script>
<template>
  <!-- Mobile -->
  <div v-if="isResponsive" class="responsive-view full-width column">
    <q-card
      class="first-card full-width q-mb-sm q-pa-md bg-accent"
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
        Case caseStudies
      </h1>
      <q-separator color="dark" class="q-mb-md" />
      <p
        class="case-caseStudies-description text-bold text-body-1 text-center primary-font"
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
    <q-list class="q-ml-sm q-mr-sm">
      <template v-for="(study, index) in caseStudies" :key="study.id">
        <CaseStudy
          class="full-width"
          :class="{
            'q-mb-sm': index + 1 == caseStudies.length,
          }"
          :header="study.header"
          :expansionTopics="study.expansionTopics"
          :listTopics="study.listTopics"
          :defaultTopics="study.defaultTopics"
          :blockquote="study.blockquote"
        >
          <template #ai-chat-result>
            <div class="q-mb-lg row justify-center full-width">
              <AIAssitant />
            </div>

            <div
              class="ai-chat-container q-pt-md q-pl-md q-pb-none q-pr-md full-width"
              :style="{
                backgroundImage: `url(${backgroundUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }"
            >
              <p class="description first-description q-mt-none q-mb-md q-pa-md text-dark bg-white">
                The <b>AI’s conversational tone</b> AI’s conversational tone is dynamically
                randomized within those seasons. One response might echo the calm focus of winter,
                another the optimism of spring, or the playfulness of summer.
              </p>

              <q-separator />

              <div class="q-mt-md column justify-center full-width">
                <p class="description q-pa-md text-dark text-body-2 bg-white">
                  The pairing of timed visual rhythm and randomized personality creates a system
                  that feels organic — structured, yet spontaneous.
                </p>

                <i class="quote text-body-1 text-accent q-pa-md bg-white text-center">
                  "By blending predictable visual cycles with unpredictable tone shifts, the
                  experience becomes quietly human: familiar in pattern, but never identical."
                </i>

                <p class="description q-mt-md bg-white q-pa-md">
                  The result blurs the line between UI design and emotional storytelling. Color
                  becomes context; timing becomes mood. Users don’t just read messages — they feel
                  the passing of digital seasons.
                </p>
              </div>
            </div>
          </template>
        </CaseStudy>

        <!-- Optional: visual separation between CaseStudy blocks -->
        <q-separator v-if="index < caseStudies.length - 1" />
      </template>
      <q-separator class="full-width bg-primary"></q-separator>
    </q-list>
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
        Case caseStudies
      </h1>
      <p
        class="case-caseStudies-description text-body-1 text-bold text-center primary-font"
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
    <q-tabs
      v-model="tab"
      align="justify"
      dense
      class="bg-primary text-dark q-pa-sm rounded-borders q-mb-md"
      active-color="dark"
      indicator-color="accent"
    >
      <q-tab
        v-for="study in caseStudies"
        :key="study.id"
        :name="study.name"
        :label="study.label"
        class="text-weight-medium"
      />
    </q-tabs>

    <q-tab-panels v-model="tab" animated transition-prev="fade" transition-next="fade" keep-alive>
      <q-tab-panel
        v-for="study in caseStudies"
        :key="study.id"
        :name="study.name"
        class="no-scroll"
      >
        <CaseStudy
          :header="study.header"
          :expansionTopics="study.expansionTopics"
          :listTopics="study.listTopics"
          :defaultTopics="study.defaultTopics"
          :blockquote="study.blockquote"
        >
          <template #ai-chat-result>
            <div
              class="ai-chat-container q-pt-md q-pl-md q-pb-none q-pr-md"
              :style="{
                backgroundImage: `url(${backgroundUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }"
            >
              <p class="description first-description q-mt-none q-mb-md q-pa-md text-dark bg-white">
                The <b>AI’s conversational tone</b> AI’s conversational tone is dynamically
                randomized within those seasons. One response might echo the calm focus of winter,
                another the optimism of spring, or the playfulness of summer.
              </p>
              <div class="q-mb-lg row justify-center ful-width"><AIAssitant /></div>
              <q-separator></q-separator>
              <div class="q-mt-md column justify-center full-width">
                <p class="description q-pa-md text-dark text-body-2 bg-white">
                  The pairing of timed visual rhythm and randomized personality creates a system
                  that feels organic — structured, yet spontaneous.
                </p>
                <i class="quote text-body-1 text-accent q-pa-md bg-white text-center"
                  >"By blending predictable visual cycles with unpredictable tone shifts, the
                  experience becomes quietly human: familiar in pattern, but never identical.""</i
                >
                <p class="description q-mt-md bg-white q-pa-md bg-white">
                  The result blurs the line between UI design and emotional storytelling. Color
                  becomes context; timing becomes mood. Users don’t just read messages — they feel
                  the passing of digital seasons.
                </p>
              </div>
            </div>
          </template>
        </CaseStudy>
      </q-tab-panel>
    </q-tab-panels>
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

  .ai-chat-container {
    height: 900px;
    border-radius: 10px;
    border-top: solid 2px var(--q-dark);
    padding-left: 0;
    padding-right: 0;

    .first-description {
      font-size: 1.2rem;
    }
    .description {
      border-radius: 10px;
      font-size: 1.2rem;
      margin-left: 1rem;
      margin-right: 1rem;
    }
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

  .ai-chat-container {
    height: 800px;
    border-radius: 10px;
    overflow: scroll;
    border-top: solid 2px var(--q-dark);

    .first-description {
      font-size: 1.2rem;
    }
    .description {
      border-radius: 10px;
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
