<script setup lang="ts">
  import LayoutContainer from './LayoutContainer.vue';
  import Login from './Login.vue';
  import { ref, computed } from 'vue';
  import { useSessionStore } from './stores/session';

</script>

<template>
  <Login v-if="useSessionStore().isLoggedIn === false" />
  <LayoutContainer v-else/>
  <!-- <LayoutContainer/> -->
</template>

<style>
  body, html {
    margin: 0;
    padding: 0;
  }
</style>
