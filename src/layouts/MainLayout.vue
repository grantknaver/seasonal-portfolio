<script lang="ts" setup>
import HeaderComponent from 'src/components/HeaderComponent.vue';
</script>

<template>
  <q-layout class="bg-black" view="lHr Lpr lFr">
    <!-- HEADER -->

    <q-header class="text-black">
      <HeaderComponent></HeaderComponent>
    </q-header>

    <!-- PAGE CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER -->
    <q-footer elevated>
      <q-toolbar>
        <q-toolbar-title>Footer</q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style scoped lang="scss">
@import '../css/main.scss';
.q-header {
  background-color: rgba($color: black, $alpha: 0.5) !important;
  border-bottom: 2px solid var(--q-primary);

  @media (min-width: $breakpoint-sm) {
    display: none;
  }
}

.container {
  background-image: url('../assets/autumn-wisconsin.jpg');
  background-size: cover;
  background-position: 50% 50%;
  min-height: 100vh; /* or whatever size you want */
}
</style>
