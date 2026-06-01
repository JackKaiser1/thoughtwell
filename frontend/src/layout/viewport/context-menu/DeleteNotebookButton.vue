<script setup lang="ts">
    import { computed } from 'vue';
    import { serverURL } from '@/constants';
    import { apiErrorHandler, printError } from '@/lib/errorHandler';
    import { useSelectedNotebookStore } from '@/stores/selected-notebook';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';
    import { fetchNotebookContent, refreshNotebookContent } from '@/lib/fetchContent';
    import { fetchTopLevelNotebooks } from '@/lib/fetch-top-level';
    import { useRoute } from 'vue-router';
    import { homeRoute, notebookContentRoute } from '@/constants';

    const route = useRoute();

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

            if (route.fullPath === homeRoute || route.fullPath === notebookContentRoute) {
                await refreshNotebookContent();
            }

            useSelectedNotebookStore().clearSelectedNotebook();

        } catch (err) {
            printError(err);
        }
    }
</script>

<template>
    <button v-if="isCurrentNotebookValid" 
        @click="deleteNotebook(useSelectedNotebookStore().selectedNotebook)"
        class="contextMenuButton">Delete notebook</button>
</template>

<style></style>