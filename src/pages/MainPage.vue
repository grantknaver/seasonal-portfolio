<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import { TopicName } from '../shared/constants/topicName';
import AboutSection from '../components/AboutSection.vue';
import ContactSection from '../components/ContactSection.vue';
import PackageSection from '../components/PackageSection.vue';
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
import SimonMenu from '../components/SimonMenu.vue';
import CaseStudiesSection from 'src/components/CaseStudiesSection.vue';
import { type Slide } from '../shared/types/slide';
import { QCarousel } from 'quasar';
import { Theme } from '../shared/constants/theme';
import WeatherBackground from '../components/WeatherBackground.vue';

const mainStore = useMainStore();
const mobileTopics: Topic[] = [
  { id: uuidv4(), name: TopicName.Packages, icon: 'local_shipping', label: 'Packages' },
  {
    id: uuidv4(),
    name: TopicName.About,
    icon: 'info',
    label: TopicName.About,
  },
  {
    id: uuidv4(),
    name: TopicName.Contact,
    icon: 'contact_mail',
    label: TopicName.Contact,
  },
  {
    id: uuidv4(),
    name: TopicName.CaseStudies,
    icon: 'menu_book',
    label: TopicName.CaseStudies,
  },
];

const slides = ref<Slide[]>([
  {
    id: uuidv4(),
    src: new URL('../assets/autumn-forestry.jpg', import.meta.url).href,
    theme: Theme.Fall,
  },
  {
    id: uuidv4(),
    src: new URL('../assets/snowy-winter-landscape.jpg', import.meta.url).href,
    theme: Theme.Winter,
  },
  {
    id: uuidv4(),
    src: new URL('../assets/beautiful-forest-spring-season.jpg', import.meta.url).href,
    theme: Theme.Spring,
  },
  {
    id: uuidv4(),
    src: new URL('../assets/beach.jpg', import.meta.url).href,
    theme: Theme.Summer,
  },
]);
const slide = ref<Theme>(Theme.Fall);
const { activeTheme, activeTopic, mobileScrollTarget } = storeToRefs(mainStore);
const expandedPanel = ref<TopicName | null>(null);
const headerHeight = ref<number>(0);

watch(slide, (newVal) => mainStore.SET_ACTIVE_THEME(newVal));

onMounted(async () => {
  await mainStore.VERIFY_HUMANITY();

  window.addEventListener('resize', () => {
    headerHeight.value = document.getElementById('mobile-header')?.offsetHeight ?? 0;
  });
});

watch(mobileScrollTarget, (newTopic) => {
  if (!newTopic) return;
  expandedPanel.value = newTopic;
});

watch(activeTopic, (newTopic: TopicName | null) => {
  if (!newTopic) return;
  expandedPanel.value = newTopic;
});
</script>

<template>
  <q-page class="page-container column">
    <div class="carousel-background">
      <q-carousel
        v-model="slide"
        transition-prev="fade"
        transition-next="fade"
        animated
        infinite
        :autoplay="15000"
        height="100%"
        class="carousel-absolute bg-dark"
        :transition-duration="2500"
      >
        <q-carousel-slide v-for="s in slides" :key="s.id" :name="s.theme" :img-src="s.src" />
      </q-carousel>
    </div>
    <div class="weather-layer">
      <WeatherBackground />
    </div>
    <div class="logo">
      <img
        class="q-pt-sm"
        style="max-width: 65px"
        src="../assets/glkfreelance-logo.png"
        alt="logo"
      />
      <span class="logo-text"
        ><span class="text-secondary">glk</span><span class="text-primary">Freelance</span></span
      >
    </div>
    <div class="sub-container column">
      <section class="mobile-view full-width q-pa-md">
        <div inline-actions class="text-primary bg-accent q-mb-sm">
          <span>
            <p class="q-ma-none text-primary bounce-text">Grant Knaver</p>
            <p class="q-ma-none text-dark">Fullstack Developer</p>
          </span>
          <q-space></q-space>
          <q-btn size="lg" color="dark">Resume</q-btn>
        </div>
        <blockquote
          class="full-width q-pa-md text-center q-ma-none"
          cite="http://www.worldwildlife.org/who/index.html"
        >
          "Successful software is built not just with code, but with trust. The best developers
          listen first — not to respond, but to understand. Because building the right thing is just
          as important as building it right."
        </blockquote>
        <q-list class="full-width">
          <q-item
            v-for="topic in mobileTopics.filter((topic) => topic.name !== TopicName.Contact)"
            :key="topic.id"
            :name="topic.name"
            v-model="expandedPanel"
            class="full-width bg-transparent q-pa-none q-mb-sm"
          >
            <q-expansion-item
              :icon="topic.icon"
              :label="topic.label"
              :model-value="expandedPanel === topic.name"
              @update:model-value="
                (val) => {
                  expandedPanel = val
                    ? topic.name
                    : expandedPanel === topic.name
                      ? null
                      : expandedPanel;
                }
              "
              :header-class="['text-dark', 'bg-secondary']"
              class="expansion-item full-width"
            >
              <template v-if="topic.name === TopicName.Packages">
                <div :id="topic.name" class="full-width">
                  <PackageSection />
                </div>
              </template>
              <template v-if="topic.name === TopicName.CaseStudies">
                <div :id="topic.name" class="anchor full-width">
                  <CaseStudiesSection />
                </div>
              </template>
              <template v-if="topic.name === TopicName.About">
                <div :id="topic.name" class="full-width">
                  <AboutSection />
                </div>
              </template>
            </q-expansion-item>
          </q-item>
        </q-list>
        <div class="full-width" :id="TopicName.Contact">
          <ContactSection />
        </div>
      </section>
      <section class="desktop-view column justify-center items-center full-width">
        <SimonMenu></SimonMenu>
        <q-separator class="q-mt-lg q-mb-md" />
        <span>
          <p
            class="name q-ma-none"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-primary fall-text-shadow',
                  Winter: 'text-primary winter-text-shadow',
                  Spring: 'text-primary spring-text-shadow',
                  Summer: 'text-primary summer-text-shadow',
                },
                activeTheme,
              )
            "
          >
            Grant Knaver
          </p>
          <p
            class="full-stack q-ma-none text-bold text-warning text-center"
            :class="
              setSeasonClasses(
                {
                  Fall: 'fall-text-shadow',
                  Winter: 'winter-text-shadow',
                  Spring: 'spring-text-shadow',
                  Summer: ' summer-text-shadow',
                },
                activeTheme,
              )
            "
          >
            Fullstack Developer
          </p>
        </span>
      </section>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.page-container {
  background-color: rgba($color: white, $alpha: 0.7);
  position: relative;

  @media (min-width: $breakpoint-md) {
    background-color: initial;
  }

  .carousel-background {
    position: fixed;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .weather-layer {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }

  .logo {
    display: none;
    position: absolute;
    top: 3%;
    left: 3%;
    z-index: 2;

    @media (min-width: $breakpoint-md) {
      display: flex !important;
      align-items: center;
      z-index: 10;

      .logo-text {
        padding-left: 0.5rem;
        font-size: 1.5rem;
      }
    }
  }

  .sub-container {
    flex: 1 1 0%;
    z-index: 2;
    @media (min-width: $breakpoint-md) {
      position: relative;
      padding: initial;
    }

    p:nth-of-type(1) {
      font-weight: bold;
      font-size: 1.5rem;
      line-height: 2.2rem;
      text-transform: uppercase;
    }

    p:nth-of-type(2) {
      font-size: 1rem;
    }

    .mobile-view {
      height: auto;

      @media (min-width: $breakpoint-sm) {
        display: none;
      }

      blockquote {
        border-left: 4px solid var(--q-dark);
        padding: 1rem 1.5rem;
        font-style: italic;
        background-color: rgba(0, 0, 0, 0.5);
        color: var(--q-primary);
        text-shadow: 1px 1px 20px var(--q-dark);
      }

      .expansion-item {
        .anchor {
          scroll-margin-top: 72px;

          @media (min-width: $breakpoint-md) {
            scroll-margin-top: 0;
          }
        }
      }
    }

    .desktop-view {
      display: none;

      @media (min-width: $breakpoint-sm) {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1 0 0%;
      }

      hr {
        background-color: var(--q-primary);
        width: 100px;
      }

      .name {
        font-size: 1.6rem;
      }

      .full-stack {
        font-size: 1.2rem;
      }

      a {
        color: var(--q-primary);
        cursor: pointer;
      }
    }
  }

  .contact-btn {
    display: none;
    position: absolute;
    max-width: 80px;
    bottom: 2rem;
    right: 2rem;

    @media (min-width: $breakpoint-md) {
      display: initial;
    }
  }
}

.resume {
  text-decoration: none;
}

.fall-text-shadow {
  text-shadow:
    -1px -1px 0 var(--q-dark),
    1px -1px 0 var(--q-dark),
    -1px 1px 0 var(--q-dark),
    1px 1px 0 var(--q-dark);
}

.winter-text-shadow {
  text-shadow:
    -1px -1px 0 var(--q-dark),
    1px -1px 0 var(--q-dark),
    -1px 1px 0 var(--q-dark),
    1px 1px 0 var(--q-dark);
}

.spring-text-shadow {
  text-shadow:
    -1px -1px 0 black,
    1px -1px 0 black,
    -1px 1px 0 black,
    1px 1px 0 black;
}

.summer-text-shadow {
  text-shadow:
    -1px -1px 0 black,
    1px -1px 0 black,
    -1px 1px 0 black,
    1px 1px 0 black;
}
</style>
