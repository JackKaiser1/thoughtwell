import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import { type NotebookResponse } from "../types/response.js";

export const useTopLevelNotebooksStore = defineStore("topLevelNotebooks", () => {
    const topLevelNotebooks: Ref<NotebookResponse[]> = ref([]);

    function clearTopLevelNotebooks() {
        topLevelNotebooks.value = [];
    }

    return { topLevelNotebooks, clearTopLevelNotebooks };
});