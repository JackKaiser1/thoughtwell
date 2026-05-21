<script setup lang="ts">
    import HomeButton from './sidebar/HomeButton.vue';
</script>

<template>
    <div class="sideBarBackground">
        <HomeButton />
        <hr>
    </div>
</template>

<style>
    * {
        box-sizing: border-box;
    }

    hr {
        color: white;
        width: 6dvw;

    }

    .sideBarBackground {
        justify-content: left;
        flex-direction: column;
        display: flex;
        position: relative;
        background-color: rgb(77, 77, 77);
        width: 7dvw;
        height: 100dvh;
    }
</style>