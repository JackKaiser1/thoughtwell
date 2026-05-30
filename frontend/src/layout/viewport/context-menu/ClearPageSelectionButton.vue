<script setup lang="ts">
    import { useSelectedPageStore } from '@/stores/selected-pages';

    function clearPages() {
        useSelectedPageStore().clearSelectedPages();
        console.log(useSelectedPageStore().selectedPages);
    }
</script>

<template>
        <button v-if="useSelectedPageStore().selectedPages.size"
            @click="clearPages()"
            class="contextMenuButton">Clear Page Selection</button>
</template>

<style></style>