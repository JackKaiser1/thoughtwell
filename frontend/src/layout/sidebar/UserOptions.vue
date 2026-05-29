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
        <p class="usernameSidebar">{{ username }} </p>

        <button type="button" class="logoutButton" @click="logoutUser">Logout</button>
        <br>
        <button type="button" @click="deleteUserClicked" v-if="!isClicked">Delete user</button>
        
        <div v-else>
            <button type="button" @click="deleteUser">Confirm</button>
            <button type="button" @click="deleteUserCanceled">Cancel</button>
        </div>
   </div>
</template>

<style>
    .userOptionsContainer {
        display: flex;
        align-content: center;
        flex-direction: column;
        align-items: center;
    }

    .usernameSidebar {
        font-size: clamp(0.25rem, 0.25rem + 1vw, 1rem);
        color: white;
        width: 60%;
        height: 1vh;
    }

    .logoutButton {
        font-size: clamp(0.25rem, 0.25rem + 1vw, 1rem);
        color: white;
        margin-top: 2rem;
        background-color: grey;
        border: none;
        padding: 0.3rem 0.5rem;
        border-radius: 0.05rem;
        transition: background-color 0.09s;
    }
        .logoutButton:hover {
            background-color: rgb(147, 147, 147);
            
        }
</style>