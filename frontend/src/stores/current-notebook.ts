import type { NotebookContentResponse } from "@/types/response";
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import { fetchNotebookContent } from "@/lib/fetchContent";

export type VisitedNotebook = {
    notebookId?: string, 
    notebookName?: string
}

export const useCurrentNotebookStore = defineStore("currentNotebook", () => {
    const visitedNotebooksArray: Ref<VisitedNotebook[]> = ref([]);

    const currentNotebook: Ref<VisitedNotebook | undefined> = ref(visitedNotebooksArray.value[-1]);

    const currentNotebookContent: Ref<NotebookContentResponse> = ref({ pages: [], notebooks: [] });

    function setCurrentNotebook(notebook: VisitedNotebook) {
        currentNotebook.value = notebook;
    }

    function openNotebook(content: NotebookContentResponse, notebook: VisitedNotebook) {
        currentNotebookContent.value = { pages: [], notebooks: [] };

        vistNotebook(notebook);
        setCurrentNotebook(notebook);
        currentNotebookContent.value = content;
    }

    function vistNotebook(notebook: VisitedNotebook) {
        visitedNotebooksArray.value.push(notebook);
    }

    function revisitNotebook(content: NotebookContentResponse, notebook: VisitedNotebook) {
        const visited = visitedNotebooksArray.value;
        let notebookIndex = 0;
        for (let i = 0; i < visited.length; i++) {
            if (visited[i] === notebook) {
                notebookIndex = i;
            }
        }

        visitedNotebooksArray.value = visitedNotebooksArray.value.slice(0, notebookIndex + 1);
        setCurrentNotebook(notebook);
        currentNotebookContent.value = content;
    }

    function clearCurrentNotebook() {
        visitedNotebooksArray.value = [];
        currentNotebook.value = undefined;
    }



    return { 
        currentNotebook, 
        visitedNotebooksArray, 
        currentNotebookContent, 
        setCurrentNotebook, 
        clearCurrentNotebook,
        openNotebook,
        revisitNotebook,
    };
});