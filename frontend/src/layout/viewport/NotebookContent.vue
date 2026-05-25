<script setup lang="ts">
    import { nextTick } from 'vue';
    import Notebook from './Notebook.vue';
    import Page from './Page.vue';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';

    
</script>

<template>


    <Notebook v-for="notebook in useCurrentNotebookStore().currentNotebookContent.notebooks" 
                    :notebook-name="notebook.notebookName"
                    :notebook-id="notebook.id"/>
    <Page v-for="page in useCurrentNotebookStore().currentNotebookContent.pages" 
                :page-content="page.pageContent"
                :page-id="page.id"/>
</template>

<style></style>