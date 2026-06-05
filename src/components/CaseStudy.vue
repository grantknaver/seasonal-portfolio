<script setup lang="ts">
import { useViewport } from '../shared/utils/viewWidth';
import { computed } from 'vue';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { Theme } from 'src/shared/constants/theme';
import { type PropType } from 'vue';
import type {
  CaseStudyHeader,
  CaseStudyListTopicGroup,
  CaseStudyExpansionTopicGroup,
  CaseStudyDefaultTopicGroup,
} from '../shared/types/caseStudy';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);

const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

const props = defineProps({
  header: {
    type: Object as PropType<CaseStudyHeader>,
    required: true,
  },
  expansionTopics: {
    type: Object as PropType<CaseStudyExpansionTopicGroup | undefined>,
    required: false,
  },
  listTopics: {
    type: Object as PropType<CaseStudyListTopicGroup | undefined>,
    required: false,
  },
  defaultTopics: {
    type: Object as PropType<CaseStudyDefaultTopicGroup | undefined>,
    required: false,
  },
  blockquote: {
    type: String as PropType<string | undefined>,
    default: '',
  },
});

const cardBackgrounds = {
  [Theme.Fall]: new URL('../assets/case-study-fall-bcg.avif', import.meta.url).href,
  [Theme.Winter]: new URL('../assets/case-study-winter-bcg.avif', import.meta.url).href,
  [Theme.Spring]: new URL('../assets/case-study-spring-bcg.avif', import.meta.url).href,
  [Theme.Summer]: new URL('../assets/case-study-summer-bcg.avif', import.meta.url).href,
};

const cardStyle = computed(() => ({
  '--case-study-bg': `url(${cardBackgrounds[activeTheme.value]})`,
}));
</script>

<template>
  <!-- Mobile -->
  <div v-if="isResponsive" class="case-study-component responsive-view full-width column">
    <q-expansion-item
      expand-separator
      :label="header.text"
      :icon="header.icon"
      header-class="case-study-mobile-trigger full-width"
      expand-icon-class="case-study-expand-icon"
      class="case-study-mobile-expansion full-width"
    >
      <q-card class="case-study-card full-width" :style="cardStyle">
        <q-card-section class="case-study-header-section full-width">
          <h2 class="case-study-title text-h2 q-mt-sm q-mb-none secondary-font">
            {{ props.header.text }}
          </h2>

          <p class="case-study-subtitle text-body-2 q-mt-sm q-mb-none primary-font">
            {{ props.header.subHeader }}
          </p>

          <q-icon size="48px" :name="props.header.icon" class="case-study-header-icon q-mt-md" />
        </q-card-section>

        <q-separator class="case-study-separator" />

        <!-- Expansion topics -->
        <div v-if="props.expansionTopics" class="full-width">
          <q-intersection transition="slide-up" transition-duration="500" once>
            <q-card-section class="q-pt-none q-pb-none full-width">
              <div
                v-for="(topic, index) in props.expansionTopics.topics"
                :key="topic.id"
                class="full-width"
              >
                <q-expansion-item
                  :group="topic.name + '-list'"
                  class="case-study-expansion q-mt-md full-width"
                  :class="{ 'q-mb-md': index + 1 === props.expansionTopics.topics.length }"
                  :icon="topic.icon"
                  :label="topic.label"
                  header-class="case-study-expansion-header full-width"
                  expand-icon-class="case-study-expand-icon"
                >
                  <q-card class="case-study-expansion-body full-width">
                    <q-card-section>
                      <p class="text-body-2 primary-font q-mb-none">
                        {{ topic.text }}
                      </p>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>

                <slot :name="topic.name" />
                <q-separator v-show="topic.hasSeparator" class="case-study-separator" />
              </div>
            </q-card-section>
          </q-intersection>

          <q-separator v-show="props.expansionTopics.hasSeparator" class="case-study-separator" />
        </div>

        <!-- List topics -->
        <div v-if="props.listTopics" class="full-width">
          <div v-for="topic in props.listTopics.topics" :key="topic.id" class="full-width">
            <q-intersection transition="jump-right" transition-duration="500" once>
              <q-card-section class="full-width">
                <h3 class="case-study-section-title text-h3 q-mt-none q-mb-md secondary-font">
                  {{ topic.header }}
                </h3>

                <q-list class="case-study-list full-width q-pa-none" bordered separator>
                  <div v-for="bullet in topic.list" :key="bullet.id" class="full-width">
                    <q-item class="case-study-list-item full-width">
                      <q-item-section avatar>
                        <q-icon color="accent" :name="bullet.icon" />
                      </q-item-section>

                      <q-item-section class="text-body-2 primary-font">
                        {{ bullet.text }}
                      </q-item-section>
                    </q-item>
                  </div>
                </q-list>
              </q-card-section>
            </q-intersection>

            <slot :name="topic.name" />
          </div>

          <q-separator v-if="props.listTopics.hasSeparator" class="case-study-separator" />
        </div>

        <!-- Default topics -->
        <div v-if="props.defaultTopics" class="full-width">
          <div v-for="topic in props.defaultTopics.topics" :key="topic.id" class="full-width">
            <q-card-section class="full-width">
              <h3 class="case-study-section-title text-h3 q-mt-none q-mb-md secondary-font">
                {{ topic.header }}
              </h3>

              <p v-if="topic.subHeader" class="case-study-subtitle text-body-2 q-mt-none">
                {{ topic.subHeader }}
              </p>

              <p class="case-study-body-copy text-body-2 q-mb-sm primary-font">
                {{ topic.text }}
              </p>
            </q-card-section>

            <slot :name="topic.name" />
            <q-separator v-if="topic.hasSeparator" class="case-study-separator" />
          </div>

          <q-separator v-if="props.defaultTopics.hasSeparator" class="case-study-separator" />
        </div>

        <!-- Blockquote -->
        <div v-if="props.blockquote" class="full-width">
          <q-intersection transition="scale" transition-duration="500" once>
            <q-card-section class="case-study-quote-section q-pa-md full-width">
              <blockquote class="case-study-quote primary-font q-ma-none full-width">
                <i>{{ props.blockquote }}</i>
              </blockquote>
            </q-card-section>
          </q-intersection>
        </div>
      </q-card>
    </q-expansion-item>
  </div>

  <!-- Desktop -->
  <div v-else class="case-study-component desktop-view full-width column">
    <q-card class="case-study-card q-pa-lg full-width" :style="cardStyle">
      <q-card-section class="case-study-header-section full-width">
        <h2 class="case-study-title text-h2 q-mt-sm q-mb-none secondary-font">
          {{ props.header.text }}
        </h2>

        <p class="case-study-subtitle text-body-1 q-mt-md q-mb-none primary-font">
          {{ props.header.subHeader }}
        </p>

        <q-icon
          size="64px"
          :name="props.header.icon"
          class="case-study-header-icon q-mt-md q-mb-sm"
        />
      </q-card-section>

      <q-separator class="case-study-separator" />

      <!-- Expansion topics -->
      <div v-if="props.expansionTopics" class="full-width">
        <q-intersection transition="slide-up" transition-duration="500" once>
          <q-card-section class="q-pt-none q-pb-none full-width">
            <div
              v-for="(topic, index) in props.expansionTopics.topics"
              :key="topic.id"
              class="full-width"
            >
              <q-expansion-item
                class="case-study-expansion indent-expansion-item q-mt-md full-width"
                :class="{ 'q-mb-md': index + 1 === props.expansionTopics.topics.length }"
                :icon="topic.icon"
                :label="topic.label"
                header-class="case-study-expansion-header full-width"
                expand-icon-class="case-study-expand-icon"
              >
                <q-card class="case-study-expansion-body full-width">
                  <q-card-section>
                    <p class="text-body-2 primary-font q-mb-none">
                      {{ topic.text }}
                    </p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <slot :name="topic.name" />
              <q-separator v-if="topic.hasSeparator" class="case-study-separator" />
            </div>
          </q-card-section>
        </q-intersection>

        <q-separator v-if="props.expansionTopics.hasSeparator" class="case-study-separator" />
      </div>

      <!-- List topics -->
      <div v-if="props.listTopics" class="full-width">
        <div v-for="topic in props.listTopics.topics" :key="topic.id" class="full-width">
          <q-card-section class="full-width">
            <h3 class="case-study-section-title text-h3 q-mt-none q-mb-md secondary-font">
              {{ topic.header }}
            </h3>

            <q-intersection transition="jump-right" transition-duration="1000" once>
              <q-list class="case-study-list full-width q-pa-none" bordered separator>
                <div v-for="bullet in topic.list" :key="bullet.id" class="full-width">
                  <q-item class="case-study-list-item full-width">
                    <q-item-section avatar>
                      <q-icon color="accent" :name="bullet.icon" />
                    </q-item-section>

                    <q-item-section class="text-body-2 primary-font">
                      {{ bullet.text }}
                    </q-item-section>
                  </q-item>
                </div>
              </q-list>
            </q-intersection>
          </q-card-section>

          <slot :name="topic.name" />
        </div>

        <q-separator v-if="props.listTopics.hasSeparator" class="case-study-separator" />
      </div>

      <!-- Default topics -->
      <div v-if="props.defaultTopics" class="full-width">
        <div v-for="topic in props.defaultTopics.topics" :key="topic.id" class="full-width">
          <q-card-section class="full-width">
            <h3 class="case-study-section-title text-h3 q-mt-none q-mb-md secondary-font">
              {{ topic.header }}
            </h3>

            <p v-if="topic.subHeader" class="case-study-subtitle text-body-2 q-mt-none">
              {{ topic.subHeader }}
            </p>

            <p class="case-study-body-copy text-body-2 q-mb-sm primary-font">
              {{ topic.text }}
            </p>
          </q-card-section>

          <slot :name="topic.name" />
          <q-separator v-if="topic.hasSeparator" class="case-study-separator" />
        </div>

        <q-separator v-if="props.defaultTopics.hasSeparator" class="case-study-separator" />
      </div>

      <!-- Blockquote -->
      <div v-if="props.blockquote" class="full-width">
        <q-card-section class="case-study-quote-section q-pa-md full-width">
          <q-intersection transition="scale" transition-duration="1250" once>
            <blockquote class="case-study-quote primary-font q-ma-none full-width">
              <i>{{ props.blockquote }}</i>
            </blockquote>
          </q-intersection>
        </q-card-section>
      </div>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
@use '/src/css/_tokens.scss' as tokens;

.case-study-component {
  color: tokens.$text;
}

.case-study-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid var(--q-accent);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, tokens.$ink-soft 90%, tokens.$ivory 10%),
    tokens.$ink
  );
}

.case-study-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--case-study-bg);
  background-size: cover;
  background-position: center;
  opacity: 0.06;
  pointer-events: none;
}

.case-study-card > * {
  position: relative;
  z-index: 1;
}

.case-study-header-section {
  text-align: center;
}

.case-study-header-icon {
  color: var(--q-accent);
  opacity: 0.9;
}

.case-study-title {
  color: tokens.$text;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.025em;
  text-wrap: balance;
}

.case-study-subtitle,
.case-study-body-copy {
  color: tokens.$text-muted;
  line-height: 1.55;
}

.case-study-section-title {
  color: tokens.$champagne;
  font-weight: 500;
}

.case-study-separator {
  background: color-mix(in srgb, var(--q-accent) 28%, transparent);
  opacity: 1;
}

.case-study-expansion {
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--q-accent) 28%, transparent);
  background: color-mix(in srgb, tokens.$ink-soft 82%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, tokens.$ivory 8%, transparent);
}

.case-study-expansion-body {
  color: tokens.$text-muted;
  background: color-mix(in srgb, tokens.$ink 82%, transparent);
}

.case-study-list {
  overflow: hidden;
  border-radius: 0.75rem;
  border-color: color-mix(in srgb, var(--q-accent) 28%, transparent);
  background: color-mix(in srgb, tokens.$ink-soft 82%, transparent);
}

.case-study-list-item {
  color: tokens.$text-muted;
  border-bottom: 1px solid color-mix(in srgb, var(--q-accent) 18%, transparent);
}

.case-study-list-item:last-child {
  border-bottom: 0;
}

.case-study-quote-section {
  margin-top: 0.5rem;
}

.case-study-quote {
  padding: 1.25rem;
  border-left: 3px solid var(--q-accent);
  border-radius: 0.75rem;
  color: tokens.$text;
  background: color-mix(in srgb, tokens.$ink-soft 82%, tokens.$ivory 6%);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, tokens.$ivory 10%, transparent),
    0 12px 32px color-mix(in srgb, tokens.$ink 50%, transparent);
  line-height: 1.6;
}

.responsive-view {
  .case-study-card {
    border-radius: 0.75rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .case-study-title {
    font-size: 1.35rem;
  }

  .case-study-quote {
    padding: 1rem;
  }
}

.desktop-view {
  .case-study-card {
    padding: 2rem;
  }
}

.indent-expansion-item {
  transform: translateX(0);
  transition: transform 160ms ease;
  will-change: transform;
}

.indent-expansion-item:hover,
.indent-expansion-item:focus-visible {
  transform: translateX(0.5rem);
}

.indent-expansion-item:active {
  transform: translateX(0.65rem);
}

@media (prefers-reduced-motion: reduce) {
  .indent-expansion-item {
    transition: none;
    transform: none;
  }
}
</style>

<style lang="scss">
@use '/src/css/_tokens.scss' as tokens;

/* These are Quasar internal header classes passed through props.
   They are intentionally global but tightly prefixed to this component. */
.case-study-component {
  .case-study-mobile-trigger {
    color: tokens.$text;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, tokens.$ink-soft 88%, tokens.$ivory 6%),
      tokens.$ink
    );
    border: 1px solid color-mix(in srgb, var(--q-accent) 34%, transparent);
    border-radius: 0;
    font-weight: 700;

    @media (min-width: tokens.$breakpoint-lg) {
      border-radius: 0.75rem;
    }
  }

  .case-study-expansion-header {
    color: tokens.$text;
    background: color-mix(in srgb, tokens.$ink-soft 84%, transparent);
    font-weight: 700;
  }

  .case-study-expand-icon {
    color: tokens.$champagne;
  }
}
</style>
