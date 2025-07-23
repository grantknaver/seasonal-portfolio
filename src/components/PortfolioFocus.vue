<script lang="ts" setup>
const topics = [
  { name: 'home', icon: 'home', label: 'Home', href: '#home' },
  { name: 'about', icon: 'info', label: 'About', href: '#about' },
  { name: 'projects', icon: 'folder', label: 'Projects', href: '#projects' },
  { name: 'contact', icon: 'mail', label: 'Contact', href: '#contact' },
];
</script>

<template>
  <div class="container column justify-start items-center full-width">
    <img class="hidden q-pt-sm" style="max-width: 200px" src="../assets/logo.png" alt="" />
    <!-- <h1 class="text-primary text-center q-mt-md q-mb-md">Grant Knaver</h1>
    <p class="text-secondary q-mb-md">Fullstack Developer</p>
    <hr />
    <a flat size="lg">Resume</a> -->
    <div class="simon-circle">
      <div v-for="topic in topics" :key="topic.name" class="quadrant-wrapper">
        <div :class="['simon-quadrant', topic.name]">
          <a :href="topic.href" class="simon-link">
            <q-icon :name="topic.icon" size="32px" />
            <q-tooltip anchor="center middle" self="top start">
              {{ topic.label }}
            </q-tooltip>
          </a>
        </div>
      </div>
      <div class="simon-center" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  background-image: url('../assets/autumn-forestry.jpg');
  background-size: cover;
  background-position: center;
  border-bottom: 4px solid var(--q-primary);
  padding-top: 5rem;
  min-height: calc(100vh - 94px);

  @media (min-width: $breakpoint-sm) {
    border-bottom: 2px solid var(--q-primary);
  }

  @media (min-width: $breakpoint-md) {
    position: relative;
    min-height: 100vh;
    padding: initial;
    justify-content: center;
  }

  img {
    position: absolute;
    top: 2%;
    left: 2%;
    @media (min-width: $breakpoint-md) {
      display: initial !important;
    }
  }

  h1 {
    font-size: 4.5rem;
    text-shadow: 2px 2px 5px var(--q-dark);

    @media (min-width: $breakpoint-md) {
      font-size: 6rem;
    }
  }

  p {
    font-size: 1.25rem;
    text-shadow: 2px 2px 2px var(--q-dark);

    @media (min-width: $breakpoint-md) {
      font-size: 1.5rem;
    }

    span {
      color: var(--q-secondary);
      font-size: 1.5rem;
    }
  }

  a {
    color: var(--q-primary);
    text-shadow: 2px 2px 5px var(--q-dark);
    font-size: 2rem;
    cursor: pointer;

    &:hover {
      text-shadow: 2px 2px 5px var(--q-accent);
    }
  }

  hr {
    background-color: var(--q-primary);
    width: 100px;
  }
}

.simon-circle {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: conic-gradient(
    rgba(0, 255, 0, 0.25) 0% 25%,
    rgba(255, 0, 0, 0.25) 25% 50%,
    rgba(255, 255, 0, 0.25) 50% 75%,
    rgba(0, 128, 255, 0.25) 75% 100%
  );
  backdrop-filter: blur(8px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
  margin: 3rem auto;
  padding: 10px; // allows quadrants to grow without clipping
}

.simon-quadrant {
  position: absolute;
  width: 50%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: transform 0.3s ease;
  transform-origin: center center;

  &:hover,
  &:focus-within {
    transform: scale(1.1);
    z-index: 2;
  }
}

.home {
  top: 0;
  left: 0;
}

.about {
  top: 0;
  right: 0;
}

.projects {
  bottom: 0;
  left: 0;
}

.contact {
  bottom: 0;
  right: 0;
}

.simon-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-shadow: 0 0 5px black;

  &:focus {
    outline: none;
  }
}

.simon-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: rgba(10, 10, 10, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  backdrop-filter: blur(6px);
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2);
}
</style>
