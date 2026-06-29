<script setup lang="ts">
import { useViewport } from '../shared/utils/viewWidth';
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { type Example } from '../shared/types/example';
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
  mdiOpenInNew,
} from '@quasar/extras/mdi-v7';
import { TopicName } from 'src/shared/constants/topicName';
const ExampleProject = defineAsyncComponent(() => import('../components/ExampleProject.vue'));
const AIAssitant = defineAsyncComponent(() => import('../components/AIAssitant.vue'));
const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const HERO_MOTION_CODEPEN_URL = 'https://codepen.io/GrantKnaver/full/myOeOYe';
const examples = ref<Example[]>([
  {
    id: uuidv4(),
    name: CaseStudies.WeatherAndTheme,
    label: 'Hero Motion',
    header: {
      text: 'Animated Hero Experience',
      subHeader: 'GSAP sequencing, atmosphere, and CTA flow in a focused hero build.',
      icon: mdiMotionPlay,
    },
    expansionTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'hero-motion-overview',
          icon: mdiViewDashboard,
          label: 'Overview',
          text: 'A responsive hero example using GSAP timelines, layered atmosphere, theme-driven visuals, and CTA sequencing to make the first screen feel clear, polished, and action-ready.',
          hasSeparator: false,
        },
        {
          id: uuidv4(),
          name: 'hero-motion-challenge',
          icon: mdiBoxingGlove,
          label: 'Challenge',
          text: 'A hero section has to communicate quickly without feeling static or rushed. The challenge was balancing visible motion sequencing with immediate readability and a clear next step.',
          hasSeparator: false,
        },
      ],
      hasSeparator: true,
    },
    listTopics: {
      topics: [
        {
          id: uuidv4(),
          name: 'hero-motion-solution',
          header: 'Solution:',
          list: [
            {
              id: uuidv4(),
              icon: mdiMotionPlay,
              text: 'Designed a GSAP timeline for headline, supporting copy, CTA, and ambient motion.',
            },
            {
              id: uuidv4(),
              icon: mdiWeatherSunny,
              text: 'Built a layered visual atmosphere with theme-aware background and motion treatment.',
            },
            {
              id: uuidv4(),
              icon: mdiAnimation,
              text: 'Tuned the animation pacing so the sequence feels intentional without delaying action.',
            },
            {
              id: uuidv4(),
              icon: mdiLayers,
              text: 'Structured the hero as a reusable surface pattern for stronger first impressions.',
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
          name: 'hero-motion-result',
          header: 'Result:',
          text: 'A focused hero surface that shows how motion can clarify hierarchy, guide attention, and make a first impression feel more polished without hiding the next step.',
          hasSeparator: false,
        },
      ],
      hasSeparator: false,
    },
    blockquote:
      'A focused hero surface that uses GSAP motion, atmosphere, and CTA sequencing to make the first screen clearer, more polished, and easier to act on.',
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
          text: 'Most animation libraries break when Vue’s reactivity and lifecycle rebuilds occur, especially on resize or layout shift. Achieving fluid, context-aware motion without memory leaks or stale timelines required deep integration between GSAP context lifecycles and Vue composables.',
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
              text: 'Integrated securely with an AI backend using an API and server proxy.',
            },
            {
              id: uuidv4(),
              icon: mdiLayers,
              text: 'Built a responsive and keyboard-optimized layout with theme-aware visual states.',
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
          text: 'An AI chat interface that uses visual rhythm, motion cues, and theme shifts to make the interaction feel more legible, responsive, and alive.',
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
          text: 'A waveform visualizer built for the StorytAIm project, animating AI narration output so generated audio feels visible, active, and easier to understand.',
          hasSeparator: false,
        },
        {
          id: uuidv4(),
          name: 'waveform-challenge',
          icon: mdiBoxingGlove,
          label: 'Challenge:',
          text: 'Voice synthesis creates continuous audio streams, but standard waveform tools are often static or laggy. The task was to create a real-time visualization that reacts in sync with generated speech.',
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
              text: 'Designed scalable SVG components for smooth motion across breakpoints.',
            },
            {
              id: uuidv4(),
              icon: mdiPalette,
              text: 'Added color theming per character or emotion tag for the StorytAIm use case.',
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
          text: 'A dynamic audio interface that bridges AI narration and visible feedback, demonstrating timing, motion, and audio-driven state updates.',
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
      <p class="text-caption kicker q-mt-none q-mb-sm">Examples</p>
      <h1 class="text-h1 q-mt-none q-mb-md">Focused Builds</h1>
      <p class="section-lead text-body-1 q-mt-none q-mb-sm">
        Motion, AI interaction, and implementation examples you can inspect.
      </p>
      <p class="section-copy text-body-2 q-ma-none">
        These examples show how focused implementation can improve first impressions, interaction
        clarity, and AI legibility. If something like this would help your site or product, the next
        step is a conversation about scope.
      </p>
    </div>
    <div class="blockquotestack">
      <template v-for="e in examples" :key="e.id">
        <ExampleProject
          class="example-instance full-width"
          :header="e.header"
          :expansionTopics="e.expansionTopics"
          :listTopics="e.listTopics"
          :defaultTopics="e.defaultTopics"
          :blockquote="e.blockquote"
        >
          <template #hero-motion-result>
            <a
              class="codepen-preview-card q-mt-md"
              :href="HERO_MOTION_CODEPEN_URL"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Hero Motion CodePen example"
            >
              <div
                class="codepen-preview-media"
                :style="{
                  backgroundImage: `url(${backgroundUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }"
              >
                <div class="codepen-preview-overlay">
                  <div class="codepen-preview-browser">
                    <div class="browser-dots"><span /> <span /> <span /></div>
                    <div class="browser-hero">
                      <p class="preview-kicker q-ma-none">GSAP Hero Motion</p>
                      <h3 class="q-mt-xs q-mb-sm">Animated Hero Experience</h3>
                      <p class="q-ma-none">
                        Timeline sequencing, atmospheric motion, and CTA focus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="codepen-preview-footer">
                <span>View live CodePen example</span> <q-icon :name="mdiOpenInNew" size="sm" />
              </div>
            </a>
          </template>
          <template #ai-chat-result>
            <div class="q-mb-lg row justify-center full-width">
              <Suspense>
                <template #default> <AIAssitant /> </template>
                <template #fallback> <q-skeleton type="QAvatar" height="400px" /> </template>
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
                title="Robot narrator waveform visualizer"
                class="narrator full-width"
                src="https://robot-narrator.pages.dev/"
              >
              </iframe>
            </div>
          </template>
        </ExampleProject>
      </template>
    </div>
    <q-btn
      @click="toContact"
      class="case-contact-btn q-mt-md full-width"
      color="accent"
      size="lg"
      glossy
    >
      <span class="text-body-2">LET’S TALK</span>
    </q-btn>
  </section>
  <!-- Desktop -->
  <section v-if="!isResponsive" class="examplesSection desktop-view full-width column q-pa-md">
    <div class="case-section-card q-pa-xl q-mb-md">
      <p class="text-caption kicker q-mt-none q-mb-sm">Examples</p>
      <h1 class="text-h1 q-mt-none q-mb-md">Focused Builds</h1>
      <p class="section-lead text-body-1 q-mt-none q-mb-sm">
        Motion, AI interaction, and implementation examples you can inspect.
      </p>
      <p class="section-copy text-body-2 q-ma-none">
        These examples show how focused implementation can improve first impressions, interaction
        clarity, and AI legibility. If something like this would help your site or product, the next
        step is a conversation about scope.
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
        v-for="e in examples"
        :key="e.id"
        :name="e.name"
        :label="e.label"
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
        v-for="e in examples"
        :key="e.id"
        :name="e.name"
        class="case-panel no-scroll bg-transparent q-pa-none"
      >
        <ExampleProject
          class="example-instance full-width"
          :header="e.header"
          :expansionTopics="e.expansionTopics"
          :listTopics="e.listTopics"
          :defaultTopics="e.defaultTopics"
          :blockquote="e.blockquote"
        >
          <template #hero-motion-result>
            <a
              class="codepen-preview-card q-mt-md"
              :href="HERO_MOTION_CODEPEN_URL"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Hero Motion CodePen example"
            >
              <div
                class="codepen-preview-media"
                :style="{
                  backgroundImage: `url(${backgroundUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }"
              >
                <div class="codepen-preview-overlay">
                  <div class="codepen-preview-browser">
                    <div class="browser-dots"><span /> <span /> <span /></div>
                    <div class="browser-hero">
                      <p class="preview-kicker q-ma-none">GSAP Hero Motion</p>
                      <h3 class="q-mt-xs q-mb-sm">Animated Hero Experience</h3>
                      <p class="q-ma-none">
                        Timeline sequencing, atmospheric motion, and CTA focus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="codepen-preview-footer">
                <span>View live CodePen example</span> <q-icon :name="mdiOpenInNew" size="sm" />
              </div>
            </a>
          </template>
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
                title="Robot narrator waveform visualizer"
                class="narrator full-width"
                src="https://robot-narrator.pages.dev/"
              >
              </iframe>
            </div>
          </template>
        </ExampleProject>
        <q-btn
          @click="toContact"
          class="case-contact-btn q-mt-md full-width"
          color="accent"
          size="lg"
          glossy
        >
          <span class="text-body-2">LET’S TALK</span>
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
.example-stack {
  display: grid;
  gap: 0.2rem;
  @media (min-width: tokens.$breakpoint-lg) {
    gap: 1rem;
  }
}
.case-contact-btn {
  border-radius: 0.75rem;
}
.codepen-preview-card {
  display: block;
  overflow: hidden;
  border-radius: 0.85rem;
  color: tokens.$text;
  text-decoration: none;
  background: color-mix(in srgb, tokens.$ink-soft 88%, tokens.$ivory 6%);
  border: 1px solid color-mix(in srgb, var(--q-accent) 34%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent),
    0 16px 40px color-mix(in srgb, tokens.$ink 72%, transparent);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--q-accent) 70%, transparent);
    box-shadow:
      inset 0 1px 0 color-mix(in srgb, tokens.$ivory 10%, transparent),
      0 22px 52px color-mix(in srgb, tokens.$ink 78%, transparent),
      0 0 28px color-mix(in srgb, var(--q-accent) 24%, transparent);
  }
}
.codepen-preview-media {
  position: relative;
  min-height: 320px;
}
.codepen-preview-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background:
    radial-gradient(
      circle at center,
      color-mix(in srgb, var(--q-accent) 16%, transparent),
      transparent 45%
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, tokens.$ink 24%, transparent),
      color-mix(in srgb, tokens.$ink 74%, transparent)
    );
}
.codepen-preview-browser {
  width: min(520px, 100%);
  overflow: hidden;
  border-radius: 1rem;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, tokens.$ink-soft 94%, tokens.$ivory 6%),
    tokens.$ink
  );
  border: 1px solid color-mix(in srgb, var(--q-accent) 44%, transparent);
  box-shadow:
    0 20px 54px color-mix(in srgb, tokens.$ink 82%, transparent),
    inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);
}
.browser-dots {
  display: flex;
  gap: 0.4rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--q-accent) 22%, transparent);
  span {
    width: 0.62rem;
    height: 0.62rem;
    border-radius: 999px;
    background: tokens.$champagne;
    box-shadow: 0 0 10px color-mix(in srgb, tokens.$champagne 34%, transparent);
  }
}
.browser-hero {
  padding: 1.75rem;
  text-align: center;
  .preview-kicker {
    color: tokens.$champagne;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  h3 {
    color: tokens.$text;
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 500;
    line-height: 1.1;
  }
  p {
    color: tokens.$text-muted;
    line-height: 1.5;
  }
}
.codepen-preview-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 1rem;
  color: tokens.$text;
  font-weight: 700;
  background: color-mix(in srgb, tokens.$ink 74%, var(--q-accent) 18%);
  border-top: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
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
  .codepen-preview-media {
    min-height: 260px;
  }
  .browser-hero {
    padding: 1.25rem;
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
  .case-contact-btn,
  .codepen-preview-card {
    transition: none;
  }
  .codepen-preview-card:hover,
  .codepen-preview-card:focus-visible {
    transform: none;
  }
}
</style>
