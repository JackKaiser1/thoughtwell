<script setup lang="ts">
    import { useSelectedPageStore } from '@/stores/selected-pages';
    import { computed } from 'vue';
    import { homeRoute, loosePagesRoute, notebookContentRoute, serverURL } from '@/constants';
    import { apiErrorHandler, printError } from '@/lib/errorHandler';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';
    import { refreshNotebookContent } from '@/lib/fetchContent';
    import { refreshLoosePages } from '@/lib/fetch-loose-pages';
    import { useRoute } from 'vue-router';

    const route = useRoute();

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

            if (route.fullPath === homeRoute || route.fullPath === notebookContentRoute) {
                await refreshNotebookContent();
            } 
            else if (route.fullPath === loosePagesRoute) {
                await refreshLoosePages();
            }

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