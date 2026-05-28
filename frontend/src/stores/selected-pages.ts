import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import { type PageResponse } from "@/types/response";

// export type SelectedPage = Pick<PageResponse, "pageContent" | "id">;

export const useSelectedPageStore = defineStore("selectedPages", () => {
    const selectedPages: Ref<Set<string>> = ref(new Set());

    function selectPage(pageId: string) {
        selectedPages.value.add(pageId);
    }

    function clearSelectedPages() {
        selectedPages.value = new Set;
    }

    return {
        selectedPages,
        selectPage,
        clearSelectedPages
    };
});