<script lang="ts" setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
// import { type CarouselSlide } from 'src/shared/models/carouselSlide';

import { type TimelineEntry } from '../shared/models/timelineEntry';
// const workHistorySlides = ref<CarouselSlide[]>([
//   {
//     id: uuidv4(),
//     link: 'https://www.amtrak.com/home',
//     img: new URL('../assets/amtrak.svg', import.meta.url).href,
//     alt: 'Amtrak',
//   },
//   {
//     id: uuidv4(),
//     link: 'https://www.lockheedmartin.com/en-us/index.html',
//     img: new URL('../assets/lockheed-martin.png', import.meta.url).href,
//     alt: 'Lockheed Martin',
//   },
//   {
//     id: uuidv4(),
//     link: 'https://www.labcorp.com/',
//     img: new URL('../assets/labcorp.png', import.meta.url).href,
//     alt: 'Labcorp',
//   },
//   {
//     id: uuidv4(),
//     link: 'https://www.ornl.gov/',
//     img: new URL('../assets/ornl.png', import.meta.url).href,
//     alt: 'ORNL',
//   },
//   {
//     id: uuidv4(),
//     link: 'https://gametimehero-coming-soon.web.app/',
//     img: new URL('../assets/gametime-hero.png', import.meta.url).href,
//     alt: 'Gametime Hero',
//   },
// ]);
const workHistoryTimeline = ref<TimelineEntry[]>([
  {
    id: uuidv4(),
    heading: false,
    icon: 'work',
    color: 'dark',
    subtitle: '2024 - 2025',
    title: 'L&G Devworks',
    body: 'Currently developing Draindata, a surgical drain tracking app in open beta with active users. Also working on StorytAIm, an AI narration suite now being migrated to the MEAN stack for enhanced scalability.',
  },
  {
    id: uuidv4(),
    heading: false,
    avatar: new URL('../assets/ornl-icon.png', import.meta.url).href,
    color: 'dark',
    subtitle: '2023 - 2024',
    title: 'ONRL',
    body: 'Developed a comprehensive tool set for the Veterans Association, enabling multivariate analysis to optimize resource allocation.',
  },
  {
    id: uuidv4(),
    heading: false,
    icon: 'business',
    color: 'dark',
    subtitle: '2023',
    title: 'T2',
    body: 'I upgraded their payment system to streamline the process, reducing the average customer payment time from 3.5 minutes to just over 1 minute.',
  },
  {
    id: uuidv4(),
    heading: false,
    avatar: new URL('../assets/labcorp-icon.jpeg', import.meta.url).href,
    color: 'dark',
    subtitle: '2022 - 2023',
    title: 'Labcorp',
    body: 'Collaborated with a team to modernize the entire specimen collection workflow, resulting in a reduction of processing time by over 60% on average for specimen reviews.',
  },

  {
    id: uuidv4(),
    heading: false,
    icon: 'more_horiz',
    color: 'dark',
    subtitle: '2017 - 2022',
    title: 'Review Resume',
  },
]);

// const activeSlide = ref(workHistorySlides.value[0]?.id);
</script>

<template>
  <section>
    <div class="mobile-view full-width">
      <q-card class="full-width q-pa-sm">
        <q-card-section class="section-container text-primary q-pa-lg">
          <h1 class="q-mt-md text-primary">About Me</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p>
            Hi, I'm <strong class="name">Grant Knaver</strong> — a full-stack JavaScript developer
            with <span class="years">7+ years</span> of professional experience, currently based in
            Eugene, Oregon. I specialize in modern frameworks like Angular and Vue, with a strong
            command of state management libraries (NgRx, Pinia), RESTful APIs, responsive UI, and
            building apps that solve real-world problems.
          </p>
        </q-card-section>

        <q-separator color="primary q-mt-sm q-mb-sm"></q-separator>

        <q-card-section class="section-container bg-transparent text-primary q-pa-sm">
          <h2 class="q-ma-none q-mt-lg q-mb-md text-center text-primary">
            Projects Under Development
          </h2>
          <div class="projects-container full-width column col justify-center items-center">
            <ul class="q-pl-none q-pt-sm q-pb-md">
              <li class="column text-accent items-center q-pa-lg text-center bg-primary full-width">
                <img class="logo q-pb-md" src="../assets/logo-drainData.png" alt="Draindata logo" />
                A surgery drain tracking tool aimed at improving patient recovery through better
                data.
                <a class="text-dark q-mt-md" href="">Website</a>
              </li>
              <br />
              <li class="bg-accent column text-primary items-center q-pa-lg text-center">
                <img class="logo q-pb-md" src="../assets/logo-storytAIm.png" alt="StorytAIm logo" />
                An AI-powered narration toolkit designed for authors, complete with voice emotion
                control and audio stitching.
                <a class="text-dark q-mt-md" href="">Website</a>
              </li>
            </ul>
          </div>
        </q-card-section>

        <hr class="separator full-width" />

        <!-- <q-card-section class="section-container bg-secondary text-dark q-pa-lg full-width">
        <p class="text-body1 q-mb-sm">Tech I enjoy working with includes:</p>
        <ul class="q-pl-md">
          <li><strong>Frontend:</strong> Angular, Vue, Quasar, TailwindCSS, SCSS</li>
          <li><strong>Backend:</strong> Node.js, Express, MongoDB</li>
          <li><strong>Tools:</strong> NgRx, Pinia, Stripe, ElevenLabs, Figma, GSAP</li>
        </ul>
      </q-card-section> -->

        <q-card-section class="section-container work-history-section q-pa-lg bg-primary">
          <h2 class="q-ma-none q-mt-lg q-mb-xl text-center text-dark">Recent Work History</h2>

          <q-timeline layout="dense" color="primary">
            <q-timeline-entry
              v-for="employer in workHistoryTimeline"
              :key="employer.id"
              :heading="employer.heading"
              :icon="employer.icon"
              :tag="employer.tag"
              :color="employer.color"
              :subtitle="employer.subtitle"
              :avatar="employer.avatar"
            >
              <template v-slot:title> {{ employer.title }} </template>
              {{ employer.body }}
            </q-timeline-entry>
          </q-timeline>
          <p class="history-context text-center text-accent">
            I've built high-performance web apps and streamlining complex systems. I’ve worked in
            environments ranging from government labs to startups, with recent experience converting
            legacy systems, integrating Epic OAuth for medical software, and building scalable
            monorepos.
          </p>
        </q-card-section>
      </q-card>
    </div>

    <div class="desktop-view full-width">
      <q-card class="full-width q-pa-sm bg-transparent">
        <q-card-section class="section-container text-primary q-pa-lg">
          <h1 class="q-mt-none q-mb-xl text-primary text-center">About Me</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p class="summary text-center q-mb-none">
            Hi, I'm <strong class="name text-secondary">Grant Knaver</strong> — a full-stack
            JavaScript developer with <span class="years text-warning">7+ years</span> of
            professional experience, currently based in Eugene, Oregon. I specialize in modern
            frameworks like Angular and Vue, with a strong command of state management libraries
            (NgRx, Pinia), RESTful APIs, responsive UI, and building apps that solve real-world
            problems.
          </p>
        </q-card-section>

        <q-card-section class="section-container bg-transparent text-primary q-pa-sm">
          <h2 class="q-ma-none q-mt-lg q-mb-xl text-center text-secondary">
            Projects Under Development
          </h2>
          <div class="projects-container full-width q-pb-xl">
            <ul class="column full-width q-pl-none justify-center">
              <li
                class="full-width column items-center justify-between text-accent text-center bg-primary q-pa-md"
              >
                <img
                  class="logo q-pt-lg q-pb-md"
                  src="../assets/logo-drainData.png"
                  alt="Draindata logo"
                />
                <span
                  >A surgery drain tracking tool aimed at improving patient recovery through better
                  data.</span
                >
                <a class="text-dark q-mt-lg" href="">Website</a>
              </li>
              <br />
              <li
                class="column full-width items-center justify-between text-primary text-center bg-accent q-pa-md"
              >
                <img class="logo q-pb-md" src="../assets/logo-storytAIm.png" alt="StorytAIm logo" />
                <span class="q-pa-md">
                  An AI-powered narration toolkit designed for authors, complete with voice emotion
                  control and audio stitching.
                </span>
                <a class="text-dark q-mt-md" href="">Website</a>
              </li>
            </ul>
          </div>
        </q-card-section>

        <hr class="separator full-width" />

        <q-card-section class="section-container work-history-section column items-center q-pa-xl">
          <h2 class="q-ma-none q-mt-none q-mb-xl text-center text-secondary">Work History</h2>
          <q-separator></q-separator>
          <div class="full-width">
            <q-timeline dark>
              <q-timeline-entry
                v-for="employer in workHistoryTimeline"
                :key="employer.id"
                :heading="employer.heading"
                :icon="employer.icon"
                :tag="employer.tag"
                color="dark"
                :subtitle="employer.subtitle"
                :avatar="employer.avatar"
              >
                <template v-slot:title> <span></span>{{ employer.title }} </template>
                {{ employer.body }}
              </q-timeline-entry>
            </q-timeline>
          </div>

          <p class="text-primary q-pt-lg text-center">
            I've built high-performance web apps and streamlining complex systems. I’ve worked in
            environments ranging from government labs to startups, with recent experience converting
            legacy systems, integrating Epic OAuth for medical software, and building scalable
            monorepos.
          </p>
        </q-card-section>
      </q-card>
    </div>
  </section>

  <section class="desktop-view"></section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';
$winter-mobile-background: map-get($winter-theme, primary);
$summer-mobile-background: map-get($summer-theme, secondary);
$spring-mobile-background: map-get($spring-theme, secondary);

.mobile-view {
  @media (min-width: $breakpoint-md) {
    display: none;
  }

  .q-card {
    background-color: rgba(black, 0.5);
    padding: 1rem;

    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 2rem;
    }

    .section-container {
      background-color: var(--q-accent);
      border-radius: 10px;

      p {
        font-size: 1rem;
        line-height: 1.4rem;

        .name {
          color: var(--q-seondary);
          font-size: 1.2rem;
        }

        .years {
          color: var(--q-warning);
          font-size: 1.2rem;
        }

        .most-recently {
          text-shadow: 2px 2px 2px var(--q-dark);
          font-size: 1.3rem;
        }
      }

      .history-context {
        font-size: 1.2rem;
        line-height: 1.5rem;
      }

      .projects-container {
        border-radius: 20px;

        ul {
          max-width: 600px;
          list-style-type: none;

          li {
            font-size: 1rem;
            line-height: 1.4rem;
            border: 1px solid var(--q-primary);

            border-radius: 10px;

            .logo {
              max-width: 100px;
            }

            a {
              text-decoration: none;
              font-weight: bold;
            }

            a:hover {
              text-decoration: underline;
            }
          }

          li:hover {
            transform: scale(1.02);
            box-shadow: 5px 10px 15px var(--q-dark);
          }
        }
      }
    }

    hr.separator {
      border: 1px solid var(--q-secondary);
    }
  }
}

.desktop-view {
  display: none;

  @media (min-width: $breakpoint-md) {
    display: flex;
  }

  h1 {
    font-size: 3rem;
  }

  h2 {
    font-size: 2.2rem;
  }

  .summary {
    font-size: 1.2rem;
    margin-bottom: 0;

    .name {
      font-size: 1.5rem;
    }
  }

  .projects-container {
    border-radius: 20px;

    ul {
      list-style-type: none;

      @media (min-width: 1280px) {
        flex-direction: row;
        justify-content: space-around;
      }

      li {
        font-size: 1rem;
        line-height: 1.3rem;
        border: 1px solid var(--q-primary);
        border-radius: 10px;

        @media (min-width: 1280px) {
          width: 45% !important;
        }

        .logo {
          max-width: 100px;
        }

        a {
          text-decoration: none;
          font-weight: bold;
          font-size: 1rem;
        }

        a:hover {
          text-decoration: underline;
        }
      }

      li:hover {
        transform: scale(1.02);
        box-shadow: 5px 10px 20px var(--q-dark);
      }
    }
  }

  .work-history-section {
    font-size: 1rem;
    h2 {
      margin-bottom: 2rem;
    }

    p:nth-child(1) {
      font-size: 1.5rem;
    }

    .carousel-container {
      max-width: 750px;
    }
  }
}

.winter-mobile-background {
  background-color: rgba($winter-mobile-background, $alpha: 0.8);

  @media (min-width: $breakpoint-md) {
    background-color: initial;
  }
}

.summer-mobile-background {
  background-color: rgba($summer-mobile-background, $alpha: 0.8);
  @media (min-width: $breakpoint-md) {
    background-color: initial;
  }
}

.spring-mobile-background {
  background-color: rgba($spring-mobile-background, $alpha: 0.8);
  @media (min-width: $breakpoint-md) {
    background-color: initial;
  }
}
</style>
