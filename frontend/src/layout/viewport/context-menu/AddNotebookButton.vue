<script setup lang="ts">
    import { ref } from 'vue';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';
    import { serverURL } from '@/constants';
    import { apiErrorHandler, printError } from '@/lib/errorHandler';
    import { type PageResponse } from '@/types/response';
    import { fetchNotebookContent } from '@/lib/fetchContent';

    const notebookName = ref("");
    const isClicked = ref(false);

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
            
            const currentNotebook = useCurrentNotebookStore().currentNotebook;
            if (currentNotebook !== undefined) {
                await fetchNotebookContent(currentNotebook);
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