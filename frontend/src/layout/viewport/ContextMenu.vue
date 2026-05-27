<script setup lang="ts">
    import { ref } from 'vue';

    const menuX = ref(0);
    const menuY = ref(0);
    const isShone = ref(false);

    function showMenu(event: MouseEvent) {
        isShone.value = true;
        menuX.value = event.clientX;
        menuY.value = event.clientY;
    }

    function closeMenu() {
        isShone.value = false;
    }

    defineExpose({
        showMenu,
        closeMenu,
        isShone,
    });
</script>

<template>
    <div class="contextMenu" :style="{ top: menuY + 'px', left: menuX + 'px' }">
        <button class="contextButton">Add notebook</button>
    </div>
</template>

<style>
    .contextMenu {
        background-color: rgb(22, 22, 22);
        height: 10rem;
        width: 8rem;
        border-radius: 3px;
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0px;
        left: 0px;
        z-index: 10;
    }

    .contextButton {
        border: none;
        background-color: rgb(26, 26, 26);
        color: white;
        margin: 0.2rem;
    }

    .contextButton:hover {
        background-color: rgb(47, 47, 47);
    }

</style>
