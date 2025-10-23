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
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const isBelowLgBreakpoint = computed(() => useViewport().width.value < useViewport().lgBreakpoint);

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
    // accept undefined explicitly
    type: String as PropType<string | undefined>,
    default: '',
  },
});

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
      class="topic topic-border"
      :style="{ backgroundImage: `url(${cardBackgrounds[activeTheme]})` }"
    >
      <q-card-section class="header-section">
        <div class="full-width bg-white q-mb-none no-border rounded-borders">
          <h2
            class="text-h2 text-center q-mt-sm full-width q-mb-none text-bold secondary-font"
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
            {{ props.header.text }}
          </h2>
          <p
            class="q-mt-sm q-mb-lg text-body-2 text-center text-accent primary-font bg-transparent"
          >
            {{ props.header.subHeader }}
          </p>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <span v-if="expansionTopics" class="full-width">
        <q-intersection transition="slide-up" transition-duration="500" once>
          <q-card-section class="row q-pt-none q-pb-none">
            <span
              class="full-width"
              v-for="(topic, index) in expansionTopics.topics"
              :key="topic.id"
            >
              <q-expansion-item
                class="shadow-1 overflow-hidden q-mt-md"
                :class="{
                  'q-mb-md': index + 1 === expansionTopics.topics.length,
                }"
                style="border-radius: 5px"
                :icon="topic.icon"
                :label="topic.label"
                header-class="bg-primary text-white"
                expand-icon-class="text-white"
              >
                <q-card class="bg-white">
                  <q-card-section>
                    <p class="text-body-1 text-dark primary-font q-mb-none">
                      {{ topic.text }}
                    </p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-separator v-if="topic.hasSeparator"></q-separator>
            </span>
          </q-card-section>
        </q-intersection>

        <q-separator v-if="expansionTopics.hasSeparator"></q-separator
      ></span>
      <span v-if="listTopics" class="full-width">
        <div v-for="topic in listTopics.topics" :key="topic.id" clas="full-width">
          <q-intersection transition="jump-right" transition-duration="500" once>
            <q-card-section>
              <h3 class="text-h3 q-mt-none q-mb-md secondary-font">{{ topic.header }}</h3>
              <q-list class="q-mb-sm bg-primary" bordered separator>
                <span v-for="bullet in topic.list" :key="bullet.id" class="full-width">
                  <q-item>
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
                        :name="bullet.icon"
                      />
                    </q-item-section>
                    <q-item-section class="text-body-2 primary-font">{{
                      bullet.text
                    }}</q-item-section>
                  </q-item>
                </span>
              </q-list>
            </q-card-section>
          </q-intersection>
        </div>
        <q-separator v-if="listTopics.hasSeparator"></q-separator>
      </span>
      <span v-if="defaultTopics">
        <div v-for="topic in defaultTopics.topics" :key="topic.id" clas="full-width">
          <q-card-section>
            <h3 class="text-h3 q-mt-none q-mb-md secondary-font">{{ topic.header }}</h3>
            <p>{{ topic.subHeader }}</p>
            <p class="text-body-2 q-mb-sm primary-font">
              {{ topic.text }}
            </p>
            <span></span>
          </q-card-section>
        </div>
      </span>
      <span v-if="blockquote">
        <q-intersection transition="scale" transition-duration="500" once>
          <q-card-section class="blockquote-section bg-primary q-pa-md">
            <div class="row items-start">
              <blockquote class="primary-font row text-dark q-pl-lg">
                <q-intersection transition="scale" transition-duration="1250" once>
                  <i class="q-mb-none">
                    "Built a dynamic Weather/Theme System with layered parallax and ambient effects,
                    driven by GSAP and Vue 3. Fixed a critical resize bug for seamless
                    responsiveness across devices."
                  </i>
                </q-intersection>
              </blockquote>
            </div>
          </q-card-section>
        </q-intersection></span
      >
    </q-card>
  </div>

  <!-- Desktop -->
  <div v-if="!isResponsive" class="desktop-view full-width column">
    <q-card
      class="topic topic-border q-pa-lg"
      :style="{ backgroundImage: `url(${cardBackgrounds[activeTheme]})` }"
    >
      <q-card-section class="header-section">
        <h2
          class="text-center q-mt-sm text-h2 q-mt-none q-mb-none text-bold secondary-font"
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
          {{ props.header.text }}
        </h2>
        <p class="text-body-1 text-center q-mt-md text-dark primary-font">
          {{ props.header.subHeader }}
        </p>
      </q-card-section>
      <q-separator></q-separator>
      <span v-if="expansionTopics" class="full-width">
        <q-intersection transition="slide-up" transition-duration="500" :once="true">
          <q-card-section class="row q-pt-none q-pb-none items-center full-width">
            <span
              v-for="(topic, index) in expansionTopics.topics"
              :key="topic.id"
              class="full-width"
            >
              <q-expansion-item
                class="shadow-1 overflow-hidden indent-expansion-item q-mt-md"
                :class="{
                  'q-mb-md': index + 1 === expansionTopics.topics.length,
                }"
                style="border-radius: 5px"
                :icon="topic.icon"
                :label="topic.label"
                header-class="bg-primary text-white"
                expand-icon-class="text-white"
              >
                <q-card class="bg-white">
                  <q-card-section>
                    <p class="text-body-2 text-dark primary-font q-mb-none">
                      {{ topic.text }}
                    </p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-separator v-if="topic.hasSeparator"></q-separator>
            </span> </q-card-section
        ></q-intersection>
        <q-separator v-if="expansionTopics.hasSeparator"></q-separator>
      </span>
      <span v-if="listTopics" class="full-width">
        <div class="full-width" v-for="t in listTopics.topics" :key="t.id">
          <q-card-section>
            <h3 class="text-h3 q-mt-none q-mb-md secondary-font">{{ t.header }}</h3>
            <q-intersection transition="jump-right" transition-duration="1000" once>
              <q-list class="q-mb-sm bg-primary" bordered separator>
                <span v-for="bullet in t.list" :key="bullet.id" class="full-width">
                  <q-item>
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
                        :name="bullet.icon"
                      />
                    </q-item-section>
                    <q-item-section class="text-body-2 primary-font">{{
                      bullet.text
                    }}</q-item-section>
                  </q-item>
                </span>
              </q-list></q-intersection
            >
          </q-card-section>
        </div>
        <q-separator v-if="listTopics.hasSeparator"></q-separator>
      </span>
      <span v-if="defaultTopics" class="full-width">
        <div v-for="topic in defaultTopics.topics" :key="topic.id" class="full-width">
          <q-card-section>
            <h3 class="text-h3 q-mt-none q-mb-md secondary-font">{{ topic.header }}</h3>
            <p>{{ topic.subHeader }}</p>
            <p class="text-body-2 q-mb-sm primary-font">
              {{ topic.text }}
            </p>
          </q-card-section>
          <q-separator v-if="topic.hasSeparator"></q-separator>
        </div>
        <q-separator v-if="defaultTopics.hasSeparator"></q-separator>
      </span>
      <span v-if="blockquote">
        <q-card-section class="blockquote-section q-pa-md">
          <q-intersection transition="scale" transition-duration="1250" :once="true">
            <div class="row items-start">
              <blockquote class="primary-font row text-dark q-pl-md">
                <i class="q-mb-md">
                  "Built a dynamic Weather/Theme System with layered parallax and ambient effects,
                  driven by GSAP and Vue 3. Fixed a critical resize bug for seamless responsiveness
                  across devices."
                </i>
              </blockquote>
            </div></q-intersection
          >
        </q-card-section>
      </span>
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
