<script setup lang="ts">
import ViewPort from './layout/ViewPort.vue';
import SideBar from './layout/SideBar.vue';

</script>

<template>
    <div class="containerLayout">
        <SideBar /> 
        <ViewPort />
    </div>

</template>

<style>
    .containerLayout {
        display: flex;
        justify-content: left;
        flex-direction: row;
        width: 100dvw;
        height: 100dvh;
    }

</style>