<script setup lang="ts">
    import { serverURL } from '../../constants.js';
    import { apiErrorHandler, printError } from '@/lib/errorHandler.js';
    import { type NotebookResponse } from '@/types/response.js';
    import { useTopLevelNotebooksStore } from '@/stores/top-level-notebooks.js';

    async function fetchTopLevelNotebooks() {
        const url = `${serverURL}/api/notebooks`;

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

            const result: NotebookResponse[] = await response.json();

            useTopLevelNotebooksStore().topLevelNotebooks = result;

        } catch (err) {
            printError(err);
        }
    }

</script>

<template>
    <RouterLink to="/home">
        <img @click="fetchTopLevelNotebooks" class="homeButton" src="../../assets/sidebar/thoughtwell logo.png">
    </RouterLink>
</template>

<style>
    .homeButton {
        height: auto;
        width: 100%;
        padding: 1rem;
    }
</style>