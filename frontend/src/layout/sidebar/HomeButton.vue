<script setup lang="ts">
    import { fetchTopLevelNotebooks } from '@/lib/fetch-top-level';

</script>

<template>
    <RouterLink to="/home">
        <img @click="fetchTopLevelNotebooks" class="homeButton" src="../../assets/sidebar/thoughtwell logo v2.png">
    </RouterLink>
</template>

<style>
    .homeButton {
        height: auto;
        width: 100%;
        padding: 12px;
        transition: transform 0.09s;
    }

    .homeButton:hover {
        transform: scale(1.15);
    }
</style>