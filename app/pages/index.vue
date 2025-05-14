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
        <div class="container container--welcome" v-if="!selectedFormType">
            <div class="container__section">
                <h1 class="container__headline font-h1">
                    Comparative analysis for research-related artifacts
                </h1>
                <p class="container__paragraph font-normal">
                    A web-based analyzing tool to enable researchers
                    to set up experiments comparing different artifacts.
                </p>
                <button class="container__button font-semi font-normal" @click="selectForm('register')">Get
                    started</button>
            </div>
            <img :src="dashboardIcon" alt="research papers and enhancement glass" class="container__svg">
        </div>
        <div class="container" v-if="selectedFormType">
            <register v-if="selectedFormType" />
        </div>
    </div>
</template>

<script setup>
import dashboardIcon from '~/components/icons/dashboard-icon.svg'
import register from './register.vue';
import { form } from '~/public/script/reactive';

const selectedFormType = ref(false);

const selectForm = (type) => {
    form.type = type;
    selectedFormType.value = true;
}

</script>

<style scoped>
@import url('public/style/pages/index/index.scss');
</style>