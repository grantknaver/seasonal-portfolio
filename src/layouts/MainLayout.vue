<script lang="ts" setup>
import { ref } from 'vue';

const mobileMenu = ref(false);

const tabs = [
  { name: 'about', label: 'About', href: '#about' },
  { name: 'projects', label: 'Projects', href: '#projects' },
  { name: 'contact', label: 'Contact', href: '#contact' },
];
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="column">
    <!-- HEADER -->
    <q-header class="text-black">
      <q-toolbar class="bg-dark q-pa-lg">
        <!-- Logo / Title -->
        <q-toolbar-title>
          <img
            class="q-pt-sm"
            style="max-width: 200px"
            src="../assets/logo.png"
            alt="glkFreelance logo"
          />
        </q-toolbar-title>

        <!-- Mobile Menu Button -->
        <q-btn
          color="primary"
          class="menu-button"
          flat
          dense
          round
          icon="menu"
          @click="mobileMenu = !mobileMenu"
        />

        <!-- Mobile Drawer Menu -->
        <q-drawer v-model="mobileMenu" side="right" overlay behavior="mobile" bordered>
          <q-list>
            <q-item
              v-for="item in tabs"
              :key="item.name"
              class="text-dark"
              clickable
              @click="
                () => {
                  mobileMenu = false;
                }
              "
            >
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
            <hr />
            <q-item
              key="resume"
              clickable
              @click="
                () => {
                  mobileMenu = false;
                }
              "
            >
              <q-item-section class="text-bold text-secondary"> Download Resume</q-item-section>
            </q-item>
          </q-list>
        </q-drawer>
      </q-toolbar>
    </q-header>

    <!-- PAGE CONTAINER (Main content area that grows) -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER -->
    <q-footer>
      <q-toolbar class="bg-dark">
        <q-toolbar-title></q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

html,
body,
#q-app {
  height: 100%;
}

.q-header {
  background-color: rgba($color: black, $alpha: 0.5) !important;
  border-bottom: 2px solid var(--q-primary);

  @media (min-width: $breakpoint-sm) {
    display: none;
  }
}

.q-footer {
  border-top: 1px solid var(--q-primary);
}
</style>
