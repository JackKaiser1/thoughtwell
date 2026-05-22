<script setup lang="ts">
    import { ref } from 'vue';
    import { type LoginUserResponse, type CreateUserResponse } from "../src/types/response.js";
    import { serverURL } from "./constants.js";
    import { apiErrorHandler, printError } from './lib/errorHandler.js';
    import { useSessionStore } from './stores/session.js';

    const userName = ref("");
    const password = ref("");

    async function sendUserData(url: string) {
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

        return response;
    }

    async function loginUser() {
        const url = `${serverURL}/api/login`;

        try {
            const response = await sendUserData(url);
            const userRecord: LoginUserResponse = await response.json();

            sessionStorage.setItem("userId", userRecord.id);
            sessionStorage.setItem("accessToken", userRecord.accessToken);
            sessionStorage.setItem("refreshToken", userRecord.refreshToken);
            sessionStorage.setItem("userName", userRecord.userName);

            useSessionStore().loginSession();
            console.log(sessionStorage);

        } catch (err) {
            printError(err);
        }
    }

    async function createUser() {
        const url = `${serverURL}/api/users`;

        try {
            const response = await sendUserData(url);
            const userRecord: CreateUserResponse = await response.json();

            console.log(userRecord);
            alert("User successfully created! Login to gain access");

        } catch (err) {
            printError(err);
        }
    }
</script>

<template>
    
    <div class="containerLogin"> 
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

            <input type="button" id="createUserButton" name="createUserButton" value="Register" @click="createUser">
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
    .containerLogin {
        background-color: rgb(54, 54, 54);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100dvw;
        height: 100dvh;
    }

</style>