<script setup lang="ts">
    const props = defineProps({
        sketchId: String,
        sketchUrl: String,
    });

    const sketchUrl = props.sketchUrl;
    const sketchId = props.sketchId;

</script>

<template>
    <div class="sketchDisplay">
        <img :src="sketchUrl">
    </div>
</template>

<style>
    .sketchDisplay {
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
</style>