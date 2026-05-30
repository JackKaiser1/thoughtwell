<script setup lang="ts">
    import { useSelectedNotebookStore } from '@/stores/selected-notebook';
    import { computed } from 'vue';

    function clearNotebookSelection() {
        useSelectedNotebookStore().clearSelectedNotebook();
    }

    const isCurrentNotebookValid = computed(() => {
        return useSelectedNotebookStore().selectedNotebook !== "";
    });

</script>

<template>
        <button v-if="isCurrentNotebookValid"
            @click="clearNotebookSelection()" 
            class="contextMenuButton">Clear notebook selection</button>
</template>

<style></style>