<script setup lang="ts">
    import { apiErrorHandler, printError } from '../../lib/errorHandler.js';
    import { serverURL } from '../../constants.js';
    import { type PageResponse } from "../../types/response.js";
    import { useLoosePageStore } from '@/stores/loose-pages.js';

    async function fetchLoosePages() {
        const url = `${serverURL}/api/loosePages`;

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

            const result: PageResponse[] = await response.json();
            console.log(result);

            useLoosePageStore().loosePages = result;

        } catch (err) {
            printError
        }
        
    }
</script>

<template>
    <img @click="fetchLoosePages" class="loosePagesButton" src="../../assets/sidebar/loose pages graphic.png">
</template>

<style>
    .loosePagesButton {
        height: auto;
        width: 100%;
        padding: 1rem;
        transition: transform 0.09s;
    }

    .loosePagesButton:hover {
        transform: scale(1.15);
    }

</style>