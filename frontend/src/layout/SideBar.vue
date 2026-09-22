<script setup lang="ts">
    import HomeButton from './sidebar/HomeButton.vue';
    import LoosePagesButton from './sidebar/LoosePagesButton.vue';
    import ReadModeButton from './sidebar/ReadModeButton.vue';
    import UserOptions from './sidebar/UserOptions.vue';
    import WriteModeButton from './sidebar/WriteModeButton.vue';
    import SketchModeButton from './sidebar/SketchModeButton.vue';

</script>

<template>
    <div class="sideBarBackground">
        <HomeButton />
        <LoosePagesButton />
        <WriteModeButton />
        <SketchModeButton />
        <hr>
        <UserOptions />
    </div>
</template>

<style>
    .sideBarBackground {
        justify-content: left;
        flex-direction: column;
        display: flex;
        position: relative;
        background-color: rgb(43, 43, 43);
        width: 5dvw;
        height: 100dvh;
        box-shadow: 1px 1px 5px rgb(28, 28, 28);
    }
</style>