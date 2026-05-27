<script setup lang="ts">
import { writeModeRoute } from '@/constants';

</script>

<template>
    <RouterLink :to="writeModeRoute">
        <img class="writeModeButton" src="../../assets/sidebar/new page graphic.png">
    </RouterLink>
</template>

<style>
    .writeModeButton {
        height: auto;
        width: 100%;
        padding: 1rem;
    }
</style>