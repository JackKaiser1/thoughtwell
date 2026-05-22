<script setup lang="ts">
    import Page from './viewport/Page.vue';
    import { useLoosePageStore } from '../stores/loose-pages';


</script>

<template>
    <div class="viewPortbackground"> 
        <Page v-for="page in useLoosePageStore().loosePages" 
            :page-content="page.pageContent"
            :page-id="page.id"/> 
        
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