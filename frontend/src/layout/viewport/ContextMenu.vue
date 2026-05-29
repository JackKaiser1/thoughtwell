<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import AddNotebookButton from './context-menu/AddNotebookButton.vue';
    import ClearPageSelection from './context-menu/ClearPageSelectionButton.vue';
    import AddPagesToNotebook from './context-menu/AddPagesToNotebook.vue';

    const menuX = ref(0);
    const menuY = ref(0);
    const isShone = ref(false);

    const newNotebook = useTemplateRef("newNotebook");
    const addPagesToNotebook = useTemplateRef("addPagestoNotebook");

    function showMenu(event: MouseEvent) {
        isShone.value = true;
        menuX.value = event.clientX;
        menuY.value = event.clientY;
    }

    function closeMenu() {
        isShone.value = false;
        newNotebook.value?.unClicked();
        addPagesToNotebook.value?.unClicked();
    }

    defineExpose({
        showMenu,
        closeMenu,
        isShone,
    });

    
</script>

<template>
    <div class="contextMenu" :style="{ top: menuY + 'px', left: menuX + 'px' }">
        <AddNotebookButton ref="newNotebook"/>
        <br>
        <ClearPageSelection />
        <br>
        <AddPagesToNotebook ref="addPagestoNotebook"/>
    </div>
</template>

<style>
    .contextMenu {
        background-color: rgb(22, 22, 22);
        height: auto;
        width: 10rem;
        border-radius: 3px;
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        top: 0px;
        left: 0px;
        z-index: 10;
    }

    

</style>
