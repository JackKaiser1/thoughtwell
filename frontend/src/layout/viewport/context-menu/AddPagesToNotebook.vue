<script setup lang="ts">
    import { useSelectedPageStore } from '@/stores/selected-pages';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';
    import { ref } from 'vue';
    import { serverURL } from '@/constants';
    import { apiErrorHandler, printError } from '@/lib/errorHandler';
    import { type NotebookResponse } from '@/types/response';

    const isClicked = ref(false);

    function buttonClicked() {
        isClicked.value = true;
    }

    function unClicked() {
        isClicked.value = false;
    }

    defineExpose({ unClicked });

    async function addPagesToNotebook(selectedNotebook: NotebookResponse) {
        const url = `${serverURL}/api/notebooks/addPages`;

        try {
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                    typeOfChild: "pages",
                    childIds: [...useSelectedPageStore().selectedPages],
                    notebookId: selectedNotebook.id,
                    userId: sessionStorage.userId,
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.accessToken}`, 
                }
            });

            if (!response.ok) {
                apiErrorHandler(response);
                throw new Error;
            }

            useCurrentNotebookStore().refreshContent();
            useSelectedPageStore().clearSelectedPages();

        } catch (err){
            printError(err)
        }
    }

</script>

<template>
    <button @click="buttonClicked"
        v-if="!isClicked">Add pages to notebook</button>

    <div v-else>
        <button v-for="notebook in useCurrentNotebookStore().currentNotebookContent.notebooks"
            @click="addPagesToNotebook(notebook)">{{ notebook.notebookName }}</button>

    </div>

</template>

<style></style>