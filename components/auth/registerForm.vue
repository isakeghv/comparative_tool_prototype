<template>
    <form @submit.prevent="registerUser" class="form">
        <h2 class="form__headline font-h4">Create account</h2>
            <div v-if="registerStatus === 'success'" class="msg msg__success">
                <span class="msg__text msg__text--success font-small font-semi">{{ statusMsg }}</span>
            </div>
            <div v-else-if="registerStatus === 'error'" class="msg msg__error">
                <span class="msg__text msg__text--error font-small font-semi">{{ statusMsg }}</span>
            </div>
        <label for="register_nameFirst_inp" class="form__label font-normal font-semi">
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
        <label for="register_nameLast_inp" class="form__label font-normal font-semi">
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
        <label for="register_email_inp" class="form__label font-normal font-semi">
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
        <label for="register_pwd_inp" class="form__label font-normal font-semi">
            Password
        </label>
        <div class="form__cont">
            <svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
            </svg>
            <div class="form__cont form__cont--password">
                <svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 0 24 2">
                    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
                </svg>
                <input :type="showPassword ? 'text' : 'password'" v-model="pwd" placeholder="Enter password" class="font-normal form__input" required/>
                <button type="button" @click="showPassword = !showPassword" class="form__toggle-password">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="eye-icon">
                        <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                    </svg>
                    <div v-if="!showPassword" class="eye-slash-line"></div>
                </button>
            </div>
        </div>
            <div class="form__cont">
                <div id="turnstile-container"></div>
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
import { onMounted} from "vue";

const lastName = ref("");
const firstName = ref("")
const email = ref("");
const pwd = ref("");
const showPassword = ref(false);
// for the message modal
const registerStatus = ref("");
const statusMsg = ref("")


onMounted(() => {
  const containerId = 'turnstile-container';
  const el = document.getElementById(containerId);
  if (!el) return;


  const renderCaptcha = () => {
    window.turnstile?.render(`#${containerId}`, {
      sitekey: '0x4AAAAAABDiqhbcAnsx6S1V',
      theme: 'auto'
    });
  };

  if (!window.turnstile) {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = renderCaptcha;
  } else {
    renderCaptcha();
  }
});


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
    const token = document.querySelector('[name="cf-turnstile-response"]')?.value;

  if (!token) {
    registerStatus.value = 'error';
    statusMsg.value = 'CAPTCHA verification failed.';
    return;
  }

    //calling backend function to create user
    const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            email: email.value,
            password: pwd.value,
            turnstileToken: token
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
@import url('public/style/components/login/login.scss');
</style>