<script setup lang="ts">
    import { loosePagesRoute } from '@/constants.js';
    import { fetchLoosePages } from '@/lib/fetch-loose-pages';
</script>

<template>
    <RouterLink :to="loosePagesRoute">
        <img @click="fetchLoosePages" class="loosePagesButton" src="../../assets/sidebar/loose pages graphic.png">
    </RouterLink>

</template>

<style>
    .loosePagesButton {
        height: auto;
        width: 100%;
        padding: 12px;
        transition: transform 0.09s;
    }

    .loosePagesButton:hover {
        transform: scale(1.15);
    }

</style>