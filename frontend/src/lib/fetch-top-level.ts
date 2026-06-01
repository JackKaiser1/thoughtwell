    import { serverURL } from '@/constants.js';
    import { apiErrorHandler, printError } from '@/lib/errorHandler.js';
    import { type NotebookResponse } from '@/types/response.js';
    import { useTopLevelNotebooksStore } from '@/stores/top-level-notebooks.js';
    import { useCurrentNotebookStore } from '@/stores/current-notebook.js';

    export async function fetchTopLevelNotebooks() {
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

            resetCurrentNotebook();
            useTopLevelNotebooksStore().topLevelNotebooks = result;
            useCurrentNotebookStore().currentNotebookContent = { pages: [], notebooks: result };

        } catch (err) {
            printError(err);
        }
    }

    function resetCurrentNotebook() {
        useCurrentNotebookStore().clearCurrentNotebook();
    }