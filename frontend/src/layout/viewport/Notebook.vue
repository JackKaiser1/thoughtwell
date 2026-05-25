<script setup lang="ts">
    import { ref } from "vue";

    const props = defineProps({
        notebookId: String,
        notebookName: String,
    });
    
    const name = props.notebookName;
    const notebookId = props.notebookId;
</script>

<template>
    <div class="notebook">
        <p>{{ name }}</p>
    </div>
</template>

<style>
    .notebook {
        background-color: rgb(23, 23, 23);
        color: rgb(255, 255, 255);
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