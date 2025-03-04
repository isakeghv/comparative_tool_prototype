<template>
	<form @submit.prevent="login" class="form">
		<h1 class="form__headline font-h4">Sign in</h1>
		<div v-if="loginStatus === 'success'" class="msg msg__success">
			<span class="msg__text font-small font-semi">{{ statusMsg }}</span>
		</div>
		<div v-else-if="loginStatus === 'error'" class="msg msg__error">
			<span class="msg__text font-small font-semi">{{ statusMsg }}</span>
		</div>
		<label for="login_email_inp" class="form__label font-semi">Email</label>
		<div class="form__cont">
			<svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
				<path
					d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" />
			</svg>
			<input type="email" name="email" v-model="email" id="login_email_inp" placeholder="Enter email"
				class="font-normal form__input" required>
		</div>
		<label for="login_pwd_inp" class="form__label font-semi">Password</label>
		<div class="form__cont">
			<svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
				<path
					d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
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

const loginUser = (successState, message) => {
	emit('userCreated', { success: successState, message: message })
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
	console.log(success);

	if (success.isValid) {
		loginStatus.value = 'success';
		statusMsg.value = success.message;
	} else {
		loginStatus.value = 'error';
		statusMsg.value = success.message
	}

	//returns from function to emit event which informs user with status and message
	return loginUser(success.isValid, success.message);
}
</script>

<style scoped>
	@import url('public/style/components/login/login.css');
</style>