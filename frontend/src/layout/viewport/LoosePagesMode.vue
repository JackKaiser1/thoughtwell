<script setup lang="ts">
    import Page from "./Page.vue";
    import { useLoosePageStore } from '../../stores/loose-pages';
</script>

<template>
    <Page v-for="page in useLoosePageStore().loosePages" 
            :page-content="page.pageContent"
            :page-id="page.id"/> 
</template>

<style></style>