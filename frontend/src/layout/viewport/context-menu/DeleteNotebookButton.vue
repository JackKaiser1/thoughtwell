<script setup lang="ts">
    import { computed } from 'vue';
    import { serverURL } from '@/constants';
    import { apiErrorHandler, printError } from '@/lib/errorHandler';
    import { useSelectedNotebookStore } from '@/stores/selected-notebook';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';

    const isCurrentNotebookValid = computed(() => {
        return useSelectedNotebookStore().selectedNotebook !== "";
    });

    async function deleteNotebook(notebookId: string) {
        const url = `${serverURL}/api/notebooks/${notebookId}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.accessToken}`, 
                }
            });

            if (!response.ok) {
                apiErrorHandler(response);
                throw new Error;
            }

            useCurrentNotebookStore().refreshContent();
            useSelectedNotebookStore().clearSelectedNotebook();

        } catch (err) {
            printError(err);
        }
    }
</script>

<template>
    <button v-if="isCurrentNotebookValid" @click="deleteNotebook(useSelectedNotebookStore().selectedNotebook)">Delete notebook</button>
</template>

<style></style>