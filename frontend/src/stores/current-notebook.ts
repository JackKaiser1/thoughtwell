import type { NotebookContentResponse } from "@/types/response";
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export type CurrentNotebookObj = {
    notebookId?: string, 
    notebookName?: string
}

export const useCurrentNotebookStore = defineStore("currentNotebook", () => {
    const currentNotebookArray: Ref<CurrentNotebookObj[]> = ref([]);

    const currentNotebook: Ref<CurrentNotebookObj | undefined> = ref(currentNotebookArray.value[-1]);

    const currentNotebookContent: Ref<NotebookContentResponse> = ref({ pages: [], notebooks: [] });

    function setCurrentNotebook(notebook: CurrentNotebookObj) {
        currentNotebookArray.value.push(notebook);
        currentNotebook.value = currentNotebookArray.value[-1];
    }

    function openNotebook(content: NotebookContentResponse, notebook: CurrentNotebookObj) {
        currentNotebookContent.value = { pages: [], notebooks: [] };

        setCurrentNotebook(notebook)
        currentNotebookContent.value = content;
    }

    function clearCurrentNotebook() {
        currentNotebookArray.value = [];
        currentNotebook.value = undefined;
    }



    return { 
        currentNotebook, 
        currentNotebookArray, 
        currentNotebookContent, 
        setCurrentNotebook, 
        clearCurrentNotebook,
        openNotebook,
    };
});