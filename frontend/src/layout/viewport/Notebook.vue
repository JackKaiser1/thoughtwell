<script setup lang="ts">
    import { notebookContentRoute } from "@/constants";
    import { fetchNotebookContent } from "@/lib/fetchContent.js";
    import { type VisitedNotebook } from "@/stores/current-notebook.js"
    import { useSelectedNotebookStore } from "@/stores/selected-notebook";
    import { computed } from "vue";


    const props = defineProps({
        notebookId: String,
        notebookName: String,
    });
    
    const name = props.notebookName;
    const notebookId = props.notebookId;

    const notebook: VisitedNotebook = { notebookId: notebookId, notebookName: name };

    const isNotebookSelected = computed(() => {
        if (notebookId) {
            return useSelectedNotebookStore().selectedNotebook === notebookId;
        }
    });

</script>

<template>
    <RouterLink :to="notebookContentRoute">
        <div @dblclick="fetchNotebookContent(notebook)" 
             @click="useSelectedNotebookStore().selectNotebook(notebookId as string)"
             class="notebook"
             :style="isNotebookSelected ? { borderColor: 'rgb(0, 128, 0)' } : { border: 'none' } ">
            <p>{{ name }}</p>   
        </div>
    </RouterLink>

</template>

<style>
    .notebook {
        background-color: rgb(23, 23, 23);
        color: rgb(255, 255, 255);
        font-size: 0.9rem;
        height: 13rem;
        width: 8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        margin: 1rem;
        border: none;
        border-width: 5px;
        border-style: solid;
        border-color: transparent;
    }
</style>