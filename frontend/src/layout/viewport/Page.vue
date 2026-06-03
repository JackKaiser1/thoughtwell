<script setup lang="ts">
    import { computed, ref, useTemplateRef } from "vue";
    import { useSelectedPageStore } from "@/stores/selected-pages";
    import { serverURL } from "@/constants";
    import { apiErrorHandler, printError } from "@/lib/errorHandler";

    const props = defineProps({
        pageId: String,
        pageContent: String,
    });
    
    const message = props.pageContent;
    const pageId = props.pageId;

    const readModeOn = ref(false);

    const read = useTemplateRef("read");

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

    function readPage() {
        readModeOn.value = !readModeOn.value;
        
    }

</script>

<template>
    <div class="page" 
        :style="isPageSelected ? { boxShadow: '3px 3px 15px 1px rgb(89, 90, 150)' } : { border: 'none' }"
        @click="select"
        @dblclick="readPage"
        v-if="!readModeOn">
        <p>{{ message }}</p>


        
    </div>

    <div class="readModeContainer" v-else ref="read">
        <div class="page-readMode"
            @dblclick="readPage">
            <p>{{ message }}</p>
        </div>
    </div>
</template>

<style>
    .page {
        background-color: white;
        font-family: 'Times New Roman', Times, serif;
        color: black;
        font-size: clamp(0.4rem, 0.6rem + 0.5dvw, 1rem);
        height: 19.5rem;
        width: 12rem;
        display: flex;
        justify-content: left;
        align-items: baseline;
        padding: 1rem;
        margin: 1rem;
        box-shadow: 3px 3px 5px rgb(11, 11, 11);
        overflow-y: scroll;
        text-wrap: balance;
        transition: box-shadow 0.18s;
        user-select: none;
    }


    .page::-webkit-scrollbar, .page-readMode::-webkit-scrollbar {
        width: 10px;
        background-color: rgb(255, 255, 255);
    }

    .readModeContainer {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        top: 40dvh;
    }

    @keyframes enlargeAnimation {
        from { height: 19.5rem; width: 12rem; }
        to { height: 30rem; width: 60rem; }
    }

    .page-readMode {
        background-color: white;
        font-family: 'Times New Roman', Times, serif;
        position: fixed;
        color: black;
        font-size: clamp(0.6rem, 0.8rem + 0.5dvw, 2rem);
        height: 30rem;
        width: 60rem;
        display: flex;
        justify-content: left;
        align-items: baseline;
        padding: 2rem;
        margin: 1rem;
        box-shadow: 100px 100px 500px 600px rgb(46, 46, 46);
        overflow-y: scroll;
        transition: box-shadow 10s;
        user-select: none;

        animation-name: enlargeAnimation;
        animation-duration: 0.5s;
    }
</style>