<script setup lang="ts">
    import { ref } from 'vue';
    import { serverURL } from '@/constants';
    import { printError } from '@/lib/errorHandler';
    import { useCurrentNotebookStore } from '@/stores/current-notebook';
    import { useCssModule } from 'vue';

    const note = ref("");

    async function writeNote() {
        const url = `${serverURL}/api/pages`;
        try {
            const response = await fetch(url, {
                method: "POST",
                mode: "cors", 
                body: JSON.stringify({
                    pageContent: note.value,
                    parentNotebookId: useCurrentNotebookStore().currentNotebook?.notebookId,
                }),
                headers: {
                    "Authorization": `Bearer ${sessionStorage.accessToken}`,
                    "Content-type": "application/json",
                }
            });

            await useCurrentNotebookStore().refreshContent();

            note.value = "";

        } catch (err) {
            printError(err);
        }
    }
</script>

<template>
    <div>
        <form>
            <textarea class="writeModeTextArea" v-model="note" rows="8" cols="80">{{note}}</textarea>
            <br>
            <button class="mainMenuButton" type="button" @click="writeNote">Write Note</button>
        </form>
    </div>

</template>

<style>
    .writeModeTextArea {
        font-size: 1rem;
        background-color: rgb(255, 255, 255);
        color: rgb(0, 0, 0);
        border: none;
        padding: 2rem;
    }                   

    .writeModeLabel {
        color: white;
        font-size: 2rem;
    }

    .writeNoteButton {
        background-color: rgb(123, 123, 123);
        border: none;
    }
</style>