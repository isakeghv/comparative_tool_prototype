<template>
    <form @submit.prevent>
        <h1 class="font-h4">Sign in</h1>
            <label for="email" class="font-semi">Email</label><br>
        <div class="input__cont">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/></svg>
            <input type="email" v-model="email" id="email" placeholder="Enter email" class="font-normal input__field"><br>
        </div>
            <label for="pwd" class="font-semi">Password</label><br>
        <div class="input__cont">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/></svg>
            <input type="password" v-model="pwd" placeholder="Enter password" class="font-normal input__field"><br>
        </div>
        <div class="btn__cont">
            <input type="submit" value="Login" class="font-normal font-semi">
            <span>Don't have an account? <a href="">Sign up</a></span>
        </div>
</form>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const pwd = ref("");

</script>

<style scoped>
    @import url('public/style/components/login/login.css');
</style>