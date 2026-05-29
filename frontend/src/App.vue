<script setup lang="ts">
  import LayoutContainer from './LayoutContainer.vue';
  import Login from './Login.vue';
  import { ref, computed } from 'vue';
  import { useSessionStore } from './stores/session';

</script>

<template>
  <Login v-if="useSessionStore().isLoggedIn === false" />
  <LayoutContainer v-else/>
</template>

<style>
  body, html {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background-color: rgb(37, 37, 37);
  }

  .mainMenuButton {
        font-size: clamp(0.25rem, 0.25rem + 1vw, 1rem);
        color: white;
        background-color: rgb(74, 74, 74);
        border: none;
        box-shadow: 2px 2px 3px 1px rgb(36, 36, 36);
        padding: 0.3rem 0.5rem;
        border-radius: 1.8px;
        transition: background-color 0.09s;
    }
        .mainMenuButton:hover {
            background-color: rgb(94, 94, 94);
            
        }
</style>
