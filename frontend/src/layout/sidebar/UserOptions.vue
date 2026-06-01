<script setup lang="ts">
    import { useLoosePageStore } from '@/stores/loose-pages.js';
    import { useSessionStore } from '../../stores/session.js';
    import { useTopLevelNotebooksStore } from '@/stores/top-level-notebooks.js';
    import { useSelectedPageStore } from '@/stores/selected-pages.js';
    import { useSelectedNotebookStore } from '@/stores/selected-notebook.js';
    import { ref } from 'vue';
    import { serverURL } from '@/constants.js';
    import { apiErrorHandler, printError } from '@/lib/errorHandler.js';
    import { useCurrentNotebookStore } from '@/stores/current-notebook.js';

    const username: string = sessionStorage.userName;
    const isClicked = ref(false);

    function deleteUserClicked() {
        isClicked.value = true;
    }

    function deleteUserCanceled() {
        isClicked.value = false;
    }

    function logoutUser() {
        useSessionStore().logoutSession();
        useLoosePageStore().clearLoosePages();
        useTopLevelNotebooksStore().clearTopLevelNotebooks();
        useSelectedPageStore().clearSelectedPages();
        useSelectedNotebookStore().clearSelectedNotebook();
        useCurrentNotebookStore().clearCurrentNotebook();
    }

    async function deleteUser() {
        const url = `${serverURL}/api/users/${sessionStorage.userId}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "",
                    "Authorization": `Bearer ${sessionStorage.accessToken}`,
                }
            });

            if (!response.ok) {
                apiErrorHandler(response);
                throw new Error;
            }

            logoutUser();

        } catch (err) {
            printError(err);
        }
    }

</script>

<template>
   <div class="userOptionsContainer">
        

        <button type="button" class="sidebarButton" @click="logoutUser">Logout</button>
        <br>
        <button type="button" class="sidebarButton" @click="deleteUserClicked" v-if="!isClicked">Delete user</button>
        
        <div v-else>
            <button type="button" class="sidebarButton" @click="deleteUser">Confirm</button>
            <br>
            <br>
            <button type="button" class="sidebarButton" @click="deleteUserCanceled">Cancel</button>
        </div>
        <p class="usernameSidebar">{{ username }} </p>
   </div>
</template>

<style>
    .userOptionsContainer {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .usernameSidebar {
        font-size: clamp(0.25rem, 0.25rem + 1vw, 0.7rem);
        color: #ffffff66;
        width: 95%;
        height: 1vh;
        top: 95dvh;
        position: absolute;
        transition: color 0.09s;
    }

        .usernameSidebar:hover {
            color: #ffffff;
        }

    .deleteUserButton {
        font-size: 0.8rem;
    }

    .sidebarButton {
        font-size: clamp(0.20rem, 0.20rem + 1vw, 0.85rem);
        color: white;
        background-color: inherit;
        border: none;
        padding: 0.3rem 0.5rem;
        transition: background-color 0.09s;
        margin-top: 1rem;
        width: 100%;
    }

    .sidebarButton:hover {
        background-color: rgb(74, 74, 74);
    }
        

    
</style>