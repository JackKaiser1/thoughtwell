<script setup lang="ts">
    import Page from './viewport/Page.vue';
    import { useLoosePageStore } from '../stores/loose-pages';
    import LoosePagesMode from './viewport/LoosePagesMode.vue';
    import Home from './viewport/Home.vue';
    import { useRoute } from 'vue-router';
    import NotebookContent from './viewport/NotebookContent.vue';
    import BreadCrumbs from './viewport/BreadCrumbs.vue';
    import ContextMenu from './viewport/ContextMenu.vue';
    import { onMounted, useTemplateRef, ref } from 'vue';

    const route = useRoute();
    const homeRoute = "/home";
    const loosePagesRoute = "/loosePages";
    const notebookContent = "/notebooks/content"

    const menu = useTemplateRef("contextMenu");

    
    onMounted(() => {
        console.log("done");
    });
</script>

<template>
    <div class="viewPortbackground" @contextmenu.prevent="menu?.showMenu($event)" @click="menu?.closeMenu()"> 

        <ContextMenu ref="contextMenu" v-show="menu?.isShone"/>
        <div class="breadCrumbsContainer">
            <BreadCrumbs />
        </div>
        

        <div class="contentContainer" >
            <Home v-if="route.fullPath === homeRoute"/>
            <LoosePagesMode v-else-if="route.fullPath === loosePagesRoute"/>
            <NotebookContent v-else-if="route.fullPath === notebookContent"/>
        </div>   
    </div>
</template>

<style>
    * {
        box-sizing: border-box;
    }

    .breadCrumbsContainer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
        height: 4rem;
    }

    .contentContainer {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        overflow-y: scroll;
    }

    .viewPortbackground {
        background-color: rgb(54, 54, 54);
        height: 100dvh;
        width: 93dvw;
    }
</style>