<script lang="ts" setup>
import { ref } from 'vue';

import { v4 as uuidv4 } from 'uuid';
import { type ProjectDetails } from '../shared/models/projectDetails';
// import { type CarouselSlide } from 'src/shared/models/carouselSlide';

// import { type TimelineEntry } from '../shared/models/timelineEntry';
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
// const activeSlide = ref(workHistorySlides.value[0]?.id);
const projects = ref<ProjectDetails[]>([
  {
    id: uuidv4(),
    url: 'https://rxjs-wkwd2p.stackblitz.io/',
    src: new URL('../assets/rxjs.svg', import.meta.url).href,
    alt: 'RxJS catalog',
  },
  {
    id: uuidv4(),
    url: 'https://rock-watch-frontend.vercel.app/landing',
    src: new URL('../assets/rock-watch.svg', import.meta.url).href,
    alt: 'Rock Watch',
  },
  {
    id: uuidv4(),
    url: '',
    src: new URL('../assets/storytaim.svg', import.meta.url).href,
    alt: 'StorytAIm',
  },
  {
    id: uuidv4(),
    url: 'https://www.draindata.org/',
    src: new URL('../assets/drainData.svg', import.meta.url).href,
    alt: 'DrainData',
  },
]);
</script>

<template>
  <section class="column col flex">
    <!-- <div class="mobile-view full-width">
      <q-card class="full-width q-pa-sm bg-transparent">
        <q-card-section class="section-container text-primary q-pa-lg">
          <h1 class="q-mt-none q-mb-xl text-primary text-center">Projects</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p class="summary text-center q-mb-none">
            This collection highlights a range of my work — from low-level reactive programming
            demos to full-stack applications. It includes an RxJS catalog built to visualize complex
            stream logic, a MEAN-stack asteroid tracker showcasing real-time data integration, and
            two evolving products: DrainData, a mobile-first healthcare tool for post-op fluid
            tracking, and StorytAIm, a creative AI platform for authors to bring their stories to
            life with voice narration.
          </p>
        </q-card-section>

        <q-card-section class="section-container bg-primary q-pa-sm">
          <div class="project-container full-width q-pa-lg">
            <a v-for="project in projects" :key="project.id" :href="project.url">
              <img :src="project.src" :alt="project.alt" />
            </a>
          </div>
        </q-card-section>
      </q-card>
    </div> -->

    <div class="desktop-view full-width">
      <q-card class="full-width q-pa-sm bg-transparent">
        <q-card-section class="section-container text-primary q-pa-lg">
          <h1 class="q-mt-none q-mb-xl text-primary text-center">Projects</h1>
          <q-separator color="primary" class="q-mb-md" />
          <p class="summary text-center q-mb-none">
            This collection highlights a range of my work — from low-level reactive programming
            demos to full-stack applications. It includes an RxJS catalog built to visualize complex
            stream logic, a MEAN-stack asteroid tracker showcasing real-time data integration, and
            two evolving products: DrainData, a mobile-first healthcare tool for post-op fluid
            tracking, and StorytAIm, a creative AI platform for authors to bring their stories to
            life with voice narration.
          </p>
        </q-card-section>

        <q-card-section class="section-container q-pa-sm">
          <div class="project-container full-width q-pa-lg">
            <a v-for="project in projects" :key="project.id" :href="project.url">
              <img :src="project.src" :alt="project.alt" />
            </a>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';
$projects-section-background-color: map-get($spring-theme, secondary);

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
  }
}

.desktop-view {
  display: none;

  @media (min-width: $breakpoint-md) {
    display: flex;
  }

  .q-card {
    display: flex !important;
    flex-direction: column;
    flex: 1 1 0%;
    max-width: 100%;
    box-sizing: border-box;

    h1 {
      font-size: 3rem;
    }
    border-radius: 10px !important;

    .section-container:nth-child(2) {
      border-radius: 10px;
      background-color: rgba($color: $projects-section-background-color, $alpha: 1);
    }

    .project-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;

      a {
        display: inline-block;
        transition: transform 0.3s ease;
        max-width: 200px;

        img {
          width: 100%;
          height: auto;
          display: block;
        }

        &:hover {
          transform: scale(1.05);
        }
      }

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
        align-items: center;

        a {
          width: 80%;
        }
      }
    }
  }
}
</style>
