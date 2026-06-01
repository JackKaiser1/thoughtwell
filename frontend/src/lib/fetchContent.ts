import { homeRoute, notebookContentRoute, serverURL } from "@/constants";
import { apiErrorHandler, printError } from "./errorHandler";
import { type VisitedNotebook, useCurrentNotebookStore } from "@/stores/current-notebook";
import { type NotebookContentResponse } from "@/types/response";
import { useSelectedNotebookStore } from "@/stores/selected-notebook";
import { fetchTopLevelNotebooks } from "./fetch-top-level";
import { useRoute } from "vue-router";


export async function fetchNotebookContent(notebook: VisitedNotebook) {
        const url = `${serverURL}/api/notebooks/${notebook.notebookId}/children`;

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

            const result: NotebookContentResponse = await response.json();

            if (!notebook.notebookId || !notebook.notebookName) {
                throw new Error("Notebook invalid");
            }

            const visitedNotebooks = useCurrentNotebookStore().visitedNotebooksArray;
            if (visitedNotebooks.includes(notebook)) {
                useCurrentNotebookStore().revisitNotebook(result, notebook);
            } else {
                useCurrentNotebookStore().openNotebook(result, notebook);
            }

            useSelectedNotebookStore().clearSelectedNotebook();

        
        } catch (err) {
            printError(err);
        }
    }

export async function refreshNotebookContent() {
    const currentNotebook = useCurrentNotebookStore().currentNotebook;
    if (currentNotebook !== undefined) {
        await fetchNotebookContent(currentNotebook);
    } else {
        await fetchTopLevelNotebooks();
    } 

    console.log("Fetched Notebooks");

}
     