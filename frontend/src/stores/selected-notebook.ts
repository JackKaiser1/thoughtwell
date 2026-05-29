import { defineStore } from "pinia";
import { ref } from "vue";

export const useSelectedNotebookStore = defineStore("selectedNotebook", () => {
    const selectedNotebook = ref("");

    function selectNotebook(notebookId: string) {
        selectedNotebook.value = notebookId;
        console.log(selectedNotebook.value);
    }

    function clearSelectedNotebook() {
        selectedNotebook.value = "";
    }

    return { selectedNotebook, 
             selectNotebook, 
             clearSelectedNotebook };
});