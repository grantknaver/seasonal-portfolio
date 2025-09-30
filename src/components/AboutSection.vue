<script lang="ts" setup>
// import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { setSeasonClasses } from 'src/shared/utils/setSeasonColors';
import { useMainStore } from '../stores/main';
import { storeToRefs } from 'pinia';
import { type AboutBulletPoints } from 'src/shared/types/aboutBulletPoints';
import { ref } from 'vue';
const mainStore = useMainStore();
const { activeTheme } = storeToRefs(mainStore);
const generalBullets = ref<AboutBulletPoints[]>([
  {
    src: 'src/assets/gsap-animations.png',
    label: 'GSAP animations',
    id: uuidv4(),
    text: 'I use GSAP to build smooth, modern animations that give your site personality. Motion guides the user’s eye, makes interactions feel natural, and adds that “alive” quality your competitors won’t have.',
  },
  {
    src: 'src/assets/interactive-data-visualization.png',
    label: 'Interactive data visualizations',
    id: uuidv4(),
    text: 'With D3 and Highcharts, I transform raw data into visuals that actually tell a story. Whether it’s a dashboard or a product demo, I design charts that are both insightful and engaging.',
  },
  {
    src: 'src/assets/ai-integration.png',
    label: 'AI integrations',
    id: uuidv4(),
    text: 'From chatbots to voice narration, I integrate AI tools that make your app more intuitive and useful. It’s about creating smarter experiences that save time and keep users engaged.',
  },
]);
const myApproachBullets = ref<AboutBulletPoints[]>([
  {
    src: 'src/assets/creative-engineering.png',
    label: 'Creative engineering',
    id: uuidv4(),
    text: 'I combine strong frontend skills (Vue, Angular, GSAP) with a designer’s eye (Figma) to build experiences that look as good as they perform.',
  },
  {
    src: 'src/assets/future-proof-thinking.png',
    label: 'Future-proof thinking',
    id: uuidv4(),
    text: 'I don’t just build for today. I integrate AI tools and best practices that keep your product relevant, scalable, and ahead of the curve.',
  },
  {
    src: 'src/assets/collaborative-mindset.png',
    label: 'Collaborative mindset',
    id: uuidv4(),
    text: 'I work as a partner, not just a coder. That means clear communication, shared problem solving, and building solutions that fit your vision.',
  },
]);
const whyClientsBullets = ref<AboutBulletPoints[]>([
  {
    src: 'src/assets/fast-results.png',
    label: 'Fast results',
    id: uuidv4(),
    text: 'I turn concepts into polished demos quickly, helping you test ideas and capture attention without long wait times.',
  },
  {
    src: 'src/assets/scalable-systems.png',
    label: 'Scalable systems',
    id: uuidv4(),
    text: 'I architect projects with growth in mind, so the work we do today can expand seamlessly as your product or business evolves.',
  },
  {
    src: 'src/assets/memorable-experiences.png',
    label: 'Memorable experiences',
    id: uuidv4(),
    text: 'I focus on the “wow” factor — animations, interactions, and storytelling that make your product stand out and leave a lasting impression.',
  },
]);
</script>

<template>
  <section>
    <div class="mobile-view full-width">
      <q-card class="full-width">
        <q-card-section class="section-container q-pa-lg">
          <h1
            class="q-mt-none q-mb-xl text-center"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-secondary',
                  Winter: 'text-secondary',
                  Spring: 'text-secondary',
                  Summer: 'text-accent',
                },
                activeTheme,
              )
            "
          >
            About Me
          </h1>
          <q-separator color="primary" class="q-mb-md" />
          <p class="text-primary q-mb-none">
            I’m Grant, a frontend engineer and creative problem-solver. For the past 7+ years, I’ve
            worked at the intersection of design, code, and storytelling — helping companies and
            creators bring their ideas to life on the web.
          </p>
          <p
            class="q-pt-lg"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-primary',
                  Winter: 'text-primary',
                  Spring: 'text-primary',
                  Summer: 'text-accent',
                },
                activeTheme,
              )
            "
          >
            What sets me apart isn’t just the code I write, but the experiences I design:
          </p>
          <br />
          <q-list bordered class="bg-primary">
            <div
              v-for="bullet in generalBullets"
              :key="bullet.id"
              :name="bullet.id"
              expand-separator
              :label="bullet.label"
            >
              <q-expansion-item group="aboutMe" header-class="bg-dark">
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }} </q-item-section>
                </template>

                <q-card>
                  <q-card-section>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius
                    reprehenderit eos corrupti commodi magni quaerat ex numquam, dolorum officiis
                    modi facere maiores architecto suscipit iste eveniet doloribus ullam aliquid.
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-separator />
            </div>
          </q-list>

          <p>
            I’ve built tools for industries as diverse as healthcare, publishing, and SaaS — and
            I’ve learned that whether you’re a startup founder or a creative team, you need more
            than just a functioning app. You need an experience that stands out.
          </p>
        </q-card-section>
        <q-card-section class="section-container q-pa-lg">
          <h2
            class="q-mt-none q-mb-xl text-center"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-secondary',
                  Winter: 'text-secondary',
                  Spring: 'text-secondary',
                  Summer: 'text-accent',
                },
                activeTheme,
              )
            "
          >
            🌱 My Approach
          </h2>
          <q-separator color="primary" class="q-mb-md" />
          <p class="text-primary q-mb-none">
            Before I dive into code, I focus on understanding the vision behind the project. Every
            product has a story, and my role is to translate that story into an interface that feels
            intuitive, engaging, and alive.
          </p>
          <br />
          <q-separator></q-separator>
          <q-list bordered class="bg-primary">
            <div v-for="bullet in myApproachBullets" :key="bullet.id" :name="bullet.id">
              <q-expansion-item expand-separator :label="bullet.label" group="myApproach">
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }} </q-item-section>
                </template>

                <q-card>
                  <q-card-section>
                    {{ bullet.text }}
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-separator></q-separator>
            </div>
          </q-list>
        </q-card-section>
        <q-card-section class="section-container q-pa-lg">
          <h2
            class="q-mt-none q-mb-xl text-center"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-secondary',
                  Winter: 'text-secondary',
                  Spring: 'text-secondary',
                  Summer: 'text-accent',
                },
                activeTheme,
              )
            "
          >
            ✨ Why Clients Work With Me
          </h2>
          <q-separator color="primary" class="q-mb-md" />
          <p class="text-primary q-mb-none">
            I know you’re not just looking for code — you’re looking for results. My clients come to
            me when they want their projects to stand out, attract attention, and deliver value
            quickly.
          </p>
          <br />
          <q-separator></q-separator>
          <q-list bordered class="bg-primary">
            <q-expansion-item
              v-for="bullet in whyClientsBullets"
              :key="bullet.id"
              :name="bullet.id"
              expand-separator
              :label="bullet.label"
              group="whyClientsWorkWithMe"
            >
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="bullet.src" />
                  </q-avatar>
                </q-item-section>

                <q-item-section> {{ bullet.label }} </q-item-section>
              </template>

              <q-card>
                <q-card-section>
                  {{ bullet.text }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <div class="desktop-view full-width">
      <q-card class="full-width q-pa-sm">
        <q-card-section class="section-container q-pa-lg">
          <h1
            class="q-mt-none q-mb-xl text-center bg-dark"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-secondary',
                  Winter: 'text-secondary',
                  Spring: 'text-primary',
                  Summer: 'text-primary',
                },
                activeTheme,
              )
            "
          >
            About Me
          </h1>
          <q-separator color="primary" class="q-mb-md" />
          <p class="text-primary q-mb-none">
            I’m Grant, a frontend engineer and creative problem-solver. For the past 7+ years, I’ve
            worked at the intersection of design, code, and storytelling — helping companies and
            creators bring their ideas to life on the web.
          </p>
          <p
            class="q-pt-lg q-mb-none"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-primary',
                  Winter: 'text-primary',
                  Spring: 'text-primary',
                  Summer: 'text-accent',
                },
                activeTheme,
              )
            "
          >
            What sets me apart isn’t just the code I write, but the experiences I design:
          </p>
          <br />
          <q-separator></q-separator>
          <q-list bordered class="bg-primary">
            <div
              v-for="bullet in generalBullets"
              :key="bullet.id"
              :name="bullet.id"
              expand-separator
              :label="bullet.label"
            >
              <q-expansion-item group="aboutMe" header-class="bg-dark text-primary">
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }}</q-item-section>
                </template>

                <q-card>
                  <q-card-section>
                    <p class="text-dark">{{ bullet.text }}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-separator />
            </div>
          </q-list>
          <br />
          <p class="q-mb-none text-primary">
            I’ve built tools for industries as diverse as healthcare, publishing, and SaaS — and
            I’ve learned that whether you’re a startup founder or a creative team, you need more
            than just a functioning app. You need an experience that stands out.
          </p>
        </q-card-section>
        <q-card-section class="section-container q-pa-lg">
          <h2
            class="q-mt-none q-mb-xl text-center"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-secondary',
                  Winter: 'text-secondary',
                  Spring: 'text-secondary',
                  Summer: 'text-accent',
                },
                activeTheme,
              )
            "
          >
            My Approach
          </h2>
          <q-separator color="primary" class="q-mb-md" />
          <p class="text-primary q-mb-none">
            Before I dive into code, I focus on understanding the vision behind the project. Every
            product has a story, and my role is to translate that story into an interface that feels
            intuitive, engaging, and alive.
          </p>
          <br />
          <q-separator></q-separator>
          <q-list bordered class="bg-primary">
            <div v-for="bullet in myApproachBullets" :key="bullet.id" :name="bullet.id">
              <q-expansion-item
                expand-separator
                :label="bullet.label"
                group="myApproach"
                header-class="bg-dark text-primary"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }} </q-item-section>
                </template>

                <q-card>
                  <q-card-section>
                    <p class="text-dark">{{ bullet.text }}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-separator></q-separator>
            </div>
          </q-list>
        </q-card-section>
        <q-card-section class="section-container q-pa-lg">
          <h2
            class="q-mt-none q-mb-xl text-center"
            :class="
              setSeasonClasses(
                {
                  Fall: 'text-secondary',
                  Winter: 'text-secondary',
                  Spring: 'text-secondary',
                  Summer: 'text-accent',
                },
                activeTheme,
              )
            "
          >
            Why Clients Work With Me
          </h2>
          <q-separator color="primary" class="q-mb-md" />
          <p class="text-primary q-mb-none">
            I know you’re not just looking for code — you’re looking for results. My clients come to
            me when they want their projects to stand out, attract attention, and deliver value
            quickly.
          </p>
          <br />
          <q-separator></q-separator>
          <q-list bordered class="bg-primary">
            <div v-for="bullet in whyClientsBullets" :key="bullet.id" :name="bullet.id">
              <q-expansion-item
                expand-separator
                :label="bullet.label"
                group="whyClientsWorkForMe"
                header-class="bg-dark text-primary"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="bullet.src" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section> {{ bullet.label }} </q-item-section>
                </template>

                <q-card>
                  <q-card-section>
                    <p class="text-dark">{{ bullet.text }}</p>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-separator></q-separator>
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import '../css/main.scss';
$winter-mobile-background: map-get($winter-theme, primary);

.mobile-view {
  @media (min-width: $breakpoint-md) {
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
        font-size: 3rem;
        margin-bottom: 2rem;
      }

      h2 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
        line-height: 1.4rem;

        .name {
          font-size: 1.2rem;
        }

        .years {
          font-size: 1.2rem;
        }

        .most-recently {
          text-shadow: 2px 2px 2px var(--q-dark);
          font-size: 1.3rem;
        }
      }
    }

    .section-container:nth-child(1) {
      border: solid 4px var(--q-primary);
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

  .q-card {
    background-color: transparent;

    .section-container {
      h1 {
        font-size: 3rem;
        border: solid 2px var(--q-primary);
      }

      h2 {
        font-size: 3rem;
      }

      h2:nth-child(2) {
        font-size: 2.5rem;
      }

      .bulletContent {
        opacity: 0;
      }

      .showContent {
        opacity: 1;
        transition: 1s;
      }
    }
  }
}

.winter-mobile-background {
  background-color: rgba($winter-mobile-background, $alpha: 0.8);

  @media (min-width: $breakpoint-md) {
    background-color: initial;
  }
}

.test {
  display: none;
}
</style>
