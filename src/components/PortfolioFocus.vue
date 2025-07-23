<script lang="ts" setup>
const topics = [
  { name: 'home', icon: 'home', label: 'Home', href: '#home' },
  { name: 'about', icon: 'info', label: 'About', href: '#about' },
  { name: 'projects', icon: 'folder', label: 'Projects', href: '#projects' },
  { name: 'contact', icon: 'mail', label: 'Contact', href: '#contact' },
];
</script>

<template>
  <div class="container column justify-center items-center full-width">
    <img class="hidden q-pt-sm" style="max-width: 200px" src="../assets/logo.png" alt="" />
    <!-- <h1 class="text-primary text-center q-mt-md q-mb-md">Grant Knaver</h1>
    <p class="text-secondary q-mb-md">Fullstack Developer</p>
    <hr />
    <a flat size="lg">Resume</a> -->
    <div class="simon-circle hidden">
      <div
        v-for="topic in topics"
        :key="topic.name"
        :class="['simon-quadrant', topic.name]"
        tabindex="0"
        style="padding: 1rem"
      >
        <a :href="topic.href" class="simon-link">
          <q-icon :name="topic.icon" size="32px" />
          <q-tooltip anchor="center middle" self="top left">
            {{ topic.label }}
          </q-tooltip>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  background-image: url('../assets/autumn-forestry.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;

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
    @media (min-width: $breakpoint-xs) {
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
  border-radius: 10px;
  overflow: visible;

  @media (min-width: $breakpoint-xs) {
    display: initial !important;
    width: 350px;
    height: 350px;
  }
}

.simon-quadrant {
  position: absolute;
  width: 49%;
  height: 49%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  transform-origin: center;
  border-radius: 10px;
  border: solid 4px rgba($color: #f4e7e1, $alpha: 0.5);
  background-color: rgba($color: #521c0d, $alpha: 0.5);

  &:hover,
  &:focus-within {
    transform: scale(1.25);
    z-index: 1002;

    &.home {
      background-color: var(--q-accent);
    }

    &.about {
      background-color: var(--q-secondary);
    }

    &.projects {
      background-color: var(--q-accent);
    }

    &.contact {
      background-color: var(--q-secondary);
    }
  }

  &.home {
    top: 0;
    left: 0;
  }

  &.about {
    top: 0;
    right: 0;
  }

  &.projects {
    bottom: 0;
    left: 0;
  }

  &.contact {
    bottom: 0;
    right: 0;
  }
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

  &:hover {
    .q-icon {
      transform: scale(1.25);
      z-index: 5;
    }
  }
}
</style>
