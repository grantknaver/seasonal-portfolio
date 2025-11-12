<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { setSeasonClasses } from 'src/shared/utils/setSeasonColors';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { type AboutBulletPoints } from 'src/shared/types/aboutBulletPoints';
import { hasScrollbar } from 'src/shared/utils/hasScrollbar';
import { type PastClient } from 'src/shared/types/pastClient';

const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const getImg = (file: string) => new URL(`../assets/${file}`, import.meta.url).href;
const generalBullets = ref<AboutBulletPoints[]>([
  {
    src: getImg('gsap-animation.avif'),
    label: 'GSAP animations',
    id: uuidv4(),
    text: 'I use GSAP to build smooth, modern animations that give your site personality. Motion guides the user’s eye, makes interactions feel natural, and adds that “alive” quality your competitors won’t have.',
  },
  {
    src: getImg('interactive-data-visualization.avif'),
    label: 'Interactive data visualizations',
    id: uuidv4(),
    text: 'With D3 and Highcharts, I transform raw data into visuals that actually tell a story. Whether it’s a dashboard or a product demo, I design charts that are both insightful and engaging.',
  },
  {
    src: getImg('ai-integration.avif'),
    label: 'AI integrations',
    id: uuidv4(),
    text: 'From chatbots to voice narration, I integrate AI tools that make your app more intuitive and useful. It’s about creating smarter experiences that save time and keep users engaged.',
  },
]);
const myApproachBullets = ref<AboutBulletPoints[]>([
  {
    src: getImg('creative-engineering.avif'),
    label: 'Creative engineering',
    id: uuidv4(),
    text: 'I combine strong frontend skills (Vue, Angular, GSAP) with a designer’s eye (Figma) to build experiences that look as good as they perform.',
  },
  {
    src: getImg('future-proof-thinking.avif'),
    label: 'Future-proof thinking',
    id: uuidv4(),
    text: 'I don’t just build for today. I integrate AI tools and best practices that keep your product relevant, scalable, and ahead of the curve.',
  },
  {
    src: getImg('collaborative-mindset.avif'),
    label: 'Collaborative mindset',
    id: uuidv4(),
    text: 'I work as a partner, not just a coder. That means clear communication, shared problem solving, and building solutions that fit your vision.',
  },
]);
const whyClientsBullets = ref<AboutBulletPoints[]>([
  {
    src: getImg('fast-results.avif'),
    label: 'Fast results',
    id: uuidv4(),
    text: 'I turn concepts into polished demos quickly, helping you test ideas and capture attention without long wait times.',
  },
  {
    src: getImg('scalable-systems.avif'),
    label: 'Scalable systems',
    id: uuidv4(),
    text: 'I architect projects with growth in mind, so the work we do today can expand seamlessly as your product or business evolves.',
  },
  {
    src: getImg('memorable-experiences.avif'),
    label: 'Memorable experiences',
    id: uuidv4(),
    text: 'I focus on the “wow” factor — animations, interactions, and storytelling that make your product stand out and leave a lasting impression.',
  },
]);
const { lgBreakpoint, width } = useViewport();
const isResponsive = computed(() => width.value < lgBreakpoint);

import labcorp from 'src/assets/labcorp.jpg?w=800;1280;1600&format=avif;jpg&as=picture';
import ornl from 'src/assets/ornl.jpg?w=800;1280;1600&format=avif;jpg&as=picture';
import amtrak from 'src/assets/amtrak.jpg?w=800;1280;1600&format=avif;jpg&as=picture';
import lockheedMartin from 'src/assets/lockheed-martin.png?w=800;1280;1600&format=avif;png&as=picture';
import { useViewport } from 'src/shared/utils/viewWidth';

const pastClients = ref<PastClient[]>([
  {
    id: uuidv4(),
    img: labcorp,
    name: 'Labcorp',
    url: 'https://www.labcorp.com/',
  },
  {
    id: uuidv4(),
    img: amtrak,
    name: 'Amtrak',
    url: 'https://www.amtrak.com/home.html',
  },
  {
    id: uuidv4(),
    img: ornl,
    name: 'ORNL',
    url: 'https://www.ornl.gov/',
  },
  {
    id: uuidv4(),
    img: lockheedMartin,
    name: 'Lockheed Martin',
    url: 'https://www.lockheedmartin.com/en-us/index.html',
  },
]);

onMounted(() => {
  mainStore.HAS_SCROLLBAR(hasScrollbar());
  window.addEventListener('resize', () => {
    mainStore.HAS_SCROLLBAR(hasScrollbar());
  });
});
</script>

<template>
  <section v-if="isResponsive" class="responsive-view column q-gutter-y-md">
    <q-card class="full-width">
      <q-card-section class="section-container q-pa-lg">
        <h1
          class="text-h1 q-mt-none q-mb-md q-pt-md q-pb-md bg-dark text-center font-secondary"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-secondary',
                Winter: 'text-secondary',
                Spring: 'text-secondary',
                Summer: 'text-secondary',
              },
              activeTheme,
            )
          "
        >
          About Me
        </h1>
        <q-separator color="primary" class="q-mb-md" />
        <p
          class="text-body-1 font-primary"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-primary',
                Winter: 'text-primary',
                Spring: 'text-primary',
                Summer: 'text-primary',
              },
              activeTheme,
            )
          "
        >
          I’m Grant, a frontend engineer and creative problem-solver. For the past 7+ years, I’ve
          worked at the intersection of design, code, and storytelling — helping companies and
          creators bring their ideas to life on the web.
        </p>
        <p
          class="text-body-1 q-mb-none font-primary"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-primary',
                Winter: 'text-primary',
                Spring: 'text-primary',
                Summer: 'text-primary',
              },
              activeTheme,
            )
          "
        >
          What sets me apart isn’t just the code I write, but the experiences I design:
        </p>
        <br />
        <q-list class="bg-primary">
          <div
            v-for="bullet in generalBullets"
            :key="bullet.id"
            :name="bullet.id"
            expand-separator
            :label="bullet.label"
            class="font-primary about-bullet"
          >
            <q-expansion-item group="aboutMe" header-class="bg-primary">
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="bullet.src" />
                  </q-avatar>
                </q-item-section>

                <q-item-section> {{ bullet.label }} </q-item-section>
              </template>

              <q-card class="bg-dark">
                <q-card-section class="text-primary">
                  {{ bullet.text }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-list>

        <p
          class="q-mt-lg text-body-1 font-primary"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-primary',
                Winter: 'text-primary',
                Spring: 'text-primary',
                Summer: 'text-primary',
              },
              activeTheme,
            )
          "
        >
          I’ve built tools for industries as diverse as healthcare, publishing, and SaaS — and I’ve
          learned that whether you’re a startup founder or a creative team, you need more than just
          a functioning app. You need an experience that stands out.
        </p>
        <q-btn class="q-mt-md full-width" color="dark" size="lg" glossy>
          <span class="text-body-1">Let’s Connect </span>
        </q-btn>
      </q-card-section>
    </q-card>
    <q-intersection transition="slide-up" transition-duration="1000" :once="true">
      <q-card class="full-width">
        <q-card-section class="section-container q-pa-lg">
          <div class="h2-container row justify-center q-mb-lg text-center bg-dark text-white">
            <h2
              class="bg-dark text-h2 font-secondary"
              :class="
                setSeasonClasses(
                  {
                    Fall: 'text-secondary',
                    Winter: 'text-secondary',
                    Spring: 'text-secondary',
                    Summer: 'text-secondary',
                  },
                  activeTheme,
                )
              "
            >
              My Approach
            </h2>
          </div>
          <q-separator color="primary" class="q-mb-md" />
          <p
            class="q-mb-none text-body-1 font-primary"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-primary',
                  Winter: 'text-primary',
                  Spring: 'text-primary',
                  Summer: 'text-primary',
                },
                activeTheme,
              )
            "
          >
            Before I dive into code, I focus on understanding the vision behind the project. Every
            product has a story, and my role is to translate that story into an interface that feels
            intuitive, engaging, and alive.
          </p>
          <br />
          <q-separator></q-separator>
          <q-list>
            <div
              v-for="bullet in myApproachBullets"
              :key="bullet.id"
              :name="bullet.id"
              class="about-bullet"
            >
              <q-expansion-item
                expand-separator
                :label="bullet.label"
                group="myApproach"
                header-class="bg-primary font-primary"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }} </q-item-section>
                </template>

                <q-card class="bg-dark">
                  <q-card-section class="text-primary">
                    {{ bullet.text }}
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </q-list>
        </q-card-section>
      </q-card></q-intersection
    >
    <q-intersection transition="slide-up" transition-duration="1000" :once="true">
      <q-card class="full-width">
        <q-card-section class="section-container q-pa-lg">
          <div class="h2-container row justify-center q-mb-lg text-center bg-dark text-white">
            <h2
              class="bg-dark text-h2 font-secondary"
              :class="
                setSeasonClasses(
                  {
                    Fall: 'text-secondary',
                    Winter: 'text-secondary',
                    Spring: 'text-secondary',
                    Summer: 'text-secondary',
                  },
                  activeTheme,
                )
              "
            >
              Why Clients Work With Me
            </h2>
          </div>
          <q-separator color="primary" class="q-mb-md" />
          <p
            class="q-mb-none text-body-1 font-primary"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-primary',
                  Winter: 'text-primary',
                  Spring: 'text-primary',
                  Summer: 'text-primary',
                },
                activeTheme,
              )
            "
          >
            I know you’re not just looking for code — you’re looking for results. My clients come to
            me when they want their projects to stand out, attract attention, and deliver value
            quickly.
          </p>
          <br />
          <q-separator></q-separator>
          <q-list>
            <div
              v-for="bullet in whyClientsBullets"
              :key="bullet.id"
              :name="bullet.id"
              class="full-width about-bullet"
            >
              <q-expansion-item
                expand-separator
                :label="bullet.label"
                group="whyClientsWorkWithMe"
                header-class="bg-primary font-primary about-bullet"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }} </q-item-section>
                </template>

                <q-card class="bg-dark">
                  <q-card-section class="text-primary">
                    {{ bullet.text }}
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </q-list>
        </q-card-section>
      </q-card></q-intersection
    >
    <q-intersection transition="slide-up" transition-duration="1000" :once="true">
      <q-card class="full-width">
        <q-card-section class="section-container q-pa-lg text-primary">
          <div class="h2-container row justify-center q-mb-lg text-center bg-dark text-white">
            <h2
              class="bg-dark text-h2 font-secondary"
              :class="
                setSeasonClasses(
                  {
                    Fall: 'text-secondary',
                    Winter: 'text-secondary',
                    Spring: 'text-secondary',
                    Summer: 'text-secondary',
                  },
                  activeTheme,
                )
              "
            >
              Past Clients
            </h2>
          </div>
          <q-separator color="primary" />
          <p
            class="q-mt-md q-mb-none font-primary text-body-1 font-bold text-center"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-primary',
                  Winter: 'text-primary',
                  Spring: 'text-primary',
                  Summer: 'text-white',
                },
                activeTheme,
              )
            "
          >
            I know you’re not just looking for code — you’re looking for results. My clients come to
            me when they want their projects to stand out, attract attention, and deliver value
            quickly.
          </p>
          <q-intersection
            v-for="(client, index) in pastClients"
            :key="client.id"
            transition="slide-up"
            transition-duration="1000"
            :once="true"
          >
            <div ref="client" class="client bg-white full-width q-pa-xl q-mt-md">
              <a class="full-width" :href="client.url" target="_blank">
                <picture class="full-width">
                  <source
                    v-for="(src, srcIndex) in client.img.sources"
                    :key="srcIndex"
                    :srcset="src.srcset"
                    :type="src.type"
                    sizes="(min-width: 1450px) 100%"
                  />
                  <img
                    :src="client.img.img.src"
                    :srcset="client.img.img.srcset"
                    sizes="(min-width: 1024px) 25vw, 90vw"
                    fetchpriority="high"
                    :loading="index === 0 ? 'eager' : 'lazy'"
                    decoding="async"
                    :alt="client.name"
                  /> </picture
              ></a>
            </div>
          </q-intersection>
        </q-card-section> </q-card
    ></q-intersection>

    <q-intersection transition="slide-up" transition-duration="1000" :once="true">
      <q-card class="full-width last-card">
        <q-card-section class="section-container q-pa-lg">
          <div class="h2-container row justify-center q-mb-lg text-center bg-dark text-white">
            <h2
              class="bg-dark text-h2 font-secondary"
              :class="
                setSeasonClasses(
                  {
                    Fall: 'text-secondary',
                    Winter: 'text-secondary',
                    Spring: 'text-secondary',
                    Summer: 'text-secondary',
                  },
                  activeTheme,
                )
              "
            >
              Projects Under Development
            </h2>
          </div>
          <q-separator color="primary" class="q-mb-md" />
          <q-intersection transition="scale" transition-duration="1000" :once="true">
            <div class="project full-width bg-white q-pa-xl">
              <a href="https://www.draindata.org/" class="column q-mb-xl">
                <div
                  class="col column items-center justify-center"
                  :class="
                    setSeasonClasses(
                      {
                        Fall: 'text-accent',
                        Winter: 'text-accent',
                        Spring: 'text-dark',
                        Summer: 'text-dark',
                      },
                      activeTheme,
                    )
                  "
                >
                  <img
                    class="q-ma-none q-pa-none"
                    src="../assets/logo-drainData.png"
                    alt="Draindata logo"
                  />
                </div>
              </a>
              <q-separator color="dark" />
              <p class="project-text text-dark q-mt-md q-mb-none text-center">
                Unlock the benefits of accurate surgical drain tracking and maximize your recovery
                experience with a patient-centered tool designed specifically for real post-surgical
                care. Built to support JP drain monitoring and overall surgical recovery, our app
                reduces stress, improves accuracy in recording drain output, and makes it easier for
                patients and healthcare teams to stay connected and informed throughout the healing
                process.
              </p>
            </div></q-intersection
          >
        </q-card-section>
      </q-card></q-intersection
    >
  </section>

  <section v-if="!isResponsive" class="desktop-view full-width column">
    <q-card class="flex column full-width q-pa-none">
      <q-card-section class="section-container">
        <h1
          class="text-h1 q-mt-none q-pt-md q-pb-md text-center border-black font-secondary"
          :class="
            setSeasonClasses(
              {
                Fall: 'bg-dark text-secondary',
                Winter: 'bg-dark text-secondary',
                Spring: 'bg-dark text-secondary',
                Summer: 'bg-dark text-secondary',
              },
              activeTheme,
            )
          "
        >
          About Me
        </h1>
        <p class="text-primary text-center text-body-2">
          If you’re working on something creative or ambitious, I’d love to hear about it.
        </p>
        <q-separator color="primary" class="q-mb-md" />
        <p
          class="text-body-2 text-primary q-mb-none font-primary"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-white',
                Winter: 'text-white',
                Spring: 'text-white',
                Summer: 'text-white',
              },
              activeTheme,
            )
          "
        >
          I’m Grant, a frontend engineer and creative problem-solver. For the past 7+ years, I’ve
          worked at the intersection of design, code, and storytelling — helping companies and
          creators bring their ideas to life on the web.
        </p>

        <p
          class="q-pt-lg text-body-2 q-mb-none font-primary"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-primary',
                Winter: 'text-primary',
                Spring: 'text-primary',
                Summer: 'text-white',
              },
              activeTheme,
            )
          "
        >
          What sets me apart isn’t just the code I write, but the experiences I design:
        </p>
        <br />
        <q-separator></q-separator>
        <q-intersection transition="slide-left" transition-duration="1000" :once="true">
          <q-list>
            <div
              v-for="bullet in generalBullets"
              :key="bullet.id"
              :name="bullet.id"
              expand-separator
              :label="bullet.label"
              class="font-primary about-bullet"
            >
              <q-expansion-item group="aboutMe" header-class="bg-primary text-dark">
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }}</q-item-section>
                </template>

                <q-card class="bg-white">
                  <q-card-section>
                    <p>{{ bullet.text }}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </q-list></q-intersection
        >
        <br />
        <p
          class="font-primary text-body-2 q-mb-none"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-primary',
                Winter: 'text-primary',
                Spring: 'text-primary',
                Summer: 'text-white',
              },
              activeTheme,
            )
          "
        >
          I’ve built tools for industries as diverse as healthcare, publishing, and SaaS — and I’ve
          learned that whether you’re a startup founder or a creative team, you need more than just
          a functioning app. You need an experience that stands out.
        </p>
        <q-btn class="q-mt-md full-width" color="accent" size="lg" glossy>
          <span class="text-body-1">Let’s Connect </span>
        </q-btn>
      </q-card-section>
      <q-card-section class="section-container">
        <h2
          class="text-h2 font-secondary q-mt-none q-pt-md q-pb-md text-secondary text-center bg-dark border-black"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-secondary',
                Winter: 'text-secondary',
                Spring: 'text-secondary',
                Summer: 'text-secondary',
              },
              activeTheme,
            )
          "
        >
          My Approach
        </h2>
        <q-separator color="primary" class="q-mb-md" />
        <p
          class="font-primary text-body-2 q-mb-none"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-primary',
                Winter: 'text-primary',
                Spring: 'text-primary',
                Summer: 'text-white',
              },
              activeTheme,
            )
          "
        >
          Before I dive into code, I focus on understanding the vision behind the project. Every
          product has a story, and my role is to translate that story into an interface that feels
          intuitive, engaging, and alive.
        </p>
        <br />
        <q-separator></q-separator>
        <q-intersection transition="slide-left" transition-duration="1000" :once="true">
          <q-list separator>
            <div
              v-for="bullet in myApproachBullets"
              :key="bullet.id"
              :name="bullet.id"
              class="about-bullet"
            >
              <q-expansion-item
                expand-separator
                :label="bullet.label"
                group="myApproach"
                header-class="bg-primary text-dark"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }} </q-item-section>
                </template>

                <q-card class="bg-white">
                  <q-card-section>
                    <p>{{ bullet.text }}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </q-list></q-intersection
        >
      </q-card-section>
      <q-card-section class="section-container">
        <h2
          class="font-secondary text-h2 q-mt-none q-pt-md q-pb-md text-secondary text-center bg-dark border-black"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-secondary',
                Winter: 'text-secondary',
                Spring: 'text-secondary',
                Summer: 'text-secondary',
              },
              activeTheme,
            )
          "
        >
          Why Clients Work With Me
        </h2>
        <q-separator color="primary" class="q-mb-md" />
        <p
          class="font-primary text-body-2 q-mb-none"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-primary',
                Winter: 'text-primary',
                Spring: 'text-primary',
                Summer: 'text-white',
              },
              activeTheme,
            )
          "
        >
          I know you’re not just looking for code — you’re looking for results. My clients come to
          me when they want their projects to stand out, attract attention, and deliver value
          quickly.
        </p>
        <br />
        <q-separator></q-separator>
        <q-intersection transition="slide-left" transition-duration="1000" :once="true">
          <q-list>
            <div
              v-for="bullet in whyClientsBullets"
              :key="bullet.id"
              :name="bullet.id"
              class="about-bullet"
            >
              <q-expansion-item
                expand-separator
                :label="bullet.label"
                group="whyClientsWorkForMe"
                header-class="primary-font bg-primary text-dark"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }} </q-item-section>
                </template>

                <q-card class="bg-white">
                  <q-card-section>
                    <p class="text-dark">{{ bullet.text }}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </q-list></q-intersection
        >
      </q-card-section>
      <q-card-section class="section-container">
        <h2
          class="past-clients-header font-secondary q-mt-none q-pb-md text-white text-center"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-secondary',
                Winter: 'text-secondary',
                Spring: 'text-secondary',
                Summer: 'text-secondary',
              },
              activeTheme,
            )
          "
        >
          Past Clients
        </h2>
        <q-separator color="primary" />
        <p
          class="font-primary text-body-2 q-mt-md q-mb-none font-bold"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-primary',
                Winter: 'text-primary',
                Spring: 'text-primary',
                Summer: 'text-white',
              },
              activeTheme,
            )
          "
        >
          I know you’re not just looking for code — you’re looking for results. My clients come to
          me when they want their projects to stand out, attract attention, and deliver value
          quickly.
        </p>
        <q-intersection
          v-for="(client, index) in pastClients"
          :key="client.id"
          transition="slide-left"
          transition-duration="1000"
          :once="true"
        >
          <div ref="client" class="client bg-white full-width q-pa-xl q-mt-md">
            <a class="full-width" :href="client.url" target="_blank">
              <picture class="full-width">
                <source
                  v-for="(src, srcIndex) in client.img.sources"
                  :key="srcIndex"
                  :srcset="src.srcset"
                  :type="src.type"
                  sizes="(min-width: 1450px) 100%"
                />
                <img
                  :src="client.img.img.src"
                  :srcset="client.img.img.srcset"
                  sizes="(min-width: 1024px) 25vw, 90vw"
                  fetchpriority="high"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  decoding="async"
                  :alt="client.name"
                /> </picture
            ></a>
          </div>
        </q-intersection>
      </q-card-section>
      <q-card-section class="section-container">
        <h2
          class="font-secondary text-h2 q-mt-none q-pt-md q-pb-md text-secondary text-center bg-dark border-black"
          :class="
            setSeasonClasses(
              {
                Fall: 'text-secondary',
                Winter: 'text-secondary',
                Spring: 'text-secondary',
                Summer: 'text-secondary',
              },
              activeTheme,
            )
          "
        >
          Projects Under Development
        </h2>
        <!-- <q-intersection transition="slide-up" transition-duration="1000" :once="true"> -->
        <div class="project full-width bg-white q-pa-xl">
          <a href="https://www.draindata.org/" class="column q-mb-xl">
            <div
              class="col column items-center justify-center"
              :class="
                setSeasonClasses(
                  {
                    Fall: 'text-accent',
                    Winter: 'text-accent',
                    Spring: 'text-dark',
                    Summer: 'text-dark',
                  },
                  activeTheme,
                )
              "
            >
              <img
                class="q-ma-none q-pa-none"
                src="../assets/logo-drainData.png"
                alt="Draindata logo"
              />
            </div>
          </a>
          <q-separator color="dark" />
          <p class="project-text text-dark q-mt-md q-mb-none text-center">
            Unlock the benefits of accurate surgical drain tracking and maximize your recovery
            experience with a patient-centered tool designed specifically for real post-surgical
            care. Built to support JP drain monitoring and overall surgical recovery, our app
            reduces stress, improves accuracy in recording drain output, and makes it easier for
            patients and healthcare teams to stay connected and informed throughout the healing
            process.
          </p>
        </div>
        <!-- </q-intersection
        > -->
      </q-card-section>
    </q-card>
  </section>
</template>

<style lang="scss">
@use '/src/css/_tokens.scss' as tokens;
$winter-mobile-background: map-get(tokens.$winter-theme, primary);

.aboutSection {
  content-visibility: auto;
  contain-intrinsic-size: 800px 1000px;
}

.responsive-view {
  @media (min-width: tokens.$breakpoint-lg) {
    display: none;
  }

  .q-card {
    background-color: rgba(black, 0.5);
    padding: 1rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    .section-container {
      background-color: var(--q-accent);
      border-radius: 10px;

      h1 {
        border: solid 2px var(--q-dark);
      }

      .h2-container {
        border: solid 2px var(--q-dark);
      }

      .client {
        border-radius: 10px;
        transition: transform border 200ms ease;
        border: solid 0.5rem var(--q-secondary);
        cursor: pointer;

        picture {
          display: block;

          img {
            height: auto;
            max-width: 100%;
            object-fit: cover;
          }
        }
      }

      .client:hover {
        transform: scale(1.04);
      }

      .project {
        border-radius: 10px;
        font-size: 1rem;
        cursor: pointer;

        img {
          transition: transform 200ms ease;
        }

        p {
          transform: translateY(0px);
          transition: transform 200ms ease;
        }
      }

      .project:hover {
        border: solid 0.5rem var(--q-secondary);
        img {
          transform: scale(1.05);
        }

        p {
          transform: scale(1.05);
          transform: translateY(0.5rem);
        }
      }
    }

    .section-container:nth-child(1) {
      border: solid 4px var(--q-primary);
    }
  }
}

.desktop-view {
  display: none;

  @media (min-width: tokens.$breakpoint-lg) {
    display: flex;
  }

  .q-card {
    background-color: transparent;

    .section-container {
      .past-clients-header {
        font-size: 3rem;
      }

      .client {
        border-radius: 10px;
        transition: transform border 200ms ease;
        border: solid 0.5rem var(--q-secondary);
        cursor: pointer;

        picture {
          display: block;

          img {
            height: auto;
            max-width: 100%;
            object-fit: cover;
          }
        }
      }

      .client:hover {
        transform: scale(1.04);
      }

      .project {
        transition: transform 200ms ease;
        border-radius: 10px;
        font-size: 1rem;
        cursor: pointer;
      }

      .project:hover {
        transform: scale(1.04);
      }
    }
  }
}

.winter-mobile-background {
  background-color: rgba($winter-mobile-background, $alpha: 0.8);

  @media (min-width: tokens.$breakpoint-md) {
    background-color: initial;
  }
}

.drawer-content-offset {
  display: none;
}

.about-bullet {
  border-bottom: 1px solid var(--q-dark) !important;
}
</style>
