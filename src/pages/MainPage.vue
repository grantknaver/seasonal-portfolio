<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, computed, onMounted } from 'vue';
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
import { ViewType } from '../shared/constants/viewType';
import { useViewport } from '../shared/utils/viewWidth';
import { waitForLayout } from 'src/shared/utils/waitForLayout';
import { areElements } from 'src/shared/utils/areElements';

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
const { lgBreakpoint, width } = useViewport();
const isNotDesktop = computed(() => width.value < lgBreakpoint);
const dispose = ref<() => void>(() => {});
const nameRef = ref<HTMLElement | null>(null);
const simonRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const sepRef = ref<HTMLElement | null>(null);
const servRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();
  await waitForLayout(root.value);
  dispose.value = buildAnimations(isNotDesktop.value ? ViewType.NotDesktop : ViewType.Desktop);
});

watch(
  isNotDesktop,
  async (viewNow) => {
    try {
      dispose.value();
    } catch (e) {
      console.log(e);
    }
    await nextTick();
    await waitForLayout(root.value);
    dispose.value = buildAnimations(viewNow ? ViewType.NotDesktop : ViewType.Desktop);
  },
  { flush: 'post' },
);

onBeforeUnmount(() => {
  io.value?.disconnect();
  try {
    dispose.value();
  } catch (e) {
    console.log('onBeforeUnmount dispose err', e);
  }
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

const buildAnimations = (mode: ViewType) => {
  const el = root.value;
  if (!el) return () => {};
  const desktopEls = [nameRef.value, simonRef.value, titleRef.value, sepRef.value, servRef.value];

  // Only animate desktop in this block
  if (mode !== ViewType.Desktop) return () => {};

  if (!areElements(desktopEls)) return () => {};

  gsap.killTweensOf(desktopEls);
  gsap.set(desktopEls, { clearProps: 'all' });

  gsap.fromTo(
    nameRef.value,
    { y: -150, autoAlpha: 0, rotation: 0 },
    {
      keyframes: [{ rotation: 15 }, { rotation: -10, y: -10 }, { rotation: 0, y: 0 }],
      autoAlpha: 1,
      ease: 'bounce.out',
      duration: 3.8,
      overwrite: 'auto',
    },
  );

  gsap.fromTo(
    simonRef.value,
    {
      scale: 0,
      autoAlpha: 0,
      rotation: 0,
      transformOrigin: '50% 50%',
    },
    {
      keyframes: [
        { scale: 0.5, rotation: 15, autoAlpha: 1 },
        { scale: 1.1, rotation: -10 },
        { scale: 1, rotation: 0 },
      ],
      ease: 'bounce.out',
      duration: 3.8,
      overwrite: 'auto',
    },
  );

  gsap.fromTo(
    titleRef.value,
    { y: 150, autoAlpha: 0 },
    {
      keyframes: [{ y: 0, autoAlpha: 1 }],
      ease: 'bounce.out',
      duration: 3,
      overwrite: 'auto',
    },
  );

  gsap.fromTo(
    sepRef.value,
    { y: 150, autoAlpha: 0 },
    {
      keyframes: [{ y: 0, autoAlpha: 1 }],
      ease: 'bounce.out',
      duration: 1,
      overwrite: 'auto',
    },
  );

  gsap.fromTo(
    servRef.value,
    { x: -100, autoAlpha: 0 },
    {
      keyframes: [{ x: 0, autoAlpha: 1 }],
      ease: 'bounce.out',
      duration: 1.5,
      overwrite: 'auto',
    },
  );

  // Cleanup
  return () => {
    gsap.killTweensOf([desktopEls]);
    gsap.set([desktopEls], { clearProps: 'all' });
  };
};

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
      <section v-if="isNotDesktop" key="mobile" class="responsive-view full-width q-pa-md">
        <div class="home-container column text-primary bg-accent q-mb-sm q-pa-lg">
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
                >Frontend Developer {{ isNotDesktop }}</span
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
      <section
        v-if="!isNotDesktop"
        key="desktop"
        class="desktop-view row justify-end items-center full-width"
      >
        <div class="home-container q-pl-xl q-pr-xl column">
          <p
            ref="nameRef"
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
            <div ref="simonRef" class="simon"><SimonMenu></SimonMenu></div>
            <div class="title-container column justify-center items-center q-pa-md">
              <div class="clip-container relative-position overflow-hidden">
                <p ref="titleRef" class="title full-width q-mb-lg q-pl-lg text-secondary text-left">
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
              <div ref="sepRef" class="separator bg-accent text-secondary">
                <q-separator></q-separator>
              </div>
            </div>
          </div>

          <div
            ref="servRef"
            class="services-description start-animation row q-mt-md q-pa-md text-bold wrap justify-center text-white"
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
// .page-container {
//   background-color: rgba($color: white, $alpha: 0.7);
//   position: relative;

//   @media (min-width: $breakpoint-md) {
//     background-color: initial;
//   }

//   .carousel-background {
//     position: fixed;
//     height: 100%;
//     top: 0;
//     left: 0;
//     z-index: 0;
//     width: 100%;
//     pointer-events: none;
//     overflow: hidden;
//   }

//   .weather-layer {
//     position: fixed;
//     inset: 0;
//     z-index: 1;
//     pointer-events: none;
//     overflow: hidden;
//   }

//   .logo {
//     display: none;
//     position: absolute;
//     top: 3%;
//     left: 3%;
//     z-index: 2;

//     @media (min-width: $breakpoint-lg) {
//       display: flex !important;
//       align-items: center;
//       z-index: 2;

//       .logo-text {
//         padding-left: 0.5rem;
//         font-size: 1.5rem;
//       }
//     }
//   }

//   .sub-container {
//     flex: 1 1 0%;
//     z-index: 2;

//     @media (min-width: $breakpoint-lg) {
//       position: relative;
//       padding: initial;
//     }

//     p:nth-of-type(1) {
//       font-weight: bold;
//       line-height: 2.2rem;
//       text-transform: uppercase;
//     }

//     p:nth-of-type(2) {
//       font-size: 1rem;
//     }

//     .responsive-view {
//       height: auto;
//       max-width: 800px;

//       @media (min-width: $breakpoint-md) {
//         max-width: 1000px;
//       }

//       .home-content {
//         // opacity: 0;
//       }

//       .name {
//         font-size: 1.5rem;
//       }
//       .title {
//         font-size: 1.2rem;
//       }
//     }

//     .desktop-view {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       flex: 1 0 0%;
//       position: relative;

//       .home-container {
//         margin-top: 4rem;
//         max-width: 700px;

//         .name {
//           // opacity: 0;
//           // transform: translateY(-150px);
//           font-size: 1.8rem;
//         }
//         .simon {
//           // opacity: 0;
//           width: 45%;
//           min-width: 275px;
//           max-width: 275px;
//           scale: 0;
//           transform-origin: 50% 50%;
//         }

//         .title-container {
//           width: 55%;
//           .title {
//             font-size: 1.4rem;
//           }

//           .separator {
//             // opacity: 0;
//             width: 75%;
//             // transform: translateY(150px);
//           }
//         }

//         .services-description {
//           position: relative;
//           z-index: 1;
//           font-size: 1.2rem;
//           // opacity: 0;
//           // transform: translateX(-100px);
//           border-radius: 5px;
//         }

//         .services-description::before {
//           content: '';
//           position: absolute;
//           inset: 0; /* cover entire element */
//           background-color: rgba(black, 0.4);
//           filter: blur(20px);
//           z-index: -1;
//           margin: -10px; /* expands the blurred area beyond edges */
//         }
//       }

//       #showFooterBtn {
//         position: absolute;
//         bottom: 1rem;
//         left: 1rem;
//       }
//     }
//   }
// }

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

    /* ---------- Mobile / NotDesktop ---------- */
    .responsive-view {
      height: auto;
      max-width: 800px;

      @media (min-width: $breakpoint-md) {
        max-width: 1000px;
      }

      .name {
        font-size: 1.5rem;
      }
      .title {
        font-size: 1.2rem;
      }
    }

    /* ---------- Desktop ---------- */
    .desktop-view {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1 0 0%;
      position: relative;

      .home-container {
        margin-top: 4rem;
        max-width: 700px;

        /* NOTE: No opacity/transform here; GSAP controls them */
        .name {
          font-size: 1.8rem;
        }

        .simon {
          width: 45%;
          min-width: 275px;
          max-width: 275px;
          /* no transform-origin/scale here; GSAP sets them */
        }

        .title-container {
          width: 55%;

          .title {
            font-size: 1.4rem; /* GSAP handles opacity/transform */
          }

          .separator {
            width: 75%; /* GSAP handles opacity/transform */
          }
        }

        .services-description {
          position: relative;
          z-index: 1;
          font-size: 1.2rem;
          border-radius: 5px; /* GSAP handles opacity/transform */
        }

        .services-description::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: rgba(black, 0.4);
          filter: blur(20px);
          z-index: -1;
          margin: -10px;
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
