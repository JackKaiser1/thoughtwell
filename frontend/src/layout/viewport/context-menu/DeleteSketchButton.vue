<script setup lang="ts">
    import { useSelectedSketchStore } from '@/stores/selected-sketches';
    import { computed } from 'vue';
    import { homeRoute, loosePagesRoute, notebookContentRoute, serverURL } from '@/constants';
    import { apiErrorHandler, printError } from '@/lib/errorHandler';
    import { refreshNotebookContent } from '@/lib/fetchContent';
    import { refreshLoosePages } from '@/lib/fetch-loose-pages';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    const isSingleSketchSelected = computed(() => {
        return useSelectedSketchStore().selectedSketches.size === 1;
    });

    const sketchToDelete = computed(() => {
        const sketchId = [...useSelectedSketchStore().selectedSketches][0];
        if (!sketchId) {
            return "";
        }
        return sketchId;
    });

    async function deleteSketch(sketchId: string) {
        const url = `${serverURL}/api/sketches/${sketchId}`;

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

            useSelectedSketchStore().clearSelectedSketches();

        } catch (err) {
            printError(err);
        }
    }

</script>

<template>
    <button v-if="isSingleSketchSelected" 
        @click="deleteSketch(sketchToDelete)"
        class="contextMenuButton">Delete sketch</button>
</template>

<style></style>