<script setup lang="ts">
    import { ref } from "vue";
    import { serverURL } from "@/constants";
    import { apiErrorHandler, printError } from "@/lib/errorHandler";
    import { type NotebookContentResponse } from "@/types/response";
    import { useCurrentNotebookStore } from "@/stores/current-notebook";
    import { nextTick } from "vue";

    const props = defineProps({
        notebookId: String,
        notebookName: String,
    });
    
    const name = props.notebookName;
    const notebookId = props.notebookId;

    async function fetchNotebookContent() {
        const url = `${serverURL}/api/notebooks/${notebookId}/children`;

        try {
            const response = await fetch(url, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.accessToken}`
                }
            });

            if (!response.ok) {
                apiErrorHandler(response);
                throw new Error;
            }

            const result: NotebookContentResponse = await response.json();

            const currentNotebook = {notebookId: notebookId, notebookName: name};
            useCurrentNotebookStore().openNotebook(result, currentNotebook);
            console.log(useCurrentNotebookStore().currentNotebookContent);
            console.log(useCurrentNotebookStore().currentNotebookArray);

            

        } catch (err) {
            printError(err);
        }
    }
</script>

<template>
    <RouterLink to="/notebooks/content">
        <div @click="fetchNotebookContent" class="notebook">
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
    }
</style>