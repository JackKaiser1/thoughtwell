<script setup lang="ts">
    import { sketchModeRoute } from '@/constants';
</script>

<template>
    <RouterLink :to="sketchModeRoute">
        <img class="sketchModeButton" src="../../assets/sidebar/sketch mode graphic.png">
    </RouterLink>
</template>

<style>
    .sketchModeButton {
        height: auto;
        width: 100%;
        padding: 12px;
        transition: transform 0.09s;
    }

    .sketchModeButton:hover {
        transform: scale(1.15);
    }

</style>