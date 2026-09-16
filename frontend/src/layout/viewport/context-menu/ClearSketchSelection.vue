<script setup lang="ts">
    import { useSelectedSketchStore } from '@/stores/selected-sketches';

    function clearSketchSelection() {
        useSelectedSketchStore().clearSelectedSketches();
        console.log(useSelectedSketchStore().selectedSketches);
    }
</script>

<template>
    <button v-if="useSelectedSketchStore().selectedSketches.size"
            @click="clearSketchSelection"
            class="contextMenuButton">Clear Sketch Selection</button>
</template>

<style></style>