<script setup lang="ts">
    import { ref } from 'vue';

    const userName = ref("");
    const password = ref("");

    async function loginUser() {
        const url = "http://localhost:8080/api/login";

        const name = userName.value;
        const pass = password.value;

        const reqBody = JSON.stringify({
            userName: name,
            password: pass,
        });

        try {
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                body: reqBody,
            });

            if (!response.ok) {
                throw new Error(`${response.status}`);
            }

            const result = await response.json();
            console.log(result);
            return result;

        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
            else {
                console.log(`${err}`);
            }
        }
    }
</script>

<template>
    
    <div class="container"> 
        <h1>ThoughtWell</h1>
        <form>
            <label>Username</label>
            <br>
            <input v-model="userName">
            <br>
            <label>Password</label>
            <br>
            <input v-model="password">
            <br>
    
            <input type="button" id="loginButton" name="loginButton" value="Login" @click="loginUser"></input>

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