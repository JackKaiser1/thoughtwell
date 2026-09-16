import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export const useSelectedSketchStore = defineStore("selectedSketches", () => {
    const selectedSketches: Ref<Set<string>> = ref(new Set);

    function selectSketch(sketchId: string) {
        selectedSketches.value.add(sketchId);
    }

    function clearSelectedSketches() {
        selectedSketches.value = new Set;
    }

    return {
        selectedSketches,
        selectSketch,
        clearSelectedSketches
    }
});