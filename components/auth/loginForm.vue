<template>
	<form @submit.prevent="login" class="form">
		<h1 class="form__headline font-h4">Sign in</h1>
		<div v-if="loginStatus === 'success'" class="msg msg__success">
			<span class="msg__text msg__text--success font-small font-semi">{{ statusMsg }}</span>
		</div>
		<div v-else-if="loginStatus === 'error'" class="msg msg__error">
			<span class="msg__text msg__text--error font-small font-semi">{{ statusMsg }}</span>
		</div>
		<label for="login_email_inp" class="form__label font-normal font-semi">Email</label>
		<div class="form__cont">
			<svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
				<path
					d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" />
			</svg>
			<input type="email" name="email" v-model="email" id="login_email_inp" placeholder="Enter email"
				class="font-normal form__input" required>
		</div>
		<label for="login_pwd_inp" class="form__label font-normal font-semi">Password</label>
		<div class="form__cont">
			<svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
				<path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
			</svg>
			<input type="password" id="login_pwd_inp" name="password" v-model="pwd" placeholder="Enter password"
				class="font-normal form__input" required>
		</div>
		<div class="form__cont">
			<input type="submit" value="Login" class="form__submit font-normal font-semi">
			<span class="form__span font-small">Don't have an account?
				<button class="form__button font-small" @click="toggleSignup($event)">
					Sign up
				</button>
			</span>
		</div>
	</form>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const pwd = ref("");

const loginStatus = ref("");
const statusMsg = ref("")

const emit = defineEmits(['toggle'])

const toggleSignup = (event) => {
	event.preventDefault();
	emit('toggle');
}

const login = async () => {
	//calling backend function to login user
	const response = await fetch('/api/login', {
		method: 'POST',
		body: JSON.stringify({
			email: email.value,
			password: pwd.value
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	//collecting response from backend
	const success = await response.json();

	if (success.isValid) {
		loginStatus.value = 'success';
		statusMsg.value = success.message;
		location.reload();
	} else {
		loginStatus.value = 'error';
		statusMsg.value = success.message
	}
}
</script>

<style scoped>
	@import url('public/style/components/login/login.scss');
</style>