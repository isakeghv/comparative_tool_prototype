<template>
    <div class="wrapper">
        <header class="header">
        <span class="header__headline font-heavy font-h3">Compara</span>
        <div class="header__section">
            <button class="header__button header__button--fill font-normal font-semi" @click="selectForm('login')">
                Login
            </button>
            <button class="header__button header__button--outline font-normal font-semi"
                @click="selectForm('register')">
                Sign up
            </button>
        </div>
    </header>
    <div class="container">
        <register :formType="formType" v-if="selectedFormType" />
    </div>
    </div>
</template>

<script setup>
import register from './pages/register.vue';

const selectedFormType = ref(false);
const formType = ref('');

const selectForm = (type) => {
    formType.value = type;
    selectedFormType.value = true;
}

</script>

<style scoped>
@import url('public/style/pages/index/index.css');
</style>