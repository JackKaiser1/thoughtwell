<script setup lang="ts">
    import { ref } from 'vue';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';
    import { homeRoute, notebookContentRoute, serverURL } from '@/constants';
    import { apiErrorHandler, printError } from '@/lib/errorHandler';
    import { type PageResponse } from '@/types/response';
    import { fetchNotebookContent, refreshNotebookContent } from '@/lib/fetchContent';
    import { fetchTopLevelNotebooks } from '@/lib/fetch-top-level';
    import { useRoute } from 'vue-router';

    const notebookName = ref("");
    const isClicked = ref(false);
    
    const route = useRoute();

    function buttonClicked() {
        isClicked.value = true;
    }

    function unClicked() {
        isClicked.value = false;
    }

    defineExpose({ unClicked });

    async function createNewNotebook() {
        const url = `${serverURL}/api/notebooks`;

        try {
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                    notebookName: notebookName.value,
                    parentNotebookId: useCurrentNotebookStore().currentNotebook?.notebookId,
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.accessToken}`,
                },
            });

            if (!response.ok) {
                apiErrorHandler(response);
                throw new Error;
            }
            
            if (route.fullPath === homeRoute || route.fullPath === notebookContentRoute) {
                await refreshNotebookContent();
            }

        } catch (err) {
            printError(err)
        }
    }
</script>

<template>
    <button class="contextMenuButton" 
        @click="buttonClicked"
        v-if="!isClicked">Add New Notebook</button>

    <div class="createNotebookMenu" v-else>
        <form class="createNotebookForm">
            <label class="contextMenuLabel">Notebook name</label>
            <br>
            <input class="notebookInput" type="text" v-model="notebookName">
            <br>
            <button type="button" class="contextMenuButton" @click="createNewNotebook">Create</button>
        </form>
    </div>
    
</template>

<style>
    .contextButton {
            border: none;
            background-color: rgb(26, 26, 26);
            color: white;
            margin: 0.2rem;
        }

        .contextButton:hover {
            background-color: rgb(47, 47, 47);
        }

    .createNotebookMenu {
        padding: 1rem;
        height: auto;
        width: auto;
        
    }

    .notebookInput {
        width: 9dvw;
        font-size: 1rem;
    }

    .contextMenuLabel {
        font-size: 1rem;
    }

    .createNotebookForm {
        height: auto;
        width: auto;
    }
    
</style>