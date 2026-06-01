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
    <div class="loginBackground">
        <div class="containerLogin"> 
            <img src="./assets/thoughtwell full logo.png" class="logoFull">
                <form>
                    <label for="username" class="loginLabel">Username</label>
                    <br>
                    <input v-model="userName" 
                        type="text" 
                        name="username" 
                        id="username"
                        class="loginInput">
                    <br>
                    <label for="password" class="loginLabel">Password</label>
                    <br>
                    <input v-model="password" 
                        type="password" 
                        name="password" 
                        id="password"
                        autocomplete="off"
                        class="loginInput">
                    <br>
            
            
                </form>

                    <input type="button" 
                        id="loginButton" 
                        name="loginButton" 
                        value="Login" 
                        class="mainMenuButton mainMenuButton-login" 
                        @click="loginUser"></input>
                    <br>
                    <input type="button" 
                        id="createUserButton" 
                        name="createUserButton" 
                        value="Register" 
                        class="mainMenuButton mainMenuButton-login" 
                        @click="createUser">
        </div>
    </div>
</template>

<style>

    .loginLabel {
        color:white;
        font-size: clamp(0.5rem, 0.5rem + 1vw, 4rem);
    }

    .loginInput {
        color:rgb(0, 0, 0);
        font-size: clamp(0.5rem, 0.5rem + 1vw, 4rem);
        margin-bottom: 1rem;
        width: 100%;
    }

    .title {
        font-family:'Times New Roman', Times, serif;
        color: white;
        font-size: clamp(1.5rem, 1.5rem + 2vw, 4rem);
    }

    .containerLogin {
        background-color: rgb(43, 43, 43);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 40dvw;
        height: 80dvh;
        border-radius: 5px;
        box-shadow: 2px 2px 10px 1px rgb(29, 29, 29);
    }

    .loginBackground {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100dvw;
        height: 100dvh;
    }

    .mainMenuButton-login {
        width: 10dvw;
    }

    .logoFull {
        height: auto;
        width: 80%;
        margin-bottom: 2rem;
    }

</style>