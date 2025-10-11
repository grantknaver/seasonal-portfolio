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
import CaseStudiesSection from 'src/components/CaseStudiesSection.vue';
import { type Slide } from '../shared/types/slide';
import { QCarousel, scroll } from 'quasar';
import { Theme } from '../shared/constants/theme';
import WeatherBackground from '../components/WeatherBackground.vue';
import gsap from 'gsap';
import { vw } from '../shared/utils/viewWidth';
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
const headerHeight = ref<number>(0);
const root = ref<HTMLElement | null>(null);
const showFooter = ref<boolean>(false);
const io = ref<IntersectionObserver | null>(null);
const introTimelines = {
  responsiveTimeline: gsap.timeline({ paused: true }),
  desktopTimeline: gsap.timeline({ paused: true }),
};
const startResponsiveIntroAnimation = (el: HTMLElement) => {
  console.log('startResponsiveIntroAnimation', el);
  // const { responsiveTimeline } = introTimelines;
  // const desktopNameEl = el.querySelector('.desktop-name') as HTMLElement;
  // const desktopTitleEl = el.querySelector('.desktop-title-content') as HTMLElement;
  // const desktopSepEl = el.querySelector('.desktop-separator') as HTMLElement;
  // const desktopServicesDescription = el.querySelector(
  //   '.desktop-services-description',
  // ) as HTMLElement;

  // gsap.set(desktopNameEl, { y: -200 });
  // gsap.set('.simon', { scale: 0, transformOrigin: '50% 50%' });
  // gsap.set(desktopSepEl, { y: 150, autoAlpha: 0 });
  // gsap.set(desktopTitleEl, { y: 123, autoAlpha: 0 });
  // gsap.set(desktopServicesDescription, { x: -100, autoAlpha: 0 });

  // // // Name animation
  // desktopTimeline.to(desktopNameEl, {
  //   keyframes: {
  //     '0%': { rotation: 15 },
  //     '50%': { rotation: -10 },
  //     '100%': { rotation: 0, y: 0 },
  //   },
  //   ease: 'bounce',
  //   duration: 3.8,
  // });

  // // // Simon animation
  // desktopTimeline.to(
  //   '.simon',
  //   {
  //     keyframes: {
  //       '0%': { scale: 0.5, rotation: 15 },
  //       '10%': { scale: 0.5, rotation: 15, autoAlpha: 1 },
  //       '50%': { scale: 1.1, rotation: -10 },
  //       '100%': { scale: 1, rotation: 0 },
  //     },
  //     ease: 'bounce',
  //     duration: 3.8,
  //   },
  //   0,
  // ); // Overlaps with name animation

  // // // Separator animation (starts later)
  // desktopTimeline.to(desktopSepEl, { y: 0, autoAlpha: 1, ease: 'none', duration: 1 }, 1.8);

  // // // Move title to final position, GAP_PERCENT above separator
  // desktopTimeline.to(
  //   desktopTitleEl,
  //   {
  //     keyframes: {
  //       '5%': { autoAlpha: 1 },
  //       '100%': { y: 0 },
  //     },
  //     duration: 1.5,
  //     ease: 'bounce',
  //   },
  //   3,
  // );

  // // // Services description appears later
  // desktopTimeline.to(
  //   desktopServicesDescription,
  //   {
  //     x: 0,
  //     autoAlpha: 1,
  //     ease: 'bounce',
  //     duration: 1.5,
  //   },
  //   3.5,
  // );
};
const desktopBreakpoint = +getCustomCssVar('breakpoint-lg').slice(0, -2);
const startDesktopIntroAnimation = (el: HTMLElement) => {
  const { desktopTimeline } = introTimelines;
  const desktopNameEl = el.querySelector('.desktop-name') as HTMLElement;
  const desktopTitleEl = el.querySelector('.desktop-title') as HTMLElement;
  const desktopSepEl = el.querySelector('.desktop-separator') as HTMLElement;
  const desktopServicesDescription = el.querySelector(
    '.desktop-services-description',
  ) as HTMLElement;

  gsap.set(desktopNameEl, { y: -200 });
  gsap.set('.simon', { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(desktopSepEl, { y: 150, autoAlpha: 0 });
  gsap.set(desktopTitleEl, { y: 123, autoAlpha: 0 });
  gsap.set(desktopServicesDescription, { x: -100, autoAlpha: 0 });

  // // Name animation
  desktopTimeline.to(desktopNameEl, {
    keyframes: {
      '0%': { rotation: 15 },
      '50%': { rotation: -10 },
      '100%': { rotation: 0, y: 0 },
    },
    ease: 'bounce',
    duration: 3.8,
  });

  // // Simon animation
  desktopTimeline.to(
    '.simon',
    {
      keyframes: {
        '0%': { scale: 0.5, rotation: 15 },
        '10%': { scale: 0.5, rotation: 15, autoAlpha: 1 },
        '50%': { scale: 1.1, rotation: -10 },
        '100%': { scale: 1, rotation: 0 },
      },
      ease: 'bounce',
      duration: 3.8,
    },
    0,
  ); // Overlaps with name animation

  // // Separator animation (starts later)
  desktopTimeline.to(desktopSepEl, { y: 0, autoAlpha: 1, ease: 'none', duration: 1 }, 1.8);

  // // Move title to final position, GAP_PERCENT above separator
  desktopTimeline.to(
    desktopTitleEl,
    {
      keyframes: {
        '5%': { autoAlpha: 1 },
        '100%': { y: 0 },
      },
      duration: 1.5,
      ease: 'bounce',
    },
    3,
  );

  // // Services description appears later
  desktopTimeline.to(
    desktopServicesDescription,
    {
      x: 0,
      autoAlpha: 1,
      ease: 'bounce',
      duration: 1.5,
    },
    3.5,
  );
  desktopTimeline.play();
};

const startIntroAnimation = (el: HTMLElement) => {
  if (vw() < desktopBreakpoint) {
    startResponsiveIntroAnimation(el);
  } else {
    startDesktopIntroAnimation(el);
  }
};

onMounted(async () => {
  await nextTick();
  const el = root.value;
  if (!el) return;

  gsap.context(() => {
    startIntroAnimation(el);
  }, el);

  // --- Other logic (unchanged) ---
  await mainStore.VERIFY_HUMANITY();

  window.addEventListener('resize', () => {
    headerHeight.value = document.getElementById('mobile-header')?.offsetHeight ?? 0;
  });

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
    <div ref="root" class="sub-container column">
      <section class="responsive-view full-width q-pa-md">
        <div class="responsive-home-contaier column text-primary bg-accent q-mb-sm q-pa-lg">
          <span>
            <p class="responsive-name q-mb-none text-white">Grant Knaver</p>
            <p class="responsive-title text-secondary">
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
            <p class="responsive-services-description q-mt-md q-mb-none text-body-2">
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
        <div class="desktop-home-contaier q-pl-xl q-pr-xl column">
          <p
            class="desktop-name q-mb-lg text-body-1 text-left text-white"
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
          <div class="simon-container row no-wrap">
            <SimonMenu class="simon"></SimonMenu>
            <div class="desktop-title-container row items-center full-width q-pa-md">
              <p class="desktop-title full-width q-mb-none q-pl-lg text-secondary text-left">
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
          </div>
          <q-separator
            class="desktop-separator q-mt-lg full-width bg-accent text-seon"
          ></q-separator>
          <div
            class="desktop-services-description start-animation row q-mt-md q-pa-md text-bold wrap justify-center text-white test"
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

      @media (min-width: $breakpoint-lg) {
        display: none;
      }

      .responsive-home-contaier {
        .responsive-name {
          font-size: 1.5rem;
        }
        .responsive-title {
          font-size: 1.2rem;
        }
        .responsive-services-description {
        }
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

      .desktop-home-contaier {
        margin-top: 4rem;
        max-width: 700px;

        .desktop-name {
          font-size: 1.8rem;
          transform: translateY(-200px);
        }
        .simon-container {
          .simon {
            opacity: 0;
            width: 65%;
            min-width: 275px;
            max-width: 275px;
            scale: 0;
            transform-origin: 50% 50%;
          }

          .desktop-title-container {
            width: 35%;

            .desktop-title {
              width: 35%;
              opacity: 0;
              transform: translateY(123px);
              font-size: 1.4rem;
            }
          }
        }

        .desktop-separator {
          opacity: 0;
          transform: translateY(150px);
        }

        .desktop-services-description {
          position: relative;
          z-index: 1;
          font-size: 1.2rem;
          opacity: 0;
          transform: translateX(-100px);
          border-radius: 5px;
        }

        .desktop-services-description::before {
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
