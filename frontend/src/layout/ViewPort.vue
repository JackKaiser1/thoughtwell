<script setup lang="ts">
    import Page from './viewport/Page.vue';
    import { useLoosePageStore } from '../stores/loose-pages';
    import LoosePagesMode from './viewport/LoosePagesMode.vue';
    import Home from './viewport/Home.vue';
    import { useRoute } from 'vue-router';
    import NotebookContent from './viewport/NotebookContent.vue';
    import BreadCrumbs from './viewport/BreadCrumbs.vue';
    import ContextMenu from './viewport/ContextMenu.vue';
    import { onMounted, useTemplateRef, ref, computed } from 'vue';
    import WriteMode from './viewport/WriteMode.vue';
    import { homeRoute, loosePagesRoute, notebookContentRoute, writeModeRoute } from "@/constants";
    import { useSelectedPageStore } from '@/stores/selected-pages.ts';

    const route = useRoute();
    
    const menu = useTemplateRef("contextMenu");

    const contentMode = computed(() => {
        return route.fullPath === homeRoute || route.fullPath === loosePagesRoute || route.fullPath === notebookContentRoute;
    });
    
    onMounted(() => {
        console.log("done");
    });
</script>

<template>
    <div class="viewPortbackground" 
        @contextmenu.prevent="menu?.showMenu($event)" 
        @mousedown.right="menu?.closeMenu()"> 

        <ContextMenu ref="contextMenu" 
            v-show="menu?.isShone"/>

        <div class="breadCrumbsContainer">
            <BreadCrumbs />
        </div>
        

        <div class="contentContainer" v-if="contentMode">
            <Home v-if="route.fullPath === homeRoute"/>
            <LoosePagesMode v-else-if="route.fullPath === loosePagesRoute"/>
            <NotebookContent v-else-if="route.fullPath === notebookContentRoute"/>
        </div>   

        <div class="writeModeContainer" v-else>
            <WriteMode v-if="route.fullPath === writeModeRoute"/>
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
        margin-left: 2rem;
        height: 85dvh;
    }

        .contentContainer::-webkit-scrollbar {
            background-color: inherit;
        }

    .writeModeContainer {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .viewPortbackground {
        height: 100dvh;
        width: 93dvw;
    }
</style>