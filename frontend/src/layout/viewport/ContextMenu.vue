<script setup lang="ts">
    import { ref, useTemplateRef } from 'vue';
    import AddNotebookButton from './context-menu/AddNotebookButton.vue';
    import ClearPageSelection from './context-menu/ClearPageSelectionButton.vue';
    import AddPagesToNotebook from './context-menu/AddPagesToNotebook.vue';
    import DeletePageButton from './context-menu/DeletePageButton.vue';
    import DeleteNotebookButton from './context-menu/DeleteNotebookButton.vue';
import ClearNotebookSelectionButton from './context-menu/ClearNotebookSelectionButton.vue';

    const menuX = ref(0);
    const menuY = ref(0);
    const isShone = ref(false);

    const newNotebook = useTemplateRef("newNotebook");
    const addPagesToNotebook = useTemplateRef("addPagestoNotebook");

    function showMenu(event: MouseEvent) {
        isShone.value = !isShone.value;
        menuX.value = event.clientX;
        menuY.value = event.clientY;
    }

    function closeMenu() {
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
        <AddPagesToNotebook ref="addPagestoNotebook"/>
        <br>
        <ClearPageSelection />
        <br>
        <ClearNotebookSelectionButton />
        <br>
        <DeletePageButton />
        <br>
        <DeleteNotebookButton />
    </div>
</template>

<style>
    .contextMenu {
        background-color: rgb(20, 20, 20);
        height: auto;
        width: 10rem;
        border-radius: 1.8px;
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-shadow: 0px 0px 4px 1px rgb(33, 33, 33);
        top: 0px;
        left: 0px;
        z-index: 10;
    }

    .contextMenuButton {
        font-size: clamp(0.20rem, 0.20rem + 1vw, 0.8rem);
        color: white;
        background-color: inherit;
        border: none;
        box-shadow: 0px 0px 0px 0px rgb(40, 40, 40);
        padding: 0.3rem 0.5rem;
        transition: background-color 0.15s box-shadow 0.15s;
        width: 100%;
        height: 3rem;
        margin: 0;
    }

    .contextMenuButton:hover {
        background-color: rgb(30, 30, 30);
        box-shadow: 0px 0px 11px 3px rgba(66, 66, 66, 0.2);
    }
    

</style>
