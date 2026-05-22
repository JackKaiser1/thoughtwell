import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import { type PageResponse } from "../types/response.js";

export const useLoosePageStore = defineStore("loosePages", () => {
    let loosePages: Ref<PageResponse[]> = ref([]);

    function clearLoosePages() {
        loosePages.value = [];
    }

    return { loosePages, clearLoosePages};
});