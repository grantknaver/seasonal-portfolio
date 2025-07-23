<script lang="ts" setup>
const topics = [
  { name: 'home', icon: 'home', label: 'Home', href: '#home' },
  { name: 'about', icon: 'info', label: 'About', href: '#about' },
  { name: 'projects', icon: 'folder', label: 'Projects', href: '#projects' },
  { name: 'contact', icon: 'mail', label: 'Contact', href: '#contact' },
];
</script>

<template>
  <div class="container column items-center full-width">
    <img class="hidden q-pt-sm" style="max-width: 200px" src="../assets/logo.png" alt="" />

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
    <hr class="q-mt-lg" />
    <p class="q-ma-none text-primary text-center">Grant Knaver</p>
    <p class="q-ma-none text-secondary text-center">Fullstack Developer</p>
  </div>
</template>

<style scoped lang="scss">
.container {
  background-image: url('../assets/autumn-forestry.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  justify-content: center;

  @media (min-width: $breakpoint-sm) {
    border-bottom: 2px solid var(--q-primary);
  }

  @media (min-width: $breakpoint-md) {
    position: relative;
    min-height: 100vh;
    padding: initial;
  }

  img {
    position: absolute;
    top: 3%;
    left: 3%;
    @media (min-width: $breakpoint-xs) {
      display: initial !important;
    }
  }

  p {
    line-height: normal;
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

.container p:nth-of-type(1) {
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 2.2rem;
  text-transform: uppercase;
}

.container p:nth-of-type(2) {
  font-size: 1rem;
  color: var(--q-secondary);
}

.simon-circle {
  position: relative;
  border-radius: 10px;
  overflow: visible;

  @media (min-width: $breakpoint-xs) {
    display: initial !important;
    width: 350px;
    height: 350px;
    margin-top: 3%;
  }

  @media (min-width: $breakpoint-sm) {
    width: 375px;
    height: 375px;
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
