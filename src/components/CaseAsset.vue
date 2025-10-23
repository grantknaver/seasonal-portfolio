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
  <div v-if="isResponsive" class="responsive-view full-width column"></div>

  <!-- Desktop -->
  <div v-if="!isResponsive" class="desktop-view full-width column"></div>
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
