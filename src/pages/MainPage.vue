<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
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
import CaseStudiesSection from '../components/CaseStudiesSection.vue';
import { type Slide } from '../shared/types/slide';
import { QCarousel, scroll } from 'quasar';
import { Theme } from '../shared/constants/theme';
import WeatherBackground from '../components/WeatherBackground.vue';
import gsap from 'gsap';
import { useGsapTimeline } from '../shared/composables/useGsapTimeline';
import { type Mode } from '../shared/types/mode';
import { ViewType } from 'src/shared/constants/viewType';
import { getCustomCssVar } from 'src/shared/utils/getCustomCssVar';

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
const { getScrollTarget, setVerticalScrollPosition } = scroll;
const slide = ref<Theme>(Theme.Fall);
const { activeTheme, activeTopic, mobileScrollTarget } = storeToRefs(mainStore);
const expandedPanel = ref<TopicName | null>(null);
const root = ref<HTMLElement | null>(null);
const showFooter = ref<boolean>(false);
const io = ref<IntersectionObserver | null>(null);
const { resetSequence, kill } = useGsapTimeline();
let currentMode: Mode | null = null;

const buildAnimations = (el: HTMLElement, mode: Mode) => {
  if (mode === ViewType.Mobile) {
    resetSequence([
      {
        type: 'fromTo',
        targets: el.querySelectorAll(':scope .home-content'),
        from: { x: 200, autoAlpha: 0 },
        to: {
          x: 0,
          autoAlpha: 1,
          duration: 2,
          ease: 'bounce',
          stagger: 1,
          immediateRender: false,
        },
        at: 0,
      },
    ]);
  } else if (mode === ViewType.Desktop) {
    const nameEl = el.querySelector(':scope .desktop-view .name') as HTMLElement;
    const titleEl = el.querySelector(':scope .desktop-view .title') as HTMLElement;
    const sepEl = el.querySelector(':scope .desktop-view .separator') as HTMLElement;
    const simonEl = el.querySelector(':scope .desktop-view .simon ') as HTMLElement;
    const servicesDescriptionEl = el.querySelector(
      ':scope .desktop-view .services-description',
    ) as HTMLElement;

    gsap.killTweensOf([nameEl, titleEl, sepEl, titleEl, servicesDescriptionEl, simonEl]);

    resetSequence([
      // Name element
      { type: 'set', targets: nameEl, vars: { y: -200 }, at: 0 },
      {
        type: 'to',
        targets: nameEl,
        vars: {
          keyframes: [{ rotation: 15 }, { rotation: -10, y: -10 }, { rotation: 0, y: 0 }],
          ease: 'bounce',
          duration: 3.8,
        },
        at: 0, // starts at timeline position 0
      },
      // Simon Element
      {
        type: 'set',
        targets: simonEl,
        vars: { scale: 0, transformOrigin: '50% 50%', autoAlpha: 0 },
        at: 0,
      },
      {
        type: 'to',
        targets: simonEl,
        vars: {
          keyframes: [
            { scale: 0.5, rotation: 15, autoAlpha: 1 },
            { scale: 1.1, rotation: -10 },
            { scale: 1, rotation: 0 },
          ],
          ease: 'bounce',
          duration: 3.8,
        },
        at: 0, // overlaps name animation
      },
      // Separator
      { type: 'set', targets: sepEl, vars: { y: 150, autoAlpha: 0 } },

      {
        type: 'to',
        targets: sepEl,
        vars: { y: 0, ease: 'none', duration: 1, autoAlpha: 1 },
        at: 2,
      },
      // Title
      { type: 'set', targets: titleEl, vars: { y: 250 }, at: 0 },
      {
        type: 'to',
        targets: titleEl,
        vars: {
          y: 0,
          duration: 3,
          ease: 'bounce',
        },
        at: 2.5,
      },

      // Service Description
      { type: 'set', targets: servicesDescriptionEl, vars: { x: -100, autoAlpha: 0 }, at: 0 },
      {
        type: 'to',
        targets: servicesDescriptionEl,
        vars: {
          x: 0,
          autoAlpha: 1,
          ease: 'bounce',
          duration: 1.5,
        },
        at: 3.5,
      },
    ]);
  }
};

let animationId = 0;
const onResize = () => {
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(() => {
    const el = root.value;
    if (!el || !currentMode) return;
    buildAnimations(el, currentMode);
  });
};

const mm = gsap.matchMedia();

onMounted(async () => {
  await nextTick();
  const el = root.value;
  if (!el) return;

  const bp = getCustomCssVar('breakpoint-lg') || '1024px'; // should already be like "1024px"

  // Mobile
  // mm.add(`(max-width: ${bp})`, () => {
  //   currentMode = ViewType.Mobile;
  //   buildAnimations(el, ViewType.Mobile);
  //   return () => {
  //     currentMode = null;
  //     kill();
  //   };
  // });

  // Desktop
  mm.add(`(min-width: ${bp})`, () => {
    currentMode = ViewType.Desktop;
    buildAnimations(el, ViewType.Desktop);
    return () => {
      currentMode = null;
      kill();
    };
  });

  // window.addEventListener('resize', onResize);

  await mainStore.VERIFY_HUMANITY();

  const footerEl = document.getElementById('footer');
  if (!footerEl) return;

  const footerRoot = getScrollTarget(footerEl);
  io.value = new IntersectionObserver(
    ([entry]) => {
      showFooter.value = entry ? entry.isIntersecting : false;
    },
    {
      root: footerRoot === window ? null : (footerRoot as Element),
      threshold: 0,
      rootMargin: '0px',
    },
  );

  io.value.observe(footerEl);
});

onBeforeUnmount(() => {
  io.value?.disconnect();
  window.removeEventListener('resize', onResize);
  mm.kill();
});

watch(mobileScrollTarget, (newTopic) => {
  if (!newTopic) return;
  expandedPanel.value = newTopic;
});

watch(activeTopic, (newTopic: TopicName | null) => {
  if (!newTopic) return;
  expandedPanel.value = newTopic;
});

watch(slide, (newVal) => mainStore.SET_ACTIVE_THEME(newVal));

const scrollToFooter = () => {
  if (!showFooter.value) {
    const footerEl = document.getElementById('footer');
    if (!footerEl) return;
    const target = getScrollTarget(footerEl); // auto-detects the correct scrollable container
    const y = footerEl.offsetTop; // position inside that container
    setVerticalScrollPosition(target, y, 500); // smooth scroll (ms)
  } else {
    const logoEl = document.getElementById('logo');
    if (!logoEl) return;
    const target = getScrollTarget(logoEl); // auto-detects the correct scrollable container
    const y = logoEl.offsetHeight; // position inside that container
    setVerticalScrollPosition(target, y, 500); // smooth scroll (ms)
  }
};
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
    <div ref="root" class="sub-container column items-center">
      <section class="responsive-view full-width q-pa-md">
        <div class="home-contaier column text-primary bg-accent q-mb-sm q-pa-lg">
          <span>
            <p class="name home-content q-mb-none text-white">Grant Knaver</p>
            <p class="title home-content text-secondary">
              <span
                class="frontend text-white"
                :class="
                  setSeasonClasses(
                    {
                      Fall: 'dark-text-outline',
                      Winter: 'dark-text-outline',
                      Spring: 'dark-text-outline',
                      Summer: 'black-text-outline',
                    },
                    activeTheme,
                  )
                "
                >Frontend Developer</span
              >
              <span
                class="text-white"
                :class="
                  setSeasonClasses(
                    {
                      Fall: 'dark-text-outline',
                      Winter: 'dark-text-outline',
                      Spring: 'dark-text-outline',
                      Summer: 'black-text-outline',
                    },
                    activeTheme,
                  )
                "
              >
                •
              </span>
              <span
                class="gsap text-secondary"
                :class="
                  setSeasonClasses(
                    {
                      Fall: 'dark-text-outline',
                      Winter: 'dark-text-outline',
                      Spring: 'black-text-outline',
                      Summer: 'black-text-outline',
                    },
                    activeTheme,
                  )
                "
                >GSAP</span
              >
              <span
                class="text-white"
                :class="
                  setSeasonClasses(
                    {
                      Fall: 'dark-text-outline',
                      Winter: 'dark-text-outline',
                      Spring: 'black-text-outline',
                      Summer: 'black-text-outline',
                    },
                    activeTheme,
                  )
                "
              >
                &
              </span>
              <span
                class="text-secondary"
                :class="
                  setSeasonClasses(
                    {
                      Fall: 'dark-text-outline',
                      Winter: 'dark-text-outline',
                      Spring: 'black-text-outline',
                      Summer: 'black-text-outline',
                    },
                    activeTheme,
                  )
                "
                >AI Integration</span
              >
            </p>
            <q-separator></q-separator>
            <p class="services-description home-content text-white q-mt-md q-mb-none text-body-2">
              <i
                >I design and build interactive, high-performance web experiences that blend motion,
                data, and intelligence.</i
              >
            </p>
          </span>
        </div>
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
      <section class="desktop-view row justify-end items-center full-width">
        <div class="home-contaier q-pl-xl q-pr-xl column">
          <p
            class="name q-mb-lg text-body-1 text-left text-white"
            :class="
              setSeasonClasses(
                {
                  Fall: 'dark-text-outline',
                  Winter: 'dark-text-outline',
                  Spring: 'black-text-outline',
                  Summer: 'black-text-outline',
                },
                activeTheme,
              )
            "
          >
            Grant Knaver
          </p>
          <div class="row no-wrap">
            <SimonMenu class="simon"></SimonMenu>
            <div class="title-container column justify-center items-center q-pa-md">
              <div class="clip-container relative-position overflow-hidden">
                <p class="title full-width q-mb-lg q-pl-lg text-secondary text-left">
                  <span
                    class="frontend text-white"
                    :class="
                      setSeasonClasses(
                        {
                          Fall: 'dark-text-outline',
                          Winter: 'dark-text-outline',
                          Spring: 'dark-text-outline',
                          Summer: 'black-text-outline',
                        },
                        activeTheme,
                      )
                    "
                    >Frontend Developer</span
                  >
                  <span
                    class="text-white"
                    :class="
                      setSeasonClasses(
                        {
                          Fall: 'dark-text-outline',
                          Winter: 'dark-text-outline',
                          Spring: 'dark-text-outline',
                          Summer: 'black-text-outline',
                        },
                        activeTheme,
                      )
                    "
                  >
                    •
                  </span>
                  <span
                    class="gsap text-secondary"
                    :class="
                      setSeasonClasses(
                        {
                          Fall: 'dark-text-outline',
                          Winter: 'dark-text-outline',
                          Spring: 'black-text-outline',
                          Summer: 'black-text-outline',
                        },
                        activeTheme,
                      )
                    "
                    >GSAP</span
                  >
                  <span
                    class="text-white"
                    :class="
                      setSeasonClasses(
                        {
                          Fall: 'dark-text-outline',
                          Winter: 'dark-text-outline',
                          Spring: 'black-text-outline',
                          Summer: 'black-text-outline',
                        },
                        activeTheme,
                      )
                    "
                  >
                    &
                  </span>
                  <span
                    class="text-secondary"
                    :class="
                      setSeasonClasses(
                        {
                          Fall: 'dark-text-outline',
                          Winter: 'dark-text-outline',
                          Spring: 'black-text-outline',
                          Summer: 'black-text-outline',
                        },
                        activeTheme,
                      )
                    "
                    >AI Integration</span
                  >
                </p>
              </div>
              <q-separator class="separator bg-accent text-seon"></q-separator>
            </div>
          </div>

          <div
            class="services-description start-animation row q-mt-md q-pa-md text-bold wrap justify-center text-white test"
            :class="
              setSeasonClasses(
                {
                  Fall: 'black-text-outline',
                  Winter: 'black-text-outline',
                  Spring: 'black-text-outline',
                  Summer: ' text-white black-text-outline',
                },
                activeTheme,
              )
            "
          >
            <i
              >I design and build interactive, high-performance web experiences that blend motion,
              data, and intelligence.</i
            >
          </div>
        </div>
        <q-btn
          id="showFooterBtn"
          round
          color="accent"
          :icon="!showFooter ? 'south' : 'north'"
          class="q-px-sm"
          @click="scrollToFooter"
          aria-label="Scroll to footer"
        />
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

    @media (min-width: $breakpoint-lg) {
      display: flex !important;
      align-items: center;
      z-index: 2;

      .logo-text {
        padding-left: 0.5rem;
        font-size: 1.5rem;
      }
    }
  }

  .sub-container {
    flex: 1 1 0%;
    z-index: 2;

    @media (min-width: $breakpoint-lg) {
      position: relative;
      padding: initial;
    }

    p:nth-of-type(1) {
      font-weight: bold;
      line-height: 2.2rem;
      text-transform: uppercase;
    }

    p:nth-of-type(2) {
      font-size: 1rem;
    }

    .responsive-view {
      height: auto;

      @media (min-width: $breakpoint-md) {
        max-width: 800px;
      }

      @media (min-width: $breakpoint-lg) {
        display: none;
      }

      .home-content {
        // opacity: 0;
      }

      .name {
        font-size: 1.5rem;
      }
      .title {
        font-size: 1.2rem;
      }
    }

    .desktop-view {
      display: none;

      @media (min-width: $breakpoint-lg) {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1 0 0%;
        position: relative;
      }

      .home-contaier {
        margin-top: 4rem;
        max-width: 700px;

        .name {
          transform: translateY(-200px);
          font-size: 1.8rem;
        }
        .simon {
          opacity: 0;
          width: 45%;
          min-width: 275px;
          max-width: 275px;
          scale: 0;
          transform-origin: 50% 50%;
        }

        .title-container {
          width: 55%;

          .title {
            transform: translateY(250px);
            font-size: 1.4rem;
          }

          .separator {
            opacity: 0;
            width: 75%;
            transform: translateY(150px);
          }
        }

        .services-description {
          position: relative;
          z-index: 1;
          font-size: 1.2rem;
          opacity: 0;
          transform: translateX(-100px);
          border-radius: 5px;
        }

        .services-description::before {
          content: '';
          position: absolute;
          inset: 0; /* cover entire element */
          background-color: rgba(black, 0.4);
          filter: blur(20px);
          z-index: -1;
          margin: -10px; /* expands the blurred area beyond edges */
        }
      }

      #showFooterBtn {
        position: absolute;
        bottom: 1rem;
        left: 1rem;
      }
    }
  }
}
</style>
