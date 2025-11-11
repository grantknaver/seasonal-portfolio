<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, computed, onMounted } from 'vue';
import { useMainStore } from '../stores/main';
import { type Topic } from '../shared/types/topic';
import { v4 as uuidv4 } from 'uuid';
import { storeToRefs } from 'pinia';
import { TopicName } from '../shared/constants/topicName';
import { setSeasonClasses } from '../shared/utils/setSeasonColors';
import SimonMenu from '../components/SimonMenu.vue';
import { type Slide } from '../shared/types/slide';
import { QCarousel, scroll } from 'quasar';
import { Theme } from '../shared/constants/theme';
import gsap from 'gsap';
import { ViewType } from '../shared/constants/viewType';
import { useViewport } from '../shared/utils/viewWidth';
import { waitForLayout } from 'src/shared/utils/waitForLayout';
import { flattenElements } from '../shared/utils/flattenElements';
import { defineAsyncComponent } from 'vue';

const AboutSection = defineAsyncComponent(() => import('../components/AboutSection.vue'));
const ContactSection = defineAsyncComponent(() => import('../components/ContactSection.vue'));
const PackageSection = defineAsyncComponent(() => import('../components/PackageSection.vue'));
const CaseStudiesSection = defineAsyncComponent(
  () => import('../components/CaseStudiesSection.vue'),
);
const WeatherBackground = defineAsyncComponent(() => import('../components/WeatherBackground.vue'));

import {
  mdiChevronUp,
  mdiBookOpenPageVariant,
  mdiTruckDelivery,
  mdiInformationOutline,
  mdiEmailBox,
} from '@quasar/extras/mdi-v7';
import { mdiChevronDown } from '@quasar/extras/mdi-v7';

const mainStore = useMainStore();
const mobileTopics: Topic[] = [
  {
    id: uuidv4(),
    name: TopicName.CaseStudies,
    icon: mdiBookOpenPageVariant,
    label: TopicName.CaseStudies,
  },
  { id: uuidv4(), name: TopicName.Packages, icon: mdiTruckDelivery, label: 'Packages' },
  {
    id: uuidv4(),
    name: TopicName.About,
    icon: mdiInformationOutline,
    label: TopicName.About,
  },

  {
    id: uuidv4(),
    name: TopicName.Contact,
    icon: mdiEmailBox,
    label: TopicName.Contact,
  },
];

import autumn from 'src/assets/autumn-forestry.jpg?w=800;1280;2000&format=avif;webp;jpg&as=picture';
import winter from 'src/assets/snowy-winter-landscape.jpg?w=800;1280;2000&format=avif;webp;jpg&as=picture';
import spring from 'src/assets/beautiful-forest-spring-season.jpg?w=800;1280;2000&format=avif;webp;jpg&as=picture';
import summer from 'src/assets/beach.jpg?w=800;1280;2000&format=avif;webp;jpg&as=picture';

const slides = ref<Slide[]>([
  {
    id: uuidv4(),
    img: autumn,
    theme: Theme.Fall,
    name: 'Fall Background',
  },
  {
    id: uuidv4(),
    img: winter,
    theme: Theme.Winter,
    name: 'Winter Background',
  },
  {
    id: uuidv4(),
    img: spring,
    theme: Theme.Spring,
    name: 'Spring Background',
  },
  {
    id: uuidv4(),
    img: summer,
    theme: Theme.Summer,
    name: 'Summer Background',
  },
]);
const { getScrollTarget, setVerticalScrollPosition } = scroll;
const slide = ref<Theme>(Theme.Fall);
const { activeTheme, activeTopic, mobileScrollTarget } = storeToRefs(mainStore);
const expandedPanel = ref<TopicName | null>(TopicName.CaseStudies);
const root = ref<HTMLElement | null>(null);
const showFooter = ref<boolean>(false);
const io = ref<IntersectionObserver | null>(null);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);
const dispose = ref<() => void>(() => {});
const nameRef = ref<HTMLElement | null>(null);
const simonRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);
const sepRef = ref<HTMLElement | null>(null);
const servRef = ref<HTMLElement | null>(null);
const ctaBtnRef = ref<HTMLElement | null>(null);
const homeContainerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();
  await waitForLayout(root.value);
  dispose.value = buildAnimations(isResponsive.value ? ViewType.Responsive : ViewType.Desktop);
  await mainStore.VERIFY_IS_HUMAN();
});

watch(
  isResponsive,
  async (viewNow) => {
    try {
      dispose.value();
    } catch (e) {
      console.log(e);
    }
    if (!activeTopic.value) {
      expandedPanel.value = TopicName.CaseStudies;
    }
    expandedPanel.value = activeTopic.value;
    await nextTick();
    await waitForLayout(root.value);
    dispose.value = buildAnimations(viewNow ? ViewType.Responsive : ViewType.Desktop);
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

watch(
  activeTopic,
  async (newTopic: TopicName | null) => {
    await nextTick();
    const el = homeContainerRef.value;
    if (!el) return;

    if (!newTopic) {
      gsap.to(el, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      return;
    }

    gsap.to(el, {
      scale: 0.8,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    expandedPanel.value = newTopic;
  },
  { immediate: true },
);

watch(slide, (newVal) => mainStore.SET_ACTIVE_THEME(newVal));

const buildAnimations = (mode: ViewType) => {
  const el = root.value;
  if (!el) return () => {};
  const homeConentEls = document.querySelectorAll('.home-content');
  const responsiveEls = [homeConentEls];
  const desktopEls = [nameRef.value, simonRef.value, titleRef.value, sepRef.value, servRef.value];
  if (mode === ViewType.Responsive) {
    if (!flattenElements(responsiveEls)) return () => {};
    gsap.killTweensOf(responsiveEls);
    gsap.set(responsiveEls, { clearProps: 'all' });

    gsap.fromTo(
      homeConentEls,
      { x: 150, autoAlpha: 0 },
      {
        keyframes: [{ x: 0, autoAlpha: 1 }],
        ease: 'bounce',
        duration: 1,
        overwrite: 'auto',
        stagger: 1,
      },
    );
  }
  // Only animate desktop in this block
  if (mode === ViewType.Desktop) {
    if (!flattenElements(desktopEls)) return () => {};
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
        delay: 2,
      },
    );

    gsap.fromTo(
      ctaBtnRef.value,
      { y: 50, autoAlpha: 0 },
      {
        keyframes: [{ y: 0, autoAlpha: 1 }],
        ease: 'power2.out',
        duration: 1,
        overwrite: 'auto',
        delay: 2.5,
      },
    );
  }

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
        <q-carousel-slide
          v-for="(slide, index) in slides"
          :key="slide.id"
          :name="slide.theme"
          class="relative-position"
        >
          <!-- Your custom background layer -->
          <div class="slide-bg">
            <picture>
              <source
                v-for="(src, srcIndex) in slide.img.sources"
                :key="srcIndex"
                :srcset="src.srcset"
                :type="src.type"
              />
              <img
                :src="slide.img.img.src"
                :srcset="slide.img.img.srcset"
                :width="slide.img.img.width"
                :height="slide.img.img.height"
                fetchpriority="high"
                :loading="index === 0 ? 'eager' : 'lazy'"
                decoding="async"
                :alt="slide.name"
              />
            </picture>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
    <div class="weather-layer">
      <WeatherBackground />
    </div>
    <div class="logo">
      <img
        class="q-pt-sm"
        style="max-width: 65px"
        src="../assets/glkfreelance-logo.avif"
        alt="logo"
      />
      <span class="logo-text"
        ><span class="text-secondary">glk</span
        ><span class="text-primary-font text-white">Freelance</span></span
      >
    </div>
    <div ref="root" class="sub-container column items-center">
      <section v-if="isResponsive" key="mobile" class="responsive-view full-width q-pa-md">
        <div
          class="home-container relative-position full-width column items-start text-primary-font q-mb-sm q-pa-lg font-primary"
        >
          <p
            class="name home-content q-mb-none text-white"
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
          <p class="title home-content text-body-1 text-secondary q-mb-none black-text-glow">
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
          <div ref="sepRef" class="home-content column full-width q-mt-md q-mb-md">
            <q-separator class="font-bold" color="primary"></q-separator>
          </div>
          <p
            class="services-description home-content text-white font-bold q-mt-sm q-mb-none text-center"
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
            I design and build interactive, high-performance web experiences that blend motion,
            data, and intelligence.
          </p>
        </div>
        <q-list class="full-width font-primary">
          <q-item
            v-for="topic in mobileTopics"
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
              <template v-if="topic.name === TopicName.Contact">
                <div :id="topic.name" class="full-width">
                  <ContactSection />
                </div>
              </template>
            </q-expansion-item>
          </q-item>
        </q-list>
      </section>
      <section
        v-if="!isResponsive"
        key="desktop"
        class="desktop-view row justify-end items-center full-width"
      >
        <div ref="homeContainerRef" class="home-container q-pl-xl q-pr-xl column">
          <p
            v-if="!activeTopic"
            ref="nameRef"
            class="name q-mb-lg text-body-1 text-left text-white"
            :class="
              setSeasonClasses(
                {
                  Fall: 'secondary-font fall-secondary dark-text-outline',
                  Winter: 'secondary-font winter-secondary dark-text-outline',
                  Spring: 'secondary-font spring-secondary black-text-outline',
                  Summer: 'secondary-font summer-secondary black-text-outline',
                },
                activeTheme,
              )
            "
          >
            Grant Knaver
          </p>
          <div class="row no-wrap">
            <div ref="simonRef" class="simon"><SimonMenu></SimonMenu></div>
            <div
              v-if="!activeTopic"
              class="title-container column justify-center items-center q-pa-md"
            >
              <div class="clip-container relative-position overflow-hidden">
                <p
                  ref="titleRef"
                  class="title full-width text-body-2 text-center q-mb-lg q-pl-lg text-secondary"
                  :class="
                    setSeasonClasses(
                      {
                        Fall: 'secondary-font fall-secondary',
                        Winter: 'secondary-font winter-secondary',
                        Spring: 'secondary-font spring-secondary',
                        Summer: 'secondary-font summer-secondary',
                      },
                      activeTheme,
                    )
                  "
                >
                  <span
                    class="frontend text-white"
                    :class="
                      setSeasonClasses(
                        {
                          Fall: 'dark-text-outline',
                          Winter: ' dark-text-outline',
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
                    class="text-secondary"
                    :class="
                      setSeasonClasses(
                        {
                          Fall: 'fall-secondary dark-text-outline',
                          Winter: 'winter-secondary dark-text-outline',
                          Spring: 'spring-secondary black-text-outline',
                          Summer: 'summer-secondary black-text-outline',
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
                          Fall: 'fall-secondary dark-text-outline',
                          Winter: 'winter-secondary dark-text-outline',
                          Spring: 'spring-secondary black-text-outline',
                          Summer: 'summer-secondary black-text-outline',
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
                          Fall: 'fall-secondary dark-text-outline',
                          Winter: 'winter-secondary dark-text-outline',
                          Spring: 'spring-secondary black-text-outline',
                          Summer: 'summer-secondary black-text-outline',
                        },
                        activeTheme,
                      )
                    "
                    >AI Integration</span
                  >
                </p>
              </div>
              <div ref="sepRef" class="separator">
                <q-separator color="primary"></q-separator>
              </div>
              <div ref="ctaBtnRef">
                <q-btn class="q-mt-md" color="accent" size="lg" glossy>
                  <span class="text-body-2">Hire Me for Your Next AI UI </span>
                </q-btn>
              </div>
            </div>
          </div>

          <div
            ref="servRef"
            v-if="!activeTopic"
            class="services-description row q-mt-md q-pa-md wrap justify-center start-animation text-white text-bold"
            :class="
              setSeasonClasses(
                {
                  Fall: 'primary-font dark-text-outline',
                  Winter: 'primary-font dark-text-outline',
                  Spring: 'primary-font dark-text-outline',
                  Summer: 'primary-font text-white black-text-outline',
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
          :icon="!showFooter ? mdiChevronUp : mdiChevronDown"
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

    .slide-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }
    .slide-bg img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
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

    @media (min-width: $breakpoint-lg) {
      position: relative;
      padding: initial;
    }

    p:nth-of-type(1) {
      font-weight: bold;
      line-height: 2.2rem;
      text-transform: uppercase;
    }

    // p:nth-of-type(2) {
    //   font-size: 1rem;
    // }

    /* ---------- Mobile / NotDesktop ---------- */

    .responsive-view {
      height: auto;
      max-width: 600px;

      @media (min-width: $breakpoint-md) {
        max-width: 800px;
      }

      .home-container {
        background: color-mix(in srgb, black 30%, transparent);
        border-radius: 0.5rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        padding: 1.5rem;

        .name {
          font-size: 1.5rem;
        }

        .services-description {
          font-size: 1.3rem;
          line-height: 2rem;
        }
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
          width: 40%;
          min-width: 275px;
          max-width: 275px;
          /* no transform-origin/scale here; GSAP sets them */
        }

        .title-container {
          width: 60%;

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
