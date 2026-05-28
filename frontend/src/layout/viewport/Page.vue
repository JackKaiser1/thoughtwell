<script setup lang="ts">
    import { computed, ref } from "vue";
    import { useSelectedPageStore } from "@/stores/selected-pages";

    const props = defineProps({
        pageId: String,
        pageContent: String,
    });
    
    const message = props.pageContent;
    const pageId = props.pageId;

    function select() {
        if (pageId) {
            useSelectedPageStore().selectPage(pageId);
            console.log(useSelectedPageStore().selectedPages);
        }   
    }

    const isPageSelected = computed(() => {
        if (pageId) {
            return useSelectedPageStore().selectedPages.has(pageId);
        } else {
            return false;
        }
    });
</script>

<template>
    <div class="page" 
        :style="isPageSelected ? { borderColor: 'rgb(0, 128, 0)' } : { border: 'none' }"
        @click="select">
        <p>{{ message }}</p>
    </div>
</template>

<style>
    .page {
        background-color: white;
        color: black;
        font-size: 0.9rem;
        height: 13rem;
        width: 8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        margin: 1rem;
        border: none;
        border-width: 5px;
        border-style: solid;
    }
</style>