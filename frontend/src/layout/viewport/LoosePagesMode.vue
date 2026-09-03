<script setup lang="ts">
    import Page from "./Page.vue";
    import SketchComponent from "./SketchComponent.vue";
    import { useLooseContentStore } from '../../stores/loose-pages';
</script>

<template>
    <!-- <p class="message">awdhawdhawhdahwd</p> -->
    <Page v-for="page in useLooseContentStore().loosePages" 
            :page-content="page.pageContent"
            :page-id="page.id"
            :key="page.id"/> 

    <SketchComponent v-for="sketch in useLooseContentStore().looseSketches"
            :sketch-id="sketch.id"
            :sketch-url="sketch.presignedURL"
            :key="sketch.id"/>
</template>

<style>
    .message {
        font-size: 2rem;
    }
</style>