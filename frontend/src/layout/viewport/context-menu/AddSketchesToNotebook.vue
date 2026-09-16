<script setup lang="ts">
    import { useSelectedSketchStore } from '@/stores/selected-sketches';
    import { ref } from 'vue';
    import { serverURL } from '@/constants';
    import { apiErrorHandler, printError } from '@/lib/errorHandler';
    import { type NotebookResponse } from '@/types/response';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';

    const isClicked = ref(false);

    function buttonClicked() {
        isClicked.value = true;
    }

    function unClicked() {
        isClicked.value = false;
    }

    defineExpose({ unClicked });

    async function addSketchesToNotebook(selectedNotebook: NotebookResponse) {
        const url = `${serverURL}/api/notebooks/addSketches`;

        try {
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                    typeOfChild: "sketches",
                    childIds: [...useSelectedSketchStore().selectedSketches],
                    notebookId: selectedNotebook.id,
                    userId: sessionStorage.userId
                }),
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.accessToken}`, 
                }
            });

            if (!response.ok) {
                apiErrorHandler(response);
                throw new Error;
            }

            useCurrentNotebookStore().refreshContent();
            useSelectedSketchStore().clearSelectedSketches();

        } catch (err) {
            printError(err);
        }
    }

</script>

<template>
    <button class="contextMenuButton" @click="buttonClicked"
        v-if="!isClicked">Add sketches to notebook</button>

    <div v-else>
        <button v-for="notebook in useCurrentNotebookStore().currentNotebookContent.notebooks"
            class="contextMenuButton"
            @click="addSketchesToNotebook(notebook)">{{ notebook.notebookName }}</button>
    </div>

</template>

<style></style>