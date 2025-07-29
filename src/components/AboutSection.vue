<script lang="ts" setup>
// import { storeToRefs } from 'pinia';
// import { useMainStore } from '../stores/main';
// import { Theme } from '../shared/constants/theme';

// const mainStore = useMainStore();
// const { activeTheme } = storeToRefs(mainStore);
import WorkHistory from './WorkHistory.vue';
</script>

<template>
  <section>
    <div class="mobile-view">
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
          <p class="text-body1 q-mb-sm">Projects currently under development.</p>
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

          <p class="text-body1 q-mt-md q-mb-none">
            These projects reflect my passion for innovation and blending tech with meaningful
            impact.
          </p>
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

        <q-card-section class="section-container q-pa-lg bg-accent">
          <p class="text-primary">
            Before that, I worked with teams at
            <strong>Lockheed Martin, Labcorp, Amtrak and more.</strong>
          </p>

          <WorkHistory />
          <p class="history-context text-primary q-pt-md">
            I've built high-performance web apps and streamlining complex systems. I’ve worked in
            environments ranging from government labs to startups, with recent experience converting
            legacy systems, integrating Epic OAuth for medical software, and building scalable
            monorepos.
          </p>
        </q-card-section>
        <!--
        <q-card-section class="section-container bg-dark text-primary">
          <h2 class="text-center">Beyond Code</h2>
          <q-separator color="primary" class="q-my-md" />

          <div class="beyond-content">
            <div class="beyond-block">
              <img
                src="../assets/salesman.jpg"
                alt="Man holding out his hand"
                class="beyond-img left"
              />
              <div class="beyond-text">
                <p>
                  Before jumping into tech, I spent years in sales and marketing — selling
                  everything from furnaces to phones. That background shaped my product mindset and
                  empathy for users.
                </p>
                <p>
                  I’ve also worked as a designer and creative, with deep experience in the Adobe
                  Suite and branding.
                </p>
              </div>
            </div>

            <div class="beyond-block">
              <img
                src="../assets/thailand.jpg"
                alt="Picture of the boat on the water"
                class="beyond-img right"
              />
              <div class="beyond-text">
                <p>
                  Off the clock, I’m a curious mix: I’ve lived abroad in Southeast Asia, ghost hunt
                  with friends, and grew up hot air ballooning. Yes, really.
                </p>
                <p>
                  In mid-2024, I took a medical leave to treat an autoimmune issue. I'm grateful to
                  be fully recovered and back to building software with a new level of focus and
                  energy.
                </p>
              </div>
            </div>
          </div>
        </q-card-section> -->
      </q-card>
    </div>
    <!-- <div class="desktop-view">
      <q-card class="column items-center justify-start full-width q-pa-sm">
        <q-card-section class="section-container text-primary q-pa-lg">
          <h2 class="text-h4 q-mt-md">About Me</h2>
          <q-separator color="primary" class="q-mb-md" />
          <p>
            Hi, I'm <strong class="name">Grant Knaver</strong> — a full-stack JavaScript developer
            with <span class="years">7+ years</span> of professional experience, currently based in
            Eugene, Oregon. I specialize in modern frameworks like Angular and Vue, with a strong
            command of state management libraries (NgRx, Pinia), RESTful APIs, responsive UI, and
            building apps that solve real-world problems.
          </p>
        </q-card-section>

        <hr class="separator full-width" />

        <q-card-section class="section-container bg-secondary text-dark q-pa-lg">
          <p class="q-mb-sm">
            Most recently, I led development on two major self-directed projects:
          </p>
          <ul class="q-pl-md">
            <li class="q-mb-xs">
              <strong>DrainData</strong> – a surgery drain tracking tool aimed at improving patient
              recovery through better data.
            </li>
            <li>
              <strong>StorytAIm</strong> – an AI-powered narration toolkit designed for authors,
              complete with voice emotion control and audio stitching.
            </li>
          </ul>
          <p class="q-mt-md">
            These projects reflect my passion for innovation and blending tech with meaningful
            impact.
          </p>
        </q-card-section>
      </q-card>
    </div> -->
  </section>

  <section class="desktop-view"></section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';
$winter-mobile-background: map-get($winter-theme, secondary);
$summer-mobile-background: map-get($summer-theme, secondary);
$spring-mobile-background: map-get($spring-theme, secondary);

.mobile-view {
  @media (min-width: $breakpoint-md) {
    display: none;
  }

  .q-card {
    background-color: rgba(black, 0.5);

    h1 {
      font-size: 3rem;
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 2.5rem;
    }

    .section-container {
      background-color: var(--q-accent);

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
        text-shadow: 2px 2px 5px var(--q-dark);
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
            box-shadow: 5px 10px 10px var(--q-dark);
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

.beyond-title {
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: var(--q-dark);
}

.beyond-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.beyond-block {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;

  &.reverse {
    flex-direction: row-reverse;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .beyond-img {
    flex-shrink: 0;
    width: 250px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    &.right {
      order: 2;
    }

    &.left {
      order: 0;
    }
  }

  .beyond-text {
    flex: 1;
    font-size: 1.1rem;
    line-height: 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
