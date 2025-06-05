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
			<input type="email" name="email" v-model="email" id="login_email_inp" placeholder="Enter email" maxlength="99"
				class="font-normal form__input" required>
		</div>
		<label for="login_pwd_inp" class="form__label font-normal font-semi">Password</label>
		<div class="form__cont">
            <svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 -960 960 960">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
            </svg>
            <div class="form__cont form__cont--password">
                <svg xmlns="http://www.w3.org/2000/svg" class="form__svg" viewBox="0 0 24 2">
                    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
                </svg>
                <input
					:type="showPassword ? 'text' : 'password'"
					v-model="pwd" placeholder="Enter password"
					class="font-normal form__input"
					minlength="8"
					maxlength="99"
				/>
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
const email = ref("");
const pwd = ref("");

const loginStatus = ref("");
const statusMsg = ref("")

const emit = defineEmits(['toggle'])

// Toggle password visibility
const showPassword = ref(false);

const toggleSignup = (event) => {
	event.preventDefault();
	emit('toggle');
}


onMounted(() => {
  const containerId = 'turnstile-container';
  const el = document.getElementById(containerId);
  if (!el) return;


  const renderCaptcha = () => {
	window.turnstile?.render(`#${containerId}`, {
		sitekey: '0x4AAAAAABDiqhbcAnsx6S1V',
		theme: 'light'
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

const login = async () => {
	const token = document.querySelector('[name="cf-turnstile-response"]')?.value;
	if (!token) {
    loginStatus.value = "error";
    statusMsg.value = "CAPTCHA verification failed.";
	window.turnstile?.reset();
    return;
  }
	//calling backend function to login user
	const response = await fetch('/api/login', {
		method: 'POST',
		body: JSON.stringify({
			email: email.value,
			password: pwd.value,
			turnstileToken: token,
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
		window.turnstile?.reset();
	}
}
</script>

<style scoped>
	@import url('public/style/components/login/login.scss');
</style>