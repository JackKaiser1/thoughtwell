<script setup lang="ts">
    import Notebook from './Notebook.vue';
    import { useTopLevelNotebooksStore } from '@/stores/top-level-notebooks';


</script>

<template>
    <Notebook v-for="notebook in useTopLevelNotebooksStore().topLevelNotebooks" 
                    :notebook-name="notebook.notebookName"
                    :notebook-id="notebook.id" 
                    :key="notebook.id"/>
</template>

<style></style>