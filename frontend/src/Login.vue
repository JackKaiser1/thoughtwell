<script setup lang="ts">
    import { ref } from 'vue';
    import { type UserResponse } from "../src/types/response.js";
    import { serverURL } from "./constants.js";
    import { apiErrorHandler, printError } from './lib/errorHandler.js';

    const userName = ref("");
    const password = ref("");

    async function loginUser() {
        const url = `${serverURL}/api/login`;

        try {
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                    userName: userName.value,
                    password: password.value,
                }),
                headers: {
                    "Content-type": "application/json",
                }
            });

            if (!response.ok) {
                await apiErrorHandler(response);
                throw new Error;
            }

            const userRecord: UserResponse = await response.json();

            sessionStorage.setItem("userId", userRecord.id);
            sessionStorage.setItem("accessToken", userRecord.accessToken);
            sessionStorage.setItem("refreshToken", userRecord.refreshToken);

        } catch (err) {
            printError(err);
        }
    }
</script>

<template>
    
    <div class="container"> 
        <h1>ThoughtWell</h1>
        <form>
            <label for="username" >Username</label>
            <br>
            <input v-model="userName" type="text" name="username" id="username">
            <br>
            <label for="password">Password</label>
            <br>
            <input v-model="password" type="text" name="password" id="password">
            <br>
    
            <input type="button" id="loginButton" name="loginButton" value="Login" @click="loginUser"></input>
            <alert></alert>

            <input type="button" id="createUserButton" name="createUserButton" value="Register">
        </form>
    </div>
</template>

<style>

    label {
        color:white;
        font-size: clamp(0.5rem, 0.5rem + 1vw, 4rem);
    }

    input {
        color:rgb(0, 0, 0);
        font-size: clamp(0.5rem, 0.5rem + 1vw, 4rem);

    }

    h1 {
        color: white;
        background-color: transparent;
        font-size: clamp(1.5rem, 1.5rem + 2vw, 4rem);
    }
    .container {
        background-color: rgb(54, 54, 54);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100dvw;
        height: 100dvh;
    }

</style>