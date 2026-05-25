<script setup lang="ts">
    import Page from './viewport/Page.vue';
    import { useLoosePageStore } from '../stores/loose-pages';
    import LoosePagesMode from './viewport/LoosePagesMode.vue';
    import Home from './viewport/Home.vue';
    import { useRoute } from 'vue-router';
    import NotebookContent from './viewport/NotebookContent.vue';

    const route = useRoute();
    const homeRoute = "/home";
    const loosePagesRoute = "/loosePages";
    const notebookContent = "/notebooks/content"

</script>

<template>
    <div class="viewPortbackground"> 
        <Home v-if="route.fullPath === homeRoute"/>
        <LoosePagesMode v-else-if="route.fullPath === loosePagesRoute"/>
        <NotebookContent v-else-if="route.fullPath === notebookContent"/>
    </div>
</template>

<style>
    * {
        box-sizing: border-box;
    }

    .viewPortbackground {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        background-color: rgb(54, 54, 54);
        height: 100dvh;
        width: 93dvw;
        overflow-y: scroll;
    }
</style>