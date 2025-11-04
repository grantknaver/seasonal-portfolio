<script setup lang="ts">
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
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

// reuse the same viewport instance
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
</script>

<template>
  <!-- Mobile -->
  <div v-if="isResponsive" class="responsive-view full-width column">
    <!-- Expansion header as the item itself, no wrapper q-item -->
    <q-expansion-item
      expand-separator
      :label="header.text"
      :icon="header.icon"
      header-class="bg-dark text-primary full-width "
      class="full-width"
    >
      <q-card
        class="topic topic-border full-width"
        :style="{ backgroundImage: `url(${cardBackgrounds[activeTheme]})` }"
      >
        <q-card-section class="header-section full-width">
          <div class="full-width bg-white q-mb-none no-border rounded-borders">
            <h2
              class="text-h2 text-center q-mt-sm full-width q-mb-none text-bold secondary-font"
              :class="
                setSeasonClasses(
                  {
                    Fall: 'text-secondary black-text-outline',
                    Winter: 'text-secondary black-text-outline',
                    Spring: 'text-secondary black-text-outline',
                    Summer: 'text-secondary black-text-outline',
                  },
                  activeTheme,
                )
              "
            >
              {{ props.header.text }}
            </h2>
            <p
              class="q-mt-sm q-mb-lg text-body-2 text-center text-accent primary-font bg-transparent"
            >
              {{ props.header.subHeader }}
            </p>
          </div>
        </q-card-section>

        <q-separator />

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
                  class="shadow-1 overflow-hidden q-mt-md full-width"
                  :class="{ 'q-mb-md': index + 1 === props.expansionTopics.topics.length }"
                  style="border-radius: 5px"
                  :icon="topic.icon"
                  :label="topic.label"
                  header-class="bg-primary text-accent full-width"
                  expand-icon-class="text-white"
                >
                  <q-card class="bg-white full-width">
                    <q-card-section>
                      <p class="text-body-1 text-dark primary-font q-mb-none">
                        {{ topic.text }}
                      </p>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>

                <slot :name="topic.name" />
                <q-separator v-if="topic.hasSeparator" />
              </div>
            </q-card-section>
          </q-intersection>

          <q-separator v-if="props.expansionTopics.hasSeparator" />
        </div>

        <!-- List topics -->
        <div v-if="props.listTopics" class="full-width">
          <div v-for="topic in props.listTopics.topics" :key="topic.id" class="full-width">
            <q-intersection transition="jump-right" transition-duration="500" once>
              <q-card-section class="full-width">
                <h3 class="text-h3 q-mt-none q-mb-md secondary-font">{{ topic.header }}</h3>
                <q-list class="q-mb-sm bg-primary full-width q-pa-none" bordered separator>
                  <div v-for="bullet in topic.list" :key="bullet.id" class="full-width">
                    <q-item class="full-width">
                      <q-item-section avatar>
                        <q-icon
                          :color="
                            setSeasonClasses(
                              {
                                Fall: 'accent',
                                Winter: 'accent',
                                Spring: 'accent',
                                Summer: 'accent',
                              },
                              activeTheme,
                            )
                          "
                          :name="bullet.icon"
                        />
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

          <q-separator v-if="props.listTopics.hasSeparator" />
        </div>

        <!-- Default topics -->
        <div v-if="props.defaultTopics" class="full-width">
          <div v-for="topic in props.defaultTopics.topics" :key="topic.id" class="full-width">
            <q-card-section class="full-width">
              <h3 class="text-h3 q-mt-none q-mb-md secondary-font">{{ topic.header }}</h3>
              <p>{{ topic.subHeader }}</p>
              <p class="default-topic-text q-mb-sm primary-font">
                {{ topic.text }}
              </p>
            </q-card-section>

            <slot :name="topic.name" />
            <q-separator v-if="topic.hasSeparator" />
          </div>
          <q-separator v-if="props.defaultTopics.hasSeparator" />
        </div>

        <!-- Blockquote -->
        <div v-if="props.blockquote" class="full-width">
          <q-intersection transition="scale" transition-duration="500" once>
            <q-card-section class="blockquote-section bg-primary q-pa-md full-width">
              <div class="row items-start full-width">
                <blockquote class="primary-font row text-dark q-pl-lg full-width">
                  <q-intersection transition="scale" transition-duration="1250" once>
                    <i class="q-mb-none">
                      "Built a dynamic Weather/Theme System with layered parallax and ambient
                      effects, driven by GSAP and Vue 3. Fixed a critical resize bug for seamless
                      responsiveness across devices."
                    </i>
                  </q-intersection>
                </blockquote>
              </div>
            </q-card-section>
          </q-intersection>
        </div>
      </q-card>
    </q-expansion-item>
  </div>

  <!-- Desktop -->
  <div v-else class="desktop-view full-width column">
    <q-card
      class="topic topic-border q-pa-lg full-width"
      :style="{ backgroundImage: `url(${cardBackgrounds[activeTheme]})` }"
    >
      <q-card-section class="header-section full-width">
        <h2
          class="text-center q-mt-sm text-h2 q-mt-none q-mb-none text-bold secondary-font full-width"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-secondary black-text-outline',
                Winter: 'text-secondary black-text-outline',
                Spring: 'text-secondary black-text-outline',
                Summer: 'text-secondary black-text-outline',
              },
              activeTheme,
            )
          "
        >
          {{ props.header.text }}
        </h2>
        <p class="text-body-1 text-center q-mt-md text-dark primary-font">
          {{ props.header.subHeader }}
        </p>
      </q-card-section>

      <q-separator />

      <!-- Expansion topics -->
      <div v-if="props.expansionTopics" class="full-width">
        <q-intersection transition="slide-up" transition-duration="500" :once="true">
          <q-card-section class="q-pt-none q-pb-none items-center full-width">
            <div
              v-for="(topic, index) in props.expansionTopics.topics"
              :key="topic.id"
              class="full-width"
            >
              <q-expansion-item
                class="shadow-1 overflow-hidden indent-expansion-item q-mt-md full-width"
                :class="{ 'q-mb-md': index + 1 === props.expansionTopics.topics.length }"
                style="border-radius: 5px"
                :icon="topic.icon"
                :label="topic.label"
                header-class="bg-primary text-accent full-width"
              >
                <q-card class="bg-white full-width">
                  <q-card-section>
                    <p class="text-body-2 text-dark primary-font q-mb-none">
                      {{ topic.text }}
                    </p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <slot :name="topic.name" />
              <q-separator v-if="topic.hasSeparator" />
            </div>
          </q-card-section>
        </q-intersection>

        <q-separator v-if="props.expansionTopics.hasSeparator" />
      </div>

      <!-- List topics -->
      <div v-if="props.listTopics" class="full-width">
        <div v-for="t in props.listTopics.topics" :key="t.id" class="full-width">
          <q-card-section class="full-width">
            <h3 class="text-h3 q-mt-none q-mb-md secondary-font">{{ t.header }}</h3>

            <q-intersection transition="jump-right" transition-duration="1000" once>
              <q-list class="q-mb-sm bg-primary full-width q-pa-none" bordered separator>
                <div v-for="bullet in t.list" :key="bullet.id" class="full-width">
                  <q-item class="full-width">
                    <q-item-section avatar>
                      <q-icon
                        :color="
                          setSeasonClasses(
                            {
                              Fall: 'accent',
                              Winter: 'accent',
                              Spring: 'accent',
                              Summer: 'accent',
                            },
                            activeTheme,
                          )
                        "
                        :name="bullet.icon"
                      />
                    </q-item-section>
                    <q-item-section class="text-body-2 primary-font">
                      {{ bullet.text }}
                    </q-item-section>
                  </q-item>
                </div>
              </q-list>
            </q-intersection>
          </q-card-section>

          <slot :name="t.name" />
        </div>

        <q-separator v-if="props.listTopics.hasSeparator" />
      </div>

      <!-- Default topics -->
      <div v-if="props.defaultTopics" class="full-width">
        <div v-for="topic in props.defaultTopics.topics" :key="topic.id" class="full-width">
          <q-card-section class="full-width">
            <h3 class="text-h3 q-mt-none q-mb-md secondary-font">{{ topic.header }}</h3>
            <p>{{ topic.subHeader }}</p>
            <p class="text-body-2 q-mb-sm primary-font">
              {{ topic.text }}
            </p>
          </q-card-section>

          <slot :name="topic.name" />
          <q-separator v-if="topic.hasSeparator" />
        </div>

        <q-separator v-if="props.defaultTopics.hasSeparator" />
      </div>

      <!-- Blockquote -->
      <div v-if="props.blockquote" class="full-width">
        <q-card-section class="blockquote-section q-pa-md full-width">
          <q-intersection transition="scale" transition-duration="1250" :once="true">
            <div class="row items-start full-width">
              <blockquote class="primary-font row text-dark q-pl-md full-width">
                <i class="q-mb-md">
                  "Built a dynamic Weather/Theme System with layered parallax and ambient effects,
                  driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness
                  across devices."
                </i>
              </blockquote>
            </div>
          </q-intersection>
        </q-card-section>
      </div>
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

  .case-study {
    border-left: solid 4px var(--q-dark) !important;
  }

  .topic {
    .header-section {
      p {
        font-size: 1rem;
        background-color: transparent;
      }
    }
    .blockquote-section {
      background: var(--q-primary);
      border-radius: 6px;
      transition: transform 0.2s ease;

      blockquote {
        position: relative;
        cursor: pointer;
        border-left: 3px solid var(--q-dark);

        p {
          font-size: 1.2rem;
          line-height: 1.5;
        }
      }
    }
  }

  .topic-border {
    border: solid 1rem var(--q-secondary);
  }
}

.desktop-view {
  .topic-border {
    border: solid 1rem var(--q-secondary);
  }

  .topic {
    .header-section {
      p {
        font-size: 1rem;
        background-color: transparent;
      }
    }

    .expansion-item:last-child {
      display: none !important;
      margin-bottom: 1rem !important;
    }

    .blockquote-section {
      background: var(--q-primary);
      border-radius: 6px;
      transition: transform 0.2s ease;
      box-shadow: 5px 5px 10px var(--q-dark);

      blockquote {
        position: relative;
        cursor: pointer;
        font-size: 1.2rem;

        p {
          line-height: 1.5;
          font-family: $cursive-stack;
        }
      }
    }
  }

  .expansion-item {
    margin-bottom: 0;
    display: none;
  }
}

.q-item {
  border-bottom: solid 1px var(--q-secondary);
}

/* Smooth slide-right on hover/focus; returns on blur */
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

.default-topic-text {
  font-size: 1.2rem;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .indent-expansion-item {
    transition: none;
    transform: none;
  }
}
</style>
