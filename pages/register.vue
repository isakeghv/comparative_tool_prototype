<template>
  <LoginForm v-if="!showRegisterForm" @toggle="toggleRegister('register')"/>
  <RegisterForm v-if="showRegisterForm" @toggle="toggleRegister('login')"/>
</template>

<script setup>
const props = defineProps({

  //in the initial index.vue page, when selecting "sign-up" or "sign-in" the "formType" will 
  // collect "register" or "login", pass it to this prop which will determine which form to display initially
  formType: String,
})

//used as boolean to determine which form to display
const showRegisterForm = ref(false);

//update boolean depending on parameter
const toggleRegister = (formtype) =>{
  if (formtype === 'register') return showRegisterForm.value = true;
  return showRegisterForm.value = false;
}

//calling function to determine which form to display when initiated
toggleRegister(props.formType);

//watching "formType" prop to update boolean if changing
watch(
  ()=> props.formType,
  (type)=> toggleRegister(type)
)