<script lang="ts" setup>
// import { ref } from 'vue';
import HeaderComponent from 'src/components/HeaderComponent.vue';

// const leftDrawerOpen = ref(false);
// const rightDrawerOpen = ref(false);
</script>

<template>
  <q-layout view="lHr Lpr lFr">
    <!-- HEADER -->

    <HeaderComponent></HeaderComponent>
    <!-- <q-btn flat dense icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>My App</q-toolbar-title>
        <q-btn flat dense icon="menu_open" @click="rightDrawerOpen = !rightDrawerOpen" /> -->

    <!-- <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-list>
        <q-item clickable>
          <q-item-section>Right Drawer</q-item-section>
        </q-item>
      </q-list>
    </q-drawer> -->

    <!-- PAGE CONTENT -->
    <q-page-container>
      <q-page padding> Your page content goes here. </q-page>
    </q-page-container>

    <!-- FOOTER -->
    <q-footer elevated>
      <q-toolbar>
        <q-toolbar-title>Footer</q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
