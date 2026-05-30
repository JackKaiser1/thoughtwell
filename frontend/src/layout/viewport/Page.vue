<script setup lang="ts">
    import { computed, ref } from "vue";
    import { useSelectedPageStore } from "@/stores/selected-pages";
    import { serverURL } from "@/constants";
import { apiErrorHandler, printError } from "@/lib/errorHandler";

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
        :style="isPageSelected ? { boxShadow: '3px 3px 15px rgb(95, 95, 95)' } : { border: 'none' }"
        @click="select"
        >
        <p>{{ message }}</p>
    </div>
</template>

<style>
    .page {
        background-color: white;
        color: black;
        font-size: 0.9rem;
        height: 19.5rem;
        width: 12rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        margin: 1rem;
        box-shadow: 3px 3px 5px rgb(11, 11, 11);
        overflow-y: scroll;
    }

    .page::-webkit-scrollbar {
        width: 10px;
        background-color: rgb(255, 255, 255);
    }
</style>