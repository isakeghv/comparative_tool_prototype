<template>
    <header class="header">
        <h1 class="header__headline font-heavy font-h3">Compara</h1>
        <p class="header__paragraph font-normal" v-if="name && !study.id">
            Welcome, <span class="header__span font-heavy">{{ name }}</span>!
        </p>
        <div class="header__container" v-if="study.id">
            <button class="header__button" @click="saveStudy()">
                <svg class="header__icon" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21.5 0.5H3.5C1.835 0.5 0.5 1.85 0.5 3.5V24.5C0.5 26.15 1.835 27.5 3.5 27.5H24.5C26.15 27.5 27.5 26.15 27.5 24.5V6.5L21.5 0.5ZM14 24.5C11.51 24.5 9.5 22.49 9.5 20C9.5 17.51 11.51 15.5 14 15.5C16.49 15.5 18.5 17.51 18.5 20C18.5 22.49 16.49 24.5 14 24.5ZM18.5 9.5H3.5V3.5H18.5V9.5Z"
                        fill="#3E3E3E" />
                </svg>

            </button>
            <button class="header__button">
                <svg class="header__icon" viewBox="0 0 36 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18 0C9.81818 0 2.83091 5.18333 0 12.5C2.83091 19.8167 9.81818 25 18 25C26.1818 25 33.1691 19.8167 36 12.5C33.1691 5.18333 26.1818 0 18 0ZM18 20.8333C13.4836 20.8333 9.81818 17.1 9.81818 12.5C9.81818 7.9 13.4836 4.16667 18 4.16667C22.5164 4.16667 26.1818 7.9 26.1818 12.5C26.1818 17.1 22.5164 20.8333 18 20.8333ZM18 7.5C15.2836 7.5 13.0909 9.73333 13.0909 12.5C13.0909 15.2667 15.2836 17.5 18 17.5C20.7164 17.5 22.9091 15.2667 22.9091 12.5C22.9091 9.73333 20.7164 7.5 18 7.5Z"
                        fill="#3E3E3E" />
                </svg>

            </button>
            <button class="header__button">
                <svg class="header__icon" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.42697 26C5.9176 26 5.49034 25.8287 5.14517 25.4862C4.8012 25.1449 4.62921 24.7216 4.62921 24.2161C4.62921 23.7107 4.8012 23.2873 5.14517 22.946C5.49034 22.6035 5.9176 22.4322 6.42697 22.4322H17.3933C19.2809 22.4322 20.921 21.8376 22.3137 20.6484C23.7076 19.4591 24.4045 17.9726 24.4045 16.1887C24.4045 14.4048 23.7076 12.9182 22.3137 11.729C20.921 10.5397 19.2809 9.94511 17.3933 9.94511H6.06742L9.48315 13.3345C9.81273 13.6615 9.97753 14.0778 9.97753 14.5832C9.97753 15.0886 9.81273 15.5049 9.48315 15.8319C9.15356 16.1589 8.73408 16.3225 8.22472 16.3225C7.71536 16.3225 7.29588 16.1589 6.96629 15.8319L0.494381 9.40995C0.314606 9.23156 0.186966 9.03831 0.11146 8.83019C0.0371532 8.62207 0 8.39908 0 8.16123C0 7.92338 0.0371532 7.7004 0.11146 7.49228C0.186966 7.28416 0.314606 7.09091 0.494381 6.91252L6.96629 0.490565C7.29588 0.163521 7.71536 0 8.22472 0C8.73408 0 9.15356 0.163521 9.48315 0.490565C9.81273 0.817609 9.97753 1.23385 9.97753 1.73928C9.97753 2.24471 9.81273 2.66095 9.48315 2.98799L6.06742 6.37736H17.3933C20.2996 6.37736 22.7943 7.31389 24.8773 9.18696C26.9591 11.06 28 13.3939 28 16.1887C28 18.9834 26.9591 21.3173 24.8773 23.1904C22.7943 25.0635 20.2996 26 17.3933 26H6.42697Z"
                        fill="#3E3E3E" />
                </svg>

            </button>
            <button class="header__button">
                <svg class="header__icon" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10.6067 26C7.70037 26 5.20629 25.0635 3.12449 23.1904C1.0415 21.3173 0 18.9834 0 16.1887C0 13.3939 1.0415 11.06 3.12449 9.18696C5.20629 7.31389 7.70037 6.37736 10.6067 6.37736H21.9326L18.5169 2.98799C18.1873 2.66095 18.0225 2.24471 18.0225 1.73928C18.0225 1.23385 18.1873 0.817609 18.5169 0.490565C18.8464 0.163521 19.2659 0 19.7753 0C20.2846 0 20.7041 0.163521 21.0337 0.490565L27.5056 6.91252C27.6854 7.09091 27.813 7.28416 27.8885 7.49228C27.9628 7.7004 28 7.92338 28 8.16123C28 8.39909 27.9628 8.62207 27.8885 8.83019C27.813 9.03831 27.6854 9.23156 27.5056 9.40995L21.0337 15.8319C20.7041 16.1589 20.2846 16.3225 19.7753 16.3225C19.2659 16.3225 18.8464 16.1589 18.5169 15.8319C18.1873 15.5049 18.0225 15.0886 18.0225 14.5832C18.0225 14.0778 18.1873 13.6615 18.5169 13.3345L21.9326 9.94511H10.6067C8.7191 9.94511 7.07895 10.5397 5.68629 11.729C4.29243 12.9182 3.59551 14.4048 3.59551 16.1887C3.59551 17.9726 4.29243 19.4591 5.68629 20.6484C7.07895 21.8376 8.7191 22.4322 10.6067 22.4322H21.573C22.0824 22.4322 22.5091 22.6035 22.853 22.946C23.1982 23.2873 23.3708 23.7107 23.3708 24.2161C23.3708 24.7216 23.1982 25.1449 22.853 25.4862C22.5091 25.8287 22.0824 26 21.573 26H10.6067Z"
                        fill="#3E3E3E" />
                </svg>

            </button>
            <button class="header__button">
                <svg class="header__icon" viewBox="0 0 36 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.42 9C3.42 5.922 5.922 3.42 9 3.42H16.2V0H9C4.032 0 0 4.032 0 9C0 13.968 4.032 18 9 18H16.2V14.58H9C5.922 14.58 3.42 12.078 3.42 9ZM10.8 10.8H25.2V7.2H10.8V10.8ZM27 0H19.8V3.42H27C30.078 3.42 32.58 5.922 32.58 9C32.58 12.078 30.078 14.58 27 14.58H19.8V18H27C31.968 18 36 13.968 36 9C36 4.032 31.968 0 27 0Z"
                        fill="#3E3E3E" />
                </svg>
            </button>
            <button class="header__publish font-semi font-small">Publish</button>
        </div>
    </header>
</template>

<script setup>
//importing reactive variable which holds the id of the study and where the study questions are stored
import { study, initialStudy } from '~/public/script/reactive';
const props = defineProps({
    name: String,
    id: String,
})
//Fix so the study is saved to the actual database as well
const saveStudy = () => {

    //saves it to "study.initial": 
    // - The "back" button prevents user from going back if the initial study-configuration is not
    //      similar to the current. Saving updates so the "initial" has the current setup, so the user can go back
    initialStudy.questions = JSON.parse(JSON.stringify(study.questions))
    initialStudy.demographicReq = JSON.parse(JSON.stringify(study.demographicReq))
    initialStudy.demographic = JSON.parse(JSON.stringify(study.demographic))
    initialStudy.description = JSON.parse(JSON.stringify(study.description))
    initialStudy.title = JSON.parse(JSON.stringify(study.title))
}

</script>

<style scoped>
@import url('public/style/components/header/dashboard-header.css');
</style>