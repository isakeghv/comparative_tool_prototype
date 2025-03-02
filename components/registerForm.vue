<template>
    <form @submit.prevent="registerUser">
        <h1 class="font-h4">Create account</h1>
            <label for="name" class="font-semi">Name</label><br>
        <div class="input__cont">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg>
            <input type="name" v-model="name" id="name" placeholder="Enter name" class="font-normal input__field"><br>
        </div>
            <label for="email" class="font-semi">Email</label><br>
        <div class="input__cont">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/></svg>
            <input type="email" v-model="email" id="email" placeholder="Enter email" class="font-normal input__field"><br>
        </div>
            <label for="pwd" class="font-semi">Password</label><br>
        <div class="input__cont">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/></svg>
            <input type="password" v-model="pwd" id="pwd" placeholder="Enter password" class="font-normal input__field"><br>
        </div>
        <div class="btn__cont">
            <input type="submit" value="Sign up" class="font-normal font-semi">
            <span>Already have an account? <a href="">Sign in</a></span>
        </div>
</form>
</template>

<script setup>
import { ref } from "vue";

const name = ref("");
const email = ref("");
const pwd = ref("");

const registerUser = async () => {
  const response = await fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify({
      name: name.value,
      email: email.value,
      password: pwd.value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  console.log(result);
}
</script>

<style scoped>
    @import url('public/style/components/login/login.css');
</style>