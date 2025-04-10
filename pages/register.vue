<template>
	<LoginForm v-if="!showRegisterForm" @toggle="form.type = 'register'" />
	<RegisterForm v-if="showRegisterForm" @toggle="form.type = 'login'" />
</template>

<script setup>
import { form } from "public/script/reactive";

const props = defineProps({
	//in the initial index.vue page, when selecting "sign-up" or "sign-in" the "formType" will
	// collect "register" or "login", pass it to this prop which will determine which form to display initially
	//formType: String,
});

//used as boolean to determine which form to display
const showRegisterForm = ref(false);

//update boolean depending on parameter
const toggleRegister = (formtype) => {
	form.type = formtype;
	if (formtype === "register") return (showRegisterForm.value = true);
	return (showRegisterForm.value = false);
};

toggleRegister(form.type);

//watching "formType" prop to update boolean if changing
watch(
	() => form.type,
	(type) => toggleRegister(type)
);
</script>
