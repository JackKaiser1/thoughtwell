<script setup lang="ts">
    import HomeButton from './sidebar/HomeButton.vue';
    import LoosePagesButton from './sidebar/LoosePagesButton.vue';
    import ReadModeButton from './sidebar/ReadModeButton.vue';
    import UserOptions from './sidebar/UserOptions.vue';
    import WriteModeButton from './sidebar/WriteModeButton.vue';

</script>

<template>
    <div class="sideBarBackground">
        <HomeButton />
        <hr>
        <LoosePagesButton />
        <WriteModeButton />
        <hr>
        <UserOptions />
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
        background-color: rgb(43, 43, 43);
        width: 7dvw;
        height: 100dvh;
        /* border-right: 3px rgb(56, 56, 56) solid; */
        box-shadow: 1px 1px 5px rgb(28, 28, 28);
    }
</style>