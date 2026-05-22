<script setup lang="ts">
    import Page from './viewport/Page.vue';

    const arr = ["1", "2", "3", "4","1", "2", "3", "4","1", "2", "3", "4","1", "2", "3", "4",]; 
</script>

<template>
    <div class="viewPortbackground"> 
        <Page v-for="num in arr" :page-content="num"/> 
        
    </div>
</template>

<style>
    * {
        box-sizing: border-box;
    }

    .viewPortbackground {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        background-color: rgb(54, 54, 54);
        height: 100dvh;
        width: 93dvw;
        overflow-y: scroll;
    }
</style>