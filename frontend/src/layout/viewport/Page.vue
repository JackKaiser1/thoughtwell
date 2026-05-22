<script setup lang="ts">
    import { ref } from "vue";

    const props = defineProps({
        pageId: String,
        pageContent: String,
    });
    
    const message = props.pageContent;
    const pageId = props.pageId;
</script>

<template>
    <div class="page">
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
    }
</style>