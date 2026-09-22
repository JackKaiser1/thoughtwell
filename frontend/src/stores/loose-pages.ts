import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import { type PageResponse, type SketchMetaDataResponse } from "../types/response.js";

export const useLooseContentStore = defineStore("loosePages", () => {
    let loosePages: Ref<PageResponse[]> = ref([]);
    let looseSketches: Ref<SketchMetaDataResponse[]> = ref([]);

    function clearLoosePages() {
        loosePages.value = [];
        looseSketches.value = [];
    }

    return { loosePages, looseSketches, clearLoosePages};
});