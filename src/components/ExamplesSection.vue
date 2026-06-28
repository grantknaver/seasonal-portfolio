<script setup lang="ts">
import { useViewport } from '../shared/utils/viewWidth';
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { type CaseStudy as CS } from '../shared/types/caseStudy';
import { v4 as uuidv4 } from 'uuid';
import { Theme } from '../shared/constants/theme';
import { CaseStudies } from 'src/shared/constants/caseStudies';
import {
  mdiMotionPlay,
  mdiViewDashboard,
  mdiBoxingGlove,
  mdiWeatherSunny,
  mdiAnimation,
  mdiLayers,
  mdiBrain,
  mdiWhiteBalanceSunny,
  mdiRobotOutline,
  mdiTimeline,
  mdiChartAreaspline,
  mdiPalette,
  mdiTrophy,
  mdiSyncAlert,
  mdiAutoFix,
} from '@quasar/extras/mdi-v7';
import { TopicName } from 'src/shared/constants/topicName';

const CaseStudy = defineAsyncComponent(() => import('../components/CaseStudy.vue'));
const AIAssitant = defineAsyncComponent(() => import('../components/AIAssitant.vue'));
const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

const caseStudies = ref<CS[]>([
  {
    id: uuidv4(),
    name: CaseStudies.WeatherAndTheme,
    label: 'Weather',
    header: {
      text: 'GSAP Weather & Theme System',
      subHeader: 'Dynamic seasonal motion meets engineering precision.',
      icon: mdiMotionPlay,
    },
    expansionTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'weather-and-theme-overview',
          icon: mdiViewDashboard,
          label: 'Overview',
          text: 'A custom GSAP + Vue 3 system that dynamically shifts backgrounds, colors, and animation sequences based on real-time weather or time-of-day conditions.',
          hasSeparator: false,
        },
        {
          id: uuidv4(),
          name: 'weather-and-theme-challenge',
          icon: mdiBoxingGlove,
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
              icon: mdiWeatherSunny,
              text: 'Engineered a responsive GSAP orchestration system using context() and matchMedia() for adaptive breakpoints.',
            },
            {
              id: uuidv4(),
              icon: mdiAnimation,
              text: 'Automated animation rebuilds on viewport resize.',
            },
            {
              id: uuidv4(),
              icon: mdiLayers,
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
        },
      ],
      hasSeparator: false,
    },
    blockquote:
      'Built a dynamic Weather/Theme System with layered parallax and ambient effects, driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness across devices.',
  },
  {
    id: uuidv4(),
    name: CaseStudies.AiChat,
    label: 'AI Chat',
    header: {
      text: 'AI Chat Interface',
      subHeader: 'Conversational intelligence with motion clarity.',
      icon: mdiBrain,
    },
    expansionTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'ai-chat-overview',
          icon: mdiViewDashboard,
          label: 'Overview:',
          text: 'AI interfaces often feel sterile — fast responses but no sense of pacing, emotion, or engagement. The goal was to build a frontend that feels human through subtle motion cues.',
          hasSeparator: false,
        },
        {
          id: uuidv4(),
          name: 'ai-chat-challenge',
          icon: mdiBoxingGlove,
          label: 'Challenge:',
          text: 'Most animation libraries break when Vue’s reactivity and lifecycle rebuilds occur (especially on resize or layout shift). Achieving fluid, context-aware motion without memory leaks or stale timelines required deep integration between GSAP context lifecycles and Vue composables.',
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
              icon: mdiWhiteBalanceSunny,
              text: 'Designed a GSAP timeline for message reveal, typing, and bounce effects.',
            },
            {
              id: uuidv4(),
              icon: mdiRobotOutline,
              text: 'Integrated securely with an AI backend (OpenAI API + server proxy).',
            },
            {
              id: uuidv4(),
              icon: mdiLayers,
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
    name: CaseStudies.Waveform,
    label: 'Waveform',
    header: {
      text: 'StorytAIm Waveform Visualizer',
      subHeader: 'Turning AI narration into living motion.',
      icon: mdiTimeline,
    },
    expansionTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'waveform-overview',
          icon: mdiViewDashboard,
          label: 'Overview:',
          text: 'A waveform visualizer built for the StorytAIm project — animating live audio output from AI narration.',
          hasSeparator: false,
        },
        {
          id: uuidv4(),
          name: 'waveform-challenge',
          icon: mdiBoxingGlove,
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
              icon: mdiChartAreaspline,
              text: 'Implemented GSAP-driven bar animations synced to audio amplitude data.',
            },
            {
              id: uuidv4(),
              icon: mdiAnimation,
              text: 'Designed scalable SVG components for smooth motion on all breakpoints.',
            },
            {
              id: uuidv4(),
              icon: mdiPalette,
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
    name: CaseStudies.Proof,
    label: 'Proof',
    header: {
      text: 'What These Projects Prove',
      subHeader:
        'Each of these builds highlights one core idea: interactivity as emotion. They aren’t just technically solid — they’re experiences that invite curiosity and delight.',
      icon: mdiTrophy,
    },
    listTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'proof-evidence',
          header: 'Together, they show:',
          list: [
            {
              icon: mdiSyncAlert,
              text: 'Advanced GSAP–Vue lifecycle mastery',
              id: uuidv4(),
            },
            {
              icon: mdiRobotOutline,
              text: 'Real AI integrations in production-ready UIs',
              id: uuidv4(),
            },
            {
              icon: mdiTimeline,
              text: 'Responsive, data-driven motion systems',
              id: uuidv4(),
            },
            {
              icon: mdiAutoFix,
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

const tab = ref(CaseStudies.WeatherAndTheme);

watch(tab, (newTab) => {
  mainStore.SET_CASE_STUDY_ACTIVE_TAB(newTab);
});

const BG_BY_THEME: Record<Theme, string> = {
  [Theme.Fall]: new URL('../assets/ai-bcg-fall.avif', import.meta.url).href,
  [Theme.Winter]: new URL('../assets/ai-bcg-winter.avif', import.meta.url).href,
  [Theme.Spring]: new URL('../assets/ai-bcg-spring.avif', import.meta.url).href,
  [Theme.Summer]: new URL('../assets/ai-bcg-summer.avif', import.meta.url).href,
};
const emit = defineEmits(['toContact']);

const backgroundUrl = computed(() => BG_BY_THEME[activeTheme.value] ?? BG_BY_THEME[Theme.Winter]);

const toContact = () => {
  if (isResponsive.value) {
    emit('toContact');
  } else {
    mainStore.SET_ACTIVE_TOPIC(TopicName.Contact);
  }
};
</script>

<template>
  <!-- Mobile -->
  <section v-if="isResponsive" class="examplesSection responsive-view full-width column q-pa-md">
    <div class="case-section-card q-pa-lg q-mb-md">
      <p class="text-caption kicker q-mt-none q-mb-sm">Proof</p>
      <h1 class="text-h1 q-mt-none q-mb-md">Case Studies</h1>
      <p class="section-lead text-body-1 q-mt-none q-mb-sm">
        Interactive, AI-driven, and beautifully engineered.
      </p>
      <p class="section-copy text-body-2 q-ma-none">
        Focused builds that show how motion, AI interaction, and implementation polish reduce
        friction and improve user flow.
      </p>
    </div>

    <div class="case-study-stack">
      <template v-for="study in caseStudies" :key="study.id">
        <CaseStudy
          class="case-study-instance full-width"
          :header="study.header"
          :expansionTopics="study.expansionTopics"
          :listTopics="study.listTopics"
          :defaultTopics="study.defaultTopics"
          :blockquote="study.blockquote"
        >
          <template #ai-chat-result>
            <div class="q-mb-lg row justify-center full-width">
              <Suspense>
                <template #default>
                  <AIAssitant />
                </template>

                <template #fallback>
                  <q-skeleton type="QAvatar" height="400px" />
                </template>
              </Suspense>
            </div>

            <div
              class="ai-chat-container q-pt-md q-pl-md q-pb-none q-pr-md full-width"
              :style="{
                backgroundImage: `url(${backgroundUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }"
            >
              <p class="description first-description q-mt-none q-mb-md q-pa-md">
                The <b>AI’s conversational tone</b> is dynamically randomized within those seasons.
                One response might echo the calm focus of winter, another the optimism of spring, or
                the playfulness of summer.
              </p>

              <q-separator class="slot-separator" />

              <div class="q-mt-md column justify-center full-width">
                <p class="description q-pa-md text-body-2">
                  The pairing of timed visual rhythm and randomized personality creates a system
                  that feels organic, structured, yet spontaneous.
                </p>

                <i class="quote q-pa-md text-center">
                  "By blending predictable visual cycles with unpredictable tone shifts, the
                  experience becomes quietly human: familiar in pattern, but never identical."
                </i>

                <p class="description q-mt-md q-pa-md">
                  The result blurs the line between UI design and emotional storytelling. Color
                  becomes context; timing becomes mood. Users don’t just read messages, they feel
                  the passing of digital seasons.
                </p>
              </div>
            </div>
          </template>

          <template #waveform-result>
            <div class="narrator-container full-width row justify-center q-pa-md">
              <iframe
                id="inlineFrameExample"
                title="Inline Frame Example"
                class="narrator full-width"
                src="https://robot-narrator.pages.dev/"
              >
              </iframe>
            </div>
          </template>
        </CaseStudy>
      </template>
    </div>

    <q-btn
      @click="toContact"
      class="case-contact-btn q-mt-md full-width"
      color="accent"
      size="lg"
      glossy
    >
      <span class="text-body-2">Discuss a project</span>
    </q-btn>
  </section>

  <!-- Desktop -->
  <section v-if="!isResponsive" class="examplesSection desktop-view full-width column q-pa-md">
    <div class="case-section-card q-pa-xl q-mb-md">
      <p class="text-caption kicker q-mt-none q-mb-sm">Proof</p>
      <h1 class="text-h1 q-mt-none q-mb-md">Case Studies</h1>
      <p class="section-lead text-body-1 q-mt-none q-mb-sm">
        Interactive, AI-driven, and beautifully engineered.
      </p>
      <p class="section-copy text-body-2 q-ma-none">
        Focused builds that show how motion, AI interaction, and implementation polish reduce
        friction and improve user flow.
      </p>
    </div>

    <q-tabs
      v-model="tab"
      align="justify"
      dense
      class="case-tabs q-pa-sm q-mb-md"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab
        v-for="study in caseStudies"
        :key="study.id"
        :name="study.name"
        :label="study.label"
        class="case-tab text-body-2 text-weight-medium"
      />
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      animated
      transition-prev="fade"
      transition-next="fade"
      keep-alive
      class="case-panels bg-transparent"
    >
      <q-tab-panel
        v-for="study in caseStudies"
        :key="study.id"
        :name="study.name"
        class="case-panel no-scroll bg-transparent q-pa-none"
      >
        <CaseStudy
          class="case-study-instance full-width"
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
              <p class="description first-description q-mt-none q-mb-md q-pa-md">
                The <b>AI’s conversational tone</b> is dynamically randomized within those seasons.
                One response might echo the calm focus of winter, another the optimism of spring, or
                the playfulness of summer.
              </p>

              <div class="q-mb-lg row justify-center full-width"><AIAssitant /></div>

              <q-separator class="slot-separator" />

              <div class="q-mt-md column justify-center full-width">
                <p class="description q-pa-md text-body-2">
                  The pairing of timed visual rhythm and randomized personality creates a system
                  that feels organic, structured, yet spontaneous.
                </p>

                <i class="quote q-pa-md text-center">
                  "By blending predictable visual cycles with unpredictable tone shifts, the
                  experience becomes quietly human: familiar in pattern, but never identical."
                </i>

                <p class="description q-mt-md q-pa-md">
                  The result blurs the line between UI design and emotional storytelling. Color
                  becomes context; timing becomes mood. Users don’t just read messages, they feel
                  the passing of digital seasons.
                </p>
              </div>
            </div>
          </template>

          <template #waveform-result>
            <div class="narrator-container full-width">
              <iframe
                id="inlineFrameExample"
                title="Inline Frame Example"
                class="narrator full-width"
                src="https://robot-narrator.pages.dev/"
              >
              </iframe>
            </div>
          </template>
        </CaseStudy>
        <q-btn
          @click="toContact"
          class="case-contact-btn q-mt-md full-width"
          color="accent"
          size="lg"
          glossy
        >
          <span class="text-body-2">Discuss a project</span>
        </q-btn>
      </q-tab-panel>
    </q-tab-panels>
  </section>
</template>
<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

.examplesSection {
  content-visibility: auto;
  contain-intrinsic-size: 800px 1000px;
  color: tokens.$text;

  @media (min-width: tokens.$breakpoint-lg) {
    gap: 1rem;
  }
}

.case-section-card,
.case-tabs {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, tokens.$ink-soft 90%, tokens.$ivory 10%),
    tokens.$ink
  );
  border: 1px solid var(--q-accent);
  box-shadow:
    0 0 48px color-mix(in srgb, var(--q-accent) 26%, transparent),
    0 20px 64px color-mix(in srgb, tokens.$ink 88%, transparent);
}

.case-section-card {
  border-radius: 1rem;
  text-align: center;

  .kicker {
    color: tokens.$champagne;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
  }

  h1 {
    color: tokens.$text;
    font-weight: 400;
    line-height: 1.08;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .section-lead {
    color: tokens.$text;
    font-weight: 700;
  }

  .section-copy {
    color: tokens.$text-muted;
    max-width: 48rem;
    margin-inline: auto;
    line-height: 1.55;
  }
}

.case-tabs {
  border-radius: 0.85rem;
  color: tokens.$text-muted;
  overflow: hidden;
}

.case-tab {
  color: tokens.$text-muted;
  border-radius: 0.65rem;
}

.case-panels {
  background: transparent;
}

.case-panel {
  background: transparent;
}

.case-study-stack {
  display: grid;
  gap: 0.2rem;

  @media (min-width: tokens.$breakpoint-lg) {
    gap: 1rem;
  }
}

.case-contact-btn {
  border-radius: 0.75rem;
}

.ai-chat-container {
  border-radius: 0.85rem;
  overflow: auto;
  border: 1px solid color-mix(in srgb, var(--q-accent) 32%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent),
    0 16px 40px color-mix(in srgb, tokens.$ink 72%, transparent);
}

.ai-chat-container::before {
  content: '';
  display: block;
}

.description,
.quote {
  display: block;
  border-radius: 0.75rem;
  color: tokens.$text;
  background: color-mix(in srgb, tokens.$ink-soft 86%, tokens.$ivory 8%);
  border: 1px solid color-mix(in srgb, var(--q-accent) 24%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);
}

.description {
  line-height: 1.55;
}

.quote {
  color: tokens.$champagne;
  line-height: 1.6;
}

.slot-separator {
  background: color-mix(in srgb, var(--q-accent) 24%, transparent);
  opacity: 1;
}

.narrator-container {
  border-radius: 0.85rem;
  overflow: hidden;
  background: white;
  border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
  box-shadow: 0 16px 40px color-mix(in srgb, tokens.$ink 72%, transparent);
}

.responsive-view {
  .case-section-card {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;

    @media (min-width: tokens.$breakpoint-lg) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .ai-chat-container {
    padding-left: 0;
    padding-right: 0;

    .first-description {
      font-size: 1.1rem;
    }

    .description,
    .quote {
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }

  .narrator-container {
    height: 500px;
    min-height: 500px;
    background: transparent;

    .narrator {
      height: 100%;
      width: 90%;
      background-color: white;
    }
  }
}

.desktop-view {
  .case-section-card,
  .case-tabs,
  .case-panels {
    width: 100%;
  }

  .case-section-card {
    max-width: 960px;
    margin-inline: auto;
  }

  .ai-chat-container {
    height: 800px;

    .first-description {
      font-size: 1.1rem;
    }
  }

  .narrator-container {
    height: 500px;
    min-height: 500px;

    .narrator {
      height: 100%;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .case-tab,
  .case-contact-btn {
    transition: none;
  }
}
</style>
