<script setup lang="ts">
    import { useSelectedPageStore } from '@/stores/selected-pages';
    import { computed } from 'vue';
    import { serverURL } from '@/constants';
    import { apiErrorHandler, printError } from '@/lib/errorHandler';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';

    const isSinglePageSelected = computed(() => {
        return useSelectedPageStore().selectedPages.size === 1;
    });

    const pageToDelete = computed(() => {
        const pageId = [...useSelectedPageStore().selectedPages][0];
        if (pageId) {
            return pageId;
        } else {
            return "";
        }
    });

    async function deletePage(pageId: string) {
        const url = `${serverURL}/api/pages/${pageId}`;

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
            useSelectedPageStore().clearSelectedPages();

        } catch (err) {
            printError(err);
        }
    }
</script>

<template>
    <button v-if="isSinglePageSelected" 
        @click="deletePage(pageToDelete)"
        class="contextMenuButton">Delete page</button>
</template>

<style></style>