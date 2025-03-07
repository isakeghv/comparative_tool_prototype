<template>
    <form @submit.prevent="registerUser" class="form">
        <h2 class="form__headline font-h4">Create account</h2>
            <div v-if="registerStatus === 'success'" class="msg msg__success">
                <span class="msg__text font-small font-semi">{{ statusMsg }}</span>
            </div>
            <div v-else-if="registerStatus === 'error'" class="msg msg__error">
                <span class="msg__text font-small font-semi">{{ statusMsg }}</span>
            </div>
        <label for="register_nameFirst_inp" class="form__label font-semi">
            First name
        </label>
        <div class="form__cont">
            <svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
                <path
                    d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
            </svg>
            <input type="text" name="firstname" v-model="firstName" id="register_nameFirst_inp"
                placeholder="First name" pattern="[A-Za-z\s'\-]+" class="font-normal form__input" required>
        </div>
        <label for="register_nameLast_inp" class="form__label font-semi">
            Last name
        </label>
        <div class="form__cont">
            <svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
                <path
                    d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
            </svg>
            <input type="text" name="lastname" v-model="lastName" id="register_nameLast_inp"
                placeholder="Last name" pattern="[A-Za-z\s'\-]+" class="font-normal form__input" required>
        </div>
        <label for="register_email_inp" class="form__label font-semi">
            Email
        </label>
        <div class="form__cont">
            <svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
                <path
                    d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" />
            </svg>
            <input type="email" v-model="email" name="email" id="register_email_inp" placeholder="Enter email"
                class="font-normal form__input" required>
        </div>
        <label for="register_pwd_inp" class="form__label font-semi">
            Password
        </label>
        <div class="form__cont">
            <svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
                <path
                    d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
            </svg>
            <input type="password" name="password" v-model="pwd" id="register_pwd_inp" placeholder="Enter password"
                class="font-normal form__input" required>
        </div>
        <div class="form__cont">
            <input type="submit" value="Sign up" class="form__submit font-normal font-semi">
            <span class="form__span font-small">Already have an account?
                <button class="form__button font-small" @click="toggleSignin($event)">
                    Sign in
                </button>
            </span>
        </div>
    </form>
</template>

<script setup>
import { ref } from "vue";

const lastName = ref("");
const firstName = ref("")
const email = ref("");
const pwd = ref("");
// for the message modal
const registerStatus = ref("");
const statusMsg = ref("")

const emit = defineEmits(['toggle', 'userCreated'])

const toggleSignin = (event) => {
    event.preventDefault();
    emit('toggle');
}

//emits event which is used to inform user
const profileCreate = (successState, message)=>{
    emit('userCreated', {success: successState, message: message})
}

//function makes sure that the name has capital first letter
const nameToCapital = (input) =>{
    return input.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

}



const registerUser = async () => {

    const firstname = nameToCapital(firstName.value);
    const lastname = nameToCapital(lastName.value);

    //calling backend function to create user
    const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: email.value,
            password: pwd.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    //collecting response from backend
    const success = await response.json();

    // show status message that varies depending on the bool of success.created
    if (success.created) {
        registerStatus.value = 'success';
        statusMsg.value = success.message;


        //if account was succesfully created, it logs the user in automatically
        const loginRes = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email.value,
                password: pwd.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const login = await loginRes.json()

        if (login.isValid) location.reload();

        // get token from header, and store the value in localStorage
        // const token = loginRes.headers.get('Token');

        // if (token) localStorage.setItem('token', token);
        // if (token) console.log('Token has been set');

    } else {
        registerStatus.value = 'error';
        statusMsg.value = success.message
    }
    
    //returns from function to emit event which informs user with status and message
    return profileCreate(success.created, success.message);
}
</script>

<style scoped>
@import url('public/style/components/login/login.css');
</style>