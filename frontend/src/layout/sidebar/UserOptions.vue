<script setup lang="ts">
    import { useLoosePageStore } from '@/stores/loose-pages.js';
    import { useSessionStore } from '../../stores/session.js';
    import { useTopLevelNotebooksStore } from '@/stores/top-level-notebooks.js';

    const username: string = sessionStorage.userName;

    function logoutUser() {
        useSessionStore().logoutSession();
        useLoosePageStore().clearLoosePages();
        useTopLevelNotebooksStore().clearTopLevelNotebooks();
        console.log(sessionStorage);
    }

</script>

<template>
   <div class="userOptionsContainer">
    <p class="usernameSidebar">{{ username }} </p>

    <button type="button" class="logoutButton" @click="logoutUser">Logout</button>
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