<script setup lang="ts">
    import { useCurrentNotebookStore } from '@/stores/current-notebook';
    import { fetchNotebookContent } from '@/lib/fetchContent';
    import { notebookContentRoute } from '@/constants';
</script>

<template>
    <RouterLink :to="notebookContentRoute">
        <button v-for="notebook in useCurrentNotebookStore().visitedNotebooksArray"
            @click="fetchNotebookContent(notebook)"
            class="breadCrumbs"> {{ notebook.notebookName }} / </button>
    </RouterLink>

</template>

<style>
    .breadCrumbs {
        color: rgb(221, 221, 221);
        font-size: clamp(0.6rem, 0.6rem + 1vw, 1rem);
        padding: 10px;
        background-color: transparent;
        border: none;
        height: auto;
    }

        .breadCrumbs:hover {
            color: rgb(237, 237, 237);
        }
</style>