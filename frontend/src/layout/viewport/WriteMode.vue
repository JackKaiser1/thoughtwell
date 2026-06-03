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
            <button class="mainMenuButton writeNoteButton" type="button" @click="writeNote">Write Note</button>
        </form>
    </div>

</template>

<style>
    .writeModeTextArea {
        font-size: clamp(0.5rem, 0.5rem + 1dvw, 1rem);
        font-family: Arial, Helvetica, sans-serif;
        background-color: rgb(58, 58, 58);
        color: rgb(255, 255, 255);
        border: none;
        padding: 2rem;
        box-shadow: 2px 2px 3px rgb(34, 34, 34);
        width: 55dvw;

        transition: background-color 0.2s;
    }                   

        .writeModeTextArea:focus {
            background-color: rgb(73, 73, 73);
            outline: none;
        }   

        .writeModeTextArea::-webkit-scrollbar {
            background-color: inherit;
            width: 0px;
        }

    .writeModeLabel {
        color: white;
        font-size: 2rem;
    }

    .writeNoteButton {
        margin-top: 1rem;
    }

        .writeNoteButton:focus {
            background-color: rgb(87, 87, 87);
            outline: none;
        }
</style>